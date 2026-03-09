'use client';

import { Zap, User } from 'lucide-react';
import { VehicleSelector } from '@/components/vehicle/VehicleSelector';
import { Order } from '@/lib/tesla/types';

interface SidebarHeaderProps {
  userName: string;
  userEmail: string;
  orders?: Order[];
  selectedIndex?: number;
  onSelectOrder?: (index: number) => void;
}

export function SidebarHeader({ 
  userName, 
  userEmail, 
  orders = [], 
  selectedIndex = 0,
  onSelectOrder 
}: SidebarHeaderProps) {
  return (
    <div className="p-4 border-b border-gray-800">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-[#E31937] rounded-full flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-semibold text-lg">Tesla Status</span>
      </div>

      {/* Usuario */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">
            {userName || 'Usuario'}
          </p>
          <p className="text-gray-400 text-xs truncate">
            {userEmail || 'No disponible'}
          </p>
        </div>
      </div>

      {/* Vehicle Selector */}
      {orders.length > 0 && onSelectOrder && (
        <div className="pt-2">
          <VehicleSelector
            orders={orders}
            selectedIndex={selectedIndex}
            onSelect={onSelectOrder}
            variant="default"
          />
        </div>
      )}
    </div>
  );
}
