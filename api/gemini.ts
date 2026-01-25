export const config = {
    maxDuration: 60,
};

export default async function handler(req: any, res: any) {
    const VERSION_TAG = "[V-PROXY-1.1.0]";

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
        // 2. Build the Payload with STRICT Case Mapping (Standard REST)
        // We use camelCase for all fields as per modern Google AI REST specifications.
        const contents = Array.isArray(rawContents)
            ? rawContents
            : [{ role: "user", parts: [{ text: String(rawContents) }] }];

        const payload: any = {
            contents,
            generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json" // CORRECT CAMELCASE
            }
        };

        if (systemInstruction) {
            payload.systemInstruction = {
                parts: [{ text: String(systemInstruction) }]
            };
        }

        if (tools && Array.isArray(tools) && tools.length > 0) {
            payload.tools = tools;
        }

        // 3. Raw Fetch (Direct to Google)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        // Note: Using v1beta as it supports all features including JSON mode and systemInstruction more reliably than v1 in some regions.

        console.log(`${VERSION_TAG} Fetching raw REST API (v1beta)...`);
        const googleResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await googleResponse.json();

        if (!googleResponse.ok) {
            // We pass the FULL error message to the frontend for precise diagnosis
            const fullMessage = data.error?.message || JSON.stringify(data);
            console.error(`${VERSION_TAG} Google REST Rejection:`, fullMessage);

            // Return a 200 with error details to allow the frontend to display the text box without crashing
            return res.status(500).json({
                error: `${VERSION_TAG} Erreur API: ${fullMessage}`,
                details: fullMessage
            });
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            throw new Error("Réponse vide : " + JSON.stringify(data));
        }

        return res.status(200).json({ text });

    } catch (error: any) {
        console.error(`${VERSION_TAG} Fatal Catch:`, error);
        const msg = error?.message || String(error);
        return res.status(500).json({
            error: `${VERSION_TAG} Erreur Critique: ${msg}`,
            details: msg
        });
    }
}
