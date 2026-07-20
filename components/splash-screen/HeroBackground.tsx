"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { resolveGuestName } from "@/lib/invitation";

interface HeroBackgroundProps {
  onOpen: () => void;
}

function subscribeToLocation(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function readGuestName() {
  return resolveGuestName(window.location.search);
}

function readServerGuestName() {
  return resolveGuestName("");
}

export default function HeroBackground({ onOpen }: HeroBackgroundProps) {
  const guestName = useSyncExternalStore(subscribeToLocation, readGuestName, readServerGuestName);

  return (
    <div className="relative flex h-dvh w-full flex-col items-center justify-between overflow-hidden text-white select-none lg:h-full">
      {/* Background Image with subtle overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none">
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


      {/* Main Content Layout */}
      <div className="relative inset-0 z-20 flex h-full w-full flex-col items-center justify-between px-6 py-16">
        {/* TOP: Guest Greeting & Rings */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-col items-center text-center"
        >
          <div className="flex items-baseline space-x-2.5">
            <span className="font-literata text-[20px] font-normal tracking-wide text-white/90">
              Dear
            </span>
            <span className="font-qwigley translate-y-1 text-[48px] leading-[0.5] font-normal text-[#fbead8]">
              {guestName}
            </span>
          </div>

          <div className="relative mt-5 h-[42px] w-[160px]">
            <Image
              src="/images/splash-screen/ring.png"
              alt="Rings ornament"
              fill
              className="object-contain opacity-90"
            />
          </div>
        </motion.div>

        {/* MIDDLE: Title, Names & Date */}
        <div className="my-auto flex flex-col items-center py-6 text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="font-literata text-[14px] font-normal tracking-[0.25em] text-white/80 uppercase"
          >
            The wedding of
          </motion.h2>

          {/* Stylized Names Container */}
          <div className="relative mt-4 flex w-full max-w-[320px] min-w-[290px] flex-col">
            {/* Kinan */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-playfair pl-6 text-left text-[64px] leading-[1.05] font-normal text-white"
            >
              Kinan
            </motion.div>

            {/* "and" handwritten script overlapping */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              className="font-qwitcher absolute top-[36px] left-[56%] z-10 -translate-x-1/2 text-[56px] leading-none font-normal text-white/95"
            >
              and
            </motion.div>

            {/* Faiz */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-playfair mt-1 pr-6 text-right text-[64px] leading-[1.05] font-normal text-white"
            >
              Faiz
            </motion.div>
          </div>

          {/* Date Section with divider lines */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex w-full items-center justify-center px-6"
          >
            <div className="h-[0.5px] w-12 bg-white/40" />
            <span className="font-playfair mx-4 text-[15px] font-medium tracking-[0.2em] whitespace-nowrap text-white/90">
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
          className="mb-2 flex w-full flex-col items-center"
        >
          <button
            type="button"
            onClick={onOpen}
            aria-label="Open invitation"
            className="relative h-[105px] w-[210px] cursor-pointer transition-transform duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent active:scale-98"
          >
            <Image
              src="/images/splash-screen/button.png"
              alt="Open Invitation"
              fill
              className="object-contain"
              priority
            />
            {/* Custom White Chevron to highlight active state and float gently */}
            <div className="animate-float absolute bottom-[4px] left-1/2 -translate-x-1/2 text-white opacity-95">
              <svg
                className="h-5 w-5"
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
