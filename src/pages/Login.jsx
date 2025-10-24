import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import usersData from "../data/users";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = usersData.find(u => u.email === email && u.password === password);
    if (!user) {
      setErr("Email ou mot de passe invalide");
      return;
    }
    dispatch(login({ id: user.id, name: user.name, email: user.email, role: user.role }));
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Se connecter</h2>
      {err && <div className="bg-red-100 text-red-800 px-3 py-2 rounded mb-3">{err}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" className="w-full border px-3 py-2 rounded" required />
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Mot de passe" className="w-full border px-3 py-2 rounded" required />
        <button className="w-full bg-blue-600 text-white py-2 rounded">Connexion</button>
      </form>
      <p className="mt-4 text-sm text-gray-600">Pour démo: admin@shop.com / 1234 ou user@shop.com / 1234</p>
    </div>
  );
}
