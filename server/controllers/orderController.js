const Order = require('../models/Order');
const FoodItem = require('../models/FoodItem');

// @desc    Place new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
    try {
        const { items, deliveryAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in order' });
        }

        // Calculate total and validate items
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const foodItem = await FoodItem.findById(item.foodItem);
            if (!foodItem) {
                return res.status(404).json({ success: false, message: `Food item ${item.foodItem} not found` });
            }
            if (!foodItem.isAvailable) {
                return res.status(400).json({ success: false, message: `${foodItem.name} is currently unavailable` });
            }

            orderItems.push({
                foodItem: foodItem._id,
                name: foodItem.name,
                price: foodItem.price,
                quantity: item.quantity,
                image: foodItem.image
            });

            totalAmount += foodItem.price * item.quantity;

            // Increment totalOrders
            await FoodItem.findByIdAndUpdate(foodItem._id, {
                $inc: { totalOrders: item.quantity }
            });
        }

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            deliveryAddress,
            paymentMethod: paymentMethod || 'cod'
        });

        await order.populate('items.foodItem');

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user's orders
// @route   GET /api/orders/my
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('items.foodItem');
        res.json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = {};
        if (status) query.status = status;

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Order.countDocuments(query);
        const orders = await Order.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('user', 'name email phone')
            .populate('items.foodItem');

        res.json({
            success: true,
            data: orders,
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

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        order.status = status;
        if (status === 'delivered') {
            order.deliveredAt = new Date();
        }

        await order.save();
        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
