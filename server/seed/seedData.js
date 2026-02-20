require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const FoodItem = require('../models/FoodItem');
const Review = require('../models/Review');

// ============================================================================
// FOOD ITEMS DATA — 35 items across 5 categories
// ============================================================================

const foodItems = [
    // ===== RAGI CATEGORY (8 items) =====
    {
        name: 'Ragi Java',
        category: 'Ragi',
        price: 49,
        description: 'Traditional South Indian Ragi porridge made with organic finger millet flour, lightly sweetened with jaggery. A perfect breakfast drink rich in calcium and iron.',
        image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?w=600&h=400&fit=crop',
        nutrition: { calories: 120, protein: 3.5, fiber: 4.2, iron: 3.9, calcium: 344, carbs: 22, glycemicIndex: 54 },
        healthBenefits: [
            'Strengthens bones due to high calcium content',
            'Helps manage blood sugar levels with low glycemic index',
            'Rich source of natural iron, prevents anemia',
            'Aids in weight management by keeping you full longer',
            'Excellent for growing children and elderly'
        ],
        healthTags: ['Diabetic Friendly', 'High Calcium', 'Iron Rich', 'Good for Bone Health', 'Low Glycemic Index', 'Gluten Free'],
        whyOrder: 'Start your day with this calcium-rich superfood! Ragi Java provides 344mg of calcium per serving — more than milk.',
        totalOrders: 245,
        averageRating: 4.6,
        reviewCount: 38,
        sentimentScore: 0.78
    },
    {
        name: 'Ragi Malt',
        category: 'Ragi',
        price: 59,
        description: 'Thick, creamy Ragi malt made with sprouted finger millet, enriched with milk and cardamom. A wholesome energy drink for all ages.',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop',
        nutrition: { calories: 180, protein: 5.2, fiber: 5.1, iron: 4.2, calcium: 380, carbs: 30, glycemicIndex: 52 },
        healthBenefits: [
            'Sprouted ragi increases nutrient absorption by 2x',
            'Natural source of amino acids for muscle repair',
            'Promotes gut health with high fiber content',
            'Boosts immunity with antioxidants',
            'Excellent meal replacement for weight watchers'
        ],
        healthTags: ['Diabetic Friendly', 'High Calcium', 'Iron Rich', 'Good for Bone Health', 'Low Glycemic Index', 'High Fiber', 'Gluten Free', 'Immunity Booster'],
        whyOrder: 'This sprouted Ragi malt is a nutritional powerhouse! Sprouting doubles the bioavailability of iron and calcium.',
        totalOrders: 312,
        averageRating: 4.8,
        reviewCount: 52,
        sentimentScore: 0.85
    },
    {
        name: 'Ragi Dosa',
        category: 'Ragi',
        price: 69,
        description: 'Crispy, thin dosa made from fermented Ragi batter. Served with mint chutney and sambar. A healthy twist on the classic South Indian breakfast.',
        image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=400&fit=crop',
        nutrition: { calories: 150, protein: 4.0, fiber: 3.8, iron: 3.5, calcium: 320, carbs: 25, glycemicIndex: 58 },
        healthBenefits: [
            'Fermentation increases B-vitamin content',
            'Natural probiotics from fermented batter aid digestion',
            'Low calorie compared to regular dosa',
            'Keeps you satisfied for hours',
            'Safe for those with wheat allergies (gluten-free)'
        ],
        healthTags: ['Diabetic Friendly', 'High Calcium', 'Iron Rich', 'Low Glycemic Index', 'Gluten Free', 'Gut Health', 'Weight Management'],
        whyOrder: 'Love dosa but want a healthier option? Our Ragi Dosa is crispy, delicious, and packed with 320mg calcium.',
        totalOrders: 198,
        averageRating: 4.4,
        reviewCount: 29,
        sentimentScore: 0.72
    },
    {
        name: 'Ragi Mudde',
        category: 'Ragi',
        price: 79,
        description: 'Traditional Karnataka-style Ragi balls served with spicy sambar and tangy rasam. A complete, filling meal that is low in fat.',
        image: 'https://images.unsplash.com/photo-1606491956689-2ea866880049?w=600&h=400&fit=crop',
        nutrition: { calories: 200, protein: 4.5, fiber: 6.0, iron: 4.8, calcium: 350, carbs: 38, glycemicIndex: 50 },
        healthBenefits: [
            'One of the lowest glycemic index foods available',
            'Keeps hunger at bay for 4-5 hours',
            'Excellent for diabetics — slows glucose absorption',
            'Rich in dietary fiber for colon health',
            'Traditional preparation preserves maximum nutrients'
        ],
        healthTags: ['Diabetic Friendly', 'High Calcium', 'Iron Rich', 'Low Glycemic Index', 'High Fiber', 'Gluten Free', 'Weight Management'],
        whyOrder: 'A heritage recipe from Karnataka! Ragi Mudde has the lowest glycemic index among all our items (50).',
        totalOrders: 156,
        averageRating: 4.3,
        reviewCount: 22,
        sentimentScore: 0.68
    },
    {
        name: 'Ragi Laddu',
        category: 'Ragi',
        price: 39,
        description: 'Sweet Ragi laddus made with roasted finger millet, ghee, jaggery, and nuts. A healthy snack that satisfies sweet cravings guilt-free.',
        image: 'https://images.unsplash.com/photo-1666190100798-c247a0483a09?w=600&h=400&fit=crop',
        nutrition: { calories: 95, protein: 2.5, fiber: 2.0, iron: 2.1, calcium: 180, carbs: 15, glycemicIndex: 55 },
        healthBenefits: [
            'Natural sweetness from jaggery — no refined sugar',
            'Ghee aids in vitamin absorption',
            'Perfect energy bite before workouts',
            'Healthy alternative to processed sweets',
            'Contains essential amino acids from ragi'
        ],
        healthTags: ['High Calcium', 'Iron Rich', 'Gluten Free', 'Kid Friendly'],
        whyOrder: 'These Ragi Laddus are made with jaggery (not sugar!) and pure ghee. Only 95 calories per laddu!',
        totalOrders: 280,
        averageRating: 4.5,
        reviewCount: 35,
        sentimentScore: 0.75
    },
    {
        name: 'Ragi Puttu',
        category: 'Ragi',
        price: 65,
        description: 'Kerala-style steamed Ragi puttu layered with fresh coconut. Light on the stomach, perfect for dinner with kadala curry.',
        image: 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=400&fit=crop',
        nutrition: { calories: 160, protein: 3.8, fiber: 4.5, iron: 3.2, calcium: 290, carbs: 28, glycemicIndex: 56 },
        healthBenefits: [
            'Steamed preparation retains all nutrients',
            'Coconut adds healthy MCT fats',
            'Light dinner option that promotes better sleep',
            'No oil used in preparation',
            'Good for those with digestive issues'
        ],
        healthTags: ['Diabetic Friendly', 'High Calcium', 'Low Glycemic Index', 'Gluten Free', 'Gut Health', 'Weight Management'],
        whyOrder: 'This steamed Ragi Puttu with coconut is zero-oil and easy to digest. Kerala tradition meets millet nutrition!',
        totalOrders: 120,
        averageRating: 4.2,
        reviewCount: 18,
        sentimentScore: 0.65
    },
    {
        name: 'Ragi Idiyappam',
        category: 'Ragi',
        price: 59,
        description: 'Delicate Ragi string hoppers steamed to perfection. Served with coconut milk curry and spicy egg roast. A South Indian delicacy.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop',
        nutrition: { calories: 140, protein: 3.5, fiber: 3.8, iron: 3.0, calcium: 280, carbs: 24, glycemicIndex: 53 },
        healthBenefits: [
            'Steamed string hoppers are extremely light',
            'Low fat content ideal for weight watchers',
            'Ragi flour adds calcium to every strand',
            'Easy to digest — perfect for elderly',
            'Pairs well with protein-rich curries'
        ],
        healthTags: ['Diabetic Friendly', 'High Calcium', 'Low Glycemic Index', 'Gluten Free', 'Weight Management', 'Gut Health'],
        whyOrder: 'These delicate Ragi string hoppers are a true South Indian comfort food. Zero oil, steamed fresh, and full of calcium!',
        totalOrders: 132,
        averageRating: 4.4,
        reviewCount: 19,
        sentimentScore: 0.71
    },
    {
        name: 'Ragi Pancakes',
        category: 'Ragi',
        price: 89,
        description: 'Fluffy American-style pancakes made with Ragi flour, topped with fresh fruits, honey, and crushed walnuts. A healthy brunch favorite.',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
        nutrition: { calories: 210, protein: 5.0, fiber: 4.0, iron: 3.5, calcium: 300, carbs: 32, glycemicIndex: 55 },
        healthBenefits: [
            'Walnuts provide omega-3 for brain health',
            'Fresh fruits add vitamin C and antioxidants',
            'Honey has natural antibacterial properties',
            'Ragi base adds calcium to a fun breakfast',
            'Kid-friendly way to eat millets'
        ],
        healthTags: ['High Calcium', 'Iron Rich', 'Gluten Free', 'Kid Friendly', 'Good for Bone Health'],
        whyOrder: 'Make your kids love millets! These fluffy Ragi Pancakes with fruits and honey are irresistible. 300mg calcium in every serving!',
        totalOrders: 178,
        averageRating: 4.6,
        reviewCount: 28,
        sentimentScore: 0.80
    },

    // ===== JOWAR CATEGORY (7 items) =====
    {
        name: 'Jowar Roti',
        category: 'Jowar',
        price: 35,
        description: 'Freshly made Jowar (sorghum) roti — soft, fluffy, and naturally gluten-free. Served with seasonal sabzi. A staple in healthy Indian households.',
        image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop',
        nutrition: { calories: 110, protein: 3.8, fiber: 3.5, iron: 4.1, calcium: 25, carbs: 22, glycemicIndex: 62 },
        healthBenefits: [
            'Gluten-free alternative to wheat roti',
            'Rich in antioxidants that fight free radicals',
            'High iron content prevents anemia',
            'Promotes heart health with magnesium',
            'Slow-digesting carbs for sustained energy'
        ],
        healthTags: ['Gluten Free', 'Iron Rich', 'Heart Healthy', 'Weight Management', 'High Fiber'],
        whyOrder: 'Replace your regular wheat roti with Jowar Roti! Naturally gluten-free, rich in iron, and contains heart-healthy antioxidants.',
        totalOrders: 290,
        averageRating: 4.5,
        reviewCount: 48,
        sentimentScore: 0.80
    },
    {
        name: 'Jowar Bhakri',
        category: 'Jowar',
        price: 40,
        description: 'Crispy Maharashtrian-style Jowar bhakri served with thecha (spicy green chili chutney) and white butter. Authentic village taste.',
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=600&h=400&fit=crop',
        nutrition: { calories: 130, protein: 4.0, fiber: 3.8, iron: 4.5, calcium: 28, carbs: 24, glycemicIndex: 60 },
        healthBenefits: [
            'Traditional Maharashtrian superfood',
            'Excellent source of B-complex vitamins',
            'Regulates cholesterol levels',
            'Fiber-rich for excellent digestive health',
            'Provides sustained energy for manual workers'
        ],
        healthTags: ['Gluten Free', 'Iron Rich', 'Heart Healthy', 'High Fiber', 'Weight Management'],
        whyOrder: 'Taste the authentic flavors of Maharashtra! This crispy Jowar Bhakri with spicy thecha is how generations have maintained health.',
        totalOrders: 175,
        averageRating: 4.4,
        reviewCount: 25,
        sentimentScore: 0.73
    },
    {
        name: 'Jowar Upma',
        category: 'Jowar',
        price: 55,
        description: 'Savory Jowar upma cooked with vegetables, mustard seeds, and curry leaves. A wholesome breakfast that keeps you energized all morning.',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop',
        nutrition: { calories: 165, protein: 4.5, fiber: 4.0, iron: 3.8, calcium: 30, carbs: 28, glycemicIndex: 58 },
        healthBenefits: [
            'Complex carbs provide slow-release energy',
            'Vegetables add essential vitamins and minerals',
            'Low fat content supports weight loss',
            'Mustard seeds add anti-inflammatory benefits',
            'Curry leaves improve iron absorption'
        ],
        healthTags: ['Gluten Free', 'Iron Rich', 'Weight Management', 'Diabetic Friendly', 'High Fiber'],
        whyOrder: 'Skip the heavy breakfast! Our Jowar Upma is light, nutritious, and loaded with vegetables.',
        totalOrders: 145,
        averageRating: 4.3,
        reviewCount: 20,
        sentimentScore: 0.70
    },
    {
        name: 'Jowar Flakes Chivda',
        category: 'Jowar',
        price: 89,
        description: 'Crunchy Jowar flakes chivda (namkeen mix) with peanuts, curry leaves, and spices. A healthy alternative to processed snacks.',
        image: 'https://images.unsplash.com/photo-1599490659213-e2b9527b711f?w=600&h=400&fit=crop',
        nutrition: { calories: 140, protein: 5.0, fiber: 3.2, iron: 3.5, calcium: 22, carbs: 20, glycemicIndex: 55 },
        healthBenefits: [
            'Healthy snacking without guilt',
            'Peanuts add protein and healthy fats',
            'No artificial preservatives or colors',
            'Satisfies crunch cravings the healthy way',
            'Rich in B vitamins for energy metabolism'
        ],
        healthTags: ['Gluten Free', 'Iron Rich', 'Heart Healthy', 'Protein Rich'],
        whyOrder: 'Ditch the chips! Our Jowar Chivda gives you the crunch you crave with no preservatives — perfect movie-night snack!',
        totalOrders: 210,
        averageRating: 4.6,
        reviewCount: 32,
        sentimentScore: 0.82
    },
    {
        name: 'Jowar Khichdi',
        category: 'Jowar',
        price: 75,
        description: 'Comforting one-pot Jowar khichdi with moong dal, ghee, and mild spices. The ultimate comfort food that is easy on the stomach.',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop',
        nutrition: { calories: 190, protein: 7.0, fiber: 4.5, iron: 4.0, calcium: 35, carbs: 32, glycemicIndex: 55 },
        healthBenefits: [
            'Complete protein when combined with dal',
            'Gentle on the digestive system',
            'Ghee supports nutrient absorption',
            'Perfect recovery food when unwell',
            'Balanced meal with all essential nutrients'
        ],
        healthTags: ['Gluten Free', 'Iron Rich', 'Gut Health', 'Protein Rich', 'High Fiber', 'Kid Friendly'],
        whyOrder: 'Need comfort food that is actually healthy? Our Jowar Khichdi with moong dal is doctor-approved recovery food!',
        totalOrders: 130,
        averageRating: 4.4,
        reviewCount: 19,
        sentimentScore: 0.71
    },
    {
        name: 'Jowar Dhokla',
        category: 'Jowar',
        price: 55,
        description: 'Light, spongy Gujarati-style dhokla made with Jowar flour. Steamed and tempered with mustard seeds, curry leaves, and green chilies.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop',
        nutrition: { calories: 120, protein: 4.2, fiber: 3.0, iron: 3.2, calcium: 20, carbs: 18, glycemicIndex: 52 },
        healthBenefits: [
            'Steamed — zero oil cooking method',
            'Fermentation adds natural probiotics',
            'Low calorie snack with high satiety',
            'B vitamins from fermentation process',
            'Perfect tea-time healthy snack'
        ],
        healthTags: ['Gluten Free', 'Iron Rich', 'Weight Management', 'Gut Health', 'Low Glycemic Index'],
        whyOrder: 'Love dhokla? Try our Jowar version! Zero oil, steamed fresh, with natural probiotics from fermentation. Only 120 calories!',
        totalOrders: 158,
        averageRating: 4.5,
        reviewCount: 24,
        sentimentScore: 0.76
    },
    {
        name: 'Jowar Pasta',
        category: 'Jowar',
        price: 99,
        description: 'Italian-inspired pasta made with Jowar flour in a creamy spinach-basil sauce. Topped with roasted cherry tomatoes and parmesan.',
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&h=400&fit=crop',
        nutrition: { calories: 230, protein: 6.5, fiber: 4.0, iron: 4.0, calcium: 45, carbs: 35, glycemicIndex: 54 },
        healthBenefits: [
            'Gluten-free pasta alternative',
            'Spinach adds iron and folate',
            'Basil has anti-inflammatory compounds',
            'Cherry tomatoes provide lycopene antioxidant',
            'Satisfies pasta cravings without wheat'
        ],
        healthTags: ['Gluten Free', 'Iron Rich', 'Heart Healthy', 'Rich in Antioxidants', 'Weight Management'],
        whyOrder: 'Miss pasta on a gluten-free diet? Our Jowar Pasta in spinach-basil sauce will make you forget regular pasta entirely!',
        totalOrders: 192,
        averageRating: 4.7,
        reviewCount: 31,
        sentimentScore: 0.84
    },

    // ===== FOXTAIL CATEGORY (6 items) =====
    {
        name: 'Foxtail Millet Dosa',
        category: 'Foxtail',
        price: 75,
        description: 'Golden crispy dosa made from foxtail millet (Kangni/Thinai) batter. Served with coconut chutney and vegetable sambar.',
        image: 'https://images.unsplash.com/photo-1668236543090-82eb5eada026?w=600&h=400&fit=crop',
        nutrition: { calories: 140, protein: 4.5, fiber: 3.5, iron: 2.8, calcium: 31, carbs: 24, glycemicIndex: 50 },
        healthBenefits: [
            'Lowest glycemic index among millet dosas',
            'Rich in blood pressure-regulating minerals',
            'Excellent source of dietary fiber',
            'Promotes healthy skin with zinc content',
            'Supports thyroid function with selenium'
        ],
        healthTags: ['Diabetic Friendly', 'Low Glycemic Index', 'Gluten Free', 'High Fiber', 'Heart Healthy', 'Weight Management'],
        whyOrder: 'Our Foxtail Dosa has the LOWEST glycemic index (50) of any dosa on our menu! Perfect for diabetes management.',
        totalOrders: 168,
        averageRating: 4.5,
        reviewCount: 26,
        sentimentScore: 0.76
    },
    {
        name: 'Foxtail Millet Pulao',
        category: 'Foxtail',
        price: 95,
        description: 'Aromatic Foxtail millet pulao with garden-fresh vegetables, whole spices, and fried cashews. A complete one-pot meal.',
        image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&h=400&fit=crop',
        nutrition: { calories: 220, protein: 6.0, fiber: 4.2, iron: 3.0, calcium: 35, carbs: 35, glycemicIndex: 52 },
        healthBenefits: [
            'Perfect rice replacement with 70% more fiber',
            'Whole spices add anti-inflammatory properties',
            'Mixed vegetables provide diverse micronutrients',
            'Keeps you full for 5+ hours',
            'Lower carb content than rice pulao'
        ],
        healthTags: ['Diabetic Friendly', 'Low Glycemic Index', 'Gluten Free', 'High Fiber', 'Weight Management', 'Heart Healthy'],
        whyOrder: "Can't give up rice? Our Foxtail Pulao has 70% more fiber and a much lower glycemic index. Make the switch!",
        totalOrders: 195,
        averageRating: 4.6,
        reviewCount: 30,
        sentimentScore: 0.79
    },
    {
        name: 'Foxtail Millet Pongal',
        category: 'Foxtail',
        price: 65,
        description: 'Creamy South Indian pongal made with foxtail millet and moong dal, tempered with ghee, pepper, and cumin.',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&h=400&fit=crop',
        nutrition: { calories: 175, protein: 5.5, fiber: 3.8, iron: 2.5, calcium: 28, carbs: 28, glycemicIndex: 53 },
        healthBenefits: [
            'Pepper and cumin boost metabolism',
            'Moong dal adds easily digestible protein',
            'Ghee helps absorb fat-soluble vitamins',
            'Warming food that improves digestion',
            'Traditional recipe with modern nutrition'
        ],
        healthTags: ['Diabetic Friendly', 'Low Glycemic Index', 'Gluten Free', 'Gut Health', 'Protein Rich'],
        whyOrder: 'South Indian comfort food reimagined with millets! Creamy, warming, and incredibly satisfying.',
        totalOrders: 142,
        averageRating: 4.4,
        reviewCount: 21,
        sentimentScore: 0.73
    },
    {
        name: 'Foxtail Millet Biryani',
        category: 'Foxtail',
        price: 129,
        description: 'Aromatic dum-style biryani made with foxtail millet, fresh vegetables, and authentic Hyderabadi spices. Served with raita and salan.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop',
        nutrition: { calories: 250, protein: 7.0, fiber: 4.8, iron: 3.2, calcium: 40, carbs: 38, glycemicIndex: 54 },
        healthBenefits: [
            'Biryani experience without the high glycemic rice',
            'Aromatic spices aid digestion',
            'Balanced meal with protein from vegetables and millet',
            'Lower calorie than traditional biryani',
            'Raita adds probiotics for gut health'
        ],
        healthTags: ['Diabetic Friendly', 'Low Glycemic Index', 'Gluten Free', 'High Fiber', 'Weight Management'],
        whyOrder: 'Yes, you CAN have biryani on a health diet! 40% fewer calories and a glycemic index of just 54.',
        totalOrders: 285,
        averageRating: 4.7,
        reviewCount: 42,
        sentimentScore: 0.88
    },
    {
        name: 'Foxtail Millet Idli',
        category: 'Foxtail',
        price: 55,
        description: 'Soft, fluffy idlis made with fermented foxtail millet batter. Pack of 4 idlis served with sambar and three chutneys.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop',
        nutrition: { calories: 130, protein: 4.0, fiber: 3.2, iron: 2.4, calcium: 26, carbs: 22, glycemicIndex: 51 },
        healthBenefits: [
            'Fermented food rich in natural probiotics',
            'Steam-cooked — zero oil',
            'Easy to digest, perfect for all ages',
            'B vitamins from fermentation process',
            'Low calorie breakfast option'
        ],
        healthTags: ['Diabetic Friendly', 'Low Glycemic Index', 'Gluten Free', 'Gut Health', 'Weight Management', 'Kid Friendly'],
        whyOrder: 'Pillow-soft, zero-oil, and packed with probiotics. Only 130 calories for 4 idlis — the lightest breakfast!',
        totalOrders: 155,
        averageRating: 4.3,
        reviewCount: 23,
        sentimentScore: 0.69
    },
    {
        name: 'Foxtail Millet Kheer',
        category: 'Foxtail',
        price: 69,
        description: 'Creamy, aromatic kheer made with foxtail millet, full-fat milk, saffron, cardamom, and garnished with pistachios and almonds.',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop',
        nutrition: { calories: 180, protein: 4.5, fiber: 2.5, iron: 2.0, calcium: 140, carbs: 28, glycemicIndex: 48 },
        healthBenefits: [
            'Saffron has mood-enhancing properties',
            'Pistachios add heart-healthy fats',
            'Low glycemic dessert option',
            'Milk and millet combine for complete protein',
            'Festive treat without the sugar spike'
        ],
        healthTags: ['Low Glycemic Index', 'High Calcium', 'Gluten Free', 'Kid Friendly', 'Good for Bone Health'],
        whyOrder: 'A festive dessert that does not spike your blood sugar! Saffron-infused with real nuts, only 180 calories per bowl.',
        totalOrders: 148,
        averageRating: 4.5,
        reviewCount: 22,
        sentimentScore: 0.77
    },

    // ===== SNACKS CATEGORY (7 items) =====
    {
        name: 'Millet Snack Mix',
        category: 'Snacks',
        price: 99,
        description: 'Crunchy mix of roasted millet puffs, spiced peanuts, curry leaves, and seeds. A guilt-free snack packed with protein and fiber.',
        image: 'https://images.unsplash.com/photo-1599490659213-e2b9527b711f?w=600&h=400&fit=crop',
        nutrition: { calories: 160, protein: 6.5, fiber: 3.0, iron: 3.0, calcium: 45, carbs: 22, glycemicIndex: 48 },
        healthBenefits: [
            'High protein snack for post-workout recovery',
            'Seeds add omega-3 fatty acids',
            'No trans fats or artificial ingredients',
            'Satisfies between-meal hunger healthily',
            'Mix of millets provides diverse nutrients'
        ],
        healthTags: ['Gluten Free', 'Protein Rich', 'Heart Healthy', 'Weight Management', 'Low Glycemic Index'],
        whyOrder: "Snacking shouldn't mean compromising health! 6.5g protein, zero trans fats, glycemic index of just 48.",
        totalOrders: 220,
        averageRating: 4.5,
        reviewCount: 40,
        sentimentScore: 0.77
    },
    {
        name: 'Ragi Chips',
        category: 'Snacks',
        price: 79,
        description: 'Thin, crispy chips made from Ragi flour, lightly seasoned with rock salt and black pepper. Baked, not fried!',
        image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&h=400&fit=crop',
        nutrition: { calories: 120, protein: 3.0, fiber: 2.5, iron: 2.8, calcium: 160, carbs: 18, glycemicIndex: 52 },
        healthBenefits: [
            'Baked — contains 70% less fat than fried chips',
            'Rock salt provides essential minerals',
            'Ragi base adds calcium to a fun snack',
            'No MSG or artificial flavoring',
            'Crunchy satisfaction without the guilt'
        ],
        healthTags: ['High Calcium', 'Gluten Free', 'Weight Management', 'Kid Friendly'],
        whyOrder: 'Chips that are actually GOOD for you! Baked (not fried!), 160mg calcium per serving. Kids love them!',
        totalOrders: 250,
        averageRating: 4.4,
        reviewCount: 36,
        sentimentScore: 0.74
    },
    {
        name: 'Millet Energy Balls',
        category: 'Snacks',
        price: 119,
        description: 'No-bake energy balls made with mixed millets, dates, nuts, seeds, and dark chocolate. Pack of 6 balls. Perfect pre/post-workout fuel.',
        image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&h=400&fit=crop',
        nutrition: { calories: 85, protein: 3.5, fiber: 2.8, iron: 2.2, calcium: 55, carbs: 12, glycemicIndex: 42 },
        healthBenefits: [
            'Natural energy from dates — no refined sugar',
            'Dark chocolate provides antioxidants',
            'Perfect macro ratio for athletic performance',
            'Nuts and seeds add essential fatty acids',
            'Portable nutrition for busy lifestyles'
        ],
        healthTags: ['Low Glycemic Index', 'Protein Rich', 'Gluten Free', 'Rich in Antioxidants', 'Weight Management'],
        whyOrder: "Nature's perfect fuel! Made with dates, dark chocolate — only 85 calories per ball with GI of 42. Gym-goers love them!",
        totalOrders: 190,
        averageRating: 4.7,
        reviewCount: 28,
        sentimentScore: 0.83
    },
    {
        name: 'Bajra Vada',
        category: 'Snacks',
        price: 59,
        description: 'Crispy deep-fried vadas made from bajra (pearl millet) flour mixed with onions, green chilies, and fresh coriander. Served with mint chutney.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop',
        nutrition: { calories: 180, protein: 4.0, fiber: 3.5, iron: 8.0, calcium: 42, carbs: 25, glycemicIndex: 55 },
        healthBenefits: [
            'Bajra is the richest millet in iron content',
            'Traditional Rajasthani recipe for harsh climates',
            'Provides sustained energy for hours',
            'Onions add quercetin — a powerful antioxidant',
            'Green chilies boost metabolism'
        ],
        healthTags: ['Iron Rich', 'Gluten Free', 'Rich in Antioxidants', 'Protein Rich'],
        whyOrder: 'Our Bajra Vadas pack a whopping 8mg of iron per serving! If you need an iron boost, these are your tastiest medicine.',
        totalOrders: 165,
        averageRating: 4.3,
        reviewCount: 24,
        sentimentScore: 0.70
    },
    {
        name: 'Millet Doughnut',
        category: 'Snacks',
        price: 69,
        description: 'Soft, fluffy doughnuts made with multi-millet flour, glazed with jaggery and topped with crushed almonds.',
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop',
        nutrition: { calories: 150, protein: 3.5, fiber: 2.0, iron: 2.5, calcium: 65, carbs: 24, glycemicIndex: 50 },
        healthBenefits: [
            'Multi-millet flour provides diverse nutrients',
            'Jaggery glaze instead of refined sugar',
            'Almonds add vitamin E and healthy fats',
            'Lower calorie than regular doughnuts',
            'Satisfies sweet tooth the healthy way'
        ],
        healthTags: ['Kid Friendly', 'Gluten Free', 'Low Glycemic Index'],
        whyOrder: 'Who says healthy can not be fun? 40% lower in calories than regular doughnuts, sweetened with jaggery!',
        totalOrders: 220,
        averageRating: 4.6,
        reviewCount: 33,
        sentimentScore: 0.81
    },
    {
        name: 'Kodo Millet Cutlet',
        category: 'Snacks',
        price: 89,
        description: 'Crispy vegetable cutlets made with Kodo millet, mixed vegetables, and aromatic spices. Served with tomato sauce and green chutney.',
        image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=600&h=400&fit=crop',
        nutrition: { calories: 145, protein: 5.0, fiber: 3.5, iron: 1.8, calcium: 30, carbs: 20, glycemicIndex: 48 },
        healthBenefits: [
            'Kodo millet is excellent for managing diabetes',
            'High lecithin content strengthens the nervous system',
            'Mixed vegetables add diverse vitamins',
            'Perfect evening snack with chai',
            'Lower calorie than potato cutlets'
        ],
        healthTags: ['Diabetic Friendly', 'Low Glycemic Index', 'Gluten Free', 'Weight Management', 'Protein Rich'],
        whyOrder: 'Kodo Millet strengthens the nervous system with high lecithin. Only 145 calories — enjoy without guilt!',
        totalOrders: 135,
        averageRating: 4.2,
        reviewCount: 17,
        sentimentScore: 0.66
    },
    {
        name: 'Little Millet Samosa',
        category: 'Snacks',
        price: 49,
        description: 'Crispy, flaky samosas filled with spiced little millet (Samai) and potato mixture. Served with tamarind and mint chutney.',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop',
        nutrition: { calories: 135, protein: 3.8, fiber: 2.8, iron: 2.0, calcium: 25, carbs: 20, glycemicIndex: 50 },
        healthBenefits: [
            'Little millet is rich in B-complex vitamins',
            'Lower calorie filling than pure potato',
            'High fiber keeps you full longer',
            'Iron-rich for blood health',
            'Traditional snack with modern nutrition'
        ],
        healthTags: ['Iron Rich', 'Gluten Free', 'High Fiber', 'Kid Friendly', 'Weight Management'],
        whyOrder: 'The humble samosa, upgraded! Our Little Millet filling gives you more fiber and protein than regular potato samosas.',
        totalOrders: 198,
        averageRating: 4.5,
        reviewCount: 30,
        sentimentScore: 0.78
    },

    // ===== DRINKS CATEGORY (7 items) =====
    {
        name: 'Ragi Almond Smoothie',
        category: 'Drinks',
        price: 89,
        description: 'Creamy smoothie blending Ragi malt with almond milk, banana, and a drizzle of honey. A protein-packed post-workout drink.',
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&h=400&fit=crop',
        nutrition: { calories: 210, protein: 7.0, fiber: 4.0, iron: 3.5, calcium: 300, carbs: 30, glycemicIndex: 48 },
        healthBenefits: [
            'Complete post-workout recovery drink',
            'Almond milk adds vitamin E for skin health',
            'Banana provides potassium for muscle recovery',
            'Natural honey has antibacterial properties',
            'Calcium bonanza from ragi + almond combination'
        ],
        healthTags: ['High Calcium', 'Protein Rich', 'Good for Bone Health', 'Gluten Free', 'Immunity Booster', 'Weight Management'],
        whyOrder: 'Our bestselling drink! 300mg calcium + 7g protein = the ultimate fitness drink!',
        totalOrders: 340,
        averageRating: 4.8,
        reviewCount: 55,
        sentimentScore: 0.90
    },
    {
        name: 'Traditional Buttermilk',
        category: 'Drinks',
        price: 35,
        description: 'Refreshing spiced buttermilk (chaas) with roasted cumin, curry leaves, ginger, and fresh mint. Made from fresh curd daily.',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&h=400&fit=crop',
        nutrition: { calories: 45, protein: 2.5, fiber: 0.5, iron: 0.3, calcium: 120, carbs: 5, glycemicIndex: 30 },
        healthBenefits: [
            'Natural probiotic that improves gut flora',
            'Aids digestion after heavy meals',
            'Cooling effect on the body in summer',
            'Cumin and ginger have anti-inflammatory properties',
            'One of the lowest calorie drinks available'
        ],
        healthTags: ['Gut Health', 'Low Glycemic Index', 'Weight Management', 'Immunity Booster'],
        whyOrder: 'The original Indian probiotic drink! Only 45 calories — the healthiest drink on our menu.',
        totalOrders: 300,
        averageRating: 4.6,
        reviewCount: 60,
        sentimentScore: 0.82
    },
    {
        name: 'Millet Protein Shake',
        category: 'Drinks',
        price: 109,
        description: 'Power-packed shake made with sprouted multi-millet flour, peanut butter, banana, and milk. A natural protein supplement.',
        image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=400&fit=crop',
        nutrition: { calories: 280, protein: 12.0, fiber: 5.0, iron: 4.0, calcium: 250, carbs: 35, glycemicIndex: 50 },
        healthBenefits: [
            '12g natural protein — no artificial supplements',
            'Peanut butter adds healthy monounsaturated fats',
            'Sprouted millets increase nutrient bioavailability',
            'Perfect muscle-building drink',
            'Sustained energy for 4-5 hours'
        ],
        healthTags: ['Protein Rich', 'High Calcium', 'Iron Rich', 'Good for Bone Health', 'Gluten Free', 'Immunity Booster'],
        whyOrder: 'Why buy expensive protein powders when nature has the answer? 12g of complete natural protein!',
        totalOrders: 195,
        averageRating: 4.5,
        reviewCount: 30,
        sentimentScore: 0.78
    },
    {
        name: 'Turmeric Millet Latte',
        category: 'Drinks',
        price: 69,
        description: 'Golden milk latte infused with roasted millet powder, turmeric, black pepper, cinnamon, and warm milk. An immunity-boosting evening drink.',
        image: 'https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?w=600&h=400&fit=crop',
        nutrition: { calories: 95, protein: 3.0, fiber: 1.5, iron: 2.0, calcium: 180, carbs: 14, glycemicIndex: 40 },
        healthBenefits: [
            'Curcumin in turmeric is a powerful anti-inflammatory',
            'Black pepper increases curcumin absorption by 2000%',
            'Cinnamon helps regulate blood sugar',
            'Warm milk promotes better sleep',
            'Antioxidant powerhouse that fights inflammation'
        ],
        healthTags: ['Immunity Booster', 'Rich in Antioxidants', 'Low Glycemic Index', 'High Calcium', 'Diabetic Friendly'],
        whyOrder: 'Your daily shield against inflammation! Turmeric + black pepper = 2000% better curcumin absorption.',
        totalOrders: 175,
        averageRating: 4.5,
        reviewCount: 27,
        sentimentScore: 0.76
    },
    {
        name: 'Kambu Koozh',
        category: 'Drinks',
        price: 45,
        description: 'Traditional Tamil Nadu summer drink made with fermented bajra (pearl millet). Naturally cooling, served with small onions.',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop',
        nutrition: { calories: 130, protein: 4.0, fiber: 3.5, iron: 6.0, calcium: 42, carbs: 24, glycemicIndex: 45 },
        healthBenefits: [
            'Traditional fermented drink loaded with probiotics',
            'Naturally cooling — reduces body heat in summer',
            'Bajra provides exceptional iron content',
            'Fermentation creates B12 — rare in plant foods',
            'Used for centuries to prevent heat stroke'
        ],
        healthTags: ['Iron Rich', 'Gut Health', 'Gluten Free', 'Immunity Booster', 'Low Glycemic Index'],
        whyOrder: "This ancient Tamil drink has kept Indians healthy for thousands of years! Fermented bajra creates natural B12. ₹45 — most nutritious drink per rupee!",
        totalOrders: 155,
        averageRating: 4.3,
        reviewCount: 22,
        sentimentScore: 0.70
    },
    {
        name: 'Millet Jaggery Kashayam',
        category: 'Drinks',
        price: 39,
        description: 'Ayurvedic herbal drink made with millet extract, jaggery, dry ginger, pepper, and tulsi. A traditional immunity booster served warm.',
        image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=600&h=400&fit=crop',
        nutrition: { calories: 65, protein: 1.5, fiber: 1.0, iron: 2.5, calcium: 35, carbs: 14, glycemicIndex: 38 },
        healthBenefits: [
            'Tulsi is a proven adaptogen that reduces stress',
            'Dry ginger improves respiratory health',
            'Jaggery is rich in iron and purifies blood',
            'Pepper boosts metabolism and aids weight loss',
            'Traditional cold and flu remedy'
        ],
        healthTags: ['Immunity Booster', 'Rich in Antioxidants', 'Low Glycemic Index', 'Iron Rich'],
        whyOrder: "Nature's best medicine in a cup! Tulsi, ginger, pepper with millet goodness. Perfect immunity boost.",
        totalOrders: 140,
        averageRating: 4.4,
        reviewCount: 20,
        sentimentScore: 0.72
    },
    {
        name: 'Barnyard Millet Payasam',
        category: 'Drinks',
        price: 79,
        description: 'Rich, creamy South Indian payasam made with barnyard millet (Sanwa), milk, jaggery, cardamom, cashews, and raisins.',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop',
        nutrition: { calories: 195, protein: 4.5, fiber: 3.0, iron: 2.0, calcium: 150, carbs: 32, glycemicIndex: 46 },
        healthBenefits: [
            'Barnyard millet has the highest fiber among all millets',
            'Cardamom aids digestion and freshens breath',
            'Jaggery provides iron and minerals',
            'Cashews add heart-healthy monounsaturated fats',
            'Festive treat that does not spike blood sugar'
        ],
        healthTags: ['High Fiber', 'Diabetic Friendly', 'Low Glycemic Index', 'High Calcium', 'Gut Health', 'Kid Friendly'],
        whyOrder: 'Celebrate festivals the healthy way! GI of just 46 — enjoy dessert without the guilt!',
        totalOrders: 165,
        averageRating: 4.6,
        reviewCount: 25,
        sentimentScore: 0.79
    }
];

