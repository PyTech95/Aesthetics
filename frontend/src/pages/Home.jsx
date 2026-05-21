import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Offers from "@/components/Offers";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ScrollProgress from "@/components/ScrollProgress";
import { useReveal } from "@/lib/hooks";

export default function Home() {
  const ref = useReveal();
  return (
    <div ref={ref} className="min-h-screen bg-[#FAF9F6] text-[#2C2A29]">
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Gallery />
        <Testimonials />
        <Offers />
        <Booking />
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
