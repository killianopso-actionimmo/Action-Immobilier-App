import { GoogleGenAI } from "@google/genai";

// --- SECURE KEY RETRIEVAL (VITE STANDARDS) ---
const getApiKey = () => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key || key === 'undefined' || key === 'null' || key.trim() === '') {
    throw new Error("Configuration système manquante (VITE_GEMINI_API_KEY)");
  }
  return key;
};

export const getApiStatus = (): string => {
  try {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    return (key && key !== 'undefined' && key.trim() !== '') ? 'OK' : 'VIDE';
  } catch (e) {
    return 'ERREUR_LECTURE';
  }
};

const classifyError = (error: any): string => {
  const msg = error?.message?.toLowerCase() || "";
  if (msg.includes("api key") || msg.includes("403") || msg.includes("401")) {
    return "Erreur d'authentification : Clé manquante ou invalide.";
  }
  if (msg.includes("429") || msg.includes("quota")) {
    return "Quota atteint : Trop de requêtes envoyées.";
  }
  if (msg.includes("region") || msg.includes("location") || msg.includes("not supported")) {
    return "Erreur de région : Service non supporté dans cette zone.";
  }
  return `Erreur technique : ${error?.message || "Erreur inconnue"}`;
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

// --- CORE GENERATION HELPER (NEXT GEN SDK V1.x) ---
const callGemini = async (contents: any, systemInstruction: string, tools?: any[]) => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: Array.isArray(contents) ? contents : [{ role: "user", parts: [{ text: contents }] }],
      config: {
        systemInstruction,
        temperature: 0.4,
        tools: tools as any
      }
    });
    return response.text;
  } catch (e) {
    console.error("Gemini SDK Error:", e);
    throw new Error(classifyError(e));
  }
};

// --- API METHODS ---
export const generateStreetReport = async (address: string): Promise<string> => {
  const text = await callGemini(`Analyse : ${address}`, SYSTEM_PROMPT_STREET, [{ googleMaps: {} }]);
  return cleanJsonResponse(text);
};

export const generateTechnicalReport = async (description: string): Promise<string> => {
  const text = await callGemini(`Analyse : ${sanitizeInput(description)}`, SYSTEM_PROMPT_TECHNICAL);
  return cleanJsonResponse(text);
};

export const generateHeatingReport = async (description: string): Promise<string> => {
  const text = await callGemini(`Analyse : ${sanitizeInput(description)}`, SYSTEM_PROMPT_HEATING);
  return cleanJsonResponse(text);
};

export const generateRenovationReport = async (description: string): Promise<string> => {
  const text = await callGemini(`Analyse : ${sanitizeInput(description)}`, SYSTEM_PROMPT_RENOVATION);
  return cleanJsonResponse(text);
};

export const generateChecklistReport = async (description: string): Promise<string> => {
  const text = await callGemini(`Analyse : ${sanitizeInput(description)}`, SYSTEM_PROMPT_CHECKLIST);
  return cleanJsonResponse(text);
};

export const generateCoproReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  const parts: any[] = [];
  if (fileData) parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
  if (input) parts.push({ text: sanitizeInput(input) });
  if (parts.length === 0) return "{}";

  const text = await callGemini([{ role: "user", parts }], SYSTEM_PROMPT_COPRO);
  return cleanJsonResponse(text);
};

export const generatePigeReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  const parts: any[] = [];
  if (fileData) parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
  if (input) parts.push({ text: sanitizeInput(input) });
  if (parts.length === 0) return "{}";

  const text = await callGemini([{ role: "user", parts }], SYSTEM_PROMPT_PIGE);
  return cleanJsonResponse(text);
};

export const generateDpeReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  const parts: any[] = [];
  if (fileData) parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
  if (input) parts.push({ text: sanitizeInput(input) });
  if (parts.length === 0) return "{}";

  const text = await callGemini([{ role: "user", parts }], SYSTEM_PROMPT_DPE);
  return cleanJsonResponse(text);
};

export const generateRedactionReport = async (input: string): Promise<string> => {
  const text = await callGemini(`Rédige : ${sanitizeInput(input)}`, SYSTEM_PROMPT_REDACTION);
  return cleanJsonResponse(text);
};

export const generateProspectionReport = async (input: string): Promise<string> => {
  const text = await callGemini(`Date=${new Date().toISOString()}. IN: ${sanitizeInput(input)}`, SYSTEM_PROMPT_PROSPECTION);
  return cleanJsonResponse(text);
};

export const generateEstimationSummary = async (data: any): Promise<string> => {
  const text = await callGemini(`Synthèse: ${JSON.stringify(data)}`, SYSTEM_PROMPT_ESTIMATION_SUMMARY);
  return text || "";
};

export const generateDynamicRedaction = async (type: string, desc: string, variant: boolean = false): Promise<any> => {
  const text = await callGemini(`T: ${type}, D: ${sanitizeInput(desc)}, V: ${variant}`, SYSTEM_PROMPT_DYNAMIC_REDACTION);
  return JSON.parse(cleanJsonResponse(text));
};