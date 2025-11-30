import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profile: {
        providerId: '',
        providerName: '',
        email: '',
        phone: '',
        profilePictureUrl: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        imageUrls: [],
        avgRating: 0,
        totalRatings: 0,
        createdAt: '',
    },
    isProfileComplete: false,
};

const providerSlice = createSlice({
    name: 'provider',
    initialState,
    reducers: {
        setProvider(state, action) {
            state.profile = action.payload;
            // Check if profile is complete (has essential fields)
            state.isProfileComplete = !!(
                action.payload?.providerName &&
                action.payload?.email &&
                action.payload?.phone &&
                action.payload?.city &&
                action.payload?.state
            );
        },
        updateProvider(state, action) {
            state.profile = { ...state.profile, ...action.payload };
            // Recheck if profile is complete
            state.isProfileComplete = !!(
                state.profile?.providerName &&
                state.profile?.email &&
                state.profile?.phone &&
                state.profile?.city &&
                state.profile?.state
            );
        },
        clearProvider(state) {
            state.profile = {
                providerId: '',
                providerName: '',
                email: '',
                phone: '',
                profilePictureUrl: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                zipCode: '',
                imageUrls: [],
                avgRating: 0,
                totalRatings: 0,
                createdAt: '',
            };
            state.isProfileComplete = false;
        },
    },
});

export const { setProvider, updateProvider, clearProvider } = providerSlice.actions;
export default providerSlice.reducer;
