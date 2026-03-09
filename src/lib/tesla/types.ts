/**
 * Tipos TypeScript para la API de Tesla y Akamai
 * Basado en el backend Python orders.py
 */

// Tipos básicos
export interface DeliveryAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip?: string;
  country: string;
  isUspsValidated?: boolean;
}

export interface RegistrationAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
}

export interface TasksStatus {
  registration?: string | null;
  agreements?: string | null;
  financing?: string | null;
  scheduling?: string | null;
  final_payment?: string | null;
  delivery_acceptance?: string | null; // FASE 1: Nueva tarea de aceptación de entrega
}

// Modelo principal de Order
export interface Order {
  // Datos básicos del pedido
  reference_number: string;
  model_code: string;
  order_status: string;
  country_code: string;
  language_code: string | null;
  mkt_options: string | null;
  vin: string | null;
  order_substatus: string | null;
  is_used: boolean | null;
  series: string | null;
  sale_type: string | null;

  // Fechas importantes
  reservation_date: string | null;
  order_placed_date: string | null;
  order_booked_date: string | null;
  order_cancel_initiate_date: string | null;
  order_cancellation_date: string | null;
  invitation_date: string | null;
  marketing_lexicon_date: string | null;

  // Información del vehículo
  vehicle_model_year: string | null;
  vehicle_title_status: string | null;
  vehicle_title_sub_status: string | null;
  vehicle_routing_location: number | null;
  vehicle_odometer: number | null;
  vehicle_odometer_type: string | null;
  odometer_at_delivery: number | null;
  vehicle_id: number | null;
  vehicle_map_id: number | null;
  is_legacy: boolean | null;
  is_wall_connector: boolean | null;
  is_unbuildable: boolean | null;
  eligible_ira_tax_credit: boolean | null;
  trim_code: string | null;

  // Información de pago
  payment_type: string | null;
  order_type: string | null;
  reservation_amount: number | null;
  reservation_amount_due: number | null;
  reservation_amount_received: number | null;
  amount_due: number | null;
  amount_due_financier: number | null;
  account_balance: number | null;
  order_amount: number | null;
  currency_code: string | null;
  is_full_payment_order: boolean | null;
  amount_sent: number | null; // FASE 1: Cantidad ya pagada
  final_payment_accessible: boolean | null; // FASE 1: Si el pago final está accesible

  // Información de entrega
  delivery_location: string | null;
  delivery_type: string | null;
  delivery_location_trt_id: number | null;
  pickup_location: number | null;
  pickup_zip_code: string | null;
  delivery_window: string | null;
  delivery_appointment: string | null;
  delivery_appointment_date: string | null;
  delivery_appointment_date_utc: string | null;
  eta_to_delivery_center: string | null;
  delivery_due_date: string | null;
  expected_registration_date: string | null;
  vehicle_location: string | null;
  is_available_for_match: boolean | null;
  self_scheduling_url: string | null; // FASE 1: URL para auto-agendar
  ready_to_accept: boolean | null; // FASE 1: Listo para aceptar entrega
  is_more_than_two_weeks: boolean | null; // FASE 1: Si faltan más de 2 semanas
  is_self_scheduling_available: boolean | null; // FASE 1: Si está disponible auto-agendar

  // Direcciones
  delivery_address: DeliveryAddress | null;
  registration_address: RegistrationAddress | null;

  // Datos del usuario/registrante
  user_id: number | null;
  email_address: string | null;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  phone_number: string | null;
  phone_prefix: string | null;
  owner_identification_number: string | null;
  owner_identification_type: string | null;
  owner_nationality: string | null;
  customer_type: string | null;
  registrant_type: string | null;

  // Estado de placa y registro
  license_plate_number: string | null;
  current_registration_state_province: string | null;
  registration_expiration_date: string | null;
  registration_status: string | null;
  license_status: string | null;

  // Estado de tareas
  tasks_status: TasksStatus | null;

