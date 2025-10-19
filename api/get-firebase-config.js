// api/get-firebase-config.js

export default function handler(request, response) {
    // This function runs on the server and safely reads your environment variables.
    // It only exposes the ones that are designated as "public" (for Firebase).

    if (request.method !== 'GET') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const firebaseConfig = {
            apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
            measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
        };

        // Check if all required keys are present on the server
        for (const key in firebaseConfig) {
            if (!firebaseConfig[key]) {
                 console.error(`CRITICAL: Missing Firebase environment variable: NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);
                 return response.status(500).json({ error: `Server configuration is incomplete.` });
            }
        }

        return response.status(200).json(firebaseConfig);

    } catch (error) {
        console.error('Error fetching Firebase config:', error);
        return response.status(500).json({ error: 'Could not retrieve server configuration.' });
    }
}

