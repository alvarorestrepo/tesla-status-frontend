/**
 * Utilidades para OAuth con Tesla (PKCE)
 * Implementa el flujo PKCE para autenticación con Tesla
 */

import crypto from 'crypto';

/**
 * Genera un code_verifier para PKCE (43-128 caracteres)
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.randomFillSync(array);
  return base64URLEncode(Buffer.from(array));
}

/**
 * Genera el code_challenge a partir del code_verifier (SHA256)
 */
export function generateCodeChallenge(verifier: string): string {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return base64URLEncode(hash);
}

/**
 * Genera un state aleatorio para prevenir CSRF
 */
export function generateState(): string {
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
 * Construye la URL de autorización de Tesla
 */
export function buildAuthUrl(params: {
  clientId: string;
  redirectUri: string;
  state: string;
  codeChallenge: string;
}): string {
  const baseUrl = process.env.TESLA_AUTH_URL || 'https://auth.tesla.com/oauth2/v3/authorize';
  
  const url = new URL(baseUrl);
  url.searchParams.set('client_id', params.clientId);
  url.searchParams.set('redirect_uri', params.redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email offline_access vehicle_device_data vehicle_cmds vehicle_charging_cmds');
  url.searchParams.set('state', params.state);
  url.searchParams.set('code_challenge', params.codeChallenge);
  url.searchParams.set('code_challenge_method', 'S256');
  
  return url.toString();
}

/**
 * Intercambia el código de autorización por tokens
 */
export async function exchangeCodeForTokens(params: {
  code: string;
  codeVerifier: string;
  redirectUri: string;
}): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}> {
  const tokenUrl = process.env.TESLA_TOKEN_URL || 'https://auth.tesla.com/oauth2/v3/token';
  const clientId = 'ownerapi';

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code: params.code,
    redirect_uri: params.redirectUri,
    code_verifier: params.codeVerifier,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Error al intercambiar código: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    token_type: data.token_type || 'Bearer',
  };
}

/**
 * Refresca el access_token usando el refresh_token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}> {
  const tokenUrl = process.env.TESLA_TOKEN_URL || 'https://auth.tesla.com/oauth2/v3/token';
  const clientId = 'ownerapi';

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: clientId,
    refresh_token: refreshToken,
  });

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Error al refrescar token: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in,
    token_type: data.token_type || 'Bearer',
  };
}
