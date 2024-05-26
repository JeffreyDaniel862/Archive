import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
        update: (state, action) => {
            state.user = action.payload;
        },
        destroy: (state, action) => {
            state.user = null;
        }
    }
});

export const { login, update, destroy } = userSlice.actions;
export default userSlice.reducer