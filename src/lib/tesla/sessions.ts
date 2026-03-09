/**
 * Almacenamiento temporal de sesiones OAuth
 * En producción usar Redis o base de datos
 */

export interface Session {
  codeVerifier: string;
  createdAt: number;
}

// Mapa global de sesiones (compartido entre endpoints)
const sessions = new Map<string, Session>();

// Limpiar sesiones antiguas cada 5 minutos (TTL: 10 minutos)
if (typeof globalThis !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    const TEN_MINUTES = 10 * 60 * 1000;
    
    for (const [state, session] of sessions.entries()) {
      if (now - session.createdAt > TEN_MINUTES) {
        sessions.delete(state);
      }
    }
  }, 5 * 60 * 1000);
}

export function getSession(state: string): Session | undefined {
  return sessions.get(state);
}

export function setSession(state: string, session: Session): void {
  sessions.set(state, session);
}

export function deleteSession(state: string): void {
  sessions.delete(state);
}

export function listSessions(): [string, Session][] {
  return Array.from(sessions.entries());
}
