import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/authSlice';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
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
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        dispatch(register(form));
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in"
            style={{ background: 'linear-gradient(135deg, #f0ead2 0%, #fefae0 100%)' }}>
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <span className="text-5xl">🌾</span>
                    <h1 className="text-3xl font-black text-gray-900 mt-3">Join Krishna Millets</h1>
                    <p className="text-gray-500 mt-1">Start your healthy eating journey</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl">
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Krishna Kumar" required className="input-field" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="your@email.com" required className="input-field" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone</label>
                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            placeholder="+91 98765 43210" className="input-field" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                            placeholder="Min 6 characters" required className="input-field" />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full text-lg !py-4 disabled:opacity-50">
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-green-700 hover:text-green-800">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
