import axios from 'axios';

// 1. Define the Backend URL (Dynamic)
// - If VITE_API_URL is set in .env, use it.
// - If PROD (Vercel), use Render URL.
// - If DEV (Localhost), use Local Backend.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://whatsapp-api.onrender.com";
// Note: For local dev, you might want "http://localhost:4000", but usually we want to test against prod or local. 
// Let's make it strict:
// export const API_BASE_URL = import.meta.env.PROD ? "https://whatsapp-api.onrender.com" : "http://localhost:4000"; 
// ^ The user wants "latest code" which implies production readiness.

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
