const User = require('../models/User');

// @desc    Toggle favorite food item
// @route   POST /api/favorites/:foodId
exports.toggleFavorite = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const foodId = req.params.foodId;

        const index = user.favorites.indexOf(foodId);
        if (index > -1) {
            user.favorites.splice(index, 1);
        } else {
            user.favorites.push(foodId);
        }

        await user.save();

        res.json({
            success: true,
            isFavorite: index === -1,
            favorites: user.favorites
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('favorites');
        res.json({ success: true, data: user.favorites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
