// Fallback data used when the backend API is unavailable.
// These items mirror the FoodItem model shape so they render seamlessly in FoodCard.

export const fallbackMostSelling = [
    {
        _id: 'fb_sell_1',
        name: 'Traditional Buttermilk',
        category: 'Drinks',
        price: 35,
        description: 'Refreshing spiced buttermilk with roasted cumin, curry leaves, ginger, and fresh mint.',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop',
        nutrition: { calories: 45, protein: 2.5, fiber: 0.5, iron: 0.3, calcium: 120, carbs: 5, glycemicIndex: 30 },
        healthBenefits: ['Natural probiotic', 'Aids digestion', 'Cooling effect'],
        healthTags: ['Gut Health', 'Low Glycemic Index', 'Weight Management', 'Immunity Booster'],
        averageRating: 4.6,
        reviewCount: 60,
        totalOrders: 300,
        sentimentScore: 0.82
    },
    {
        _id: 'fb_sell_2',
        name: 'Ragi Almond Smoothie',
        category: 'Drinks',
        price: 89,
        description: 'Creamy smoothie blending Ragi malt with almond milk, banana, and a drizzle of honey.',
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&h=400&fit=crop',
        nutrition: { calories: 210, protein: 7, fiber: 4, iron: 3.5, calcium: 300, carbs: 30, glycemicIndex: 48 },
        healthBenefits: ['Post-workout recovery', 'Vitamin E for skin', 'Calcium bonanza'],
        healthTags: ['High Calcium', 'Protein Rich', 'Good for Bone Health', 'Gluten Free'],
        averageRating: 4.8,
        reviewCount: 55,
        totalOrders: 340,
        sentimentScore: 0.90
    },
    {
        _id: 'fb_sell_3',
        name: 'Ragi Malt',
        category: 'Ragi',
        price: 59,
        description: 'Thick, creamy Ragi malt made with sprouted finger millet, enriched with milk and cardamom.',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop',
        nutrition: { calories: 180, protein: 5.2, fiber: 5.1, iron: 4.2, calcium: 380, carbs: 30, glycemicIndex: 52 },
        healthBenefits: ['2x nutrient absorption', 'Muscle repair', 'Gut health'],
        healthTags: ['Diabetic Friendly', 'High Calcium', 'Iron Rich', 'Good for Bone Health'],
        averageRating: 4.8,
        reviewCount: 52,
        totalOrders: 312,
        sentimentScore: 0.85
    },
    {
        _id: 'fb_sell_4',
        name: 'Jowar Roti',
        category: 'Jowar',
        price: 35,
        description: 'Freshly made Jowar roti — soft, fluffy, and naturally gluten-free. Served with seasonal sabzi.',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop',
        nutrition: { calories: 110, protein: 3.8, fiber: 3.5, iron: 4.1, calcium: 25, carbs: 22, glycemicIndex: 62 },
        healthBenefits: ['Gluten-free alternative', 'High iron', 'Heart healthy'],
        healthTags: ['Gluten Free', 'Iron Rich', 'Heart Healthy', 'Weight Management'],
        averageRating: 4.5,
        reviewCount: 48,
        totalOrders: 290,
        sentimentScore: 0.80
    }
];

