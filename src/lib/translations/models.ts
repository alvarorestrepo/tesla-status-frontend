export const MODEL_CODES: Record<string, string> = {
  my: "Model Y",
  m3: "Model 3",
  ms: "Model S",
  mx: "Model X",
  cy: "Cybertruck",
  ro: "Roadster"
};

export function decodeModel(code: string | null): string {
  if (!code) return "Desconocido";
  return MODEL_CODES[code.toLowerCase()] || code.toUpperCase();
}
