const Room = require('../models/Room');
const { searchYouTubeWithFilter } = require('../utils/youtubeFilter');

// Simple in-memory cache for YouTube search results
const searchCache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

// Cache cleanup interval (every 10 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [key, value] of searchCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
            searchCache.delete(key);
        }
    }
}, 10 * 60 * 1000);

// @desc    Search YouTube with vibe filtering
// @route   GET /api/songs/search
// @access  Public
exports.searchSongs = async (req, res) => {
    try {
        const { query, roomCode } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        let bannedKeywords = [];

        // Get banned keywords from room if roomCode provided
        if (roomCode) {
            const room = await Room.findOne({ roomCode, isActive: true });
            if (room) {
                bannedKeywords = room.settings.bannedKeywords;
            }
        }

        // Create cache key
        const cacheKey = `${query.toLowerCase()}_${bannedKeywords.sort().join(',')}`;

        // Check cache first
        const cached = searchCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
            console.log('✅ Cache hit for:', query);
            return res.json({
                success: true,
                results: cached.results,
                filtered: bannedKeywords.length > 0,
                cached: true
            });
        }

        // Cache miss - fetch from YouTube
        console.log('🔍 Cache miss, fetching from YouTube:', query);
        const results = await searchYouTubeWithFilter(query, bannedKeywords);

        // Store in cache
        searchCache.set(cacheKey, {
            results,
            timestamp: Date.now()
        });

        res.json({
            success: true,
            results,
            filtered: bannedKeywords.length > 0,
            cached: false
        });
    } catch (error) {
        console.error('Search error:', error);

        // Better error handling for YouTube API
        if (error.message.includes('quota')) {
            return res.status(429).json({
                error: 'YouTube API quota exceeded. Please try again later.',
                retryAfter: 3600
            });
        }

        if (error.message.includes('API key')) {
            return res.status(401).json({
                error: 'YouTube API configuration error. Please contact support.'
            });
        }

        res.status(500).json({ error: error.message || 'Failed to search songs' });
    }
};

// @desc    Get current queue
// @route   GET /api/songs/queue/:roomCode
// @access  Public
exports.getQueue = async (req, res) => {
    try {
        const { roomCode } = req.params;

        const room = await Room.findOne({ roomCode, isActive: true });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Sort queue by votes
        const sortedQueue = room.queue.sort((a, b) => {
            if (b.votes !== a.votes) return b.votes - a.votes;
            return new Date(a.addedAt) - new Date(b.addedAt);
        });

        res.json({
            success: true,
            queue: sortedQueue
        });
    } catch (error) {
        console.error('Get queue error:', error);
        res.status(500).json({ error: 'Failed to fetch queue' });
    }
};

module.exports = exports;
