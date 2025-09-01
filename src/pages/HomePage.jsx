import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import apples from "../assets/apples-plastic-crate-harvesting-fruit-garden-autumn-red-apple-from-organic-farm_116317-20341.avif";
import tomatoes from "../assets/tomatoes.webp";
import maize from "../assets/maize.jpg";
import eggs from "../assets/eggs.jpg";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-green-700 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-20">
          { }
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left md:w-1/2"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Fresh Farm Produce, <span className="text-yellow-300">Bulk & Affordable</span>
            </h1>
            <p className="text-lg text-gray-100 mb-6">
              Connect directly with farmers, buy in bulk, and enjoy the freshest produce at unbeatable prices.
            </p>
            <Link
              to="/products"
              className="bg-yellow-400 text-green-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-500 transition"
            >
              Browse Products
            </Link>
          </motion.div>

          {/* Right Image */}
          <motion.img
            src={apples}
            alt="Fresh Vegetables"
            className="rounded-2xl shadow-2xl mt-10 md:mt-0 md:w-1/2"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Trending Produce</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { id: 1, name: "Tomatoes", img: tomatoes },
            { id: 2, name: "Maize", img: maize },
            { id: 3, name: "Eggs", img: eggs },
          ].map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition"
            >
              <img src={item.img} alt={item.name} className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <Link
                  to="/products"
                  className="text-green-700 font-semibold hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-100 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Are You a Farmer?</h2>
        <p className="text-gray-600 mb-6">
          Join VeggieVault and start selling your produce directly to vendors.
        </p>
        <Link
          to="/signup"
          className="bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition"
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-gray-300 text-center py-6 mt-10">
        © {new Date().getFullYear()} VeggieVault. All rights reserved.
      </footer>
    </div>
  );
}
