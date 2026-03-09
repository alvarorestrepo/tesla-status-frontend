import { Order } from '@/lib/tesla/types';
import { decodeMktOptions, groupMktOptionsByCategory } from '@/lib/translations/mktOptions';

export interface FormattedVehicle {
  vin: string | null;
  vehicleId: number | null;
  modelYear: string | null;
  odometer: {
    value: number | null;
    type: string;
  };
  titleStatus: string;
  titleSubStatus: string | null;
  routingLocation: number | null;
  isLegacy: boolean;
  hasWallConnector: boolean;
  isUnbuildable: boolean;
  eligibleTaxCredit: boolean;
  options: ReturnType<typeof decodeMktOptions>;
  groupedOptions: ReturnType<typeof groupMktOptionsByCategory>;
}

export function formatVehicle(order: Order): FormattedVehicle {
  const options = decodeMktOptions(order.mkt_options);
  
  return {
    vin: order.vin,
    vehicleId: order.vehicle_id,
    modelYear: order.vehicle_model_year,
    odometer: {
      value: order.vehicle_odometer,
      type: order.vehicle_odometer_type || 'KM',
    },
    titleStatus: order.vehicle_title_status || 'No especificado',
    titleSubStatus: order.vehicle_title_sub_status,
    routingLocation: order.vehicle_routing_location,
    isLegacy: order.is_legacy || false,
    hasWallConnector: order.is_wall_connector || false,
    isUnbuildable: order.is_unbuildable || false,
    eligibleTaxCredit: order.eligible_ira_tax_credit || false,
    options,
    groupedOptions: groupMktOptionsByCategory(options),
  };
}

export function translateTitleStatus(status: string | null): string {
  if (!status) return 'No especificado';
  const translations: Record<string, string> = {
    'NEW': 'Nuevo',
    'USED': 'Usado',
    'CERTIFIED_PRE_OWNED': 'Certificado Pre-Owned',
  };
  return translations[status] || status;
}
