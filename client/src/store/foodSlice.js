import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchFoods = createAsyncThunk('food/fetchFoods', async (params = {}, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/foods', { params });
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch foods');
    }
});

export const fetchFoodById = createAsyncThunk('food/fetchFoodById', async (id, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/foods/${id}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch food item');
    }
});

export const fetchMostSelling = createAsyncThunk('food/fetchMostSelling', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/foods/most-selling');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
});

export const fetchMostLoved = createAsyncThunk('food/fetchMostLoved', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/foods/most-loved');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
});

export const fetchTrending = createAsyncThunk('food/fetchTrending', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/foods/trending');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch');
    }
});

export const toggleFavorite = createAsyncThunk('food/toggleFavorite', async (foodId, { rejectWithValue }) => {
    try {
        const { data } = await api.post(`/favorites/${foodId}`);
        return { foodId, isFavorite: data.isFavorite, favorites: data.favorites };
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to toggle favorite');
    }
});

export const fetchFavorites = createAsyncThunk('food/fetchFavorites', async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get('/favorites');
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch favorites');
    }
});

const foodSlice = createSlice({
    name: 'food',
    initialState: {
        foods: [],
        currentFood: null,
        mostSelling: [],
        mostLoved: [],
        trending: [],
        favorites: [],
        pagination: null,
        loading: false,
        error: null
    },
    reducers: {
        clearCurrentFood: (state) => { state.currentFood = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFoods.pending, (state) => { state.loading = true; })
            .addCase(fetchFoods.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.foods = payload.data;
                state.pagination = payload.pagination;
            })
            .addCase(fetchFoods.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

            .addCase(fetchFoodById.pending, (state) => { state.loading = true; })
            .addCase(fetchFoodById.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.currentFood = payload.data;
            })
            .addCase(fetchFoodById.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })

            .addCase(fetchMostSelling.fulfilled, (state, { payload }) => { state.mostSelling = payload.data; })
            .addCase(fetchMostLoved.fulfilled, (state, { payload }) => { state.mostLoved = payload.data; })
            .addCase(fetchTrending.fulfilled, (state, { payload }) => { state.trending = payload.data; })
            .addCase(fetchFavorites.fulfilled, (state, { payload }) => { state.favorites = payload.data; });
    }
});

export const { clearCurrentFood } = foodSlice.actions;
export default foodSlice.reducer;