export const fallbackMostLoved = [
    {
        _id: 'fb_love_1',
        name: 'Ragi Almond Smoothie',
        category: 'Drinks',
        price: 89,
        description: 'Creamy smoothie blending Ragi malt with almond milk, banana, and honey. The ultimate fitness drink.',
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&h=400&fit=crop',
        nutrition: { calories: 210, protein: 7, fiber: 4, iron: 3.5, calcium: 300, carbs: 30, glycemicIndex: 48 },
        healthBenefits: ['Post-workout recovery', 'Vitamin E', '300mg calcium'],
        healthTags: ['High Calcium', 'Protein Rich', 'Good for Bone Health', 'Gluten Free'],
        averageRating: 4.8,
        reviewCount: 55,
        totalOrders: 340,
        sentimentScore: 0.90
    },
    {
        _id: 'fb_love_2',
        name: 'Ragi Malt',
        category: 'Ragi',
        price: 59,
        description: 'Thick, creamy Ragi malt made with sprouted finger millet, enriched with milk and cardamom.',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop',
        nutrition: { calories: 180, protein: 5.2, fiber: 5.1, iron: 4.2, calcium: 380, carbs: 30, glycemicIndex: 52 },
        healthBenefits: ['2x nutrient absorption', 'Muscle repair', 'Immunity boost'],
        healthTags: ['Diabetic Friendly', 'High Calcium', 'Iron Rich', 'Immunity Booster'],
        averageRating: 4.8,
        reviewCount: 52,
        totalOrders: 312,
        sentimentScore: 0.85
    },
    {
        _id: 'fb_love_3',
        name: 'Foxtail Millet Biryani',
        category: 'Foxtail',
        price: 129,
        description: 'Aromatic dum-style biryani made with foxtail millet and authentic Hyderabadi spices.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop',
        nutrition: { calories: 250, protein: 7, fiber: 4.8, iron: 3.2, calcium: 40, carbs: 38, glycemicIndex: 54 },
        healthBenefits: ['40% fewer calories', 'Digestion-friendly spices', 'Probiotics from raita'],
        healthTags: ['Diabetic Friendly', 'Low Glycemic Index', 'Gluten Free', 'High Fiber'],
        averageRating: 4.7,
        reviewCount: 42,
        totalOrders: 285,
        sentimentScore: 0.88
    },
    {
        _id: 'fb_love_4',
        name: 'Millet Energy Balls',
        category: 'Snacks',
        price: 119,
        description: 'No-bake energy balls with mixed millets, dates, nuts, seeds, and dark chocolate. Pack of 6.',
        image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&h=400&fit=crop',
        nutrition: { calories: 85, protein: 3.5, fiber: 2.8, iron: 2.2, calcium: 55, carbs: 12, glycemicIndex: 42 },
        healthBenefits: ['Natural energy from dates', 'Dark chocolate antioxidants', 'Portable nutrition'],
        healthTags: ['Low Glycemic Index', 'Protein Rich', 'Gluten Free', 'Rich in Antioxidants'],
        averageRating: 4.7,
        reviewCount: 28,
        totalOrders: 190,
        sentimentScore: 0.83
    }
];

export const fallbackTrending = [
    {
        _id: 'fb_trend_1',
        name: 'Foxtail Millet Biryani',
        category: 'Foxtail',
        price: 129,
        description: 'Aromatic dum-style biryani with foxtail millet and Hyderabadi spices. Served with raita and salan.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop',
        nutrition: { calories: 250, protein: 7, fiber: 4.8, iron: 3.2, calcium: 40, carbs: 38, glycemicIndex: 54 },
        healthBenefits: ['40% fewer calories than regular biryani', 'Probiotics from raita'],
        healthTags: ['Diabetic Friendly', 'Low Glycemic Index', 'Gluten Free', 'High Fiber'],
        averageRating: 4.7,
        reviewCount: 42,
        totalOrders: 285,
        sentimentScore: 0.88
    },
    {
        _id: 'fb_trend_2',
        name: 'Ragi Pancakes',
        category: 'Ragi',
        price: 89,
        description: 'Fluffy American-style pancakes made with Ragi flour, topped with fresh fruits, honey, and walnuts.',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
        nutrition: { calories: 210, protein: 5, fiber: 4, iron: 3.5, calcium: 300, carbs: 32, glycemicIndex: 55 },
        healthBenefits: ['Omega-3 from walnuts', 'Vitamin C from fruits', '300mg calcium'],
        healthTags: ['High Calcium', 'Iron Rich', 'Gluten Free', 'Kid Friendly'],
        averageRating: 4.6,
        reviewCount: 28,
        totalOrders: 178,
        sentimentScore: 0.80
    },
    {
        _id: 'fb_trend_3',
        name: 'Jowar Pasta',
        category: 'Jowar',
        price: 99,
        description: 'Italian-inspired Jowar pasta in creamy spinach-basil sauce with roasted cherry tomatoes.',
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop',
        nutrition: { calories: 230, protein: 6.5, fiber: 4, iron: 4, calcium: 45, carbs: 35, glycemicIndex: 54 },
        healthBenefits: ['Gluten-free pasta', 'Iron from spinach', 'Lycopene from tomatoes'],
        healthTags: ['Gluten Free', 'Iron Rich', 'Heart Healthy', 'Rich in Antioxidants'],
        averageRating: 4.7,
        reviewCount: 31,
        totalOrders: 192,
        sentimentScore: 0.84
    },
    {
        _id: 'fb_trend_4',
        name: 'Little Millet Samosa',
        category: 'Snacks',
        price: 49,
        description: 'Crispy samosas filled with spiced little millet and potato mixture. Served with tamarind and mint chutney.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop',
        nutrition: { calories: 135, protein: 3.8, fiber: 2.8, iron: 2, calcium: 25, carbs: 20, glycemicIndex: 50 },
        healthBenefits: ['More fiber than potato samosa', 'B-complex vitamins', 'Iron rich'],
        healthTags: ['Iron Rich', 'Gluten Free', 'High Fiber', 'Kid Friendly'],
        averageRating: 4.5,
        reviewCount: 30,
        totalOrders: 198,
        sentimentScore: 0.78
    }
];
