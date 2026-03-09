'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Order } from '@/lib/tesla/types';
import { Settings, ShoppingCart, Building2, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ConversionProps {
  order: Order;
}

export function Conversion({ order }: ConversionProps) {
  const formatValue = (value: any, defaultText: string = "No disponible") => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground italic">{defaultText}</span>;
    }
    return value;
  };

  return (
    <div className="space-y-6">
      {/* Datos de Conversión */}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#E31937]" />
            Datos de Conversión
            <InfoTooltip content="Información sobre el canal de conversión y origen del pedido" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Canal de Conversión</p>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium">{formatValue(order.conversion_channel)}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Fuente (UTM)</p>
              <p className="font-medium">{formatValue(order.utm_source)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flags del Pedido */}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#E31937]" />
            Flags y Configuraciones
            <InfoTooltip content="Configuraciones especiales y estados del pedido" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pedido B2B</p>
              <Badge variant={order.is_b2b ? 'default' : 'outline'}>
                {order.is_b2b ? 'Sí' : 'No'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pedido Mayorista</p>
              <Badge variant={order.is_wholesale_order ? 'default' : 'outline'}>
                {order.is_wholesale_order ? 'Sí' : 'No'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">No para Venta</p>
              <Badge variant={order.is_not_for_sale ? 'destructive' : 'outline'}>
                {order.is_not_for_sale ? 'Sí' : 'No'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Militar</p>
              <Badge variant={order.is_military ? 'default' : 'outline'}>
                {order.is_military ? 'Sí' : 'No'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pago Completo</p>
              <Badge variant={order.is_full_payment_order ? 'default' : 'outline'}>
                {order.is_full_payment_order ? 'Sí' : 'No'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Swap de Inventario</p>
              <Badge variant={order.is_inventory_swap_available ? 'default' : 'outline'}>
                {order.is_inventory_swap_available === true ? 'Disponible' : 
                 order.is_inventory_swap_available === false ? 'No disponible' : 
                 'No disponible'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información Adicional */}
      
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">Información del Sistema</p>
              <p className="text-sm text-gray-600 mt-1">
                Estos datos son utilizados internamente por Tesla para procesar 
                tu pedido correctamente. No requieren acción por tu parte.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
