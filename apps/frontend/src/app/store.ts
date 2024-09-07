import { combineReducers, configureStore } from "@reduxjs/toolkit";
import apiSlice from "./api/apiSlice";
import toastMiddleware from "../middleware/toastMiddleware";
import authSlice from "../features/auth/slice/authSlice";
import authMiddleware from "../middleware/authMiddleware";

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(apiSlice.middleware, authMiddleware ,toastMiddleware )
})

export default store
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch