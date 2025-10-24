import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  return (
    <div className="bg-white/50 border rounded-lg p-4 shadow hover:shadow-md transition">
      <div className="h-40 bg-gray-100 rounded mb-3 flex items-center justify-center">Image</div>
      <Link to={`/product/${product.id}`}>
        <h3 className="text-lg font-semibold">{product.name}</h3>
      </Link>
      <p className="text-sm text-gray-500">{product.category} {product.subcategory ? `— ${product.subcategory}` : ""}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xl font-bold">{product.price} €</div>
        <button onClick={() => dispatch(addToCart(product))} className="bg-blue-600 text-white px-3 py-1 rounded">Ajouter</button>
      </div>
    </div>
  );
}
