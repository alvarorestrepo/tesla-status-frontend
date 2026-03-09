/**
 * Cliente para la API de Tesla (owner-api.teslamotors.com)
 * Obtiene la lista básica de pedidos
 */

import { TeslaApiOrder } from './types';

const TESLA_API_URL = process.env.TESLA_API_URL || 'https://owner-api.teslamotors.com';

/**
 * Obtiene la lista de pedidos del usuario
 */
export async function getOrders(accessToken: string): Promise<TeslaApiOrder[]> {
  const url = `${TESLA_API_URL}/api/1/users/orders`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Error al obtener pedidos: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  
  // La API devuelve { response: [...orders] }
  return data.response || [];
}

/**
 * Obtiene los detalles básicos de un pedido específico
 * Nota: Para datos enriquecidos usar Akamai API
 */
export async function getOrderBasicInfo(
  accessToken: string,
  referenceNumber: string
): Promise<TeslaApiOrder | null> {
  try {
    const orders = await getOrders(accessToken);
    return orders.find(order => order.referenceNumber === referenceNumber) || null;
  } catch (error) {
    console.error('Error al obtener info básica del pedido:', error);
    return null;
  }
}
