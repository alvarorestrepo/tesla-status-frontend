/**
 * Traducciones para los estados de tareas (tasks) de Tesla
 * Basado en el repositorio: GewoonJaap/tesla-delivery-status-web
 */

export interface TaskStatusInfo {
  name: string;
  description?: string;
  color: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

// Estados de tareas principales
export const TASK_STATUS_CODES: Record<string, TaskStatusInfo> = {
  // Estados de Registro
  COMPLETE: { 
    name: "Completado", 
    description: "Tarea finalizada exitosamente",
    color: "success" 
  },
  PENDING: { 
    name: "Pendiente", 
    description: "Esperando acción",
    color: "warning" 
  },
  IN_PROGRESS: { 
    name: "En Progreso", 
    description: "Tarea en curso",
    color: "secondary" 
  },
  IGNORE: { 
    name: "No Aplica", 
    description: "Esta tarea no es requerida",
    color: "outline" 
  },
  
  // Estados de Financiamiento
  FINANCE_COMPLETE_EDITABLE: { 
    name: "Financiamiento Completo", 
    description: "El financiamiento está aprobado y puede ser modificado",
    color: "success" 
  },
  FINANCE_COMPLETE: { 
    name: "Financiamiento Completo", 
    description: "Proceso de financiamiento finalizado",
    color: "success" 
  },
  FINANCE_PENDING: { 
    name: "Financiamiento Pendiente", 
    description: "Esperando aprobación de financiamiento",
    color: "warning" 
  },
  FINANCE_APPROVED: { 
    name: "Financiamiento Aprobado", 
    description: "Solicitud de financiamiento aprobada",
    color: "success" 
  },
  FINANCE_DECLINED: { 
    name: "Financiamiento Rechazado", 
    description: "Solicitud de financiamiento rechazada",
    color: "destructive" 
  },
  CASH: { 
    name: "Efectivo", 
    description: "Pago en efectivo/transferencia",
    color: "default" 
  },
  LOAN: { 
    name: "Crédito", 
    description: "Financiamiento con préstamo",
    color: "secondary" 
  },
  LEASE: { 
    name: "Arrendamiento", 
    description: "Arrendamiento (leasing)",
    color: "secondary" 
  },
  
  // Estados de Acuerdos
  AGREEMENTS_COMPLETE: { 
    name: "Acuerdos Completos", 
    description: "Todos los acuerdos firmados",
    color: "success" 
  },
  AGREEMENTS_PENDING: { 
    name: "Acuerdos Pendientes", 
    description: "Esperando firma de acuerdos",
    color: "warning" 
  },
  
  // Estados de Agendamiento/Entrega
  SCHEDULED: { 
    name: "Programado", 
    description: "Entrega programada",
    color: "success" 
  },
  SCHEDULING_PENDING: { 
    name: "Programación Pendiente", 
    description: "Esperando programar fecha de entrega",
    color: "warning" 
  },
  SELF_ARRANGED: { 
    name: "Entrega Autogestionada", 
    description: "El cliente gestionará la entrega",
    color: "secondary" 
  },
  DELIVERY_CENTER: { 
    name: "Centro de Entrega", 
    description: "Entrega en centro de servicio Tesla",
    color: "default" 
  },
  HOME_DELIVERY: { 
    name: "Entrega a Domicilio", 
    description: "Entrega en dirección del cliente",
    color: "default" 
  },
  
  // Estados de Pago Final
  PAYMENT_COMPLETE: { 
    name: "Pago Completado", 
    description: "Pago final recibido",
    color: "success" 
  },
  PAYMENT_PENDING: { 
    name: "Pago Pendiente", 
    description: "Esperando pago final",
    color: "warning" 
  },
  
  // Estados de Aceptación de Entrega
  DELIVERY_ACCEPTED: { 
    name: "Entrega Aceptada", 
    description: "Vehículo recibido por el cliente",
    color: "success" 
  },
  DELIVERY_ACCEPTANCE_PENDING: { 
    name: "Aceptación Pendiente", 
    description: "Esperando aceptación del vehículo",
    color: "warning" 
  },
  
  // Tipos de Entrega
  PICKUP_SERVICE_CENTER: { 
    name: "Recoger en Centro de Servicio", 
    description: "El cliente recoge el vehículo en el centro",
    color: "default" 
  },
  PICKUP_DELIVERY_CENTER: { 
    name: "Recoger en Centro de Entrega", 
    description: "El cliente recoge el vehículo en el centro de entrega",
    color: "default" 
  },
  HOME_DELIVERY_SERVICE: { 
    name: "Entrega a Domicilio", 
    description: "Entrega en la dirección del cliente",
    color: "default" 
  },
};

// Estados de substatus de orden (orderSubstatus)
export const ORDER_SUBSTATUS_CODES: Record<string, TaskStatusInfo> = {
  _Z: { 
    name: "En Proceso", 
    description: "Orden en proceso de preparación",
    color: "secondary" 
  },
  _P: { 
    name: "Pendiente de Pago", 
    description: "Esperando confirmación de pago",
    color: "warning" 
  },
  _R: { 
    name: "Listo para Entrega", 
    description: "Vehículo listo para ser entregado",
    color: "success" 
  },
  _D: { 
    name: "Entregado", 
    description: "Entrega completada",
    color: "success" 
  },
  _C: { 
    name: "Cancelado", 
    description: "Orden cancelada",
    color: "destructive" 
  },
};

// Tipos de cliente
export const CUSTOMER_TYPE_CODES: Record<string, TaskStatusInfo> = {
  PRIVATE: { 
    name: "Particular", 
    description: "Cliente individual",
    color: "default" 
  },
  BUSINESS: { 
    name: "Empresa", 
    description: "Cliente corporativo",
    color: "secondary" 
  },
  B2B: { 
    name: "Negocio a Negocio", 
    description: "Venta B2B",
    color: "secondary" 
  },
};

// Función para decodificar estado de tarea
export function decodeTaskStatus(code: string | null | undefined): TaskStatusInfo {
  if (!code) return { 
    name: "No Disponible", 
    description: "Estado no especificado",
    color: "outline" 
  };
  
  const upperCode = code.toUpperCase();
  
  // Intentar match exacto primero
  if (TASK_STATUS_CODES[upperCode]) {
    return TASK_STATUS_CODES[upperCode];
  }
  
  // Intentar match en substatus
  if (ORDER_SUBSTATUS_CODES[upperCode]) {
    return ORDER_SUBSTATUS_CODES[upperCode];
  }
  
  // Formatear código desconocido (reemplazar _ por espacio y capitalizar)
  const formattedName = code
    .replace(/_/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
  
  return { 
    name: formattedName, 
    description: `Estado: ${code}`,
    color: "outline" 
  };
}

// Función para decodificar substatus de orden
export function decodeOrderSubstatus(code: string | null | undefined): TaskStatusInfo {
  if (!code) return { 
    name: "", 
    description: "",
    color: "outline" 
  };
  
  if (ORDER_SUBSTATUS_CODES[code]) {
    return ORDER_SUBSTATUS_CODES[code];
  }
  
  return { 
    name: code, 
    description: `Substatus: ${code}`,
    color: "outline" 
  };
}

// Función para formatear cualquier código de estado
export function formatStatusCode(code: string | null | undefined): string {
  if (!code) return "No disponible";
  
  const decoded = decodeTaskStatus(code);
  return decoded.name;
}