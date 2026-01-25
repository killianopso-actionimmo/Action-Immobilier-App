import { GoogleGenAI } from "@google/genai";

export const config = {
    maxDuration: 60,
};

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Clé API non détectée sur le serveur. Vérifiez les variables Vercel.' });
    }

    const { contents, systemInstruction, tools } = req.body;

    try {
        const ai = new GoogleGenAI({
            apiKey,
            apiVersion: 'v1'
        });

        // ENFORCING JSON MODE: Adding responseMimeType if tools are not present
        // Note: tools and JSON mode are sometimes incompatible on certain models, but gemini-1.5-flash supports it well.
        const generationConfig: any = {
            temperature: 0.2, // Lower temperature for more consistent JSON
            responseMimeType: "application/json",
        };

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: Array.isArray(contents) ? contents : [{ role: "user", parts: [{ text: contents }] }],
            config: {
                systemInstruction: `${systemInstruction}\nIMPORTANT: Réponds UNIQUEMENT avec un objet JSON valide. Pas de texte avant ou après. Pas de balises markdown \`\`\`json.`,
                ...generationConfig,
                tools: tools as any
            }
        });

        // Log for debug (Vercel Logs)
        console.log("Gemini Response Received");

        return res.status(200).json({ text: response.text });
    } catch (error: any) {
        console.error("Gemini Error:", error);
        const msg = error?.message || String(error);
        return res.status(500).json({ error: `Erreur IA: ${msg.substring(0, 100)}`, details: msg });
    }
}
