import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { CartProvider } from '@/hooks/useCart';
import { MercadoPagoProvider } from '@/components/MercadoPagoProvider';
import { Header } from '@/sections/Header';
import { Hero } from '@/sections/Hero';
import { SocialProof } from '@/sections/SocialProof';
import { FeaturedProducts } from '@/sections/FeaturedProducts';
import { VideoShowcase } from '@/sections/VideoShowcase';
import { Customization } from '@/sections/Customization';
import { Values } from '@/sections/Values';
import { Testimonials } from '@/sections/Testimonials';
import { Catalog } from '@/sections/Catalog';
import { FAQ } from '@/sections/FAQ';
import { Newsletter } from '@/sections/Newsletter';
import { Footer } from '@/sections/Footer';
import './App.css';

function App() {
  useEffect(() => {
    // Smooth scroll polyfill for older browsers
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <MercadoPagoProvider>
      <CartProvider>
        <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Hero />
          <SocialProof />
          <FeaturedProducts />
          <VideoShowcase />
          <Customization />
          <Values />
          <Testimonials />
          <Catalog />
          <FAQ />
          <Newsletter />
        </main>
        <Footer />
          <Toaster position="bottom-right" richColors />
        </div>
      </CartProvider>
    </MercadoPagoProvider>
  );
}

export default App;
