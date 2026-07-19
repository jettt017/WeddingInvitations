"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import DecorativeImage from "@/components/invitation/DecorativeImage";
import MusicButton from "@/components/invitation/MusicButton";
import StorySection from "@/components/invitation/StorySection";
import { STORY_ASSETS } from "@/lib/invitation-story";

interface GallerySectionProps {
  mode: "preview" | "expanded";
  onOpen: () => void;
  onClose: () => void;
}

function GalleryBackdrop() {
  const assets = STORY_ASSETS.gallery;

  return (
    <>
      <DecorativeImage
        src={assets.floralFrame}
        box={{ left: -266, top: -461, width: 908, height: 1614 }}
        sizes="908px"
        imageStyle={{ objectFit: "cover" }}
      />
      <DecorativeImage
        src={assets.foregroundLeaves}
        box={{ left: -302, top: -385, width: 980, height: 1744, filter: "blur(3.65px)" }}
        sizes="980px"
        imageStyle={{ objectFit: "cover" }}
      />
      <DecorativeImage
        src={assets.butterfly}
        box={{ left: 318, top: 715, width: 40, height: 72 }}
        sizes="40px"
        imageStyle={{ objectFit: "cover" }}
      />
      <h2 className="font-playfair absolute top-[57px] w-full text-center text-[30.699px] leading-[44.207px] tracking-[0.934px]">
        GALLERY
      </h2>
      <DecorativeImage
        src={assets.headingFlourish}
        box={{ left: 108, top: 119, width: 177, height: 13 }}
        sizes="177px"
        imageStyle={{ objectPosition: "bottom" }}
      />
    </>
  );
}

function Polaroid({ left, top, rotate = 0 }: { left: number; top: number; rotate?: number }) {
  return (
    <div
      aria-label="Gallery photo placeholder"
      className="absolute h-[223px] w-[199px] bg-[#D9D9D9] p-[9px] pb-[39px] shadow-sm"
      style={{ left, top, transform: `rotate(${rotate}deg)` }}
    >
      <div className="h-full w-full bg-black" />
    </div>
  );
}

function GalleryPreview({
  onOpen,
  shouldRestoreFocus,
}: {
  onOpen: () => void;
  shouldRestoreFocus: boolean;
}) {
  const assets = STORY_ASSETS.gallery;
  const viewMoreRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (shouldRestoreFocus) viewMoreRef.current?.focus();
  }, [shouldRestoreFocus]);

  return (
    <StorySection figmaNode="115:135" section="gallery-preview">
      <div data-figma-node="115:135" className="absolute inset-0">
        <GalleryBackdrop />
        <MusicButton className="top-5 left-5" />

        <Polaroid left={89} top={149} />
        <Polaroid left={67} top={318} rotate={-12.14} />
        <Polaroid left={126} top={467} rotate={12.32} />

        <button
          ref={viewMoreRef}
          type="button"
          onClick={onOpen}
          className="font-playfair absolute top-[747px] left-1/2 z-20 flex h-[50px] w-[297px] -translate-x-1/2 items-center justify-center gap-4 rounded-full bg-[#D6C8B6] text-[15.2px] font-bold tracking-[0.4px] text-[#453F2F] transition-transform active:scale-[0.98]"
        >
          VIEW MORE PHOTOS
          <Image src={assets.cameraIcon} alt="" width={20} height={18} />
        </button>
      </div>
    </StorySection>
  );
}

function GalleryExpanded({ onClose }: { onClose: () => void }) {
  const assets = STORY_ASSETS.gallery;
  const backButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    backButtonRef.current?.focus();
  }, []);

  return (
    <StorySection figmaNode="149:398" section="gallery-expanded">
      <div data-figma-node="149:398" className="absolute inset-0">
        <GalleryBackdrop />
        <button
          ref={backButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Back to gallery preview"
          className="absolute top-5 left-5 z-30 size-[34px] rounded-full"
        >
          <Image src={assets.backIcon} alt="" fill sizes="34px" />
        </button>
        <MusicButton className="top-5 left-[353px]" />
        <div className="absolute top-[170px] left-[23px] h-[617px] w-[347px] overflow-hidden">
          <Image
            src={assets.collage}
            alt="Wedding gallery collage"
            fill
            sizes="347px"
            className="object-cover"
          />
        </div>
      </div>
    </StorySection>
  );
}

export default function GallerySection({ mode, onOpen, onClose }: GallerySectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [shouldRestorePreviewFocus, setShouldRestorePreviewFocus] = useState(false);

  function handleOpen() {
    setShouldRestorePreviewFocus(false);
    onOpen();
  }

  function handleClose() {
    setShouldRestorePreviewFocus(true);
    onClose();
  }

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={mode}
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 1.015 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {mode === "preview" ? (
          <GalleryPreview onOpen={handleOpen} shouldRestoreFocus={shouldRestorePreviewFocus} />
        ) : (
          <GalleryExpanded onClose={handleClose} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
