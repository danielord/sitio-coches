export async function subirImagen(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      },
      body: formData,
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.errors?.[0]?.message || 'Error subiendo imagen')
    }

    return data.result.variants[0] // URL de la imagen
  } catch (error) {
    console.error('Error subiendo imagen:', error)
    throw error
  }
}