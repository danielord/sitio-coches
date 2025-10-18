import { Hono } from 'hono'

type Bindings = {
  OPENAI_API_KEY: string
  CLOUDFLARE_API_TOKEN: string
}

export const ai = new Hono<{ Bindings: Bindings }>()

// POST /api/ai/descripcion
ai.post('/descripcion', async (c) => {
  try {
    const body = await c.req.json()
    
    const prompt = `Genera una descripción atractiva y profesional para un coche en venta con estas características:
    
Marca: ${body.marca}
Modelo: ${body.modelo}
Año: ${body.año}
Kilometraje: ${body.kilometraje} km
Combustible: ${body.combustible}
Transmisión: ${body.transmision}
Color: ${body.color}

La descripción debe ser en español, de 2-3 párrafos, destacando las características principales y beneficios del vehículo.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    })

    const data = await response.json() as any
    const descripcion = data.choices?.[0]?.message?.content || 
      `${body.marca} ${body.modelo} ${body.año} en excelente estado. Vehículo con ${body.kilometraje} km, motor ${body.combustible} y transmisión ${body.transmision}. Color ${body.color}.`

    return c.json({ descripcion })
  } catch (error) {
    return c.json({ error: 'Error generando descripción' }, 500)
  }
})

// POST /api/ai/moderacion
ai.post('/moderacion', async (c) => {
  try {
    const { texto } = await c.req.json()
    
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/ai/run/@cf/meta/llama-2-7b-chat-int8`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: 'Analiza si el siguiente texto contiene contenido inapropiado, spam, lenguaje ofensivo o información falsa. Responde solo con "APROPIADO" o "INAPROPIADO".'
          },
          {
            role: 'user',
            content: texto
          }
        ]
      }),
    })

    const data = await response.json() as any
    const resultado = data.result?.response || 'APROPIADO'
    
    return c.json({
      esApropiado: resultado.includes('APROPIADO'),
      razon: resultado.includes('INAPROPIADO') ? 'Contenido detectado como inapropiado' : null
    })
  } catch (error) {
    return c.json({ esApropiado: true, razon: null })
  }
})