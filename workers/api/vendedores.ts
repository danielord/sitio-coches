import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

export const vendedores = new Hono<{ Bindings: Bindings }>()

// GET /api/vendedores
vendedores.get('/', async (c) => {
  try {
    const email = c.req.query('email')
    
    if (email) {
      const { results } = await c.env.DB.prepare(`
        SELECT id, nombre, email, telefono, fechaRegistro 
        FROM vendedores 
        WHERE email = ?
      `).bind(email).all()
      
      return c.json(results)
    }
    
    const { results } = await c.env.DB.prepare(`
      SELECT id, nombre, email, telefono, fechaRegistro 
      FROM vendedores 
      ORDER BY fechaRegistro DESC
    `).all()
    
    return c.json(results)
  } catch (error) {
    return c.json({ error: 'Error fetching vendedores' }, 500)
  }
})

// POST /api/vendedores
vendedores.post('/', async (c) => {
  try {
    const body = await c.req.json()
    const id = crypto.randomUUID()
    
    await c.env.DB.prepare(`
      INSERT INTO vendedores (id, nombre, email, telefono, password)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      id,
      body.nombre,
      body.email,
      body.telefono,
      body.password
    ).run()
    
    return c.json({ 
      id, 
      nombre: body.nombre, 
      email: body.email, 
      telefono: body.telefono 
    }, 201)
  } catch (error) {
    return c.json({ error: 'Error creating vendedor' }, 500)
  }
})