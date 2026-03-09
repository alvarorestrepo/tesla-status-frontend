import { Order } from '@/lib/tesla/types';

export interface FormattedDates {
  reservation: Date | null;
  orderPlaced: Date | null;
  orderBooked: Date | null;
  cancellation: {
    initiated: Date | null;
    completed: Date | null;
  };
  invitation: Date | null;
  marketingLexicon: Date | null;
  deliveryDue: Date | null;
  expectedRegistration: Date | null;
  formatted: {
    reservation: string;
    orderPlaced: string;
    orderBooked: string;
    cancellationInitiated: string;
    cancellationCompleted: string;
    invitation: string;
    marketingLexicon: string;
    deliveryDue: string;
    expectedRegistration: string;
  };
}

export function formatDates(order: Order): FormattedDates {
  const parseDate = (dateStr: string | null): Date | null => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  const formatDate = (date: Date | null): string => {
    if (!date) return 'No disponible';
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const reservation = parseDate(order.reservation_date);
  const orderPlaced = parseDate(order.order_placed_date);
  const orderBooked = parseDate(order.order_booked_date);
  const cancellationInitiated = parseDate(order.order_cancel_initiate_date);
  const cancellationCompleted = parseDate(order.order_cancellation_date);
  const invitation = parseDate(order.invitation_date);
  const marketingLexicon = parseDate(order.marketing_lexicon_date);
  const deliveryDue = parseDate(order.delivery_due_date);
  const expectedRegistration = parseDate(order.expected_registration_date);

  return {
    reservation,
    orderPlaced,
    orderBooked,
    cancellation: {
      initiated: cancellationInitiated,
      completed: cancellationCompleted,
    },
    invitation,
    marketingLexicon,
    deliveryDue,
    expectedRegistration,
    formatted: {
      reservation: formatDate(reservation),
      orderPlaced: formatDate(orderPlaced),
      orderBooked: formatDate(orderBooked),
      cancellationInitiated: formatDate(cancellationInitiated),
      cancellationCompleted: formatDate(cancellationCompleted),
      invitation: formatDate(invitation),
      marketingLexicon: formatDate(marketingLexicon),
      deliveryDue: formatDate(deliveryDue),
      expectedRegistration: formatDate(expectedRegistration),
    },
  };
}
