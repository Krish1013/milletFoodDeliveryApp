import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoods } from '../store/foodSlice';
import FoodCard from '../components/FoodCard';
import { categoryConfig, healthTagStyles } from '../utils/helpers';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const ALL_HEALTH_TAGS = Object.keys(healthTagStyles);

export default function MenuPage() {
    const dispatch = useDispatch();
    const { foods, loading, pagination } = useSelector(state => state.food);
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [showFilters, setShowFilters] = useState(false);

    const category = searchParams.get('category') || '';
    const healthTag = searchParams.get('healthTag') || '';
    const sort = searchParams.get('sort') || '';
    const page = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        const params = {};
        if (category) params.category = category;
        if (healthTag) params.healthTag = healthTag;
        if (sort) params.sort = sort;
        if (search) params.search = search;
        params.page = page;
        dispatch(fetchFoods(params));
    }, [dispatch, category, healthTag, sort, page, search]);

    const updateFilter = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (value) params.set(key, value);
        else params.delete(key);
        params.delete('page');
        setSearchParams(params);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateFilter('search', search);
    };

    const clearAll = () => {
        setSearch('');
        setSearchParams({});
    };

    const hasFilters = category || healthTag || sort || search;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="section-title text-4xl">Our Menu 🍽️</h1>
                <p className="text-gray-500">Healthy millet-based dishes crafted with love</p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search for Ragi Java, Jowar Roti, Foxtail Dosa..."
                        className="input-field !pl-11" />
                </div>
                <button type="submit" className="btn-primary">Search</button>
                <button type="button" onClick={() => setShowFilters(!showFilters)}
                    className="btn-secondary flex items-center gap-2 md:hidden">
                    <FiFilter size={16} /> Filters
                </button>
            </form>

            <div className="flex gap-6">
                {/* Sidebar Filters — desktop always visible, mobile toggle */}
                <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white p-6 overflow-y-auto' : 'hidden'} md:block md:static md:w-60 flex-shrink-0`}>
                    {showFilters && (
                        <button onClick={() => setShowFilters(false)} className="md:hidden absolute top-4 right-4">
                            <FiX size={24} />
                        </button>
                    )}
                    <div className="space-y-6">
                        {/* Categories */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Categories</h3>
                            <div className="space-y-1">
                                <button onClick={() => updateFilter('category', '')}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-green-100 text-green-800 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    All Categories
                                </button>
                                {Object.entries(categoryConfig).map(([name, config]) => (
                                    <button key={name} onClick={() => updateFilter('category', name)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${category === name ? 'bg-green-100 text-green-800 font-bold' : 'text-gray-600 hover:bg-gray-50'
                                            }`}>
                                        <span>{config.icon}</span> {name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Sort By</h3>
                            <div className="space-y-1">
                                {[
                                    { value: '', label: 'Newest' },
                                    { value: 'price_asc', label: 'Price: Low to High' },
                                    { value: 'price_desc', label: 'Price: High to Low' },
                                    { value: 'rating', label: 'Highest Rated' },
                                    { value: 'popular', label: 'Most Popular' }
                                ].map(opt => (
                                    <button key={opt.value} onClick={() => updateFilter('sort', opt.value)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sort === opt.value ? 'bg-green-100 text-green-800 font-bold' : 'text-gray-600 hover:bg-gray-50'
                                            }`}>
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Health Tags */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wider">Health Tags</h3>
                            <div className="space-y-1">
                                <button onClick={() => updateFilter('healthTag', '')}
                                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!healthTag ? 'bg-green-100 text-green-800 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                                    All Tags
                                </button>
                                {ALL_HEALTH_TAGS.map(tag => (
                                    <button key={tag} onClick={() => updateFilter('healthTag', tag)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${healthTag === tag ? 'bg-green-100 text-green-800 font-bold' : 'text-gray-600 hover:bg-gray-50'
                                            }`}>
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Food Grid */}
                <main className="flex-1">
                    {/* Active Filters */}
                    {hasFilters && (
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="text-xs text-gray-400">Active:</span>
                            {category && (
                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold flex items-center gap-1">
                                    {category} <FiX className="cursor-pointer" onClick={() => updateFilter('category', '')} />
                                </span>
                            )}
                            {healthTag && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold flex items-center gap-1">
                                    {healthTag} <FiX className="cursor-pointer" onClick={() => updateFilter('healthTag', '')} />
                                </span>
                            )}
                            {search && (
                                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold flex items-center gap-1">
                                    "{search}" <FiX className="cursor-pointer" onClick={() => { setSearch(''); updateFilter('search', ''); }} />
                                </span>
                            )}
                            <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-700 font-semibold ml-2">Clear All</button>
                        </div>
                    )}

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="card animate-pulse">
                                    <div className="h-48 bg-gray-200"></div>
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-full"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : foods.length > 0 ? (
                        <>
                            <p className="text-sm text-gray-400 mb-4">{pagination?.total || foods.length} items found</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {foods.map(food => (
                                    <FoodCard key={food._id} food={food} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.pages > 1 && (
                                <div className="flex justify-center gap-2 mt-8">
                                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                                        <button key={p} onClick={() => updateFilter('page', p.toString())}
                                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${p === page
                                                    ? 'text-white shadow-lg'
                                                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                                }`}
                                            style={p === page ? { background: 'var(--color-primary)' } : {}}>
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <span className="text-6xl block mb-4">🔍</span>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No items found</h3>
                            <p className="text-gray-500 mb-4">Try adjusting your filters or search terms</p>
                            <button onClick={clearAll} className="btn-primary">Clear Filters</button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
