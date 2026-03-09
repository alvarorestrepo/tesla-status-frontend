'use client';

import { useState, useEffect } from 'react';
import { useSidebar } from '@/hooks/useSidebar';
import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { SidebarItem } from './SidebarItem';
import { cn } from '@/lib/utils';
import { Order } from '@/lib/tesla/types';
import { 
  Activity, FileText, Calendar, CreditCard, CheckCircle,
  Car, Truck, Settings, User, IdCard, BarChart3, 
  BadgeDollarSign, FileStack, ArrowLeftRight
} from 'lucide-react';

const SECTIONS = [
  { id: 'estado', label: 'Estado del Pedido', icon: Activity },
  { id: 'detalles', label: 'Datos del Pedido', icon: FileText },
  { id: 'vehiculo', label: 'Información Vehículo', icon: Car },
  { id: 'fechas', label: 'Fechas Importantes', icon: Calendar },
  { id: 'pago', label: 'Información de Pago', icon: CreditCard },
  { id: 'entrega', label: 'Detalles de Entrega', icon: Truck },
  { id: 'direccion', label: 'Dirección Entrega', icon: BadgeDollarSign },
  { id: 'propietario', label: 'Datos del Propietario', icon: User },
  { id: 'placa', label: 'Registro y Placa', icon: IdCard },
  { id: 'tareas', label: 'Estado de Tareas', icon: CheckCircle },
  { id: 'financiamiento', label: 'Financiamiento', icon: BarChart3 },
  { id: 'tradein', label: 'Trade-In', icon: ArrowLeftRight },
  { id: 'documentos', label: 'Documentos', icon: FileStack },
  { id: 'conversion', label: 'Datos de Conversión', icon: Settings },
];

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  orders?: Order[];
  selectedIndex?: number;
  onSelectOrder?: (index: number) => void;
}

export function Sidebar({ userName, userEmail, orders = [], selectedIndex = 0, onSelectOrder }: SidebarProps) {
  const { isOpen, closeSidebar, activeSection, setActiveSection } = useSidebar();
  const [displayUserData, setDisplayUserData] = useState({ name: userName || '', email: userEmail || '' });

  useEffect(() => {
    // Si no hay props, intentar recuperar del localStorage
    if (!userName || !userEmail) {
      const storedEmail = localStorage.getItem('tesla_user_email');
      if (storedEmail) {
        setDisplayUserData({ name: storedEmail.split('@')[0], email: storedEmail });
      }
    } else {
      setDisplayUserData({ name: userName, email: userEmail });
    }
  }, [userName, userEmail]);

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full bg-[#171A20] z-50 transition-transform duration-300 ease-in-out",
          "w-[250px] flex flex-col",
          "md:translate-x-0",
          !isOpen && "-translate-x-full md:translate-x-0"
        )}
        aria-label="Navegación principal"
      >
        <SidebarHeader 
          userName={displayUserData.name} 
          userEmail={displayUserData.email}
          orders={orders}
          selectedIndex={selectedIndex}
          onSelectOrder={onSelectOrder}
        />

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1" role="menu">
            {SECTIONS.map((section) => (
              <SidebarItem
                key={section.id}
                id={section.id}
                label={section.label}
                icon={section.icon}
                isActive={activeSection === section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  closeSidebar();
                }}
              />
            ))}
          </ul>
        </nav>

        <SidebarFooter />
      </aside>
    </>
  );
}
