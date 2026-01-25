import { GoogleGenAI } from "@google/genai";

const getApiKey = () => {
  return (import.meta as any).env.VITE_GEMINI_API_KEY;
};

// Helper function to sanitize input (keep existing)
const sanitizeInput = (text: string): string => {
  if (!text) return "";
  let clean = text.normalize("NFKC");
  clean = clean.replace(/[\u200B-\u200D\uFEFF]/g, "");
  clean = clean.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
  return clean.trim();
};

// NEW: Helper function to clean Markdown from Gemini response
const cleanJsonResponse = (text: string | undefined): string => {
  if (!text) return "{}";
  let cleaned = text.trim();
  // Remove markdown code blocks (```json ... ``` or just ``` ... ```)
  // The regex covers case insensitivity and optional newlines
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/, "");
  return cleaned.trim();
};

const SYSTEM_PROMPT_STREET = `
Tu es un expert immobilier d'élite. Tu dois générer des données techniques PRÉCISES pour un rapport de valorisation immobilière "Action Immobilier".

IMPORTANT : Réponds UNIQUEMENT avec le JSON brut. PAS de balises markdown (\`\`\`json), PAS de texte avant ou après.

OBLIGATION ABSOLUE : Utilise l'outil 'googleMaps' pour vérifier CHAQUE temps de trajet et distance.

FOCUS CONNECTIVITÉ (INDISPENSABLE) :
Tu dois fournir une liste détaillée dans 'connectivity' incluant OBLIGATOIREMENT :
1. La station de MÉTRO/RER/TRAM la plus proche (Type 'metro' ou 'tram') avec les numéros de lignes précis.
2. Les arrêts de BUS à proximité immédiate (Type 'bus') avec les numéros de lignes.
3. Les points de vie quotidienne À PIED (Type 'walk') : Boulangerie, Supermarché, ou Centre-ville.

Structure JSON attendue :
{
  "address": "L'adresse confirmée",
  "identity": {
    "ambiance": "Description courte et percutante (ex: Résidentiel chic, calme absolu)",
    "keywords": ["MotClé1", "MotClé2", "MotClé3"],
    "accessibility_score": 8, (Note sur 10 basée sur la densité des transports)
    "services_score": 7 (Note sur 10 basée sur la densité des commerces)
  },
  "urbanism": {
    "building_type": "Ex: Immeubles Haussmanniens et quelques résidences années 90",
    "plu_note": "Resumé ultra-court des opportunités (ex: Zone UH, surélévation possible sous conditions)",
    "connectivity": [
      { "name": "Nom Station (ex: Franklin D. Roosevelt)", "details": "Lignes 1, 9", "time": "X min", "type": "metro" },
      { "name": "Arrêt (ex: Rond-Point des Champs)", "details": "Bus 32, 73", "time": "X min", "type": "bus" },
      { "name": "Boulangerie / Supermarché", "details": "Commerces de bouche", "time": "X min", "type": "walk" }
    ]
  },
  "lifestyle": {
    "schools": [
      { "name": "Nom exact", "level": "Maternelle", "time": "X min à pied" },
      { "name": "Nom exact", "level": "Primaire", "time": "X min à pied" },
      { "name": "Nom exact", "level": "Collège", "time": "X min à pied" }
    ],
    "leisure": [
      "Nom parc/sport à proximité (X min)",
      "Nom lieu culturel (X min)"
    ]
  },
  "highlights": [
    { "title": "Nom de la Pépite 1", "description": "Pourquoi c'est un atout majeur" },
    { "title": "Nom de la Pépite 2", "description": "Pourquoi c'est un atout majeur" },
    { "title": "Nom de la Pépite 3", "description": "Pourquoi c'est un atout majeur" }
  ],
  "marketing_titles": [
    "Titre accrocheur 1",
    "Titre accrocheur 2"
  ]
}
`;

