'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Order } from '@/lib/tesla/types';
import { BarChart3, AlertCircle, CheckCircle2, FileText } from 'lucide-react';

interface FinancingProps {
  order: Order;
}

export function Financing({ order }: FinancingProps) {
  const formatValue = (value: any, defaultText: string = "No disponible") => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground italic">{defaultText}</span>;
    }
    return value;
  };

  const translateFinanceStatus = (status: string | null) => {
    if (!status) return formatValue(null);
    const translations: Record<string, string> = {
      'APPROVED': 'Aprobado',
      'PENDING': 'Pendiente',
      'REJECTED': 'Rechazado',
      'IN_REVIEW': 'En Revisión',
      'CONDITIONAL': 'Aprobado Condicionalmente'
    };
    return translations[status] || status;
  };

  // Validación correcta: !== null && !== undefined
  const hasFinancing = 
    order.financing_intent !== null || 
    order.finance_application_status !== null ||
    order.finance_offer_status !== null;

  if (!hasFinancing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#E31937]" />
            Financiamiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay información de financiamiento</p>
            <p className="text-sm mt-1">Este pedido no requiere financiamiento</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estado del Financiamiento */}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#E31937]" />
            Estado del Financiamiento
            <InfoTooltip content="Información sobre tu aplicación de financiamiento" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Intención de Financiamiento</p>
              <Badge variant={order.financing_intent ? 'default' : 'outline'}>
                {order.financing_intent ? 'Sí' : 'No'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estado de Aplicación</p>
              <Badge 
                variant={
                  order.finance_application_status === 'APPROVED' ? 'default' :
                  order.finance_application_status === 'REJECTED' ? 'destructive' :
                  'secondary'
                }
              >
                {translateFinanceStatus(order.finance_application_status)}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estado de la Oferta</p>
              <p className="font-medium">{formatValue(order.finance_offer_status)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#E31937]" />
            Documentos Financieros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Comprobante de Pago</p>
              <Badge variant={order.has_proof_of_payment ? 'default' : 'outline'}>
                {order.has_proof_of_payment ? 'Entregado' : 'Pendiente'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cheque Anulado</p>
              <Badge variant={order.has_voided_check ? 'default' : 'outline'}>
                {order.has_voided_check ? 'Entregado' : 'Pendiente'}
              </Badge>
            </div>
          </div>        
        </CardContent>
      </Card>

      {/* Alerta */}
      
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Información sobre Financiamiento</p>
              <p className="text-sm text-blue-700 mt-1">
                El proceso de financiamiento puede tomar de 1 a 5 días hábiles. 
                Te notificaremos cuando haya actualizaciones sobre tu aplicación. 
                Asegúrate de tener todos los documentos requeridos listos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}