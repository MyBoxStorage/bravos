import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Instagram, Facebook, Youtube, Twitter, Shield, Lock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const quickLinks = [
  { name: 'Início', href: '#hero' },
  { name: 'Coleção', href: '#featured' },
  { name: 'Catálogo', href: '#catalog' },
  { name: 'Sobre nós', href: '#values' },
  { name: 'Contato', href: '#footer' },
];

const supportLinks = [
  { name: 'FAQ', href: '#' },
  { name: 'Trocas e devoluções', href: '#' },
  { name: 'Política de privacidade', href: '#' },
  { name: 'Termos de uso', href: '#' },
  { name: 'Rastreamento de pedido', href: '#' },
];

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: Twitter, href: '#', label: 'Twitter' },
];

const paymentMethods = [
  'Pix',
  'Visa',
  'Mastercard',
  'Elo',
  'American Express',
  'Hipercard',
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const columns = footerRef.current?.querySelectorAll('.footer-column');
      if (columns) {
        gsap.fromTo(
          columns,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
              trigger: footerRef.current,
              start: 'top 90%',
            },
          }
        );
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="footer"
      ref={footerRef}
      className="bg-gray-900 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Social */}
          <div className="footer-column">
            <div className="mb-6">
              <span className="font-display text-3xl text-[#00843D]">BRAVOS</span>
              <span className="font-display text-3xl text-[#FFCC29]"> BRASIL</span>
            </div>
            <p className="font-body text-gray-400 mb-6">
              Vista seu patriotismo. Roupas e acessórios que celebram a tradição brasileira.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#00843D] transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
            
            {/* ADICIONAR: Links das redes sociais */}
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3 className="font-display text-xl mb-6">LINKS RÁPIDOS</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="font-body text-gray-400 hover:text-[#FFCC29] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h3 className="font-display text-xl mb-6">ATENDIMENTO</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="font-body text-gray-400 hover:text-[#FFCC29] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment */}
          <div className="footer-column">
            <h3 className="font-display text-xl mb-6">FORMAS DE PAGAMENTO</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {paymentMethods.map((method) => (
                <div
                  key={method}
                  className="bg-gray-800 rounded-lg p-3 flex items-center justify-center"
                >
                  <span className="font-body text-xs text-gray-400">{method}</span>
                </div>
              ))}
            </div>
            
            <p className="font-body text-sm text-gray-400 mb-4">
              Parcele em até 12x sem juros
            </p>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="w-5 h-5" />
                <span className="font-body text-xs">Site Seguro</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Lock className="w-5 h-5" />
                <span className="font-body text-xs">SSL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-sm text-gray-500">
              © 2025 BRAVOS BRASIL. Todos os direitos reservados.
            </p>
            <p className="font-body text-sm text-gray-500">
              CNPJ: XX.XXX.XXX/XXXX-XX {/* SUBSTITUIR: CNPJ real */}
            </p>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/5511999999999?text=Olá! Vim do site BRAVOS BRASIL"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse-slow"
        aria-label="WhatsApp"
      >
        <svg
          className="w-7 h-7 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </footer>
  );
}
