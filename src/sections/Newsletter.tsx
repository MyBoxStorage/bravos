import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Gift, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { apiConfig } from '@/config/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

const COUPON_MODAL_DISMISSED = 'coupon_modal_dismissed';
const COUPON_REDEEMED = 'coupon_redeemed';
const HAS_PURCHASED = 'has_purchased';
const TIME_ON_SITE_BEFORE_POPUP_MS = 180 * 1000; // 3 minutos

async function postSubscribe(email: string) {
  const res = await fetch(`${apiConfig.baseURL}/api/newsletter/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error('Erro ao inscrever');
  return res.json();
}

export function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [exitCouponRevealed, setExitCouponRevealed] = useState(false);
  const hasShownPopup = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (hasShownPopup.current) return;
    if (typeof window === 'undefined') return;

    if (localStorage.getItem(HAS_PURCHASED) === '1') return;
    if (localStorage.getItem(COUPON_REDEEMED) === '1') return;
    if (sessionStorage.getItem(COUPON_MODAL_DISMISSED) === '1') return;

    const timer = setTimeout(() => {
      if (hasShownPopup.current) return;
      if (localStorage.getItem(HAS_PURCHASED) === '1') return;
      if (localStorage.getItem(COUPON_REDEEMED) === '1') return;
      if (sessionStorage.getItem(COUPON_MODAL_DISMISSED) === '1') return;

      hasShownPopup.current = true;
      setShowExitPopup(true);
    }, TIME_ON_SITE_BEFORE_POPUP_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Digite seu e-mail');
      return;
    }

    setLoading(true);
    try {
      await postSubscribe(email);
      setIsSubscribed(true);
      toast.success('🎁 Cupom BEMVINDO10 enviado para seu e-mail!');
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 5000);
    } catch {
      toast.error('Não foi possível enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleExitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Digite seu e-mail');
      return;
    }

    setLoading(true);
    try {
      await postSubscribe(email);
      setExitCouponRevealed(true);
      toast.success('🎁 Cupom BEMVINDO10 enviado para seu e-mail!');
      setEmail('');
      try {
        localStorage.setItem(COUPON_REDEEMED, '1');
      } catch { /* ignore */ }
    } catch {
      toast.error('Não foi possível enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="py-20 bg-gradient-to-br from-[#00843D] via-[#006633] to-[#002776]"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={contentRef} className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#FFCC29] text-[#002776] px-4 py-2 rounded-full font-body text-sm font-bold mb-6">
              <Gift className="w-4 h-4" />
              🎁 10% OFF NA PRIMEIRA COMPRA
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
              RECEBA OFERTAS EXCLUSIVAS
            </h2>
            
            <p className="font-body text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Cadastre-se e receba seu cupom exclusivo de 10% OFF. Não acumulável com outras promoções.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 py-6 text-lg bg-white border-0 focus:ring-2 focus:ring-[#FFCC29]"
                />
              </div>
              <Button
                type="submit"
                disabled={isSubscribed || loading}
                className={`py-6 px-8 font-display text-lg transition-all ${
                  isSubscribed
                    ? 'bg-green-500 text-white'
                    : 'bg-[#FFCC29] text-[#002776] hover:bg-[#E6B800]'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    ENVIADO!
                  </>
                ) : loading ? (
                  'ENVIANDO...'
                ) : (
                  'QUERO RECEBER'
                )}
              </Button>
            </form>

            <p className="font-body text-sm text-white/60 mt-4">
              Cupom válido para uma única utilização. Não acumulável.
            </p>
          </div>
        </div>
      </section>

      {/* Exit Intent Popup */}
      <Dialog
        open={showExitPopup}
        onOpenChange={(open) => {
          setShowExitPopup(open);
          if (!open) {
            try {
              sessionStorage.setItem(COUPON_MODAL_DISMISSED, '1');
            } catch { /* ignore */ }
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-[#00843D] text-center">
              GANHE 10% OFF
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-[#FFCC29] rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-[#002776]" />
            </div>

            {exitCouponRevealed ? (
              <>
                <div className="bg-gray-50 border-2 border-dashed border-[#00843D] rounded-xl p-6 mb-4">
                  <p className="font-body text-xs text-gray-500 uppercase tracking-widest mb-2">Seu cupom exclusivo</p>
                  <p className="font-display text-4xl text-[#00843D] tracking-[6px] mb-2">BEMVINDO10</p>
                  <p className="font-body font-bold text-[#002776]">10% OFF na primeira compra</p>
                </div>
                <p className="font-body text-xs text-gray-500 mb-4">
                  Válido para primeira compra. Não acumulável.
                </p>
                <Button
                  onClick={() => setShowExitPopup(false)}
                  className="w-full bg-[#00843D] hover:bg-[#006633] text-white font-display text-lg py-6"
                >
                  COMEÇAR A COMPRAR
                </Button>
              </>
            ) : (
              <>
                <h3 className="font-display text-2xl text-gray-900 mb-2">
                  Não vá embora sem seu desconto!
                </h3>
                <p className="font-body text-gray-600 mb-6">
                  Digite seu e-mail e receba seu cupom agora
                </p>
                
                <form onSubmit={handleExitSubmit} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-6 text-lg"
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#00843D] hover:bg-[#006633] text-white font-display text-lg py-6"
                  >
                    {loading ? 'ENVIANDO...' : 'GANHAR DESCONTO'}
                  </Button>
                </form>
                
                <p className="font-body text-xs text-gray-500 mt-4">
                  Válido para primeira compra. Não acumulável.
                </p>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
