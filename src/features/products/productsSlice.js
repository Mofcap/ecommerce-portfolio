import { createSlice } from "@reduxjs/toolkit";
import productsData from "../../data/products";

// Enrichir les données initiales avec stock et ventes si nécessaire
const enrichedProducts = productsData.map(product => ({
  ...product,
  stockQuantity: product.stockQuantity ?? 50, // Valeur par défaut si non définie
  soldQuantity: product.soldQuantity ?? 0,
  minStockAlert: product.minStockAlert ?? 10,
}));

const initialState = {
  products: enrichedProducts,
  filtered: enrichedProducts,
  stats: {
    totalStock: 0,
    totalSold: 0,
    totalValue: 0,
    totalRevenue: 0,
    lowStockCount: 0
  }
};

// Fonction helper pour calculer les statistiques
const calculateStats = (products) => {
  return {
    totalStock: products.reduce((sum, p) => sum + p.stockQuantity, 0),
    totalSold: products.reduce((sum, p) => sum + p.soldQuantity, 0),
    totalValue: products.reduce((sum, p) => sum + (p.stockQuantity * p.price), 0),
    totalRevenue: products.reduce((sum, p) => sum + (p.soldQuantity * p.price), 0),
    lowStockCount: products.filter(p => p.stockQuantity <= p.minStockAlert).length
  };
};

const productsSlice = createSlice({
  name: "products",
  initialState: {
    ...initialState,
    stats: calculateStats(enrichedProducts)
  },
  reducers: {
    // ========== GESTION PRODUITS ==========
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

    // ========== GESTION STOCK ==========
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

    // ========== GESTION VENTES ==========
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

    // ========== FILTRES ==========
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

    // ========== ALERTES STOCK ==========
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
  // Gestion produits
  addProduct,
  updateProduct,
  removeProduct,
  // Gestion stock
  addStock,
  removeStock,
  setStock,
  // Gestion ventes
  recordSale,
  resetSales,
  // Filtres
  filterByCategory,
  filterBySubCategory,
  searchProducts,
  filterLowStock,
  filterOutOfStock,
  filterTopSellers,
  resetFilter,
  // Alertes
  updateStockAlert
} = productsSlice.actions;

// ========== SELECTORS ==========
export const selectAllProducts = (state) => state.products.products;
export const selectFilteredProducts = (state) => state.products.filtered;
export const selectStats = (state) => state.products.stats;

export const selectLowStockProducts = (state) => 
  state.products.products.filter(p => 
    p.stockQuantity <= p.minStockAlert && p.stockQuantity > 0
  );

export const selectOutOfStockProducts = (state) => 
  state.products.products.filter(p => p.stockQuantity === 0);

export const selectTopSellers = (state, limit = 5) => 
  [...state.products.products]
    .sort((a, b) => b.soldQuantity - a.soldQuantity)
    .slice(0, limit);

export const selectProductById = (state, productId) =>
  state.products.products.find(p => p.id === productId);

export const selectCategoryStats = (state) => {
  const categories = {};
  state.products.products.forEach(product => {
    if (!categories[product.category]) {
      categories[product.category] = {
        category: product.category,
        totalStock: 0,
        totalSold: 0,
        totalValue: 0,
        productCount: 0
      };
    }
    categories[product.category].totalStock += product.stockQuantity;
    categories[product.category].totalSold += product.soldQuantity;
    categories[product.category].totalValue += product.stockQuantity * product.price;
    categories[product.category].productCount++;
  });
  return Object.values(categories);
};

export default productsSlice.reducer;