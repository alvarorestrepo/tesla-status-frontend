import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Tesla Tracking - Consulta tu pedido',
    short_name: 'Tesla Tracking',
    description: 'Consulta el estado de tu pedido Tesla en tiempo real. VIN, configuración, fechas de entrega y más.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#E31937',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}