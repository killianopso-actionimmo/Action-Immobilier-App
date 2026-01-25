import { GoogleGenAI } from "@google/genai";

const FALLBACK_KEY = "AIzaSyDWJQqHCiqrTX9roPIcRUkSDLBQO-T_S30";

const getApiKey = () => {
  // Try Vite env
  let key = import.meta.env.VITE_GEMINI_API_KEY;

  // Validate key
  if (!key || key === 'undefined' || key === 'null' || key.trim() === '') {
    return FALLBACK_KEY;
  }
  return key;
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
const SYSTEM_PROMPT_STREET = `Tu es un expert immobilier d'élite. Tu dois générer des données techniques PRÉCISES pour un rapport de valorisation immobilière "Action Immobilier". IMPORTANT : Réponds UNIQUEMENT avec le JSON brut. PAS de balises markdown. JSON: { "address": "...", "identity": { "ambiance": "...", "keywords": [], "accessibility_score": 0, "services_score": 0 }, "urbanism": { "building_type": "...", "plu_note": "...", "connectivity": [] }, "lifestyle": { "schools": [], "leisure": [] }, "highlights": [], "marketing_titles": [] }`;
const SYSTEM_PROMPT_TECHNICAL = `ROLE : EXPERT TECHNIQUE IMMOBILIER. Analyse les équipements techniques. JSON brut uniquement: { "global_summary": "...", "items": [{ "equipment_name": "...", "verdict": "...", "technical_opinion": "...", "consumption_projection": "...", "sales_argument": "...", "negotiation_point": "..." }] }`;
const SYSTEM_PROMPT_HEATING = `### EXPERT TECHNIQUE : CHAUFFAGE & ECS. JSON brut uniquement: { "configuration": { "type": "...", "description": "...", "pros_cons": "..." }, "brand_analysis": { "positioning": "...", "details": "..." }, "economic_analysis": { "rating": "...", "dpe_impact": "..." }, "agent_clarification": "...", "vigilance_points": [] }`;
const SYSTEM_PROMPT_RENOVATION = `### SECTION : POTENTIEL TRAVAUX & VALORISATION RAPIDE. JSON brut uniquement: { "analysis": { "visual_diagnosis": "...", "light_strategy": "..." }, "smart_renovation": [], "estimates": [], "sales_arguments": [], "expert_secret": "..." }`;
const SYSTEM_PROMPT_CHECKLIST = `### SECTION : FICHE DE ROUTE TERRAIN. JSON brut uniquement: { "physical_checks": [], "shock_questions": [], "documents_needed": [], "strategic_reminder": "..." }`;
const SYSTEM_PROMPT_COPRO = `### ANALYSE COPRO. JSON brut uniquement: { "summary": "...", "works_voted": [], "works_planned": [], "financial_alerts": [], "legal_alerts": [], "sales_argument": "..." }`;
const SYSTEM_PROMPT_PIGE = `### PIGE STRATÉGIQUE. JSON brut uniquement: { "ad_analysis": { "flaws": [], "missing_info": [] }, "call_script": { "hook": "...", "technical_question": "...", "closing": "..." }, "expert_argument": "..." }`;
const SYSTEM_PROMPT_DPE = `### DPE BOOSTER. JSON brut uniquement: { "current_analysis": "...", "improvements": [], "green_value_argument": "..." }`;
const SYSTEM_PROMPT_REDACTION = `### RÉDACTION PRO. JSON brut uniquement: { "email_vendor": "...", "social_post_linkedin": "...", "social_post_instagram": "..." }`;
const SYSTEM_PROMPT_PROSPECTION = `ROLE : Intelligence centrale Action Immobilier. Nettoie et structure l'input. JSON: { "intent": "log_prospection", "assistant_response": "...", "data": { "zone": "...", "type": "...", "date": "...", "mois": "..." } }`;
const SYSTEM_PROMPT_ESTIMATION_SUMMARY = `ROLE : Expert-Rédacteur Senior Action Immobilier. Synthétise les notes en rapport Markdown propre.`;
const SYSTEM_PROMPT_DYNAMIC_REDACTION = `ROLE : Assistant Communication. JSON brut uniquement: { "subject": "...", "content": "..." }`;

// --- METHODS ---
export const generateStreetReport = async (address: string): Promise<string> => {
  const genAI = new GoogleGenAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT_STREET });
  try {
    const result = await model.generateContent(`Analyse l'adresse : ${address}.`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (error) { throw new Error("Erreur IA Quartier."); }
};

export const generateTechnicalReport = async (description: string): Promise<string> => {
  const genAI = new GoogleGenAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT_TECHNICAL });
  try {
    const result = await model.generateContent(`Analyse : ${sanitizeInput(description)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (error) { throw new Error("Erreur IA Technique."); }
};

export const generateHeatingReport = async (description: string): Promise<string> => {
  const genAI = new GoogleGenAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT_HEATING });
  try {
    const result = await model.generateContent(`Analyse : ${sanitizeInput(description)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (error) { throw new Error("Erreur IA Chauffage."); }
};

export const generateRenovationReport = async (description: string): Promise<string> => {
  const genAI = new GoogleGenAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT_RENOVATION });
  try {
    const result = await model.generateContent(`Analyse : ${sanitizeInput(description)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (error) { throw new Error("Erreur IA Travaux."); }
};

export const generateChecklistReport = async (description: string): Promise<string> => {
  const genAI = new GoogleGenAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT_CHECKLIST });
  try {
    const result = await model.generateContent(`Analyse : ${sanitizeInput(description)}`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (error) { throw new Error("Erreur IA Checklist."); }
};

export const generateCoproReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  const genAI = new GoogleGenAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT_COPRO });
  try {
    const parts: any[] = [];
    if (fileData) parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
    if (input) parts.push({ text: sanitizeInput(input) });
    const result = await model.generateContent(parts);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (error) { throw new Error("Erreur IA Copro."); }
};

export const generatePigeReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  const genAI = new GoogleGenAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT_PIGE });
  try {
    const parts: any[] = [];
    if (fileData) parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
    if (input) parts.push({ text: sanitizeInput(input) });
    const result = await model.generateContent(parts);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (error) { throw new Error("Erreur IA Pige."); }
};

export const generateDpeReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  const genAI = new GoogleGenAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT_DPE });
  try {
    const parts: any[] = [];
    if (fileData) parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
    if (input) parts.push({ text: sanitizeInput(input) });
    const result = await model.generateContent(parts);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (error) { throw new Error("Erreur IA DPE."); }
};

export const generateRedactionReport = async (input: string): Promise<string> => {
  const genAI = new GoogleGenAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT_REDACTION });
  try {
    const result = await model.generateContent(`Rédige pour : "${sanitizeInput(input)}"`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (error) { throw new Error("Erreur IA Rédaction."); }
};

export const generateProspectionReport = async (input: string): Promise<string> => {
  const genAI = new GoogleGenAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT_PROSPECTION });
  try {
    const result = await model.generateContent(`Date=${new Date().toISOString()}. INPUT : "${sanitizeInput(input)}"`);
    const response = await result.response;
    return cleanJsonResponse(response.text());
  } catch (error) { throw new Error("Erreur IA Prospection."); }
};

export const generateEstimationSummary = async (data: any): Promise<string> => {
  const genAI = new GoogleGenAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT_ESTIMATION_SUMMARY });
  try {
    const result = await model.generateContent(`Synthèse pour : ${JSON.stringify(data)}`);
    const response = await result.response;
    return response.text();
  } catch (error) { throw new Error("Erreur IA Synthèse."); }
};

export const generateDynamicRedaction = async (type: string, desc: string, variant: boolean = false): Promise<any> => {
  const genAI = new GoogleGenAI(getApiKey());
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction: SYSTEM_PROMPT_DYNAMIC_REDACTION });
  try {
    const result = await model.generateContent(`TYPE: ${type}, DESC: ${sanitizeInput(desc)}, VAR: ${variant}`);
    const response = await result.response;
    return JSON.parse(cleanJsonResponse(response.text()));
  } catch (error) { throw new Error("Erreur IA Dynamique."); }
};