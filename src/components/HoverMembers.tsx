import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "../lib/utils";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const KADAI_TEAM = [
  { id: 1, name: "VIPUL",   role: "Owner & Host",      img: "/team/vipul.png"   },
  { id: 2, name: "RAGHU",   role: "Head Chef",          img: "/team/raghu.png"   },
  { id: 3, name: "PRIYA",   role: "Seafood Specialist", img: "/team/priya.png"   },
  { id: 4, name: "SURESH",  role: "Tandoor Master",     img: "/team/suresh.png"  },
  { id: 5, name: "ANITA",   role: "Pastry & Desserts",  img: "/team/anita.png"   },
  { id: 6, name: "KARTHIK", role: "Mixologist",         img: "/team/karthik.png" },
];

const DEFAULT_STATE = {
  id: "default",
  name: "KADAI",
  role: "Awakening the Legend since 1999",
  img: "/kadai-multicuisine-bg.jpg"
};

// ─── SPLIT TEXT INTO ANIMATED LETTERS ────────────────────────────────────────
interface SplitLettersProps {
  text: string;
  isEntering: boolean;
}

function SplitLetters({ text, isEntering }: SplitLettersProps) {
  return (
    <span className="inline-flex overflow-hidden">
      {text.split("").map((char, i) => {
        // Alternate brand colors for letters: Gold and Cream
        const charColor = i % 2 === 0 ? "#cfa85e" : "#f5edd6";
        
        return (
          <motion.span
            key={`${text}-${i}`}
            className="inline-block will-change-transform"
            style={{ color: charColor }}
            initial={isEntering
              ? { y: "110%", opacity: 0, rotate: Math.random() > 0.5 ? 8 : -8 }
              : { y: "0%",   opacity: 1, rotate: 0 }
            }
            animate={isEntering
              ? { y: "0%",   opacity: 1, rotate: 0 }
              : { y: "-110%", opacity: 0, rotate: Math.random() > 0.5 ? -6 : 6 }
            }
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 30,
              mass: 0.9,
              delay: i * 0.035,  // 35ms stagger between letters
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </span>
  );
}

// ─── DYNAMIC FONT SIZE HOOK ───────────────────────────────────────────────────
function useDynamicFontSize(name: string, containerRef: React.RefObject<HTMLDivElement | null>) {
  const [fontSize, setFontSize] = useState("15vw");

  useEffect(() => {
    if (!containerRef.current || !name) return;
    const measure = () => {
      const w = containerRef.current!.offsetWidth;
      // Arial Black width factor: each char is ~0.65 to 0.70 of font-size wide. Let's use 0.68.
      const charWidthRatio = 0.68;
      const targetWidth = w * 0.90; // fill 90% of screen width (giving 5% padding on left and right)
      const raw = targetWidth / (name.length * charWidthRatio);
      // Cap at 50% of viewport height (so it sits comfortably in the middle without touching header/footer/thumbnails)
      const capped = Math.min(raw, window.innerHeight * 0.50);
      setFontSize(`${capped}px`);
    };
    
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [name, containerRef]);

  return fontSize;
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function HoverMembers() {
  const [active, setActive] = useState<typeof KADAI_TEAM[0] | typeof DEFAULT_STATE>(DEFAULT_STATE);
  const [prev, setPrev] = useState<typeof KADAI_TEAM[0] | typeof DEFAULT_STATE | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fontSize = useDynamicFontSize(active.name, containerRef);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Preload team images on mount
  useEffect(() => {
    const allImages = [DEFAULT_STATE.img, ...KADAI_TEAM.map(m => m.img)];
    allImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleHover = useCallback((member: typeof KADAI_TEAM[0] | typeof DEFAULT_STATE) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (member.id === active.id) return;
    setPrev(active);
    setActive(member);
  }, [active]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    // Smooth delay before returning to default KADAI state
    timeoutRef.current = setTimeout(() => {
      setPrev(active);
      setActive(DEFAULT_STATE);
    }, 150);
  }, [active]);

  // Determine if motion is reduced
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[75vh] sm:h-[85vh] md:h-[95vh] bg-[#0A0805] overflow-hidden flex flex-col justify-between select-none"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0805] via-[#050302]/40 to-[#0A0805] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#cfa85e_1px,_transparent_1px)] bg-[size:32px_32px] opacity-[0.03] pointer-events-none z-0" />

      {/* THUMBNAIL STRIP */}
      <div 
        className="relative z-20 flex flex-wrap gap-1.5 md:gap-3 px-3 py-4 md:px-12 md:py-8 justify-center items-center w-full"
        onMouseLeave={handleMouseLeave}
      >
        {KADAI_TEAM.map(m => {
          const isActive = active.id === m.id;
          return (
            <button
              key={m.id}
              onMouseEnter={() => handleHover(m)}
              onTouchStart={() => handleHover(m)}
              className={cn(
                "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 relative focus:outline-none transition-all duration-300",
                isActive
                  ? "border border-[#cfa85e] scale-110 shadow-[0_0_15px_rgba(207,168,94,0.3)] brightness-110 grayscale-0"
                  : "border border-white/5 scale-100 brightness-[0.5] grayscale-[0.4] hover:brightness-[0.8] hover:scale-105"
              )}
              aria-label={`View team member ${m.name}`}
            >
              <img
                src={m.img}
                alt={m.name}
                className="w-full h-full object-cover object-top block pointer-events-none"
              />
            </button>
          );
        })}
      </div>

      {/* GIANT CLIPPED TEXT CANVAS CONTAINER */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        
        {/* Layer 1: Pure black background container that holds the giant text */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0A0805]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              style={{
                fontFamily: "'Arial Black', 'Helvetica Neue', sans-serif",
                fontWeight: 900,
                fontSize,
                lineHeight: 1.0,
                letterSpacing: "-0.04em",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              initial={{ opacity: prefersReduced ? 1 : 0.9 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: prefersReduced ? 1 : 0.9 }}
            >
              <SplitLetters text={active.name} isEntering={true} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Layer 2: The member full image layered on top using mix-blend-mode: multiply */}
        {/* Multiplying with white/gold/cream text makes the image show up inside the text */}
        {/* Multiplying with black background completely hides the image in the background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id + "-mask-image"}
            initial={{ opacity: 0 }}
            animate={{ opacity: active.id === "default" ? 0.45 : 0.88 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${active.img})`,
              backgroundSize: "cover",
              backgroundPosition: "center 25%",
              mixBlendMode: "multiply",
              pointerEvents: "none",
              zIndex: 5,
            }}
          />
        </AnimatePresence>
      </div>

      {/* MEMBER DETAILS: Name & Role Label Bottom-Left */}
      <div className="relative z-10 p-8 md:p-12 pointer-events-none mt-auto flex flex-col items-start gap-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id + "-role-label"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            <span className="font-serif italic text-base md:text-lg text-[#cfa85e] tracking-wider">
              {active.id === "default" ? "KADAI FAMILY" : active.name}
            </span>
            <span className="font-sans font-light uppercase tracking-[0.3em] text-[10px] md:text-xs text-white/50 mt-1">
              {active.role}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
