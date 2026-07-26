"use client";

import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";

import { STORY_ASSETS } from "@/lib/invitation-story";
import {
  RSVP_FLORAL_BRUSH_BLOOMS,
  RSVP_FLORAL_BRUSH_LEAVES,
  type RsvpFloralBrushBloom,
  type RsvpFloralBrushLeaf,
} from "@/lib/rsvp-celebration";

const brushEase = [0.16, 1, 0.3, 1] as const;
const canvasImageSizes = (width: number) =>
  `(max-width: 393px) ${((width / 393) * 100).toFixed(2)}vw, ${width}px`;

interface BrushImageLayer {
  id: string;
  src: string | StaticImageData;
  left: number;
  top: number;
  width: number;
  height: number;
  rotate: number;
  flipX?: boolean;
  opacity: number;
  delay: number;
  fit: "contain" | "cover";
  position?: string;
}

const BRUSH_IMAGE_LAYERS: readonly BrushImageLayer[] = [
  {
    id: "painted-foliage-left",
    src: STORY_ASSETS.dateEvent.bottomFoliage,
    left: -138,
    top: 496,
    width: 430,
    height: 390,
    rotate: 0,
    opacity: 0.78,
    delay: 0.02,
    fit: "contain",
  },
  {
    id: "painted-foliage-right",
    src: STORY_ASSETS.dateEvent.bottomFoliage,
    left: 104,
    top: 500,
    width: 430,
    height: 390,
    rotate: 0,
    flipX: true,
    opacity: 0.76,
    delay: 0.04,
    fit: "contain",
  },
  {
    id: "bottom-vines",
    src: STORY_ASSETS.rsvpForm.topVines,
    left: -62,
    top: 438,
    width: 518,
    height: 370,
    rotate: 180,
    opacity: 0.82,
    delay: 0.08,
    fit: "contain",
  },
  {
    id: "branch-left",
    src: STORY_ASSETS.groomBride.groomBranch,
    left: -112,
    top: 384,
    width: 305,
    height: 410,
    rotate: 180,
    opacity: 0.84,
    delay: 0.1,
    fit: "contain",
  },
  {
    id: "branch-right",
    src: STORY_ASSETS.groomBride.groomBranch,
    left: 200,
    top: 382,
    width: 305,
    height: 410,
    rotate: 180,
    flipX: true,
    opacity: 0.84,
    delay: 0.13,
    fit: "contain",
  },
  {
    id: "rose-brush-back",
    src: STORY_ASSETS.groomBride.portraitFlowers,
    left: -126,
    top: 430,
    width: 645,
    height: 315,
    rotate: -1,
    opacity: 0.9,
    delay: 0.16,
    fit: "cover",
    position: "50% 50%",
  },
  {
    id: "rose-brush-front",
    src: STORY_ASSETS.groomBride.portraitFlowers,
    left: -72,
    top: 578,
    width: 540,
    height: 286,
    rotate: 2,
    flipX: true,
    opacity: 0.96,
    delay: 0.2,
    fit: "cover",
    position: "50% 52%",
  },
  {
    id: "large-loose-leaves",
    src: STORY_ASSETS.couplePhoto.foregroundLeaves,
    left: -62,
    top: 468,
    width: 520,
    height: 390,
    rotate: 0,
    opacity: 0.72,
    delay: 0.22,
    fit: "cover",
  },
  {
    id: "small-loose-leaves",
    src: STORY_ASSETS.gallery.foregroundLeaves,
    left: -20,
    top: 410,
    width: 435,
    height: 430,
    rotate: 0,
    opacity: 0.68,
    delay: 0.25,
    fit: "cover",
  },
];

function BrushBloom({ bloom }: { bloom: RsvpFloralBrushBloom }) {
  const petals = Array.from({ length: bloom.petalCount });

  return (
    <div
      data-rsvp-brush-bloom={bloom.id}
      className="absolute"
      style={{
        left: bloom.x - bloom.size / 2,
        top: bloom.y - bloom.size / 2,
        width: bloom.size,
        height: bloom.size,
        zIndex: 16 + Math.floor(bloom.y / 80),
        filter: "drop-shadow(0 4px 5px rgba(69, 63, 47, 0.22))",
      }}
    >
      {petals.map((_, index) => (
        <span
          key={`${bloom.id}-petal-${index}`}
          className="absolute top-1/2 left-1/2 rounded-[70%_70%_52%_52%]"
          style={{
            width: bloom.size * 0.44,
            height: bloom.size * 0.6,
            transformOrigin: "50% 100%",
            transform: `translate(-50%, -100%) rotate(${(360 / bloom.petalCount) * index}deg)`,
            background: `radial-gradient(circle at 50% 100%, ${bloom.centerColor} 0%, ${bloom.petalColor} 42%, ${bloom.petalColor} 100%)`,
            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.48)",
          }}
        />
      ))}
      <span
        className="absolute top-1/2 left-1/2 rounded-full border border-white/35"
        style={{
          width: bloom.size * 0.3,
          height: bloom.size * 0.3,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, #F8E6B5 0%, ${bloom.centerColor} 68%, #7C5649 100%)`,
        }}
      />
    </div>
  );
}

function BrushLeaf({ leaf }: { leaf: RsvpFloralBrushLeaf }) {
  return (
    <span
      data-rsvp-brush-leaf={leaf.id}
      className="absolute rounded-[100%_0_100%_0] border-l border-white/20 shadow-[0_3px_5px_rgba(49,94,43,0.22)]"
      style={{
        left: leaf.x - leaf.width / 2,
        top: leaf.y - leaf.height / 2,
        width: leaf.width,
        height: leaf.height,
        zIndex: 13 + Math.floor(leaf.y / 100),
        background: `linear-gradient(145deg, #B7D879 0%, ${leaf.color} 48%, #315E2B 100%)`,
      }}
    >
      <span className="absolute top-1/2 left-[8%] h-px w-[84%] -translate-y-1/2 rotate-[-3deg] bg-[#E4E0A8]/55" />
    </span>
  );
}

export default function RsvpFloralBrush({ shouldReduceMotion }: { shouldReduceMotion: boolean }) {
  return (
    <motion.div
      data-rsvp-floral-brush
      initial={
        shouldReduceMotion
          ? false
          : {
              opacity: 0,
              y: 84,
              scale: 0.94,
            }
      }
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 0.95,
              ease: brushEase,
            }
      }
      className="absolute inset-0"
    >
      {BRUSH_IMAGE_LAYERS.map((layer) => (
        <div
          data-rsvp-brush-image={layer.id}
          key={layer.id}
          className="absolute"
          style={{
            left: layer.left,
            top: layer.top,
            width: layer.width,
            height: layer.height,
            opacity: layer.opacity,
          }}
        >
          <div
            className="relative size-full"
            style={{
              transform: `rotate(${layer.rotate}deg) scaleX(${layer.flipX ? -1 : 1})`,
            }}
          >
            <Image
              src={layer.src}
              alt=""
              fill
              sizes={canvasImageSizes(layer.width)}
              draggable={false}
              className="select-none"
              style={{
                objectFit: layer.fit,
                objectPosition: layer.position ?? "center",
              }}
            />
          </div>
        </div>
      ))}

      {RSVP_FLORAL_BRUSH_LEAVES.map((leaf) => (
        <BrushLeaf key={leaf.id} leaf={leaf} />
      ))}

      {RSVP_FLORAL_BRUSH_BLOOMS.map((bloom) => (
        <BrushBloom key={bloom.id} bloom={bloom} />
      ))}
    </motion.div>
  );
}
