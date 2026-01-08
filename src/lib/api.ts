import axios from 'axios';

// Create a centralized axios instance
// This allows us to configure the base URL dynamically based on environment variables
const api = axios.create({
    // Use the environment variable if set.
    // Otherwise:
    // - In Development: Use '' to allow Vite proxy to handle /api requests to localhost:3000
    // - In Production: Use the hardcoded Render URL as a fallback, BUT check if we are in a preview/local environment first via relative path
    baseURL: "http://localhost:4000",
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
