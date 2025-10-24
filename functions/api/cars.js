export async function onRequestGet(context) {
  try {
    const { results } = await context.env.DB.prepare(`
      SELECT * FROM cars ORDER BY created_at DESC
    `).all()
    
    return Response.json({ cars: results })
  } catch (error) {
    return Response.json({ error: 'Error fetching cars' }, { status: 500 })
  }
}

export async function onRequestPost(context) {
  try {
    const carData = await context.request.json()
    const carId = `car-${Date.now()}`
    
    await context.env.DB.prepare(`
      INSERT INTO cars (
        id, marca, modelo, año, precio, kilometraje, combustible,
        transmision, color, descripcion, imagen, imagenes,
        vendedor_nombre, vendedor_telefono, vendedor_email,
        en_slideshow, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      carId,
      carData.marca,
      carData.modelo,
      carData.año,
      carData.precio,
      carData.kilometraje,
      carData.combustible,
      carData.transmision,
      carData.color,
      carData.descripcion,
      carData.imagen,
      JSON.stringify(carData.imagenes || []),
      carData.vendedor?.nombre || 'Usuario V&R',
      carData.vendedor?.telefono || '+52 55 1234 5678',
      carData.vendedor?.email || 'demo@vrautos.com',
      carData.enSlideshow || false,
      new Date().toISOString()
    ).run()
    
    return Response.json({ 
      car: { id: carId, ...carData, fechaCreacion: new Date().toISOString() } 
    })
  } catch (error) {
    return Response.json({ error: 'Error creating car' }, { status: 500 })
  }
}