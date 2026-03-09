import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const CLIENT_ID = 'ownerapi';
const REDIRECT_URI = 'https://auth.tesla.com/void/callback';
const AUTH_URL = 'https://auth.tesla.com/oauth2/v3/authorize';
const SCOPE = 'openid email offline_access vehicle_device_data vehicle_cmds vehicle_charging_cmds';

/**
 * Genera code_verifier para PKCE (43-128 caracteres)
 */
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.randomFillSync(array);
  return base64URLEncode(Buffer.from(array));
}

/**
 * Genera code_challenge a partir del code_verifier (SHA256)
 */
function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return base64URLEncode(hash);
}

/**
 * Genera state aleatorio para prevenir CSRF
 */
function generateState(): string {
  const array = new Uint8Array(16);
  crypto.randomFillSync(array);
  return base64URLEncode(Buffer.from(array));
}

/**
 * Codifica un buffer a base64url (RFC 4648)
 */
function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * POST /api/auth/tesla-url
 * Genera la URL de autorización de Tesla con PKCE
 * El code_verifier se devuelve al frontend para guardar en sessionStorage
 */
export async function POST(request: NextRequest) {
  try {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const state = generateState();

    // Construir URL de autorización
    const url = new URL(AUTH_URL);
    url.searchParams.set('client_id', CLIENT_ID);
    url.searchParams.set('redirect_uri', REDIRECT_URI);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', SCOPE);
    url.searchParams.set('state', state);
    url.searchParams.set('code_challenge', codeChallenge);
    url.searchParams.set('code_challenge_method', 'S256');

    return NextResponse.json({
      auth_url: url.toString(),
      state,
      code_verifier: codeVerifier, // Enviar al frontend para sessionStorage
      message: 'Guarda code_verifier en sessionStorage antes de abrir la URL',
    });
  } catch (error) {
    console.error('Error al generar URL de autorización:', error);
    return NextResponse.json(
      { error: 'Error al generar URL de autorización' },
      { status: 500 }
    );
  }
}
