import { motion, AnimatePresence } from "framer-motion";

export default function ProductModal({ product, onClose }) {
  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full mx-4 z-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-3xl"
            >
              &times;
            </button>

            {/* Product Image */}
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover rounded-xl mb-4"
            />

            {/* Product Info */}
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-green-700 font-bold text-lg mb-2">{product.price} / kg</p>
            <p className="text-gray-500 mb-4">Minimum Order: {product.minQty} kg</p>
            <p className="text-gray-700 mb-6">
              Fresh, organic, and sustainably farmed produce directly from farmers.
            </p>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="bg-green-700 text-white px-6 py-2 rounded-xl hover:bg-green-800"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
