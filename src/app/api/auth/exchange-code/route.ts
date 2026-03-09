import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForTokens } from '@/lib/tesla/oauth';
import { getSession, deleteSession } from '@/lib/tesla/sessions';

/**
 * POST /api/auth/exchange-code
 * Intercambia el código de autorización por tokens de Tesla
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, state } = body;

    if (!code) {
      return NextResponse.json(
        { error: 'Código de autorización requerido' },
        { status: 400 }
      );
    }

    if (!state) {
      return NextResponse.json(
        { error: 'State requerido. Por favor, inicia el flujo nuevamente.' },
        { status: 400 }
      );
    }

    // Buscar codeVerifier en sesiones temporales (servidor)
    const session = getSession(state);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Sesión no encontrada o expirada. Por favor, inicia el flujo nuevamente.' },
        { status: 400 }
      );
    }

    const codeVerifier = session.codeVerifier;
    
    // Marcar sesión como usada (eliminarla)
    deleteSession(state);

    // Intercambiar código por tokens
    const tokens = await exchangeCodeForTokens({
      code,
      codeVerifier,
      redirectUri: process.env.TESLA_REDIRECT_URI!,
    });

    return NextResponse.json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in,
      token_type: tokens.token_type,
    });
  } catch (error: any) {
    console.error('Error al intercambiar código:', error);
    return NextResponse.json(
      { error: error.message || 'Error al intercambiar código' },
      { status: 500 }
    );
  }
}
