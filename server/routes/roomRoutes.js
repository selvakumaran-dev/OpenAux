const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const {
    createRoom,
    getRoom,
    updateSettings,
    closeRoom
} = require('../controllers/roomController');

// Validation middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

// Create room with validation
router.post('/',
    [
        body('hostName')
            .optional()
            .trim()
            .isLength({ max: 50 })
            .withMessage('Host name must be less than 50 characters')
            .escape(),
        body('location.lat')
            .isFloat({ min: -90, max: 90 })
            .withMessage('Latitude must be between -90 and 90'),
        body('location.lng')
            .isFloat({ min: -180, max: 180 })
            .withMessage('Longitude must be between -180 and 180'),
        body('settings.geofenceRadius')
            .optional()
            .isInt({ min: 10, max: 1000 })
            .withMessage('Geofence radius must be between 10 and 1000 meters'),
        body('settings.maxQueueSize')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Max queue size must be between 1 and 100'),
        validate
    ],
    createRoom
);

// Get room with validation
router.get('/:roomCode',
    [
        param('roomCode')
            .isLength({ min: 6, max: 6 })
            .isAlphanumeric()
            .withMessage('Room code must be 6 alphanumeric characters'),
        validate
    ],
    getRoom
);

// Update settings with validation
router.put('/:roomCode/settings',
    [
        param('roomCode')
            .isLength({ min: 6, max: 6 })
            .isAlphanumeric()
            .withMessage('Room code must be 6 alphanumeric characters'),
        body('bannedKeywords')
            .optional()
            .isArray()
            .withMessage('Banned keywords must be an array'),
        body('bannedKeywords.*')
            .optional()
            .trim()
            .isLength({ max: 50 })
            .withMessage('Each keyword must be less than 50 characters'),
        body('geofenceRadius')
            .optional()
            .isInt({ min: 10, max: 1000 })
            .withMessage('Geofence radius must be between 10 and 1000 meters'),
        body('maxQueueSize')
            .optional()
            .isInt({ min: 1, max: 100 })
            .withMessage('Max queue size must be between 1 and 100'),
        validate
    ],
    updateSettings
);

// Close room with validation
router.delete('/:roomCode',
    [
        param('roomCode')
            .isLength({ min: 6, max: 6 })
            .isAlphanumeric()
            .withMessage('Room code must be 6 alphanumeric characters'),
        validate
    ],
    closeRoom
);

module.exports = router;
