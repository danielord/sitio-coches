import { Hono } from 'hono'

type Bindings = {
  CLOUDFLARE_API_TOKEN: string
  CLOUDFLARE_ACCOUNT_ID: string
}

export const upload = new Hono<{ Bindings: Bindings }>()

// POST /api/upload
upload.post('/', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return c.json({ error: 'No se proporcionó archivo' }, 400)
    }

    // Para desarrollo local, simular subida exitosa
    const mockUrl = `https://picsum.photos/800/600?random=${Date.now()}`
    
    return c.json({
      url: mockUrl,
      analisis: [{ nombre: 'Car', confianza: 95 }]
    })
  } catch (error) {
    return c.json({ error: 'Error al subir imagen' }, 500)
  }
})