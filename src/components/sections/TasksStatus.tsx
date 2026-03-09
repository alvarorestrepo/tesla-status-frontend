'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Order } from '@/lib/tesla/types';
import { decodeTaskStatus } from '@/lib/translations/taskStatuses';
import { CheckCircle, FileText, DollarSign, Calendar, Settings, AlertCircle } from 'lucide-react';

interface TasksStatusProps {
  order: Order;
}

// Mapeo de tareas conocidas con sus metadatos
const TASK_METADATA: Record<string, {
  label: string;
  icon: React.ElementType;
  description: string;
  tooltip: string;
}> = {
  registration: {
    label: 'Registro',
    icon: FileText,
    description: 'Completar información de registro del vehículo',
    tooltip: 'Registro del vehículo con las autoridades locales'
  },
  agreements: {
    label: 'Acuerdos',
    icon: FileText,
    description: 'Firmar acuerdos y documentos legales',
    tooltip: 'Documentos contractuales y términos de servicio'
  },
  financing: {
    label: 'Financiamiento',
    icon: DollarSign,
    description: 'Configurar opciones de pago o financiamiento',
    tooltip: 'Aprobación y configuración del financiamiento'
  },
  scheduling: {
    label: 'Programación',
    icon: Calendar,
    description: 'Agendar fecha y hora de entrega',
    tooltip: 'Selección de fecha y lugar de entrega'
  },
  final_payment: {
    label: 'Pago Final',
    icon: DollarSign,
    description: 'Realizar el pago restante del vehículo',
    tooltip: 'Pago del saldo pendiente antes de la entrega'
  },
  delivery_acceptance: {
    label: 'Aceptación de Entrega',
    icon: CheckCircle,
    description: 'Aceptar términos y condiciones de entrega',
    tooltip: 'Confirmar aceptación del vehículo el día de entrega'
  },
};

export function TasksStatus({ order }: TasksStatusProps) {
  const tasks = order.tasks_status;

  if (!tasks) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#E31937]" />
            Estado de Tareas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay información de tareas disponible</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filtrar solo las tareas que realmente existen en los datos
  const existingTasks = Object.entries(tasks).filter(([_, status]) => status !== null && status !== undefined);
  
  // Si no hay tareas con datos, mostrar mensaje
  if (existingTasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#E31937]" />
            Estado de Tareas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay tareas activas en este momento</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getBadgeVariant = (status: string | null) => {
    if (!status) return 'outline';
    if (status === 'COMPLETE' || status.includes('COMPLETE')) return 'default';
    if (status === 'IN_PROGRESS' || status.includes('PROGRESS')) return 'secondary';
    if (status === 'PENDING' || status.includes('PENDING')) return 'outline';
    if (status === 'IGNORE') return 'outline';
    return 'outline';
  };

  const completedCount = existingTasks.filter(
    ([_, s]) => s && (s === 'COMPLETE' || s.includes('COMPLETE'))
  ).length;
  const totalCount = existingTasks.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Resumen de Progreso */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-[#E31937]" />
            Estado de Tareas
            <InfoTooltip content="Progreso de las tareas necesarias para completar tu pedido" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Progreso General</p>
              <p className="font-semibold">{completedCount} de {totalCount} completadas</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#E31937] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{progress}% completado</p>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Tareas - Solo las que existen */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detalle de Tareas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {existingTasks.map(([key, status]) => {
            const meta = TASK_METADATA[key] || { 
              label: key, 
              icon: Settings,
              description: `Tarea: ${key}`,
              tooltip: `Estado de la tarea ${key}`
            };
            const taskInfo = decodeTaskStatus(status);
            const Icon = meta.icon;
            
            return (
              <div 
                key={key} 
                className="flex items-start gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  status === 'COMPLETE' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    status === 'COMPLETE' ? 'text-green-600' : 'text-gray-600'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{meta.label}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={getBadgeVariant(status)}>
                        {taskInfo.name}
                      </Badge>
                      <InfoTooltip content={meta.tooltip} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{meta.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Alerta */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-900">Importante</p>
              <p className="text-sm text-yellow-700 mt-1">
                Debes completar todas las tareas antes de la fecha de entrega programada. 
                Algunas tareas requieren acción por tu parte, mientras que otras las 
                completará Tesla automáticamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