// ============================================================================
// SAMPLE REVIEWS — 5 per food item (cycled across items)
// ============================================================================

const reviewTemplates = [
    // Set 1
    [
        { text: 'Absolutely delicious! The taste is authentic and the quality is top-notch. Will definitely order again.', rating: 5, sentimentScore: 0.92, sentimentLabel: 'positive' },
        { text: 'Very healthy and filling. I love that it is made with natural ingredients. Perfect for my diet plan.', rating: 4, sentimentScore: 0.75, sentimentLabel: 'positive' },
        { text: 'Great taste and good portion size. My whole family enjoyed it. The health benefits are a bonus!', rating: 5, sentimentScore: 0.88, sentimentLabel: 'positive' },
        { text: 'Started ordering this for my diabetic father. His blood sugar levels have improved. Thank you Krishna Millets!', rating: 5, sentimentScore: 0.95, sentimentLabel: 'positive' },
        { text: 'Good product, tastes nice. Delivery was quick. Would have liked a bit more quantity for the price.', rating: 4, sentimentScore: 0.65, sentimentLabel: 'positive' },
    ],
    // Set 2
    [
        { text: 'This has become a staple in our household! Kids love it and I feel great knowing it is healthy.', rating: 5, sentimentScore: 0.90, sentimentLabel: 'positive' },
        { text: 'Finally found a healthy snack that actually tastes amazing. No more junk food cravings!', rating: 5, sentimentScore: 0.88, sentimentLabel: 'positive' },
        { text: 'Ordered for the first time and was pleasantly surprised. The packaging is great and taste is wonderful.', rating: 4, sentimentScore: 0.78, sentimentLabel: 'positive' },
        { text: 'My nutritionist recommended millet foods and this is by far the best I have tried. Excellent quality.', rating: 5, sentimentScore: 0.92, sentimentLabel: 'positive' },
        { text: 'Decent taste. I appreciate the nutrition info provided. Helps me track my daily intake accurately.', rating: 4, sentimentScore: 0.60, sentimentLabel: 'positive' },
    ],
    // Set 3
    [
        { text: 'Wow! I never knew millet food could taste this good. The flavors are perfectly balanced. 10/10!', rating: 5, sentimentScore: 0.95, sentimentLabel: 'positive' },
        { text: 'Been ordering weekly for 3 months now. My energy levels have improved significantly. Highly recommend!', rating: 5, sentimentScore: 0.90, sentimentLabel: 'positive' },
        { text: 'The health tags really help me choose the right food for my condition. Great transparency from the brand.', rating: 4, sentimentScore: 0.72, sentimentLabel: 'positive' },
        { text: 'Perfect portion size and very filling. I no longer need to snack between meals. Love this!', rating: 5, sentimentScore: 0.85, sentimentLabel: 'positive' },
        { text: 'Nice flavor and good quality ingredients. The millet taste is subtle and pleasant, not overpowering.', rating: 4, sentimentScore: 0.68, sentimentLabel: 'positive' },
    ],
    // Set 4
    [
        { text: 'My grandmother used to make food like this. Brings back memories and is so nutritious! Thank you!', rating: 5, sentimentScore: 0.93, sentimentLabel: 'positive' },
        { text: 'Trying to lose weight and this has been a game changer. Tasty, filling, and low calorie. Perfect!', rating: 5, sentimentScore: 0.88, sentimentLabel: 'positive' },
        { text: 'Good option for health-conscious people. The description matched the actual product. Satisfied customer.', rating: 4, sentimentScore: 0.70, sentimentLabel: 'positive' },
        { text: 'Ordered this for a house party and everyone loved it! Nobody believed it was made from millets.', rating: 5, sentimentScore: 0.91, sentimentLabel: 'positive' },
        { text: 'Fresh, tasty, and nutritious. A bit pricey but worth every penny for the quality you get.', rating: 4, sentimentScore: 0.65, sentimentLabel: 'positive' },
    ],
    // Set 5
    [
        { text: 'As a fitness enthusiast, I am always looking for clean food. This is perfect for my macros!', rating: 5, sentimentScore: 0.87, sentimentLabel: 'positive' },
        { text: 'The calcium content in this is incredible! My doctor is impressed with my bone density improvement.', rating: 5, sentimentScore: 0.92, sentimentLabel: 'positive' },
        { text: 'Tasty and healthy — rare combination! My kids eat it without any complaints. Great for picky eaters.', rating: 5, sentimentScore: 0.85, sentimentLabel: 'positive' },
        { text: 'Reliable quality every time I order. Consistent taste and freshness. Krishna Millets never disappoints.', rating: 4, sentimentScore: 0.78, sentimentLabel: 'positive' },
        { text: 'Good but I wish there were more spice levels to choose from. Otherwise a great healthy option.', rating: 4, sentimentScore: 0.62, sentimentLabel: 'positive' },
    ],
    // Set 6
    [
        { text: 'Life-changing! Since switching to millet-based meals, my digestion has improved dramatically. Love it!', rating: 5, sentimentScore: 0.94, sentimentLabel: 'positive' },
        { text: 'The best millet food delivery service in the city. Fresh, hot, and delivered on time every single time.', rating: 5, sentimentScore: 0.90, sentimentLabel: 'positive' },
        { text: 'Recommended by my Ayurvedic doctor. The natural ingredients really make a difference. Feeling healthier!', rating: 5, sentimentScore: 0.88, sentimentLabel: 'positive' },
        { text: 'Great for post-pregnancy recovery. The iron and calcium content is exactly what I needed. Thank you!', rating: 5, sentimentScore: 0.91, sentimentLabel: 'positive' },
        { text: 'Nice taste overall. Would love to see more variety in the Jowar category. Keep up the good work!', rating: 4, sentimentScore: 0.67, sentimentLabel: 'positive' },
    ],
    // Set 7
    [
        { text: 'Absolutely love the authentic South Indian flavors combined with millet nutrition. Best of both worlds!', rating: 5, sentimentScore: 0.93, sentimentLabel: 'positive' },
        { text: 'My HbA1c levels have dropped since I started eating millet meals regularly. This one is my favorite!', rating: 5, sentimentScore: 0.91, sentimentLabel: 'positive' },
        { text: 'Clean eating has never been easier. Order, eat, enjoy — and feel great about it. Five stars!', rating: 5, sentimentScore: 0.89, sentimentLabel: 'positive' },
        { text: 'The nutrition details on the app are very helpful. Makes meal planning so much easier for diabetics.', rating: 4, sentimentScore: 0.75, sentimentLabel: 'positive' },
        { text: 'Pretty good. I enjoy the taste but find the texture slightly different from regular food. Still ordering!', rating: 4, sentimentScore: 0.60, sentimentLabel: 'positive' },
    ],
];

