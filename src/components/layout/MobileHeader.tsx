'use client';

import { Menu, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/hooks/useSidebar';
import { VehicleSelector } from '@/components/vehicle/VehicleSelector';
import { Order } from '@/lib/tesla/types';

interface MobileHeaderProps {
  orderReference?: string;
  orders?: Order[];
  selectedIndex?: number;
  onSelectOrder?: (index: number) => void;
}

export function MobileHeader({ 
  orderReference, 
  orders = [],
  selectedIndex = 0,
  onSelectOrder
}: MobileHeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#171A20] border-b border-gray-800 z-30 flex items-center px-4 justify-between">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-gray-800 mr-3"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#E31937] rounded-full flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-white" />
          </div>
          {orders.length <= 1 && (
            <span className="text-white font-semibold">
              {orderReference ? `Pedido #${orderReference}` : 'Tesla Status'}
            </span>
          )}
        </div>
      </div>

      {/* Vehicle Selector (compact) - only show if multiple vehicles */}
      {orders.length > 1 && onSelectOrder && (
        <div className="flex-1 ml-3 max-w-[180px]">
          <VehicleSelector
            orders={orders}
            selectedIndex={selectedIndex}
            onSelect={onSelectOrder}
            variant="compact"
          />
        </div>
      )}
    </header>
  );
}
