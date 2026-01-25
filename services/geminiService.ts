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

const SYSTEM_PROMPT_STREET = `Expert Immobilier. JSON brut uniquement.`;
const SYSTEM_PROMPT_TECHNICAL = `ROLE: EXPERT TECHNIQUE. JSON brut uniquement.`;
const SYSTEM_PROMPT_HEATING = `### EXPERT CHAUFFAGE. JSON brut uniquement.`;
const SYSTEM_PROMPT_RENOVATION = `### POTENTIEL TRAVAUX. JSON brut uniquement.`;
const SYSTEM_PROMPT_CHECKLIST = `### FICHE TERRAIN. JSON brut uniquement.`;
const SYSTEM_PROMPT_COPRO = `### ANALYSE COPRO. JSON brut uniquement.`;
const SYSTEM_PROMPT_PIGE = `### PIGE PRO. JSON brut uniquement.`;
const SYSTEM_PROMPT_DPE = `### DPE BOOSTER. JSON brut uniquement.`;
const SYSTEM_PROMPT_REDACTION = `### RÉDACTION PRO. JSON brut uniquement.`;
const SYSTEM_PROMPT_PROSPECTION = `IA Action Immobilier. JSON brut uniquement.`;
const SYSTEM_PROMPT_ESTIMATION_SUMMARY = `Synthese Markdown.`;
const SYSTEM_PROMPT_DYNAMIC_REDACTION = `Communication. JSON brut uniquement.`;

const getModel = (instruction: string, tools?: any[]) => {
  const apiKey = getApiKey();
  // CRITICAL: GoogleGenAI (Next Gen ^1.x) constructor expects { apiKey } object
  const genAI = new GoogleGenAI({ apiKey });
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: instruction,
    tools: tools as any
  });
};

export const generateStreetReport = async (address: string): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_STREET, [{ googleMaps: {} }]);
    const result = await model.generateContent(`Analyse : ${address}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { throw new Error(classifyError(e)); }
};

export const generateTechnicalReport = async (description: string): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_TECHNICAL);
    const result = await model.generateContent(`Analyse : ${sanitizeInput(description)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { throw new Error(classifyError(e)); }
};

export const generateHeatingReport = async (description: string): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_HEATING);
    const result = await model.generateContent(`Analyse : ${sanitizeInput(description)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { throw new Error(classifyError(e)); }
};

export const generateRenovationReport = async (description: string): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_RENOVATION);
    const result = await model.generateContent(`Analyse : ${sanitizeInput(description)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { throw new Error(classifyError(e)); }
};

export const generateChecklistReport = async (description: string): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_CHECKLIST);
    const result = await model.generateContent(`Analyse : ${sanitizeInput(description)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { throw new Error(classifyError(e)); }
};

export const generateCoproReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_COPRO);
    const parts: any[] = [];
    if (fileData) parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
    if (input) parts.push({ text: sanitizeInput(input) });
    if (parts.length === 0) return "{}";
    const result = await model.generateContent(parts);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { throw new Error(classifyError(e)); }
};

export const generatePigeReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_PIGE);
    const parts: any[] = [];
    if (fileData) parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
    if (input) parts.push({ text: sanitizeInput(input) });
    if (parts.length === 0) return "{}";
    const result = await model.generateContent(parts);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { throw new Error(classifyError(e)); }
};

export const generateDpeReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_DPE);
    const parts: any[] = [];
    if (fileData) parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
    if (input) parts.push({ text: sanitizeInput(input) });
    if (parts.length === 0) return "{}";
    const result = await model.generateContent(parts);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { throw new Error(classifyError(e)); }
};

export const generateRedactionReport = async (input: string): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_REDACTION);
    const result = await model.generateContent(`Rédige : ${sanitizeInput(input)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (error) { throw new Error(classifyError(error)); }
};

export const generateProspectionReport = async (input: string): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_PROSPECTION);
    const result = await model.generateContent(`Date=${new Date().toISOString()}. IN: ${sanitizeInput(input)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { throw new Error(classifyError(e)); }
};

export const generateEstimationSummary = async (data: any): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_ESTIMATION_SUMMARY);
    const result = await model.generateContent(`Synthèse: ${JSON.stringify(data)}`);
    const response = await result.response;
    return response.text();
  } catch (e) { throw new Error(classifyError(e)); }
};

export const generateDynamicRedaction = async (type: string, desc: string, variant: boolean = false): Promise<any> => {
  try {
    const model = getModel(SYSTEM_PROMPT_DYNAMIC_REDACTION);
    const result = await model.generateContent(`T: ${type}, D: ${sanitizeInput(desc)}, V: ${variant}`);
    const response = await result.response;
    return JSON.parse(cleanJsonResponse(response.text()));
  } catch (e) { throw new Error(classifyError(e)); }
};