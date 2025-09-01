import { ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar({ cartCount, onCartClick }) {
  const location = useLocation();
  const { user, userRole, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-40">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-700 hover:text-green-800 transition">
          VeggieVault
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className={`font-semibold transition ${
              location.pathname === "/" ? "text-green-700" : "text-gray-600 hover:text-green-700"
            }`}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`font-semibold transition ${
              location.pathname === "/products" ? "text-green-700" : "text-gray-600 hover:text-green-700"
            }`}
          >
            Products
          </Link>

          {/* Role-based Dashboard Links */}
          {user && userRole === 'farmer' && (
            <Link
              to="/farmer-dashboard"
              className={`font-semibold transition ${
                location.pathname === "/farmer-dashboard" ? "text-green-700" : "text-gray-600 hover:text-green-700"
              }`}
            >
              Farmer Dashboard
            </Link>
          )}

          {user && userRole === 'vendor' && (
            <Link
              to="/vendor-dashboard"
              className={`font-semibold transition ${
                location.pathname === "/vendor-dashboard" ? "text-green-700" : "text-gray-600 hover:text-green-700"
              }`}
            >
              Vendor Dashboard
            </Link>
          )}

          {/* Authentication Links */}
          {user ? (
            <button
              onClick={logout}
              className="font-semibold text-gray-600 hover:text-green-700 transition"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className={`font-semibold transition ${
                  location.pathname === "/login" ? "text-green-700" : "text-gray-600 hover:text-green-700"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Register
              </Link>
            </div>
          )}

          {/* Cart Icon - Only show if onCartClick is provided */}
          {onCartClick && (
            <div className="relative">
              <button
                onClick={onCartClick}
                className="p-3 rounded-full bg-green-600 hover:bg-green-700 transition shadow-lg"
              >
                <ShoppingCart className="text-white w-6 h-6" />
              </button>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                  {cartCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
