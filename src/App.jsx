import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/HomePage";
import Products from "./pages/Products";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Products Page */}
        <Route path="/products" element={<Products />} />
      </Routes>
    </Router>
  );
}
