export function onRequestGet(context) {
  var carId = context.params.id
  
  return context.env.DB.prepare('SELECT * FROM cars WHERE id = ?')
    .bind(carId)
    .first()
    .then(function(car) {
      if (!car) {
        return new Response(JSON.stringify({ error: 'Car not found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      return new Response(JSON.stringify({ car: car }), {
        headers: { 'Content-Type': 'application/json' }
      })
    })
    .catch(function(error) {
      return new Response(JSON.stringify({ error: 'Error fetching car' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    })
}