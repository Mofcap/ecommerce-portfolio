import { createSlice } from "@reduxjs/toolkit";
import productsData from "../../data/products";

const initialState = {
  products: productsData,
  filtered: productsData,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const product = { ...action.payload, id: Date.now() };
      state.products.push(product);
      state.filtered = state.products;
    },
    updateProduct: (state, action) => {
      const { id, data } = action.payload;
      state.products = state.products.map(p => p.id === id ? { ...p, ...data } : p);
      state.filtered = state.products;
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      state.filtered = state.products;
    },
    filterByCategory: (state, action) => {
      state.filtered = state.products.filter(p => p.category === action.payload);
    },
    filterBySubCategory: (state, action) => {
      state.filtered = state.products.filter(p => p.subcategory === action.payload);
    },
    searchProducts: (state, action) => {
      const term = action.payload.toLowerCase();
      state.filtered = state.products.filter(p => p.name.toLowerCase().includes(term));
    },
    resetFilter: (state) => {
      state.filtered = state.products;
    }
  },
});

export const {
  addProduct,
  updateProduct,
  removeProduct,
  filterByCategory,
  filterBySubCategory,
  searchProducts,
  resetFilter
} = productsSlice.actions;
export default productsSlice.reducer;
