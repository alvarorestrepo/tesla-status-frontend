import { Order } from '@/lib/tesla/types';

export interface FormattedPayment {
  type: string;
  orderType: string | null;
  totalAmount: {
    value: number | null;
    formatted: string;
  };
  reservation: {
    amount: number | null;
    due: number | null;
    received: number | null;
    formatted: {
      amount: string;
      due: string;
      received: string;
    };
  };
  balance: {
    amountDue: number | null;
    amountDueFinancier: number | null;
    accountBalance: number | null;
    formatted: {
      amountDue: string;
      amountDueFinancier: string;
      accountBalance: string;
    };
  };
  currency: string;
  isFullPayment: boolean;
}

export function formatPayment(order: Order): FormattedPayment {
  const currency = order.currency_code || 'COP';
  
  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return 'No disponible';
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: currency 
    }).format(amount);
  };

  const translatePaymentType = (type: string | null): string => {
    if (!type) return 'No especificado';
    const translations: Record<string, string> = {
      'CASH': 'Efectivo',
      'LOAN': 'Financiamiento',
      'LEASE': 'Leasing',
    };
    return translations[type] || type;
  };

  return {
    type: translatePaymentType(order.payment_type),
    orderType: order.order_type,
    totalAmount: {
      value: order.order_amount,
      formatted: formatCurrency(order.order_amount),
    },
    reservation: {
      amount: order.reservation_amount,
      due: order.reservation_amount_due,
      received: order.reservation_amount_received,
      formatted: {
        amount: formatCurrency(order.reservation_amount),
        due: formatCurrency(order.reservation_amount_due),
        received: formatCurrency(order.reservation_amount_received),
      },
    },
    balance: {
      amountDue: order.amount_due,
      amountDueFinancier: order.amount_due_financier,
      accountBalance: order.account_balance,
      formatted: {
        amountDue: formatCurrency(order.amount_due),
        amountDueFinancier: formatCurrency(order.amount_due_financier),
        accountBalance: formatCurrency(order.account_balance),
      },
    },
    currency,
    isFullPayment: order.is_full_payment_order || false,
  };
}
