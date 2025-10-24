import { createSlice } from "@reduxjs/toolkit";
import categoriesData from "../../data/categories";

const initialState = {
  categories: categoriesData,
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategory: (state, action) => {
      const cat = { id: Date.now(), name: action.payload.name, subcategories: action.payload.subcategories || [] };
      state.categories.push(cat);
    },
    removeCategory: (state, action) => {
      state.categories = state.categories.filter(c => c.id !== action.payload);
    },
    addSubCategory: (state, action) => {
      const { categoryId, subcategory } = action.payload;
      const cat = state.categories.find(c => c.id === categoryId);
      if (cat) cat.subcategories.push(subcategory);
    },
    removeSubCategory: (state, action) => {
      const { categoryId, subcategory } = action.payload;
      const cat = state.categories.find(c => c.id === categoryId);
      if (cat) cat.subcategories = cat.subcategories.filter(s => s !== subcategory);
    }
  },
});

export const { addCategory, removeCategory, addSubCategory, removeSubCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
