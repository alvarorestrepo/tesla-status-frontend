'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Order } from '@/lib/tesla/types';
import { Calendar, Clock, CalendarX } from 'lucide-react';

interface DatesProps {
  order: Order;
}

export function Dates({ order }: DatesProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return <span className="text-muted-foreground italic">No disponible</span>;
    return new Date(dateString).toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const dateSections = [
    {
      title: 'Proceso de Reserva y Pedido',
      icon: Calendar,
      dates: [
        { label: 'Fecha de Reserva', value: order.reservation_date, tooltip: 'Fecha en que realizaste la reserva inicial' },
        { label: 'Fecha del Pedido', value: order.order_placed_date, tooltip: 'Fecha en que se formalizó el pedido' },
        { label: 'Fecha de Confirmación', value: order.order_booked_date, tooltip: 'Fecha en que Tesla confirmó tu pedido' },
      ]
    },
    {
      title: 'Cancelaciones',
      icon: CalendarX,
      dates: [
        { label: 'Inicio de Cancelación', value: order.order_cancel_initiate_date, tooltip: 'Fecha de solicitud de cancelación' },
        { label: 'Fecha de Cancelación', value: order.order_cancellation_date, tooltip: 'Fecha de confirmación de cancelación' },
      ]
    },
    {
      title: 'Proceso de Entrega',
      icon: Clock,
      dates: [
        { label: 'Fecha de Invitación', value: order.invitation_date, tooltip: 'Fecha de invitación para programar entrega' },
        { label: 'Fecha de Lexicon Marketing', value: order.marketing_lexicon_date, tooltip: 'Fecha de configuración final' },
        { label: 'Fecha de Entrega Esperada', value: order.delivery_due_date, tooltip: 'Fecha estimada de entrega' },
        { label: 'Registro Esperado', value: order.expected_registration_date, tooltip: 'Fecha esperada de registro del vehículo' },
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {dateSections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <section.icon className="w-5 h-5 text-[#E31937]" />
              {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {section.dates.map((date) => (
                <div key={date.label} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">{date.label}</p>
                    {date.tooltip && <InfoTooltip content={date.tooltip} />}
                  </div>
                  <p className="font-medium">{formatDate(date.value)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
