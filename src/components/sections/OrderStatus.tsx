'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrderTimeline } from '@/components/OrderTimeline';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/lib/tesla/types';
import { decodeModel } from '@/lib/translations/models';
import { decodeCountry } from '@/lib/translations/countries';
import { decodeStatus, getStatusInfoByProgress } from '@/lib/translations/statuses';
import { decodeOrderSubstatus } from '@/lib/translations/taskStatuses';
import { Activity, Key, MapPin, Info, AlertCircle, CheckCircle2 } from 'lucide-react';

interface OrderStatusProps {
  order: Order;
  progress: number;
}

/**
 * Calcula el progreso basado en hitos alcanzados (VIN, ubicación, cita, etc.)
 * Esto puede diferir del estado oficial del pedido
 */
function calculateMilestoneProgress(order: Order): number {
  // Si está entregado, siempre 100%
  if (order.order_status === 'DELIVERED' || order.order_status === 'DL') {
    return 100;
  }
  
  // Si tiene cita de entrega programada
  if (order.delivery_appointment && order.delivery_appointment !== 'No agendada') {
    return 90;
  }
  
  // Si el vehículo está en tránsito o tiene ETA
  if (order.vehicle_location || order.eta_to_delivery_center) {
    return 80;
  }
  
  // Si tiene VIN asignado (¡ESTE ES TU CASO!)
  if (order.vin && order.vin !== 'Por asignar' && order.vin !== '') {
    return 65;
  }
  
  // Si está en producción
  if (order.order_status === 'IN_PRODUCTION' || order.order_status === 'IN') {
    return 50;
  }
  
  // Si está confirmado
  if (order.order_status === 'CONFIRMED' || order.order_status === 'CF') {
    return 25;
  }
  
  // Estado inicial
  return 10;
}

export function OrderStatus({ order, progress }: OrderStatusProps) {
  const statusInfo = getStatusInfoByProgress(progress);
  const countryInfo = decodeCountry(order.country_code);
  const substatusInfo = decodeOrderSubstatus(order.order_substatus);
  
  // Calcular progreso por hitos
  const milestoneProgress = calculateMilestoneProgress(order);
  const milestoneStatus = getStatusInfoByProgress(milestoneProgress);
  
  // Decodificar estado oficial
  const officialStatus = decodeStatus(order.order_status);
  
  // Detectar si hay discrepancia entre estado oficial y hitos
  const hasDiscrepancy = officialStatus.progress !== milestoneProgress;
  const hasVIN = order.vin && order.vin !== 'Por asignar' && order.vin !== '';

  return (
    <div className="space-y-6">
      {/* Timeline de progreso - Basado en hitos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#E31937]" />
            Progreso del Pedido
            <InfoTooltip content="Progreso basado en hitos alcanzados: VIN asignado, ubicación del vehículo, cita programada, etc." />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrderTimeline currentProgress={milestoneProgress} />
        </CardContent>
      </Card>

      {/* Resumen del Estado - OPCIÓN 3: Mostrar ambos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="w-5 h-5 text-[#E31937]" />
            Resumen del Estado
            <InfoTooltip content="Estado oficial de Tesla vs. hitos alcanzados en tu pedido" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Estado Oficial */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estado Oficial</p>
              <div className="flex items-center gap-2">
                <Badge variant={officialStatus.color} className="text-sm">
                  {officialStatus.name}
                </Badge>
                <span className="text-sm text-muted-foreground">({officialStatus.progress}%)</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Según el sistema de Tesla
              </p>
            </div>

            {/* Progreso por Hitos */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Progreso por Hitos</p>
              <div className="flex items-center gap-2">
                <Badge variant={milestoneStatus.color} className="text-sm">
                  {milestoneStatus.name}
                </Badge>
                <span className="text-sm text-muted-foreground">({milestoneProgress}%)</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Basado en logros de tu pedido
              </p>
            </div>

            {/* Alerta de discrepancia */}
            {hasDiscrepancy && (
              <div className="md:col-span-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Estado en progreso
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      {hasVIN 
                        ? `Tu pedido está oficialmente "${officialStatus.name}" pero ya tienes VIN asignado (${order.vin}), lo cual indica un avance significativo en el proceso.`
                        : `Hay una diferencia entre el estado oficial y los hitos alcanzados. Esto es normal durante las transiciones entre etapas.`
                      }
                    </p>
                  </div>
                </div>
              </div>
            )}

            {order.order_substatus && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Subestado</p>
                <p className="font-medium">{substatusInfo.name}</p>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Modelo</p>
              <p className="font-medium">{decodeModel(order.model_code)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">País</p>
              <p className="font-medium">{countryInfo.flag} {countryInfo.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">VIN</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm">{order.vin || 'Por asignar'}</p>
                {hasVIN && (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                )}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Referencia</p>
              <p className="font-mono text-sm">#{order.reference_number}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