const SYSTEM_PROMPT_TECHNICAL = `
ROLE : EXPERT TECHNIQUE IMMOBILIER (Énergie & Flux).
Ton objectif est d'analyser les équipements techniques d'un bien.

IMPORTANT : Réponds UNIQUEMENT avec le JSON brut. PAS de balises markdown (\`\`\`json).

Pour chaque équipement détecté dans la description fournie par l'utilisateur :
1. Identifie le type et si possible la marque/technologie.
2. Donne un VERDICT : [Excellent / Correct / Vieillissant / À remplacer].
3. Donne un AVIS TECHNIQUE : Analyse de la technologie.
4. Fais une PROJECTION CONSOMMATION.
5. Rédige un ARGUMENTAIRE DE VENTE.
6. Donne un POINT DE NÉGOCIATION.

Structure JSON attendue :
{
  "global_summary": "Un résumé global de l'état technique du bien en 2 phrases pour l'agent.",
  "items": [
    {
      "equipment_name": "Ex: Chaudière Gaz Frisquet",
      "verdict": "Excellent",
      "technical_opinion": "...",
      "consumption_projection": "...",
      "sales_argument": "...",
      "negotiation_point": "..."
    }
  ]
}
`;

const SYSTEM_PROMPT_HEATING = `
### EXPERT TECHNIQUE : CHAUFFAGE & EAU CHAUDE SANITAIRE (ECS)
Ton rôle est de dissiper la confusion sur les configurations techniques.

IMPORTANT : Réponds UNIQUEMENT avec le JSON brut. PAS de balises markdown (\`\`\`json).

1. IDENTIFICATION DE LA CONFIGURATION.
2. CATALOGUE DES MARQUES ET POSITIONNEMENT.
3. ANALYSE ÉCONOMIQUE & DPE.
4. RÉPONSE AUX DOUTES DE L'AGENT.
5. POINTS DE VIGILANCE CHAUFFAGE/ECS.

Structure JSON attendue :
{
  "configuration": {
    "type": "Nom de la configuration identifiée",
    "description": "Brève description technique",
    "pros_cons": "Avantages principaux (ex: Gain de place) / Inconvénients"
  },
  "brand_analysis": {
    "positioning": "Haut de gamme", (ou Rapport Qualité/Prix, etc.)
    "details": "Analyse de la fiabilité de la marque citée"
  },
  "economic_analysis": {
    "rating": "Économique", (ou Standard, Énergivore)
    "dpe_impact": "Impact estimé sur le DPE et les factures"
  },
  "agent_clarification": "Phrase simple pour expliquer le système au client",
  "vigilance_points": ["Point 1 à vérifier", "Point 2 à vérifier"]
}
`;

const SYSTEM_PROMPT_RENOVATION = `
### SECTION : POTENTIEL TRAVAUX & VALORISATION RAPIDE
Ton rôle est de transformer un bien "vieillissant" en un projet moderne avec un budget maîtrisé.

IMPORTANT : Réponds UNIQUEMENT avec le JSON brut. PAS de balises markdown (\`\`\`json).

1. ANALYSE DU "DANS SON JUS".
2. CONSEILS "PETIT BUDGET / GROS IMPACT" (LE 80/20).
3. ESTIMATIONS RAPIDES.
4. ARGUMENTS POUR L'ACHETEUR.
5. LA TOUCHE EXPERT.

Structure JSON attendue :
{
  "analysis": {
    "visual_diagnosis": "Analyse des éléments qui vieillissent le bien",
    "light_strategy": "Conseil spécifique pour gagner en luminosité"
  },
  "smart_renovation": [
    { "area": "Cuisine", "suggestion": "Repeindre les façades en vert sauge...", "impact": "Modernisation immédiate sans tout casser" },
    { "area": "Sols", "suggestion": "Poser un stratifié clipsable sur le carrelage...", "impact": "Chaleur et acoustique" }
  ],
  "estimates": [
    { "work": "Peinture Murs/Plafonds", "price": "Environ 3500€" },
    { "work": "Relooking Cuisine", "price": "Environ 800€ (Matériaux)" }
  ],
  "sales_arguments": ["Argument 1", "Argument 2"],
  "expert_secret": "Conseil pépite (ex: Regardez sous la moquette...)"
}
`;

