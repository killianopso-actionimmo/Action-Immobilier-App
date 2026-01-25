// --- FRONTEND SERVICE (V-1.1.3 SYNC) ---

const callProxy = async (contents: any, systemInstruction: string, tools?: any[]) => {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, systemInstruction, tools })
    });

    if (!response.ok) {
      const errorData = await response.json();
      // We pass the full error string to the UI for capture
      const errorMsg = typeof errorData.error === 'string' ? errorData.error : JSON.stringify(errorData.error);
      throw new Error(errorMsg + " [V-FRONT-1.1.3]");
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

export const getApiStatus = (): string => "SERVER_MODE_1.1.3_DIAG_MODE";

// --- DETAILED PROMPTS (RESTORED) ---
const SYSTEM_PROMPT_STREET = `Tu es un expert immobilier d'élite. Tu dois générer des données techniques PRÉCISES pour un rapport de valorisation immobilière "Action Immobilier". RÉPONDS UNIQUEMENT EN JSON BRUT. Structure : { "address": "...", "identity": { "ambiance": "...", "keywords": [], "accessibility_score": 0, "services_score": 0 }, "urbanism": { "building_type": "...", "plu_note": "...", "connectivity": [] }, "lifestyle": { "schools": [], "leisure": [] }, "highlights": [], "marketing_titles": [] }`;

const SYSTEM_PROMPT_TECHNICAL = `ROLE : EXPERT TECHNIQUE IMMOBILIER. Analyse les équipements techniques. JSON brut uniquement. { "global_summary": "...", "items": [{ "equipment_name": "...", "verdict": "...", "technical_opinion": "...", "consumption_projection": "...", "sales_argument": "...", "negotiation_point": "..." }] }`;

const SYSTEM_PROMPT_HEATING = `### EXPERT TECHNIQUE : CHAUFFAGE & ECS. JSON brut uniquement. { "configuration": { "type": "...", "description": "...", "pros_cons": "..." }, "brand_analysis": { "positioning": "...", "details": "..." }, "economic_analysis": { "rating": "...", "dpe_impact": "..." }, "agent_clarification": "...", "vigilance_points": [] }`;

const SYSTEM_PROMPT_RENOVATION = `### SECTION : POTENTIEL TRAVAUX & VALORISATION RAPIDE. JSON brut uniquement. { "analysis": { "visual_diagnosis": "...", "light_strategy": "..." }, "smart_renovation": [], "estimates": [], "sales_arguments": [], "expert_secret": "..." }`;

const SYSTEM_PROMPT_CHECKLIST = `### SECTION : FICHE DE ROUTE TERRAIN. JSON brut uniquement. { "physical_checks": [], "shock_questions": [], "documents_needed": [], "strategic_reminder": "..." }`;

const SYSTEM_PROMPT_COPRO = `### ANALYSE COPRO. JSON brut uniquement. { "summary": "...", "works_voted": [], "works_planned": [], "financial_alerts": [], "legal_alerts": [], "sales_argument": "..." }`;

const SYSTEM_PROMPT_PIGE = `### PIGE STRATÉGIQUE. JSON brut uniquement. { "ad_analysis": { "flaws": [], "missing_info": [] }, "call_script": { "hook": "...", "technical_question": "...", "closing": "..." }, "expert_argument": "..." }`;

const SYSTEM_PROMPT_DPE = `### DPE BOOSTER. JSON brut uniquement. { "current_analysis": "...", "improvements": [], "green_value_argument": "..." }`;

const SYSTEM_PROMPT_REDACTION = `### RÉDACTION PRO. JSON brut uniquement. { "email_vendor": "...", "social_post_linkedin": "...", "social_post_instagram": "..." }`;

const SYSTEM_PROMPT_PROSPECTION = `ROLE : Intelligence centrale Action Immobilier. JSON brut uniquement. CAS [ADD] : { "intent": "log_prospection", "assistant_response": "...", "data": { "zone": "...", "type": "...", "date": "...", "mois": "..." } }. CAS [DELETE] : { "intent": "delete_request", "assistant_response": "...", "target": "...", "scope": "..." }`;

const SYSTEM_PROMPT_ESTIMATION_SUMMARY = `ROLE : Expert-Rédacteur Senior. Synthétise en Markdown.`;

const SYSTEM_PROMPT_DYNAMIC_REDACTION = `Assistant Communication. JSON brut uniquement: { "subject": "...", "content": "..." }`;

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
  const text = await callProxy(`Rédige pour : ${sanitizeInput(input)}`, SYSTEM_PROMPT_REDACTION);
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