  // Información de pickup/delivery center
  pickup_location_title: string | null;
  pickup_location_city: string | null;
  pickup_location_state: string | null;
  pickup_location_latitude: number | null;
  pickup_location_longitude: number | null;
  time_zone_id: string | null;

  // Flags y configuraciones adicionales
  is_b2b: boolean | null;
  is_wholesale_order: boolean | null;
  is_not_for_sale: boolean | null;
  has_proof_of_payment: boolean | null;
  has_voided_check: boolean | null;
  can_display_acknowledgement: boolean | null;
  is_any_acknowledgement_pending: boolean | null;
  is_inventory_swap_available: boolean | null;
  is_military: boolean | null;

  // Información financiera adicional
  financing_intent: boolean | null;
  finance_application_status: string | null;
  finance_offer_status: string | null;

  // Trade-in
  trade_in_intent: string | null;
  trade_in_vin: string | null;
  is_trade_in_confirmed: boolean | null;

  // Documentos y MVPA
  has_mvpa_doc: boolean | null;
  is_docs_being_regenerated: boolean | null;
  final_invoice_exists: boolean | null;
  has_final_invoice: boolean | null;
  agreements_e_sign_status: string | null; // FASE 1: Estado de firma electrónica
  agreements_completed_packets: string[] | null; // FASE 1: Documentos completados
  agreements_has_signed_one_of_packets: boolean | null; // FASE 1: Si firmó al menos un paquete

  // Campos adicionales de conversión
  conversion_channel: string | null;
  utm_source: string | null;
}

// Modelo para detalle de orden (con campos adicionales)
export interface OrderDetail extends Order {
  decoded_configuration: {
    options: Record<string, string>;
  } | null;
  status_description: string;
  model_name: string;
}

// Respuesta de Tesla API - Lista de órdenes básicas
export interface TeslaApiOrder {
  referenceNumber: string;
  modelCode: string;
  orderStatus: string;
  countryCode: string;
  languageCode?: string;
  mktOptions?: string;
  vin?: string;
  orderSubstatus?: string;
  isUsed?: boolean;
  reservationDate?: string;
}

// Respuesta de Akamai API
export interface AkamaiResponse {
  tasks?: {
    registration?: {
      status?: string;
      orderDetails?: Record<string, any>;
      regData?: Record<string, any>;
      registrationAddress?: Record<string, any>;
    };
    agreements?: {
      status?: string;
      eSignStatus?: string;
      completedPackets?: string[];
      hasSignedOneOfPackets?: boolean;
      lastPacketAcceptedOn?: string;
    };
    financing?: {
      status?: string;
      data?: Record<string, any>;
    };
    scheduling?: {
      status?: string;
      deliveryDetails?: Record<string, any>;
      deliveryWindowDisplay?: string;
      apptDateTimeAddressStr?: string;
      deliveryAddressTitle?: string;
      selfSchedulingUrl?: string;
      readyToAccept?: boolean;
      isMoreThanTwoWeeks?: boolean;
      isSelfSchedulingAvailable?: boolean;
      isDeliveryEstimatesEnabled?: boolean;
      isEligibleForReschedule?: boolean;
      isInventoryOrMatched?: boolean;
    };
    finalPayment?: {
      status?: string;
      data?: Record<string, any>;
      amountDue?: number;
      amountDueFinancier?: number;
      accountBalance?: number;
      amountSent?: number;
      accessible?: boolean;
      currencyFormat?: {
        currencyCode?: string;
      };
      etaToDeliveryCenter?: string;
      deliveryInfo?: Record<string, any>;
      pickupLocationAddress?: Record<string, any>;
      card?: {
        messageBody?: number;
      };
    };
    deliveryAcceptance?: {
      status?: string;
      complete?: boolean;
      isPickup?: boolean;
      vehicleIsReady?: boolean;
      isDeliveryToAddress?: boolean;
      isTeslaDirect?: boolean;
    };
  };
}

// Tokens de OAuth
export interface TeslaTokens {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

// URL de autorización
export interface AuthUrlResponse {
  auth_url: string;
  state: string;
  code_verifier: string;
}
