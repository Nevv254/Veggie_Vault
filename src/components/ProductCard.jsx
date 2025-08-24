export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 text-center hover:shadow-lg transition">
      <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-xl mb-4" />
      <h3 className="text-xl font-semibold">{product.name}</h3>
      <p className="text-green-700 font-bold">{product.price} / kg</p>
      <p className="text-gray-500 text-sm">Min Order: {product.minQty} kg</p>
      <button className="mt-3 bg-green-700 text-white px-4 py-2 rounded-xl hover:bg-green-800">
        View Details
      </button>
    </div>
  );
}
