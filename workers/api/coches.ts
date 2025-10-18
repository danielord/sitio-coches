import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

export const coches = new Hono<{ Bindings: Bindings }>()

// GET /api/coches
coches.get('/', async (c) => {
  try {
    const { marca, precioMax, añoMin } = c.req.query()
    
    let query = `
      SELECT c.*, v.nombre as vendedor_nombre, v.telefono as vendedor_telefono 
      FROM coches c 
      JOIN vendedores v ON c.vendedorId = v.id 
      WHERE c.activo = 1
    `
    const params: any[] = []
    
    if (marca) {
      query += ` AND c.marca LIKE ?`
      params.push(`%${marca}%`)
    }
    if (precioMax) {
      query += ` AND c.precio <= ?`
      params.push(parseFloat(precioMax))
    }
    if (añoMin) {
      query += ` AND c.año >= ?`
      params.push(parseInt(añoMin))
    }
    
    query += ` ORDER BY c.fechaCreacion DESC`
    
    const { results } = await c.env.DB.prepare(query).bind(...params).all()
    
    const cochesFormatted = results.map((row: any) => ({
      ...row,
      imagenes: row.imagenes ? JSON.parse(row.imagenes) : [],
      vendedor: {
        nombre: row.vendedor_nombre,
        telefono: row.vendedor_telefono
      }
    }))
    
    return c.json(cochesFormatted)
  } catch (error) {
    return c.json({ error: 'Error fetching coches' }, 500)
  }
})

// POST /api/coches
coches.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const id = crypto.randomUUID()
    
    await c.env.DB.prepare(`
      INSERT INTO coches (id, marca, modelo, año, precio, kilometraje, combustible, transmision, color, descripcion, imagenes, vendedorId)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      body.marca,
      body.modelo,
      body.año,
      body.precio,
      body.kilometraje,
      body.combustible,
      body.transmision,
      body.color,
      body.descripcion,
      JSON.stringify(body.imagenes || []),
      body.vendedorId
    ).run()
    
    return c.json({ id, ...body }, 201)
  } catch (error) {
    return c.json({ error: 'Error creating coche' }, 500)
  }
})

// GET /api/coches/:id
coches.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    
    const { results } = await c.env.DB.prepare(`
      SELECT c.*, v.nombre as vendedor_nombre, v.telefono as vendedor_telefono, v.email as vendedor_email
      FROM coches c 
      JOIN vendedores v ON c.vendedorId = v.id 
      WHERE c.id = ? AND c.activo = 1
    `).bind(id).all()
    
    if (results.length === 0) {
      return c.json({ error: 'Coche not found' }, 404)
    }
    
    const coche = results[0] as any
    const cocheFormatted = {
      ...coche,
      imagenes: coche.imagenes ? JSON.parse(coche.imagenes) : [],
      vendedor: {
        nombre: coche.vendedor_nombre,
        telefono: coche.vendedor_telefono,
        email: coche.vendedor_email
      }
    }
    
    return c.json(cocheFormatted)
  } catch (error) {
    return c.json({ error: 'Error fetching coche' }, 500)
  }
})