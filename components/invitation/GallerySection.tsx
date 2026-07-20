"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import DecorativeImage from "@/components/invitation/DecorativeImage";
import MusicButton from "@/components/invitation/MusicButton";
import StorySection from "@/components/invitation/StorySection";
import { STORY_ASSETS, STORY_PHOTOS } from "@/lib/invitation-story";

const anim = (delay: number, y = 20) => ({
  initial: { opacity: 0, y, filter: "blur(2px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: false, margin: "-60px" },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const fadeAnim = (delay: number) => ({
  initial: { opacity: 0, scale: 1.01 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: false, margin: "-60px" },
  transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] as const },
});

interface GallerySectionProps {
  mode: "preview" | "expanded";
  onOpen: () => void;
  onClose: () => void;
}

function GalleryBackdrop({ isPreview = false }: { isPreview?: boolean }) {
  const assets = STORY_ASSETS.gallery;

  return (
    <>
      <DecorativeImage
        src={assets.floralFrame}
        box={{ left: -266, top: -461, width: 908, height: 1614 }}
        sizes="908px"
        imageStyle={{ objectFit: "cover" }}
        {...(isPreview ? fadeAnim(0.1) : {})}
      />
      <DecorativeImage
        src={assets.foregroundLeaves}
        box={{ left: -302, top: -385, width: 980, height: 1744, filter: "blur(3.65px)" }}
        sizes="980px"
        imageStyle={{ objectFit: "cover" }}
        {...(isPreview ? fadeAnim(0.15) : {})}
      />
      <DecorativeImage
        src={assets.butterfly}
        box={{ left: 318, top: 715, width: 40, height: 72 }}
        sizes="40px"
        imageStyle={{ objectFit: "cover" }}
        {...(isPreview ? fadeAnim(0.4) : {})}
      />
      {isPreview ? (
        <motion.h2
          className="font-playfair absolute top-[57px] w-full text-center text-[30.699px] leading-[44.207px] tracking-[0.934px]"
          {...anim(0.15)}
        >
          GALLERY
        </motion.h2>
      ) : (
        <h2 className="font-playfair absolute top-[57px] w-full text-center text-[30.699px] leading-[44.207px] tracking-[0.934px]">
          GALLERY
        </h2>
      )}
      <DecorativeImage
        src={assets.headingFlourish}
        box={{ left: 108, top: 119, width: 177, height: 13 }}
        sizes="177px"
        imageStyle={{ objectPosition: "bottom" }}
        {...(isPreview ? fadeAnim(0.2) : {})}
      />
    </>
  );
}

type GalleryPhoto =
  | typeof STORY_PHOTOS.galleryFeature01
  | typeof STORY_PHOTOS.galleryFeature02
  | typeof STORY_PHOTOS.galleryFeature03;

function Polaroid({
  photo,
  left,
  top,
  rotate = 0,
  delay,
}: {
  photo: GalleryPhoto;
  left: number;
  top: number;
  rotate?: number;
  delay: number;
}) {
  const fallback = photo.fallbacks[0];

  return (
    <motion.div
      className="absolute h-[223px] w-[199px] bg-[#D9D9D9] p-[9px] pb-[39px] shadow-sm"
      style={{ left, top, rotate }}
      {...anim(delay, 25)}
    >
      <div className="relative h-full w-full overflow-hidden">
        <Image
          src={fallback.src}
          alt={photo.alt}
          fill
          sizes="181px"
          className="object-cover"
          style={{ objectPosition: fallback.objectPosition }}
        />
      </div>
    </motion.div>
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
        <GalleryBackdrop isPreview />
        <MusicButton className="top-5 left-5" />

        <Polaroid photo={STORY_PHOTOS.galleryFeature01} left={89} top={149} delay={0.25} />
        <Polaroid
          photo={STORY_PHOTOS.galleryFeature02}
          left={67}
          top={318}
          rotate={-12.14}
          delay={0.3}
        />
        <Polaroid
          photo={STORY_PHOTOS.galleryFeature03}
          left={126}
          top={467}
          rotate={12.32}
          delay={0.35}
        />

        <motion.button
          ref={viewMoreRef}
          type="button"
          onClick={onOpen}
          className="font-playfair absolute top-[747px] left-1/2 z-20 flex h-[50px] w-[297px] -translate-x-1/2 items-center justify-center gap-4 rounded-full bg-[#D6C8B6] text-[15.2px] font-bold tracking-[0.4px] text-[#453F2F] transition-transform active:scale-[0.98]"
          {...anim(0.4)}
        >
          VIEW MORE PHOTOS
          <Image src={assets.cameraIcon} alt="" width={20} height={18} />
        </motion.button>
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
