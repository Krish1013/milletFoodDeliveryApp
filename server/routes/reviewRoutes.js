const express = require('express');
const router = express.Router();
const { createReview, getFoodReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createReview);
router.get('/food/:foodId', getFoodReviews);

module.exports = router;
