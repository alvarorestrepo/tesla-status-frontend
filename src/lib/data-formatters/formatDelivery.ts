import { Order } from '@/lib/tesla/types';

export interface FormattedDelivery {
  type: string;
  location: string | null;
  window: string | null;
  appointment: {
    display: string | null;
    date: string | null;
    dateUTC: string | null;
  };
  vehicleLocation: string | null;
  etaToCenter: string | null;
  pickupLocation: {
    id: number | null;
    title: string | null;
    city: string | null;
    state: string | null;
    zipCode: string | null;
    coordinates: {
      lat: number | null;
      lng: number | null;
    };
    timeZone: string | null;
  };
  isAvailableForMatch: boolean;
}

export function formatDelivery(order: Order): FormattedDelivery {
  const translateDeliveryType = (type: string | null): string => {
    if (!type) return 'No especificado';
    const translations: Record<string, string> = {
      'PICKUP_SERVICE_CENTER': 'Recoger en Centro de Servicio',
      'PICKUP_DELIVERY_CENTER': 'Recoger en Centro de Entrega',
      'HOME_DELIVERY': 'Entrega a Domicilio',
      'DELIVERY_TO_ADDRESS': 'Entrega a Domicilio',
      'SELF_ARRANGED': 'Entrega Autogestionada',
    };
    return translations[type] || type;
  };

  return {
    type: translateDeliveryType(order.delivery_type),
    location: order.delivery_location,
    window: order.delivery_window,
    appointment: {
      display: order.delivery_appointment,
      date: order.delivery_appointment_date,
      dateUTC: order.delivery_appointment_date_utc,
    },
    vehicleLocation: order.vehicle_location,
    etaToCenter: order.eta_to_delivery_center,
    pickupLocation: {
      id: order.pickup_location,
      title: order.pickup_location_title,
      city: order.pickup_location_city,
      state: order.pickup_location_state,
      zipCode: order.pickup_zip_code,
      coordinates: {
        lat: order.pickup_location_latitude,
        lng: order.pickup_location_longitude,
      },
      timeZone: order.time_zone_id,
    },
    isAvailableForMatch: order.is_available_for_match || false,
  };
}
