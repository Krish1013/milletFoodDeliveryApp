import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders, updateOrderStatus } from '../store/orderSlice';
import { fetchFoods } from '../store/foodSlice';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { FiDollarSign, FiShoppingBag, FiUsers, FiStar, FiTrendingUp, FiPackage, FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SECTIONS = ['overview', 'orders', 'foods', 'health'];
const PIE_COLORS = ['#2d6a4f', '#f77f00', '#e63946', '#7c3aed', '#0891b2'];
const SENTIMENT_COLORS = ['#059669', '#d97706', '#dc2626'];

export default function AdminDashboard() {
    const dispatch = useDispatch();
    const { allOrders } = useSelector(state => state.order);
    const { foods } = useSelector(state => state.food);
    const [tab, setTab] = useState('overview');
    const [analytics, setAnalytics] = useState(null);
    const [healthInsights, setHealthInsights] = useState(null);
    const [showFoodForm, setShowFoodForm] = useState(false);
    const [editingFood, setEditingFood] = useState(null);
    const [foodForm, setFoodForm] = useState({
        name: '', category: 'Ragi', price: '', description: '',
        nutrition: { calories: 0, protein: 0, fiber: 0, iron: 0, calcium: 0, carbs: 0, glycemicIndex: 0 },
        healthBenefits: [''], healthTags: [], whyOrder: ''
    });

    useEffect(() => {
        fetchAnalytics();
        dispatch(fetchAllOrders());
        dispatch(fetchFoods({ limit: 100 }));
    }, [dispatch]);

    const fetchAnalytics = async () => {
        try {
            const [dash, health] = await Promise.all([
                api.get('/analytics/dashboard'),
                api.get('/analytics/health-insights')
            ]);
            setAnalytics(dash.data.data);
            setHealthInsights(health.data.data);
        } catch (err) { console.error(err); }
    };

    const handleStatusUpdate = (orderId, status) => {
        dispatch(updateOrderStatus({ id: orderId, status }));
        toast.success(`Order status updated to ${status}`);
    };

    const handleFoodSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...foodForm,
                price: Number(foodForm.price),
                healthBenefits: foodForm.healthBenefits.filter(b => b.trim()),
            };
            if (editingFood) {
                await api.put(`/foods/${editingFood._id}`, payload);
                toast.success('Food item updated!');
            } else {
                await api.post('/foods', payload);
                toast.success('Food item created!');
            }
            setShowFoodForm(false);
            setEditingFood(null);
            dispatch(fetchFoods({ limit: 100 }));
        } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    };

    const handleDeleteFood = async (id) => {
        if (!confirm('Delete this food item?')) return;
        try {
            await api.delete(`/foods/${id}`);
            toast.success('Deleted!');
            dispatch(fetchFoods({ limit: 100 }));
        } catch (err) { toast.error('Failed to delete'); }
    };

    const editFood = (food) => {
        setEditingFood(food);
        setFoodForm({
            name: food.name, category: food.category, price: food.price, description: food.description,
            nutrition: food.nutrition || {}, healthBenefits: food.healthBenefits?.length ? food.healthBenefits : [''],
            healthTags: food.healthTags || [], whyOrder: food.whyOrder || ''
        });
        setShowFoodForm(true);
    };

    const allHealthTags = [
        'Diabetic Friendly', 'High Calcium', 'Iron Rich', 'Good for Bone Health',
        'Low Glycemic Index', 'Weight Management', 'High Fiber', 'Gluten Free',
        'Heart Healthy', 'Rich in Antioxidants', 'Gut Health', 'Immunity Booster', 'Protein Rich', 'Kid Friendly'
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="section-title text-3xl">Admin Dashboard 🛡️</h1>
                    <p className="text-gray-500">Manage your Krishna Millet App</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {SECTIONS.map(s => (
                    <button key={s} onClick={() => setTab(s)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all capitalize whitespace-nowrap ${tab === s ? 'text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                            }`} style={tab === s ? { background: 'var(--color-primary)' } : {}}>
                        {s === 'overview' && '📊 '}
                        {s === 'orders' && '📦 '}
                        {s === 'foods' && '🍽️ '}
                        {s === 'health' && '💚 '}
                        {s}
                    </button>
                ))}
            </div>

            {/* ===== OVERVIEW TAB ===== */}
            {tab === 'overview' && analytics && (
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Revenue', value: `₹${analytics.totalRevenue?.toLocaleString() || 0}`, icon: <FiDollarSign />, color: 'from-green-500 to-emerald-600' },
                            { label: 'Total Orders', value: analytics.totalOrders, icon: <FiShoppingBag />, color: 'from-blue-500 to-indigo-600' },
                            { label: 'Customers', value: analytics.totalUsers, icon: <FiUsers />, color: 'from-purple-500 to-violet-600' },
                            { label: 'Reviews', value: analytics.totalReviews, icon: <FiStar />, color: 'from-amber-500 to-orange-600' }
                        ].map(stat => (
                            <div key={stat.label} className={`rounded-2xl p-5 text-white bg-gradient-to-br ${stat.color} shadow-lg`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-white/80 text-sm font-medium">{stat.label}</span>
                                    <span className="text-white/60">{stat.icon}</span>
                                </div>
                                <div className="text-2xl font-black">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {analytics.mostSelling && (
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                <div className="text-xs font-bold text-gray-400 uppercase mb-2">🏆 Most Selling</div>
                                <div className="text-lg font-bold text-gray-900">{analytics.mostSelling.name}</div>
                                <div className="text-sm text-gray-500">{analytics.mostSelling.totalOrders} orders</div>
                            </div>
                        )}
                        {analytics.highestRated && (
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                <div className="text-xs font-bold text-gray-400 uppercase mb-2">⭐ Highest Rated</div>
                                <div className="text-lg font-bold text-gray-900">{analytics.highestRated.name}</div>
                                <div className="text-sm text-gray-500">⭐ {analytics.highestRated.averageRating} ({analytics.highestRated.reviewCount} reviews)</div>
                            </div>
                        )}
                        {analytics.trendingItem && (
                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                <div className="text-xs font-bold text-gray-400 uppercase mb-2">🔥 Trending (7 days)</div>
                                <div className="text-lg font-bold text-gray-900">{analytics.trendingItem.name}</div>
                                <div className="text-sm text-gray-500">{analytics.trendingItem.ordersThisWeek} orders this week</div>
                            </div>
                        )}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Revenue by Day */}
                        {analytics.revenueByDay?.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4">Revenue (Last 7 Days)</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={analytics.revenueByDay}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="revenue" stroke="#2d6a4f" strokeWidth={3} dot={{ fill: '#2d6a4f' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Orders by Category */}
                        {analytics.ordersByCategory?.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4">Orders by Category</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={analytics.ordersByCategory} dataKey="totalOrders" nameKey="_id" cx="50%" cy="50%"
                                            outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                            {analytics.ordersByCategory.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Sentiment Distribution */}
                        {analytics.sentimentDist?.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4">Sentiment Distribution</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={analytics.sentimentDist}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis dataKey="_id" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                                            {analytics.sentimentDist.map((entry, i) => (
                                                <Cell key={i} fill={entry._id === 'positive' ? '#059669' : entry._id === 'negative' ? '#dc2626' : '#d97706'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Order Status */}
                        {analytics.ordersByStatus?.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-800 mb-4">Orders by Status</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={analytics.ordersByStatus} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis type="number" tick={{ fontSize: 11 }} />
                                        <YAxis dataKey="_id" type="category" tick={{ fontSize: 11 }} width={100} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#7c3aed" radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ===== ORDERS TAB ===== */}
            {tab === 'orders' && (
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 text-lg">All Orders ({allOrders.length})</h3>
                    {allOrders.map(order => (
                        <div key={order._id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                <div>
                                    <p className="text-xs text-gray-400">#{order._id.slice(-8).toUpperCase()}</p>
                                    <p className="text-sm font-bold text-gray-800">{order.user?.name || 'Customer'}</p>
                                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-lg" style={{ color: 'var(--color-primary-dark)' }}>₹{order.totalAmount}</p>
                                    <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                                {order.items?.map((item, i) => <span key={i}>{item.name} ×{item.quantity}{i < order.items.length - 1 ? ', ' : ''}</span>)}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-500">Status:</span>
                                <select value={order.status} onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 bg-white">
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="preparing">Preparing</option>
                                    <option value="out_for_delivery">Out for Delivery</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ===== FOODS TAB ===== */}
            {tab === 'foods' && (
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-gray-800 text-lg">Food Items ({foods.length})</h3>
                        <button onClick={() => { setEditingFood(null); setFoodForm({ name: '', category: 'Ragi', price: '', description: '', nutrition: { calories: 0, protein: 0, fiber: 0, iron: 0, calcium: 0, carbs: 0, glycemicIndex: 0 }, healthBenefits: [''], healthTags: [], whyOrder: '' }); setShowFoodForm(true); }}
                            className="btn-primary flex items-center gap-2 text-sm">
                            <FiPlus /> Add Item
                        </button>
                    </div>

                    {/* Food Form Modal */}
                    {showFoodForm && (
                        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold">{editingFood ? 'Edit' : 'Add'} Food Item</h3>
                                    <button onClick={() => setShowFoodForm(false)}><FiX size={24} /></button>
                                </div>
                                <form onSubmit={handleFoodSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                                            <input type="text" value={foodForm.name} onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                                                required className="input-field" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                            <select value={foodForm.category} onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                                                className="input-field">
                                                {['Ragi', 'Jowar', 'Foxtail', 'Snacks', 'Drinks'].map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                                        <input type="number" value={foodForm.price} onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                                            required className="input-field" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                        <textarea value={foodForm.description} onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                                            required className="input-field h-20 resize-none" />
                                    </div>

                                    {/* Nutrition */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Nutrition</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['calories', 'protein', 'fiber', 'iron', 'calcium', 'carbs', 'glycemicIndex'].map(n => (
                                                <div key={n}>
                                                    <label className="text-[10px] text-gray-500 capitalize">{n}</label>
                                                    <input type="number" value={foodForm.nutrition[n]}
                                                        onChange={(e) => setFoodForm({ ...foodForm, nutrition: { ...foodForm.nutrition, [n]: Number(e.target.value) } })}
                                                        className="input-field !py-1 text-sm" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Health Tags */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Health Tags</label>
                                        <div className="flex flex-wrap gap-2">
                                            {allHealthTags.map(tag => (
                                                <button type="button" key={tag}
                                                    onClick={() => {
                                                        const tags = foodForm.healthTags.includes(tag)
                                                            ? foodForm.healthTags.filter(t => t !== tag)
                                                            : [...foodForm.healthTags, tag];
                                                        setFoodForm({ ...foodForm, healthTags: tags });
                                                    }}
                                                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${foodForm.healthTags.includes(tag) ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                    {tag}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Health Benefits */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Health Benefits</label>
                                        {foodForm.healthBenefits.map((b, i) => (
                                            <div key={i} className="flex gap-2 mb-2">
                                                <input type="text" value={b}
                                                    onChange={(e) => { const arr = [...foodForm.healthBenefits]; arr[i] = e.target.value; setFoodForm({ ...foodForm, healthBenefits: arr }); }}
                                                    placeholder={`Benefit ${i + 1}`} className="input-field !py-1 text-sm flex-1" />
                                                {foodForm.healthBenefits.length > 1 && (
                                                    <button type="button" onClick={() => setFoodForm({ ...foodForm, healthBenefits: foodForm.healthBenefits.filter((_, idx) => idx !== i) })}
                                                        className="text-red-400 hover:text-red-600"><FiX /></button>
                                                )}
                                            </div>
                                        ))}
                                        <button type="button" onClick={() => setFoodForm({ ...foodForm, healthBenefits: [...foodForm.healthBenefits, ''] })}
                                            className="text-xs text-green-600 font-bold">+ Add Benefit</button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Why Should You Order This?</label>
                                        <textarea value={foodForm.whyOrder} onChange={(e) => setFoodForm({ ...foodForm, whyOrder: e.target.value })}
                                            className="input-field h-16 resize-none" />
                                    </div>

                                    <button type="submit" className="btn-primary w-full">
                                        {editingFood ? 'Update' : 'Create'} Food Item
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Food List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {foods.map(food => (
                            <div key={food._id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-100 to-amber-50 flex items-center justify-center flex-shrink-0">
                                    <span className="text-xl">{{ Ragi: '🌾', Jowar: '🌿', Foxtail: '🍚', Snacks: '🍿', Drinks: '🥤' }[food.category] || '🍽️'}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-gray-800 text-sm truncate">{food.name}</h4>
                                    <p className="text-xs text-gray-400">{food.category} • ₹{food.price} • {food.totalOrders} orders</p>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => editFood(food)} className="p-2 rounded-lg hover:bg-blue-50 text-blue-500"><FiEdit2 size={16} /></button>
                                    <button onClick={() => handleDeleteFood(food._id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><FiTrash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ===== HEALTH TAB ===== */}
            {tab === 'health' && healthInsights && (
                <div className="space-y-6">
                    <h3 className="font-bold text-gray-800 text-lg">Health-Based Popularity Insights</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {healthInsights.healthTagInsights?.map(insight => (
                            <div key={insight.tag} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                <div className="text-xs font-bold text-gray-400 uppercase mb-2">{insight.tag}</div>
                                <div className="text-lg font-bold text-gray-900">{insight.topItem.name}</div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                    <span>📦 {insight.topItem.totalOrders} orders</span>
                                    <span>⭐ {insight.topItem.averageRating}</span>
                                    <span>₹{insight.topItem.price}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {healthInsights.mostReviewedDrink && (
                        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-100">
                            <h4 className="text-xs font-bold text-cyan-800 uppercase mb-2">🥤 Most Reviewed Healthy Drink</h4>
                            <div className="text-xl font-bold text-gray-900">{healthInsights.mostReviewedDrink.name}</div>
                            <div className="text-sm text-gray-600">
                                {healthInsights.mostReviewedDrink.reviewCount} reviews • ⭐ {healthInsights.mostReviewedDrink.averageRating}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
