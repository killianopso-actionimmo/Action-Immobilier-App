import { GoogleGenAI } from "@google/genai";

export const config = {
    maxDuration: 60,
};

export default async function handler(req: any, res: any) {
    console.log("--- New Gemini Proxy Request ---");

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 1. Get API Key - Checking all common naming conventions for Vercel secrets
    const apiKey = process.env.VITE_GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.API_KEY;

    if (!apiKey) {
        console.error("Critical: No API Key found in server environment.");
        return res.status(500).json({ error: 'Clé API non détectée sur le serveur (VITE_GEMINI_API_KEY)' });
    }

    const { contents, systemInstruction, tools } = req.body;
    console.log("System Instruction Length:", systemInstruction?.length || 0);

    try {
        const ai = new GoogleGenAI({ apiKey });

        // Explicitly using the models.generateContent method for Next Gen SDK compatibility
        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents: Array.isArray(contents) ? contents : [{ role: "user", parts: [{ text: contents }] }],
            config: {
                systemInstruction,
                temperature: 0.4,
                tools: tools as any
            }
        });

        console.log("Gemini API Status: OK");
        return res.status(200).json({ text: response.text });
    } catch (error: any) {
        console.error("Gemini SDK Execution Failed:", error);

        // Transparent error categorization for debugging
        const errorString = String(error).toLowerCase();
        const msg = error?.message?.toLowerCase() || "";

        let userMsg = "Erreur technique IA.";

        if (msg.includes("403") || msg.includes("api key") || msg.includes("invalid")) {
            userMsg = "Erreur de clé (403/Invalide).";
        } else if (msg.includes("429") || msg.includes("quota")) {
            userMsg = "Quota atteint (429).";
        } else if (msg.includes("not found") || msg.includes("model")) {
            userMsg = "Modèle introuvable ou mal configuré.";
        } else if (msg.includes("region") || msg.includes("location") || msg.includes("not supported")) {
            userMsg = "Région bloquée (USA proxy failed?).";
        } else {
            // Fallback to include the first few chars of the error for visual debug
            userMsg = `Erreur IA: ${error.message?.substring(0, 50)}...`;
        }

        return res.status(500).json({
            error: userMsg,
            details: error.message
        });
    }
}
