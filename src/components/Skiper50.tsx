import React from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, EffectCreative, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { cn } from "../lib/utils";

const Skiper50 = () => {
  const images = [
    {
      src: "/pics/signature-chicken-sukka.jpeg",
      alt: "OG Chicken Sukka",
    },
    {
      src: "/pics/signature-chicken-biryani.jpeg",
      alt: "Hyderabadi Chicken Biryani",
    },
    {
      src: "/pics/signature-hara-bara-kabab.jpeg",
      alt: "Hara Bara Kabab",
    },
    {
      src: "/pics/signature-andhra-chilli-chicken.jpeg",
      alt: "Andhra Chilli Chicken",
    },
    {
      src: "/pics/signature-ragi-mudde-mutton-chops.jpeg",
      alt: "Ragi Mudde Mutton Chops",
    },
    {
      src: "/pics/signature-coastal-fish-fry.jpeg",
      alt: "Coastal Fish Fry",
    },
  ];

  return (
    <div className="flex w-full flex-col items-center justify-center overflow-hidden py-20 bg-gradient-to-r from-obsidian via-[#0f0302]/50 to-obsidian border-t border-b border-white/10 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#8C1C13_0%,_transparent_70%)] opacity-10 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#cfa85e_1px,_transparent_1px)] bg-[size:24px_24px] opacity-5 pointer-events-none z-0" />
      <div className="mb-10 text-center relative z-10">
        <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-gold mb-2">SIGNATURE DISHES</h3>
        <h2 className="font-serif text-3xl md:text-4xl text-white font-normal">A Glimpse into Kadai Craft</h2>
      </div>
      <Carousel_004 className="z-10" images={images} showPagination showNavigation autoplay loop />
    </div>
  );
};

const Carousel_004 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 30,
}: {
  images: { src: string; alt: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
}) => {
  const css = `
  .Carousal_004 {
    width: 100%;
    height: 560px;
    padding-bottom: 60px !important;
  }
  
  .Carousal_004 .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 480px;
    max-width: 85vw;
    height: 520px;
    border-radius: 32px;
    overflow: hidden;
    transition: filter 0.5s ease, transform 0.5s ease;
    box-shadow: 0 20px 40px rgba(0,0,0,0.7);
  }

  .Carousal_004 .swiper-slide:not(.swiper-slide-active) {
    filter: brightness(0.6) grayscale(0.3);
  }
  
  .Carousal_004 .swiper-pagination-bullet {
    background: rgba(255, 255, 255, 0.3);
    width: 10px;
    height: 10px;
    transition: all 0.3s ease;
  }
  
  .Carousal_004 .swiper-pagination-bullet-active {
    background: #cfa85e;
    width: 24px;
    border-radius: 6px;
  }

  .custom-nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 20;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: rgba(5, 5, 5, 0.7);
    border: 1px solid rgba(207, 168, 94, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #cfa85e;
    cursor: pointer;
    backdrop-filter: blur(8px);
    transition: all 0.3s ease;
  }

  .custom-nav-btn:hover {
    background: #cfa85e;
    color: #050505;
    border-color: #cfa85e;
  }

  .custom-prev { left: 0px; }
  .custom-next { right: 0px; }

  @media (min-width: 768px) {
    .custom-prev { left: -16px; }
    .custom-next { right: -16px; }
  }
  `;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.5,
      }}
      className={cn("relative w-full max-w-6xl px-4 md:px-12", className)}
    >
      <style>{css}</style>

      <div className="relative w-full">
        {showNavigation && (
          <>
            <div className="custom-nav-btn custom-prev swiper-button-prev-custom">
              <ChevronLeft className="h-6 w-6" />
            </div>
            <div className="custom-nav-btn custom-next swiper-button-next-custom">
              <ChevronRight className="h-6 w-6" />
            </div>
          </>
        )}

        <Swiper
          spaceBetween={spaceBetween}
          autoplay={
            autoplay
              ? {
                  delay: 2500,
                  disableOnInteraction: false,
                }
              : false
          }
          effect="creative"
          grabCursor={true}
          slidesPerView="auto"
          centeredSlides={true}
          loop={loop}
          pagination={
            showPagination
              ? {
                  clickable: true,
                }
              : false
          }
          navigation={
            showNavigation
              ? {
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }
              : false
          }
          className="Carousal_004"
          creativeEffect={{
            prev: {
              shadow: true,
              origin: "left center",
              translate: ["-22%", 0, -320],
              rotate: [0, 45, 0],
            },
            next: {
              origin: "right center",
              translate: ["22%", 0, -320],
              rotate: [0, -45, 0],
            },
          }}
          modules={[EffectCreative, Pagination, Autoplay, Navigation]}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full border border-white/10 rounded-3xl overflow-hidden group bg-obsidian flex items-center justify-center shadow-2xl">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={image.src}
                  alt={image.alt}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent opacity-90 pointer-events-none" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </motion.div>
  );
};

export { Skiper50, Carousel_004 };
