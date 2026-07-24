"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import RsvpFloralBrush from "@/components/invitation/RsvpFloralBrush";
import { STORY_ASSETS } from "@/lib/invitation-story";
import { RSVP_ANIMATED_PETAL_COUNT, RSVP_CELEBRATION_PETALS } from "@/lib/rsvp-celebration";

const celebrationEase = [0.16, 1, 0.3, 1] as const;
const CANNON_RAYS = [-86, -78, -70, -62, -54, -46, -38, -30, -22, -14] as const;

function CannonBurst({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";

  return (
    <div
      data-rsvp-cannon={side}
      className={`absolute top-[738px] z-[44] size-px ${isLeft ? "left-[19px]" : "right-[19px]"}`}
    >
      <motion.span
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: [0, 1, 0], scale: [0.2, 1.5, 2] }}
        transition={{ duration: 0.78, ease: "easeOut" }}
        className="absolute -top-[42px] -left-[42px] size-[84px] rounded-full border-4 border-[#FFF4E3]/95 shadow-[0_0_26px_rgba(244,201,93,0.92)]"
      />

      {CANNON_RAYS.map((angle, index) => (
        <motion.span
          data-rsvp-cannon-ray={`${side}-${index}`}
          key={`${side}-ray-${angle}`}
          initial={{ opacity: 0, scaleX: 0.08, scaleY: 0.6 }}
          animate={{
            opacity: [0, 1, 0],
            scaleX: [0.08, 1.08, 0.9],
            scaleY: [0.6, 1, 0.7],
          }}
          transition={{
            duration: 0.78,
            delay: index * 0.025,
            times: [0, 0.42, 1],
            ease: "easeOut",
          }}
          className="absolute top-0 left-0 h-[5px] w-[150px] origin-left rounded-full bg-[linear-gradient(90deg,#FFF4E3_0%,#F4C95D_28%,#F2B7C0_66%,transparent_100%)] shadow-[0_0_18px_rgba(255,244,227,0.95)]"
          style={{ rotate: isLeft ? angle : 180 - angle }}
        />
      ))}
    </div>
  );
}

function FlowerCluster({
  side,
  shouldReduceMotion,
}: {
  side: "left" | "right";
  shouldReduceMotion: boolean;
}) {
  const isLeft = side === "left";

  return (
    <motion.div
      data-rsvp-flower-cluster={side}
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              x: isLeft ? -92 : 92,
              y: 54,
              rotate: isLeft ? -18 : 18,
              scale: 0.32,
            }
      }
      animate={
        shouldReduceMotion
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              rotate: isLeft ? -4 : 4,
              scale: 1,
            }
          : {
              opacity: [0, 1, 1, 1],
              x: [isLeft ? -92 : 92, isLeft ? 6 : -6, 0, 0],
              y: [54, -10, 3, 0],
              rotate: [isLeft ? -18 : 18, isLeft ? 1 : -1, isLeft ? -6 : 6, isLeft ? -4 : 4],
              scale: [0.32, 1.18, 0.96, 1],
            }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 0.78,
              delay: isLeft ? 0.03 : 0.08,
              times: [0, 0.58, 0.82, 1],
              ease: celebrationEase,
            }
      }
      className={`absolute top-[318px] h-[153px] w-[290px] ${
        isLeft ? "left-[-92px]" : "right-[-92px]"
      }`}
    >
      <div className={`relative size-full ${isLeft ? "" : "scale-x-[-1]"}`}>
        <Image
          src={STORY_ASSETS.groomBride.portraitFlowers}
          alt=""
          fill
          sizes="(max-width: 393px) 73.79vw, 290px"
          draggable={false}
          className="object-cover object-center select-none"
        />
      </div>
    </motion.div>
  );
}

export default function RsvpCelebration() {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const animatedPetals = shouldReduceMotion
    ? []
    : RSVP_CELEBRATION_PETALS.slice(0, RSVP_ANIMATED_PETAL_COUNT);
  const settledPetals = shouldReduceMotion
    ? RSVP_CELEBRATION_PETALS
    : RSVP_CELEBRATION_PETALS.slice(RSVP_ANIMATED_PETAL_COUNT);

  return (
    <div
      data-rsvp-celebration
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
    >
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.62 }}
        animate={{
          opacity: shouldReduceMotion ? 0.26 : [0, 0.48, 0.2],
          scale: shouldReduceMotion ? 1 : [0.62, 1.1, 1],
        }}
        transition={
          shouldReduceMotion
            ? { duration: 0 }
            : {
                duration: 2.6,
                times: [0, 0.28, 1],
                ease: celebrationEase,
              }
        }
        className="absolute top-[150px] left-1/2 h-[390px] w-[390px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,201,93,0.42)_0%,rgba(232,143,155,0.2)_42%,transparent_72%)]"
      />

      <RsvpFloralBrush shouldReduceMotion={shouldReduceMotion} />

      {!shouldReduceMotion ? (
        <>
          <CannonBurst side="left" />
          <CannonBurst side="right" />
        </>
      ) : null}

      {settledPetals.map((petal, index) => (
        <span
          data-rsvp-petal={petal.id}
          data-rsvp-petal-state="settled"
          key={petal.id}
          className="absolute block rounded-[80%_0_80%_0] border border-white/25 shadow-[0_2px_5px_rgba(91,76,54,0.22)]"
          style={{
            left: petal.landingX,
            top: petal.landingY,
            width: petal.size,
            height: petal.size * 0.58,
            backgroundColor: petal.color,
            opacity: 0.72,
            transform: `rotate(${petal.rotation}deg) scale(0.84)`,
            zIndex: 46 + ((index + RSVP_ANIMATED_PETAL_COUNT) % 7),
          }}
        />
      ))}

      {animatedPetals.map((petal, index) => {
        const apexX = petal.apexX - petal.startX;
        const apexY = petal.apexY - petal.startY;
        const landingX = petal.landingX - petal.startX;
        const landingY = petal.landingY - petal.startY;

        return (
          <motion.span
            data-rsvp-petal={petal.id}
            data-rsvp-petal-state="animated"
            key={petal.id}
            initial={{ opacity: 0, scale: 0.25, rotate: 0 }}
            animate={{
              opacity: [0, 1, 1, 1, 1],
              x: [0, apexX * 0.72, apexX, landingX, landingX],
              y: [0, apexY * 0.72, apexY, landingY - 11, landingY],
              rotate: [
                0,
                petal.rotation * 0.34,
                petal.rotation * 0.68,
                petal.rotation * 0.96,
                petal.rotation,
              ],
              scale: [0.25, 1.24, 1, 0.9, 0.84],
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              times: [0, 0.16, 0.38, 0.86, 1],
              ease: "easeOut",
            }}
            className="absolute block rounded-[80%_0_80%_0] border border-white/25 shadow-[0_2px_5px_rgba(91,76,54,0.22)]"
            style={{
              left: petal.startX,
              top: petal.startY,
              width: petal.size,
              height: petal.size * 0.58,
              backgroundColor: petal.color,
              zIndex: 46 + (index % 7),
            }}
          />
        );
      })}

      <FlowerCluster side="left" shouldReduceMotion={shouldReduceMotion} />
      <FlowerCluster side="right" shouldReduceMotion={shouldReduceMotion} />
    </div>
  );
}
