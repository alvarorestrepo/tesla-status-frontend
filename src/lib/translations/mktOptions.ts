export interface MktOptionInfo {
  category: string;
  name: string;
  icon?: string;
}

// Códigos de pintura - Basado en documentación oficial Tesla Service
const PAINT_CODES: Record<string, MktOptionInfo> = {
  // Códigos principales Tesla 2024
  PPSW: { category: "Pintura", name: "Blanco Perla Multicapa" },
  PPSB: { category: "Pintura", name: "Azul Profundo Metálico" },
  PMNG: { category: "Pintura", name: "Plata Midnight Metálico" },
  PBSB: { category: "Pintura", name: "Negro Sólido" },
  PPMR: { category: "Pintura", name: "Rojo Ultra" },
  PPSR: { category: "Pintura", name: "Plata Rápida (Quicksilver)" },
  PPSF: { category: "Pintura", name: "Rojo Signature" },
  PR01: { category: "Pintura", name: "Rojo Multi-Capa" },
  
  // Nuevos códigos 2024
  PN01: { category: "Pintura", name: "Gris Stealth (Gris Grafito)" },
  PN00: { category: "Pintura", name: "Quicksilver" },
  
  // Códigos adicionales/legacy
  PBCW: { category: "Pintura", name: "Crema" },
  PBFB: { category: "Pintura", name: "Negro Fluido" },
  PP01: { category: "Pintura", name: "Azul Profundo Metálico" },
  PMBL: { category: "Pintura", name: "Negro Obsidiana Metálico" },
  PN02: { category: "Pintura", name: "Plata Midnight" },
  PN03: { category: "Pintura", name: "Azul Profundo" },
  PN04: { category: "Pintura", name: "Rojo Multi-Capa" }
};

// Códigos de interior
const INTERIOR_CODES: Record<string, MktOptionInfo> = {
  INBFP: { category: "Interior", name: "Interior Premium Negro" },
  INBPP: { category: "Interior", name: "Interior Semi-Premium Negro" },
  INB3P: { category: "Interior", name: "Interior Negro" },
  INWFP: { category: "Interior", name: "Interior Premium Blanco" },
  IN3PB: { category: "Interior", name: "Interior Negro" },
  IN3PW: { category: "Interior", name: "Interior Blanco" },
  IPB7: { category: "Interior", name: "Interior Negro (Básico)" }
};

// Códigos de rines
const WHEEL_CODES: Record<string, MktOptionInfo> = {
  WY19P: { category: "Rines", name: "Rines Sport 19\"" },
  WY20P: { category: "Rines", name: "Rines Sport 20\"" },
  WY21P: { category: "Rines", name: "Rines 21\"" },
  WY18P: { category: "Rines", name: "Rines 18\"" },
  WY19B: { category: "Rines", name: "Rines 19\"" },
  WY20B: { category: "Rines", name: "Rines 20\"" },
  WTAS: { category: "Rines", name: "Rines Gemini 19\"" },
  WT20: { category: "Rines", name: "Rines Induction 20\"" },
  WT21: { category: "Rines", name: "Rines 21\"" },
  WT22: { category: "Rines", name: "Rines Turbine 22\"" }
};

// Códigos de Autopilot y conducción
const AUTOPILOT_CODES: Record<string, MktOptionInfo> = {
  APFB: { category: "Autopilot", name: "Autopilot" },
  APF2: { category: "Autopilot", name: "Autopilot Mejorado" },
  APF3: { category: "Autopilot", name: "Conducción Autónoma Total" },
  APFA: { category: "Autopilot", name: "Autopilot (Básico)" }
};

// Códigos de supercargador
const CHARGER_CODES: Record<string, MktOptionInfo> = {
  SC04: { category: "Carga", name: "Supercargador Habilitado" },
  SC05: { category: "Carga", name: "Acceso a Supercargador" },
  SC06: { category: "Carga", name: "Supercarga Gratuita" },
  CH15: { category: "Carga", name: "Cargador 48A" },
  CH16: { category: "Carga", name: "Cargador 72A" },
  CH17: { category: "Carga", name: "Cargador 80A" },
  CH18: { category: "Carga", name: "Cargador de Alto Amperaje" }
};

