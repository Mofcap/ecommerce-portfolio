import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const product = useSelector(state => state.products.products.find(p => String(p.id) === id));
  const dispatch = useDispatch();

  if (!product) return <div>Produit introuvable</div>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-100 h-64 flex items-center justify-center rounded">Image</div>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-500">{product.category} {product.subcategory ? `— ${product.subcategory}` : ""}</p>
          <p className="text-2xl font-semibold mt-4">{product.price} €</p>
          <p className="mt-4 text-gray-700">{product.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <button onClick={() => dispatch(addToCart(product))} className="bg-blue-600 text-white px-4 py-2 rounded">Ajouter au panier</button>
          </div>
        </div>
      </div>
    </div>
  );
}
