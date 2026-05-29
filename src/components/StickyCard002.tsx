import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { cn } from "../lib/utils";

interface CardData {
  id: number | string;
  image: string;
  alt?: string;
  title?: string;
  description?: string;
}

interface StickyCard002Props {
  cards: CardData[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

export const StickyCard002 = ({
  cards,
  className,
  containerClassName,
  imageClassName,
}: StickyCard002Props) => {
  const container = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const cardElements = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);
      const totalCards = cardElements.length;

      if (totalCards === 0) return;

      // Initial state
      gsap.set(cardElements[0], { y: "0%", scale: 1, rotation: 0 });

      for (let i = 1; i < totalCards; i++) {
        gsap.set(cardElements[i], { y: "100%", scale: 1, rotation: 0 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky-cards-wrapper",
          start: "top top",
          end: `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
          pinSpacing: true,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cardElements[i];
        const nextCard = cardElements[i + 1];
        const position = i;

        scrollTimeline.to(
          currentCard,
          {
            scale: 0.85,
            rotation: i % 2 === 0 ? 3 : -3,
            duration: 1,
            ease: "none",
          },
          position,
        );

        scrollTimeline.to(
          nextCard,
          {
            y: "0%",
            duration: 1,
            ease: "none",
          },
          position,
        );
      }

      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });

      if (container.current) {
        resizeObserver.observe(container.current);
      }

      return () => {
        resizeObserver.disconnect();
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: container },
  );

  return (
    <div className={cn("relative w-full", className)} ref={container}>
      <div className="sticky-cards-wrapper relative flex h-screen w-full items-center justify-center overflow-hidden px-4 py-8 md:px-8">
        <div
          className={cn(
            "relative h-[70vh] sm:h-[80vh] w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl rounded-3xl overflow-hidden",
            containerClassName,
          )}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              className="absolute inset-0 h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-end bg-obsidian-light"
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{ zIndex: i + 1 }}
            >
              {/* Background Image with dark vignette */}
              <img
                src={card.image}
                alt={card.alt || card.title || ""}
                className={cn(
                  "absolute inset-0 h-full w-full object-cover brightness-[0.7] contrast-[1.05] transition-all duration-700",
                  imageClassName,
                )}
              />
              
              {/* Luxury Text Content Overlay */}
              <div className="relative z-10 p-5 sm:p-8 md:p-12 lg:p-16 bg-gradient-to-t from-obsidian via-obsidian/85 to-transparent pt-20 sm:pt-32 text-left font-sans flex flex-col justify-end">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-gold font-light block mb-2 sm:mb-3">
                  KADAI LEGACY
                </span>
                
                {card.title && (
                  <h3 className="font-serif text-xl sm:text-3xl md:text-5xl text-white font-semibold mb-2 sm:mb-4 tracking-wide leading-tight drop-shadow-md">
                    {card.title}
                  </h3>
                )}
                
                {card.description && (
                  <p className="text-white/70 text-[11px] sm:text-xs md:text-base font-light leading-relaxed max-w-2xl drop-shadow-sm">
                    {card.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
