import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import foodReducer from './foodSlice';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import reviewReducer from './reviewSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        food: foodReducer,
        cart: cartReducer,
        order: orderReducer,
        review: reviewReducer
    }
});
