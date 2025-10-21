# Despliegue en Cloudflare Pages

## Pasos para desplegar:

1. **Crear cuenta en Cloudflare Pages**
   - Ve a https://pages.cloudflare.com/
   - Inicia sesión o crea una cuenta

2. **Subir archivos**
   - Sube todo el contenido de la carpeta `out/` (1.7MB)
   - O conecta tu repositorio de GitHub

3. **Configuración del build**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Node.js version: 18.x

4. **Variables de entorno** (opcional)
   - No se requieren para la versión actual

## Características del sitio:

- ✅ **Tamaño**: 1.7MB (muy por debajo del límite de 25MB)
- ✅ **Estático**: Completamente estático, sin servidor
- ✅ **Responsive**: Funciona en móviles y desktop
- ✅ **PWA Ready**: Preparado para ser Progressive Web App
- ✅ **SEO Optimizado**: Meta tags y estructura correcta

## Funcionalidades incluidas:

- 🚗 Catálogo de coches con filtros
- ❤️ Sistema de favoritos por usuario
- 👤 Registro y login de usuarios
- 📝 Panel de administración para vendedores
- 🖼️ Slideshow con múltiples imágenes
- 📱 Diseño completamente responsive
- 🔍 Búsqueda y comparación de coches

## URL de ejemplo:
Una vez desplegado, el sitio estará disponible en:
`https://tu-sitio.pages.dev`