'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Loader2, AlertCircle, ArrowRight, CheckCircle2, Zap } from "lucide-react"
import Link from "next/link"

interface AuthUrlResponse {
  auth_url: string;
  state: string;
  code_verifier: string;
}

export default function TeslaPopupAuth() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState('');
  const [authUrl, setAuthUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Generar URL de autorización al cargar la página
    fetch('/api/auth/tesla-url', { method: 'POST' })
      .then(res => res.json())
      .then((data: AuthUrlResponse) => {
        if (data.auth_url && data.code_verifier) {
          setAuthUrl(data.auth_url);
          // Guardar code_verifier en sessionStorage para recuperarlo después
          sessionStorage.setItem('tesla-code-verifier', data.code_verifier);
          sessionStorage.setItem('tesla-auth-state', data.state);
          console.log('[TeslaAuth] Code verifier guardado en sessionStorage');
        }
      })
      .catch(err => {
        console.error('Error al generar URL:', err);
        setError('Error al generar URL de autorización');
      });
  }, []);

  const extractCode = (url: string): string | null => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('code');
    } catch {
      // Fallback a regex si no es una URL válida
      const match = url.match(/[?&]code=([^&]+)/);
      return match ? match[1] : null;
    }
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

    // Recuperar code_verifier del sessionStorage
    const codeVerifier = sessionStorage.getItem('tesla-code-verifier');
    
    if (!codeVerifier) {
      setError('No se encontró el code verifier. Por favor, refresca la página e inicia el proceso nuevamente.');
      setIsLoading(false);
      return;
    }

    try {
      // Intercambiar código por tokens
      const response = await fetch('/api/auth/exchange-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code, 
          code_verifier: codeVerifier 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al intercambiar código');
      }

      const data = await response.json();
      
      // Guardar tokens en localStorage
      localStorage.setItem('tesla_access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('tesla_refresh_token', data.refresh_token);
      }
      
      // Guardar tiempo de expiración
      const expiresAt = Date.now() + (data.expires_in * 1000);
      localStorage.setItem('tesla_token_expires_at', expiresAt.toString());

      // Limpiar sessionStorage
      sessionStorage.removeItem('tesla-code-verifier');
      sessionStorage.removeItem('tesla-auth-state');

      console.log('[TeslaAuth] Login exitoso, redirigiendo al dashboard');
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
                <p className="font-medium">Abre la ventana de autenticación</p>
                <p className="text-muted-foreground">Haz clic en el botón de abajo para iniciar el proceso</p>
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
