'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Order } from '@/lib/tesla/types';
import { Truck, MapPin, Clock, Calendar, Navigation } from 'lucide-react';

interface DeliveryAddressProps {
  order: Order;
}

export function DeliveryAddress({ order }: DeliveryAddressProps) {
  // Validación más robusta - verificar que el objeto existe y tiene datos reales
  const hasDeliveryAddress = order.delivery_address && 
    typeof order.delivery_address === 'object' &&
    (order.delivery_address.address1 || order.delivery_address.city);
  
  const hasRegistrationAddress = order.registration_address && 
    typeof order.registration_address === 'object' &&
    (order.registration_address.address1 || order.registration_address.city);

  const formatAddressLine = (line: string | undefined | null) => {
    if (!line || line.trim() === '') return null;
    return line.trim();
  };

  return (
    <div className="space-y-6">
      {/* Dirección de Entrega */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#E31937]" />
            Dirección de Entrega
            <InfoTooltip content="Dirección donde se entregará tu vehículo Tesla" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasDeliveryAddress ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#E31937] mt-0.5" />
                  <div className="flex-1">
                    {formatAddressLine(order.delivery_address!.address1) && (
                      <p className="font-medium">{order.delivery_address!.address1}</p>
                    )}
                    {formatAddressLine(order.delivery_address!.address2) && (
                      <p className="text-muted-foreground">{order.delivery_address!.address2}</p>
                    )}
                    {(order.delivery_address!.city || order.delivery_address!.state) && (
                      <p className="text-muted-foreground">
                        {order.delivery_address!.city}{order.delivery_address!.city && order.delivery_address!.state ? ', ' : ''}{order.delivery_address!.state} {order.delivery_address!.zip}
                      </p>
                    )}
                    {order.delivery_address!.country && (
                      <p className="text-muted-foreground">{order.delivery_address!.country}</p>
                    )}
                  </div>
                </div>
              </div>

              {order.delivery_address!.isUspsValidated !== undefined && (
                <div className="flex items-center gap-2">
                  <p className="text-sm text-muted-foreground">Validación USPS:</p>
                  <Badge variant={order.delivery_address!.isUspsValidated ? "default" : "outline"}>
                    {order.delivery_address!.isUspsValidated ? 'Validada' : 'No validada'}
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay dirección de entrega configurada</p>
              <p className="text-sm mt-1">La dirección aparecerá cuando esté disponible</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dirección de Registro */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="w-5 h-5 text-[#E31937]" />
            Dirección de Registro
            <InfoTooltip content="Dirección asociada al registro legal del vehículo" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasRegistrationAddress ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Navigation className="w-5 h-5 text-[#E31937] mt-0.5" />
                  <div className="flex-1">
                    {formatAddressLine(order.registration_address!.address1) && (
                      <p className="font-medium">{order.registration_address!.address1}</p>
                    )}
                    {formatAddressLine(order.registration_address!.address2) && (
                      <p className="text-muted-foreground">{order.registration_address!.address2}</p>
                    )}
                    {(order.registration_address!.city || order.registration_address!.state) && (
                      <p className="text-muted-foreground">
                        {order.registration_address!.city}{order.registration_address!.city && order.registration_address!.state ? ', ' : ''}{order.registration_address!.state}
                      </p>
                    )}
                    {order.registration_address!.country && (
                      <p className="text-muted-foreground">{order.registration_address!.country}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Navigation className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay dirección de registro configurada</p>
              <p className="text-sm mt-1">La dirección aparecerá cuando esté disponible</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}