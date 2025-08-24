import { useState } from "react";
import Navbar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";

export default function Products() {
  const allProducts = [
    { id: 1, name: "Tomatoes", price: "Ksh 50", minQty: 50, image: "src/assets/tomatoes.webp" },
    { id: 2, name: "Maize", price: "Ksh 35", minQty: 100, image: "src/assets/maize.jpg" },
    { id: 3, name: "Eggs", price: "Ksh 300", minQty: 200, image: "src/assets/eggs.jpg" },
  ];

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  const filteredProducts = allProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddToCart = (product) => {
    setCart((prev) => [...prev, product]);
    console.log("Cart Updated:", [...cart, product]); // Test log
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Bulk Produce Listings</h1>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-xl p-3 mb-8"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={setSelectedProduct}
            />
          ))}
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart} // Pass to modal
      />
    </div>
  );
}
