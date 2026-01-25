import { GoogleGenAI } from "@google/genai";

export const config = {
    maxDuration: 60,
};

export default async function handler(req: any, res: any) {
    const VERSION_TAG = "[V-PROXY-1.0.8]";

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

    const { contents: rawContents, systemInstruction, tools } = req.body;

    try {
        const ai = new GoogleGenAI({
            apiKey,
            apiVersion: 'v1'
        });

        // Normalize contents to strictly follow the SDK's expected structure
        const contents = Array.isArray(rawContents)
            ? rawContents
            : [{ role: "user", parts: [{ text: String(rawContents) }] }];

        // Prepare generation config with strict types
        const genConfig: any = {
            temperature: 0.1,
            responseMimeType: "application/json",
        };

        // If system instruction is provided, wrap it in the required Content object structure
        if (systemInstruction) {
            genConfig.systemInstruction = {
                parts: [{ text: String(systemInstruction) }]
            };
        }

        // Safety: only include tools if they are valid. Grounding 'google_search' is often preferred.
        if (tools && Array.isArray(tools) && tools.length > 0) {
            genConfig.tools = tools;
        }

        const response = await ai.models.generateContent({
            model: "gemini-1.5-flash",
            contents,
            config: genConfig
        });

        return res.status(200).json({ text: response.text });
    } catch (error: any) {
        console.error(`${VERSION_TAG} Execution Error:`, error);

        const msg = error?.message || String(error);
        const details = typeof error === 'object' ? JSON.stringify(error) : msg;

        return res.status(500).json({
            error: `${VERSION_TAG} Erreur: ${msg.substring(0, 100)}`,
            details
        });
    }
}
