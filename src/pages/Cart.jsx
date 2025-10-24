import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, increaseQty, decreaseQty, clearCart } from "../features/cart/cartSlice";

export default function Cart() {
  const { items } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const total = items.reduce((s, i) => s + (i.price * (i.qty || 1)), 0);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Votre panier</h1>

      {items.length === 0 ? (
        <p className="text-gray-600">Votre panier est vide.</p>
      ) : (
        <>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{(item.price * item.qty).toFixed(2)} €</p>
                  <div className="mt-2 flex gap-2 items-center">
                    <button onClick={() => dispatch(decreaseQty(item.id))} className="px-2 py-1 border rounded">-</button>
                    <span className="px-3">{item.qty}</span>
                    <button onClick={() => dispatch(increaseQty(item.id))} className="px-2 py-1 border rounded">+</button>
                    <button onClick={() => dispatch(removeFromCart(item.id))} className="text-red-600">Suppr</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div>
              <button onClick={() => dispatch(clearCart())} className="text-sm text-red-600">Vider le panier</button>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Total</p>
              <p className="text-2xl font-bold">{total.toFixed(2)} €</p>
              <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded">Checkout (simulé)</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
