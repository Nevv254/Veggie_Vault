
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
     
      <Hero />
      <Stats />
      <HowItWorks />
      <Footer />
    </div>
  );
}
