import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiPackage, FiLogOut, FiGrid } from 'react-icons/fi';
import { logout } from '../store/authSlice';

export default function Navbar() {
    const { user } = useSelector(state => state.auth);
    const { totalItems } = useSelector(state => state.cart);
    const [mobileMenu, setMobileMenu] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        setUserMenu(false);
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <span className="text-3xl group-hover:animate-bounce transition-all">🌾</span>
                        <div>
                            <h1 className="text-lg font-extrabold leading-tight" style={{ color: 'var(--color-primary-dark)' }}>
                                Krishna Millets
                            </h1>
                            <p className="text-[10px] font-medium tracking-wider uppercase" style={{ color: 'var(--color-secondary)' }}>
                                Healthy & Natural
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-sm font-semibold text-gray-600 hover:text-green-700 transition-colors">Home</Link>
                        <Link to="/menu" className="text-sm font-semibold text-gray-600 hover:text-green-700 transition-colors">Menu</Link>
                        {user && (
                            <>
                                <Link to="/favorites" className="text-sm font-semibold text-gray-600 hover:text-green-700 transition-colors flex items-center gap-1">
                                    <FiHeart size={14} /> Favorites
                                </Link>
                                <Link to="/orders" className="text-sm font-semibold text-gray-600 hover:text-green-700 transition-colors flex items-center gap-1">
                                    <FiPackage size={14} /> Orders
                                </Link>
                            </>
                        )}
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors flex items-center gap-1">
                                <FiGrid size={14} /> Admin
                            </Link>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <FiShoppingCart size={22} className="text-gray-700" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white rounded-full animate-bounce-in"
                                    style={{ background: 'var(--color-accent)' }}>
                                    {totalItems}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {user ? (
                            <div className="relative">
                                <button onClick={() => setUserMenu(!userMenu)}
                                    className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                        style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))' }}>
                                        {user.name?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="hidden sm:block text-sm font-semibold text-gray-700">{user.name?.split(' ')[0]}</span>
                                </button>
                                {userMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 animate-fade-in">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-bold text-gray-800">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                        <Link to="/orders" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <FiPackage size={14} /> My Orders
                                        </Link>
                                        <Link to="/favorites" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                            <FiHeart size={14} /> Favorites
                                        </Link>
                                        {user.role === 'admin' && (
                                            <Link to="/admin" onClick={() => setUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-purple-600 hover:bg-purple-50">
                                                <FiGrid size={14} /> Admin Panel
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                                            <FiLogOut size={14} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary text-sm !px-4 !py-2">
                                Login
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2">
                            {mobileMenu ? <FiX size={22} /> : <FiMenu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenu && (
                <div className="md:hidden bg-white border-t border-gray-100 animate-slide-up">
                    <div className="px-4 py-3 space-y-2">
                        <Link to="/" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-semibold text-gray-700 hover:text-green-700">Home</Link>
                        <Link to="/menu" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-semibold text-gray-700 hover:text-green-700">Menu</Link>
                        {user && (
                            <>
                                <Link to="/favorites" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-semibold text-gray-700 hover:text-green-700">Favorites</Link>
                                <Link to="/orders" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-semibold text-gray-700 hover:text-green-700">Orders</Link>
                            </>
                        )}
                        {user?.role === 'admin' && (
                            <Link to="/admin" onClick={() => setMobileMenu(false)} className="block py-2 text-sm font-semibold text-purple-600">Admin Panel</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
