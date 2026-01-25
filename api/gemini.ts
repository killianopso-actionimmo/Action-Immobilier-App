import { GoogleGenAI } from "@google/genai";

export const config = {
    maxDuration: 60,
};

export default async function handler(req: any, res: any) {
    const VERSION_TAG = "[V-PROXY-1.0.6]";

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: `${VERSION_TAG} Clé API non détectée.` });
    }

    const { contents, systemInstruction, tools } = req.body;

    try {
        const ai = new GoogleGenAI({
            apiKey,
            apiVersion: 'v1'
        });

        const generationConfig: any = {
            temperature: 0.1,
            responseMimeType: "application/json",
        };

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: Array.isArray(contents) ? contents : [{ role: "user", parts: [{ text: contents }] }],
            config: {
                systemInstruction,
                ...generationConfig,
                tools: tools as any
            }
        });

        return res.status(200).json({ text: response.text });
    } catch (error: any) {
        const msg = error?.message || String(error);
        return res.status(500).json({ error: `${VERSION_TAG} Erreur: ${msg.substring(0, 100)}`, details: msg });
    }
}
