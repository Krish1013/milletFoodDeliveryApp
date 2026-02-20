const FoodItem = require('../models/FoodItem');
const Order = require('../models/Order');

// @desc    Get all food items (with filters)
// @route   GET /api/foods
exports.getFoodItems = async (req, res) => {
    try {
        const { category, search, healthTag, sort, page = 1, limit = 20 } = req.query;
        const query = { isAvailable: true };

        if (category) query.category = category;
        if (healthTag) query.healthTags = healthTag;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        let sortObj = { createdAt: -1 };
        if (sort === 'price_asc') sortObj = { price: 1 };
        if (sort === 'price_desc') sortObj = { price: -1 };
        if (sort === 'rating') sortObj = { averageRating: -1 };
        if (sort === 'popular') sortObj = { totalOrders: -1 };

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await FoodItem.countDocuments(query);
        const foods = await FoodItem.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            success: true,
            data: foods,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single food item
// @route   GET /api/foods/:id
exports.getFoodItem = async (req, res) => {
    try {
        const food = await FoodItem.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ success: false, message: 'Food item not found' });
        }
        res.json({ success: true, data: food });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get most selling items
// @route   GET /api/foods/most-selling
exports.getMostSelling = async (req, res) => {
    try {
        const foods = await FoodItem.find({ isAvailable: true })
            .sort({ totalOrders: -1 })
            .limit(8);
        res.json({ success: true, data: foods });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get most loved items (rating + sentiment)
// @route   GET /api/foods/most-loved
exports.getMostLoved = async (req, res) => {
    try {
        const foods = await FoodItem.find({
            isAvailable: true,
            reviewCount: { $gte: 1 }
        })
            .sort({ averageRating: -1, sentimentScore: -1 })
            .limit(8);
        res.json({ success: true, data: foods });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get trending items (most ordered in last 7 days)
// @route   GET /api/foods/trending
exports.getTrending = async (req, res) => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const trending = await Order.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.foodItem',
                    orderCount: { $sum: '$items.quantity' }
                }
            },
            { $sort: { orderCount: -1 } },
            { $limit: 8 },
            {
                $lookup: {
                    from: 'fooditems',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'foodItem'
                }
            },
            { $unwind: '$foodItem' },
            {
                $project: {
                    _id: '$foodItem._id',
                    name: '$foodItem.name',
                    category: '$foodItem.category',
                    price: '$foodItem.price',
                    image: '$foodItem.image',
                    description: '$foodItem.description',
                    nutrition: '$foodItem.nutrition',
                    healthTags: '$foodItem.healthTags',
                    averageRating: '$foodItem.averageRating',
                    totalOrders: '$foodItem.totalOrders',
                    trendingOrders: '$orderCount'
                }
            }
        ]);

        // If no recent orders, fall back to most popular
        if (trending.length === 0) {
            const fallback = await FoodItem.find({ isAvailable: true })
                .sort({ totalOrders: -1 })
                .limit(8);
            return res.json({ success: true, data: fallback });
        }

        res.json({ success: true, data: trending });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create food item (Admin)
// @route   POST /api/foods
exports.createFoodItem = async (req, res) => {
    try {
        const food = await FoodItem.create(req.body);
        res.status(201).json({ success: true, data: food });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update food item (Admin)
// @route   PUT /api/foods/:id
exports.updateFoodItem = async (req, res) => {
    try {
        const food = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!food) {
            return res.status(404).json({ success: false, message: 'Food item not found' });
        }
        res.json({ success: true, data: food });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete food item (Admin)
// @route   DELETE /api/foods/:id
exports.deleteFoodItem = async (req, res) => {
    try {
        const food = await FoodItem.findByIdAndDelete(req.params.id);
        if (!food) {
            return res.status(404).json({ success: false, message: 'Food item not found' });
        }
        res.json({ success: true, message: 'Food item deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
