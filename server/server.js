require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const connectDB = require('./config/db');
const socketHandlers = require('./socket/socketHandlers');

// Import routes
const roomRoutes = require('./routes/roomRoutes');
const songRoutes = require('./routes/songRoutes');

// Initialize Express
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true
    },
    // Reconnection settings
    pingTimeout: 60000,
    pingInterval: 25000
});

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for development, configure for production
    crossOriginEmbedderPolicy: false
}));

// Compression Middleware
app.use(compression());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Stricter rate limiting for room creation
const createRoomLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 room creations per hour
    message: 'Too many rooms created from this IP, please try again later.',
});

// CORS Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root route - API information
app.get('/', (req, res) => {
    res.json({
        message: '🎵 OpenAux API Server',
        status: 'Running',
        version: '1.0.0',
        description: 'Democratic Jukebox - Real-time music collaboration platform',
        endpoints: {
            rooms: '/api/rooms',
            songs: '/api/songs',
            health: '/api/health'
        },
        documentation: 'https://github.com/yourusername/openaux'
    });
});

// Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/songs', songRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'OpenAux Server Running' });
});

// Socket.io handlers
socketHandlers(io);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Socket.io ready for connections`);
});
