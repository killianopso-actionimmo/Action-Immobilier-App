export const config = {
    maxDuration: 60,
};

export default async function handler(req: any, res: any) {
    const VERSION_TAG = "[V-PROXY-1.1.1-SNAKE]";

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 1. Get API Key from Server Environment
    const apiKey = process.env.VITE_GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: `${VERSION_TAG} Clé API non détectée sur le serveur.` });
    }

    const { contents: rawContents, systemInstruction, tools } = req.body;

    try {
        // 2. Build the Payload with STRICT SNAKE_CASE (REST API Requirement)
        // When using raw fetch, Google's REST API requires underscores for all logical blocks.

        // Normalize contents
        const contents = Array.isArray(rawContents)
            ? rawContents
            : [{ role: "user", parts: [{ text: String(rawContents) }] }];

        const payload: any = {
            contents,
            generation_config: {
                temperature: 0.1,
                response_mime_type: "application/json"
            }
        };

        // system_instruction is the correct field in REST
        if (systemInstruction) {
            payload.system_instruction = {
                parts: [{ text: String(systemInstruction) }]
            };
        }

        // tools mapping if present
        if (tools && Array.isArray(tools) && tools.length > 0) {
            payload.tools = tools;
        }

        // 3. Official REST Endpoint Strategy (Model name: models/gemini-1.5-flash)
        // We use v1 which is the most stable production endpoint.
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        console.log(`${VERSION_TAG} Sending strict snake_case request...`);

        const googleResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await googleResponse.json();

        if (!googleResponse.ok) {
            // Detailed error reporting for the user
            const errorMsg = data.error?.message || JSON.stringify(data);
            console.error(`${VERSION_TAG} Google rejected the payload:`, errorMsg);

            return res.status(googleResponse.status || 500).json({
                error: `${VERSION_TAG} Erreur API: ${errorMsg}`,
                details: errorMsg
            });
        }

        // 4. Extract generated text from successful nested response
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            throw new Error("Réponse Google vide ou malformée.");
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