// Códigos de paquetes
const PACKAGE_CODES: Record<string, MktOptionInfo> = {
  CPF0: { category: "Paquete", name: "Paquete Estándar" },
  CPF1: { category: "Paquete", name: "Paquete Premium" },
  CPF2: { category: "Paquete", name: "Paquete Performance" },
  CVF0: { category: "Configuración", name: "Configuración 5 Asientos" },
  CVF1: { category: "Configuración", name: "Configuración 7 Asientos" },
  WXF0: { category: "Remolque", name: "Sin Paquete de Remolque" },
  WXF1: { category: "Remolque", name: "Paquete de Remolque" },
  DCF0: { category: "Clima", name: "Sin Paquete Clima Frío" },
  DCF1: { category: "Clima", name: "Paquete Clima Frío" },
  SLR1: { category: "Aerodinámica", name: "Alerón de Fibra de Carbono" }
};

// Códigos de batería y motor
const BATTERY_CODES: Record<string, MktOptionInfo> = {
  BT35: { category: "Batería", name: "Batería Autonomía Estándar" },
  BT40: { category: "Batería", name: "Batería Autonomía Extendida" },
  BT42: { category: "Batería", name: "Batería Autonomía Extendida Plus" },
  BT43: { category: "Batería", name: "Batería Performance" },
  BT45: { category: "Batería", name: "Batería Plaid" },
  BTX4: { category: "Batería", name: "Batería Model Y" },
  BTX5: { category: "Batería", name: "Batería Model 3" },
  BTX6: { category: "Batería", name: "Batería Model S" },
  BTX7: { category: "Batería", name: "Batería Model X" }
};

// Códigos de modelo/configuración
const MODEL_CONFIG_CODES: Record<string, MktOptionInfo> = {
  MDLY: { category: "Modelo", name: "Configuración Model Y" },
  MDL3: { category: "Modelo", name: "Configuración Model 3" },
  MDLS: { category: "Modelo", name: "Configuración Model S" },
  MDLX: { category: "Modelo", name: "Configuración Model X" },
  MTY46: { category: "Motor", name: "Motor Trasero Model Y" },
  MT346: { category: "Motor", name: "Motor Trasero Model 3" },
  STY5S: { category: "Versión", name: "Model Y Estándar" },
  ST35S: { category: "Versión", name: "Model 3 Estándar" },
  // Códigos de trim/modelo adicionales
  MTY03: { category: "Versión", name: "Model Y Long Range All-Wheel Drive" },
  MTY04: { category: "Versión", name: "Model Y Performance" },
  MTY01: { category: "Versión", name: "Model Y Rear-Wheel Drive" },
  MT301: { category: "Versión", name: "Model 3 Rear-Wheel Drive" },
  MT303: { category: "Versión", name: "Model 3 Long Range" },
  MT304: { category: "Versión", name: "Model 3 Performance" },
  // Códigos de serie
  GENERAL_PRODUCTION: { category: "Serie", name: "Producción General" },
  GENERAL: { category: "Serie", name: "Producción General" }
};

// Combinar todos los códigos
export const MKT_OPTIONS: Record<string, MktOptionInfo> = {
  ...PAINT_CODES,
  ...INTERIOR_CODES,
  ...WHEEL_CODES,
  ...AUTOPILOT_CODES,
  ...CHARGER_CODES,
  ...PACKAGE_CODES,
  ...BATTERY_CODES,
  ...MODEL_CONFIG_CODES
};

export function decodeMktOption(code: string): MktOptionInfo {
  const upperCode = code.toUpperCase().trim();
  return MKT_OPTIONS[upperCode] || { category: "Otro", name: code };
}

export function decodeMktOptions(optionsString: string | null): MktOptionInfo[] {
  if (!optionsString) return [];
  
  // Dividir por coma y limpiar
  const codes = optionsString.split(',').map(c => c.trim()).filter(Boolean);
  
  return codes.map(code => decodeMktOption(code));
}

export function groupMktOptionsByCategory(options: MktOptionInfo[]): Record<string, MktOptionInfo[]> {
  return options.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, MktOptionInfo[]>);
}
