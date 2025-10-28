import { createSlice } from '@reduxjs/toolkit';
import ordersData from '../../data/orders';

const initialState = {
  orders: ordersData,
  filteredOrders: ordersData,
  selectedOrder: null,
  filters: {
    status: 'all',
    dateRange: null,
    customerId: null,
    searchTerm: ''
  },
  stats: {
    totalOrders: ordersData.length,
    totalRevenue: ordersData.reduce((sum, order) => sum + order.totalAmount, 0),
    pendingOrders: ordersData.filter(o => o.status === 'pending').length,
    processingOrders: ordersData.filter(o => o.status === 'processing').length,
    shippedOrders: ordersData.filter(o => o.status === 'shipped').length,
    deliveredOrders: ordersData.filter(o => o.status === 'delivered').length
  }
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Sélectionner une commande
    selectOrder: (state, action) => {
      state.selectedOrder = state.orders.find(order => order.id === action.payload);
    },

    // Désélectionner une commande
    deselectOrder: (state) => {
      state.selectedOrder = null;
    },

    // Ajouter une nouvelle commande
    addOrder: (state, action) => {
      const newOrder = {
        ...action.payload,
        id: Math.max(...state.orders.map(o => o.id)) + 1,
        orderDate: new Date().toISOString()
      };
      state.orders.unshift(newOrder);
      state.filteredOrders = state.orders;
      ordersSlice.caseReducers.updateStats(state);
    },

    // Mettre à jour le statut d'une commande
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        if (state.selectedOrder?.id === orderId) {
          state.selectedOrder.status = status;
        }
      }
      ordersSlice.caseReducers.updateStats(state);
      ordersSlice.caseReducers.applyFilters(state);
    },

    // Mettre à jour une commande complète
    updateOrder: (state, action) => {
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      }
      ordersSlice.caseReducers.updateStats(state);
      ordersSlice.caseReducers.applyFilters(state);
    },

    // Supprimer une commande
    deleteOrder: (state, action) => {
      state.orders = state.orders.filter(o => o.id !== action.payload);
      if (state.selectedOrder?.id === action.payload) {
        state.selectedOrder = null;
      }
      ordersSlice.caseReducers.updateStats(state);
      ordersSlice.caseReducers.applyFilters(state);
    },

    // Définir le filtre de statut
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
      ordersSlice.caseReducers.applyFilters(state);
    },

    // Définir le filtre de plage de dates
    setDateRangeFilter: (state, action) => {
      state.filters.dateRange = action.payload;
      ordersSlice.caseReducers.applyFilters(state);
    },

    // Définir le filtre de client
    setCustomerFilter: (state, action) => {
      state.filters.customerId = action.payload;
      ordersSlice.caseReducers.applyFilters(state);
    },

    // Définir le terme de recherche
    setSearchTerm: (state, action) => {
      state.filters.searchTerm = action.payload;
      ordersSlice.caseReducers.applyFilters(state);
    },

    // Réinitialiser tous les filtres
    resetFilters: (state) => {
      state.filters = {
        status: 'all',
        dateRange: null,
        customerId: null,
        searchTerm: ''
      };
      state.filteredOrders = state.orders;
    },

    // Appliquer les filtres
    applyFilters: (state) => {
      let filtered = [...state.orders];

      // Filtre par statut
      if (state.filters.status !== 'all') {
        filtered = filtered.filter(order => order.status === state.filters.status);
      }

      // Filtre par client
      if (state.filters.customerId) {
        filtered = filtered.filter(order => order.customerId === state.filters.customerId);
      }

      // Filtre par plage de dates
      if (state.filters.dateRange) {
        const { start, end } = state.filters.dateRange;
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= new Date(start) && orderDate <= new Date(end);
        });
      }

      // Filtre par recherche
      if (state.filters.searchTerm) {
        const term = state.filters.searchTerm.toLowerCase();
        filtered = filtered.filter(order =>
          order.orderNumber.toLowerCase().includes(term) ||
          order.customerName.toLowerCase().includes(term) ||
          order.customerId.toLowerCase().includes(term)
        );
      }

      state.filteredOrders = filtered;
    },

    // Mettre à jour les statistiques
    updateStats: (state) => {
      state.stats = {
        totalOrders: state.orders.length,
        totalRevenue: state.orders.reduce((sum, order) => sum + order.totalAmount, 0),
        pendingOrders: state.orders.filter(o => o.status === 'pending').length,
        processingOrders: state.orders.filter(o => o.status === 'processing').length,
        shippedOrders: state.orders.filter(o => o.status === 'shipped').length,
        deliveredOrders: state.orders.filter(o => o.status === 'delivered').length
      };
    },

    // Trier les commandes
    sortOrders: (state, action) => {
      const { field, direction } = action.payload;
      state.filteredOrders.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];

        if (field === 'orderDate') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }

        if (direction === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }
  }
});

export const {
  selectOrder,
  deselectOrder,
  addOrder,
  updateOrderStatus,
  updateOrder,
  deleteOrder,
  setStatusFilter,
  setDateRangeFilter,
  setCustomerFilter,
  setSearchTerm,
  resetFilters,
  applyFilters,
  sortOrders
} = ordersSlice.actions;



export default ordersSlice.reducer;