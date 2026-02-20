const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');
const Review = require('../models/Review');
const User = require('../models/User');

// @desc    Get admin dashboard analytics
// @route   GET /api/analytics/dashboard
exports.getDashboard = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'customer' });
        const totalFoodItems = await FoodItem.countDocuments();
        const totalReviews = await Review.countDocuments();

        // Revenue
        const revenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // Most selling item
        const mostSelling = await FoodItem.findOne({ isAvailable: true })
            .sort({ totalOrders: -1 })
            .select('name category totalOrders image price');

        // Highest rated item
        const highestRated = await FoodItem.findOne({ reviewCount: { $gte: 1 } })
            .sort({ averageRating: -1 })
            .select('name category averageRating image price reviewCount');

        // Most loved (highest rating + sentiment, minimum reviews)
        const mostLoved = await FoodItem.findOne({ reviewCount: { $gte: 1 } })
            .sort({ averageRating: -1, sentimentScore: -1 })
            .select('name category averageRating sentimentScore image price');

        // Trending (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const trendingResult = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $unwind: '$items' },
            { $group: { _id: '$items.foodItem', count: { $sum: '$items.quantity' } } },
            { $sort: { count: -1 } },
            { $limit: 1 },
            { $lookup: { from: 'fooditems', localField: '_id', foreignField: '_id', as: 'food' } },
            { $unwind: '$food' }
        ]);
        const trendingItem = trendingResult.length > 0
            ? { name: trendingResult[0].food.name, category: trendingResult[0].food.category, ordersThisWeek: trendingResult[0].count }
            : null;

        // Orders by status
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Revenue by day (last 7 days)
        const revenueByDay = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo }, status: { $ne: 'cancelled' } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Sentiment distribution
        const sentimentDist = await Review.aggregate([
            { $group: { _id: '$sentimentLabel', count: { $sum: 1 } } }
        ]);

        // Orders by category
        const ordersByCategory = await Order.aggregate([
            { $unwind: '$items' },
            { $lookup: { from: 'fooditems', localField: 'items.foodItem', foreignField: '_id', as: 'food' } },
            { $unwind: '$food' },
            { $group: { _id: '$food.category', totalOrders: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
            { $sort: { totalOrders: -1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalOrders,
                totalUsers,
                totalFoodItems,
                totalReviews,
                totalRevenue,
                mostSelling,
                highestRated,
                mostLoved,
                trendingItem,
                ordersByStatus,
                revenueByDay,
                sentimentDist,
                ordersByCategory
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get health-based popularity insights
// @route   GET /api/analytics/health-insights
exports.getHealthInsights = async (req, res) => {
    try {
        const healthTags = [
            'Diabetic Friendly', 'High Calcium', 'Iron Rich', 'Good for Bone Health',
            'Low Glycemic Index', 'Weight Management', 'High Fiber', 'Gluten Free',
            'Heart Healthy', 'Immunity Booster', 'Gut Health', 'Protein Rich'
        ];

        const insights = [];

        for (const tag of healthTags) {
            const topItem = await FoodItem.findOne({ healthTags: tag, isAvailable: true })
                .sort({ totalOrders: -1 })
                .select('name category totalOrders averageRating price');

            if (topItem) {
                insights.push({
                    tag,
                    topItem: {
                        name: topItem.name,
                        category: topItem.category,
                        totalOrders: topItem.totalOrders,
                        averageRating: topItem.averageRating,
                        price: topItem.price
                    }
                });
            }
        }

        // Most reviewed healthy drink
        const mostReviewedDrink = await FoodItem.findOne({
            category: 'Drinks',
            isAvailable: true
        })
            .sort({ reviewCount: -1 })
            .select('name totalOrders averageRating reviewCount');

        res.json({
            success: true,
            data: {
                healthTagInsights: insights,
                mostReviewedDrink
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
