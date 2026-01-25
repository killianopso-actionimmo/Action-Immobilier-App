import { GoogleGenAI } from "@google/genai";

export const config = {
    maxDuration: 60,
};

export default async function handler(req: any, res: any) {
    // 1. Security Check (Method)
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 2. Get API Key from Server Environment
    const apiKey = process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Configuration système manquante (VITE_GEMINI_API_KEY sur le serveur)' });
    }

    const { contents, systemInstruction, tools } = req.body;

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: Array.isArray(contents) ? contents : [{ role: "user", parts: [{ text: contents }] }],
            config: {
                systemInstruction,
                temperature: 0.4,
                tools: tools as any
            }
        });

        return res.status(200).json({ text: response.text });
    } catch (error: any) {
        console.error("Gemini Proxy Error:", error);

        const msg = error?.message?.toLowerCase() || "";
        let userMsg = "Erreur technique IA.";

        if (msg.includes("api key") || msg.includes("403")) userMsg = "Clé invalide.";
        if (msg.includes("quota") || msg.includes("429")) userMsg = "Quota atteint.";
        if (msg.includes("region") || msg.includes("location")) userMsg = "Région bloquée (même sur serveur).";

        return res.status(500).json({ error: userMsg, details: error.message });
    }
}
