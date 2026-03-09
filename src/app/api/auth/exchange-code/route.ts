import { NextRequest, NextResponse } from 'next/server';

const CLIENT_ID = 'ownerapi';
const REDIRECT_URI = 'https://auth.tesla.com/void/callback';
const TOKEN_URL = 'https://auth.tesla.com/oauth2/v3/token';

/**
 * POST /api/auth/exchange-code
 * Intercambia el código de autorización por tokens llamando directamente a Tesla
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

    // Intercambiar código por tokens llamando directamente a Tesla
    const tokenResponse = await fetch(TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: code_verifier,
      }).toString(),
    });

    const data = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Error en Tesla API:', data);
      return NextResponse.json(
        { error: data.error_description || data.error || 'Error al intercambiar código' },
        { status: tokenResponse.status }
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