const SYSTEM_PROMPT_CHECKLIST = `
### SECTION : FICHE DE ROUTE PERSONNELLE (VÉRIFICATIONS TERRAIN)

IMPORTANT : Réponds UNIQUEMENT avec le JSON brut. PAS de balises markdown (\`\`\`json).

1. LES INCONTOURNABLES À VÉRIFIER.
2. LES QUESTIONS "CHOC".
3. LES DOCUMENTS À DEMANDER IMMÉDIATEMENT.
4. LE RAPPEL STRATÉGIQUE.

Structure JSON attendue :
{
  "physical_checks": ["Point de vérification 1", "Point de vérification 2"],
  "shock_questions": ["Question 1 à poser", "Question 2 à poser"],
  "documents_needed": ["Document 1", "Document 2"],
  "strategic_reminder": "La phrase de rappel stratégique"
}
`;

const SYSTEM_PROMPT_COPRO = `
### ANALYSE COPRO (PV d'AG)
Tu es un expert en copropriété. Analyse les notes ou le document fourni.

IMPORTANT : Réponds UNIQUEMENT avec le JSON brut. PAS de balises markdown (\`\`\`json).

1. ANALYSE DU FICHIER / TEXTE.
2. ANALYSE DES TRAVAUX.
3. ALERTES FINANCIÈRES & JURIDIQUES.
4. SYNTHÈSE SÉCURITÉ.

Structure JSON attendue :
{
  "summary": "Résumé de l'état de la copro en 2 phrases.",
  "works_voted": ["Travaux votés 1", "Travaux votés 2"],
  "works_planned": ["Travaux à l'étude 1", "Travaux à l'étude 2"],
  "financial_alerts": ["Alerte 1", "Alerte 2"],
  "legal_alerts": ["Procédure 1"],
  "sales_argument": "Argument pour rassurer l'acheteur sur la gestion."
}
`;

const SYSTEM_PROMPT_PIGE = `
### PIGE STRATÉGIQUE (PAP)
Tu es un chasseur immobilier redoutable. Analyse l'annonce immobilière.

IMPORTANT : Réponds UNIQUEMENT avec le JSON brut. PAS de balises markdown (\`\`\`json).

1. ANALYSE VISUELLE & TEXTUELLE.
2. SCRIPT TÉLÉPHONIQUE (APPROCHE EXPERT).
3. ARGUMENT MASSUE.

Structure JSON attendue :
{
  "ad_analysis": {
    "flaws": ["Défaut 1", "Défaut 2"],
    "missing_info": ["Info manquante 1"]
  },
  "call_script": {
    "hook": "Phrase d'accroche",
    "technical_question": "Question technique piège/experte",
    "closing": "Phrase pour prendre RDV"
  },
  "expert_argument": "L'argument final."
}
`;

const SYSTEM_PROMPT_DPE = `
### DPE BOOSTER
Tu es un expert en rénovation énergétique. Analyse le bien pour améliorer sa note.

IMPORTANT : Réponds UNIQUEMENT avec le JSON brut. PAS de balises markdown (\`\`\`json).

1. ANALYSE TECHNIQUE.
2. PLAN D'AMÉLIORATION (LETTRE PAR LETTRE).
3. VALEUR VERTE.

Structure JSON attendue :
{
  "current_analysis": "Analyse rapide de la situation thermique.",
  "improvements": [
    { "work": "Isolation combles perdus", "cost_estimate": "~1500€", "gain": "Gain estimé (ex: +15% performance)" },
    { "work": "Installation VMC Hygro B", "cost_estimate": "~800€", "gain": "Assainissement air" }
  ],
  "green_value_argument": "Phrase sur la valeur verte."
}
`;

