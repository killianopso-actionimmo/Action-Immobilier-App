export const config = {
    maxDuration: 60,
};

export default async function handler(req: any, res: any) {
    const VERSION_TAG = "[V-PROXY-1.1.4-MINIMAL]";

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "Missing API Key" });
    }

    const { contents: rawContents } = req.body;

    try {
        // 1. ABSOLUTE BARE MINIMUM PAYLOAD (ZERO-CONFIG)
        // No generationConfig, no systemInstruction, no tools.
        // This MUST work if the API key and Model name are correct.
        const payload = {
            contents: [
                {
                    parts: [{
                        text: typeof rawContents === 'string' ? rawContents : "Hello"
                    }]
                }
            ]
        };

        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        console.log(`${VERSION_TAG} Sending BARE payload...`);

        const googleResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await googleResponse.json();

        if (!googleResponse.ok) {
            // RETURN EVERYTHING
            return res.status(500).json({
                error: `${VERSION_TAG} GOOGLE_REJECTION: ${JSON.stringify(data)}`
            });
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        return res.status(200).json({ text: text || "JSON parse logic bypass" });

    } catch (error: any) {
        return res.status(500).json({ error: `${VERSION_TAG} PROXY_CATCH: ${error.message}` });
    }
}
