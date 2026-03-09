/**
 * Utilidades de OAuth para el frontend
 * Manejo de tokens y peticiones a Tesla
 */

import { TeslaTokens } from './types';

const PROXY_URL = '/api/tesla-proxy';

/**
 * Decodifica un JWT para obtener el payload
 */
export function decodeJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('[decodeJwt] Error decodificando JWT:', e);
    return null;
  }
}

/**
 * Verifica si el token es válido (no expirado)
 * Con buffer de 60 segundos
 */
export function isTokenValid(accessToken: string): boolean {
  const decoded = decodeJwt(accessToken);
  if (!decoded || !decoded.exp) {
    return false;
  }
  // Verificar que no haya expirado (con 60 segundos de margen)
  return decoded.exp > Date.now() / 1000 + 60;
}

/**
 * Obtiene el tiempo restante de validez del token en segundos
 */
export function getTokenTimeRemaining(accessToken: string): number {
  const decoded = decodeJwt(accessToken);
  if (!decoded || !decoded.exp) {
    return 0;
  }
  return Math.max(0, decoded.exp - Date.now() / 1000);
}

/**
 * Refresca el access_token usando el refresh_token
 */
export async function refreshAccessToken(refreshToken: string): Promise<TeslaTokens> {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || data.error || 'Error al refrescar token');
  }

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token || refreshToken, // Tesla no siempre devuelve nuevo refresh_token
    expires_in: data.expires_in,
    token_type: data.token_type || 'Bearer',
  };
}

/**
 * Obtiene el access_token del localStorage
 * Si está expirado, intenta refrescarlo automáticamente
 */
export async function getValidAccessToken(): Promise<string | null> {
  const accessToken = localStorage.getItem('tesla_access_token');
  const refreshToken = localStorage.getItem('tesla_refresh_token');

  if (!accessToken) {
    return null;
  }

  // Si el token es válido, usarlo
  if (isTokenValid(accessToken)) {
    return accessToken;
  }

  // Si hay refresh_token, intentar refrescar
  if (refreshToken) {
    try {
      console.log('[getValidAccessToken] Token expirado, refrescando...');
      const newTokens = await refreshAccessToken(refreshToken);
      
      // Guardar nuevos tokens
      localStorage.setItem('tesla_access_token', newTokens.access_token);
      if (newTokens.refresh_token) {
        localStorage.setItem('tesla_refresh_token', newTokens.refresh_token);
      }
      const expiresAt = Date.now() + (newTokens.expires_in * 1000);
      localStorage.setItem('tesla_token_expires_at', expiresAt.toString());
      
      console.log('[getValidAccessToken] Token refrescado exitosamente');
      return newTokens.access_token;
    } catch (error) {
      console.error('[getValidAccessToken] Error al refrescar token:', error);
      // Limpiar tokens inválidos
      clearTokens();
      return null;
    }
  }

  // No hay refresh_token, limpiar y retornar null
  clearTokens();
  return null;
}

/**
 * Limpia todos los tokens del localStorage
 */
export function clearTokens(): void {
  localStorage.removeItem('tesla_access_token');
  localStorage.removeItem('tesla_refresh_token');
  localStorage.removeItem('tesla_token_expires_at');
}

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated(): boolean {
  const accessToken = localStorage.getItem('tesla_access_token');
  return !!accessToken && isTokenValid(accessToken);
}

/**
 * Guarda los tokens en localStorage
 */
export function saveTokens(tokens: TeslaTokens): void {
  localStorage.setItem('tesla_access_token', tokens.access_token);
  if (tokens.refresh_token) {
    localStorage.setItem('tesla_refresh_token', tokens.refresh_token);
  }
  const expiresAt = Date.now() + (tokens.expires_in * 1000);
  localStorage.setItem('tesla_token_expires_at', expiresAt.toString());
}
