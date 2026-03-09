'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSidebar } from '@/hooks/useSidebar';
import { useOrder } from '@/contexts/OrderContext';
import { Order } from '@/lib/tesla/types';
import { OrderStatus } from '@/components/sections/OrderStatus';
import { OrderData } from '@/components/sections/OrderData';
import { VehicleInfo } from '@/components/sections/VehicleInfo';
import { Dates } from '@/components/sections/Dates';
import { PaymentInfo } from '@/components/sections/PaymentInfo';
import { DeliveryInfo } from '@/components/sections/DeliveryInfo';
import { DeliveryAddress } from '@/components/sections/DeliveryAddress';
import { UserData } from '@/components/sections/UserData';
import { Registration } from '@/components/sections/Registration';
import { TasksStatus } from '@/components/sections/TasksStatus';
import { Financing } from '@/components/sections/Financing';
import { TradeIn } from '@/components/sections/TradeIn';
import { Documents } from '@/components/sections/Documents';
import { Conversion } from '@/components/sections/Conversion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Activity, FileText, Calendar, CreditCard, CheckCircle,
  Car, Truck, Settings, User, IdCard, BarChart3, 
  BadgeDollarSign, FileStack, ArrowLeftRight
} from 'lucide-react';

const SECTIONS: Record<string, { label: string; icon: React.ElementType }> = {
  estado: { label: 'Estado del Pedido', icon: Activity },
  detalles: { label: 'Datos del Pedido', icon: FileText },
  vehiculo: { label: 'Información Vehículo', icon: Car },
  fechas: { label: 'Fechas Importantes', icon: Calendar },
  pago: { label: 'Información de Pago', icon: CreditCard },
  entrega: { label: 'Detalles de Entrega', icon: Truck },
  direccion: { label: 'Dirección Entrega', icon: BadgeDollarSign },
  propietario: { label: 'Datos del Propietario', icon: User },
  placa: { label: 'Registro y Placa', icon: IdCard },
  tareas: { label: 'Estado de Tareas', icon: CheckCircle },
  financiamiento: { label: 'Financiamiento', icon: BarChart3 },
  tradein: { label: 'Trade-In', icon: ArrowLeftRight },
  documentos: { label: 'Documentos', icon: FileStack },
  conversion: { label: 'Datos de Conversión', icon: Settings },
};

function calculateOrderProgress(order: Order): number {
  // Prioridad 1: Estado explícito del pedido
  const status = order.order_status?.toUpperCase();
  
  if (status === 'DELIVERED' || status === 'DL') {
    return 100;
  }
  
  if (status === 'SCHEDULED' || status === 'FS') {
    return 90;
  }
  
  if (status === 'IN_TRANSIT' || status === 'TRANSIT') {
    return 80;
  }
  
  if (status === 'VIN_ASSIGNED' || status === 'VP') {
    return 65;
  }
  
  if (status === 'IN_PRODUCTION' || status === 'IN') {
    return 50;
  }
  
  if (status === 'CONFIRMED' || status === 'CF') {
    return 25;
  }
  
  if (status === 'ORDERED' || status === 'OD') {
    return 15;
  }
  
  if (status === 'BOOKED' || status === 'RN') {
    return 10;
  }
  
  // Prioridad 2: Inferir del estado si no hay match exacto
  if (order.delivery_appointment && order.delivery_appointment !== 'No agendada') {
    return 90;
  }
  
  if (order.vehicle_location || order.eta_to_delivery_center) {
    return 80;
  }
  
  if (order.vin && order.vin !== 'Por asignar' && order.vin !== '') {
    return 65;
  }
  
  // Default para estados desconocidos o nulos
  return 10;
}

export default function SectionPage() {
  const params = useParams();
  const router = useRouter();
  const { setActiveSection } = useSidebar();
  const { order, loading, error } = useOrder();
  const section = params.section as string;

  // Validar sección
  useEffect(() => {
    if (!SECTIONS[section]) {
      router.push('/dashboard/estado');
      return;
    }
    setActiveSection(section);
  }, [section, router, setActiveSection]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E31937]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-red-600">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No tienes pedidos activos
        </CardContent>
      </Card>
    );
  }

  const progress = calculateOrderProgress(order);
  const sectionInfo = SECTIONS[section];
  const Icon = sectionInfo?.icon || Activity;

  // Renderizar componente según la sección
  const renderSection = () => {
    switch (section) {
      case 'estado':
        return <OrderStatus order={order} progress={progress} />;
      case 'detalles':
        return <OrderData order={order} />;
      case 'vehiculo':
        return <VehicleInfo order={order} />;
      case 'fechas':
        return <Dates order={order} />;
      case 'pago':
        return <PaymentInfo order={order} />;
      case 'entrega':
        return <DeliveryInfo order={order} />;
      case 'direccion':
        return <DeliveryAddress order={order} />;
      case 'propietario':
        return <UserData order={order} />;
      case 'placa':
        return <Registration order={order} />;
      case 'tareas':
        return <TasksStatus order={order} />;
      case 'financiamiento':
        return <Financing order={order} />;
      case 'tradein':
        return <TradeIn order={order} />;
      case 'documentos':
        return <Documents order={order} />;
      case 'conversion':
        return <Conversion order={order} />;
      default:
        return <OrderStatus order={order} progress={progress} />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#E31937]/10 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#E31937]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{sectionInfo?.label}</h1>
          <p className="text-muted-foreground">
            Pedido #{order.reference_number} • {order.model_code.toUpperCase()}
          </p>
        </div>
      </div>

      {renderSection()}
    </div>
  );
}
