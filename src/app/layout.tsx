import './globals.css'

export const metadata = {
  title: 'Tesla Tracking Platform',
  description: 'Consulta el estado de tu pedido Tesla',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
