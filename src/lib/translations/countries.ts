export const COUNTRY_CODES: Record<string, { name: string; flag: string }> = {
  CO: { name: "Colombia", flag: "🇨🇴" },
  US: { name: "Estados Unidos", flag: "🇺🇸" },
  CA: { name: "Canadá", flag: "🇨🇦" },
  MX: { name: "México", flag: "🇲🇽" },
  DE: { name: "Alemania", flag: "🇩🇪" },
  FR: { name: "Francia", flag: "🇫🇷" },
  ES: { name: "España", flag: "🇪🇸" },
  UK: { name: "Reino Unido", flag: "🇬🇧" },
  AU: { name: "Australia", flag: "🇦🇺" },
  JP: { name: "Japón", flag: "🇯🇵" },
  CN: { name: "China", flag: "🇨🇳" },
  BR: { name: "Brasil", flag: "🇧🇷" },
  AR: { name: "Argentina", flag: "🇦🇷" },
  CL: { name: "Chile", flag: "🇨🇱" },
  PE: { name: "Perú", flag: "🇵🇪" },
  EC: { name: "Ecuador", flag: "🇪🇨" },
  PA: { name: "Panamá", flag: "🇵🇦" },
  CR: { name: "Costa Rica", flag: "🇨🇷" },
  GT: { name: "Guatemala", flag: "🇬🇹" },
  SV: { name: "El Salvador", flag: "🇸🇻" },
  HN: { name: "Honduras", flag: "🇭🇳" },
  NI: { name: "Nicaragua", flag: "🇳🇮" },
  BO: { name: "Bolivia", flag: "🇧🇴" },
  PY: { name: "Paraguay", flag: "🇵🇾" },
  UY: { name: "Uruguay", flag: "🇺🇾" },
  VE: { name: "Venezuela", flag: "🇻🇪" }
};

export function decodeCountry(code: string | null): { name: string; flag: string } {
  if (!code) return { name: "Desconocido", flag: "🏳️" };
  return COUNTRY_CODES[code.toUpperCase()] || { name: code.toUpperCase(), flag: "🏳️" };
}
