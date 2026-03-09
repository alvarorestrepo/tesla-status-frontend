'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Order } from '@/lib/tesla/types';
import { ArrowLeftRight, Car, CheckCircle2 } from 'lucide-react';

interface TradeInProps {
  order: Order;
}

export function TradeIn({ order }: TradeInProps) {
  // Validación correcta: !== null && !== undefined
  const hasTradeIn = 
    order.trade_in_intent !== null || 
    order.trade_in_vin !== null ||
    order.is_trade_in_confirmed !== null;

  if (!hasTradeIn) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-[#E31937]" />
            Trade-In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Car className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay vehículo para trade-in</p>
            <p className="text-sm mt-1">Este pedido no incluye un vehículo de cambio</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información del Trade-In */}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-[#E31937]" />
            Información del Trade-In
            <InfoTooltip content="Detalles del vehículo que estás entregando como parte de pago" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Intención de Trade-In</p>
              <Badge variant={order.trade_in_intent ? 'default' : 'outline'}>
                {order.trade_in_intent === 'YES' ? 'Sí' : 
                 order.trade_in_intent === 'NO' ? 'No' : 
                 order.trade_in_intent || 'No especificado'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">VIN del Vehículo</p>
              <p className="font-mono text-sm">{order.trade_in_vin || 'No proporcionado'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estado del Trade-In</p>
              <Badge variant={order.is_trade_in_confirmed ? 'default' : 'secondary'}>
                {order.is_trade_in_confirmed ? 'Confirmado' : 'Pendiente'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instrucciones */}
      
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-green-900">Proceso de Trade-In</p>
              <p className="text-sm text-green-700 mt-1">
                El vehículo de trade-in será evaluado en el momento de la entrega. 
                Asegúrate de tener todos los documentos del vehículo (título, registro, 
                llaves) listos para el día de la entrega de tu nuevo Tesla.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}