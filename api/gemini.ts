export const config = {
    maxDuration: 60,
};

export default async function handler(req: any, res: any) {
    const VERSION_TAG = "[V-PROXY-1.1.2-STABLE]";

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 1. Get API Key
    const apiKey = process.env.VITE_GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: `${VERSION_TAG} Clé API absente sur Vercel.` });
    }

    const { contents: rawContents, systemInstruction, tools } = req.body;

    try {
        // 2. Build the Payload with 100% REGULATED CAMELCASE (REST Standard)
        // The previous error "Unknown name 'r...'" was caused by 'response_mime_type'.
        // We now use 'responseMimeType' and 'generationConfig'.

        const contents = Array.isArray(rawContents)
            ? rawContents
            : [{ role: "user", parts: [{ text: String(rawContents) }] }];

        const payload: any = {
            contents,
            generationConfig: {
                temperature: 0.1,
                responseMimeType: "application/json"
            }
        };

        if (systemInstruction) {
            payload.systemInstruction = {
                parts: [{ text: String(systemInstruction) }]
            };
        }

        if (tools && Array.isArray(tools) && tools.length > 0) {
            // Many REST tools implementation grounding via "google_search_retrieval"
            payload.tools = tools;
        }

        // 3. Official REST Endpoint Strategy (v1)
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        console.log(`${VERSION_TAG} Fetching REST API with camelCase schema...`);

        const googleResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await googleResponse.json();

        if (!googleResponse.ok) {
            // Return JSON with the FULL error message to stop guessing
            const rawError = JSON.stringify(data);
            console.error(`${VERSION_TAG} Google rejected the call:`, rawError);
            return res.status(500).json({
                error: `${VERSION_TAG} Erreur API: ${rawError}`,
                details: rawError
            });
        }

        // 4. Extract generated text from successful nested response
        const candidates = data.candidates || [];
        const text = candidates[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("Format de réponse Google inattendu: " + JSON.stringify(data));
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
