// ============================================
// NOUVELLE ARCHITECTURE : CLIENT-SIDE GEMINI
// ============================================
// Cette version appelle Gemini DIRECTEMENT depuis le navigateur
// Plus besoin de proxy Vercel = Plus de problèmes de configuration

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error('⚠️ VITE_GEMINI_API_KEY not found in environment variables');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// Configuration pour des réponses JSON stables
const generationConfig = {
  temperature: 0.2,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Helper pour nettoyer les réponses JSON
const cleanJsonResponse = (text: string | undefined): string => {
  if (!text) return "{}";
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
  cleaned = cleaned.trim();
  if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
    console.warn('[cleanJsonResponse] Response does not start with JSON:', cleaned.substring(0, 100));
    return JSON.stringify({ raw_text: cleaned });
  }
  return cleaned;
};

// Fonction générique pour appeler Gemini
async function callGemini(prompt: string, systemInstruction: string): Promise<string> {
  if (!genAI) {
    console.error('Gemini AI not initialized - missing API key');
    return "{}";
  }

  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
      generationConfig: generationConfig,
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return cleanJsonResponse(text);
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return JSON.stringify({ error: error.message || 'Unknown error' });
  }
}

// ============================================
// PROMPTS SYSTÈME (Version stricte JSON)
// ============================================

const SYSTEM_PROMPT_STREET = `Tu es un expert immobilier d'élite. RÈGLE ABSOLUE : Réponds UNIQUEMENT avec un objet JSON valide, SANS texte explicatif, SANS markdown. Structure EXACTE requise : { "address": "...", "identity": { "ambiance": "...", "keywords": [], "accessibility_score": 0, "services_score": 0 }, "urbanism": { "building_type": "...", "plu_note": "...", "connectivity": [] }, "lifestyle": { "schools": [], "leisure": [] }, "highlights": [], "marketing_titles": [] }. Toutes les clés doivent être présentes.`;

const SYSTEM_PROMPT_TECHNICAL = `ROLE : EXPERT TECHNIQUE IMMOBILIER. RÈGLE ABSOLUE : Réponds UNIQUEMENT avec un objet JSON valide, SANS texte explicatif, SANS markdown. Structure EXACTE : { "global_summary": "...", "items": [{ "equipment_name": "...", "verdict": "...", "technical_opinion": "...", "consumption_projection": "...", "sales_argument": "...", "negotiation_point": "..." }] }`;

const SYSTEM_PROMPT_HEATING = `EXPERT TECHNIQUE : CHAUFFAGE & ECS. RÈGLE ABSOLUE : Réponds UNIQUEMENT avec un objet JSON valide, SANS texte explicatif, SANS markdown. Structure EXACTE : { "configuration": { "type": "...", "description": "...", "pros_cons": "..." }, "brand_analysis": { "positioning": "...", "details": "..." }, "economic_analysis": { "rating": "...", "dpe_impact": "..." }, "agent_clarification": "...", "vigilance_points": [] }`;

const SYSTEM_PROMPT_RENOVATION = `SECTION : POTENTIEL TRAVAUX & VALORISATION RAPIDE. RÈGLE ABSOLUE : Réponds UNIQUEMENT avec un objet JSON valide, SANS texte explicatif, SANS markdown. Structure EXACTE : { "analysis": { "visual_diagnosis": "...", "light_strategy": "..." }, "smart_renovation": [], "estimates": [], "sales_arguments": [], "expert_secret": "..." }`;

const SYSTEM_PROMPT_CHECKLIST = `SECTION : FICHE DE ROUTE TERRAIN. RÈGLE ABSOLUE : Réponds UNIQUEMENT avec un objet JSON valide, SANS texte explicatif, SANS markdown. Structure EXACTE : { "physical_checks": [], "shock_questions": [], "documents_needed": [], "strategic_reminder": "..." }`;

const SYSTEM_PROMPT_COPRO = `ANALYSE COPRO. RÈGLE ABSOLUE : Réponds UNIQUEMENT avec un objet JSON valide, SANS texte explicatif, SANS markdown. Structure EXACTE : { "summary": "...", "works_voted": [], "works_planned": [], "financial_alerts": [], "legal_alerts": [], "sales_argument": "..." }`;

