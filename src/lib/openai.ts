import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generarDescripcionCoche(datos: {
  marca: string
  modelo: string
  año: number
  kilometraje: number
  combustible: string
  transmision: string
  color: string
}) {
  try {
    const prompt = `Genera una descripción atractiva y profesional para un coche en venta con estas características:
    
Marca: ${datos.marca}
Modelo: ${datos.modelo}
Año: ${datos.año}
Kilometraje: ${datos.kilometraje} km
Combustible: ${datos.combustible}
Transmisión: ${datos.transmision}
Color: ${datos.color}

La descripción debe ser en español, de 2-3 párrafos, destacando las características principales y beneficios del vehículo.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    })

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Error generando descripción:', error)
    return `${datos.marca} ${datos.modelo} ${datos.año} en excelente estado. Vehículo con ${datos.kilometraje} km, motor ${datos.combustible} y transmisión ${datos.transmision}. Color ${datos.color}.`
  }
}