'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { OrderTimeline } from "@/components/OrderTimeline"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LogOut, Car, Package, Info, Zap, Paintbrush, Sofa, CircleDot, 
  Gauge, Battery, Box, Key, Calendar, MapPin, Clock, DollarSign,
  Truck, CreditCard, CheckCircle, AlertCircle, Activity, FileText, Settings,
  User, IdCard, RefreshCw, BarChart3
} from "lucide-react"
import { decodeModel } from "@/lib/translations/models"
import { decodeCountry } from "@/lib/translations/countries"
import { decodeStatus, getStatusInfoByProgress } from "@/lib/translations/statuses"
import { decodeMktOptions, groupMktOptionsByCategory, MktOptionInfo } from "@/lib/translations/mktOptions"
import { decodeTaskStatus, decodeOrderSubstatus } from "@/lib/translations/taskStatuses"

/**
 * Calcula el progreso del pedido basado en múltiples factores, no solo el order_status.
 * Prioridad (de mayor a menor):
 * 1. Estado DELIVERED = 100%
 * 2. Cita de entrega agendada = 90%
 * 3. Vehículo en tránsito (tiene ubicación o ETA) = 80%
 * 4. VIN asignado = 65%
 * 5. Estado IN_PRODUCTION = 50%
 * 6. Estado CONFIRMED = 25%
 * 7. Fallback al order_status original
 */
function calculateOrderProgress(order: Order): number {
  // 1. Si ya está entregado, 100%
  if (order.order_status === 'DELIVERED' || order.order_status === 'DL' || order.order_status === 'delivered') {
    return 100;
  }
  
  // 2. Si tiene cita de entrega agendada, 90%
  if (order.delivery_appointment && order.delivery_appointment !== 'No agendada') {
    return 90;
  }
  
  // 3. Si el vehículo está en tránsito (tiene ubicación o ETA al centro), 80%
  // Nota: vehicle_location puede indicar que está en tránsito
  // eta_to_delivery_center indica que viene camino al centro de entrega
  if (order.vehicle_location || order.eta_to_delivery_center) {
    return 80;
  }
  
  // 4. Si tiene VIN asignado, 65%
  if (order.vin && order.vin !== 'Por asignar' && order.vin !== '') {
    return 65;
  }
  
  // 5. Estados específicos del backend
  if (order.order_status === 'IN_PRODUCTION' || order.order_status === 'IN' || order.order_status === 'production') {
    return 50;
  }
  
  if (order.order_status === 'CONFIRMED' || order.order_status === 'CF' || order.order_status === 'confirmed') {
    return 25;
  }
  
  // 6. Fallback: usar el mapeo original del order_status
  const statusInfo = decodeStatus(order.order_status);
  return statusInfo.progress;
}

interface Order {
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
  
  // Direcciones
  delivery_address: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isUspsValidated?: boolean;
  } | null;
  registration_address: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
  } | null;
  
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
  tasks_status: {
    registration: string | null;
    agreements: string | null;
    financing: string | null;
    scheduling: string | null;
    final_payment: string | null;
  } | null;
  
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
  
  // Campos adicionales de conversión
  conversion_channel: string | null;
  utm_source: string | null;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Pintura":
      return Paintbrush;
    case "Interior":
      return Sofa;
    case "Rines":
      return CircleDot;
    case "Autopilot":
      return Gauge;
    case "Batería":
    case "Motor":
      return Battery;
    default:
      return Box;
  }
};

// Helper para formatear valores vacíos
const formatValue = (value: any, defaultText: string = "No disponible") => {
  if (value === null || value === undefined || value === "") {
    return <span className="text-muted-foreground italic">{defaultText}</span>;
  }
  return value;
};

// Helper para formatear fechas
const formatDate = (dateString: string | null) => {
  if (!dateString) return <span className="text-muted-foreground italic">No disponible</span>;
  return new Date(dateString).toLocaleDateString('es-CO', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Helper para formatear moneda
const formatCurrency = (amount: number | null, currency: string = 'COP') => {
  if (amount === null || amount === undefined) return <span className="text-muted-foreground italic">No disponible</span>;
  return new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: currency 
  }).format(amount);
};

