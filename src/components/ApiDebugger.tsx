'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/lib/tesla/types';

interface ApiDebuggerProps {
  order: Order;
}

export function ApiDebugger({ order }: ApiDebuggerProps) {
  const [showDebugger, setShowDebugger] = useState(false);
  const [apiData, setApiData] = useState<any>(null);

  useEffect(() => {
    // Recuperar datos crudos de la API del localStorage (guardados temporalmente)
    const rawData = localStorage.getItem('tesla_debug_api_data');
    if (rawData) {
      setApiData(JSON.parse(rawData));
    }
  }, []);

  if (!showDebugger) {
    return (
      <button
        onClick={() => setShowDebugger(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-sm opacity-50 hover:opacity-100 transition-opacity z-50"
      >
        Debug API
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Validación API vs Frontend</h2>
          <button
            onClick={() => setShowDebugger(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          {/* Sección 1: Estado */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-blue-600">Módulo: Estado del Pedido</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">API - order_status:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{order.order_status || 'null'}</code>
              </div>
              <div>
                <p className="text-gray-500">Frontend muestra:</p>
                <span className="bg-green-100 px-2 py-1 rounded">{getStatusDisplay(order.order_status)}</span>
              </div>
              
              <div>
                <p className="text-gray-500">API - model_code:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{order.model_code || 'null'}</code>
              </div>
              <div>
                <p className="text-gray-500">Frontend muestra:</p>
                <span className="bg-green-100 px-2 py-1 rounded">{getModelDisplay(order.model_code)}</span>
              </div>
              
              <div>
                <p className="text-gray-500">API - country_code:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{order.country_code || 'null'}</code>
              </div>
              <div>
                <p className="text-gray-500">Frontend muestra:</p>
                <span className="bg-green-100 px-2 py-1 rounded">{getCountryDisplay(order.country_code)}</span>
              </div>
              
              <div>
                <p className="text-gray-500">API - vin:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{order.vin || 'null'}</code>
              </div>
              <div>
                <p className="text-gray-500">Frontend muestra:</p>
                <span className="bg-green-100 px-2 py-1 rounded">{order.vin || 'Por asignar'}</span>
              </div>
              
              <div>
                <p className="text-gray-500">API - reference_number:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{order.reference_number || 'null'}</code>
              </div>
              <div>
                <p className="text-gray-500">Frontend muestra:</p>
                <span className="bg-green-100 px-2 py-1 rounded">#{order.reference_number}</span>
              </div>
            </div>
          </div>

          {/* Sección 2: Pagos */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-blue-600">Módulo: Información de Pago</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">API - order_amount:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{order.order_amount !== null ? order.order_amount : 'null'}</code>
              </div>
              <div>
                <p className="text-gray-500">Frontend muestra:</p>
                <span className="bg-green-100 px-2 py-1 rounded">{formatCurrency(order.order_amount)}</span>
              </div>
              
              <div>
                <p className="text-gray-500">API - amount_due:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{order.amount_due !== null ? order.amount_due : 'null'}</code>
              </div>
              <div>
                <p className="text-gray-500">Frontend muestra:</p>
                <span className={`px-2 py-1 rounded ${order.amount_due !== null && order.amount_due > 0 ? 'bg-red-100 text-red-700' : order.amount_due === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>
                  {formatCurrency(order.amount_due)}
                  {order.amount_due !== null && order.amount_due > 0 ? ' (Debes)' : order.amount_due === 0 ? ' (Pagado)' : ''}
                </span>
              </div>
              
              <div>
                <p className="text-gray-500">API - payment_type:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{order.payment_type || 'null'}</code>
              </div>
              <div>
                <p className="text-gray-500">Frontend muestra:</p>
                <span className="bg-green-100 px-2 py-1 rounded">{translatePaymentType(order.payment_type)}</span>
              </div>
            </div>
          </div>

          {/* Sección 3: Direcciones */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-blue-600">Módulo: Direcciones</h3>
            <div className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">API - delivery_address:</p>
                  <pre className="bg-gray-100 px-2 py-1 rounded text-xs overflow-auto">
                    {JSON.stringify(order.delivery_address, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-gray-500">¿Tiene dirección de entrega?</p>
                  <span className={`px-2 py-1 rounded ${hasValidAddress(order.delivery_address) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {hasValidAddress(order.delivery_address) ? 'SÍ - Se muestra' : 'NO - Empty state'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-gray-500">API - registration_address:</p>
                  <pre className="bg-gray-100 px-2 py-1 rounded text-xs overflow-auto">
                    {JSON.stringify(order.registration_address, null, 2)}
                  </pre>
                </div>
                <div>
                  <p className="text-gray-500">¿Tiene dirección de registro?</p>
                  <span className={`px-2 py-1 rounded ${hasValidAddress(order.registration_address) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {hasValidAddress(order.registration_address) ? 'SÍ - Se muestra' : 'NO - Empty state'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección 4: Usuario */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-blue-600">Módulo: Datos del Usuario</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">API - first_name:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{order.first_name || 'null'}</code>
              </div>
              <div>
                <p className="text-gray-500">API - middle_name:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{order.middle_name || 'null'}</code>
              </div>
              <div>
                <p className="text-gray-500">API - last_name:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{order.last_name || 'null'}</code>
              </div>
              <div>
                <p className="text-gray-500">Frontend - Nombre completo:</p>
                <span className="bg-green-100 px-2 py-1 rounded">{getFullName(order)}</span>
              </div>
              <div>
                <p className="text-gray-500">API - email_address:</p>
                <code className="bg-gray-100 px-2 py-1 rounded">{order.email_address || 'null'}</code>
              </div>
              <div>
                <p className="text-gray-500">Frontend muestra:</p>
                <span className="bg-green-100 px-2 py-1 rounded">{order.email_address || 'No disponible'}</span>
              </div>
            </div>
          </div>

          {/* Raw JSON */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2 text-blue-600">Datos completos de la API (JSON)</h3>
            <pre className="bg-gray-900 text-green-400 px-4 py-2 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(order, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getStatusDisplay(status: string | null): string {
  if (!status) return 'Desconocido';
  const statuses: Record<string, string> = {
    'CONFIRMED': 'Confirmado',
    'CF': 'Confirmado',
    'confirmed': 'Confirmado',
    'IN_PRODUCTION': 'En Producción',
    'IN': 'En Producción',
    'production': 'En Producción',
    'DELIVERED': 'Entregado',
    'DL': 'Entregado',
    'delivered': 'Entregado',
    'BOOKED': 'Reservado',
    'RN': 'Reservado',
    'reserved': 'Reservado'
  };
  return statuses[status] || status;
}

function getModelDisplay(code: string | null): string {
  if (!code) return 'Desconocido';
  const models: Record<string, string> = {
    'my': 'Model Y',
    'm3': 'Model 3',
    'ms': 'Model S',
    'mx': 'Model X'
  };
  return models[code.toLowerCase()] || code.toUpperCase();
}

function getCountryDisplay(code: string | null): string {
  if (!code) return '🏳️ Desconocido';
  const countries: Record<string, string> = {
    'CO': '🇨🇴 Colombia',
    'US': '🇺🇸 Estados Unidos',
    'MX': '🇲🇽 México'
  };
  return countries[code.toUpperCase()] || `🏳️ ${code.toUpperCase()}`;
}

function formatCurrency(amount: number | null): string {
  if (amount === null || amount === undefined) return 'No disponible';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(amount);
}

function translatePaymentType(type: string | null): string {
  if (!type) return 'No especificado';
  const types: Record<string, string> = {
    'CASH': 'Contado',
    'LOAN': 'Financiamiento',
    'LEASE': 'Leasing'
  };
  return types[type] || type;
}

function hasValidAddress(addr: any): boolean {
  if (!addr || typeof addr !== 'object') return false;
  return !!(addr.address1 || addr.city || addr.state);
}

function getFullName(order: Order): string {
  const parts = [order.first_name, order.middle_name, order.last_name]
    .filter(p => p && p.trim())
    .map(p => p!.trim());
  return parts.length > 0 ? parts.join(' ') : 'No disponible';
}