'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Order } from '@/lib/tesla/types';
import { decodeMktOptions, groupMktOptionsByCategory } from '@/lib/translations/mktOptions';
import { 
  Settings, Paintbrush, Sofa, CircleDot, Gauge, Battery, Box 
} from 'lucide-react';

interface VehicleInfoProps {
  order: Order;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Pintura": return Paintbrush;
    case "Interior": return Sofa;
    case "Rines": return CircleDot;
    case "Autopilot": return Gauge;
    case "Batería":
    case "Motor": return Battery;
    default: return Box;
  }
};

export function VehicleInfo({ order }: VehicleInfoProps) {
  const mktOptions = decodeMktOptions(order.mkt_options);
  const groupedOptions = groupMktOptionsByCategory(mktOptions);

  const formatValue = (value: any, defaultText: string = "No disponible") => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground italic">{defaultText}</span>;
    }
    return value;
  };

  return (
    <div className="space-y-6">
      {/* Configuración */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#E31937]" />
            Configuración del Vehículo
            <InfoTooltip content="Especificaciones y opciones seleccionadas para tu Tesla" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mktOptions.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedOptions).map(([category, options]) => {
                const Icon = getCategoryIcon(category);
                return (
                  <div key={category}>
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <h4 className="text-sm font-semibold">{category}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {options.map((option, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {option.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay información de configuración disponible</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información Técnica */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Battery className="w-5 h-5 text-[#E31937]" />
            Información Técnica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Vehicle ID</p>
              <p className="font-mono text-sm">{formatValue(order.vehicle_id)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Vehicle Map ID</p>
              <p className="font-mono text-sm">{formatValue(order.vehicle_map_id)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ubicación de Enrutamiento</p>
              <p className="font-medium">{formatValue(order.vehicle_routing_location)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Wall Connector</p>
              <Badge variant={order.is_wall_connector ? "default" : "outline"}>
                {order.is_wall_connector ? 'Incluido' : 'No incluido'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Legacy</p>
              <Badge variant={order.is_legacy ? "secondary" : "outline"}>
                {order.is_legacy ? 'Sí' : 'No'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Crédito Fiscal IRA</p>
              <Badge variant={order.eligible_ira_tax_credit ? "default" : "outline"}>
                {order.eligible_ira_tax_credit ? 'Elegible' : 'No elegible'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
