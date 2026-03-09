/**
 * Cliente para la API de Akamai (akamai-apigateway-vfx.tesla.com)
 * Obtiene datos enriquecidos de pedidos (tasks, entrega, pago, etc.)
 */

import { AkamaiResponse } from './types';

const AKAMAI_API_URL = process.env.AKAMAI_API_URL || 'https://akamai-apigateway-vfx.tesla.com';

/**
 * Obtiene los datos detallados de un pedido desde Akamai
 */
export async function getAkamaiData(
  accessToken: string,
  referenceNumber: string
): Promise<AkamaiResponse> {
  const url = new URL(`${AKAMAI_API_URL}/tasks`);
  url.searchParams.set('deviceLanguage', 'en');
  url.searchParams.set('deviceCountry', 'US');
  url.searchParams.set('referenceNumber', referenceNumber);
  url.searchParams.set('appVersion', '9.99.9-9999');

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.warn(`Error al obtener datos de Akamai para ${referenceNumber}: ${response.status}`);
    return { tasks: {} };
  }

  return response.json();
}

/**
 * Procesa los datos de Akamai y extrae la información relevante
 */
export function processAkamaiData(data: AkamaiResponse, referenceNumber: string) {
  const tasks = data.tasks || {};
  
  const registration = tasks.registration || {};
  const orderDetails = registration.orderDetails || {};
  const regData = registration.regData || {};
  const regDetails = regData.regDetails || {};
  const ownerInfo = regDetails.owner?.user || {};
  
  const scheduling = tasks.scheduling || {};
  const deliveryDetails = scheduling.deliveryDetails || {};
  const registrationAddress = registration.registrationAddress || {};
  
  const financing = tasks.financing || {};
  const financingData = financing.data || {};
  
  const finalPayment = tasks.finalPayment || {};
  const finalPaymentData = finalPayment.data || {};
  
  const deliveryInfo = finalPaymentData.deliveryInfo || {};
  const pickupLocationData = finalPaymentData.pickupLocationAddress || {};

  return {
    // Datos básicos del pedido
    series: orderDetails.series,
    sale_type: orderDetails.saleType,
    
    // Fechas importantes
    reservation_date: orderDetails.reservationDate,
    order_placed_date: orderDetails.orderPlacedDate,
    order_booked_date: orderDetails.orderBookedDate,
    order_cancel_initiate_date: orderDetails.orderCancelInitiateDate,
    order_cancellation_date: orderDetails.orderCancellationDate,
    invitation_date: orderDetails.invitationDate,
    marketing_lexicon_date: orderDetails.marketingLexiconDate,
    
    // Información del vehículo
    vehicle_model_year: orderDetails.vehicleModelYear,
    vehicle_title_status: orderDetails.vehicleTitleStatus,
    vehicle_title_sub_status: orderDetails.vehicleTitleSubStatus,
    vehicle_routing_location: orderDetails.vehicleRoutingLocation,
    vehicle_odometer: orderDetails.vehicleOdometer,
    vehicle_odometer_type: orderDetails.vehicleOdometerType,
    odometer_at_delivery: orderDetails.odometerAtDelivery,
    vehicle_id: orderDetails.vehicleId,
    vehicle_map_id: orderDetails.vehicleMapId,
    is_legacy: orderDetails.isLegacy,
    is_wall_connector: orderDetails.isWallConnector,
    is_unbuildable: orderDetails.isUnbuildable,
    eligible_ira_tax_credit: orderDetails.eligibleIraTaxCredit,
    trim_code: orderDetails.trimCode,
    
    // Información de pago
    payment_type: orderDetails.orderType,
    order_type: orderDetails.orderType,
    reservation_amount: orderDetails.reservationAmountReceived,
    reservation_amount_due: orderDetails.reservationAmountDue,
    reservation_amount_received: orderDetails.reservationAmountReceived,
    amount_due: finalPaymentData.amountDue || orderDetails.amountDue,
    amount_due_financier: finalPaymentData.amountDueFinancier,
    account_balance: finalPaymentData.accountBalance,
    order_amount: orderDetails.orderAmount,
    currency_code: orderDetails.currencyCode,
    is_full_payment_order: orderDetails.isFullPaymentOrder,
    
    // Información de entrega
    delivery_location: scheduling.deliveryAddressTitle,
    delivery_type: orderDetails.deliveryType,
    delivery_location_trt_id: deliveryDetails.pickupLocationTrtId,
    pickup_location: deliveryDetails.pickupLocationTrtId || orderDetails.pickupLocation,
    pickup_zip_code: deliveryDetails.pickUpZipCode,
    delivery_window: scheduling.deliveryWindowDisplay,
    delivery_appointment: scheduling.apptDateTimeAddressStr,
    delivery_appointment_date: orderDetails.appointmentDate,
    delivery_appointment_date_utc: orderDetails.appointmentDateUtc,
    eta_to_delivery_center: finalPaymentData.etaToDeliveryCenter,
    delivery_due_date: orderDetails.deliveryDueDate,
    expected_registration_date: orderDetails.expectedRegistrationDate,
    vehicle_location: orderDetails.vehicleRoutingLocation?.toString(),
    is_available_for_match: orderDetails.isAvailableForMatch,
    
    // Direcciones
    delivery_address: buildDeliveryAddress(deliveryDetails.address, regData.deliveryDetails?.address),
    registration_address: buildRegistrationAddress(registrationAddress),
    
    // Datos del usuario
    user_id: orderDetails.userId,
    email_address: orderDetails.emailAddress || ownerInfo.emailAddress,
    first_name: ownerInfo.firstName,
    middle_name: ownerInfo.middleName,
    last_name: ownerInfo.lastName,
    phone_number: ownerInfo.phoneNumber,
    phone_prefix: ownerInfo.phonePrefix,
    owner_identification_number: orderDetails.ownerIdentificationNumber,
    owner_identification_type: orderDetails.ownerIdentificationType,
    owner_nationality: orderDetails.ownerNationality,
    customer_type: orderDetails.customerType,
    registrant_type: orderDetails.registrantType,
    
    // Estado de placa y registro
    license_plate_number: orderDetails.licensePlateNumber,
    current_registration_state_province: orderDetails.currentRegistrationStateProvince,
    registration_expiration_date: orderDetails.registrationExpirationDate,
    registration_status: orderDetails.registrationStatus,
    license_status: orderDetails.licenseStatus,
    
    // Estado de tareas
    tasks_status: {
      registration: registration.status,
      agreements: tasks.agreements?.status,
      financing: financing.status,
      scheduling: scheduling.status,
      final_payment: finalPayment.status,
    },
    
    // Información de pickup location
    pickup_location_title: pickupLocationData.title,
    pickup_location_city: pickupLocationData.city,
    pickup_location_state: pickupLocationData.stateProvince,
    pickup_location_latitude: pickupLocationData.latitude || deliveryInfo.latitude,
    pickup_location_longitude: pickupLocationData.longitude || deliveryInfo.longitude,
    time_zone_id: pickupLocationData.timeZone?.timeZoneId,
    
    // Flags adicionales
    is_b2b: orderDetails.isB2b,
    is_wholesale_order: orderDetails.isWholeSaleOrder,
    is_not_for_sale: orderDetails.isNotForSale,
    has_proof_of_payment: orderDetails.hasProofOfPayment,
    has_voided_check: orderDetails.hasVoidedCheck,
    can_display_acknowledgement: orderDetails.canDisplayAcknowledgement,
    is_any_acknowledgement_pending: orderDetails.acknowledgement?.isAnyAcknowledgementPending,
    is_inventory_swap_available: orderDetails.isInventorySwapAvailable,
    is_military: orderDetails.isMilitary,
    
    // Financiamiento
    financing_intent: orderDetails.financingIntent,
    finance_application_status: orderDetails.financeApplicationStatus,
    finance_offer_status: orderDetails.financeOfferStatus,
    
    // Trade-in
    trade_in_intent: orderDetails.tradeInIntent,
    trade_in_vin: orderDetails.tradeInVIN,
    is_trade_in_confirmed: orderDetails.isTradeInConfirmed,
    
    // Documentos
    has_mvpa_doc: orderDetails.hasMvpaDoc,
    is_docs_being_regenerated: orderDetails.isDocsBeingRegenerated,
    final_invoice_exists: orderDetails.finalInvoiceExists,
    has_final_invoice: orderDetails.hasFinalInvoice,
    
    // Conversión
    conversion_channel: orderDetails.conversionChannel,
    utm_source: orderDetails.utmSource,
  };
}

function buildDeliveryAddress(deliveryAddr: any, deliveryAddrReg: any) {
  const addr = deliveryAddr || deliveryAddrReg;
  if (!addr) return null;
  
  return {
    address1: addr.address1 || deliveryAddrReg?.address1,
    address2: addr.address2 || deliveryAddrReg?.address2,
    city: addr.city || deliveryAddrReg?.city,
    state: addr.stateProvince || deliveryAddrReg?.stateProvince,
    zip: addr.zipCode || deliveryAddrReg?.zipCode,
    country: addr.countryCode || deliveryAddrReg?.countryCode,
    isUspsValidated: addr.isUspsValidated || deliveryAddrReg?.isUspsValidated,
  };
}

function buildRegistrationAddress(regAddr: any) {
  if (!regAddr) return null;
  
  return {
    address1: regAddr.address1,
    address2: regAddr.address2,
    city: regAddr.city,
    state: regAddr.stateProvince,
    country: regAddr.countryCode,
  };
}
