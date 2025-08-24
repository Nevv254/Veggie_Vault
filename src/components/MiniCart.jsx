import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function MiniCart({ isOpen, onClose, cart, onRemove }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Your Cart</h2>
              <button onClick={onClose}>
                <X className="w-6 h-6 text-gray-500 hover:text-gray-800" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center">Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex items-center justify-between border p-2 rounded-lg shadow-sm">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-green-700">{item.price}</p>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)} 
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Checkout Button */}
            {cart.length > 0 && (
              <div className="p-4 border-t">
                <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
