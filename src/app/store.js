import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import productsReducer from "../features/products/productsSlice";
import categoriesReducer from "../features/categories/categoriesSlice";
import adminReducer from "../features/admin/adminSlice";

/* Simple persistence to localStorage */
const LOCAL_KEY = "ecom_state_v1";

const loadState = () => {
  try {
    const s = localStorage.getItem(LOCAL_KEY);
    if (!s) return undefined;
    return JSON.parse(s);
  } catch (e) {
    console.error("Load state error", e);
    return undefined;
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    categories: categoriesReducer,
    admin: adminReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  try {
    const state = store.getState();
    const toSave = {
      auth: state.auth,
      cart: state.cart,
      products: state.products,
      categories: state.categories,
    };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(toSave));
  } catch (e) {
    console.error("Save state error", e);
  }
});
