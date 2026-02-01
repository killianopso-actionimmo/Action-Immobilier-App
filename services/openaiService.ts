// ============================================
// OPENAI SERVICE - GPT-4o-mini
// ============================================
// Service fiable et économique pour la génération de rapports IA

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!API_KEY) {
    console.error('⚠️ VITE_OPENAI_API_KEY not found in environment variables');
}

// Rate limiting simple (stockage local)
const RATE_LIMIT_KEY = 'openai_daily_usage';
const MAX_REQUESTS_PER_DAY = 50;

function checkRateLimit(): boolean {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(RATE_LIMIT_KEY);

    if (!stored) {
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ date: today, count: 0 }));
        return true;
    }

    const data = JSON.parse(stored);

    // Reset si nouvelle journée
    if (data.date !== today) {
        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify({ date: today, count: 0 }));
        return true;
    }

    // Vérifier la limite
    if (data.count >= MAX_REQUESTS_PER_DAY) {
        return false;
    }

    return true;
}

function incrementRateLimit(): void {
    const today = new Date().toISOString().split('T')[0];
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    const data = stored ? JSON.parse(stored) : { date: today, count: 0 };

    data.count += 1;
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
}

// Fonction pour appeler OpenAI
async function callOpenAI(prompt: string): Promise<string> {
    if (!API_KEY) {
        return "# Erreur\n\nLa clé API OpenAI n'est pas configurée.";
    }

    // Vérifier le rate limit
    if (!checkRateLimit()) {
        return "# Limite atteinte\n\nVous avez atteint la limite de 50 rapports par jour. Réessayez demain pour protéger vos coûts.";
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'Tu es un expert immobilier français ultra-local. Génère toujours des rapports en Markdown structuré, professionnel et détaillé. Utilise des titres en gras (##), des listes à puces, et des emojis pertinents pour chaque section. Sois précis, concret et actionnable.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('OpenAI API Error:', error);
            return `# Erreur API\n\n${error.error?.message || 'Erreur inconnue'}`;
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;

        if (!text) {
            return "# Erreur\n\nAucune réponse reçue de l'IA.";
        }

        // Incrémenter le compteur seulement si succès
        incrementRateLimit();

        return text;
    } catch (error: any) {
        console.error('Fetch Error:', error);
        return `# Erreur\n\n${error.message}`;
    }
}

// ============================================
// FONCTIONS PUBLIQUES
// ============================================

export const getApiStatus = (): string => "OPENAI_GPT4O_MINI";

export const generateStreetReport = async (address: string): Promise<string> => {
    const prompt = `Tu es un expert en immobilier ultra-local. Génère un rapport d'expertise de quartier en Markdown pour : ${address}

**IMPORTANT** : Réponds IMPÉRATIVEMENT en Markdown avec :
- Titres en gras (## pour sections principales)
- Listes à puces pour tous les points
- Emojis pertinents au début de chaque section
- Ton professionnel mais engageant

**STRUCTURE OBLIGATOIRE** :

## 🔷 Identité du Quartier
- Ambiance générale (familiale, dynamique, bourgeoise, etc.)
- Caractère architectural dominant
- Mots-clés du quartier

## 🏢 Typologie des Bâtiments
- Style architectural (haussmannien, années 1930, moderne, etc.)
- État général du bâti
- Particularités architecturales

## 💰 Prix au m² Moyens
- Fourchette de prix actuelle
- Évolution récente
- Comparaison avec quartiers voisins

## 🚇 Urbanisme & Connectivité

**⚠️ ATTENTION CRITIQUE - GÉOLOCALISATION PRÉCISE OBLIGATOIRE** :

Pour la station de métro, tu DOIS ABSOLUMENT :
1. Chercher la station LA PLUS PROCHE géographiquement de l'adresse donnée
2. Indiquer le NOM EXACT de la station (PAS une approximation, PAS "à proximité")
3. Indiquer le NUMÉRO DE LIGNE précis (1, 2, 3, etc.)
4. Calculer la DISTANCE réelle en mètres ET en minutes à pied

**FORMAT OBLIGATOIRE** :
- **Station de métro la plus proche** : [Nom exact de la station], ligne [numéro] (à [distance]m, [temps] min à pied)

**EXEMPLE CORRECT** :
- **Station de métro la plus proche** : Porte d'Arras, ligne 2 (à 400m, 5 min à pied)

**EXEMPLES INTERDITS** :
- ❌ "Métro ligne 1 à proximité"
- ❌ "Proche du métro"
- ❌ "Station Lille Grand Palais"

**AUTRES INFORMATIONS** :
- Autres transports (bus, tramway, RER) avec numéros de lignes
- Accessibilité voiture/vélo (pistes cyclables, parkings)
- Projets d'urbanisme futurs si pertinents

## ✨ Points Forts pour la Vente
- Arguments commerciaux clés
- Atouts uniques du quartier
- Cible d'acheteurs idéale

## ⚠️ Points de Vigilance
- Éléments à surveiller
- Potentiels freins à la vente

Utilise des données concrètes et sois précis sur les prix et les projets.`;

    return await callOpenAI(prompt);
};

