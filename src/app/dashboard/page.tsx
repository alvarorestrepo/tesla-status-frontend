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
  Truck, CreditCard, CheckCircle, AlertCircle, Activity, FileText, Settings
} from "lucide-react"
import { decodeModel } from "@/lib/translations/models"
import { decodeCountry } from "@/lib/translations/countries"
import { decodeStatus } from "@/lib/translations/statuses"
import { decodeMktOptions, groupMktOptionsByCategory, MktOptionInfo } from "@/lib/translations/mktOptions"
import { decodeTaskStatus, decodeOrderSubstatus } from "@/lib/translations/taskStatuses"

interface Order {
  reference_number: string;
  model_code: string;
  order_status: string;
  country_code: string;
  mkt_options: string | null;
  vin: string | null;
  order_substatus: string | null;
  is_used: boolean | null;
  reservation_date: string | null;
  // Campos adicionales de Akamai
  payment_type: string | null;
  reservation_amount: number | null;
  amount_due: number | null;
  currency_code: string | null;
  order_placed_date: string | null;
  order_booked_date: string | null;
  delivery_location: string | null;
  delivery_type: string | null;
  delivery_address: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  } | null;
  registration_address: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
  } | null;
  tasks_status: {
    registration: string | null;
    agreements: string | null;
    financing: string | null;
    scheduling: string | null;
    final_payment: string | null;
  } | null;
  // Nuevos campos
  delivery_window: string | null;
  delivery_appointment: string | null;
  eta_to_delivery_center: string | null;
  vehicle_location: string | null;
  vehicle_odometer: number | null;
  vehicle_odometer_type: string | null;
  license_plate: string | null;
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
              const statusInfo = decodeStatus(order.order_status);
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
                      <TabsList className="grid w-full grid-cols-4">
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
                      </TabsList>

                      <TabsContent value="status" className="mt-4">
                        <div className="space-y-6">
                          {/* Timeline de progreso */}
                          <OrderTimeline currentProgress={statusInfo.progress} />
                          
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
                                <span className="text-muted-foreground">Kilometraje</span>
                                <span className="font-medium">100 KM</span>
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
