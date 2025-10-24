-- Tabla de usuarios
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  avatar TEXT,
  user_type TEXT DEFAULT 'comprador',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de coches
CREATE TABLE cars (
  id TEXT PRIMARY KEY,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  año INTEGER NOT NULL,
  precio REAL NOT NULL,
  kilometraje INTEGER NOT NULL,
  combustible TEXT NOT NULL,
  transmision TEXT NOT NULL,
  color TEXT NOT NULL,
  descripcion TEXT,
  imagen TEXT,
  imagenes TEXT, -- JSON array de imágenes
  vendedor_id TEXT NOT NULL,
  vendedor_nombre TEXT NOT NULL,
  vendedor_telefono TEXT,
  vendedor_email TEXT,
  en_slideshow BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendedor_id) REFERENCES users(id)
);

-- Tabla de favoritos
CREATE TABLE favorites (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  car_id TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (car_id) REFERENCES cars(id),
  UNIQUE(user_id, car_id)
);

-- Insertar datos demo
INSERT INTO users (id, email, name, phone, user_type) VALUES 
('demo-user-1', 'demo@vrautos.com', 'Demo V&R', '+52 55 1234 5678', 'vendedor');

INSERT INTO cars (id, marca, modelo, año, precio, kilometraje, combustible, transmision, color, descripcion, imagen, vendedor_id, vendedor_nombre, vendedor_telefono, vendedor_email) VALUES 
('demo-car-1', 'Toyota', 'Corolla', 2020, 280000, 45000, 'Gasolina', 'Automática', 'Blanco', 'Excelente estado, mantenimiento al día', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop', 'demo-user-1', 'Demo V&R', '+52 55 1234 5678', 'demo@vrautos.com'),
('demo-car-2', 'Honda', 'Civic', 2019, 320000, 38000, 'Gasolina', 'Manual', 'Azul', 'Coche deportivo en perfectas condiciones', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'demo-user-1', 'Demo V&R', '+52 55 1234 5678', 'demo@vrautos.com');