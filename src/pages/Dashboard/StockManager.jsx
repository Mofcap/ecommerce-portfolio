import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addStock,
  removeStock,
  recordSale,
} from "../../features/products/productsSlice";

export default function StockManager() {
  const dispatch = useDispatch();
  
  // Récupération depuis le state Redux
  const { products, stats } = useSelector(state => state.products);
  
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [operation, setOperation] = useState("add");
  const [filter, setFilter] = useState("all");

  // Calcul des produits avec stock faible et en rupture
  const lowStockProducts = products.filter(p => 
    (p.stockQuantity || 0) <= (p.minStockAlert || 10) && (p.stockQuantity || 0) > 0
  );
  
  const outOfStockProducts = products.filter(p => (p.stockQuantity || 0) === 0);

  // Calcul des stats par catégorie
  const categoryStats = React.useMemo(() => {
    const categories = {};
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = {
          category: product.category,
          totalStock: 0,
          totalSold: 0,
          totalValue: 0,
          productCount: 0
        };
      }
      categories[product.category].totalStock += product.stockQuantity || 0;
      categories[product.category].totalSold += product.soldQuantity || 0;
      categories[product.category].totalValue += (product.stockQuantity || 0) * (product.price || 0);
      categories[product.category].productCount++;
    });
    return Object.values(categories);
  }, [products]);

  // Filtrer les produits selon le filtre sélectionné
  const filteredProducts = filter === "all" 
    ? products 
    : filter === "low"
    ? lowStockProducts
    : outOfStockProducts;

  // Gérer l'ajout/retrait de stock ou vente
  const handleStockOperation = () => {
    if (!selectedProduct || quantity <= 0) return;

    switch (operation) {
      case "add":
        dispatch(addStock({ productId: selectedProduct.id, quantity: parseInt(quantity) }));
        break;
      case "remove":
        dispatch(removeStock({ productId: selectedProduct.id, quantity: parseInt(quantity) }));
        break;
      case "sale":
        dispatch(recordSale({ productId: selectedProduct.id, quantity: parseInt(quantity) }));
        break;
      default:
        break;
    }

    setSelectedProduct(null);
    setQuantity(0);
  };

  // Obtenir le statut du stock
  const getStockStatus = (product) => {
    const stock = product.stockQuantity || 0;
    const alert = product.minStockAlert || 10;
    
    if (stock === 0) return { text: "Rupture", color: "bg-red-100 text-red-800" };
    if (stock <= alert) return { text: "Faible", color: "bg-orange-100 text-orange-800" };
    return { text: "Normal", color: "bg-green-100 text-green-800" };
  };

  return (
    <div className="space-y-6">
      {/* STATISTIQUES GLOBALES */}
     
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-sm font-medium text-blue-800 mb-1">Stock Total</h3>
          <p className="text-2xl font-bold text-blue-900">{stats?.totalStock || 0}</p>
          <p className="text-xs text-blue-600">unités</p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-sm font-medium text-green-800 mb-1">Ventes Totales</h3>
          <p className="text-2xl font-bold text-green-900">{stats?.totalSold || 0}</p>
          <p className="text-xs text-green-600">unités vendues</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h3 className="text-sm font-medium text-purple-800 mb-1">Valeur du Stock</h3>
          <p className="text-2xl font-bold text-purple-900">{(stats?.totalValue || 0).toLocaleString('fr-FR')}€</p>
          <p className="text-xs text-purple-600">inventaire</p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <h3 className="text-sm font-medium text-orange-800 mb-1">Chiffre d'Affaires</h3>
          <p className="text-2xl font-bold text-orange-900">{(stats?.totalRevenue || 0).toLocaleString('fr-FR')}€</p>
          <p className="text-xs text-orange-600">revenus générés</p>
        </div>
      </div>

      {/* ALERTES */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Alertes Stock</h3>
          <div className="space-y-1 text-sm">
            {outOfStockProducts.length > 0 && (
              <p className="text-red-700">🚫 {outOfStockProducts.length} produit(s) en rupture de stock</p>
            )}
            {lowStockProducts.length > 0 && (
              <p className="text-orange-700">📦 {lowStockProducts.length} produit(s) avec stock faible</p>
            )}
          </div>
        </div>
      )}

      {/* STATISTIQUES PAR CATÉGORIE */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3">Statistiques par Catégorie</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 font-medium">Catégorie</th>
                <th className="text-right p-2 font-medium">Produits</th>
                <th className="text-right p-2 font-medium">Stock</th>
                <th className="text-right p-2 font-medium">Vendus</th>
                <th className="text-right p-2 font-medium">Valeur</th>
              </tr>
            </thead>
            <tbody>
              {categoryStats.map((cat, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2 font-medium">{cat.category}</td>
                  <td className="text-right p-2">{cat.productCount || 0}</td>
                  <td className="text-right p-2">{cat.totalStock || 0}</td>
                  <td className="text-right p-2">{cat.totalSold || 0}</td>
                  <td className="text-right p-2">{(cat.totalValue || 0).toLocaleString('fr-FR')}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OPÉRATIONS SUR LE STOCK */}
      <div className="bg-white border rounded-lg p-4">
        <h3 className="font-semibold text-lg mb-3">Opérations sur le Stock</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={selectedProduct?.id || ""}
            onChange={(e) => setSelectedProduct(products.find(p => p.id === parseInt(e.target.value)))}
            className="border rounded px-3 py-2"
          >
            <option value="">Sélectionner un produit</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (Stock: {p.stockQuantity || 0})
              </option>
            ))}
          </select>

          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="add">Ajouter Stock</option>
            <option value="remove">Retirer Stock</option>
            <option value="sale">Enregistrer Vente</option>
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Quantité"
            className="border rounded px-3 py-2"
          />

          <button
            onClick={handleStockOperation}
            disabled={!selectedProduct || quantity <= 0}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Valider
          </button>
        </div>
      </div>

      {/* LISTE DES PRODUITS */}
      <div className="bg-white border rounded-lg p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg">Liste des Produits</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 text-sm rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-100"}`}
            >
              Tous ({products.length})
            </button>
            <button
              onClick={() => setFilter("low")}
              className={`px-3 py-1 text-sm rounded ${filter === "low" ? "bg-orange-600 text-white" : "bg-gray-100"}`}
            >
              Stock Faible ({lowStockProducts.length})
            </button>
            <button
              onClick={() => setFilter("out")}
              className={`px-3 py-1 text-sm rounded ${filter === "out" ? "bg-red-600 text-white" : "bg-gray-100"}`}
            >
              Rupture ({outOfStockProducts.length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 font-medium">Produit</th>
                <th className="text-left p-2 font-medium">Catégorie</th>
                <th className="text-right p-2 font-medium">Prix</th>
                <th className="text-right p-2 font-medium">Stock</th>
                <th className="text-right p-2 font-medium">Vendus</th>
                <th className="text-center p-2 font-medium">Statut</th>
                <th className="text-right p-2 font-medium">Valeur Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const status = getStockStatus(product);
                const stockValue = (product.stockQuantity || 0) * (product.price || 0);
                return (
                  <tr key={product.id} className="border-t hover:bg-gray-50">
                    <td className="p-2 font-medium">{product.name}</td>
                    <td className="p-2 text-gray-600">{product.category}</td>
                    <td className="text-right p-2">{product.price || 0}€</td>
                    <td className="text-right p-2 font-semibold">{product.stockQuantity || 0}</td>
                    <td className="text-right p-2 text-green-700">{product.soldQuantity || 0}</td>
                    <td className="text-center p-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="text-right p-2 font-medium">
                      {stockValue.toLocaleString('fr-FR')}€
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}