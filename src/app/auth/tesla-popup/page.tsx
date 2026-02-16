'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Loader2, AlertCircle, ArrowRight, CheckCircle2, Zap } from "lucide-react"
import Link from "next/link"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function TeslaPopupAuth() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    fetch(`${API_URL}/auth/tesla-url`)
      .then(res => res.json())
      .then(data => {
        if (data.auth_url) {
          setAuthUrl(data.auth_url);
          window.open(data.auth_url, 'TeslaAuth', 'width=500,height=600');
        }
      })
      .catch(err => console.error('Error:', err));
  }, []);

  const extractCode = (url: string) => {
    const match = url.match(/[?&]code=([^&]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const code = extractCode(urlInput);
    if (!code) {
      setError('No se encontró el código en la URL. Asegúrate de copiar la URL completa.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/exchange-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) throw new Error('Error al intercambiar código');

      const data = await response.json();
      localStorage.setItem('jwt_token', data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const openTeslaWindow = () => {
    if (authUrl) {
      window.open(authUrl, 'TeslaAuth', 'width=500,height=600');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-[#E31937] rounded-full flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl">Autenticación con Tesla</CardTitle>
          <CardDescription>
            Conecta tu cuenta de Tesla de forma segura
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Steps */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div className="text-sm">
                <p className="font-medium">Se abrió una ventana emergente</p>
                <p className="text-muted-foreground">Si no la ves, haz clic en el botón de abajo</p>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={openTeslaWindow}
              className="w-full gap-2"
              disabled={!authUrl}
            >
              <ExternalLink className="w-4 h-4" />
              Abrir ventana de Tesla
            </Button>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div className="text-sm">
                <p className="font-medium">Inicia sesión con tu cuenta Tesla</p>
                <p className="text-muted-foreground">Ingresa tus credenciales de Tesla</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <div className="text-sm">
                <p className="font-medium">Copia la URL completa</p>
                <p className="text-muted-foreground">Cuando veas el error, selecciona toda la URL y cópiala</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                4
              </div>
              <div className="text-sm">
                <p className="font-medium">Pega la URL aquí</p>
                <p className="text-muted-foreground">Pega la URL completa en el campo de abajo</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://auth.tesla.com/void/callback?code=..."
              className="min-h-[100px] font-mono text-sm"
              required
            />

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              disabled={isLoading || !urlInput.trim()}
              className="w-full bg-[#E31937] hover:bg-[#c41230] text-white"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              ← Volver al inicio
            </Link>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Tus credenciales son procesadas de forma segura y nunca se almacenan.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
