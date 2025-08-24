import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function MiniCart({ cartItems, onClose, onIncrease, onDecrease }) {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl p-6 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">My Cart</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">Cart is empty</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} className="flex justify-between items-center mb-4 border-b pb-2">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
              <div className="flex-1 ml-3">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-500">Ksh {item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onDecrease(item.id)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >-</button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => onIncrease(item.id)}
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >+</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-4">
        <p className="font-bold text-lg mb-2">Total: Ksh {totalPrice}</p>
        <button className="w-full bg-green-700 text-white py-2 rounded-xl hover:bg-green-800 transition">
          Checkout
        </button>
      </div>
    </motion.div>
  );
}
