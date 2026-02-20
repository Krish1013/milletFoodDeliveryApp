/**
 * Lightweight keyword-based sentiment analyzer
 * Returns { score: -1 to 1, label: 'positive' | 'neutral' | 'negative' }
 */

const positiveWords = [
    'amazing', 'awesome', 'best', 'brilliant', 'delicious', 'excellent', 'fantastic',
    'good', 'great', 'healthy', 'incredible', 'love', 'loved', 'nice', 'nutritious',
    'outstanding', 'perfect', 'superb', 'tasty', 'wonderful', 'yummy', 'fresh',
    'authentic', 'recommend', 'favorite', 'favourite', 'must try', 'must-try',
    'satisfying', 'quality', 'flavorful', 'wholesome', 'energizing', 'refreshing',
    'smooth', 'rich', 'creamy', 'crunchy', 'filling', 'light', 'clean', 'pure',
    'organic', 'natural', 'nourishing', 'balanced', 'affordable', 'value',
    'happy', 'enjoy', 'enjoyed', 'impressed', 'satisfied', 'definitely', 'absolutely'
];

const negativeWords = [
    'awful', 'bad', 'bland', 'boring', 'cold', 'disappointing', 'disgusting',
    'dry', 'expensive', 'horrible', 'mediocre', 'nasty', 'overpriced', 'poor',
    'raw', 'rotten', 'slow', 'soggy', 'stale', 'tasteless', 'terrible', 'worst',
    'hate', 'hated', 'waste', 'avoid', 'never', 'unhealthy', 'oily', 'greasy',
    'undercooked', 'overcooked', 'burnt', 'salty', 'bitter', 'sour', 'hard',
    'rubbery', 'mushy', 'smell', 'sick', 'upset', 'stomach', 'inedible', 'refund'
];

const intensifiers = ['very', 'really', 'extremely', 'super', 'absolutely', 'totally', 'so'];
const negators = ['not', "don't", "doesn't", "didn't", "won't", "isn't", "aren't", 'never', 'no'];

function analyzeSentiment(text) {
    if (!text || typeof text !== 'string') {
        return { score: 0, label: 'neutral' };
    }

    const words = text.toLowerCase().replace(/[^a-z\s'-]/g, '').split(/\s+/);
    let score = 0;
    let totalMatches = 0;

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const prevWord = i > 0 ? words[i - 1] : '';
        const isNegated = negators.includes(prevWord);
        const isIntensified = intensifiers.includes(prevWord);

        let wordScore = 0;

        if (positiveWords.includes(word)) {
            wordScore = isNegated ? -1 : 1;
            if (isIntensified && !isNegated) wordScore = 1.5;
            totalMatches++;
        } else if (negativeWords.includes(word)) {
            wordScore = isNegated ? 0.5 : -1;
            if (isIntensified && !isNegated) wordScore = -1.5;
            totalMatches++;
        }

        score += wordScore;
    }

    // Normalize to -1 to 1 range
    const normalizedScore = totalMatches > 0
        ? Math.max(-1, Math.min(1, score / totalMatches))
        : 0;

    let label = 'neutral';
    if (normalizedScore > 0.2) label = 'positive';
    else if (normalizedScore < -0.2) label = 'negative';

    return {
        score: Math.round(normalizedScore * 100) / 100,
        label
    };
}

module.exports = { analyzeSentiment };