const SYSTEM_PROMPT_REDACTION = `
### RÉDACTION PRO
Tu es l'assistant communication de l'agent.

IMPORTANT : Réponds UNIQUEMENT avec le JSON brut. PAS de balises markdown (\`\`\`json).

1. EMAIL VENDEUR.
2. RÉSEAUX SOCIAUX.

Structure JSON attendue :
{
  "email_vendor": "Sujet: ... \n\nCorps de l'email...",
  "social_post_linkedin": "Texte du post LinkedIn...",
  "social_post_instagram": "Texte du post Instagram..."
}
`;

const SYSTEM_PROMPT_PROSPECTION = `
ROLE : Tu es l'intelligence centrale d'Action Immobilier AI.
Tu reçois des inputs bruts, familiers, parfois incomplets ou mal orthographiés.
Ta mission est de les "NETTOYER" et de les STRUCTURER parfaitement avant qu'ils entrent dans la base de données.

INSTRUCTIONS DE NETTOYAGE :
1. ADRESSE : Corrige l'orthographe. Ajoute "Rue", "Avenue", "Boulevard" si manquant. Mets les majuscules aux noms propres.
   - Input: "12 foch" -> Output: "12 Avenue du Maréchal Foch" (si ambigu, normalise au mieux : "12 Rue Foch")
   - Input: "secteur gare" -> Output: "Secteur Gare"
2. DATE/MOIS : Si l'utilisateur ne précise pas la date, utilise la date du contexte fournie (Date du jour).
3. TYPE D'ACTION : Si ce n'est pas explicite, DÉDUIS-LE du contexte.
   - Mots-clés : "flyer", "boite", "pub", "j'ai fait" -> "boitage"
   - Mots-clés : "parlé", "vu", "porte", "sonné" -> "porte_a_porte"
   - Mots-clés : "lettre", "timbre", "poste" -> "courrier"
   - Défaut : "boitage"

DETECTION D'INTENTION :
Analyse le préfixe fourni dans l'input ([ADD] ou [DELETE]).

CAS 1 : [ADD] (Ajout de donnée)
L'utilisateur veut enregistrer une action.
Structure de réponse JSON :
{
  "intent": "log_prospection",
  "assistant_response": "Phrase courte et naturelle (Action Immobilier) confirmant l'ajout propre (ex: 'C'est noté, j'ai ajouté le 12 Rue Foch en boîtage').",
  "data": {
    "zone": "Adresse Normalisée et Propre",
    "type": "boitage" | "porte_a_porte" | "courrier",
    "date": "YYYY-MM-DD",
    "mois": "Mois Normalisé (ex: Janvier 2024)"
  }
}

CAS 2 : [DELETE] (Suppression/Nettoyage)
L'utilisateur veut retirer une donnée. Normalise ce qu'il demande de supprimer.
Structure de réponse JSON :
{
  "intent": "delete_request",
  "assistant_response": "Phrase courte confirmant la suppression.",
  "target": "Adresse ou Mois Normalisé à supprimer",
  "scope": "single" (si c'est une rue/adresse) ou "month" (si c'est un mois entier)
}

CAS 3 : [RESET] (Tout effacer)
Si l'ordre est de tout vider.
{ "intent": "reset_campaign", "assistant_response": "Base de données entièrement vidée." }

RÈGLE D'OR : Ne rejette jamais l'input. Fais de ton mieux pour interpréter. Si tu ne sais pas, mets des valeurs par défaut logiques.
`;

