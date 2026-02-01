/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in meters
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

/**
 * Middleware to validate guest location against room's geofence
 */
const validateGeofence = async (req, res, next) => {
    try {
        const { roomCode } = req.params;
        const { lat, lng } = req.body.location || {};

        // Skip validation for host
        if (req.body.isHost) {
            return next();
        }

        if (!lat || !lng) {
            return res.status(400).json({
                error: 'Location required. Please enable location services.'
            });
        }

        const Room = require('../models/Room');
        const room = await Room.findOne({ roomCode, isActive: true });

        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        const distance = haversineDistance(
            room.location.lat,
            room.location.lng,
            lat,
            lng
        );

        const maxDistance = room.settings.geofenceRadius;

        if (distance > maxDistance) {
            return res.status(403).json({
                error: 'You are too far from the room',
                distance: Math.round(distance),
                maxDistance,
                message: `You must be within ${maxDistance}m of the host to vote.`
            });
        }

        // Attach distance to request for logging
        req.guestDistance = Math.round(distance);
        next();
    } catch (error) {
        console.error('Geofence validation error:', error);
        res.status(500).json({ error: 'Location validation failed' });
    }
};

module.exports = { validateGeofence, haversineDistance };
