const express = require('express');
const router = express.Router();
const {
    getFoodItems,
    getFoodItem,
    getMostSelling,
    getMostLoved,
    getTrending,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem
} = require('../controllers/foodController');
const { protect, adminOnly } = require('../middleware/auth');

// Public routes — order matters: specific routes before :id
router.get('/most-selling', getMostSelling);
router.get('/most-loved', getMostLoved);
router.get('/trending', getTrending);
router.get('/', getFoodItems);
router.get('/:id', getFoodItem);

// Admin routes
router.post('/', protect, adminOnly, createFoodItem);
router.put('/:id', protect, adminOnly, updateFoodItem);
router.delete('/:id', protect, adminOnly, deleteFoodItem);

module.exports = router;
