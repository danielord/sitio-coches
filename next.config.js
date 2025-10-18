/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['localhost', 'imagedelivery.net'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://sitio-coches-api.your-subdomain.workers.dev'
      : 'http://localhost:8787'
  }
}

module.exports = nextConfig