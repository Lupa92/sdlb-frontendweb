import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        name: null,
        lastName: null,
        email: null,
        token: null,
        isLoggedIn: false,
    }
};


export const userSlice = createSlice({
    name: 'user',

    initialState,
    reducers: {
        login: (state, action) => {
            state.value = {
                name: action.payload.name,
                lastName: action.payload.lastName,
                token: action.payload.token,
                role: action.payload.role,
                email: action.payload.email,
                isLoggedIn: true,
            }
        },

        disconnect: (state, action) => {
            state.value = {
                name: null,
                lastName: null,
                token: null,
                email: null,
                isLoggedIn: false,
            }
        },

    },
});

export const { login, disconnect } = userSlice.actions;
export default userSlice.reducer;