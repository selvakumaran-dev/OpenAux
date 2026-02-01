const Room = require('../models/Room');
const { searchYouTubeWithFilter } = require('../utils/youtubeFilter');

// Generate unique 6-character room code
const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Public
exports.createRoom = async (req, res) => {
    try {
        const { hostName, location, settings } = req.body;

        if (!location || !location.lat || !location.lng) {
            return res.status(400).json({ error: 'Host location is required' });
        }

        // Generate unique room code
        let roomCode;
        let isUnique = false;

        while (!isUnique) {
            roomCode = generateRoomCode();
            const existing = await Room.findOne({ roomCode });
            if (!existing) isUnique = true;
        }

        const room = await Room.create({
            roomCode,
            hostId: req.body.hostId || 'temp-host-id', // Will be updated when host connects via socket
            hostName: hostName || 'Anonymous Host',
            location: {
                lat: location.lat,
                lng: location.lng
            },
            settings: {
                bannedKeywords: settings?.bannedKeywords || [],
                geofenceRadius: settings?.geofenceRadius || 100,
                maxQueueSize: settings?.maxQueueSize || 50
            }
        });

        res.status(201).json({
            success: true,
            room: {
                roomCode: room.roomCode,
                hostName: room.hostName,
                location: room.location,
                settings: room.settings,
                createdAt: room.createdAt
            }
        });
    } catch (error) {
        console.error('Create room error:', error);
        res.status(500).json({ error: 'Failed to create room' });
    }
};

// @desc    Get room details
// @route   GET /api/rooms/:roomCode
// @access  Public
exports.getRoom = async (req, res) => {
    try {
        const { roomCode } = req.params;

        const room = await Room.findOne({ roomCode, isActive: true });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        res.json({
            success: true,
            room: {
                roomCode: room.roomCode,
                hostName: room.hostName,
                settings: room.settings,
                queueLength: room.queue.length,
                isActive: room.isActive
            }
        });
    } catch (error) {
        console.error('Get room error:', error);
        res.status(500).json({ error: 'Failed to fetch room' });
    }
};

// @desc    Update room settings
// @route   PUT /api/rooms/:roomCode/settings
// @access  Host only
exports.updateSettings = async (req, res) => {
    try {
        const { roomCode } = req.params;
        const { bannedKeywords, geofenceRadius, maxQueueSize } = req.body;

        const room = await Room.findOne({ roomCode, isActive: true });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Update settings
        if (bannedKeywords !== undefined) {
            room.settings.bannedKeywords = bannedKeywords;
        }
        if (geofenceRadius !== undefined) {
            room.settings.geofenceRadius = geofenceRadius;
        }
        if (maxQueueSize !== undefined) {
            room.settings.maxQueueSize = maxQueueSize;
        }

        await room.save();

        res.json({
            success: true,
            settings: room.settings
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};

// @desc    Close/deactivate room
// @route   DELETE /api/rooms/:roomCode
// @access  Host only
exports.closeRoom = async (req, res) => {
    try {
        const { roomCode } = req.params;

        const room = await Room.findOne({ roomCode });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        room.isActive = false;
        await room.save();

        res.json({
            success: true,
            message: 'Room closed successfully'
        });
    } catch (error) {
        console.error('Close room error:', error);
        res.status(500).json({ error: 'Failed to close room' });
    }
};

module.exports = exports;