// ============================================================================
// SEED FUNCTION
// ============================================================================

const seedDatabase = async () => {
    try {
        await connectDB();
        console.log('\n🗑️  Clearing existing data...');

        await Review.deleteMany({});
        await FoodItem.deleteMany({});
        await User.deleteMany({});

        // --- Create Users ---
        console.log('👤 Creating users...');
        const adminUser = await User.create({
            name: 'Krishna Admin',
            email: 'admin@krishnamillets.com',
            password: 'admin123456',
            role: 'admin',
            phone: '9876543210'
        });
        console.log('   ✅ Admin: admin@krishnamillets.com / admin123456');

        const demoCustomer = await User.create({
            name: 'Demo Customer',
            email: 'demo@customer.com',
            password: 'demo123456',
            role: 'customer',
            phone: '9876543211',
            address: {
                street: '123 Healthy Lane',
                city: 'Bangalore',
                state: 'Karnataka',
                pincode: '560001'
            }
        });
        console.log('   ✅ Demo: demo@customer.com / demo123456');

        // Create 5 reviewer accounts for diverse reviews
        const reviewerNames = [
            { name: 'Priya Sharma', email: 'priya@test.com' },
            { name: 'Rahul Verma', email: 'rahul@test.com' },
            { name: 'Anita Reddy', email: 'anita@test.com' },
            { name: 'Suresh Kumar', email: 'suresh@test.com' },
            { name: 'Meera Patel', email: 'meera@test.com' },
        ];

        const reviewers = [];
        for (const r of reviewerNames) {
            const user = await User.create({
                name: r.name,
                email: r.email,
                password: 'test123456',
                role: 'customer',
                phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`
            });
            reviewers.push(user);
        }
        console.log(`   ✅ ${reviewers.length} reviewer accounts created`);

        // --- Seed Food Items ---
        console.log('\n🌱 Seeding food items...');
        const insertedFoods = await FoodItem.insertMany(foodItems);
        console.log(`   ✅ ${insertedFoods.length} food items seeded!`);

        // --- Seed Reviews (5 per food item) ---
        console.log('\n📝 Seeding reviews...');
        let reviewCount = 0;

        for (let i = 0; i < insertedFoods.length; i++) {
            const food = insertedFoods[i];
            const templateSet = reviewTemplates[i % reviewTemplates.length];

            for (let j = 0; j < templateSet.length; j++) {
                const template = templateSet[j];
                const reviewer = reviewers[j % reviewers.length];

                await Review.create({
                    user: reviewer._id,
                    foodItem: food._id,
                    rating: template.rating,
                    text: template.text,
                    sentimentScore: template.sentimentScore,
                    sentimentLabel: template.sentimentLabel
                });
                reviewCount++;
            }
        }
        console.log(`   ✅ ${reviewCount} reviews seeded!`);

        // --- Summary ---
        const categories = {};
        insertedFoods.forEach(f => {
            categories[f.category] = (categories[f.category] || 0) + 1;
        });

        console.log('\n🎉 ═══════════════════════════════════════');
        console.log('   DATABASE SEEDED SUCCESSFULLY!');
        console.log('═══════════════════════════════════════════');
        console.log(`📊 Total food items: ${insertedFoods.length}`);
        console.log(`📝 Total reviews: ${reviewCount}`);
        console.log(`👤 Total users: ${2 + reviewers.length}`);
        console.log(`📁 Categories: ${Object.entries(categories).map(([k, v]) => `${k}(${v})`).join(', ')}`);
        console.log('═══════════════════════════════════════════\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
};

seedDatabase();
