/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remover output: 'export' para habilitar API routes
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig