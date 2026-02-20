const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a food item name'],
        trim: true,
        maxlength: 100
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: ['Ragi', 'Jowar', 'Foxtail', 'Snacks', 'Drinks'],
        index: true
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: 0
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        maxlength: 500
    },
    image: {
        type: String,
        default: '/images/default-food.jpg'
    },
    nutrition: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        fiber: { type: Number, default: 0 },
        iron: { type: Number, default: 0 },
        calcium: { type: Number, default: 0 },
        carbs: { type: Number, default: 0 },
        glycemicIndex: { type: Number, default: 0 }
    },
    healthBenefits: [{
        type: String
    }],
    healthTags: [{
        type: String,
        enum: [
            'Diabetic Friendly',
            'High Calcium',
            'Iron Rich',
            'Good for Bone Health',
            'Low Glycemic Index',
            'Weight Management',
            'High Fiber',
            'Gluten Free',
            'Heart Healthy',
            'Rich in Antioxidants',
            'Gut Health',
            'Immunity Booster',
            'Protein Rich',
            'Kid Friendly'
        ]
    }],
    whyOrder: {
        type: String,
        default: ''
    },
    totalOrders: {
        type: Number,
        default: 0,
        index: true
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    sentimentScore: {
        type: Number,
        default: 0,
        min: -1,
        max: 1
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for text search
foodItemSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('FoodItem', foodItemSchema);