// Helper para traducir tipo de pago
const translatePaymentType = (type: string | null) => {
  if (!type) return <span className="text-muted-foreground italic">No especificado</span>;
  const translations: Record<string, string> = {
    'CASH': 'Efectivo',
    'LOAN': 'Financiamiento',
    'LEASE': 'Leasing'
  };
  return translations[type] || type;
};

// Helper para traducir estado del título del vehículo
const translateVehicleTitleStatus = (status: string | null) => {
  if (!status) return <span className="text-muted-foreground italic">No especificado</span>;
  const translations: Record<string, string> = {
    'NEW': 'Nuevo',
    'USED': 'Usado',
    'CERTIFIED_PRE_OWNED': 'Certificado Pre-Owned'
  };
  return translations[status] || status;
};

// Helper para traducir tipo de venta
const translateSaleType = (type: string | null) => {
  if (!type) return <span className="text-muted-foreground italic">No especificado</span>;
  const translations: Record<string, string> = {
    'ORDER': 'Pedido',
    'INVENTORY': 'Inventario'
  };
  return translations[type] || type;
};

// Componente para mostrar datos crudos sin traducción
interface RawDataRowProps {
  label: string;
  value: any;
}

const RawDataRow = ({ label, value }: RawDataRowProps) => {
  // Formatear el valor para mostrar
  const displayValue = () => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400 italic">null</span>;
    }
    if (value === true) {
      return <span className="text-green-600 font-medium">true</span>;
    }
    if (value === false) {
      return <span className="text-red-600 font-medium">false</span>;
    }
    if (typeof value === 'object') {
      return <span className="text-blue-600 font-mono text-xs">{JSON.stringify(value)}</span>;
    }
    return <span className="font-mono text-sm">{String(value)}</span>;
  };

  return (
    <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 font-mono text-xs">{label}</span>
      {displayValue()}
    </div>
  );
};

// Helper para traducir tipo de entrega
const translateDeliveryType = (type: string | null) => {
  if (!type) return <span className="text-muted-foreground italic">No especificado</span>;
  const translations: Record<string, string> = {
    'PICKUP_SERVICE_CENTER': 'Recoger en Centro de Servicio',
    'PICKUP_DELIVERY_CENTER': 'Recoger en Centro de Entrega',
    'HOME_DELIVERY': 'Entrega a Domicilio',
    'DELIVERY_TO_ADDRESS': 'Entrega a Domicilio',
    'SELF_ARRANGED': 'Entrega Autogestionada'
  };
  return translations[type] || type;
};

