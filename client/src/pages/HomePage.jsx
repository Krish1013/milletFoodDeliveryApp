import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMostSelling, fetchMostLoved, fetchTrending } from '../store/foodSlice';
import FoodCard from '../components/FoodCard';
import { categoryConfig } from '../utils/helpers';
import { fallbackMostSelling, fallbackMostLoved, fallbackTrending } from '../utils/fallbackData';
import { FiTrendingUp, FiHeart, FiAward, FiArrowRight, FiShield, FiDroplet, FiZap } from 'react-icons/fi';

export default function HomePage() {
    const dispatch = useDispatch();
    const { mostSelling, mostLoved, trending } = useSelector(state => state.food);
    const [usingFallback, setUsingFallback] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                await Promise.all([
                    dispatch(fetchMostSelling()).unwrap(),
                    dispatch(fetchMostLoved()).unwrap(),
                    dispatch(fetchTrending()).unwrap()
                ]);
            } catch {
                setUsingFallback(true);
            }
        };
        load();
    }, [dispatch]);

    // Use API data if available, otherwise use fallback
    const displayTrending = trending.length > 0 ? trending : fallbackTrending;
    const displayMostSelling = mostSelling.length > 0 ? mostSelling : fallbackMostSelling;
    const displayMostLoved = mostLoved.length > 0 ? mostLoved : fallbackMostLoved;

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 50%, #40916c 100%)' }}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 text-8xl">🌾</div>
                    <div className="absolute top-20 right-20 text-6xl">🌿</div>
                    <div className="absolute bottom-10 left-1/3 text-7xl">🍚</div>
                    <div className="absolute bottom-20 right-10 text-5xl">🥤</div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
                    <div className="text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-green-200 text-sm font-medium mb-6">
                            <FiShield size={14} /> 100% Natural & Organic Millets
                        </div>
                        <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 leading-tight">
                            Nourish Your Body with<br />
                            <span className="text-amber-300">Ancient Millet Wisdom</span>
                        </h1>
                        <p className="text-lg text-green-200 max-w-2xl mx-auto mb-8">
                            Discover the power of Ragi, Jowar, and Foxtail millets. Every dish is crafted for taste, health, and tradition.
                            From diabetic-friendly meals to calcium-rich drinks — eat smart, live better.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/menu" className="btn-accent text-lg !px-8 !py-4 shadow-xl">
                                🍽️ Explore Our Menu
                            </Link>
                            <a href="#health" className="btn-secondary !border-white/30 !text-white hover:!bg-white/10 text-lg !px-8 !py-4">
                                💚 Health Benefits
                            </a>
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center gap-8 sm:gap-16 mt-12 pt-8 border-t border-white/10">
                            <div className="text-center">
                                <div className="text-3xl font-black text-amber-300">35+</div>
                                <div className="text-sm text-green-300">Millet Dishes</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-amber-300">5</div>
                                <div className="text-sm text-green-300">Categories</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-black text-amber-300">100%</div>
                                <div className="text-sm text-green-300">Natural</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-10">
                    <h2 className="section-title">Browse by Category</h2>
                    <p className="text-gray-500">Find your perfect healthy meal</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {Object.entries(categoryConfig).map(([name, config]) => (
                        <Link key={name} to={`/menu?category=${name}`}
                            className="card p-6 text-center group cursor-pointer hover:!shadow-xl">
                            <span className="text-4xl block mb-3 group-hover:scale-125 transition-transform duration-300">{config.icon}</span>
                            <h3 className="font-bold text-gray-800 text-sm">{name}</h3>
                            <p className="text-[10px] text-gray-400 mt-1">
                                {name === 'Ragi' && 'Calcium Powerhouse'}
                                {name === 'Jowar' && 'Iron Rich'}
                                {name === 'Foxtail' && 'Low Glycemic'}
                                {name === 'Snacks' && 'Guilt Free'}
                                {name === 'Drinks' && 'Refreshing'}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Trending */}
            <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <FiTrendingUp className="text-orange-500" size={24} />
                                <h2 className="section-title !text-2xl">Trending Now 🔥</h2>
                            </div>
                            <p className="text-gray-500 text-sm">Most ordered this week</p>
                        </div>
                        <Link to="/menu" className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1">
                            View All <FiArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayTrending.slice(0, 4).map(food => (
                            <FoodCard key={food._id} food={food} />
                        ))}
                    </div>
                    {usingFallback && (
                        <p className="text-center text-xs text-gray-400 mt-4">Showing sample data • Connect to server for live data</p>
                    )}
                </div>
            </section>

            {/* Most Selling */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <FiAward className="text-green-600" size={24} />
                            <h2 className="section-title !text-2xl">Most Popular</h2>
                        </div>
                        <p className="text-gray-500 text-sm">Customer favorites by order count</p>
                    </div>
                    <Link to="/menu?sort=popular" className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1">
                        View All <FiArrowRight size={14} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayMostSelling.slice(0, 4).map(food => (
                        <FoodCard key={food._id} food={food} />
                    ))}
                </div>
            </section>

            {/* Most Loved */}
            <section className="bg-gradient-to-r from-pink-50 to-rose-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <FiHeart className="text-rose-500" size={24} />
                                <h2 className="section-title !text-2xl">Most Loved ❤️</h2>
                            </div>
                            <p className="text-gray-500 text-sm">Highest rated by our customers</p>
                        </div>
                        <Link to="/menu?sort=rating" className="text-sm font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1">
                            View All <FiArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayMostLoved.slice(0, 4).map(food => (
                            <FoodCard key={food._id} food={food} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Health Benefits Section */}
            <section id="health" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="section-title">Why Choose Millets?</h2>
                    <p className="text-gray-500">Ancient grains for modern health</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card p-8 text-center">
                        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-blue-50">
                            <FiDroplet size={28} className="text-blue-500" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">Diabetic Friendly</h3>
                        <p className="text-sm text-gray-500">Low glycemic index millets help maintain stable blood sugar levels. Recommended by nutritionists for diabetic management.</p>
                    </div>
                    <div className="card p-8 text-center">
                        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-green-50">
                            <FiShield size={28} className="text-green-500" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">Immunity Booster</h3>
                        <p className="text-sm text-gray-500">Rich in antioxidants, iron, and essential minerals. Millets strengthen your immune system naturally.</p>
                    </div>
                    <div className="card p-8 text-center">
                        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 bg-amber-50">
                            <FiZap size={28} className="text-amber-500" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">Sustained Energy</h3>
                        <p className="text-sm text-gray-500">Complex carbohydrates in millets provide slow-release energy, keeping you active and focused throughout the day.</p>
                    </div>
                </div>
            </section>

            {/* Footer  */}
            <footer className="bg-gray-900 text-gray-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">🌾</span>
                                <h3 className="text-lg font-bold text-white">Krishna Millets</h3>
                            </div>
                            <p className="text-sm">Bringing the ancient wisdom of millets to your doorstep. Healthy, natural, and delicious.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-3">Quick Links</h4>
                            <div className="space-y-2">
                                <Link to="/menu" className="block text-sm hover:text-white transition-colors">Full Menu</Link>
                                <Link to="/menu?category=Ragi" className="block text-sm hover:text-white transition-colors">Ragi Items</Link>
                                <Link to="/menu?category=Drinks" className="block text-sm hover:text-white transition-colors">Healthy Drinks</Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-3">Contact</h4>
                            <p className="text-sm">📍 Hyderabad, Telangana</p>
                            <p className="text-sm">📞 +91 83091 86462</p>
                            <p className="text-sm">✉️ hello@krishnamillets.com</p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-xs">
                        <p>© 2026 Krishna Millet App. Made with 💚 for healthy living.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
