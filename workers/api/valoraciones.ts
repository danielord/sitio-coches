import { Hono } from 'hono'

type Bindings = {
  DB: D1Database
}

export const valoraciones = new Hono<{ Bindings: Bindings }>()

// GET /api/valoraciones/:cocheId
valoraciones.get('/:cocheId', async (c) => {
  try {
    const cocheId = c.req.param('cocheId')
    
    const { results } = await c.env.DB.prepare(`
      SELECT * FROM valoraciones 
      WHERE cocheId = ? 
      ORDER BY fechaCreacion DESC
    `).bind(cocheId).all()
    
    return c.json(results)
  } catch (error) {
    return c.json({ error: 'Error fetching valoraciones' }, 500)
  }
})

// POST /api/valoraciones
valoraciones.post('/', async (c) => {
  try {
    const { puntuacion, comentario, nombreUsuario, emailUsuario, cocheId } = await c.req.json()
    
    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return c.json({ error: 'Puntuación debe ser entre 1 y 5' }, 400)
    }
    
    const id = crypto.randomUUID()
    
    await c.env.DB.prepare(`
      INSERT INTO valoraciones (id, puntuacion, comentario, nombreUsuario, emailUsuario, cocheId)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(id, puntuacion, comentario, nombreUsuario, emailUsuario, cocheId).run()
    
    return c.json({ id, puntuacion, comentario, nombreUsuario, cocheId }, 201)
  } catch (error) {
    return c.json({ error: 'Error creating valoracion' }, 500)
  }
})

// GET /api/valoraciones/stats/:cocheId
valoraciones.get('/stats/:cocheId', async (c) => {
  try {
    const cocheId = c.req.param('cocheId')
    
    const { results } = await c.env.DB.prepare(`
      SELECT 
        COUNT(*) as total,
        AVG(puntuacion) as promedio,
        SUM(CASE WHEN puntuacion = 5 THEN 1 ELSE 0 END) as cinco_estrellas,
        SUM(CASE WHEN puntuacion = 4 THEN 1 ELSE 0 END) as cuatro_estrellas,
        SUM(CASE WHEN puntuacion = 3 THEN 1 ELSE 0 END) as tres_estrellas,
        SUM(CASE WHEN puntuacion = 2 THEN 1 ELSE 0 END) as dos_estrellas,
        SUM(CASE WHEN puntuacion = 1 THEN 1 ELSE 0 END) as una_estrella
      FROM valoraciones 
      WHERE cocheId = ?
    `).bind(cocheId).all()
    
    return c.json(results[0])
  } catch (error) {
    return c.json({ error: 'Error fetching stats' }, 500)
  }
})