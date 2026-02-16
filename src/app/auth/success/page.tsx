'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, CheckCircle2, Zap } from "lucide-react"

export default function AuthSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      localStorage.setItem('jwt_token', token);
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">¡Autenticación Exitosa!</h1>
          <p className="text-muted-foreground mb-6">Redirigiendo al dashboard...</p>
          
          <Loader2 className="w-6 h-6 animate-spin text-[#E31937]" />
        </CardContent>
      </Card>
    </div>
  );
}
