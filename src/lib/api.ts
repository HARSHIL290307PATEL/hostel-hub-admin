import axios from 'axios';

// Create a centralized axios instance
// This allows us to configure the base URL dynamically based on environment variables
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '', // Falls back to relative path proxy in dev if undefined
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
