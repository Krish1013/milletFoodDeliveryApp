import { createSlice } from '@reduxjs/toolkit';

const savedCart = localStorage.getItem('cart');

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: savedCart ? JSON.parse(savedCart) : [],
        totalAmount: 0,
        totalItems: 0
    },
    reducers: {
        addToCart: (state, { payload }) => {
            const existing = state.items.find(item => item._id === payload._id);
            if (existing) {
                existing.quantity += 1;
            } else {
                state.items.push({ ...payload, quantity: 1 });
            }
            cartSlice.caseReducers.calculateTotals(state);
        },
        removeFromCart: (state, { payload }) => {
            state.items = state.items.filter(item => item._id !== payload);
            cartSlice.caseReducers.calculateTotals(state);
        },
        updateQuantity: (state, { payload: { id, quantity } }) => {
            const item = state.items.find(item => item._id === id);
            if (item) {
                if (quantity <= 0) {
                    state.items = state.items.filter(i => i._id !== id);
                } else {
                    item.quantity = quantity;
                }
            }
            cartSlice.caseReducers.calculateTotals(state);
        },
        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            state.totalItems = 0;
            localStorage.removeItem('cart');
        },
        calculateTotals: (state) => {
            state.totalAmount = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
            state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
            localStorage.setItem('cart', JSON.stringify(state.items));
        }
    }
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
