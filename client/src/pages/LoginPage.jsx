import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/authSlice';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector(state => state.auth);

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()); }
    }, [error, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in"
            style={{ background: 'linear-gradient(135deg, #f0ead2 0%, #fefae0 100%)' }}>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="text-5xl">🌾</span>
                    <h1 className="text-3xl font-black text-gray-900 mt-3">Welcome Back!</h1>
                    <p className="text-gray-500 mt-1">Login to your Krishna Millets account</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl">
                    <div className="mb-5">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com" required className="input-field" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" required className="input-field" />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full text-lg !py-4 disabled:opacity-50">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-green-700 hover:text-green-800">Register</Link>
                        </p>
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 rounded-2xl bg-green-50 border border-green-100">
                        <p className="text-xs font-bold text-green-800 mb-2">🧪 Demo Credentials:</p>
                        <div className="space-y-1">
                            <p className="text-xs text-green-700">
                                <strong>Customer:</strong> demo@customer.com / demo123456</p>
                            <p className="text-xs text-green-700">
                                <strong>Admin:</strong> admin@krishnamillets.com / admin123456</p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