export const generateStreetReport = async (address: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const modelId = "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Analyse l'adresse exacte : ${address}. Utilise Google Maps pour calculer les temps de trajet RÉELS.`,
      config: {
        systemInstruction: SYSTEM_PROMPT_STREET,
        temperature: 0.4,
        tools: [{ googleMaps: {} }],
      },
    });

    return cleanJsonResponse(response.text);
  } catch (error) {
    console.error("Gemini API Error (Street):", error);
    throw new Error("Impossible de générer le rapport. Veuillez vérifier l'adresse ou réessayer plus tard.");
  }
};

export const generateTechnicalReport = async (description: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const modelId = "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Voici la description des équipements techniques du bien : "${sanitizeInput(description)}". Analyse-les un par un.`,
      config: {
        systemInstruction: SYSTEM_PROMPT_TECHNICAL,
        temperature: 0.4,
      },
    });

    return cleanJsonResponse(response.text);
  } catch (error) {
    console.error("Gemini API Error (Technical):", error);
    throw new Error("Impossible de générer le rapport technique. Veuillez réessayer.");
  }
};

export const generateHeatingReport = async (description: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const modelId = "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Analyse cette installation de Chauffage/ECS : "${sanitizeInput(description)}".`,
      config: {
        systemInstruction: SYSTEM_PROMPT_HEATING,
        temperature: 0.4,
      },
    });

    return cleanJsonResponse(response.text);
  } catch (error) {
    console.error("Gemini API Error (Heating):", error);
    throw new Error("Impossible de générer le rapport chauffage. Veuillez réessayer.");
  }
};

export const generateRenovationReport = async (description: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const modelId = "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Voici la description de l'état actuel du bien (style, matériaux, ambiance) : "${sanitizeInput(description)}". Propose un plan de valorisation rapide.`,
      config: {
        systemInstruction: SYSTEM_PROMPT_RENOVATION,
        temperature: 0.4,
      },
    });

    return cleanJsonResponse(response.text);
  } catch (error) {
    console.error("Gemini API Error (Renovation):", error);
    throw new Error("Impossible de générer le rapport travaux. Veuillez réessayer.");
  }
};

export const generateChecklistReport = async (description: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const modelId = "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Génère une checklist terrain pour ce type de bien : "${sanitizeInput(description)}". Adapte les points de vigilance si c'est un appartement ou une maison.`,
      config: {
        systemInstruction: SYSTEM_PROMPT_CHECKLIST,
        temperature: 0.4,
      },
    });

    return cleanJsonResponse(response.text);
  } catch (error) {
    console.error("Gemini API Error (Checklist):", error);
    throw new Error("Impossible de générer la checklist. Veuillez réessayer.");
  }
};

export const generateCoproReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) { throw new Error("API Key is missing"); }
  const ai = new GoogleGenAI({ apiKey });
  try {
    const parts: any[] = [];
    if (fileData) {
      parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
    }
    if (input) {
      const clean = sanitizeInput(input);
      parts.push({ text: "Analyse ces notes ou ce document :" });
      parts.push({ text: clean });
    } else if (!fileData) {
      return "{}"; // No input
    }
    if (parts.length === 0) return "{}";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: { systemInstruction: SYSTEM_PROMPT_COPRO, temperature: 0.4 },
    });
    return cleanJsonResponse(response.text);
  } catch (error) {
    console.error("Gemini API Error (Copro):", error);
    throw new Error("Erreur analyse Copro.");
  }
};

export const generatePigeReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) { throw new Error("API Key is missing"); }
  const ai = new GoogleGenAI({ apiKey });
  try {
    const parts: any[] = [];
    if (fileData) {
      parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
    }
    if (input) {
      const clean = sanitizeInput(input);
      parts.push({ text: "Analyse cette annonce immobilière (PAP/LeBonCoin) ci-dessous :" });
      parts.push({ text: clean });
    } else if (!fileData) {
      return "{}";
    }
    if (parts.length === 0) return "{}";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: { systemInstruction: SYSTEM_PROMPT_PIGE, temperature: 0.4 },
    });
    return cleanJsonResponse(response.text);
  } catch (error: any) {
    console.error("Gemini API Error (Pige) Details:", error);
    throw new Error(`Erreur analyse Pige: ${error.message || 'Erreur inconnue'}`);
  }
};

