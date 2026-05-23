import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Services from "@/components/Services";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Offers from "@/components/Offers";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import ScrollProgress from "@/components/ScrollProgress";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
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
        <AvailabilityCalendar />
        <Booking />
      </main>
      <Footer />
      <ChatWidget />
      <PWAInstallPrompt />
    </div>
  );
}
