export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 bg-green-700 text-white">
      <h1 className="text-2xl font-bold">VeggieVault</h1>
      <ul className="hidden md:flex space-x-8">
        <li><a href="#" className="hover:text-green-300">Home</a></li>
        <li><a href="products" className="hover:text-green-300">Products</a></li>
        <li><a href="#" className="hover:text-green-300">How It Works</a></li>
      </ul>
      <button className="bg-white text-green-700 px-4 py-2 rounded-xl font-semibold hover:bg-green-100">
        Login / Register
      </button>
    </nav>
  );
}
