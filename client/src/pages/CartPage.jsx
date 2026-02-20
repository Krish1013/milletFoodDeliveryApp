import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { updateQuantity, removeFromCart, clearCart } from '../store/cartSlice';
import { placeOrder, resetOrderSuccess } from '../store/orderSlice';
import { useState, useEffect } from 'react';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CartPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalAmount, totalItems } = useSelector(state => state.cart);
    const { user } = useSelector(state => state.auth);
    const { loading, orderSuccess } = useSelector(state => state.order);
    const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '' });
    const [showCheckout, setShowCheckout] = useState(false);

    useEffect(() => {
        if (user?.address) setAddress(user.address);
    }, [user]);

    useEffect(() => {
        if (orderSuccess) {
            toast.success('Order placed successfully! 🎉');
            dispatch(clearCart());
            dispatch(resetOrderSuccess());
            navigate('/orders');
        }
    }, [orderSuccess, dispatch, navigate]);

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        if (!user) { toast.error('Please login to place order'); navigate('/login'); return; }
        if (!address.street || !address.city || !address.state || !address.pincode) {
            toast.error('Please fill in delivery address'); return;
        }
        dispatch(placeOrder({
            items: items.map(item => ({ foodItem: item._id, quantity: item.quantity })),
            deliveryAddress: address,
            paymentMethod: 'cod'
        }));
    };

    if (items.length === 0) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
                <span className="text-7xl block mb-4">🛒</span>
                <h2 className="text-2xl font-black text-gray-800 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-6">Add some healthy millet dishes to your cart!</p>
                <Link to="/menu" className="btn-primary">Browse Menu</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h1 className="section-title text-3xl mb-8">Your Cart 🛒</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map(item => (
                        <div key={item._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-amber-50 flex items-center justify-center flex-shrink-0">
                                <span className="text-2xl">
                                    {{ Ragi: '🌾', Jowar: '🌿', Foxtail: '🍚', Snacks: '🍿', Drinks: '🥤' }[item.category] || '🍽️'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-800 text-sm truncate">{item.name}</h3>
                                <p className="text-xs text-gray-400">{item.category}</p>
                                <p className="font-bold text-green-800 mt-1">₹{item.price * item.quantity}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <FiMinus size={14} />
                                </button>
                                <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                <button onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                                    className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <FiPlus size={14} />
                                </button>
                            </div>
                            <button onClick={() => dispatch(removeFromCart(item._id))}
                                className="text-red-400 hover:text-red-600 transition-colors p-2">
                                <FiTrash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
                        <h3 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h3>
                        <div className="space-y-3 mb-4 pb-4 border-b border-gray-100">
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Items ({totalItems})</span><span className="font-semibold">₹{totalAmount}</span></div>
                            <div className="flex justify-between text-sm"><span className="text-gray-500">Delivery</span><span className="font-semibold text-green-600">FREE</span></div>
                        </div>
                        <div className="flex justify-between text-lg font-black mb-6">
                            <span>Total</span><span style={{ color: 'var(--color-primary-dark)' }}>₹{totalAmount}</span>
                        </div>

                        {!showCheckout ? (
                            <button onClick={() => {
                                if (!user) { toast.error('Please login to checkout'); navigate('/login'); return; }
                                setShowCheckout(true);
                            }} className="btn-primary w-full flex items-center justify-center gap-2">
                                <FiShoppingBag /> Proceed to Checkout
                            </button>
                        ) : (
                            <form onSubmit={handlePlaceOrder} className="space-y-3 animate-slide-up">
                                <h4 className="font-bold text-sm text-gray-700">Delivery Address</h4>
                                <input type="text" placeholder="Street address" value={address.street}
                                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                    required className="input-field !py-2 text-sm" />
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="text" placeholder="City" value={address.city}
                                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                        required className="input-field !py-2 text-sm" />
                                    <input type="text" placeholder="State" value={address.state}
                                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                                        required className="input-field !py-2 text-sm" />
                                </div>
                                <input type="text" placeholder="Pincode" value={address.pincode}
                                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                                    required className="input-field !py-2 text-sm" />
                                <button type="submit" disabled={loading} className="btn-accent w-full disabled:opacity-50">
                                    {loading ? 'Placing Order...' : `Place Order — ₹${totalAmount}`}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
