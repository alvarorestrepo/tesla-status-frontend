/**
 * Cliente para la API de Tesla (owner-api.teslamotors.com)
 * Usa proxy en el cliente (para evitar CORS) y llamadas directas en el servidor
 */

import { TeslaApiOrder, AkamaiResponse } from './types';
import { getValidAccessToken } from './auth';

const PROXY_URL = '/api/tesla-proxy';
const ORDERS_API_URL = 'https://owner-api.teslamotors.com/api/1/users/orders';
const AKAMAI_API_URL = 'https://akamai-apigateway-vfx.tesla.com/tasks';

// Detectar si estamos en el servidor
const isServer = typeof window === 'undefined';

// Clase para errores de token expirado
export class TokenExpiredError extends Error {
  constructor(message = 'Access token is expired') {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

/**
 * Hace una petición a la API de Tesla
 * En servidor: llamada directa
 * En cliente: usa proxy para evitar CORS
 */
async function teslaApiRequest(url: string, accessToken: string) {
  let response: Response;

  if (isServer) {
    // Servidor: llamada directa a Tesla (no hay CORS en servidor)
    response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
  } else {
    // Cliente: usa proxy para evitar CORS
    response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'proxy',
        targetUrl: url,
        accessToken: accessToken,
      }),
    });
  }

  // Manejar 401 - Token expirado
  if (response.status === 401) {
    const errorData = await response.json().catch(() => ({ error: 'Unauthorized' }));
    throw new TokenExpiredError(`API request failed with 401: ${errorData.error || 'Unauthorized'}`);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(`API request failed with status ${response.status}: ${errorData.error || response.statusText}`);
  }

  return response.json();
}

/**
 * Obtiene la lista de pedidos del usuario
 * Requiere autenticación previa
 * @param accessToken - Token opcional. Si no se proporciona, usa el almacenado
 */
export async function getOrders(accessToken?: string): Promise<TeslaApiOrder[]> {
  const token = accessToken || await getValidAccessToken();
  
  if (!token) {
    throw new Error('No hay token de acceso válido. Por favor, inicia sesión nuevamente.');
  }

  const data = await teslaApiRequest(ORDERS_API_URL, token);
  // La API devuelve { response: [...orders] }
  return data.response || [];
}

/**
 * Obtiene los detalles de un pedido específico desde Akamai
 */
export async function getOrderDetails(referenceNumber: string): Promise<AkamaiResponse> {
  const accessToken = await getValidAccessToken();
  
  if (!accessToken) {
    throw new Error('No hay token de acceso válido. Por favor, inicia sesión nuevamente.');
  }

  const url = `${AKAMAI_API_URL}?deviceLanguage=en&deviceCountry=US&referenceNumber=${referenceNumber}&appVersion=9.99.9-9999`;
  return await teslaApiRequest(url, accessToken);
}

/**
 * Obtiene la información básica de un pedido específico
 * Usa la lista de pedidos y filtra por referenceNumber
 */
export async function getOrderBasicInfo(referenceNumber: string): Promise<TeslaApiOrder | null> {
  try {
    const orders = await getOrders();
    return orders.find(order => order.referenceNumber === referenceNumber) || null;
  } catch (error) {
    console.error('Error al obtener info básica del pedido:', error);
    return null;
  }
}

/**
 * Obtiene todos los datos combinados de los pedidos
 * Incluye información básica + detalles de Akamai
 */
export interface CombinedOrder {
  order: TeslaApiOrder;
  details: AkamaiResponse;
}

export async function getAllOrderData(): Promise<CombinedOrder[]> {
  const basicOrders = await getOrders();
  
  if (!basicOrders || basicOrders.length === 0) {
    return [];
  }

  const detailedOrdersPromises = basicOrders.map(async (order) => {
    try {
      const details = await getOrderDetails(order.referenceNumber);
      return { order, details };
    } catch (error) {
      console.error(`Error al obtener detalles del pedido ${order.referenceNumber}:`, error);
      // Retornar pedido básico con detalles vacíos para no romper la app
      return { 
        order, 
        details: { tasks: {} } 
      };
    }
  });

  return Promise.all(detailedOrdersPromises);
}
