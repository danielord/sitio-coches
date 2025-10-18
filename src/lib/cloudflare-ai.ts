export async function moderarContenido(texto: string) {
  try {
    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/ai/run/@cf/meta/llama-2-7b-chat-int8', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
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

    const data = await response.json()
    const resultado = data.result?.response || 'APROPIADO'
    
    return {
      esApropiado: resultado.includes('APROPIADO'),
      razon: resultado.includes('INAPROPIADO') ? 'Contenido detectado como inapropiado' : null
    }
  } catch (error) {
    console.error('Error en moderación:', error)
    return { esApropiado: true, razon: null } // Permitir por defecto si hay error
  }
}