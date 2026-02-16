import { 
  ClipboardCheck, 
  CheckCircle2, 
  Factory, 
  IdCard, 
  Ship, 
  CalendarCheck, 
  PartyPopper,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  name: string;
  shortName: string;
  progress: number;
  icon: LucideIcon;
}

const STEPS: Step[] = [
  { 
    id: 'reserved', 
    name: 'Reservado', 
    shortName: 'Reserv.', 
    progress: 10, 
    icon: ClipboardCheck 
  },
  { 
    id: 'confirmed', 
    name: 'Confirmado', 
    shortName: 'Confirm.', 
    progress: 25, 
    icon: CheckCircle2 
  },
  { 
    id: 'production', 
    name: 'En Producción', 
    shortName: 'Produc.', 
    progress: 50, 
    icon: Factory 
  },
  { 
    id: 'vin_assigned', 
    name: 'VIN Asignado', 
    shortName: 'VIN', 
    progress: 65, 
    icon: IdCard 
  },
  { 
    id: 'in_transit', 
    name: 'En Tránsito', 
    shortName: 'Tráns.', 
    progress: 80, 
    icon: Ship 
  },
  { 
    id: 'scheduled', 
    name: 'Programado', 
    shortName: 'Progr.', 
    progress: 90, 
    icon: CalendarCheck 
  },
  { 
    id: 'delivered', 
    name: 'Entregado', 
    shortName: 'Entreg.', 
    progress: 100, 
    icon: PartyPopper 
  }
];

interface OrderTimelineProps {
  currentProgress: number;
  className?: string;
}

export function OrderTimeline({ currentProgress, className }: OrderTimelineProps) {
  // Encontrar el índice del step actual (el último que tiene progreso <= currentProgress)
  const currentStepIndex = STEPS.findIndex(
    (step, index) => 
      currentProgress < step.progress || 
      (currentProgress >= step.progress && 
       (index === STEPS.length - 1 || currentProgress < STEPS[index + 1].progress))
  );
  
  const activeIndex = currentStepIndex === -1 ? STEPS.length - 1 : currentStepIndex;

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop: Horizontal Timeline */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Línea conectora de fondo */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200" />
          
          {/* Línea conectora activa */}
          <div 
            className="absolute top-5 left-0 h-0.5 bg-[#E31937] transition-all duration-500"
            style={{ width: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
          />
          
          {/* Steps */}
          <div className="relative flex justify-between">
            {STEPS.map((step, index) => {
              const isCompleted = index < activeIndex;
              const isCurrent = index === activeIndex;
              const isPending = index > activeIndex;
              
              const Icon = step.icon;
              
              return (
                <div 
                  key={step.id} 
                  className="flex flex-col items-center"
                  style={{ width: `${100 / STEPS.length}%` }}
                >
                  {/* Icono */}
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10",
                      isCompleted && "bg-green-500 border-green-500 text-white",
                      isCurrent && "bg-[#E31937] border-[#E31937] text-white ring-4 ring-red-100",
                      isPending && "bg-white border-gray-300 text-gray-400"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  {/* Nombre */}
                  <div className="mt-2 text-center">
                    <p 
                      className={cn(
                        "text-xs font-medium",
                        isCompleted && "text-green-600",
                        isCurrent && "text-[#E31937] font-semibold",
                        isPending && "text-gray-400"
                      )}
                    >
                      {step.shortName}
                    </p>
                    <p 
                      className={cn(
                        "text-[10px]",
                        isCompleted && "text-green-500",
                        isCurrent && "text-[#E31937]",
                        isPending && "text-gray-300"
                      )}
                    >
                      {step.progress}%
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical Timeline */}
      <div className="md:hidden">
        <div className="relative pl-4">
          {/* Línea conectora vertical */}
          <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-200" />
          
          {/* Línea conectora activa vertical */}
          <div 
            className="absolute left-8 top-4 w-0.5 bg-[#E31937] transition-all duration-500"
            style={{ height: `${(activeIndex / (STEPS.length - 1)) * 100}%` }}
          />
          
          {/* Steps */}
          <div className="space-y-4">
            {STEPS.map((step, index) => {
              const isCompleted = index < activeIndex;
              const isCurrent = index === activeIndex;
              const isPending = index > activeIndex;
              
              const Icon = step.icon;
              
              return (
                <div key={step.id} className="flex items-center gap-4">
                  {/* Icono */}
                  <div 
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 shrink-0",
                      isCompleted && "bg-green-500 border-green-500 text-white",
                      isCurrent && "bg-[#E31937] border-[#E31937] text-white ring-2 ring-red-100",
                      isPending && "bg-white border-gray-300 text-gray-400"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1">
                    <p 
                      className={cn(
                        "text-sm font-medium",
                        isCompleted && "text-green-600",
                        isCurrent && "text-[#E31937] font-semibold",
                        isPending && "text-gray-400"
                      )}
                    >
                      {step.name}
                    </p>
                    <p 
                      className={cn(
                        "text-xs",
                        isCompleted && "text-green-500",
                        isCurrent && "text-[#E31937]",
                        isPending && "text-gray-300"
                      )}
                    >
                      {step.progress}% {isCurrent && "• Actual"} {isCompleted && "• Completado"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
