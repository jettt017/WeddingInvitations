"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroBackground() {
  const [guestName, setGuestName] = useState("object");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get("to") || params.get("guest") || params.get("g");
    if (to) {
      setGuestName(to);
    }
  }, []);

  return (
    <div className="relative w-full h-dvh lg:h-full overflow-hidden flex flex-col justify-between items-center text-white select-none">
      {/* Background Image with subtle overlay */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <Image
          src="/images/splash-screen/hero-background.webp"
          alt="Wedding background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Subtle vignette/gradient overlay for premium look and text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/35" />
      </div>

      {/* Full-frame Botanical Decoration */}
      <div className="absolute inset-0 z-10 pointer-events-none select-none">
        <Image
          src="/images/splash-screen/decoration.png"
          alt="Botanical decorations"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.04] origin-center"
        />
      </div>

      {/* Main Content Layout */}
      <div className="relative inset-0 z-20 w-full h-full flex flex-col justify-between items-center py-16 px-6">
        
        {/* TOP: Guest Greeting & Rings */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mt-8 text-center"
        >
          <div className="flex items-baseline space-x-2.5">
            <span className="font-literata text-[20px] font-normal tracking-wide text-white/90">
              Dear
            </span>
            <span className="font-qwigley text-[48px] font-normal leading-[0.5] text-[#fbead8] translate-y-1">
              {guestName}
            </span>
          </div>
          
          <div className="w-[160px] h-[42px] relative mt-5">
            <Image
              src="/images/splash-screen/ring.png"
              alt="Rings ornament"
              fill
              className="object-contain opacity-90"
            />
          </div>
        </motion.div>

        {/* MIDDLE: Title, Names & Date */}
        <div className="flex flex-col items-center text-center my-auto py-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-literata text-[14px] tracking-[0.25em] font-normal text-white/80 uppercase"
          >
            The wedding of
          </motion.h2>

          {/* Stylized Names Container */}
          <div className="relative w-full min-w-[290px] max-w-[320px] flex flex-col mt-4">
            {/* Kinan */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-playfair text-[64px] font-normal leading-[1.05] text-white text-left pl-6"
            >
              Kinan
            </motion.div>
            
            {/* "and" handwritten script overlapping */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              className="font-qwitcher text-[56px] font-normal text-white/95 absolute left-[56%] top-[36px] -translate-x-1/2 leading-none z-10"
            >
              and
            </motion.div>
            
            {/* Faiz */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-playfair text-[64px] font-normal leading-[1.05] text-white text-right pr-6 mt-1"
            >
              Faiz
            </motion.div>
          </div>

          {/* Date Section with divider lines */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex items-center justify-center w-full px-6"
          >
            <div className="h-[0.5px] w-12 bg-white/40" />
            <span className="font-playfair text-[15px] tracking-[0.2em] text-white/90 font-medium mx-4 whitespace-nowrap">
              16 . 08 . 2026
            </span>
            <div className="h-[0.5px] w-12 bg-white/40" />
          </motion.div>
        </div>

        {/* BOTTOM: Button & Chevron */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-full mb-2"
        >
          <button className="relative w-[210px] h-[105px] cursor-pointer hover:scale-105 active:scale-98 transition-transform duration-300 focus:outline-none">
            <Image
              src="/images/splash-screen/button.png"
              alt="Open Invitation"
              fill
              className="object-contain"
              priority
            />
            {/* Custom White Chevron to highlight active state and float gently */}
            <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 text-white opacity-95 animate-float">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </motion.div>

      </div>
    </div>
  );
}
