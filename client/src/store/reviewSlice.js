import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const submitReview = createAsyncThunk('review/submitReview', async (reviewData, { rejectWithValue }) => {
    try {
        const { data } = await api.post('/reviews', reviewData);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to submit review');
    }
});

export const fetchFoodReviews = createAsyncThunk('review/fetchFoodReviews', async (foodId, { rejectWithValue }) => {
    try {
        const { data } = await api.get(`/reviews/food/${foodId}`);
        return data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch reviews');
    }
});

const reviewSlice = createSlice({
    name: 'review',
    initialState: {
        reviews: [],
        sentimentSummary: null,
        loading: false,
        error: null,
        submitSuccess: false
    },
    reducers: {
        resetSubmitSuccess: (state) => { state.submitSuccess = false; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(submitReview.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(submitReview.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.submitSuccess = true;
                state.reviews.unshift(payload.data);
            })
            .addCase(submitReview.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
            .addCase(fetchFoodReviews.pending, (state) => { state.loading = true; })
            .addCase(fetchFoodReviews.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.reviews = payload.data;
                state.sentimentSummary = payload.sentimentSummary;
            })
            .addCase(fetchFoodReviews.rejected, (state, { payload }) => { state.loading = false; state.error = payload; });
    }
});

export const { resetSubmitSuccess } = reviewSlice.actions;
export default reviewSlice.reducer;
