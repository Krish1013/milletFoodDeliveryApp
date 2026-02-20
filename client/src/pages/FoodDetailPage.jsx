import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoodById, toggleFavorite } from '../store/foodSlice';
import { addToCart } from '../store/cartSlice';
import ReviewSection from '../components/ReviewSection';
import { healthTagStyles, healthTagIcons } from '../utils/helpers';
import { FiShoppingCart, FiHeart, FiArrowLeft, FiStar, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function FoodDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentFood: food, loading } = useSelector(state => state.food);
    const { user } = useSelector(state => state.auth);
    const isFavorite = user?.favorites?.includes(id);

    useEffect(() => {
        dispatch(fetchFoodById(id));
    }, [dispatch, id]);

    const handleAddToCart = () => {
        dispatch(addToCart(food));
        toast.success(`${food.name} added to cart! 🛒`);
    };

    if (loading || !food) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-64 bg-gray-200 rounded-2xl"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    const getCategoryEmoji = (cat) => {
        const emojis = { Ragi: '🌾', Jowar: '🌿', Foxtail: '🍚', Snacks: '🍿', Drinks: '🥤' };
        return emojis[cat] || '🍽️';
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Back */}
            <Link to="/menu" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-700 mb-6 transition-colors">
                <FiArrowLeft size={16} /> Back to Menu
            </Link>

            {/* Main Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                {/* Image / Hero */}
                <div className="relative h-64 sm:h-80 bg-gradient-to-br from-green-100 via-amber-50 to-green-50 flex items-center justify-center">
                    <span className="text-[120px]">{getCategoryEmoji(food.category)}</span>
                    <div className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' }}>
                        {food.category}
                    </div>
                    <button onClick={() => user ? dispatch(toggleFavorite(food._id)) : toast.error('Login to add favorites')}
                        className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <FiHeart size={22} className={isFavorite ? 'text-red-500' : 'text-gray-500'}
                            fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 mb-1">{food.name}</h1>
                            <div className="flex items-center gap-3 text-sm text-gray-500">
                                {food.averageRating > 0 && (
                                    <span className="flex items-center gap-1">
                                        <FiStar className="text-amber-500 fill-amber-500" fill="currentColor" />
                                        <strong>{food.averageRating}</strong> ({food.reviewCount} reviews)
                                    </span>
                                )}
                                {food.totalOrders > 0 && <span>🔥 {food.totalOrders}+ orders</span>}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-3xl font-black" style={{ color: 'var(--color-primary-dark)' }}>₹{food.price}</span>
                            <button onClick={handleAddToCart} className="btn-accent flex items-center gap-2">
                                <FiShoppingCart size={18} /> Add to Cart
                            </button>
                        </div>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">{food.description}</p>

                    {/* Health Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        {food.healthTags?.map((tag, i) => (
                            <span key={i} className={`health-badge text-sm flex items-center gap-1 ${healthTagStyles[tag] || 'bg-gray-100 text-gray-700'}`}>
                                {healthTagIcons[tag]} {tag}
                            </span>
                        ))}
                    </div>

                    {/* Nutrition Card */}
                    <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                        <h3 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                            <FiInfo className="text-green-600" /> Nutritional Information
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
                            {[
                                { label: 'Calories', value: food.nutrition?.calories, unit: 'kcal', color: 'text-orange-600 bg-orange-50' },
                                { label: 'Protein', value: food.nutrition?.protein, unit: 'g', color: 'text-blue-600 bg-blue-50' },
                                { label: 'Fiber', value: food.nutrition?.fiber, unit: 'g', color: 'text-green-600 bg-green-50' },
                                { label: 'Iron', value: food.nutrition?.iron, unit: 'mg', color: 'text-red-600 bg-red-50' },
                                { label: 'Calcium', value: food.nutrition?.calcium, unit: 'mg', color: 'text-purple-600 bg-purple-50' },
                                { label: 'Carbs', value: food.nutrition?.carbs, unit: 'g', color: 'text-amber-600 bg-amber-50' },
                                { label: 'GI', value: food.nutrition?.glycemicIndex, unit: '', color: 'text-teal-600 bg-teal-50' }
                            ].map(n => (
                                <div key={n.label} className={`text-center p-3 rounded-xl ${n.color}`}>
                                    <div className="text-lg font-extrabold">{n.value}{n.unit && <span className="text-[10px] font-normal"> {n.unit}</span>}</div>
                                    <div className="text-[10px] font-semibold uppercase tracking-wider">{n.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Health Benefits */}
                    {food.healthBenefits?.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-extrabold text-gray-900 mb-4">💚 Health Benefits</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {food.healthBenefits.map((benefit, i) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100">
                                        <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                                        <span className="text-sm text-gray-700">{benefit}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Why Order */}
                    {food.whyOrder && (
                        <div className="mb-8 p-6 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50">
                            <h3 className="text-lg font-extrabold text-amber-800 mb-2">🤔 Why Should You Order This?</h3>
                            <p className="text-sm text-amber-700 leading-relaxed">{food.whyOrder}</p>
                        </div>
                    )}

                    {/* Reviews */}
                    <ReviewSection foodId={id} />
                </div>
            </div>
        </div>
    );
}
