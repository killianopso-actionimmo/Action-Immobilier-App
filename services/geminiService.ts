// --- FRONTEND SERVICE (CALLS VERCEL PROXY) ---

const callProxy = async (contents: any, systemInstruction: string, tools?: any[]) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, systemInstruction, tools })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur serveur.");
    }

    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.error("Proxy Fetch Error:", error);
    throw error;
  }
};

const sanitizeInput = (text: string): string => {
  if (!text) return "";
  let clean = text.normalize("NFKC");
  clean = clean.replace(/[\u200B-\u200D\uFEFF]/g, "");
  clean = clean.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
  return clean.trim();
};

const cleanJsonResponse = (text: string | undefined): string => {
  if (!text) return "{}";
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
  return cleaned.trim();
};

// Diagnostic
export const getApiStatus = (): string => {
  // Can't check env directly here easily for proxy, but we check if we can reach the app
  return "SERVER_MODE";
};

// --- PROMPTS ---
const SYSTEM_PROMPT_STREET = `Tu es un expert immobilier d'élite. Réponds UNIQUEMENT en JSON brut. { "address": "...", "identity": { "ambiance": "...", "keywords": [], "accessibility_score": 0, "services_score": 0 }, "urbanism": { "building_type": "...", "plu_note": "...", "connectivity": [] }, "lifestyle": { "schools": [], "leisure": [] }, "highlights": [], "marketing_titles": [] }`;
const SYSTEM_PROMPT_TECHNICAL = `ROLE : EXPERT TECHNIQUE. JSON brut uniquement.`;
const SYSTEM_PROMPT_HEATING = `### EXPERT CHAUFFAGE. JSON brut uniquement.`;
const SYSTEM_PROMPT_RENOVATION = `### POTENTIEL TRAVAUX. JSON brut uniquement.`;
const SYSTEM_PROMPT_CHECKLIST = `### FICHE TERRAIN. JSON brut uniquement.`;
const SYSTEM_PROMPT_COPRO = `### ANALYSE COPRO. JSON brut uniquement.`;
const SYSTEM_PROMPT_PIGE = `### PIGE PRO. JSON brut uniquement.`;
const SYSTEM_PROMPT_DPE = `### DPE BOOSTER. JSON brut uniquement.`;
const SYSTEM_PROMPT_REDACTION = `### RÉDACTION PRO. JSON brut uniquement.`;
const SYSTEM_PROMPT_PROSPECTION = `IA Action Immobilier. JSON: { "intent": "log_prospection", "assistant_response": "...", "data": { "zone": "...", "type": "...", "date": "...", "mois": "..." } }`;
const SYSTEM_PROMPT_ESTIMATION_SUMMARY = `Synthese Markdown.`;
const SYSTEM_PROMPT_DYNAMIC_REDACTION = `Communication. JSON: { "subject": "...", "content": "..." }`;

// --- API METHODS ---
export const generateStreetReport = async (address: string): Promise<string> => {
  const text = await callProxy(`Analyse : ${address}`, SYSTEM_PROMPT_STREET, [{ googleMaps: {} }]);
  return cleanJsonResponse(text);
};

export const generateTechnicalReport = async (description: string): Promise<string> => {
  const text = await callProxy(`Analyse : ${sanitizeInput(description)}`, SYSTEM_PROMPT_TECHNICAL);
  return cleanJsonResponse(text);
};

export const generateHeatingReport = async (description: string): Promise<string> => {
  const text = await callProxy(`Analyse : ${sanitizeInput(description)}`, SYSTEM_PROMPT_HEATING);
  return cleanJsonResponse(text);
};

export const generateRenovationReport = async (description: string): Promise<string> => {
  const text = await callProxy(`Analyse : ${sanitizeInput(description)}`, SYSTEM_PROMPT_RENOVATION);
  return cleanJsonResponse(text);
};

export const generateChecklistReport = async (description: string): Promise<string> => {
  const text = await callProxy(`Analyse : ${sanitizeInput(description)}`, SYSTEM_PROMPT_CHECKLIST);
  return cleanJsonResponse(text);
};

export const generateCoproReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  const parts: any[] = [];
  if (fileData) parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
  if (input) parts.push({ text: sanitizeInput(input) });
  if (parts.length === 0) return "{}";

  const text = await callProxy([{ role: "user", parts }], SYSTEM_PROMPT_COPRO);
  return cleanJsonResponse(text);
};

export const generatePigeReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  const parts: any[] = [];
  if (fileData) parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
  if (input) parts.push({ text: sanitizeInput(input) });
  if (parts.length === 0) return "{}";

  const text = await callProxy([{ role: "user", parts }], SYSTEM_PROMPT_PIGE);
  return cleanJsonResponse(text);
};

export const generateDpeReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  const parts: any[] = [];
  if (fileData) parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
  if (input) parts.push({ text: sanitizeInput(input) });
  if (parts.length === 0) return "{}";

  const text = await callProxy([{ role: "user", parts }], SYSTEM_PROMPT_DPE);
  return cleanJsonResponse(text);
};

export const generateRedactionReport = async (input: string): Promise<string> => {
  const text = await callProxy(`Rédige : ${sanitizeInput(input)}`, SYSTEM_PROMPT_REDACTION);
  return cleanJsonResponse(text);
};

export const generateProspectionReport = async (input: string): Promise<string> => {
  const text = await callProxy(`Date=${new Date().toISOString()}. IN: ${sanitizeInput(input)}`, SYSTEM_PROMPT_PROSPECTION);
  return cleanJsonResponse(text);
};

export const generateEstimationSummary = async (data: any): Promise<string> => {
  const text = await callProxy(`Synthèse: ${JSON.stringify(data)}`, SYSTEM_PROMPT_ESTIMATION_SUMMARY);
  return text || "";
};

export const generateDynamicRedaction = async (type: string, desc: string, variant: boolean = false): Promise<any> => {
  const text = await callProxy(`T: ${type}, D: ${sanitizeInput(desc)}, V: ${variant}`, SYSTEM_PROMPT_DYNAMIC_REDACTION);
  return JSON.parse(cleanJsonResponse(text));
};