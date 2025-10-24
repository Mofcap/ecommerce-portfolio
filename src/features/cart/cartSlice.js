import { createSlice } from "@reduxjs/toolkit";

const initialState = { items: [] };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) existing.qty += 1;
      else state.items.push({ ...action.payload, qty: 1 });
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
    increaseQty: (state, action) => {
      const it = state.items.find(i => i.id === action.payload);
      if (it) it.qty += 1;
    },
    decreaseQty: (state, action) => {
      const it = state.items.find(i => i.id === action.payload);
      if (it && it.qty > 1) it.qty -= 1;
    },
    clearCart: (state) => { state.items = []; },
  },
});

export const { addToCart, removeFromCart, increaseQty, decreaseQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
