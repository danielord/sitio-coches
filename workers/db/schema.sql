-- Tabla de vendedores
CREATE TABLE vendedores (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefono TEXT NOT NULL,
  password TEXT NOT NULL,
  fechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de coches
CREATE TABLE coches (
  id TEXT PRIMARY KEY,
  marca TEXT NOT NULL,
  modelo TEXT NOT NULL,
  año INTEGER NOT NULL,
  precio REAL NOT NULL,
  kilometraje INTEGER NOT NULL,
  combustible TEXT NOT NULL,
  transmision TEXT NOT NULL,
  color TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  imagenes TEXT, -- JSON array as string
  vendedorId TEXT NOT NULL,
  fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (vendedorId) REFERENCES vendedores(id)
);

-- Tabla de valoraciones
CREATE TABLE valoraciones (
  id TEXT PRIMARY KEY,
  puntuacion INTEGER NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
  comentario TEXT,
  nombreUsuario TEXT NOT NULL,
  emailUsuario TEXT NOT NULL,
  cocheId TEXT NOT NULL,
  fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cocheId) REFERENCES coches(id)
);