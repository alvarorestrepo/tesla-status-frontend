'use client';

import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoTooltipProps {
  content: string;
  className?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function InfoTooltip({ content, className, position = 'top' }: InfoTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <button
        type="button"
        onClick={() => setIsVisible(!isVisible)}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="text-gray-400 hover:text-[#E31937] transition-colors focus:outline-none"
        aria-label="Mostrar información"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      
      {isVisible && (
        <div
          className={cn(
            "absolute z-50 w-64 p-3 bg-[#171A20] text-white text-xs rounded-lg shadow-xl border border-gray-700",
            positionClasses[position]
          )}
          role="tooltip"
        >
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-1 right-1 text-gray-400 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="pr-4">{content}</p>
          <div className={cn(
            "absolute w-2 h-2 bg-[#171A20] border-gray-700 rotate-45",
            position === 'top' && "top-full left-1/2 -translate-x-1/2 -mt-1 border-b border-r",
            position === 'bottom' && "bottom-full left-1/2 -translate-x-1/2 -mb-1 border-t border-l",
            position === 'left' && "left-full top-1/2 -translate-y-1/2 -ml-1 border-t border-r",
            position === 'right' && "right-full top-1/2 -translate-y-1/2 -mr-1 border-b border-l"
          )} />
        </div>
      )}
    </div>
  );
}
