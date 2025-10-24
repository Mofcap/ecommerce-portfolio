import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: { users: 2, products: 3, sales: 0 },
  },
  reducers: {
    updateStats: (state, action) => {
      state.stats = action.payload;
    },
  },
});

export const { updateStats } = adminSlice.actions;
export default adminSlice.reducer;
