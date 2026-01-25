import { GoogleGenAI } from "@google/genai";

// Clé de secours directe pour garantir le fonctionnement immédiat
const API_KEY = "AIzaSyDWJQqHCiqrTX9roPIcRUkSDLBQO-T_S30";

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
const SYSTEM_PROMPT_STREET = `Tu es un expert immobilier d'élite. Réponds UNIQUEMENT en JSON brut. Structure: { "address": "...", "identity": { "ambiance": "...", "keywords": [], "accessibility_score": 0, "services_score": 0 }, "urbanism": { "building_type": "...", "plu_note": "...", "connectivity": [] }, "lifestyle": { "schools": [], "leisure": [] }, "highlights": [], "marketing_titles": [] }`;
const SYSTEM_PROMPT_TECHNICAL = `ROLE : EXPERT TECHNIQUE. JSON brut uniquement. { "global_summary": "...", "items": [{ "equipment_name": "...", "verdict": "...", "technical_opinion": "...", "consumption_projection": "...", "sales_argument": "...", "negotiation_point": "..." }] }`;
const SYSTEM_PROMPT_HEATING = `### EXPERT CHAUFFAGE. JSON brut uniquement. { "configuration": { "type": "...", "description": "...", "pros_cons": "..." }, "brand_analysis": { "positioning": "...", "details": "..." }, "economic_analysis": { "rating": "...", "dpe_impact": "..." }, "agent_clarification": "...", "vigilance_points": [] }`;
const SYSTEM_PROMPT_RENOVATION = `### POTENTIEL TRAVAUX. JSON brut uniquement. { "analysis": { "visual_diagnosis": "...", "light_strategy": "..." }, "smart_renovation": [], "estimates": [], "sales_arguments": [], "expert_secret": "..." }`;
const SYSTEM_PROMPT_CHECKLIST = `### FICHE TERRAIN. JSON brut uniquement. { "physical_checks": [], "shock_questions": [], "documents_needed": [], "strategic_reminder": "..." }`;
const SYSTEM_PROMPT_COPRO = `### ANALYSE COPRO. JSON brut uniquement. { "summary": "...", "works_voted": [], "works_planned": [], "financial_alerts": [], "legal_alerts": [], "sales_argument": "..." }`;
const SYSTEM_PROMPT_PIGE = `### PIGE PRO. JSON brut uniquement. { "ad_analysis": { "flaws": [], "missing_info": [] }, "call_script": { "hook": "...", "technical_question": "...", "closing": "..." }, "expert_argument": "..." }`;
const SYSTEM_PROMPT_DPE = `### DPE BOOSTER. JSON brut uniquement. { "current_analysis": "...", "improvements": [], "green_value_argument": "..." }`;
const SYSTEM_PROMPT_REDACTION = `### RÉDACTION PRO. JSON brut uniquement. { "email_vendor": "...", "social_post_linkedin": "...", "social_post_instagram": "..." }`;
const SYSTEM_PROMPT_PROSPECTION = `ROLE : IA Action Immobilier. JSON: { "intent": "log_prospection", "assistant_response": "...", "data": { "zone": "...", "type": "...", "date": "...", "mois": "..." } }`;
const SYSTEM_PROMPT_ESTIMATION_SUMMARY = `ROLE : Expert-Rédacteur Action Immobilier. Synthétise en Markdown.`;
const SYSTEM_PROMPT_DYNAMIC_REDACTION = `ROLE : Assistant Communication. JSON: { "subject": "...", "content": "..." }`;

// --- HELPER INITIALIZATION ---
const getModel = (instruction: string, tools?: any[]) => {
  const genAI = new GoogleGenAI(API_KEY);
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: instruction,
    tools: tools as any
  });
};

// --- METHODS ---
export const generateStreetReport = async (address: string): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_STREET, [{ googleMaps: {} }]);
    const result = await model.generateContent(`Analyse : ${address}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { console.error(e); throw e; }
};

export const generateTechnicalReport = async (description: string): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_TECHNICAL);
    const result = await model.generateContent(`Analyse : ${sanitizeInput(description)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { console.error(e); throw e; }
};

export const generateHeatingReport = async (description: string): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_HEATING);
    const result = await model.generateContent(`Analyse : ${sanitizeInput(description)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { console.error(e); throw e; }
};

export const generateRenovationReport = async (description: string): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_RENOVATION);
    const result = await model.generateContent(`Analyse : ${sanitizeInput(description)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { console.error(e); throw e; }
};

export const generateChecklistReport = async (description: string): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_CHECKLIST);
    const result = await model.generateContent(`Analyse : ${sanitizeInput(description)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { console.error(e); throw e; }
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
  } catch (e) { console.error(e); throw e; }
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
  } catch (e) { console.error(e); throw e; }
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
  } catch (e) { console.error(e); throw e; }
};

export const generateRedactionReport = async (input: string): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_REDACTION);
    const result = await model.generateContent(`Rédige pour : ${sanitizeInput(input)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { console.error(e); throw e; }
};

export const generateProspectionReport = async (input: string): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_PROSPECTION);
    const result = await model.generateContent(`Date=${new Date().toISOString()}. IN: ${sanitizeInput(input)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (e) { console.error(e); throw e; }
};

export const generateEstimationSummary = async (data: any): Promise<string> => {
  try {
    const model = getModel(SYSTEM_PROMPT_ESTIMATION_SUMMARY);
    const result = await model.generateContent(`Synthèse: ${JSON.stringify(data)}`);
    const response = await result.response;
    return response.text();
  } catch (e) { console.error(e); throw e; }
};

export const generateDynamicRedaction = async (type: string, desc: string, variant: boolean = false): Promise<any> => {
  try {
    const model = getModel(SYSTEM_PROMPT_DYNAMIC_REDACTION);
    const result = await model.generateContent(`T: ${type}, D: ${sanitizeInput(desc)}, V: ${variant}`);
    const response = await result.response;
    return JSON.parse(cleanJsonResponse(response.text()));
  } catch (e) { console.error(e); throw e; }
};