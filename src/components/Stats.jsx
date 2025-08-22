export default function Stats() {
  const stats = [
    { label: "Vendors", value: "500+" },
    { label: "Farmers", value: "300+" },
    { label: "Kg of Produce Sold", value: "10,000+" },
  ];

  return (
    <section className="grid md:grid-cols-3 gap-6 text-center py-12 bg-gray-100">
      {stats.map((stat, i) => (
        <div key={i} className="p-6 bg-white shadow-md rounded-2xl">
          <h3 className="text-3xl font-bold text-green-700">{stat.value}</h3>
          <p className="text-gray-600">{stat.label}</p>
        </div>
      ))}
    </section>
  );
}
