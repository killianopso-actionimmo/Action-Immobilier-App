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
        // Explicitly set apiVersion to 'v1' to avoid v1beta issues seen in logs
        const ai = new GoogleGenAI({
            apiKey,
            apiVersion: 'v1'
        });

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: Array.isArray(contents) ? contents : [{ role: "user", parts: [{ text: contents }] }],
            config: {
                systemInstruction: systemInstruction || "Tu es un assistant utile.",
                temperature: 0.4,
                tools: tools as any
            }
        });

        return res.status(200).json({ text: response.text });
    } catch (error: any) {
        console.error("DEBUG - Gemini Error Details:", error);

        const msg = error?.message || String(error);
        const lowMsg = msg.toLowerCase();

        let userMsg = "Erreur IA.";
        if (lowMsg.includes("403") || lowMsg.includes("api key")) userMsg = "Clé invalide ou bannie par Google.";
        else if (lowMsg.includes("429") || lowMsg.includes("quota")) userMsg = "Quotas atteints.";
        else if (lowMsg.includes("404")) {
            // Transparently show the 404 detail to help pinpoint the model string
            userMsg = `Configuration Modèle (404) : ${msg.substring(0, 80)}`;
        } else if (lowMsg.includes("region") || lowMsg.includes("location")) {
            userMsg = "Blocage Régional : Google bloque cette IP serveur (Vercel).";
        } else {
            userMsg = `Détail technique : ${msg.substring(0, 100)}`;
        }

        return res.status(500).json({ error: userMsg, details: msg });
    }
}
