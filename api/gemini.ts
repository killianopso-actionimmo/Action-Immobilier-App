import { GoogleGenAI } from "@google/genai";

export const config = {
    maxDuration: 60,
};

export default async function handler(req: any, res: any) {
    const VERSION_TAG = "[V-PROXY-1.0.5]";
    console.log(`${VERSION_TAG} Request received`);

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: `${VERSION_TAG} Clé API introuvable sur Vercel.` });
    }

    const { contents, systemInstruction, tools } = req.body;

    try {
        // Next Gen SDK Constructor (v1.x)
        const genAI = new GoogleGenAI({
            apiKey,
            apiVersion: 'v1'
        });

        // Using the official models object for v1.x
        const response = await genAI.models.generateContent({
            model: "gemini-1.5-flash",
            contents: Array.isArray(contents) ? contents : [{ role: "user", parts: [{ text: contents }] }],
            config: {
                systemInstruction,
                temperature: 0.1, // Even more stable
                responseMimeType: "application/json"
            }
        });

        return res.status(200).json({ text: response.text });
    } catch (error: any) {
        console.error(`${VERSION_TAG} Error:`, error);
        const msg = error?.message || String(error);
        return res.status(500).json({
            error: `${VERSION_TAG} Erreur IA: ${msg.substring(0, 100)}`,
            details: msg
        });
    }
}
