import { CartProvider } from '@/hooks/useCart';
import { Header } from '@/sections/Header';
import { Footer } from '@/sections/Footer';

export default function PoliticaTrocas() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <main className="py-32 text-center">
          <h1 className="font-display text-5xl text-[#00843D]">TROCAS E DEVOLUÇÕES</h1>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}
