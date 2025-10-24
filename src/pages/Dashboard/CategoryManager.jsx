import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCategory, removeCategory, addSubCategory, removeSubCategory } from "../../features/categories/categoriesSlice";

export default function CategoryManager() {
  const { categories } = useSelector(state => state.categories);
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [subCategoryInput, setSubCategoryInput] = useState({ categoryId: null, value: "" });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name) return;
    dispatch(addCategory({ name }));
    setName("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Ajouter une catégorie</h2>
        <form onSubmit={handleAdd} className="flex gap-2">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom catégorie" className="border px-3 py-2 rounded" />
          <button className="bg-green-600 text-white px-4 py-2 rounded">Ajouter</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Catégories existantes</h2>
        <div className="space-y-4">
          {categories.map(cat => (
            <div key={cat.id} className="border p-3 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{cat.name}</div>
                  <div className="text-sm text-gray-600">Sous-catégories: {cat.subcategories.join(", ") || "—"}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => dispatch(removeCategory(cat.id))} className="px-3 py-1 text-red-600 border rounded">Suppr</button>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <input value={subCategoryInput.categoryId === cat.id ? subCategoryInput.value : ""} onChange={e => setSubCategoryInput({ categoryId: cat.id, value: e.target.value })} placeholder="Ajouter sous-catégorie" className="border px-3 py-2 rounded" />
                <button onClick={() => { if (subCategoryInput.value.trim()) { dispatch(addSubCategory({ categoryId: cat.id, subcategory: subCategoryInput.value.trim() })); setSubCategoryInput({ categoryId: null, value: "" }); } }} className="px-3 py-1 bg-blue-600 text-white rounded">Ajouter</button>
              </div>

              <div className="mt-2 flex gap-2">
                {cat.subcategories.map(s => (
                  <div key={s} className="px-2 py-1 border rounded flex items-center gap-2">
                    <span className="text-sm">{s}</span>
                    <button onClick={() => dispatch(removeSubCategory({ categoryId: cat.id, subcategory: s }))} className="text-red-600 text-xs">x</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
