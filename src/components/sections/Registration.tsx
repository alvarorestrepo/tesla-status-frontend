'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Order } from '@/lib/tesla/types';
import { IdCard, Calendar, Shield, AlertCircle } from 'lucide-react';

interface RegistrationProps {
  order: Order;
}

export function Registration({ order }: RegistrationProps) {
  const formatValue = (value: any, defaultText: string = "No disponible") => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground italic">{defaultText}</span>;
    }
    return value;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return <span className="text-muted-foreground italic">No disponible</span>;
    return new Date(dateString).toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const translateLicenseStatus = (status: string | null) => {
    if (!status) return formatValue(null);
    const translations: Record<string, string> = {
      'VALID': 'Válida',
      'EXPIRED': 'Expirada',
      'SUSPENDED': 'Suspendida',
      'PENDING': 'Pendiente'
    };
    return translations[status] || status;
  };

  const translateRegistrationStatus = (status: string | null) => {
    if (!status) return formatValue(null);
    const translations: Record<string, string> = {
      'REGISTERED': 'Registrado',
      'PENDING': 'Pendiente',
      'IN_PROCESS': 'En Proceso'
    };
    return translations[status] || status;
  };

  return (
    <div className="space-y-6">
      {/* Información de Placa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <IdCard className="w-5 h-5 text-[#E31937]" />
            Información de Placa
            <InfoTooltip content="Detalles de la placa y registro del vehículo" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Número de Placa</p>
              <p className="font-medium text-lg">{formatValue(order.license_plate_number, "Por asignar")}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estado de la Licencia</p>
              <Badge 
                variant={order.license_status === 'VALID' ? 'default' : 'secondary'}
              >
                {translateLicenseStatus(order.license_status)}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estado de Registro</p>
              <Badge 
                variant={order.registration_status === 'REGISTERED' ? 'default' : 'secondary'}
              >
                {translateRegistrationStatus(order.registration_status)}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Región/Estado Actual</p>
              <p className="font-medium">{formatValue(order.current_registration_state_province)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Expiración del Registro</p>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium">{formatDate(order.registration_expiration_date)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Título del Vehículo */}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#E31937]" />
            Información de Título
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estado del Título</p>
              <Badge variant={order.vehicle_title_status === 'NEW' ? 'default' : 'secondary'}>
                {order.vehicle_title_status === 'NEW' ? 'Nuevo' : 
                 order.vehicle_title_status === 'USED' ? 'Usado' : 
                 order.vehicle_title_status === 'CERTIFIED_PRE_OWNED' ? 'Certificado' : 
                 formatValue(order.vehicle_title_status)}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Subestado del Título</p>
              <p className="font-medium">{formatValue(order.vehicle_title_sub_status)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerta de Documentos */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Información Importante</p>
              <p className="text-sm text-blue-700 mt-1">
                Los documentos de registro y placa serán procesados por Tesla. 
                Recibirás notificaciones cuando estén listos para recoger o 
                cuando se hayan enviado a tu dirección.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
