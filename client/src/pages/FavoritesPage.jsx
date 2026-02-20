import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites } from '../store/foodSlice';
import FoodCard from '../components/FoodCard';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
    const dispatch = useDispatch();
    const { favorites, loading } = useSelector(state => state.food);

    useEffect(() => {
        dispatch(fetchFavorites());
    }, [dispatch]);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h1 className="section-title text-3xl mb-8">My Favorites ❤️</h1>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="card animate-pulse"><div className="h-48 bg-gray-200"></div><div className="p-4 space-y-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div></div>
                    ))}
                </div>
            ) : favorites.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favorites.map(food => <FoodCard key={food._id} food={food} />)}
                </div>
            ) : (
                <div className="text-center py-20">
                    <span className="text-7xl block mb-4">❤️</span>
                    <h2 className="text-2xl font-black text-gray-800 mb-2">No Favorites Yet</h2>
                    <p className="text-gray-500 mb-6">Tap the heart icon on any dish to save it here!</p>
                    <Link to="/menu" className="btn-primary">Browse Menu</Link>
                </div>
            )}
        </div>
    );
}
