import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders } from '../store/orderSlice';
import { FiPackage, FiClock, FiCheck, FiTruck, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const statusConfig = {
    pending: { icon: <FiClock />, color: 'text-amber-600 bg-amber-50', label: 'Pending' },
    confirmed: { icon: <FiCheck />, color: 'text-blue-600 bg-blue-50', label: 'Confirmed' },
    preparing: { icon: <FiPackage />, color: 'text-purple-600 bg-purple-50', label: 'Preparing' },
    out_for_delivery: { icon: <FiTruck />, color: 'text-indigo-600 bg-indigo-50', label: 'Out for Delivery' },
    delivered: { icon: <FiCheck />, color: 'text-green-600 bg-green-50', label: 'Delivered' },
    cancelled: { icon: <FiX />, color: 'text-red-600 bg-red-50', label: 'Cancelled' }
};

export default function OrdersPage() {
    const dispatch = useDispatch();
    const { orders, loading } = useSelector(state => state.order);

    useEffect(() => {
        dispatch(fetchMyOrders());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="space-y-4">{[1, 2, 3].map(i => (
                    <div key={i} className="card animate-pulse p-6"><div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div><div className="h-3 bg-gray-200 rounded w-2/3"></div></div>
                ))}</div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h1 className="section-title text-3xl mb-8">My Orders 📦</h1>

            {orders.length === 0 ? (
                <div className="text-center py-20">
                    <span className="text-7xl block mb-4">📦</span>
                    <h2 className="text-2xl font-black text-gray-800 mb-2">No Orders Yet</h2>
                    <p className="text-gray-500 mb-6">Your healthy journey starts with the first order!</p>
                    <Link to="/menu" className="btn-primary">Order Now</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => {
                        const status = statusConfig[order.status] || statusConfig.pending;
                        return (
                            <div key={order._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Order #{order._id.slice(-8).toUpperCase()}</p>
                                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${status.color}`}>
                                        {status.icon} {status.label}
                                    </span>
                                </div>
                                <div className="space-y-2 mb-4">
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <span className="text-gray-700">{item.name} × {item.quantity}</span>
                                            <span className="font-semibold text-gray-800">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <span className="text-sm text-gray-500">Total</span>
                                    <span className="text-lg font-black" style={{ color: 'var(--color-primary-dark)' }}>₹{order.totalAmount}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