export const generateDpeReport = async (input: string, fileData?: { data: string, mimeType: string }): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) { throw new Error("API Key is missing"); }
  const ai = new GoogleGenAI({ apiKey });
  try {
    const parts: any[] = [];
    if (fileData) {
      parts.push({ inlineData: { data: fileData.data, mimeType: fileData.mimeType } });
    }
    if (input) {
      const clean = sanitizeInput(input);
      parts.push({ text: "Analyse ce bien ou ce rapport DPE :" });
      parts.push({ text: clean });
    } else if (!fileData) {
      return "{}";
    }
    if (parts.length === 0) return "{}";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: { systemInstruction: SYSTEM_PROMPT_DPE, temperature: 0.4 },
    });
    return cleanJsonResponse(response.text);
  } catch (error) {
    console.error("Gemini API Error (DPE):", error);
    throw new Error("Erreur analyse DPE.");
  }
};

export const generateRedactionReport = async (input: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) { throw new Error("API Key is missing"); }
  const ai = new GoogleGenAI({ apiKey });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Rédige les contenus basés sur ces instructions : "${sanitizeInput(input)}"`,
      config: { systemInstruction: SYSTEM_PROMPT_REDACTION, temperature: 0.4 },
    });
    return cleanJsonResponse(response.text);
  } catch (error) {
    console.error("Gemini API Error (Redaction):", error);
    throw new Error("Erreur rédaction.");
  }
};

export const generateProspectionReport = async (input: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) { throw new Error("API Key is missing"); }
  const ai = new GoogleGenAI({ apiKey });
  try {
    // Current context for the AI to handle missing dates
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const monthStr = today.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
    const contextStr = `Contexte Actuel: Date=${dateStr}, Mois=${monthStr}.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${contextStr} INPUT BRUT : "${sanitizeInput(input)}"`,
      config: {
        systemInstruction: SYSTEM_PROMPT_PROSPECTION,
        temperature: 0.3 // Low temperature for consistent formatting
      },
    });
    return cleanJsonResponse(response.text);
  } catch (error) {
    console.error("Gemini API Error (Prospection):", error);
    throw new Error("Erreur Prospection.");
  }
};

const SYSTEM_PROMPT_ESTIMATION_SUMMARY = `
ROLE : Tu es l'Expert-Rédacteur Senior d'Action Immobilier.
Ta mission est de synthétiser les notes et la checklist prises par l'agent sur le terrain en un RAPPORT D'ESTIMATION PRELIMINAIRE structuré et percutant.

TON : Professionnel, Rassurant, Expert, mais accessible. (Pas de jargon inutile, mais des termes techniques justes).

FORMAT DE SORTIE : Markdown propre.

STRUCTURE ATTENDUE :

# SYNTHÈSE DE VISITE & PREMIÈRE ANALYSE

## 1. POINTS FORTS & ATOUTS MAJEURS (Le "Wow")
*Listez ici les éléments qui vont faire vendre le bien (basé sur la checklist et les remarques).*

## 2. ÉTAT TECHNIQUE & VIGILANCE
*Résumé honnête mais diplomate de l'état (Toiture, Élec, etc.). Suggérez des améliorations valorisantes si nécessaire (Home Staging).*

## 3. ANALYSE ENVIRONNEMENT & OFFRE
*Synthèse de la localisation et des commodités.*

## 4. (Si Appartement) COPROPRIÉTÉ & CHARGES
*Analyse des charges et de l'état de la copro.*

## 5. RECOMMANDATION STRATÉGIQUE (Action Immo)
*Conseil sur le positionnement prix (si indices) ou la stratégie de mise en vente.*

