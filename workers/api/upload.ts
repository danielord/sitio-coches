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

    // Subir a Cloudflare Images
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${c.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.CLOUDFLARE_API_TOKEN}`,
      },
      body: uploadFormData,
    })

    const data = await response.json() as any
    
    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || 'Error subiendo imagen')
    }

    return c.json({
      url: data.result.variants[0],
      analisis: [{ nombre: 'Car', confianza: 95 }] // Simulado
    })
  } catch (error) {
    return c.json({ error: 'Error al subir imagen' }, 500)
  }
})