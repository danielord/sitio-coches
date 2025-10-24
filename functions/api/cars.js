export function onRequestGet(context) {
  return context.env.DB.prepare('SELECT * FROM cars ORDER BY created_at DESC')
    .all()
    .then(function(result) {
      return new Response(JSON.stringify({ cars: result.results }), {
        headers: { 'Content-Type': 'application/json' }
      })
    })
    .catch(function(error) {
      return new Response(JSON.stringify({ error: 'Error fetching cars' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    })
}

export function onRequestPost(context) {
  return context.request.json()
    .then(function(carData) {
      var carId = 'car-' + Date.now()
      var vendedor = carData.vendedor || {}
      
      return context.env.DB.prepare(
        'INSERT INTO cars (id, marca, modelo, año, precio, kilometraje, combustible, transmision, color, descripcion, imagen, imagenes, vendedor_nombre, vendedor_telefono, vendedor_email, en_slideshow, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
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
        vendedor.nombre || 'Usuario V&R',
        vendedor.telefono || '+52 55 1234 5678',
        vendedor.email || 'demo@vrautos.com',
        carData.enSlideshow || false,
        new Date().toISOString()
      ).run()
      .then(function() {
        var responseData = {
          car: {
            id: carId,
            marca: carData.marca,
            modelo: carData.modelo,
            año: carData.año,
            precio: carData.precio,
            fechaCreacion: new Date().toISOString()
          }
        }
        return new Response(JSON.stringify(responseData), {
          headers: { 'Content-Type': 'application/json' }
        })
      })
    })
    .catch(function(error) {
      return new Response(JSON.stringify({ error: 'Error creating car' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    })
}