export const generateTechnicalReport = async (description: string): Promise<string> => {
    const prompt = `Analyse technique immobilière en Markdown : ${description}

Inclus : résumé global, analyse par équipement (verdict, avis, consommation, argument vente), points de vigilance.`;

    return await callOpenAI(prompt);
};

export const generateHeatingReport = async (description: string): Promise<string> => {
    const prompt = `Analyse système de chauffage en Markdown : ${description}

Inclus : configuration, analyse marque, analyse économique, impact DPE, vigilance.`;

    return await callOpenAI(prompt);
};

export const generateRenovationReport = async (description: string): Promise<string> => {
    const prompt = `Analyse travaux et valorisation en Markdown : ${description}

Inclus : diagnostic visuel, stratégie travaux légers, estimations budgétaires, arguments vente.`;

    return await callOpenAI(prompt);
};

export const generateChecklistReport = async (description: string): Promise<string> => {
    const prompt = `Fiche de route terrain en Markdown : ${description}

Inclus : vérifications physiques, questions au vendeur, documents à demander, rappel stratégique.`;

    return await callOpenAI(prompt);
};

export const generateCoproReport = async (input: string): Promise<string> => {
    const prompt = `Analyse copropriété en Markdown : ${input}

Inclus : résumé situation, travaux votés, alertes financières/juridiques, argument vente.`;

    return await callOpenAI(prompt);
};

export const generatePigeReport = async (input: string): Promise<string> => {
    const prompt = `Pige stratégique d'annonce en Markdown : ${input}

Inclus : analyse annonce (défauts, infos manquantes), script d'appel, argument expert.`;

    return await callOpenAI(prompt);
};

export const generateDpeReport = async (input: string): Promise<string> => {
    const prompt = `Analyse DPE en Markdown : ${input}

Inclus : situation actuelle, améliorations possibles, valorisation verte.`;

    return await callOpenAI(prompt);
};

export const generateRedactionReport = async (input: string): Promise<string> => {
    const prompt = `Contenu communication immobilière en Markdown : ${input}

Inclus : email vendeur, post LinkedIn, post Instagram avec hashtags.`;

    return await callOpenAI(prompt);
};

export const generateProspectionReport = async (input: string): Promise<string> => {
    const prompt = `Intelligence prospection (Date: ${new Date().toISOString()}) : ${input}

Réponds en Markdown avec confirmation et résumé.`;

    return await callOpenAI(prompt);
};

export const generateEstimationSummary = async (data: any): Promise<string> => {
    const summary = `Type: ${data.propertyType}
Sections: ${data.sections.map((s: any) => s.title).join(', ')}
Notes: ${data.notes.remarques}
${data.coproDetails ? `Copro: ${data.coproDetails.syndic}` : ''}`;

    const prompt = `Synthèse d'expertise immobilière en Markdown :

${summary}

Inclus : titre, type, résumé points cochés, analyse notes expert, points forts, vigilance, recommandations, conclusion.`;

    return await callOpenAI(prompt);
};

export const generateDynamicRedaction = async (type: string, desc: string, isVariant: boolean = false): Promise<{ subject: string, content: string }> => {
    const variantText = isVariant ? " (variante alternative)" : "";
    const prompt = `Rédaction immobilière${variantText}. Type: ${type}, Description: ${desc}

${type === 'mail' ? 'Génère un email professionnel avec un objet accrocheur et un corps de message structuré.' : ''}
${type === 'sms' ? 'Génère un SMS court et direct (max 160 caractères).' : ''}
${type === 'social' ? 'Génère un post pour les réseaux sociaux (LinkedIn/Instagram) engageant avec hashtags.' : ''}

Réponds UNIQUEMENT en JSON avec cette structure exacte :
{
  "subject": "${type === 'mail' ? 'Objet de l\'email' : ''}",
  "content": "Contenu du message"
}`;

    const rawResponse = await callOpenAI(prompt);

    // Parser la réponse JSON
    try {
        // Extraire le JSON de la réponse (au cas où il y aurait du texte autour)
        const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                subject: parsed.subject || '',
                content: parsed.content || rawResponse
            };
        }
    } catch (e) {
        console.warn('Failed to parse JSON, using raw response');
    }

    // Fallback si le parsing échoue
    return {
        subject: type === 'mail' ? 'Message généré' : '',
        content: rawResponse
    };
};
