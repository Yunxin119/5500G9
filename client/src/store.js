import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./redux/apiSlice";
import authReducer from "./redux/authReducer";

export default configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        authReducer,
    }
});