import './globals.css'
import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Tesla Tracking - Consulta tu pedido',
  description: 'Consulta el estado de tu pedido Tesla en tiempo real. VIN, configuración, fechas de entrega y más.',
  keywords: ['Tesla', 'pedido', 'tracking', 'estado', 'VIN', 'Model 3', 'Model Y', 'Model S', 'Model X'],
  authors: [{ name: 'Tesla Tracking' }],
  creator: 'Tesla Tracking',
  publisher: 'Tesla Tracking',
  robots: 'index, follow',
  metadataBase: new URL('https://tesla-status.vercel.app'),
  
  // Favicon e iconos
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  
  // Meta tags Open Graph (Facebook, WhatsApp, etc.)
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://tesla-status.vercel.app',
    siteName: 'Tesla Tracking',
    title: 'Tesla Tracking - Consulta tu pedido',
    description: 'Consulta el estado de tu pedido Tesla en tiempo real. VIN, configuración, fechas de entrega y más.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Tesla Tracking - Consulta el estado de tu pedido Tesla',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Tesla Tracking - Consulta tu pedido',
    description: 'Consulta el estado de tu pedido Tesla en tiempo real. VIN, configuración, fechas de entrega y más.',
    images: ['/og-image.svg'],
    creator: '@teslatracking',
  },
  
  // Apple Web App
  appleWebApp: {
    capable: true,
    title: 'Tesla Tracking',
    statusBarStyle: 'black-translucent',
  },
  
  // Manifest para PWA
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#E31937',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
