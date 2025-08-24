import { ShoppingCart } from "lucide-react";

export default function Navbar({ cartCount, onCartClick }) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-40">
      <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-green-700">VeggieVault</h1>

        {/* Floating Cart Icon */}
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
      </div>
    </nav>
  );
}
