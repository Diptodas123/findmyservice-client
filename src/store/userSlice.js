import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    profile: {
        name: '',
        email: '',
        phone: '',
        profilePictureUrl: '',
        userId: '',
        role: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
    },
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.profile = action.payload;
        },
        clearUser(state) {
            state.profile = {
                name: '',
                email: '',
                phone: '',
                profilePictureUrl: '',
                userId: '',
                role: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                zipCode: '',
            };
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
