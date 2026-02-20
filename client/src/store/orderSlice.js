import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const placeOrder = createAsyncThunk('order/placeOrder', async (orderData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/orders', orderData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to place order');
    }
});

export const fetchMyOrders = createAsyncThunk('order/fetchMyOrders', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/orders/my');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
});

export const fetchAllOrders = createAsyncThunk('order/fetchAllOrders', async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/orders', { params });
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders');
    }
});

export const updateOrderStatus = createAsyncThunk('order/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const { data } = await api.put(`/orders/${id}/status`, { status });
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to update status');
    }
});

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        allOrders: [],
        pagination: null,
        loading: false,
        error: null,
        orderSuccess: false
    },
    reducers: {
        resetOrderSuccess: (state) => { state.orderSuccess = false; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(placeOrder.fulfilled, (state) => { state.loading = false; state.orderSuccess = true; })
            .addCase(placeOrder.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
            .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
            .addCase(fetchMyOrders.fulfilled, (state, { payload }) => { state.loading = false; state.orders = payload.data; })
            .addCase(fetchMyOrders.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
            .addCase(fetchAllOrders.pending, (state) => { state.loading = true; })
            .addCase(fetchAllOrders.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.allOrders = payload.data;
                state.pagination = payload.pagination;
            })
            .addCase(fetchAllOrders.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
            .addCase(updateOrderStatus.fulfilled, (state, { payload }) => {
                const idx = state.allOrders.findIndex(o => o._id === payload.data._id);
                if (idx > -1) state.allOrders[idx] = payload.data;
            });
    }
});

export const { resetOrderSuccess } = orderSlice.actions;
export default orderSlice.reducer;
