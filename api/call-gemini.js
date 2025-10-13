export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const { model, prompt, isJson } = request.body;
    
    // The API key is securely accessed from environment variables on the server
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
        return response.status(500).json({ error: 'API Key is not configured on the server.' });
    }

    const apiUrl = `https://generativelenlanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    
    const payload = { contents: [prompt] };
    if (isJson) {
        payload.generationConfig = { responseMimeType: "application/json" };
    }

    try {
        const apiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!apiResponse.ok) {
            const errorBody = await apiResponse.json();
            console.error('Google AI API Error:', errorBody);
            return response.status(apiResponse.status).json({ error: `Google AI API Error: ${errorBody.error?.message}` });
        }

        const result = await apiResponse.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
             return response.status(500).json({ error: 'Unexpected API response structure from Google AI.' });
        }

        return response.status(200).json({ text: text });

    } catch (error) {
        console.error('Internal Server Error:', error);
        return response.status(500).json({ error: 'An internal server error occurred.' });
    }
}
