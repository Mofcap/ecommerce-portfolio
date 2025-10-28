import React, { useState } from "react";
import ProductManager from "./ProductManager";
import CategoryManager from "./CategoryManager";
import UserManager from "./UserManager";
import StockManager from "./StockManager";
import OrdersManager from "./OrdersManeger";

export default function AdminDashboard() {
  const [tab, setTab] = useState("products");

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <div className="flex gap-3 mb-6">
        <button onClick={() => setTab("products")} className={`px-4 py-2 rounded ${tab==="products" ? "bg-blue-600 text-white" : "bg-white border"}`}>Produits</button>
        <button onClick={() => setTab("orders")} className={`px-4 py-2 rounded ${tab==="orders" ? "bg-blue-600 text-white" : "bg-white border"}`}>Orders</button>
        <button onClick={() => setTab("stock")} className={`px-4 py-2 rounded ${tab==="stock" ? "bg-blue-600 text-white" : "bg-white border"}`}>📦 Gestion Stock</button>
        <button onClick={() => setTab("categories")} className={`px-4 py-2 rounded ${tab==="categories" ? "bg-blue-600 text-white" : "bg-white border"}`}>Catégories</button>
        <button onClick={() => setTab("users")} className={`px-4 py-2 rounded ${tab==="users" ? "bg-blue-600 text-white" : "bg-white border"}`}>Utilisateurs</button>
        

      </div>

      <div>
        {tab === "products" && <ProductManager />}
        {tab === "orders" && <OrdersManager />}
        {tab === "stock" && <StockManager />}
        {tab === "categories" && <CategoryManager />}
        {tab === "users" && <UserManager />}
      </div>
    </div>
  );
}
