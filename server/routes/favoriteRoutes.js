const express = require('express');
const router = express.Router();
const { toggleFavorite, getFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.post('/:foodId', protect, toggleFavorite);
router.get('/', protect, getFavorites);

module.exports = router;
