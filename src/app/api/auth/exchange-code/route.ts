import { NextRequest, NextResponse } from 'next/server';

const PROXY_URL = process.env.NEXT_PUBLIC_APP_URL 
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/tesla-proxy`
  : 'http://localhost:3000/api/tesla-proxy';

/**
 * POST /api/auth/exchange-code
 * Intercambia el código de autorización por tokens usando el proxy de Tesla
 * El code_verifier viene del frontend (sessionStorage)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, code_verifier } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Código de autorización requerido' },
        { status: 400 }
      );
    }

    if (!code_verifier) {
      return NextResponse.json(
        { error: 'Code verifier requerido. Asegúrate de guardarlo en sessionStorage antes de iniciar el login.' },
        { status: 400 }
      );
    }

    // Intercambiar código por tokens usando el proxy
    const proxyResponse = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        code_verifier,
      }),
    });

    const data = await proxyResponse.json();

    if (!proxyResponse.ok) {
      console.error('Error en proxy Tesla:', data);
      return NextResponse.json(
        { error: data.error_description || data.error || 'Error al intercambiar código' },
        { status: proxyResponse.status }
      );
    }

    return NextResponse.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      token_type: data.token_type || 'Bearer',
    });
  } catch (error: any) {
    console.error('Error al intercambiar código:', error);
    return NextResponse.json(
      { error: error.message || 'Error al intercambiar código' },
      { status: 500 }
    );
  }
}
