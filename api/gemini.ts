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
        return res.status(500).json({ error: 'Clé API non détectée sur le serveur' });
    }

    const { contents, systemInstruction, tools } = req.body;

    try {
        const ai = new GoogleGenAI({ apiKey });

        // Using the Full Model Path as required by some Next Gen SDK versions
        // and ensuring the contents follow the strict [ { role: 'user', parts: [ { text: '...' } ] } ] format
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash", // The SDK often handles the prefix, but we check if it fails
            contents: Array.isArray(contents) ? contents : [{ role: "user", parts: [{ text: contents }] }],
            config: {
                systemInstruction: systemInstruction || "Tu es un assistant utile.",
                temperature: 0.4,
                tools: tools as any
            }
        });

        return res.status(200).json({ text: response.text });
    } catch (error: any) {
        console.error("DEBUG - Gemini Error Details:", JSON.stringify(error, null, 2));

        const msg = error?.message || String(error);
        const lowMsg = msg.toLowerCase();

        let userMsg = "Erreur IA.";
        if (lowMsg.includes("403") || lowMsg.includes("api key")) userMsg = "Authentification échouée (Clé).";
        else if (lowMsg.includes("429") || lowMsg.includes("quota")) userMsg = "Quotas atteints.";
        else if (lowMsg.includes("not found") || lowMsg.includes("model")) {
            // Fallback to simpler model string if first one fails?
            // Let's just expose the error for now so we can fix it for good
            userMsg = `Model Error: ${msg.substring(0, 100)}`;
        } else {
            userMsg = `IA Feedback: ${msg.substring(0, 100)}`;
        }

        return res.status(500).json({ error: userMsg, details: msg });
    }
}
