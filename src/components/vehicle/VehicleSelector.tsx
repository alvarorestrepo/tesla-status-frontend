'use client';

import { Car } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { decodeModel } from '@/lib/translations/models';
import { Order } from '@/lib/tesla/types';

interface VehicleSelectorProps {
  orders: Order[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  variant?: 'default' | 'compact';
  disabled?: boolean;
}

export function VehicleSelector({
  orders,
  selectedIndex,
  onSelect,
  variant = 'default',
  disabled = false,
}: VehicleSelectorProps) {
  // Handle edge cases
  if (orders.length === 0) {
    return (
      <div className={`flex items-center gap-2 ${variant === 'compact' ? 'px-2 py-1' : 'px-3 py-2'} rounded-md bg-gray-800/50 border border-gray-700`}>
        <Car className={`${variant === 'compact' ? 'w-3 h-3' : 'w-4 h-4'} text-gray-500`} />
        <span className={`${variant === 'compact' ? 'text-xs' : 'text-sm'} text-gray-500`}>
          Sin vehículos
        </span>
      </div>
    );
  }

  const handleValueChange = (value: string) => {
    const index = parseInt(value, 10);
    if (!isNaN(index)) {
      onSelect(index);
    }
  };

  return (
    <Select
      value={selectedIndex.toString()}
      onValueChange={handleValueChange}
      disabled={disabled || orders.length === 0}
    >
      <SelectTrigger 
        className={`
          border-gray-700 bg-gray-800/50 text-white hover:bg-gray-800 focus:ring-[#E31937] focus:ring-offset-0
          ${variant === 'compact' 
            ? 'h-8 text-xs px-2 py-1 min-w-[140px] max-w-[180px]' 
            : 'h-10 text-sm px-3 py-2 min-w-[200px]'
          }
        `}
      >
        <div className="flex items-center gap-2 truncate">
          <Car className={`${variant === 'compact' ? 'w-3 h-3' : 'w-4 h-4'} text-[#E31937] flex-shrink-0`} />
          <SelectValue placeholder="Seleccionar vehículo" />
        </div>
      </SelectTrigger>
      <SelectContent 
        className="bg-[#171A20] border-gray-700 text-white min-w-[200px]"
        position="popper"
        sideOffset={4}
      >
        {orders.map((order, index) => (
          <SelectItem
            key={order.reference_number || index}
            value={index.toString()}
            className="text-white hover:bg-gray-800 focus:bg-gray-800 focus:text-white cursor-pointer data-[highlighted]:bg-gray-800 data-[highlighted]:text-white"
          >
            <div className="flex flex-col gap-0.5 py-1">
              <span className="font-medium text-white">
                {decodeModel(order.model_code)}
              </span>
              <span className="text-xs text-gray-400">
                Ref: {order.reference_number || 'N/A'}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default VehicleSelector;
