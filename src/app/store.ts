import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/slices/categorySlice";
import productReducer from "../features/slices/productSlice";
import ingredientReducer from "../features/slices/ingredientSlice";
import orderReducer from "../features/slices/orderSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categories: categoryReducer,
    products: productReducer,
    ingredients: ingredientReducer,
    orders: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
