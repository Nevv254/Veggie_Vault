import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, getDocs, onSnapshot, query, where, updateDoc, doc } from "firebase/firestore";
import { ShoppingCart, Package, Truck } from "lucide-react";
import Navbar from "../components/NavBar";
import apples from "../assets/apples.jpeg";
import avocados from "../assets/Avocados.jpg";
import tomatoes from "../assets/tomatoes.webp";
import maize from "../assets/maize.jpg";
import mangoes from "../assets/mangoes.jpg";
import eggs from "../assets/eggs.jpg";

export default function VendorDashboard() {
   const { user, userRole } = useAuth();
   const [products, setProducts] = useState([]);
   const [cart, setCart] = useState([]);
   const [orders, setOrders] = useState([]);
   const [activeTab, setActiveTab] = useState('products');

   // Sample products
   const sampleProducts = [
     {
       id: 'sample-1',
       name: 'Apples',
       price: 50,
       stock: 100,
       minQty: 10,
       image: apples,
       farmerId: 'sample',
       category: 'fruits'
     },
     {
       id: 'sample-2',
       name: 'Avocados',
       price: 80,
       stock: 50,
       minQty: 5,
       image: avocados,
       farmerId: 'sample',
       category: 'fruits'
     },
     {
       id: 'sample-3',
       name: 'Tomatoes',
       price: 30,
       stock: 200,
       minQty: 20,
       image: tomatoes,
       farmerId: 'sample',
       category: 'vegetables'
     },
     {
       id: 'sample-4',
       name: 'Maize',
       price: 40,
       stock: 150,
       minQty: 25,
       image: maize,
       farmerId: 'sample',
       category: 'grains'
     },
     {
       id: 'sample-5',
       name: 'Mangoes',
       price: 60,
       stock: 80,
       minQty: 10,
       image: mangoes,
       farmerId: 'sample',
       category: 'fruits'
     },
     {
       id: 'sample-6',
       name: 'Eggs',
       price: 10,
       stock: 500,
       minQty: 50,
       image: eggs,
       farmerId: 'sample',
       category: 'dairy'
     }
   ];

  useEffect(() => {
    if (user && userRole === 'vendor') {
      // Real-time listener for all products
      const unsubscribeProducts = onSnapshot(
        collection(db, 'products'),
        (snapshot) => {
          const allProducts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          if (allProducts.length === 0) {
            setProducts(sampleProducts);
          } else {
            setProducts(allProducts);
          }
        }
      );

      // Get user's orders
      const fetchOrders = async () => {
        const ordersQuery = query(
          collection(db, 'orders'),
          where('vendorId', '==', user.uid)
        );
        const ordersSnapshot = await getDocs(ordersQuery);
        const userOrders = ordersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setOrders(userOrders);
      };

      fetchOrders();

      return () => unsubscribeProducts();
    }
  }, [user, userRole]);

  const addToCart = (product) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    try {
      const orderData = {
        vendorId: user.uid,
        items: cart,
        totalAmount: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        status: 'pending',
        createdAt: new Date()
      };

      await addDoc(collection(db, 'orders'), orderData);

      // Deduct stock for each item
      for (const item of cart) {
        const productRef = doc(db, 'products', item.id);
        const newStock = item.stock - item.quantity;
        await updateDoc(productRef, { stock: newStock });
      }

      setCart([]);
      alert('Order placed successfully!');
    } catch (error) {
      console.error("Error placing order:", error);
      alert('Error placing order. Please try again.');
    }
  };

  const getTotalAmount = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  if (userRole !== 'vendor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-20 pb-10 px-6">
        <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>

        {/* Tab Navigation */}
        <div className="flex mb-8 border-b">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'products'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Browse Products
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'cart'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Cart ({cart.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'orders'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            My Orders
          </button>
        </div>

        {/* Products Tab */}
         {activeTab === 'products' && (
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-md p-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-green-600 font-bold mb-2">Ksh {product.price}</p>
                <p className="text-gray-600 text-sm mb-2">Stock: {product.stock}</p>
                <p className="text-gray-600 text-sm mb-4">Min Order: {product.minQty}</p>

                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Cart Tab */}
        {activeTab === 'cart' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

            {cart.length === 0 ? (
              <p className="text-gray-600 text-center py-8">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-green-600">Ksh {item.price}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 bg-gray-100 rounded">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">Ksh {item.price * item.quantity}</p>
                        <button
                          onClick={() => updateQuantity(item.id, 0)}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold">Total: Ksh {getTotalAmount()}</span>
                  </div>
                  <button
                    onClick={placeOrder}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold"
                  >
                    Place Order
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Orders</h2>

            {orders.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No orders found</p>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Order #{order.id.slice(-8)}</h3>
                      <p className="text-gray-600">
                        {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">Ksh {order.totalAmount}</p>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <span>{item.name} × {item.quantity}</span>
                            <p className="text-sm text-gray-600">Farmer ID: {item.farmerId}</p>
                          </div>
                        </div>
                        <span>Ksh {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}