'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Order } from '@/lib/tesla/types';
import { decodeModel } from '@/lib/translations/models';
import { decodeCountry } from '@/lib/translations/countries';
import { decodeStatus } from '@/lib/translations/statuses';
import { decodeOrderSubstatus } from '@/lib/translations/taskStatuses';
import { FileText, Info, Car, MapPin } from 'lucide-react';

interface OrderDataProps {
  order: Order;
}

export function OrderData({ order }: OrderDataProps) {
  const countryInfo = decodeCountry(order.country_code);
  const statusInfo = decodeStatus(order.order_status);
  const substatusInfo = decodeOrderSubstatus(order.order_substatus);

  const formatValue = (value: any, defaultText: string = "No disponible") => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground italic">{defaultText}</span>;
    }
    return value;
  };

  const translateSaleType = (type: string | null) => {
    if (!type) return formatValue(null);
    const translations: Record<string, string> = {
      'ORDER': 'Pedido',
      'INVENTORY': 'Inventario'
    };
    return translations[type] || type;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#E31937]" />
          Datos del Pedido
          <InfoTooltip content="Información básica y de referencia de tu pedido Tesla" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información Principal */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            Información Principal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Número de Referencia</p>
              <p className="font-mono text-sm">#{order.reference_number}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Modelo</p>
              <p className="font-medium">{decodeModel(order.model_code)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estado</p>
              <Badge variant={statusInfo.color}>{statusInfo.name}</Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Subestado</p>
              <p className="font-medium">{formatValue(substatusInfo.name, "N/A")}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">País</p>
              <p className="font-medium">{countryInfo.flag} {countryInfo.name}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tipo de Venta</p>
              <p className="font-medium">{translateSaleType(order.sale_type)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Serie</p>
              <p className="font-medium">{formatValue(order.series)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Trim Code</p>
              <p className="font-mono text-sm">{formatValue(order.trim_code)}</p>
            </div>
          </div>
        </div>

        {/* Información del Vehículo */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Car className="w-4 h-4 text-muted-foreground" />
            Información del Vehículo
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">VIN</p>
              <p className="font-mono text-sm">{formatValue(order.vin, "Por asignar")}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Placa</p>
              <p className="font-medium">{formatValue(order.license_plate_number, "Por asignar")}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Odómetro</p>
              <p className="font-medium">
                {order.vehicle_odometer !== null 
                  ? `${order.vehicle_odometer} ${order.vehicle_odometer_type || 'KM'}`
                  : formatValue(null)
                }
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Año del Modelo</p>
              <p className="font-medium">{formatValue(order.vehicle_model_year)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estado del Vehículo</p>
              <p className="font-medium">{order.is_used ? 'Usado' : 'Nuevo'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Vehicle ID</p>
              <p className="font-mono text-sm">{formatValue(order.vehicle_id)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