const SYSTEM_PROMPT_PIGE = `PIGE STRATÉGIQUE. RÈGLE ABSOLUE : Réponds UNIQUEMENT avec un objet JSON valide, SANS texte explicatif, SANS markdown. Structure EXACTE : { "ad_analysis": { "flaws": [], "missing_info": [] }, "call_script": { "hook": "...", "technical_question": "...", "closing": "..." }, "expert_argument": "..." }`;

const SYSTEM_PROMPT_DPE = `DPE BOOSTER. RÈGLE ABSOLUE : Réponds UNIQUEMENT avec un objet JSON valide, SANS texte explicatif, SANS markdown. Structure EXACTE : { "current_analysis": "...", "improvements": [], "green_value_argument": "..." }`;

const SYSTEM_PROMPT_REDACTION = `RÉDACTION PRO. RÈGLE ABSOLUE : Réponds UNIQUEMENT avec un objet JSON valide, SANS texte explicatif, SANS markdown. Structure EXACTE : { "email_vendor": "...", "social_post_linkedin": "...", "social_post_instagram": "..." }`;

const SYSTEM_PROMPT_PROSPECTION = `ROLE : Intelligence centrale Action Immobilier. RÈGLE ABSOLUE : Réponds UNIQUEMENT avec un objet JSON valide, SANS texte explicatif, SANS markdown. CAS [ADD] Structure EXACTE : { "intent": "log_prospection", "assistant_response": "...", "data": { "zone": "...", "type": "...", "date": "...", "mois": "..." } }. CAS [DELETE] Structure EXACTE : { "intent": "delete_request", "assistant_response": "...", "target": "...", "scope": "..." }`;

const SYSTEM_PROMPT_ESTIMATION_SUMMARY = `ROLE : Expert-Rédacteur Senior. Synthétise en Markdown.`;

const SYSTEM_PROMPT_DYNAMIC_REDACTION = `Assistant Communication. RÈGLE ABSOLUE : Réponds UNIQUEMENT avec un objet JSON valide, SANS texte explicatif, SANS markdown. Structure EXACTE : { "subject": "...", "content": "..." }`;

// ============================================
// FONCTIONS PUBLIQUES (API)
// ============================================

export const getApiStatus = (): string => "CLIENT_SIDE_GEMINI_READY";

export const generateStreetReport = async (address: string): Promise<string> => {
  return await callGemini(`Analyse : ${address}`, SYSTEM_PROMPT_STREET);
};

export const generateTechnicalReport = async (description: string): Promise<string> => {
  return await callGemini(`Analyse : ${description}`, SYSTEM_PROMPT_TECHNICAL);
};

export const generateHeatingReport = async (description: string): Promise<string> => {
  return await callGemini(`Analyse : ${description}`, SYSTEM_PROMPT_HEATING);
};

export const generateRenovationReport = async (description: string): Promise<string> => {
  return await callGemini(`Analyse : ${description}`, SYSTEM_PROMPT_RENOVATION);
};

export const generateChecklistReport = async (description: string): Promise<string> => {
  return await callGemini(`Analyse : ${description}`, SYSTEM_PROMPT_CHECKLIST);
};

export const generateCoproReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  // Note: File upload not supported in client-side version yet
  return await callGemini(`Analyse : ${input}`, SYSTEM_PROMPT_COPRO);
};

export const generatePigeReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  return await callGemini(`Analyse : ${input}`, SYSTEM_PROMPT_PIGE);
};

export const generateDpeReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  return await callGemini(`Analyse : ${input}`, SYSTEM_PROMPT_DPE);
};

export const generateRedactionReport = async (input: string): Promise<string> => {
  return await callGemini(`Rédige pour : ${input}`, SYSTEM_PROMPT_REDACTION);
};

export const generateProspectionReport = async (input: string): Promise<string> => {
  return await callGemini(`Date=${new Date().toISOString()}. IN: ${input}`, SYSTEM_PROMPT_PROSPECTION);
};

export const generateEstimationSummary = async (data: any): Promise<string> => {
  const result = await callGemini(`Synthèse: ${JSON.stringify(data)}`, SYSTEM_PROMPT_ESTIMATION_SUMMARY);
  return result || "";
};

export const generateDynamicRedaction = async (type: string, desc: string, variant: boolean = false): Promise<any> => {
  const result = await callGemini(`T: ${type}, D: ${desc}, V: ${variant}`, SYSTEM_PROMPT_DYNAMIC_REDACTION);
  return JSON.parse(cleanJsonResponse(result));
};
