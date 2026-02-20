// Health tag to badge class mapping
export const healthTagStyles = {
    'Diabetic Friendly': 'badge-diabetic',
    'High Calcium': 'badge-calcium',
    'Iron Rich': 'badge-iron',
    'Good for Bone Health': 'badge-bone',
    'Low Glycemic Index': 'badge-glycemic',
    'Weight Management': 'badge-weight',
    'High Fiber': 'badge-fiber',
    'Gluten Free': 'badge-gluten',
    'Heart Healthy': 'badge-heart',
    'Rich in Antioxidants': 'badge-antioxidant',
    'Gut Health': 'badge-gut',
    'Immunity Booster': 'badge-immunity',
    'Protein Rich': 'badge-protein',
    'Kid Friendly': 'badge-kid'
};

// Health tag icons (emoji)
export const healthTagIcons = {
    'Diabetic Friendly': '🩺',
    'High Calcium': '🦴',
    'Iron Rich': '💪',
    'Good for Bone Health': '🦷',
    'Low Glycemic Index': '📉',
    'Weight Management': '⚖️',
    'High Fiber': '🌾',
    'Gluten Free': '🚫',
    'Heart Healthy': '❤️',
    'Rich in Antioxidants': '🫐',
    'Gut Health': '🦠',
    'Immunity Booster': '🛡️',
    'Protein Rich': '🏋️',
    'Kid Friendly': '👶'
};

// Category colors and icons
export const categoryConfig = {
    Ragi: { icon: '🌾', color: '#8b4513', bg: '#fef3c7' },
    Jowar: { icon: '🌿', color: '#2d6a4f', bg: '#d1fae5' },
    Foxtail: { icon: '🍚', color: '#b45309', bg: '#fff7ed' },
    Snacks: { icon: '🍿', color: '#7c3aed', bg: '#f3e8ff' },
    Drinks: { icon: '🥤', color: '#0891b2', bg: '#ccfbf1' }
};

// Format price in INR
export const formatPrice = (price) => `₹${price}`;

// Truncate text
export const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
