const Review = require('../models/Review');
const FoodItem = require('../models/FoodItem');
const { analyzeSentiment } = require('../utils/sentimentAnalyzer');

// @desc    Submit a review (text + optional voice)
// @route   POST /api/reviews
exports.createReview = async (req, res) => {
    try {
        const { foodItem, rating, text, audioData, voiceTranscript } = req.body;

        // Check if food item exists
        const food = await FoodItem.findById(foodItem);
        if (!food) {
            return res.status(404).json({ success: false, message: 'Food item not found' });
        }

        // Check for existing review by this user
        const existingReview = await Review.findOne({
            user: req.user._id,
            foodItem
        });
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this item' });
        }

        // Analyze sentiment from text and/or voice transcript
        const textToAnalyze = voiceTranscript || text || '';
        const sentiment = analyzeSentiment(textToAnalyze);

        const review = await Review.create({
            user: req.user._id,
            foodItem,
            rating,
            text: text || '',
            audioData: audioData || '',
            voiceTranscript: voiceTranscript || '',
            sentimentScore: sentiment.score,
            sentimentLabel: sentiment.label
        });

        await review.populate('user', 'name');

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this item' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get reviews for a food item
// @route   GET /api/reviews/food/:foodId
exports.getFoodReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ foodItem: req.params.foodId })
            .populate('user', 'name')
            .sort({ createdAt: -1 });

        const sentimentSummary = {
            positive: reviews.filter(r => r.sentimentLabel === 'positive').length,
            neutral: reviews.filter(r => r.sentimentLabel === 'neutral').length,
            negative: reviews.filter(r => r.sentimentLabel === 'negative').length
        };

        res.json({
            success: true,
            data: reviews,
            sentimentSummary,
            totalReviews: reviews.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
