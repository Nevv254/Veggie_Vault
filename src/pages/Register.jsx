import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { serverTimestamp } from "firebase/firestore";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("vendor");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Save user role to Firestore
      await setDoc(doc(db, 'users', uid), {
        email,
        role,
        createdAt: serverTimestamp(),
      });

      // Redirect to appropriate dashboard based on role
      if (role === "farmer") { 
        navigate("/farmer-dashboard");
      } else {
        navigate("/vendor-dashboard");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg"
            required
          />

          {/* Role Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Choose Your Role</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  checked={role === "farmer"}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <span className="mr-2"></span>
                  <div>
                    <div className="font-medium">Farmer</div>
                    <div className="text-sm text-gray-500">Add and manage your products</div>
                  </div>
                </div>
              </label>

              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="vendor"
                  checked={role === "vendor"}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-3"
                />
                <div className="flex items-center">
                  <span className="mr-2"></span>
                  <div>
                    <div className="font-medium">Vendor</div>
                    <div className="text-sm text-gray-500">Browse and purchase products</div>
                  </div>
                </div>
              </label>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
        <p className="text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 font-bold">Login</a>
        </p>
      </div>
    </div>
  );
}
