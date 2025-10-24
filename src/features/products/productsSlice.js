import { createSlice } from "@reduxjs/toolkit";
import productsData from "../../data/products";

// Enrichir les données initiales avec stock et ventes si nécessaire
const enrichedProducts = productsData.map(product => ({
  ...product,
  stockQuantity: product.stockQuantity !== undefined && product.stockQuantity !== null ? product.stockQuantity : 50,
  soldQuantity: product.soldQuantity ?? 0,
  minStockAlert: product.minStockAlert ?? 10,
}));

// Fonction helper pour calculer les statistiques
const calculateStats = (products) => {
  return {
    totalStock: products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0),
    totalSold: products.reduce((sum, p) => sum + (p.soldQuantity || 0), 0),
    totalValue: products.reduce((sum, p) => sum + ((p.stockQuantity || 0) * (p.price || 0)), 0),
    totalRevenue: products.reduce((sum, p) => sum + ((p.soldQuantity || 0) * (p.price || 0)), 0),
    lowStockCount: products.filter(p => (p.stockQuantity || 0) <= (p.minStockAlert || 10)).length
  };
};

const initialState = {
  products: enrichedProducts,
  filtered: enrichedProducts,
  stats: calculateStats(enrichedProducts)  // ← Calculer directement ici
};

const productsSlice = createSlice({
  name: "products",
  initialState,  // ← Simplifier ici
  reducers: {
    // ... reste du code identique
    addProduct: (state, action) => {
      const product = { 
        ...action.payload, 
        id: Date.now(),
        stockQuantity: action.payload.stockQuantity ?? 0,
        soldQuantity: 0,
        minStockAlert: action.payload.minStockAlert ?? 10
      };
      state.products.push(product);
      state.filtered = state.products;
      state.stats = calculateStats(state.products);
    },
    
    updateProduct: (state, action) => {
      const { id, data } = action.payload;
      state.products = state.products.map(p => 
        p.id === id ? { ...p, ...data } : p
      );
      state.filtered = state.products;
      state.stats = calculateStats(state.products);
    },
    
    removeProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      state.filtered = state.products;
      state.stats = calculateStats(state.products);
    },

    addStock: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.stockQuantity += quantity;
        state.filtered = state.products;
        state.stats = calculateStats(state.products);
      }
    },

    removeStock: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product && product.stockQuantity >= quantity) {
        product.stockQuantity -= quantity;
        state.filtered = state.products;
        state.stats = calculateStats(state.products);
      }
    },

    setStock: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.stockQuantity = quantity;
        state.filtered = state.products;
        state.stats = calculateStats(state.products);
      }
    },

    recordSale: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product && product.stockQuantity >= quantity) {
        product.stockQuantity -= quantity;
        product.soldQuantity += quantity;
        state.filtered = state.products;
        state.stats = calculateStats(state.products);
      }
    },

    resetSales: (state) => {
      state.products = state.products.map(p => ({
        ...p,
        soldQuantity: 0
      }));
      state.filtered = state.products;
      state.stats = calculateStats(state.products);
    },

    filterByCategory: (state, action) => {
      state.filtered = state.products.filter(p => p.category === action.payload);
    },
    
    filterBySubCategory: (state, action) => {
      state.filtered = state.products.filter(p => p.subcategory === action.payload);
    },
    
    searchProducts: (state, action) => {
      const term = action.payload.toLowerCase();
      state.filtered = state.products.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    },

    filterLowStock: (state) => {
      state.filtered = state.products.filter(p => 
        p.stockQuantity <= p.minStockAlert
      );
    },

    filterOutOfStock: (state) => {
      state.filtered = state.products.filter(p => p.stockQuantity === 0);
    },

    filterTopSellers: (state, action) => {
      const limit = action.payload || 10;
      state.filtered = [...state.products]
        .sort((a, b) => b.soldQuantity - a.soldQuantity)
        .slice(0, limit);
    },

    resetFilter: (state) => {
      state.filtered = state.products;
    },

    updateStockAlert: (state, action) => {
      const { productId, minStock } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.minStockAlert = minStock;
        state.filtered = state.products;
        state.stats = calculateStats(state.products);
      }
    }
  },
});

export const {
  addProduct,
  updateProduct,
  removeProduct,
  addStock,
  removeStock,
  setStock,
  recordSale,
  resetSales,
  filterByCategory,
  filterBySubCategory,
  searchProducts,
  filterLowStock,
  filterOutOfStock,
  filterTopSellers,
  resetFilter,
  updateStockAlert
} = productsSlice.actions;

export default productsSlice.reducer;