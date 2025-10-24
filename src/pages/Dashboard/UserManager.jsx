import React from "react";
import usersData from "../../data/users";

export default function UserManager() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold mb-3">Utilisateurs (simulés)</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="text-left">
            <th className="px-2 py-2">ID</th>
            <th className="px-2 py-2">Nom</th>
            <th className="px-2 py-2">Email</th>
            <th className="px-2 py-2">Rôle</th>
          </tr>
        </thead>
        <tbody>
          {usersData.map(u => (
            <tr key={u.id} className="border-t">
              <td className="px-2 py-2">{u.id}</td>
              <td className="px-2 py-2">{u.name}</td>
              <td className="px-2 py-2">{u.email}</td>
              <td className="px-2 py-2">{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-gray-500 mt-3">Note: CRUD utilisateurs non-implémenté (simulé).</p>
    </div>
  );
}
