"use client";

import { useReducer } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import MainScreen from "@/components/main-screen/MainScreen";
import HeroBackground from "@/components/splash-screen/HeroBackground";
import { invitationViewReducer } from "@/lib/invitation";

const transitionEase = [0.16, 1, 0.3, 1] as const;

export default function InvitationExperience() {
  const [view, dispatch] = useReducer(invitationViewReducer, "splash");
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative h-dvh w-full overflow-hidden lg:h-full">
      <AnimatePresence initial={false} mode="wait">
        {view === "splash" ? (
          <motion.div
            key="splash"
            className="absolute inset-0"
            exit={{
              opacity: 0,
              scale: shouldReduceMotion ? 1 : 1.025,
            }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.6,
              ease: transitionEase,
            }}
          >
            <HeroBackground onOpen={() => dispatch({ type: "open" })} />
          </motion.div>
        ) : (
          <motion.div
            key="main"
            role="region"
            aria-labelledby="main-screen-title"
            tabIndex={0}
            data-lenis-prevent=""
            className="focus-visible:ring-brand-gold-dark absolute inset-0 [scrollbar-width:none] overflow-x-hidden overflow-y-auto bg-[#FAEBE0] [-ms-overflow-style:none] focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset [&::-webkit-scrollbar]:hidden"
            initial={{
              opacity: 0,
              y: shouldReduceMotion ? 0 : 18,
            }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.8,
              ease: transitionEase,
            }}
          >
            <MainScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
