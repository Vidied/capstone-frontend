import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import categoryReducer from "../features/menu/categorySlice";
import productReducer from "../features/menu/productSlice";
import ingredientReducer from "../features/menu/ingredientSlice";
import orderReducer from "../features/menu/orderSlice";

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