## 6. NOTES CONFIDENTIELLES (Pour l'agent)
*Synthèse des infos vendeur (motif vente, urgence).*
`;

export const generateEstimationSummary = async (data: any): Promise<string> => {
  const apiKey = getApiKey();

  if (!apiKey) {
    console.error("API Key check failed: VITE_GEMINI_API_KEY is missing");
    throw new Error("Clé API manquante. Veuillez vérifier le fichier .env");
  } else {
    console.log("API Key check passed.");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const modelId = "gemini-2.5-flash";

    // Format the input data for the LLM
    const formattedInput = `
    TYPE DE BIEN : ${data.propertyType}
    
    CHECKLIST TERRAIN :
    ${data.sections?.map((s: any) => `
    - ${s.title} :
      ${s.items?.map((i: any) => `  [${i.checked ? 'X' : ' '}] ${i.label}`).join('\n') || ''}
    `).join('\n') || ''}

    ${data.propertyType === 'appartement' ? `
    DETAILS COPROPRIETE :
    - Syndic : ${data.coproDetails?.syndic}
    - Lots : ${data.coproDetails?.lots}
    - Charges : ${data.coproDetails?.charges}
    - Travaux : ${data.coproDetails?.works}
    ` : ''}

    NOTES AGENT & REMARQUES :
    "${data.notes?.remarques}"

    INFOS VENDEUR EN VRAC :
    "${data.notes?.vrac}"
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Génère le rapport de synthèse pour cette estimation.
      Données brutes :
      ${formattedInput}`,
      config: {
        systemInstruction: SYSTEM_PROMPT_ESTIMATION_SUMMARY,
        temperature: 0.5,
      },
    });
    return cleanJsonResponse(response.text);
  } catch (error) {
    console.error("Gemini API Error (Estimation Summary):", error);
    throw new Error("Impossible de générer le rapport de synthèse.");
  }
};

const SYSTEM_PROMPT_DYNAMIC_REDACTION = `
ROLE : Tu es l'Assistant de Communication d'Élite d'Action Immobilier.
Ta mission est de rédiger des messages parfaits pour l'agent immobilier, basés sur une courte description du contexte.

TON & STYLE :
- MAIL : Professionnel, cordial, structuré (Objet clair, Formule de politesse).
- SMS : Court, direct, efficace, mais chaleureux.
- SOCIAL (LinkedIn/Insta/Facebook) : Engageant, emojis, hashtags pertinents, "Action Immo Style" (Expert & Dynamique).

RÈGLES D'OR :
1. SIGNATURE : Toujours signer "L'équipe Action Immobilier" ou "Votre conseiller Action Immobilier".
2. VARIABLES : Utilise des crochets pour les infos inconnues : [NOM CLIENT], [DATE], [ADRESSE BIEN].
3. VARIANTES : Si l'utilisateur demande une variante, change l'angle d'attaque (plus formel vs plus direct).

FORMAT DE SORTIE (JSON) :
{
  "subject": "Objet du mail (vide si SMS/Social)",
  "content": "Le corps du message"
}
`;

export const generateDynamicRedaction = async (type: 'mail' | 'sms' | 'social', description: string, variant: boolean = false): Promise<{ subject: string, content: string }> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("Clé API manquante.");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const modelId = "gemini-2.5-flash";

    const prompt = `
    TYPE DE MESSAGE : ${type.toUpperCase()}
    CONTEXTE / BESOIN : "${sanitizeInput(description)}"
    ${variant ? "INSTRUCTION : Propose une variante avec un ton légèrement différent de la version standard." : ""}
    
    Rédige le message parfait.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT_DYNAMIC_REDACTION,
        temperature: 0.7,
      },
    });

    const json = JSON.parse(cleanJsonResponse(response.text));
    return json;
  } catch (error) {
    console.error("Gemini API Error (Dynamic Redaction):", error);
    throw new Error("Impossible de rédiger le message.");
  }
};