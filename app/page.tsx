import Benefits from "@/components/landing/benefits";
import CartDrawer from "@/components/landing/CartDrawer";
import { CartProvider } from "@/components/landing/CartProvider";
import DealerSection from "@/components/landing/DealerSection";
import FAQ from "@/components/landing/FAQ";
import Feedback from "@/components/landing/Feedback";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/header";
import Hero from "@/components/landing/hero";
import MobileActionBar from "@/components/landing/MobileActionBar";
import OrderForm from "@/components/landing/OrderForm";
import Pricing from "@/components/landing/pricing";
import VideoSection from "@/components/landing/videoSection";

export default function Home() {
  return (
    <CartProvider>
      <main className="min-h-screen bg-white text-[#071027]">
        <Header />
        <Hero />
        <Pricing />
        <VideoSection />
        <Benefits />
        <DealerSection />
        <Feedback />
        <FAQ />
        <OrderForm />
        <Footer />
        <MobileActionBar />
        <CartDrawer />
      </main>
    </CartProvider>
  );
}
