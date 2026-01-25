export const config = {
    maxDuration: 60,
};

export default async function handler(req: any, res: any) {
    const VERSION_TAG = "[V-PROXY-1.1.3-DIAG]";

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY ||
        process.env.GOOGLE_API_KEY ||
        process.env.GEMINI_API_KEY ||
        process.env.API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: `${VERSION_TAG} API Key is missing in Vercel settings.` });
    }

    const { contents: rawContents, systemInstruction, tools } = req.body;

    try {
        // 1. Build a "Minimum Viable" Payload
        // To be 100% safe, we move systemInstruction INSIDE the user message
        // and use the most basic camelCase configuration.

        const prompt = systemInstruction
            ? `INSTRUCTION SYSTEME:\n${systemInstruction}\n\nREQUETE UTILISATEUR:\n${typeof rawContents === 'string' ? rawContents : JSON.stringify(rawContents)}`
            : (typeof rawContents === 'string' ? rawContents : JSON.stringify(rawContents));

        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }]
                }
            ],
            generationConfig: {
                temperature: 0.2,
                responseMimeType: "application/json"
            }
        };

        // 2. Try v1 first (the production URL)
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        console.log(`${VERSION_TAG} Testing MINIMAL payload on v1...`);

        const googleResponse = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await googleResponse.json();

        if (!googleResponse.ok) {
            // NO TRUNCATION here, return the full raw error
            console.error(`${VERSION_TAG} Raw Google Rejection:`, JSON.stringify(data));
            return res.status(500).json({
                error: `${VERSION_TAG} GOOGLE_ERROR: ${JSON.stringify(data)}`,
                details: data
            });
        }

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            return res.status(500).json({ error: "Empty response", raw: data });
        }

        return res.status(200).json({ text });

    } catch (error: any) {
        const msg = error?.message || String(error);
        return res.status(500).json({
            error: `${VERSION_TAG} CATCH_ERROR: ${msg}`,
            details: msg
        });
    }
}
