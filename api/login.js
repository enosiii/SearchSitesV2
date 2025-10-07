// api/login.js
import { URLSearchParams } from 'url';

// Vercel environment variables are available via process.env in Serverless Functions
const CORRECT_PASSWORD = process.env.VITE_PASSWORD;

// This is the Vercel Serverless function handler
export default async (req, res) => {
    // 1. Only allow POST requests (or you could open up cross-origin requests)
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method Not Allowed' });
        return;
    }

    let passwordAttempt = '';

    // 2. Extract the password from the request body (assuming a standard form submission format)
    try {
        const body = new URLSearchParams(req.body);
        passwordAttempt = body.get('password');
    } catch (e) {
        // If parsing fails (e.g., body is not URL encoded)
        res.status(400).json({ message: 'Invalid Request Format' });
        return;
    }

    // 3. SECURE Validation: Compare the attempt against the server-side secret
    if (passwordAttempt === CORRECT_PASSWORD) {
        // Success: Return a token (we'll use a simple success flag here)
        res.status(200).json({ 
            success: true, 
            message: 'Authentication successful. Redirecting.' 
        });
    } else {
        // Failure: Return an error status
        res.status(401).json({ 
            success: false, 
            message: 'Invalid Password.' 
        });
    }
};