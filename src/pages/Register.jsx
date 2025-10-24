import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Compte créé (simulé). Connecte-toi.");
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">S'inscrire</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom" className="w-full border px-3 py-2 rounded" required />
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full border px-3 py-2 rounded" required />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Mot de passe" className="w-full border px-3 py-2 rounded" required />
        <button className="w-full bg-green-600 text-white py-2 rounded">Créer un compte</button>
      </form>
    </div>
  );
}
