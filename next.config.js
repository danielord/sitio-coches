/** @type {import('next').NextConfig} */
const nextConfig = {
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
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      config.cache = false
    }
    return config
  }
}

module.exports = nextConfig