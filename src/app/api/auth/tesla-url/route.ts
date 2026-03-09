import { NextRequest, NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge, generateState, buildAuthUrl } from '@/lib/tesla/oauth';
import { setSession } from '@/lib/tesla/sessions';

/**
 * POST /api/auth/tesla-url
 * Genera la URL de autorización de Tesla con PKCE
 */
export async function POST(request: NextRequest) {
  try {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = generateState();

    // Guardar sesión temporal en el servidor (NO enviar code_verifier al frontend)
    setSession(state, {
      codeVerifier,
      createdAt: Date.now(),
    });

    const authUrl = buildAuthUrl({
      clientId: 'ownerapi',
      redirectUri: process.env.TESLA_REDIRECT_URI!,
      state,
      codeChallenge,
    });

    return NextResponse.json({
      auth_url: authUrl,
      state,
      // NO enviar code_verifier al frontend por seguridad
    });
  } catch (error) {
    console.error('Error al generar URL de autorización:', error);
    return NextResponse.json(
      { error: 'Error al generar URL de autorización' },
      { status: 500 }
    );
  }
}
