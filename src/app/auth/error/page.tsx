'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Home, Zap } from "lucide-react"

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const detail = searchParams.get('detail');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-destructive rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          
          <CardTitle className="text-2xl">Error de Autenticación</CardTitle>
          <CardDescription>
            No se pudo completar el proceso de autenticación
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                <strong>Error:</strong> {error}
              </AlertDescription>
            </Alert>
          )}

          {detail && (
            <Alert>
              <AlertDescription className="text-sm">
                <strong>Detalle:</strong> {detail}
              </AlertDescription>
            </Alert>
          )}

          <Link href="/">
            <Button className="w-full bg-[#E31937] hover:bg-[#c41230] text-white gap-2">
              <Home className="w-4 h-4" />
              Volver al Inicio
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
