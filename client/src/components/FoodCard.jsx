import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { addToCart } from '../store/cartSlice';
import { toggleFavorite } from '../store/foodSlice';
import { healthTagStyles } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function FoodCard({ food }) {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const isFavorite = user?.favorites?.includes(food._id);
    const [imgError, setImgError] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        dispatch(addToCart(food));
        toast.success(`${food.name} added to cart! 🛒`);
    };

    const handleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            toast.error('Please login to add favorites');
            return;
        }
        dispatch(toggleFavorite(food._id));
    };

    const getCategoryEmoji = (cat) => {
        const emojis = { Ragi: '🌾', Jowar: '🌿', Foxtail: '🍚', Snacks: '🍿', Drinks: '🥤' };
        return emojis[cat] || '🍽️';
    };

    // Determine if image is a valid external URL
    const hasValidImage = food.image && food.image.startsWith('http') && !imgError;

    return (
        <Link to={`/food/${food._id}`} className="card group cursor-pointer block">
            {/* Image Container */}
            <div className="relative overflow-hidden h-48">
                {hasValidImage ? (
                    <img
                        src={food.image}
                        alt={food.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => setImgError(true)}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-amber-50 flex items-center justify-center">
                        <span className="text-6xl group-hover:scale-110 transition-transform duration-500">
                            {getCategoryEmoji(food.category)}
                        </span>
                    </div>
                )}

                {/* Favorite Button */}
                <button onClick={handleFavorite}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 shadow-md">
                    <FiHeart size={16} className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}
                        fill={isFavorite ? 'currentColor' : 'none'} />
                </button>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
                    style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' }}>
                    {food.category}
                </div>

                {/* Rating */}
                {food.averageRating > 0 && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                        <FiStar size={12} className="text-amber-500 fill-amber-500" fill="currentColor" />
                        <span className="text-xs font-bold text-gray-800">{food.averageRating}</span>
                        <span className="text-[10px] text-gray-500">({food.reviewCount})</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors line-clamp-1">{food.name}</h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{food.description}</p>

                {/* Health Tags (show first 3) */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {food.healthTags?.slice(0, 3).map((tag, i) => (
                        <span key={i} className={`health-badge ${healthTagStyles[tag] || 'bg-gray-100 text-gray-700'}`}>
                            {tag}
                        </span>
                    ))}
                    {food.healthTags?.length > 3 && (
                        <span className="health-badge bg-gray-100 text-gray-600">+{food.healthTags.length - 3}</span>
                    )}
                </div>

                {/* Price and Cart */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-xl font-extrabold" style={{ color: 'var(--color-primary-dark)' }}>₹{food.price}</span>
                        {food.totalOrders > 0 && (
                            <span className="text-[10px] text-gray-400 ml-2">{food.totalOrders}+ ordered</span>
                        )}
                    </div>
                    <button onClick={handleAddToCart}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md"
                        style={{ background: 'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))' }}>
                        <FiShoppingCart size={14} /> Add
                    </button>
                </div>
            </div>
        </Link>
    );
}
