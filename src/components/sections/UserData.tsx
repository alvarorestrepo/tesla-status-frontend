'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Order } from '@/lib/tesla/types';
import { User, Phone, Mail, IdCard, Globe } from 'lucide-react';

interface UserDataProps {
  order: Order;
}

export function UserData({ order }: UserDataProps) {
  const formatValue = (value: any, defaultText: string = "No disponible") => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground italic">{defaultText}</span>;
    }
    return value;
  };

  // Construir nombre completo de forma segura
  const firstName = order.first_name?.trim();
  const middleName = order.middle_name?.trim();
  const lastName = order.last_name?.trim();
  
  const nameParts = [firstName, middleName, lastName].filter(part => part && part.length > 0);
  const fullName = nameParts.length > 0 ? nameParts.join(' ') : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="w-5 h-5 text-[#E31937]" />
          Datos del Propietario
          <InfoTooltip content="Información personal del propietario registrado del vehículo" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Información Personal */}
        <div>
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <IdCard className="w-4 h-4 text-muted-foreground" />
            Información Personal
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nombre Completo</p>
              <p className="font-medium">{formatValue(fullName)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tipo de Cliente</p>
              <p className="font-medium capitalize">{formatValue(order.customer_type)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tipo de Registrante</p>
              <p className="font-medium">{formatValue(order.registrant_type)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">User ID</p>
              <p className="font-mono text-sm">{formatValue(order.user_id)}</p>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Información de Contacto
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{formatValue(order.email_address)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Teléfono</p>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium">
                  {order.phone_prefix && `${order.phone_prefix} `}
                  {formatValue(order.phone_number)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documento de Identidad */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <IdCard className="w-4 h-4 text-muted-foreground" />
            Documento de Identidad
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Número de Identificación</p>
              <p className="font-medium">{formatValue(order.owner_identification_number)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tipo de Identificación</p>
              <p className="font-medium">{formatValue(order.owner_identification_type)}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nacionalidad</p>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <p className="font-medium">{formatValue(order.owner_nationality)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}