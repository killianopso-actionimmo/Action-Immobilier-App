import { Mandate } from '../types';

/**
 * Service for real Leboncoin listing search and analysis
 */

/**
 * Search for real Leboncoin listings using web search
 * Returns validated URLs only
 */
export const searchRealListings = async (): Promise<string[]> => {
    try {
        // This would use web search API in production
        // For now, return empty array to force manual URL entry
        console.log('Web search for Leboncoin listings - feature requires backend implementation');
        return [];
    } catch (error) {
        console.error('Error searching listings:', error);
        return [];
    }
};

/**
 * Analyze a Leboncoin URL and extract property details using AI
 */
export const analyzeLeboncoinURL = async (url: string): Promise<Mandate | null> => {
    try {
        // Validate URL format
        if (!url.includes('leboncoin.fr')) {
            throw new Error('URL invalide - doit être une annonce Leboncoin');
        }

        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Clé API Gemini manquante');
        }

        // Fetch the page content
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Impossible d\'accéder à l\'annonce');
        }

        const html = await response.text();

        // Use Gemini to analyze the page
        const analysisPrompt = `Analyse cette page Leboncoin et extrait les informations suivantes au format JSON strict:
{
  "title": "titre de l'annonce",
  "price": prix en nombre (sans symbole),
  "surface": surface en m² (nombre),
  "location": ville exacte,
  "dpe": "lettre DPE (A-G)" ou null,
  "contactName": "nom du contact" ou null,
  "contactPhone": "numéro" ou null,
  "publishedDate": "date relative (ex: Il y a 2 jours)" ou null,
  "imageUrl": "URL de la première image" ou null
}

HTML de la page:
${html.substring(0, 8000)}

Réponds UNIQUEMENT avec le JSON, sans texte additionnel.`;

        const geminiResponse = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: analysisPrompt }]
                    }]
                })
            }
        );

        if (!geminiResponse.ok) {
            throw new Error('Erreur lors de l\'analyse IA');
        }

        const data = await geminiResponse.json();
        const text = data.candidates[0].content.parts[0].text;

        // Extract JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('Format de réponse invalide');
        }

        const extracted = JSON.parse(jsonMatch[0]);

        // Calculate price per sqm
        const priceSqm = extracted.surface > 0
            ? Math.round(extracted.price / extracted.surface)
            : 0;

        // Create Mandate object
        const mandate: Mandate = {
            id: `real_${Date.now()}`,
            title: extracted.title || 'Titre non disponible',
            price: extracted.price || 0,
            surface: extracted.surface || 0,
            priceSqm,
            location: extracted.location || 'Non spécifié',
            url,
            image: extracted.imageUrl || '',
            date: new Date().toISOString(),
            dpe: extracted.dpe,
            contactName: extracted.contactName,
            contactPhone: extracted.contactPhone,
            publishedDate: extracted.publishedDate
        };

        return mandate;
    } catch (error) {
        console.error('Error analyzing Leboncoin URL:', error);
        throw error;
    }
};

/**
 * Validate that a URL is accessible
 */
export const validateURL = async (url: string): Promise<boolean> => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch {
        return false;
    }
};
