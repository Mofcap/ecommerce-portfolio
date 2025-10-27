import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../components/ProductCard";
import CategoryMenu from "../components/CategoryMenu";
import { searchProducts, resetFilter } from "../features/products/productsSlice";

export default function Home() {
  const { filtered } = useSelector(state => state.products);
  const dispatch = useDispatch();
  const [q, setQ] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!q.trim()) dispatch(resetFilter());
    else dispatch(searchProducts(q.trim()));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="md:col-span-1 space-y-4">
        
        <div className="bg-white/50 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Recherche</h3>
          <form onSubmit={handleSearch} className="flex gap-1 w-full">
  <input 
    value={q} 
    onChange={e=>setQ(e.target.value)} 
    placeholder="Rechercher..." 
    className="flex-1 min-w-0 border px-3 py-2 rounded" 
  />
  <button className="bg-blue-600 text-white px-3 py-2 rounded flex-shrink-0">
    Go
  </button>
</form>
        </div>
        <CategoryMenu />
      </aside>

      <section className="md:col-span-3">
        
        <h1 className="text-2xl font-bold mb-4">Nos Produits</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
