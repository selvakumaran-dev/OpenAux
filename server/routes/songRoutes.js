const express = require('express');
const router = express.Router();
const { query, param, validationResult } = require('express-validator');
const { searchSongs, getQueue } = require('../controllers/songController');

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

// Search songs with validation
router.get('/search',
    [
        query('query')
            .trim()
            .notEmpty()
            .withMessage('Search query is required')
            .isLength({ min: 1, max: 100 })
            .withMessage('Search query must be between 1 and 100 characters'),
        query('roomCode')
            .isLength({ min: 6, max: 6 })
            .isAlphanumeric()
            .withMessage('Room code must be 6 alphanumeric characters'),
        validate
    ],
    searchSongs
);

// Get queue with validation
router.get('/queue/:roomCode',
    [
        param('roomCode')
            .isLength({ min: 6, max: 6 })
            .isAlphanumeric()
            .withMessage('Room code must be 6 alphanumeric characters'),
        validate
    ],
    getQueue
);

module.exports = router;
