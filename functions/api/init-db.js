export function onRequestPost(context) {
  var queries = [
    'CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, phone TEXT, address TEXT, avatar TEXT, user_type TEXT DEFAULT "comprador", created_at DATETIME DEFAULT CURRENT_TIMESTAMP)',
    
    'CREATE TABLE IF NOT EXISTS cars (id TEXT PRIMARY KEY, marca TEXT NOT NULL, modelo TEXT NOT NULL, año INTEGER NOT NULL, precio REAL NOT NULL, kilometraje INTEGER NOT NULL, combustible TEXT NOT NULL, transmision TEXT NOT NULL, color TEXT NOT NULL, descripcion TEXT, imagen TEXT, imagenes TEXT, vendedor_id TEXT NOT NULL, vendedor_nombre TEXT NOT NULL, vendedor_telefono TEXT, vendedor_email TEXT, en_slideshow BOOLEAN DEFAULT FALSE, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)',
    
    'INSERT OR IGNORE INTO users (id, email, name, phone, user_type) VALUES ("demo-user-1", "demo@vrautos.com", "Demo V&R", "+52 55 1234 5678", "vendedor")',
    
    'INSERT OR IGNORE INTO cars (id, marca, modelo, año, precio, kilometraje, combustible, transmision, color, descripcion, imagen, vendedor_id, vendedor_nombre, vendedor_telefono, vendedor_email) VALUES ("demo-car-1", "Toyota", "Corolla", 2020, 280000, 45000, "Gasolina", "Automática", "Blanco", "Excelente estado, mantenimiento al día", "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop", "demo-user-1", "Demo V&R", "+52 55 1234 5678", "demo@vrautos.com")'
  ]
  
  var promises = queries.map(function(query) {
    return context.env.DB.prepare(query).run()
  })
  
  return Promise.all(promises)
    .then(function() {
      return new Response(JSON.stringify({ success: true, message: 'Database initialized' }), {
        headers: { 'Content-Type': 'application/json' }
      })
    })
    .catch(function(error) {
      return new Response(JSON.stringify({ error: 'Failed to initialize database: ' + error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    })
}