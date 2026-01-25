export const config = {
    maxDuration: 60,
};

export default async function handler(req: any, res: any) {
    const VERSION_TAG = "[V-PROXY-1.0.9-NUCLEAR]";

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 1. Get API Key
    const apiKey = process.env.VITE_GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: `${VERSION_TAG} Clé API non détectée.` });
    }

    const { contents: rawContents, systemInstruction, tools } = req.body;

    try {
        // 2. Build the Raw JSON Payload (Google AI REST Standard)
        // We normalize the content to the strict structure expected by the REST endpoint
        const contents = Array.isArray(rawContents)
            ? rawContents
            : [{ role: "user", parts: [{ text: String(rawContents) }] }];

        const payload: any = {
            contents,
            generationConfig: {
                temperature: 0.1,
                response_mime_type: "application/json"
            }
        };

        // Correct field name for system instruction in REST API is 'system_instruction'
        if (systemInstruction) {
            payload.system_instruction = {
                parts: [{ text: String(systemInstruction) }]
            };
        }

        // Tools handling (REST expects 'tools' at top level)
        if (tools && Array.isArray(tools) && tools.length > 0) {
            payload.tools = tools;
        }

        // 3. Talk directly to Google's REST API (Bypassing SDK mapping bugs)
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        console.log(`${VERSION_TAG} Fetching raw REST API...`);
        const googleResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await googleResponse.json();

        if (!googleResponse.ok) {
            console.error(`${VERSION_TAG} Google REST Error:`, JSON.stringify(data));
            throw new Error(data.error?.message || "Google API rejection.");
        }

        // 4. Extract text response
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            throw new Error("Réponse vide de Google.");
        }

        return res.status(200).json({ text });

    } catch (error: any) {
        console.error(`${VERSION_TAG} Final Proxy Catch:`, error);
        const msg = error?.message || String(error);
        return res.status(500).json({
            error: `${VERSION_TAG} Erreur Directe: ${msg.substring(0, 100)}`,
            details: msg
        });
    }
}
