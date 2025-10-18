import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

export const auth = new Hono<{ Bindings: Bindings }>()

// POST /api/auth/login
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json()
    
    const { results } = await c.env.DB.prepare(`
      SELECT id, nombre, email, password 
      FROM vendedores 
      WHERE email = ?
    `).bind(email).all()
    
    if (results.length === 0) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }
    
    const vendedor = results[0] as any
    
    // En producción usar bcrypt, aquí simplificado
    if (vendedor.password !== password) {
      return c.json({ error: 'Invalid credentials' }, 401)
    }
    
    const token = await sign({
      id: vendedor.id,
      email: vendedor.email,
      name: vendedor.nombre,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) // 7 days
    }, c.env.JWT_SECRET || 'secret')
    
    return c.json({
      token,
      user: {
        id: vendedor.id,
        email: vendedor.email,
        name: vendedor.nombre
      }
    })
  } catch (error) {
    return c.json({ error: 'Login error' }, 500)
  }
})

// POST /api/auth/registro
auth.post('/registro', async (c) => {
  try {
    const { nombre, email, telefono, password } = await c.req.json()
    
    // Verificar si existe
    const { results: existing } = await c.env.DB.prepare(`
      SELECT id FROM vendedores WHERE email = ?
    `).bind(email).all()
    
    if (existing.length > 0) {
      return c.json({ message: 'El email ya está registrado' }, 400)
    }
    
    const id = crypto.randomUUID()
    
    await c.env.DB.prepare(`
      INSERT INTO vendedores (id, nombre, email, telefono, password)
      VALUES (?, ?, ?, ?, ?)
    `).bind(id, nombre, email, telefono, password).run()
    
    return c.json({
      id,
      nombre,
      email,
      telefono
    }, 201)
  } catch (error) {
    return c.json({ message: 'Error interno del servidor' }, 500)
  }
})