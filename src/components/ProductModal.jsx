import { motion, AnimatePresence } from "framer-motion";

export default function ProductModal({ product, onClose, onAddToCart }) {
  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background Overlay with Glass Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl max-w-lg w-full mx-4 z-10 border border-gray-200"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-3xl"
            >
              &times;
            </button>

            {/* Product Image with Hover Tilt */}
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-56 object-cover rounded-xl mb-4 shadow-lg"
              whileHover={{ scale: 1.03, rotateZ: 0.5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />

            {/* Product Info */}
            <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
            <p className="text-green-700 font-bold text-lg mb-2">{product.price} / kg</p>
            <p className="text-gray-500 mb-4">Minimum Order: {product.minQty} kg</p>
            <p className="text-gray-700 mb-6">
              Fresh, organic, and sustainably farmed produce directly from farmers.
            </p>

            {/* Action Buttons */}
            <div className="flex justify-between items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-400 transition"
              >
                Close
              </button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="flex-1 bg-green-700 text-white px-6 py-2 rounded-xl hover:bg-green-800 shadow-md"
              >
                Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
