import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { Plus, Edit, Trash2, Package } from "lucide-react";
import Navbar from "../components/NavBar";

export default function FarmerDashboard() {
  const { user, userRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    minQty: "",
    image: ""
  });

  useEffect(() => {
    if (user && userRole === 'farmer') {
      // Real-time listener for farmer's products
      const unsubscribeProducts = onSnapshot(
        collection(db, 'products'),
        (snapshot) => {
          const farmerProducts = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(product => product.farmerId === user.uid);
          setProducts(farmerProducts);
        }
      );

      // Fetch orders for farmer
      const unsubscribeOrders = onSnapshot(
        collection(db, 'orders'),
        (snapshot) => {
          const allOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const farmerOrders = allOrders.filter(order =>
            order.items && order.items.some(item => item.farmerId === user.uid)
          );
          setOrders(farmerOrders);
        }
      );

      return () => {
        unsubscribeProducts();
        unsubscribeOrders();
      };
    }
  }, [user, userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        farmerId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
        setEditingProduct(null);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }

      setFormData({ name: "", price: "", stock: "", minQty: "", image: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      minQty: product.minQty,
      image: product.image
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, 'products', productId));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      await updateDoc(doc(db, 'products', productId), {
        stock: parseInt(newStock),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  if (userRole !== 'farmer') {
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Farmer Dashboard</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

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
            My Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold ${
              activeTab === 'orders'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Orders Received ({orders.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-md p-6">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-green-600 font-bold mb-2">Ksh {product.price}</p>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock: {product.stock}
                  </label>
                  <input
                    type="number"
                    value={product.stock}
                    onChange={(e) => updateStock(product.id, e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    min="0"
                  />
                </div>

                <p className="text-gray-600 text-sm mb-4">Min Order: {product.minQty}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Orders Received</h2>

            {orders.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No orders received yet</p>
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
                    {order.items.filter(item => item.farmerId === user.uid).map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span>{item.name} × {item.quantity}</span>
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

        {/* Add/Edit Product Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h2 className="text-2xl font-bold mb-4">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />

                <input
                  type="number"
                  placeholder="Price (Ksh)"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />

                <input
                  type="number"
                  placeholder="Stock Quantity"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />

                <input
                  type="number"
                  placeholder="Minimum Order Quantity"
                  value={formData.minQty}
                  onChange={(e) => setFormData({...formData, minQty: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />

                <input
                  type="url"
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    {editingProduct ? 'Update' : 'Add'} Product
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditingProduct(null);
                      setFormData({ name: "", price: "", stock: "", minQty: "", image: "" });
                    }}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}