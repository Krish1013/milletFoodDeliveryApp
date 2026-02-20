const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    foodItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem',
        required: true,
        index: true
    },
    rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5
    },
    text: {
        type: String,
        maxlength: 1000,
        default: ''
    },
    audioData: {
        type: String,
        default: ''
    },
    voiceTranscript: {
        type: String,
        default: ''
    },
    sentimentScore: {
        type: Number,
        default: 0,
        min: -1,
        max: 1
    },
    sentimentLabel: {
        type: String,
        enum: ['positive', 'neutral', 'negative'],
        default: 'neutral'
    }
}, {
    timestamps: true
});

// Prevent duplicate reviews per user per food item
reviewSchema.index({ user: 1, foodItem: 1 }, { unique: true });

// Static method to calculate average rating for a food item
reviewSchema.statics.calcAverageRating = async function (foodItemId) {
    const result = await this.aggregate([
        { $match: { foodItem: foodItemId } },
        {
            $group: {
                _id: '$foodItem',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 },
                avgSentiment: { $avg: '$sentimentScore' }
            }
        }
    ]);

    const FoodItem = require('./FoodItem');
    if (result.length > 0) {
        await FoodItem.findByIdAndUpdate(foodItemId, {
            averageRating: Math.round(result[0].averageRating * 10) / 10,
            reviewCount: result[0].reviewCount,
            sentimentScore: Math.round(result[0].avgSentiment * 100) / 100
        });
    } else {
        await FoodItem.findByIdAndUpdate(foodItemId, {
            averageRating: 0,
            reviewCount: 0,
            sentimentScore: 0
        });
    }
};

// Recalculate after save
reviewSchema.post('save', function () {
    this.constructor.calcAverageRating(this.foodItem);
});

module.exports = mongoose.model('Review', reviewSchema);
