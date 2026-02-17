import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ProductHeroProps {
  productName: string;
  category: string;
}

export function ProductHero({ productName, category }: ProductHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax bg
      gsap.to(imageRef.current, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Content fade in
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        breadcrumbRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      ).fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.3'
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative h-[300px] md:h-[400px] w-full overflow-hidden"
    >
      {/* Background image with parallax */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <img
          src="/hero-catalogo.webp"
          alt={productName}
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          {/* Breadcrumb */}
          <nav
            ref={breadcrumbRef}
            className="flex items-center text-sm mb-4 flex-wrap"
          >
            <Link
              to="/"
              className="text-white/80 hover:text-white transition-colors font-body"
            >
              Início
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-white/50" />
            <Link
              to="/catalogo"
              className="text-white/80 hover:text-white transition-colors font-body"
            >
              Catálogo
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-white/50" />
            <span className="text-white/60 font-body capitalize">{category}</span>
            <ChevronRight className="w-4 h-4 mx-2 text-white/50" />
            <span className="text-white font-semibold font-body line-clamp-1">
              {productName}
            </span>
          </nav>

          {/* Title */}
          <h1
            ref={titleRef}
            className="font-display text-3xl md:text-5xl lg:text-6xl text-white drop-shadow-lg line-clamp-2"
          >
            {productName.toUpperCase()}
          </h1>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none" />
    </section>
  );
}
