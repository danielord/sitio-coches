import { NextRequest, NextResponse } from 'next/server'

// Función para obtener D1 binding
function getD1() {
  // En Cloudflare Pages, D1 está disponible en el contexto
  return (globalThis as any).DB || null
}

export async function GET() {
  try {
    const db = getD1()
    
    if (db) {
      // Usar D1 real
      const { results } = await db.prepare(`
        SELECT id, marca, modelo, año, precio, kilometraje, combustible, 
               transmision, color, descripcion, imagen, imagenes,
               vendedor_nombre, vendedor_telefono, vendedor_email,
               en_slideshow, created_at
        FROM cars 
        ORDER BY created_at DESC
      `).all()
      
      const cars = results.map((car: any) => ({
        id: car.id,
        marca: car.marca,
        modelo: car.modelo,
        año: car.año,
        precio: car.precio,
        kilometraje: car.kilometraje,
        combustible: car.combustible,
        transmision: car.transmision,
        color: car.color,
        descripcion: car.descripcion,
        imagen: car.imagen,
        imagenes: car.imagenes ? JSON.parse(car.imagenes) : [],
        vendedor: {
          nombre: car.vendedor_nombre,
          telefono: car.vendedor_telefono,
          email: car.vendedor_email
        },
        fechaCreacion: car.created_at,
        enSlideshow: car.en_slideshow
      }))
      
      return NextResponse.json({ cars })
    }
    
    // Fallback a datos demo si D1 no está disponible
    const demoCars = [
      {
        id: 'demo-car-1',
        marca: 'Toyota',
        modelo: 'Corolla',
        año: 2020,
        precio: 280000,
        kilometraje: 45000,
        combustible: 'Gasolina',
        transmision: 'Automática',
        color: 'Blanco',
        descripcion: 'Excelente estado, mantenimiento al día',
        imagen: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
        vendedor: {
          nombre: 'Demo V&R',
          telefono: '+52 55 1234 5678',
          email: 'demo@vrautos.com'
        },
        fechaCreacion: new Date().toISOString(),
        enSlideshow: false
      }
    ]
    
    return NextResponse.json({ cars: demoCars })
    
  } catch (error) {
    console.error('Error fetching cars:', error)
    return NextResponse.json({ error: 'Error fetching cars' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const carData = await request.json()
    const db = getD1()
    
    if (db) {
      const carId = `car-${Date.now()}`
      
      await db.prepare(`
        INSERT INTO cars (
          id, marca, modelo, año, precio, kilometraje, combustible,
          transmision, color, descripcion, imagen, imagenes,
          vendedor_id, vendedor_nombre, vendedor_telefono, vendedor_email,
          en_slideshow
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
        carData.vendedor?.id || 'demo-user',
        carData.vendedor?.nombre || 'Usuario V&R',
        carData.vendedor?.telefono || '+52 55 1234 5678',
        carData.vendedor?.email || 'demo@vrautos.com',
        carData.enSlideshow || false
      ).run()
      
      return NextResponse.json({ 
        car: { 
          id: carId, 
          ...carData, 
          fechaCreacion: new Date().toISOString() 
        } 
      })
    }
    
    // Fallback si D1 no está disponible
    return NextResponse.json({ 
      car: { 
        id: `car-${Date.now()}`, 
        ...carData, 
        fechaCreacion: new Date().toISOString() 
      } 
    })
    
  } catch (error) {
    console.error('Error creating car:', error)
    return NextResponse.json({ error: 'Error creating car' }, { status: 500 })
  }
}