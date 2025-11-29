import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {
    query: '',
    location: '',
    categories: [],
    priceMin: 0,
    priceMax: 10000,
    ratings: [],
    sortBy: 'relevance', // relevance, price-low, price-high, rating-high, rating-low, name-asc, name-desc
  },
  services: [],
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.filters.query = action.payload;
    },
    setLocation: (state, action) => {
      state.filters.location = action.payload;
    },
    setCategories: (state, action) => {
      state.filters.categories = action.payload;
    },
    toggleCategory: (state, action) => {
      const category = action.payload;
      const index = state.filters.categories.indexOf(category);
      if (index > -1) {
        state.filters.categories.splice(index, 1);
      } else {
        state.filters.categories.push(category);
      }
    },
    setPriceRange: (state, action) => {
      state.filters.priceMin = action.payload.min;
      state.filters.priceMax = action.payload.max;
    },
    setRatings: (state, action) => {
      state.filters.ratings = action.payload;
    },
    toggleRating: (state, action) => {
      const rating = action.payload;
      const index = state.filters.ratings.indexOf(rating);
      if (index > -1) {
        state.filters.ratings.splice(index, 1);
      } else {
        state.filters.ratings.push(rating);
      }
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...initialState.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setServices: (state, action) => {
      state.services = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setSearchQuery,
  setLocation,
  setCategories,
  toggleCategory,
  setPriceRange,
  setRatings,
  toggleRating,
  setSortBy,
  setFilters,
  clearFilters,
  setServices,
  setLoading,
  setError,
} = searchSlice.actions;

export default searchSlice.reducer;
