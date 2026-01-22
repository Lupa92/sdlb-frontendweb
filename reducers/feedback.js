import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        message: '',
        type: '',
        visible: false
    },
};


export const feedbackSlice = createSlice({
    name: 'feedback',

    initialState,
    reducers: {
        showFeedback: (state, action) => {
            state.value.message = action.payload.message;
            state.value.type = action.payload.type;
            state.value.visible = true;
        },
        hideFeedback: (state) => {
            state.value.visible = false;
            state.value.message = '';
            state.value.type = '';
        },
    },
});

export const { showFeedback, hideFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;