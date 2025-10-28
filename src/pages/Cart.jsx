import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, increaseQty, decreaseQty, clearCart } from "../features/cart/cartSlice";
import { addOrder } from "../features/orders/ordersSlice";

export default function Cart() {
  const { items } = useSelector(state => state.cart);
  const user = useSelector(state => state.auth?.user);
  const dispatch = useDispatch();
  
  const total = items.reduce((s, i) => s + (i.price * (i.qty || 1)), 0);

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Votre panier est vide !');
      return;
    }

    // Générer un numéro de commande unique
    const orderNumber = `ORD-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999) + 1).padStart(3, '0')}`;
    
    // Générer un ID client unique
    const customerId = user?.id || `CUST-${String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')}`;
    const customerName = user?.name || 'Client Invité';

    // Créer la nouvelle commande
    const newOrder = {
      orderNumber: orderNumber,
      customerId: customerId,
      customerName: customerName,
      status: 'pending', // Statut en attente
      totalAmount: total,
      items: items.map(item => ({
        productId: item.id,
        quantity: item.qty || 1,
        unitPrice: item.price
      }))
    };

    // Ajouter la commande
    dispatch(addOrder(newOrder));
    
    // Vider le panier
    dispatch(clearCart());

    // Notification de succès
    alert(`✅ Commande ${orderNumber} créée avec succès !\n\nStatut: En attente\nMontant: ${total.toFixed(2)}€\n\nVous pouvez voir votre commande dans la section "Commandes".`);
  };

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
                    <button 
                      onClick={() => dispatch(decreaseQty(item.id))} 
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3">{item.qty}</span>
                    <button 
                      onClick={() => dispatch(increaseQty(item.id))} 
                      className="px-2 py-1 border rounded hover:bg-gray-100"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => dispatch(removeFromCart(item.id))} 
                      className="text-red-600 hover:text-red-800 ml-2"
                    >
                      Suppr
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div>
              <button 
                onClick={() => dispatch(clearCart())} 
                className="text-sm text-red-600 hover:text-red-800"
              >
                Vider le panier
              </button>
            </div>
            <div className="text-right">
              <p className="text-gray-500">Total</p>
              <p className="text-2xl font-bold">{total.toFixed(2)} €</p>
              <button 
                onClick={handleCheckout}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Passer la commande
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}