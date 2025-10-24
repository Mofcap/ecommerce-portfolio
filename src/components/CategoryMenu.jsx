import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { filterByCategory, resetFilter } from "../features/products/productsSlice";

export default function CategoryMenu() {
  const { categories } = useSelector(state => state.categories);
  const dispatch = useDispatch();

  return (
    <div className="bg-white/50 p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Catégories</h3>
      <div className="flex flex-col gap-2">
        <button onClick={() => dispatch(resetFilter())} className="text-left text-sm">Tous</button>
        {categories.map(c => (
          <button key={c.id} onClick={() => dispatch(filterByCategory(c.name))} className="text-left text-sm">{c.name}</button>
        ))}
      </div>
    </div>
  );
}
