import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@/lib/tesla/api';
import { getAkamaiData, processAkamaiData } from '@/lib/tesla/akamai';
import { Order, TeslaApiOrder } from '@/lib/tesla/types';

/**
 * GET /api/orders
 * Obtiene la lista de pedidos del usuario autenticado
 * Combina datos de Tesla API + Akamai API
 */
export async function GET(request: NextRequest) {
  try {
    // Obtener token de autorización del header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7);

    // 1. Obtener lista básica de pedidos desde Tesla API
    const basicOrders = await getOrders(accessToken);

    if (!basicOrders || basicOrders.length === 0) {
      return NextResponse.json([]);
    }

    // 2. Enriquecer cada pedido con datos de Akamai
    const enrichedOrders: Order[] = await Promise.all(
      basicOrders.map(async (basicOrder) => {
        try {
          // Obtener datos enriquecidos de Akamai
          const akamaiData = await getAkamaiData(accessToken, basicOrder.referenceNumber);
          const akamaiProcessed = processAkamaiData(akamaiData, basicOrder.referenceNumber);

          // Construir objeto Order completo combinando datos básicos + Akamai
          const order: Order = {
            // Datos básicos del pedido (de Tesla API)
            reference_number: basicOrder.referenceNumber,
            model_code: basicOrder.modelCode,
            order_status: basicOrder.orderStatus,
            country_code: basicOrder.countryCode,
            language_code: basicOrder.languageCode || null,
            mkt_options: basicOrder.mktOptions || null,
            vin: basicOrder.vin || null,
            order_substatus: basicOrder.orderSubstatus || null,
            is_used: basicOrder.isUsed ?? null,

            // Datos de Akamai
            series: akamaiProcessed.series || null,
            sale_type: akamaiProcessed.sale_type || null,
            reservation_date: akamaiProcessed.reservation_date || null,
            order_placed_date: akamaiProcessed.order_placed_date || null,
            order_booked_date: akamaiProcessed.order_booked_date || null,
            order_cancel_initiate_date: akamaiProcessed.order_cancel_initiate_date || null,
            order_cancellation_date: akamaiProcessed.order_cancellation_date || null,
            invitation_date: akamaiProcessed.invitation_date || null,
            marketing_lexicon_date: akamaiProcessed.marketing_lexicon_date || null,
            vehicle_model_year: akamaiProcessed.vehicle_model_year || null,
            vehicle_title_status: akamaiProcessed.vehicle_title_status || null,
            vehicle_title_sub_status: akamaiProcessed.vehicle_title_sub_status || null,
            vehicle_routing_location: akamaiProcessed.vehicle_routing_location || null,
            vehicle_odometer: akamaiProcessed.vehicle_odometer || null,
            vehicle_odometer_type: akamaiProcessed.vehicle_odometer_type || null,
            odometer_at_delivery: akamaiProcessed.odometer_at_delivery || null,
            vehicle_id: akamaiProcessed.vehicle_id || null,
            vehicle_map_id: akamaiProcessed.vehicle_map_id || null,
            is_legacy: akamaiProcessed.is_legacy ?? null,
            is_wall_connector: akamaiProcessed.is_wall_connector ?? null,
            is_unbuildable: akamaiProcessed.is_unbuildable ?? null,
            eligible_ira_tax_credit: akamaiProcessed.eligible_ira_tax_credit ?? null,
            trim_code: akamaiProcessed.trim_code || null,
            payment_type: akamaiProcessed.payment_type || null,
            order_type: akamaiProcessed.order_type || null,
            reservation_amount: akamaiProcessed.reservation_amount || null,
            reservation_amount_due: akamaiProcessed.reservation_amount_due || null,
            reservation_amount_received: akamaiProcessed.reservation_amount_received || null,
            amount_due: akamaiProcessed.amount_due || null,
            amount_due_financier: akamaiProcessed.amount_due_financier || null,
            account_balance: akamaiProcessed.account_balance || null,
            order_amount: akamaiProcessed.order_amount || null,
            currency_code: akamaiProcessed.currency_code || null,
            is_full_payment_order: akamaiProcessed.is_full_payment_order ?? null,
            amount_sent: akamaiProcessed.amount_sent ?? null,
            final_payment_accessible: akamaiProcessed.final_payment_accessible ?? null,
            delivery_location: akamaiProcessed.delivery_location || null,
            delivery_type: akamaiProcessed.delivery_type || null,
            delivery_location_trt_id: akamaiProcessed.delivery_location_trt_id || null,
            pickup_location: akamaiProcessed.pickup_location || null,
            pickup_zip_code: akamaiProcessed.pickup_zip_code || null,
            delivery_window: akamaiProcessed.delivery_window || null,
            delivery_appointment: akamaiProcessed.delivery_appointment || null,
            delivery_appointment_date: akamaiProcessed.delivery_appointment_date || null,
            delivery_appointment_date_utc: akamaiProcessed.delivery_appointment_date_utc || null,
            eta_to_delivery_center: akamaiProcessed.eta_to_delivery_center || null,
            delivery_due_date: akamaiProcessed.delivery_due_date || null,
            expected_registration_date: akamaiProcessed.expected_registration_date || null,
            vehicle_location: akamaiProcessed.vehicle_location || null,
            is_available_for_match: akamaiProcessed.is_available_for_match ?? null,
            self_scheduling_url: akamaiProcessed.self_scheduling_url || null,
            ready_to_accept: akamaiProcessed.ready_to_accept ?? null,
            is_more_than_two_weeks: akamaiProcessed.is_more_than_two_weeks ?? null,
            is_self_scheduling_available: akamaiProcessed.is_self_scheduling_available ?? null,
            delivery_address: akamaiProcessed.delivery_address || null,
            registration_address: akamaiProcessed.registration_address || null,
            user_id: akamaiProcessed.user_id || null,
            email_address: akamaiProcessed.email_address || null,
            first_name: akamaiProcessed.first_name || null,
            middle_name: akamaiProcessed.middle_name || null,
            last_name: akamaiProcessed.last_name || null,
            phone_number: akamaiProcessed.phone_number || null,
            phone_prefix: akamaiProcessed.phone_prefix || null,
            owner_identification_number: akamaiProcessed.owner_identification_number || null,
            owner_identification_type: akamaiProcessed.owner_identification_type || null,
            owner_nationality: akamaiProcessed.owner_nationality || null,
            customer_type: akamaiProcessed.customer_type || null,
            registrant_type: akamaiProcessed.registrant_type || null,
            license_plate_number: akamaiProcessed.license_plate_number || null,
            current_registration_state_province: akamaiProcessed.current_registration_state_province || null,
            registration_expiration_date: akamaiProcessed.registration_expiration_date || null,
            registration_status: akamaiProcessed.registration_status || null,
            license_status: akamaiProcessed.license_status || null,
            tasks_status: akamaiProcessed.tasks_status || null,
            pickup_location_title: akamaiProcessed.pickup_location_title || null,
            pickup_location_city: akamaiProcessed.pickup_location_city || null,
            pickup_location_state: akamaiProcessed.pickup_location_state || null,
            pickup_location_latitude: akamaiProcessed.pickup_location_latitude || null,
            pickup_location_longitude: akamaiProcessed.pickup_location_longitude || null,
            time_zone_id: akamaiProcessed.time_zone_id || null,
            is_b2b: akamaiProcessed.is_b2b ?? null,
            is_wholesale_order: akamaiProcessed.is_wholesale_order ?? null,
            is_not_for_sale: akamaiProcessed.is_not_for_sale ?? null,
            has_proof_of_payment: akamaiProcessed.has_proof_of_payment ?? null,
            has_voided_check: akamaiProcessed.has_voided_check ?? null,
            can_display_acknowledgement: akamaiProcessed.can_display_acknowledgement ?? null,
            is_any_acknowledgement_pending: akamaiProcessed.is_any_acknowledgement_pending ?? null,
            is_inventory_swap_available: akamaiProcessed.is_inventory_swap_available ?? null,
            is_military: akamaiProcessed.is_military ?? null,
            financing_intent: akamaiProcessed.financing_intent ?? null,
            finance_application_status: akamaiProcessed.finance_application_status || null,
            finance_offer_status: akamaiProcessed.finance_offer_status || null,
            trade_in_intent: akamaiProcessed.trade_in_intent || null,
            trade_in_vin: akamaiProcessed.trade_in_vin || null,
            is_trade_in_confirmed: akamaiProcessed.is_trade_in_confirmed ?? null,
            has_mvpa_doc: akamaiProcessed.has_mvpa_doc ?? null,
            is_docs_being_regenerated: akamaiProcessed.is_docs_being_regenerated ?? null,
            final_invoice_exists: akamaiProcessed.final_invoice_exists ?? null,
            has_final_invoice: akamaiProcessed.has_final_invoice ?? null,
            agreements_e_sign_status: akamaiProcessed.agreements_e_sign_status || null,
            agreements_completed_packets: akamaiProcessed.agreements_completed_packets || null,
            agreements_has_signed_one_of_packets: akamaiProcessed.agreements_has_signed_one_of_packets ?? null,
            conversion_channel: akamaiProcessed.conversion_channel || null,
            utm_source: akamaiProcessed.utm_source || null,
          };

          return order;
        } catch (error) {
          console.error(`Error al procesar pedido ${basicOrder.referenceNumber}:`, error);
          
          // Si falla Akamai, devolver solo datos básicos
          return {
            reference_number: basicOrder.referenceNumber,
            model_code: basicOrder.modelCode,
            order_status: basicOrder.orderStatus,
            country_code: basicOrder.countryCode,
            language_code: basicOrder.languageCode || null,
            mkt_options: basicOrder.mktOptions || null,
            vin: basicOrder.vin || null,
            order_substatus: basicOrder.orderSubstatus || null,
            is_used: basicOrder.isUsed ?? null,
            series: null,
            sale_type: null,
            reservation_date: basicOrder.reservationDate || null,
            order_placed_date: null,
            order_booked_date: null,
            order_cancel_initiate_date: null,
            order_cancellation_date: null,
            invitation_date: null,
            marketing_lexicon_date: null,
            vehicle_model_year: null,
            vehicle_title_status: null,
            vehicle_title_sub_status: null,
            vehicle_routing_location: null,
            vehicle_odometer: null,
            vehicle_odometer_type: null,
            odometer_at_delivery: null,
            vehicle_id: null,
            vehicle_map_id: null,
            is_legacy: null,
            is_wall_connector: null,
            is_unbuildable: null,
            eligible_ira_tax_credit: null,
            trim_code: null,
            payment_type: null,
            order_type: null,
            reservation_amount: null,
            reservation_amount_due: null,
            reservation_amount_received: null,
            amount_due: null,
            amount_due_financier: null,
            account_balance: null,
            order_amount: null,
            currency_code: null,
            is_full_payment_order: null,
            delivery_location: null,
            delivery_type: null,
            delivery_location_trt_id: null,
            pickup_location: null,
            pickup_zip_code: null,
            delivery_window: null,
            delivery_appointment: null,
            delivery_appointment_date: null,
            delivery_appointment_date_utc: null,
            eta_to_delivery_center: null,
            delivery_due_date: null,
            expected_registration_date: null,
            vehicle_location: null,
            is_available_for_match: null,
            delivery_address: null,
            registration_address: null,
            user_id: null,
            email_address: null,
            first_name: null,
            middle_name: null,
            last_name: null,
            phone_number: null,
            phone_prefix: null,
            owner_identification_number: null,
            owner_identification_type: null,
            owner_nationality: null,
            customer_type: null,
            registrant_type: null,
            license_plate_number: null,
            current_registration_state_province: null,
            registration_expiration_date: null,
            registration_status: null,
            license_status: null,
            tasks_status: null,
            pickup_location_title: null,
            pickup_location_city: null,
            pickup_location_state: null,
            pickup_location_latitude: null,
            pickup_location_longitude: null,
            time_zone_id: null,
            is_b2b: null,
            is_wholesale_order: null,
            is_not_for_sale: null,
            has_proof_of_payment: null,
            has_voided_check: null,
            can_display_acknowledgement: null,
            is_any_acknowledgement_pending: null,
            is_inventory_swap_available: null,
            is_military: null,
            financing_intent: null,
            finance_application_status: null,
            finance_offer_status: null,
            trade_in_intent: null,
            trade_in_vin: null,
            is_trade_in_confirmed: null,
            has_mvpa_doc: null,
            is_docs_being_regenerated: null,
            final_invoice_exists: null,
            has_final_invoice: null,
            amount_sent: null,
            final_payment_accessible: null,
            self_scheduling_url: null,
            ready_to_accept: null,
            is_more_than_two_weeks: null,
            is_self_scheduling_available: null,
            agreements_e_sign_status: null,
            agreements_completed_packets: null,
            agreements_has_signed_one_of_packets: null,
            conversion_channel: null,
            utm_source: null,
          };
        }
      })
    );

    return NextResponse.json(enrichedOrders);
  } catch (error: any) {
    console.error('Error al obtener pedidos:', error);
    
    // Detectar si es error 401 (token expirado) y propagarlo correctamente
    const errorMessage = error.message || '';
    if (errorMessage.includes('401') || errorMessage.includes('token expired')) {
      return NextResponse.json(
        { error: 'Token expirado o inválido' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Error al obtener pedidos' },
      { status: 500 }
    );
  }
}
