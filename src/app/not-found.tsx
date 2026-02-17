'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Zap, ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-20 h-20 bg-[#E31937] rounded-full flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-4xl font-bold text-gray-900">404</CardTitle>
            <CardDescription className="text-xl text-gray-600">
              Página no encontrada
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            La página que estás buscando no existe o ha sido movida. 
            <br /><br />
            No te preocupes, puedes volver al inicio y consultar el estado de tu pedido Tesla.
          </p>
          
          <div className="flex flex-col gap-3">
            <Link href="/">
              <Button 
                className="w-full bg-[#E31937] hover:bg-[#c41230] text-white"
                size="lg"
              >
                <Home className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => typeof window !== 'undefined' && window.history.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Regresar atrás
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Tesla Tracking - Consulta el estado de tu pedido
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
