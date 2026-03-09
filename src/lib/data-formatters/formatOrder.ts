import { Order } from '@/lib/tesla/types';
import { decodeStatus, getStatusInfoByProgress } from '@/lib/translations/statuses';
import { decodeOrderSubstatus } from '@/lib/translations/taskStatuses';
import { decodeCountry } from '@/lib/translations/countries';
import { decodeModel } from '@/lib/translations/models';

export interface FormattedOrder {
  referenceNumber: string;
  model: string;
  status: {
    name: string;
    progress: number;
    color: string;
  };
  substatus: {
    name: string;
    description?: string;
  } | null;
  country: {
    name: string;
    flag: string;
  };
  vin: string | null;
  series: string | null;
  saleType: string;
  trimCode: string | null;
  isUsed: boolean;
}

export function formatOrder(order: Order): FormattedOrder {
  const statusInfo = decodeStatus(order.order_status);
  const substatusInfo = decodeOrderSubstatus(order.order_substatus);
  const countryInfo = decodeCountry(order.country_code);

  return {
    referenceNumber: order.reference_number,
    model: decodeModel(order.model_code),
    status: {
      name: statusInfo.name,
      progress: statusInfo.progress,
      color: statusInfo.color,
    },
    substatus: order.order_substatus ? {
      name: substatusInfo.name,
      description: substatusInfo.description,
    } : null,
    country: countryInfo,
    vin: order.vin,
    series: order.series,
    saleType: order.sale_type || 'No especificado',
    trimCode: order.trim_code,
    isUsed: order.is_used || false,
  };
}

export function formatOrderProgress(order: Order): number {
  if (order.order_status === 'DELIVERED' || order.order_status === 'DL' || order.order_status === 'delivered') {
    return 100;
  }
  
  if (order.delivery_appointment && order.delivery_appointment !== 'No agendada') {
    return 90;
  }
  
  if (order.vehicle_location || order.eta_to_delivery_center) {
    return 80;
  }
  
  if (order.vin && order.vin !== 'Por asignar' && order.vin !== '') {
    return 65;
  }
  
  if (order.order_status === 'IN_PRODUCTION' || order.order_status === 'IN' || order.order_status === 'production') {
    return 50;
  }
  
  if (order.order_status === 'CONFIRMED' || order.order_status === 'CF' || order.order_status === 'confirmed') {
    return 25;
  }
  
  return 10;
}

export function getStatusByProgress(progress: number) {
  return getStatusInfoByProgress(progress);
}
