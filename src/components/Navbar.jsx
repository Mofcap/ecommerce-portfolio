import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { FaShoppingCart } from "react-icons/fa";

export default function Navbar() {
  const { items } = useSelector(state => state.cart);
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer tout le localStorage
    localStorage.clear();
    
   
    dispatch(logout());
    navigate("/");
};

  return (
    <nav className="bg-white/50 shadow">
      <div className="container px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-bold text-blue-600">ShopReact</Link>
          <Link to="/" className="text-sm text-gray-600">Produits</Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            <FaShoppingCart size={20} />
            {items.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full">
                {items.length}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <>
              {user.role === "admin" && <Link to="/admin" className="text-sm">Admin</Link>}
              <button onClick={handleLogout} className="text-sm text-gray-700">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm">Login</Link>
              <Link to="/register" className="text-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
