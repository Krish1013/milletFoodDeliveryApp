const express = require('express');
const router = express.Router();
const { getDashboard, getHealthInsights } = require('../controllers/analyticsController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/dashboard', protect, adminOnly, getDashboard);
router.get('/health-insights', protect, adminOnly, getHealthInsights);

module.exports = router;
