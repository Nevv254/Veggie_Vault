import { ShoppingCart, User, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";

export default function Navbar({ cartCount, onCartClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userRole, logout, updateUserRole } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

          {/* User Account Dropdown - Only show if user is authenticated */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <User className="w-5 h-5 text-gray-600" />
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    <p className="text-xs text-gray-500 capitalize">Role: {userRole}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        updateUserRole('farmer');
                        navigate('/farmer-dashboard');
                        setShowDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition ${
                        userRole === 'farmer' ? 'bg-green-50 text-green-700' : 'text-gray-700'
                      }`}
                    >
                      Farmer Dashboard
                    </button>

                    <button
                      onClick={() => {
                        updateUserRole('vendor');
                        navigate('/vendor-dashboard');
                        setShowDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 transition ${
                        userRole === 'vendor' ? 'bg-green-50 text-green-700' : 'text-gray-700'
                      }`}
                    >
                       Vendor Dashboard
                    </button>
                  </div>

                  <div className="border-t border-gray-200">
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
