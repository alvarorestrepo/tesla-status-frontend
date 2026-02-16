/** @type {import('next').NextConfig} */
const nextConfig = {
  // Variables de entorno disponibles en el cliente
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  
  // Rewrites para desarrollo local
  async rewrites() {
    // Solo aplicar rewrites en desarrollo
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/auth/:path*',
          destination: 'http://localhost:8000/auth/:path*',
        },
        {
          source: '/api/:path*',
          destination: 'http://localhost:8000/:path*',
        },
      ];
    }
    return [];
  },
  
  // Configuración de imágenes (si se usan en el futuro)
  images: {
    unoptimized: true,
  },
  
  // Configuración de trailing slash
  trailingSlash: false,
};

module.exports = nextConfig;