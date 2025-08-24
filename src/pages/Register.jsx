import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("vendor");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), { email, role });
      alert("Account created! Please log in.");
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded mb-4"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded mb-4"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-3 rounded mb-4"
        >
          <option value="farmer">Farmer</option>
          <option value="vendor">Vendor</option>
        </select>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700 transition"
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
