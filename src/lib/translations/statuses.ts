export interface StatusInfo {
  name: string;
  progress: number;
  color: "default" | "secondary" | "destructive" | "outline";
}

export const STATUS_CODES: Record<string, StatusInfo> = {
  // Formatos largos (API Tesla)
  BOOKED: { name: "Reservado", progress: 10, color: "outline" },
  ORDERED: { name: "Ordenado", progress: 15, color: "outline" },
  CONFIRMED: { name: "Confirmado", progress: 25, color: "secondary" },
  IN_PRODUCTION: { name: "En Producción", progress: 50, color: "secondary" },
  VIN_ASSIGNED: { name: "VIN Asignado", progress: 65, color: "secondary" },
  IN_TRANSIT: { name: "En Tránsito", progress: 80, color: "secondary" },
  SCHEDULED: { name: "Programado", progress: 90, color: "default" },
  DELIVERED: { name: "Entregado", progress: 100, color: "default" },
  CANCELLED: { name: "Cancelado", progress: 0, color: "destructive" },
  
  // Formatos cortos (códigos legacy)
  RN: { name: "Reservado", progress: 10, color: "outline" },
  OD: { name: "Ordenado", progress: 15, color: "outline" },
  CF: { name: "Confirmado", progress: 25, color: "secondary" },
  IN: { name: "En Producción", progress: 50, color: "secondary" },
  VP: { name: "VIN Asignado", progress: 65, color: "secondary" },
  FS: { name: "Programado", progress: 90, color: "default" },
  DL: { name: "Entregado", progress: 100, color: "default" },
  CN: { name: "Cancelado", progress: 0, color: "destructive" },
  
  // Formatos frontend (lowercase)
  reserved: { name: "Reservado", progress: 10, color: "outline" },
  ordered: { name: "Ordenado", progress: 15, color: "outline" },
  confirmed: { name: "Confirmado", progress: 25, color: "secondary" },
  production: { name: "En Producción", progress: 50, color: "secondary" },
  vin_assigned: { name: "VIN Asignado", progress: 65, color: "secondary" },
  in_transit: { name: "En Tránsito", progress: 80, color: "secondary" },
  scheduled: { name: "Programado", progress: 90, color: "default" },
  delivered: { name: "Entregado", progress: 100, color: "default" },
  cancelled: { name: "Cancelado", progress: 0, color: "destructive" }
};

export function decodeStatus(code: string | null): StatusInfo {
  if (!code) return { name: "Desconocido", progress: 0, color: "outline" };
  
  // Intentar match exacto primero
  if (STATUS_CODES[code]) {
    return STATUS_CODES[code];
  }
  
  // Intentar con uppercase
  const upperCode = code.toUpperCase();
  if (STATUS_CODES[upperCode]) {
    return STATUS_CODES[upperCode];
  }
  
  // Intentar con lowercase
  const lowerCode = code.toLowerCase();
  if (STATUS_CODES[lowerCode]) {
    return STATUS_CODES[lowerCode];
  }
  
  // Si no se encuentra, devolver el código original
  return { name: code, progress: 0, color: "outline" };
}
