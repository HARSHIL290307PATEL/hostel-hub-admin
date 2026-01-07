import express from 'express';
import cors from 'cors';
import { initRoutes } from './routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize WhatsApp Client
import { initClient } from './client.js';
initClient();

// Health check endpoint for uptime monitors
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// Parse JSON bodies (as sent by API clients)
initRoutes(app);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
