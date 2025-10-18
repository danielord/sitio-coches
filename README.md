# Sitio Coches - Plataforma de Venta de Automóviles

Una plataforma moderna para la venta de coches con backend para vendedores y frontend para compradores.

## 🚀 Tecnologías

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma ORM
- **Base de datos**: PostgreSQL
- **IA**: OpenAI GPT-4, AWS Rekognition, Cloudflare AI

## 📦 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

3. Configurar base de datos:
```bash
npm run db:push
```

4. Ejecutar en desarrollo:
```bash
npm run dev
```

## 🏗️ Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
│   ├── api/            # API Routes
│   ├── coches/         # Páginas de coches
│   ├── admin/          # Panel de administración
│   └── globals.css     # Estilos globales
├── components/         # Componentes reutilizables
├── lib/               # Utilidades y configuraciones
└── types/             # Tipos de TypeScript
```

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run start` - Servidor de producción
- `npm run db:push` - Sincronizar esquema de BD
- `npm run db:studio` - Abrir Prisma Studio

## 🌐 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio a Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Cloudflare Pages
1. Conectar repositorio
2. Configurar build: `npm run build`
3. Directorio de salida: `.next`

## 🤖 Servicios de IA

- **OpenAI**: Generación automática de descripciones
- **AWS Rekognition**: Análisis de imágenes de coches
- **Cloudflare AI**: Moderación de contenido

## 📱 Características

- ✅ Listado de coches con filtros
- ✅ Panel de administración
- ✅ API REST completa
- ✅ Diseño responsive
- ✅ TypeScript + Prisma
- 🔄 Integración con IA (próximamente)
- 🔄 Subida de imágenes (próximamente)
- 🔄 Sistema de autenticación (próximamente)