'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Order } from '@/lib/tesla/types';
import { CreditCard, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';

interface PaymentInfoProps {
  order: Order;
}

export function PaymentInfo({ order }: PaymentInfoProps) {
  const formatCurrency = (amount: number | null | undefined, currency: string = 'COP') => {
    if (amount === null || amount === undefined) {
      return <span className="text-muted-foreground italic">No disponible</span>;
    }
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: currency 
    }).format(amount);
  };

  const translatePaymentType = (type: string | null) => {
    if (!type) return <span className="text-muted-foreground italic">No especificado</span>;
    const translations: Record<string, string> = {
      'CASH': 'Contado',
      'LOAN': 'Financiamiento',
      'LEASE': 'Leasing',
      'CASH_LOAN': 'Contado o Financiamiento'
    };
    return translations[type] || type;
  };

  // Validación correcta: null/undefined !== 0
  const hasAmountDue = order.amount_due !== null && order.amount_due !== undefined;
  const isPaid = hasAmountDue && order.amount_due === 0;
  const hasBalance = hasAmountDue && order.amount_due! > 0;

  return (
    <div className="space-y-6">
      {/* Resumen de Pago */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#E31937]" />
            Resumen de Pago
            <InfoTooltip content="Desglose de pagos realizados y pendientes para tu pedido" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Monto Total */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1">Monto Total del Pedido</p>
            <p className="text-2xl font-bold">
              {formatCurrency(order.order_amount, order.currency_code || 'COP')}
            </p>
          </div>

          {/* Detalles de Pago */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Método de Pago</p>
              <Badge variant="secondary">
                {translatePaymentType(order.payment_type)}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tipo de Orden</p>
              <p className="font-medium">{order.order_type || 'N/A'}</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Reserva Pagada</p>
              <p className="font-medium text-green-600">
                {formatCurrency(order.reservation_amount, order.currency_code || 'COP')}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Reserva Recibida</p>
              <p className="font-medium text-green-600">
                {formatCurrency(order.reservation_amount_received, order.currency_code || 'COP')}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Reserva Pendiente</p>
              <p className="font-medium">
                {formatCurrency(order.reservation_amount_due, order.currency_code || 'COP')}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Balance de Cuenta</p>
              <p className="font-medium">
                {formatCurrency(order.account_balance, order.currency_code || 'COP')}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cantidad Enviada</p>
              <p className="font-medium text-blue-600">
                {formatCurrency(order.amount_sent, order.currency_code || 'COP')}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pago Final Accesible</p>
              <Badge variant={order.final_payment_accessible ? 'default' : 'secondary'}>
                {order.final_payment_accessible === true ? 'Sí' : 
                 order.final_payment_accessible === false ? 'No' : 
                 'No disponible'}
              </Badge>
            </div>
          </div>

          {/* Saldo Pendiente Destacado - CORREGIDO */}
          {hasAmountDue ? (
            <div className={`p-4 rounded-lg border ${
              hasBalance 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start gap-3">
                {hasBalance ? (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Pendiente</p>
                  <p className={`text-xl font-bold ${
                    hasBalance ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatCurrency(order.amount_due, order.currency_code || 'COP')}
                  </p>
                  {hasBalance ? (
                    <p className="text-sm text-red-600 mt-1">
                      Debes realizar este pago antes de la entrega
                    </p>
                  ) : (
                    <p className="text-sm text-green-600 mt-1">
                      ¡Todo pagado! Tu pedido está listo para entrega
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg border bg-gray-50 border-gray-200">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Pendiente</p>
                  <p className="text-xl font-bold text-gray-600">
                    No disponible
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    La información de saldo no está disponible en este momento
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Monto Debido al Financiero */}
          {order.amount_due_financier !== null && order.amount_due_financier !== undefined && order.amount_due_financier > 0 && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-muted-foreground">Monto a Pagar al Financiero</p>
              <p className="text-lg font-semibold text-blue-700">
                {formatCurrency(order.amount_due_financier, order.currency_code || 'COP')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}