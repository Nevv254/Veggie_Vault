import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import Navbar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import MiniCart from "../components/MiniCart";

export default function Products() {
  const { user } = useAuth();
  const [allProducts, setAllProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAllProducts(products);
      }
    );

    return unsubscribe;
  }, []);

  // Filter products by search and category
  const filteredProducts = allProducts.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) &&
    (category === "" || p.category === category)
  );

  // Add product to cart OR increase quantity if exists
  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Increase quantity
  const increaseQuantity = (productId) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Decrease quantity or remove if 0
  const decreaseQuantity = (productId) => {
    setCartItems(prev =>
      prev
        .map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // Checkout function
  const handleCheckout = async () => {
    if (cartItems.length === 0 || !user) return;

    try {
      const orderData = {
        vendorId: user.uid,
        items: cartItems,
        totalAmount: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        createdAt: new Date()
      };

      await addDoc(collection(db, 'orders'), orderData);
      setCartItems([]);
      alert('Order placed successfully!');
    } catch (error) {
      console.error("Error placing order:", error);
      alert('Error placing order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with Cart Count */}
      <Navbar
        cartCount={cartItems.reduce((total, item) => total + item.quantity, 0)}
        onCartClick={() => setShowCart(true)}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Bulk Produce Listings</h1>
        
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl p-3"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-xl p-3"
          >
            <option value="">All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
          </select>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={setSelectedProduct}
            />
          ))}
        </div>

        {/* Checkout Section */}
        {cartItems.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>
            <div className="space-y-2 mb-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>Ksh {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 flex justify-between items-center">
              <span className="text-xl font-bold">
                Total: Ksh {cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
              </span>
              <button
                onClick={handleCheckout}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Quantity Control */}
      {showCart && (
        <MiniCart
          cartItems={cartItems}
          onClose={() => setShowCart(false)}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
        />
      )}
    </div>
  );
}
