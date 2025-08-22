export default function HowItWorks() {
  const steps = [
    { title: "Farmers List Bulk Produce", desc: "Post harvests like 50kg tomatoes, 100kg maize, and more." },
    { title: "Vendors Buy Wholesale", desc: "Browse, compare, and purchase directly from farmers." },
    { title: "Save & Scale", desc: "Lower costs, reduce waste, and grow your business sustainably." },
  ];

  return (
    <section className="py-16 px-6 text-center">
      <h2 className="text-3xl font-bold mb-10">How It Works</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <div key={i} className="p-6 bg-white shadow-lg rounded-2xl">
            <h3 className="text-xl font-semibold mb-4 text-green-700">{step.title}</h3>
            <p className="text-gray-600">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
