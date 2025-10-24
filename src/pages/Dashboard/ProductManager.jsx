import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addProduct, updateProduct, removeProduct } from "../../features/products/productsSlice";

export default function ProductManager() {
  const { products } = useSelector(state => state.products);
  const categories = useSelector(state => state.categories.categories);
  const dispatch = useDispatch();

  const [form, setForm] = useState({ name: "", price: "", category: "", subcategory: "", description: "" });
  const [editId, setEditId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price) };
    if (editId) {
      dispatch(updateProduct({ id: editId, data: payload }));
      setEditId(null);
    } else {
      dispatch(addProduct(payload));
    }
    setForm({ name: "", price: "", category: "", subcategory: "", description: "" });
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, price: p.price, category: p.category, subcategory: p.subcategory || "", description: p.description || "" });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">{editId ? "Modifier produit" : "Ajouter produit"}</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Nom" className="border px-3 py-2 rounded" required />
          <input value={form.price} onChange={e=>setForm({...form, price:e.target.value})} placeholder="Prix" className="border px-3 py-2 rounded" required />
          <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})} className="border px-3 py-2 rounded">
            <option value="">Choisir catégorie</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
          <input value={form.subcategory} onChange={e=>setForm({...form, subcategory:e.target.value})} placeholder="Sous-catégorie (optionnel)" className="border px-3 py-2 rounded" />
          <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} placeholder="Description" className="border px-3 py-2 rounded md:col-span-2" />
          <div className="md:col-span-2 flex gap-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded">{editId ? "Enregistrer" : "Ajouter"}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: "", price: "", category: "", subcategory: "", description: "" }); }} className="px-4 py-2 border rounded">Annuler</button>}
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Liste des produits</h2>
        <div className="space-y-3">
          {products.map(p => (
            <div key={p.id} className="flex items-center justify-between border-b py-2">
              <div>
                <div className="font-medium">{p.name} <span className="text-sm text-gray-500">({p.category}{p.subcategory ? ` / ${p.subcategory}` : ""})</span></div>
                <div className="text-sm text-gray-600">{p.price} €</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="px-3 py-1 border rounded">Edit</button>
                <button onClick={() => dispatch(removeProduct(p.id))} className="px-3 py-1 text-red-600 border rounded">Suppr</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
