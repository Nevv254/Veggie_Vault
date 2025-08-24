export default function ProductModal({ product, onClose }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
        </button>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover rounded-xl mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-green-700 font-bold text-lg mb-2">{product.price} / kg</p>
        <p className="text-gray-500 mb-4">Minimum Order: {product.minQty} kg</p>
        <p className="text-gray-700 mb-4">
          Fresh, organic, and sustainably farmed produce directly from farmers.
        </p>
        <button
          onClick={onClose}
          className="bg-green-700 text-white px-6 py-2 rounded-xl hover:bg-green-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}
