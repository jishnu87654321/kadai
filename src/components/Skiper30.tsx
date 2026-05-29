import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

type MenuItem = {
  name: string;
  category: string;
  src: string;
};

const menuItems: MenuItem[] = [
  { name: "Egg Roast", category: "Traditional Specials", src: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800" },
  { name: "Chicken Ghee Roast", category: "Mangalorean Pride", src: "https://images.unsplash.com/photo-1604908552963-c7ad0e69fd62?auto=format&fit=crop&q=80&w=800" },
  { name: "Naati Style Chicken Biriyani", category: "Signature Rice Feasts", src: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800" },
  { name: "Tandoori Chicken", category: "Clay Oven Specials", src: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&q=80&w=800" },
  { name: "Garlic Butter Naan", category: "Artisanal Breads", src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800" },
  { name: "Mutton Rogan Josh", category: "Royal Curries", src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800" },
  { name: "Paneer Tikka Masala", category: "Vegetarian Delights", src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800" },
  { name: "Malabar Fish Curry", category: "Coastal Harvest", src: "https://images.unsplash.com/photo-1588123190131-1c3fac394f4b?auto=format&fit=crop&q=80&w=800" },
  { name: "Hyderabadi Dum Biryani", category: "Signature Rice Feasts", src: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800" },
  { name: "Dal Makhani", category: "Slow Cooked Lentils", src: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800" },
  { name: "Butter Chicken", category: "North Indian Classics", src: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800" },
  { name: "Kadai Paneer", category: "Signature Wok Tossed", src: "https://images.unsplash.com/photo-1538333581680-29dd468fb59f?auto=format&fit=crop&q=80&w=800" },
];

const Skiper30 = () => {
  return (
    <section id="actual-menu" className="w-full bg-gradient-to-b from-[#0d0302] via-obsidian to-obsidian text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#8C1C13_0%,_transparent_60%)] opacity-10 pointer-events-none z-0" />
      <div className="max-w-7xl mx-auto px-8 mb-12 text-center relative z-10">
        <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-3">Immersive Atmosphere</h3>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-normal">Our Ambience</h2>
        <p className="text-white/60 font-light max-w-xl mx-auto mt-4 text-sm md:text-base font-sans">
          Step into a realm where regal heritage meets contemporary elegance-an inviting space crafted for unforgettable dining moments.
        </p>
      </div>

      <div
        className="relative box-border flex h-[150vh] gap-[2vw] overflow-hidden bg-obsidian-light/10 p-[2vw] border-t border-b border-white/10 my-8"
      >
        <Column items={menuItems.slice(0, 3)} />
        <Column items={menuItems.slice(3, 6)} />
        <Column items={menuItems.slice(6, 9)} />
        <Column items={menuItems.slice(9, 12)} />
      </div>

      <div className="relative text-center mt-8 font-sans pb-4">
        <span className="text-xs uppercase tracking-[0.25em] text-gold/80 italic">
          Every moment a masterpiece, every memory unforgettable
        </span>
      </div>
    </section>
  );
};

type ColumnProps = {
  items: MenuItem[];
};

const Column = ({ items }: ColumnProps) => {
  return (
    <div
      className="relative -top-[45%] flex h-full w-1/4 min-w-[220px] md:min-w-[280px] flex-col gap-[2vw] transform-gpu will-change-transform first:top-[-45%] [&:nth-child(2)]:top-[-75%] [&:nth-child(3)]:top-[-45%] [&:nth-child(4)]:top-[-65%]"
    >
      {items.map((item, i) => (
        <div key={i} className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 shadow-xl group bg-obsidian-light/50 transform-gpu">
          <img
            src={`${item.src}`}
            alt={item.name}
            loading="lazy"
            decoding="async"
            sizes="(min-width: 768px) 280px, 220px"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian/90 via-obsidian/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 md:p-8">
            <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-gold mb-1 font-medium tracking-widest">{item.category}</span>
            <h4 className="text-xl md:text-2xl font-serif text-white font-normal tracking-wide drop-shadow-md">{item.name}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export { Skiper30 };