export default function Dashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
      router.push('/');
      return;
    }
    
    fetch(`${API_URL}/orders/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      setOrders(data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error:', err);
      setLoading(false);
    });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E31937] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E31937] rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold">Tesla Tracking</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Consulta el estado de tus pedidos Tesla</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No tienes pedidos activos</p>
              <p className="text-muted-foreground text-sm">Los pedidos aparecerán aquí cuando los tengas</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => {
              // Calcular progreso inteligente basado en múltiples factores
              const calculatedProgress = calculateOrderProgress(order);
              const statusInfo = getStatusInfoByProgress(calculatedProgress);
              const countryInfo = decodeCountry(order.country_code);
              const mktOptions = decodeMktOptions(order.mkt_options);
              const groupedOptions = groupMktOptionsByCategory(mktOptions);
              const substatusInfo = decodeOrderSubstatus(order.order_substatus);
              
              return (
                <Card key={order.reference_number} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                          <Car className="w-5 h-5" />
                          Pedido #{order.reference_number}
                        </CardTitle>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          {decodeModel(order.model_code)}
                          {order.is_used !== null && (
                            <Badge variant={order.is_used ? "secondary" : "default"} className="text-xs">
                              {order.is_used ? "Usado" : "Nuevo"}
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge variant={statusInfo.color} className="text-sm mb-1">
                          {statusInfo.name}
                        </Badge>
                        {order.order_substatus && (
                          <p className="text-xs text-muted-foreground">
                            {substatusInfo.name}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <Tabs defaultValue="status" className="w-full">
                      <TabsList className="grid w-full grid-cols-5">
                        <TabsTrigger value="status" className="flex items-center justify-center gap-2">
                          <Activity className="w-4 h-4 md:hidden" />
                          <span className="hidden md:inline">Estado</span>
                        </TabsTrigger>
                        <TabsTrigger value="details" className="flex items-center justify-center gap-2">
                          <FileText className="w-4 h-4 md:hidden" />
                          <span className="hidden md:inline">Detalles</span>
                        </TabsTrigger>
                        <TabsTrigger value="delivery" className="flex items-center justify-center gap-2">
                          <Truck className="w-4 h-4 md:hidden" />
                          <span className="hidden md:inline">Entrega</span>
                        </TabsTrigger>
                        <TabsTrigger value="config" className="flex items-center justify-center gap-2">
                          <Settings className="w-4 h-4 md:hidden" />
                          <span className="hidden md:inline">Configuración</span>
                        </TabsTrigger>
                        <TabsTrigger value="raw" className="flex items-center justify-center gap-2">
                          <FileText className="w-4 h-4 md:hidden" />
                          <span className="hidden md:inline">Datos Completos</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="status" className="mt-4">
                        <div className="space-y-6">
                          {/* Timeline de progreso */}
                          <OrderTimeline currentProgress={calculatedProgress} />
                          
                          {/* Info adicional */}
                          <div className="grid grid-cols-2 gap-4 text-sm pt-4 border-t">
                            <div className="flex items-center gap-2">
                              <Info className="w-4 h-4 text-muted-foreground" />
                              <span>{countryInfo.flag} {countryInfo.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Key className="w-4 h-4 text-muted-foreground" />
                              <span className="font-mono text-xs">
                                VIN: {formatValue(order.vin, "Por asignar")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="details" className="mt-4">
                        <div className="space-y-6">
                          {/* Sección: Información General */}
                          <div>
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                              <Info className="w-4 h-4" />
                              Información General
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Número de referencia</span>
                                <span className="font-medium">#{order.reference_number}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Modelo</span>
                                <span className="font-medium">{decodeModel(order.model_code)}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Estado</span>
                                <span className="font-medium">{statusInfo.name}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Subestado</span>
                                <span className="font-medium">{formatValue(substatusInfo.name, "N/A")}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">País</span>
                                <span className="font-medium">{countryInfo.flag} {countryInfo.name}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">VIN</span>
                                <span className="font-mono font-medium">{formatValue(order.vin, "Por asignar")}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Placa</span>
                                <span className="font-medium">{formatValue(order.license_plate, "Por asignar")}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Odómetro</span>
                                <span className="font-medium">
                                  {order.vehicle_odometer !== null 
                                    ? `${order.vehicle_odometer} ${order.vehicle_odometer_type || 'KM'}`
                                    : formatValue(null, "No disponible")
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Año del modelo</span>
                                <span className="font-medium">{formatValue(order.vehicle_model_year)}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Estado del vehículo</span>
                                <span className="font-medium">{translateVehicleTitleStatus(order.vehicle_title_status)}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Serie</span>
                                <span className="font-medium">{formatValue(order.series)}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Tipo de venta</span>
                                <span className="font-medium">{translateSaleType(order.sale_type)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Sección: Fechas */}
                          <div>
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Fechas
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Fecha de reserva</span>
                                <span className="font-medium">{formatDate(order.reservation_date)}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Fecha del pedido</span>
                                <span className="font-medium">{formatDate(order.order_placed_date)}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Fecha de confirmación</span>
                                <span className="font-medium">{formatDate(order.order_booked_date)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Sección: Información de Pago */}
                          <div>
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                              <CreditCard className="w-4 h-4" />
                              Información de Pago
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Método de pago</span>
                                <Badge variant="secondary">
                                  {translatePaymentType(order.payment_type)}
                                </Badge>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Monto total del pedido</span>
                                <span className="font-medium">
                                  {formatCurrency(order.order_amount, order.currency_code || 'COP')}
                                </span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Reserva pagada</span>
                                <span className="font-medium">
                                  {formatCurrency(order.reservation_amount, order.currency_code || 'COP')}
                                </span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Saldo pendiente</span>
                                <span className="font-medium text-[#E31937]">
                                  {formatCurrency(order.amount_due, order.currency_code || 'COP')}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Sección: Estado de Tareas */}
                          {order.tasks_status && (
                            <div>
                              <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Estado de Tareas
                              </h4>
                              <div className="space-y-2 text-sm">
                                {Object.entries(order.tasks_status).map(([task, status]) => {
                                  const taskTranslation = decodeTaskStatus(status);
                                  return (
                                    <div key={task} className="flex justify-between py-2 border-b">
                                      <span className="text-muted-foreground capitalize">
                                        {task === 'registration' ? 'Registro' :
                                         task === 'agreements' ? 'Acuerdos' :
                                         task === 'financing' ? 'Financiamiento' :
                                         task === 'scheduling' ? 'Programación' :
                                         task === 'final_payment' ? 'Pago Final' : task}
                                      </span>
                                      <Badge variant={
                                        status === 'COMPLETE' || status?.includes('COMPLETE') ? 'default' : 
                                        status === 'IGNORE' ? 'outline' : 
                                        'secondary'
                                      }>
                                        {taskTranslation.name}
                                      </Badge>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="delivery" className="mt-4">
                        <div className="space-y-6">
                          {/* Sección: Ubicación del Vehículo */}
                          <div>
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Ubicación del Vehículo
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Ubicación actual</span>
                                <span className="font-medium">{formatValue(order.vehicle_location, "No disponible")}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">ETA al centro</span>
                                <span className="font-medium flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatValue(order.eta_to_delivery_center, "No disponible")}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Sección: Información de Entrega */}
                          <div>
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                              <Truck className="w-4 h-4" />
                              Información de Entrega
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Tipo de entrega</span>
                                <span className="font-medium">{translateDeliveryType(order.delivery_type)}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Ubicación de entrega</span>
                                <span className="font-medium">{formatValue(order.delivery_location, "No especificada")}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Ventana de entrega</span>
                                <span className="font-medium">{formatValue(order.delivery_window, "No programada")}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Cita de entrega</span>
                                <span className="font-medium">{formatValue(order.delivery_appointment, "No agendada")}</span>
                              </div>
                              {order.delivery_address && (
                                <div className="py-2 border-b">
                                  <span className="text-muted-foreground">Dirección de entrega</span>
                                  <p className="font-medium mt-1">
                                    {order.delivery_address.address1}{order.delivery_address.address2 && `, ${order.delivery_address.address2}`}<br />
                                    {order.delivery_address.city}, {order.delivery_address.state} {order.delivery_address.zip}
                                  </p>
                                </div>
                              )}
                              {order.registration_address && (
                                <div className="py-2 border-b">
                                  <span className="text-muted-foreground">Dirección de registro</span>
                                  <p className="font-medium mt-1">
                                    {order.registration_address.address1}{order.registration_address.address2 && `, ${order.registration_address.address2}`}<br />
                                    {order.registration_address.city}, {order.registration_address.state} {order.registration_address.country}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Sección: Detalles del Vehículo */}
                          <div>
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
                              <Car className="w-4 h-4" />
                              Detalles del Vehículo
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">VIN</span>
                                <span className="font-mono font-medium">{formatValue(order.vin, "Por asignar")}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Placa</span>
                                <span className="font-medium">{formatValue(order.license_plate, "Por asignar")}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Odómetro</span>
                                <span className="font-medium">
                                  {order.vehicle_odometer !== null 
                                    ? `${order.vehicle_odometer} ${order.vehicle_odometer_type || 'KM'}`
                                    : formatValue(null, "No disponible")
                                  }
                                </span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Año del modelo</span>
                                <span className="font-medium">{formatValue(order.vehicle_model_year)}</span>
                              </div>
                              <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Estado del título</span>
                                <span className="font-medium">{translateVehicleTitleStatus(order.vehicle_title_status)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="config" className="mt-4">
                        {mktOptions.length > 0 ? (
                          <div className="space-y-4">
                            {Object.entries(groupedOptions).map(([category, options]) => {
                              const Icon = getCategoryIcon(category);
                              return (
                                <div key={category} className="space-y-2">
                                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <Icon className="w-4 h-4" />
                                    {category}
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {options.map((option, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {option.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            No hay información de configuración disponible
                          </div>
                        )}
                      </TabsContent>

                      <TabsContent value="raw" className="mt-4">
                        <div className="space-y-6 max-h-[600px] overflow-y-auto">
                          {/* SECCIÓN: Datos Básicos del Pedido */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-blue-600">
                              <FileText className="w-4 h-4" />
                              Datos Básicos del Pedido
                            </h4>
                            <div className="space-y-2 text-sm">
                              <RawDataRow label="reference_number" value={order.reference_number} />
                              <RawDataRow label="model_code" value={order.model_code} />
                              <RawDataRow label="order_status" value={order.order_status} />
                              <RawDataRow label="order_substatus" value={order.order_substatus} />
                              <RawDataRow label="country_code" value={order.country_code} />
                              <RawDataRow label="language_code" value={order.language_code} />
                              <RawDataRow label="mkt_options" value={order.mkt_options} />
                              <RawDataRow label="series" value={order.series} />
                              <RawDataRow label="sale_type" value={order.sale_type} />
                              <RawDataRow label="trim_code" value={order.trim_code} />
                            </div>
                          </div>

                          {/* SECCIÓN: Información del Vehículo */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-green-600">
                              <Car className="w-4 h-4" />
                              Información del Vehículo
                            </h4>
                            <div className="space-y-2 text-sm">
                              <RawDataRow label="vin" value={order.vin} />
                              <RawDataRow label="vehicle_id" value={order.vehicle_id} />
                              <RawDataRow label="vehicle_map_id" value={order.vehicle_map_id} />
                              <RawDataRow label="vehicle_model_year" value={order.vehicle_model_year} />
                              <RawDataRow label="vehicle_title_status" value={order.vehicle_title_status} />
                              <RawDataRow label="vehicle_title_sub_status" value={order.vehicle_title_sub_status} />
                              <RawDataRow label="vehicle_routing_location" value={order.vehicle_routing_location} />
                              <RawDataRow label="vehicle_odometer" value={order.vehicle_odometer} />
                              <RawDataRow label="vehicle_odometer_type" value={order.vehicle_odometer_type} />
                              <RawDataRow label="odometer_at_delivery" value={order.odometer_at_delivery} />
                              <RawDataRow label="is_legacy" value={order.is_legacy} />
                              <RawDataRow label="is_wall_connector" value={order.is_wall_connector} />
                              <RawDataRow label="is_unbuildable" value={order.is_unbuildable} />
                              <RawDataRow label="eligible_ira_tax_credit" value={order.eligible_ira_tax_credit} />
                              <RawDataRow label="is_used" value={order.is_used} />
                            </div>
                          </div>

                          {/* SECCIÓN: Fechas */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-purple-600">
                              <Calendar className="w-4 h-4" />
                              Fechas
                            </h4>
                            <div className="space-y-2 text-sm">
                              <RawDataRow label="reservation_date" value={order.reservation_date} />
                              <RawDataRow label="order_placed_date" value={order.order_placed_date} />
                              <RawDataRow label="order_booked_date" value={order.order_booked_date} />
                              <RawDataRow label="order_cancel_initiate_date" value={order.order_cancel_initiate_date} />
                              <RawDataRow label="order_cancellation_date" value={order.order_cancellation_date} />
                              <RawDataRow label="invitation_date" value={order.invitation_date} />
                              <RawDataRow label="marketing_lexicon_date" value={order.marketing_lexicon_date} />
                              <RawDataRow label="delivery_appointment_date" value={order.delivery_appointment_date} />
                              <RawDataRow label="delivery_appointment_date_utc" value={order.delivery_appointment_date_utc} />
                              <RawDataRow label="eta_to_delivery_center" value={order.eta_to_delivery_center} />
                              <RawDataRow label="delivery_due_date" value={order.delivery_due_date} />
                              <RawDataRow label="expected_registration_date" value={order.expected_registration_date} />
                            </div>
                          </div>

                          {/* SECCIÓN: Información de Pago */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-yellow-600">
                              <CreditCard className="w-4 h-4" />
                              Información de Pago
                            </h4>
                            <div className="space-y-2 text-sm">
                              <RawDataRow label="payment_type" value={order.payment_type} />
                              <RawDataRow label="order_type" value={order.order_type} />
                              <RawDataRow label="order_amount" value={order.order_amount} />
                              <RawDataRow label="amount_due" value={order.amount_due} />
                              <RawDataRow label="amount_due_financier" value={order.amount_due_financier} />
                              <RawDataRow label="account_balance" value={order.account_balance} />
                              <RawDataRow label="reservation_amount" value={order.reservation_amount} />
                              <RawDataRow label="reservation_amount_due" value={order.reservation_amount_due} />
                              <RawDataRow label="reservation_amount_received" value={order.reservation_amount_received} />
                              <RawDataRow label="currency_code" value={order.currency_code} />
                              <RawDataRow label="is_full_payment_order" value={order.is_full_payment_order} />
                            </div>
                          </div>

                          {/* SECCIÓN: Información de Entrega */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-orange-600">
                              <Truck className="w-4 h-4" />
                              Información de Entrega
                            </h4>
                            <div className="space-y-2 text-sm">
                              <RawDataRow label="delivery_location" value={order.delivery_location} />
                              <RawDataRow label="delivery_type" value={order.delivery_type} />
                              <RawDataRow label="delivery_location_trt_id" value={order.delivery_location_trt_id} />
                              <RawDataRow label="pickup_location" value={order.pickup_location} />
                              <RawDataRow label="pickup_zip_code" value={order.pickup_zip_code} />
                              <RawDataRow label="delivery_window" value={order.delivery_window} />
                              <RawDataRow label="delivery_appointment" value={order.delivery_appointment} />
                              <RawDataRow label="vehicle_location" value={order.vehicle_location} />
                              <RawDataRow label="is_available_for_match" value={order.is_available_for_match} />
                              <RawDataRow label="pickup_location_title" value={order.pickup_location_title} />
                              <RawDataRow label="pickup_location_city" value={order.pickup_location_city} />
                              <RawDataRow label="pickup_location_state" value={order.pickup_location_state} />
                              <RawDataRow label="pickup_location_latitude" value={order.pickup_location_latitude} />
                              <RawDataRow label="pickup_location_longitude" value={order.pickup_location_longitude} />
                              <RawDataRow label="time_zone_id" value={order.time_zone_id} />
                            </div>
                          </div>

                          {/* SECCIÓN: Dirección de Entrega */}
                          {order.delivery_address && (
                            <div className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-red-600">
                                <MapPin className="w-4 h-4" />
                                Dirección de Entrega
                              </h4>
                              <div className="space-y-2 text-sm">
                                <RawDataRow label="address1" value={order.delivery_address.address1} />
                                <RawDataRow label="address2" value={order.delivery_address.address2} />
                                <RawDataRow label="city" value={order.delivery_address.city} />
                                <RawDataRow label="state" value={order.delivery_address.state} />
                                <RawDataRow label="zip" value={order.delivery_address.zip} />
                                <RawDataRow label="country" value={order.delivery_address.country} />
                                <RawDataRow label="isUspsValidated" value={order.delivery_address.isUspsValidated} />
                              </div>
                            </div>
                          )}

                          {/* SECCIÓN: Dirección de Registro */}
                          {order.registration_address && (
                            <div className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-indigo-600">
                                <MapPin className="w-4 h-4" />
                                Dirección de Registro
                              </h4>
                              <div className="space-y-2 text-sm">
                                <RawDataRow label="address1" value={order.registration_address.address1} />
                                <RawDataRow label="address2" value={order.registration_address.address2} />
                                <RawDataRow label="city" value={order.registration_address.city} />
                                <RawDataRow label="state" value={order.registration_address.state} />
                                <RawDataRow label="country" value={order.registration_address.country} />
                              </div>
                            </div>
                          )}

                          {/* SECCIÓN: Datos del Usuario */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-teal-600">
                              <User className="w-4 h-4" />
                              Datos del Usuario
                            </h4>
                            <div className="space-y-2 text-sm">
                              <RawDataRow label="user_id" value={order.user_id} />
                              <RawDataRow label="email_address" value={order.email_address} />
                              <RawDataRow label="first_name" value={order.first_name} />
                              <RawDataRow label="middle_name" value={order.middle_name} />
                              <RawDataRow label="last_name" value={order.last_name} />
                              <RawDataRow label="phone_number" value={order.phone_number} />
                              <RawDataRow label="phone_prefix" value={order.phone_prefix} />
                              <RawDataRow label="customer_type" value={order.customer_type} />
                              <RawDataRow label="registrant_type" value={order.registrant_type} />
                            </div>
                          </div>

                          {/* SECCIÓN: Estado de Placa y Registro */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-pink-600">
                              <IdCard className="w-4 h-4" />
                              Placa y Registro
                            </h4>
                            <div className="space-y-2 text-sm">
                              <RawDataRow label="license_plate_number" value={order.license_plate_number} />
                              <RawDataRow label="current_registration_state_province" value={order.current_registration_state_province} />
                              <RawDataRow label="registration_expiration_date" value={order.registration_expiration_date} />
                              <RawDataRow label="registration_status" value={order.registration_status} />
                              <RawDataRow label="license_status" value={order.license_status} />
                            </div>
                          </div>

                          {/* SECCIÓN: Estado de Tareas */}
                          {order.tasks_status && (
                            <div className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-gray-600">
                                <CheckCircle className="w-4 h-4" />
                                Estado de Tareas
                              </h4>
                              <div className="space-y-2 text-sm">
                                <RawDataRow label="registration" value={order.tasks_status.registration} />
                                <RawDataRow label="agreements" value={order.tasks_status.agreements} />
                                <RawDataRow label="financing" value={order.tasks_status.financing} />
                                <RawDataRow label="scheduling" value={order.tasks_status.scheduling} />
                                <RawDataRow label="final_payment" value={order.tasks_status.final_payment} />
                              </div>
                            </div>
                          )}

                          {/* SECCIÓN: Flags y Configuraciones */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-cyan-600">
                              <Settings className="w-4 h-4" />
                              Flags y Configuraciones
                            </h4>
                            <div className="space-y-2 text-sm">
                              <RawDataRow label="is_b2b" value={order.is_b2b} />
                              <RawDataRow label="is_wholesale_order" value={order.is_wholesale_order} />
                              <RawDataRow label="is_not_for_sale" value={order.is_not_for_sale} />
                              <RawDataRow label="has_proof_of_payment" value={order.has_proof_of_payment} />
                              <RawDataRow label="has_voided_check" value={order.has_voided_check} />
                              <RawDataRow label="can_display_acknowledgement" value={order.can_display_acknowledgement} />
                              <RawDataRow label="is_any_acknowledgement_pending" value={order.is_any_acknowledgement_pending} />
                              <RawDataRow label="is_inventory_swap_available" value={order.is_inventory_swap_available} />
                              <RawDataRow label="is_military" value={order.is_military} />
                            </div>
                          </div>

                          {/* SECCIÓN: Financiamiento */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-emerald-600">
                              <DollarSign className="w-4 h-4" />
                              Financiamiento
                            </h4>
                            <div className="space-y-2 text-sm">
                              <RawDataRow label="financing_intent" value={order.financing_intent} />
                              <RawDataRow label="finance_application_status" value={order.finance_application_status} />
                              <RawDataRow label="finance_offer_status" value={order.finance_offer_status} />
                            </div>
                          </div>

                          {/* SECCIÓN: Trade-in */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-amber-600">
                              <RefreshCw className="w-4 h-4" />
                              Trade-in
                            </h4>
                            <div className="space-y-2 text-sm">
                              <RawDataRow label="trade_in_intent" value={order.trade_in_intent} />
                              <RawDataRow label="trade_in_vin" value={order.trade_in_vin} />
                              <RawDataRow label="is_trade_in_confirmed" value={order.is_trade_in_confirmed} />
                            </div>
                          </div>

                          {/* SECCIÓN: Documentos */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-rose-600">
                              <FileText className="w-4 h-4" />
                              Documentos
                            </h4>
                            <div className="space-y-2 text-sm">
                              <RawDataRow label="has_mvpa_doc" value={order.has_mvpa_doc} />
                              <RawDataRow label="is_docs_being_regenerated" value={order.is_docs_being_regenerated} />
                              <RawDataRow label="final_invoice_exists" value={order.final_invoice_exists} />
                              <RawDataRow label="has_final_invoice" value={order.has_final_invoice} />
                            </div>
                          </div>

                          {/* SECCIÓN: Conversión */}
                          <div className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-3 text-sm flex items-center gap-2 text-violet-600">
                              <BarChart3 className="w-4 h-4" />
                              Conversión
                            </h4>
                            <div className="space-y-2 text-sm">
                              <RawDataRow label="conversion_channel" value={order.conversion_channel} />
                              <RawDataRow label="utm_source" value={order.utm_source} />
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
