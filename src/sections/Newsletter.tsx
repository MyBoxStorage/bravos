import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Gift, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

export function Newsletter() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
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

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownPopup.current) {
        hasShownPopup.current = true;
        setTimeout(() => {
          setShowExitPopup(true);
        }, 10000); // 10 seconds delay
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Digite seu e-mail');
      return;
    }
    
    // Simulate subscription
    setIsSubscribed(true);
    toast.success('Inscrição realizada com sucesso!');
    setEmail('');
    
    setTimeout(() => {
      setIsSubscribed(false);
    }, 3000);
  };

  const handleExitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Digite seu e-mail');
      return;
    }
    
    toast.success('Cupom de 10% enviado para seu e-mail!');
    setEmail('');
    setShowExitPopup(false);
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
              NOVIDADES TODA SEMANA
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
              RECEBA OFERTAS EXCLUSIVAS
            </h2>
            
            <p className="font-body text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Cadastre-se e seja o primeiro a saber sobre lançamentos, promoções e conteúdos patrióticos.
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
                disabled={isSubscribed}
                className={`py-6 px-8 font-display text-lg transition-all ${
                  isSubscribed
                    ? 'bg-green-500 text-white'
                    : 'bg-[#FFCC29] text-[#002776] hover:bg-[#E6B800]'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    INSCRITO!
                  </>
                ) : (
                  'QUERO RECEBER'
                )}
              </Button>
            </form>

            <p className="font-body text-sm text-white/60 mt-4">
              Ao se inscrever, você concorda com nossa política de privacidade.
            </p>
          </div>
        </div>
      </section>

      {/* Exit Intent Popup */}
      <Dialog open={showExitPopup} onOpenChange={setShowExitPopup}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl text-[#00843D] text-center">
              ESPERA! 🇧🇷
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-[#FFCC29] rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-10 h-10 text-[#002776]" />
            </div>
            
            <h3 className="font-display text-2xl text-gray-900 mb-2">
              Ganhe 10% OFF
            </h3>
            <p className="font-body text-gray-600 mb-6">
              Na sua primeira compra ao se cadastrar
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
                className="w-full bg-[#00843D] hover:bg-[#006633] text-white font-display text-lg py-6"
              >
                GANHAR DESCONTO
              </Button>
            </form>
            
            <p className="font-body text-xs text-gray-500 mt-4">
              *Código enviado por e-mail
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
