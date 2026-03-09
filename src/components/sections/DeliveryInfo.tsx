'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Order } from '@/lib/tesla/types';
import { Truck, MapPin, Clock, Calendar, Navigation } from 'lucide-react';

interface DeliveryInfoProps {
  order: Order;
}

export function DeliveryInfo({ order }: DeliveryInfoProps) {
  const formatValue = (value: any, defaultText: string = "No disponible") => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground italic">{defaultText}</span>;
    }
    return value;
  };

  const translateDeliveryType = (type: string | null) => {
    if (!type) return formatValue(null);
    const translations: Record<string, string> = {
      'PICKUP_SERVICE_CENTER': 'Recoger en Centro de Servicio',
      'PICKUP_DELIVERY_CENTER': 'Recoger en Centro de Entrega',
      'HOME_DELIVERY': 'Entrega a Domicilio',
      'DELIVERY_TO_ADDRESS': 'Entrega a Domicilio',
      'SELF_ARRANGED': 'Entrega Autogestionada'
    };
    return translations[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Información de Entrega */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#E31937]" />
            Información de Entrega
            <InfoTooltip content="Detalles sobre cómo y cuándo se realizará la entrega de tu Tesla" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tipo de Entrega</p>
              <p className="font-medium">{translateDeliveryType(order.delivery_type)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ubicación de Entrega</p>
              <p className="font-medium">{formatValue(order.delivery_location)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ventana de Entrega</p>
              <p className="font-medium">{formatValue(order.delivery_window, "No programada")}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cita de Entrega</p>
              <p className="font-medium">{formatValue(order.delivery_appointment, "No agendada")}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Fecha Cita (Local)</p>
              <p className="font-medium">{formatValue(order.delivery_appointment_date)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Fecha Cita (UTC)</p>
              <p className="font-mono text-sm">{formatValue(order.delivery_appointment_date_utc)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ubicación del Vehículo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#E31937]" />
            Ubicación del Vehículo
            <InfoTooltip content="Ubicación actual del vehículo y tiempo estimado de llegada" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ubicación Actual</p>
              <p className="font-medium">{formatValue(order.vehicle_location)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">ETA al Centro</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium">{formatValue(order.eta_to_delivery_center)}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Disponible para Match</p>
              <Badge variant={order.is_available_for_match ? "default" : "outline"}>
                {order.is_available_for_match ? 'Sí' : 'No'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Centro de Recogida */}
      {(order.pickup_location || order.pickup_location_title) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#E31937]" />
              Centro de Recogida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nombre</p>
                <p className="font-medium">{formatValue(order.pickup_location_title)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ciudad</p>
                <p className="font-medium">{formatValue(order.pickup_location_city)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Estado/Provincia</p>
                <p className="font-medium">{formatValue(order.pickup_location_state)}</p>
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Código Postal</p>
                <p className="font-medium">{formatValue(order.pickup_zip_code)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Programación de Entrega */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#E31937]" />
            Programación de Entrega
            <InfoTooltip content="Estado de la programación y opciones de auto-agendamiento" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Listo para Aceptar</p>
              <Badge variant={order.ready_to_accept ? "default" : "outline"}>
                {order.ready_to_accept ? 'Sí' : 'No'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Más de 2 Semanas</p>
              <Badge variant={order.is_more_than_two_weeks ? "secondary" : "outline"}>
                {order.is_more_than_two_weeks ? 'Sí' : 'No'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Auto-Agendamiento Disponible</p>
              <Badge variant={order.is_self_scheduling_available ? "default" : "secondary"}>
                {order.is_self_scheduling_available ? 'Sí' : 'No'}
              </Badge>
            </div>

            {order.self_scheduling_url && (
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-muted-foreground">Enlace de Auto-Agendamiento</p>
                <a 
                  href={order.self_scheduling_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[#E31937] hover:underline font-medium break-all"
                >
                  {order.self_scheduling_url}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
