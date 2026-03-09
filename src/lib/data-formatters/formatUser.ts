import { Order } from '@/lib/tesla/types';

export interface FormattedUser {
  userId: number | null;
  name: {
    first: string | null;
    middle: string | null;
    last: string | null;
    full: string;
  };
  contact: {
    email: string | null;
    phone: {
      prefix: string | null;
      number: string | null;
      full: string;
    };
  };
  identification: {
    number: string | null;
    type: string | null;
    nationality: string | null;
  };
  type: {
    customer: string | null;
    registrant: string | null;
  };
}

export function formatUser(order: Order): FormattedUser {
  const firstName = order.first_name;
  const middleName = order.middle_name;
  const lastName = order.last_name;
  
  const fullName = [firstName, middleName, lastName]
    .filter(Boolean)
    .join(' ') || 'No disponible';

  const phonePrefix = order.phone_prefix || '';
  const phoneNumber = order.phone_number || '';

  return {
    userId: order.user_id,
    name: {
      first: firstName,
      middle: middleName,
      last: lastName,
      full: fullName,
    },
    contact: {
      email: order.email_address,
      phone: {
        prefix: order.phone_prefix,
        number: order.phone_number,
        full: phonePrefix && phoneNumber ? `${phonePrefix} ${phoneNumber}` : 'No disponible',
      },
    },
    identification: {
      number: order.owner_identification_number,
      type: order.owner_identification_type,
      nationality: order.owner_nationality,
    },
    type: {
      customer: order.customer_type,
      registrant: order.registrant_type,
    },
  };
}
