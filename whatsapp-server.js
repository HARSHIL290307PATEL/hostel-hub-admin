import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for simplicity in this dev setup
        methods: ["GET", "POST"]
    }
});

let client;
let isConnected = false;
let qrCodeData = null;

function initializeWhatsAppClient() {
    if (client) return;

    console.log('Initializing WhatsApp Client...');
    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        }
    });

    client.on('qr', (qr) => {
        console.log('QR RECEIVED', qr);
        qrCodeData = qr;
        qrcode.generate(qr, { small: true }); // Print to console for server-side debugging
        io.emit('qr', qr);
    });

    client.on('ready', () => {
        console.log('WhatsApp connected ✅');
        isConnected = true;
        qrCodeData = null;
        io.emit('ready');
    });

    client.on('authenticated', () => {
        console.log('AUTHENTICATED');
        io.emit('authenticated');
    });

    client.on('auth_failure', msg => {
        console.error('AUTHENTICATION FAILURE', msg);
        io.emit('auth_failure', msg);
    });

    client.on('disconnected', (reason) => {
        console.log('Client was disconnected', reason);
        isConnected = false;
        qrCodeData = null;
        client = null; // Reset client to allow re-initialization
        io.emit('disconnected');
        // Optional: Auto-reconnect after a delay?
        // setTimeout(initializeWhatsAppClient, 5000);
    });

    client.initialize().catch(err => {
        console.error("Initialization error:", err);
    });
}

// Start WhatsApp client immediately or on demand
initializeWhatsAppClient();

io.on('connection', (socket) => {
    console.log('New client connected', socket.id);

    // Send current state
    if (isConnected) {
        socket.emit('ready');
    } else if (qrCodeData) {
        socket.emit('qr', qrCodeData);
    }

    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });

    // Allow client to request a restart/refresh if needed
    socket.on('regenerate_qr', () => {
        console.log('Client requested QR regeneration');
        if (client) {
            client.destroy().then(() => {
                client = null;
                isConnected = false;
                qrCodeData = null;
                initializeWhatsAppClient();
            }).catch(err => {
                console.error("Error regenerating:", err);
            });
        } else {
            initializeWhatsAppClient();
        }
    });

    socket.on('send_message', async ({ number, message }) => {
        if (!client || !isConnected) {
            socket.emit('message_response', { success: false, error: 'WhatsApp not connected' });
            return;
        }

        try {
            // Standardize number format: remove non-digits, ensure country code 91 if missing (assuming India for now based on user context)
            // or just rely on what's passed. WhatsApp ID requires @c.us
            // User provided '919876543210' format in example.

            const chatId = `${number}@c.us`;
            await client.sendMessage(chatId, message);
            console.log(`Message sent to ${number}`);
            socket.emit('message_response', { success: true, number });
        } catch (err) {
            console.error(`Failed to send message to ${number}:`, err);
            socket.emit('message_response', { success: false, error: err.message, number });
        }
    });
});

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`WhatsApp Server running on port ${PORT}`);
});
