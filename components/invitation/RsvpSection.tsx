"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import DecorativeImage from "@/components/invitation/DecorativeImage";
import MusicButton from "@/components/invitation/MusicButton";
import StorySection from "@/components/invitation/StorySection";
import { type RsvpFormValue, STORY_ASSETS, validateRsvp } from "@/lib/invitation-story";
import { supabase } from "@/lib/supabase";

interface RsvpSectionProps {
  mode: "intro" | "form" | "success";
  onOpen: () => void;
  onSubmitted: () => void;
  onClose: () => void;
}

const transition = { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const };

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

function RsvpIntro({ onOpen }: { onOpen: () => void }) {
  const assets = STORY_ASSETS.rsvp;

  return (
    <StorySection figmaNode="115:151" section="rsvp-intro">
      <div data-figma-node="115:151" className="absolute inset-0">
        <DecorativeImage
          src={assets.topCanopy}
          box={{ left: -65, top: -58, width: 522, height: 301 }}
          sizes="522px"
          imageStyle={{ objectPosition: "bottom" }}
          {...fadeAnim(0.1)}
        />
        <DecorativeImage
          src={assets.blurredVines}
          box={{ left: -545, top: -102, width: 1136, height: 269, filter: "blur(3.5px)" }}
          imageBox={{ left: "-0.01%", top: "-345.35%", width: "100.02%", height: "750.93%" }}
          sizes="1136px"
          {...fadeAnim(0.15)}
        />
        <MusicButton className="top-5 left-5" />

        <motion.h2
          className="font-playfair absolute top-[94px] left-1/2 -translate-x-1/2 text-[45.052px] leading-[64.876px] tracking-[1.3707px]"
          {...anim(0.2)}
        >
          RSVP
        </motion.h2>
        <DecorativeImage
          src={assets.headingFlourish}
          box={{ left: 81, top: 172, width: 231, height: 37 }}
          sizes="231px"
          imageStyle={{ objectPosition: "bottom" }}
          {...fadeAnim(0.25)}
        />
        <motion.p
          className="font-playfair absolute top-[224px] w-full text-center text-[14.5px] leading-6 tracking-[0.291px]"
          {...anim(0.3)}
        >
          Kindly confirm your attendance
          <br />
          by filling out the form below.
        </motion.p>
        <motion.button
          type="button"
          onClick={onOpen}
          className="font-playfair absolute top-[302px] left-1/2 flex h-[50px] w-[297px] -translate-x-1/2 items-center justify-center gap-4 rounded-full bg-[#D6C8B6] text-[15.2px] font-bold tracking-[0.4px] text-[#453F2F] transition-transform active:scale-[0.98]"
          {...anim(0.35)}
        >
          CONFIRM ATTENDANCE
          <Image src={assets.envelope} alt="" width={22} height={19} />
        </motion.button>
        <DecorativeImage
          src={assets.tornTransition}
          box={{ left: 0, top: 436, width: 393, height: 183, transform: "rotate(180deg)" }}
          sizes="393px"
          {...fadeAnim(0.4)}
        />
        <DecorativeImage
          src={assets.paperTear}
          box={{
            left: -236,
            top: 381,
            width: 948,
            height: 129,
            transform: "rotate(-177.32deg) scaleY(-1)",
          }}
          imageBox={{ left: 0, top: "-938.89%", width: "100%", height: "1977.78%" }}
          sizes="948px"
          {...fadeAnim(0.45)}
        />
      </div>
    </StorySection>
  );
}const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(2.5px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const bgVariants = {
  hidden: { opacity: 0, scale: 1.03, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function RsvpSuccess() {
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    successRef.current?.focus();
  }, []);

  return (
    <motion.div
      ref={successRef}
      role="status"
      aria-live="polite"
      tabIndex={-1}
      initial={{ opacity: 0, scale: 0.94, y: 15, filter: "blur(3px)" }}
      animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="font-playfair absolute top-[235px] left-1/2 w-[310px] -translate-x-1/2 rounded-[28px] bg-[#D6C8B6]/90 px-7 py-10 text-center shadow-lg"
    >
      <h2 className="text-[34px]">Thank You</h2>
      <p className="mt-4 text-[15px] leading-6">Your RSVP has been received.</p>
    </motion.div>
  );
}

export function RsvpForm({
  mode,
  onSubmitted,
  onClose,
}: {
  mode: "form" | "success";
  onSubmitted: () => void;
  onClose: () => void;
}) {
  const assets = STORY_ASSETS.rsvpForm;
  const isConfigured = supabase !== null;
  const formId = useId();
  const attendanceErrorId = `${formId}-attendance-error`;
  const nameErrorId = `${formId}-name-error`;
  const guestsErrorId = `${formId}-guests-error`;
  const attendanceRef = useRef<HTMLSelectElement>(null);
  const [value, setValue] = useState<RsvpFormValue>({ attendance: "", name: "", guests: 1 });
  const [errors, setErrors] = useState<ReturnType<typeof validateRsvp>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "form") attendanceRef.current?.focus();
  }, [mode]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateRsvp(value);
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0 || !isConfigured || !supabase) return;

    setIsSubmitting(true);
    const { error } = await supabase.from("rsvps").insert({
      name: value.name.trim(),
      attending: value.attendance === "attending",
      guests: value.guests,
    });
    setIsSubmitting(false);

    if (error) {
      setSubmitError("Your response could not be sent. Please try again.");
      return;
    }

    onSubmitted();
  }

  return (
    <StorySection figmaNode="116:190" section="rsvp-form">
      <div data-figma-node="116:190" className="absolute inset-0 overflow-hidden">
        {/* Background images fade & zoom in softly */}
        <motion.div
          variants={bgVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-0 z-0 select-none pointer-events-none"
        >
          <DecorativeImage
            src={assets.topVines}
            box={{ left: -432, top: -921, width: 1189, height: 2113 }}
            sizes="1189px"
            imageStyle={{ objectFit: "cover" }}
          />
          <DecorativeImage
            src={assets.bottomLandscape}
            box={{ left: -80, top: 339, width: 553, height: 984 }}
            sizes="553px"
            imageStyle={{ objectFit: "cover" }}
          />
          <DecorativeImage
            src={assets.sideVines}
            box={{ left: -887, top: -313, width: 982, height: 1746, transform: "scaleY(-1)" }}
            sizes="982px"
            imageStyle={{ objectFit: "cover" }}
          />
          <DecorativeImage
            src={assets.sideVines}
            box={{ left: 286, top: -298, width: 982, height: 1746, transform: "scaleY(-1)" }}
            sizes="982px"
            imageStyle={{ objectFit: "cover" }}
          />
        </motion.div>

        {/* Buttons slide/fade in */}
        <motion.button
          type="button"
          onClick={onClose}
          aria-label="Back to invitation"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-5 left-5 z-30 size-[34px] rounded-full hover:scale-105 active:scale-95 transition-transform"
        >
          <Image src={STORY_ASSETS.gallery.backIcon} alt="" fill sizes="34px" />
        </motion.button>
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-5 left-[353px] z-30"
        >
          <MusicButton />
        </motion.div>

        {mode === "success" ? (
          <RsvpSuccess />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="absolute inset-0"
          >
            <motion.h2
              variants={itemVariants}
              className="font-playfair absolute top-[49px] w-full text-center text-[52.628px] leading-[75.784px] tracking-[1.6011px]"
            >
              “RSVP”
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="font-playfair absolute top-[136px] w-full text-center text-[14.504px] leading-[19px] text-[#453F2F]/90"
            >
              Please send your
              <br />
              RSVP for Kinan &amp; Faiz
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="absolute top-[194px] left-[101px] w-[191px] h-[21px]"
            >
              <DecorativeImage
                src={assets.headingFlourish}
                box={{ left: 0, top: 0, width: 191, height: 21 }}
                imageBox={{ left: 0, top: "-988.97%", width: "100%", height: "1588.97%" }}
                sizes="191px"
              />
            </motion.div>

            <form onSubmit={handleSubmit} className="absolute top-[236px] left-[25px] w-[343px]">
              <motion.label variants={itemVariants} className="font-playfair block text-[15px] text-[#453F2F]">
                Your Response:
                <select
                  ref={attendanceRef}
                  value={value.attendance}
                  onChange={(event) =>
                    setValue((current) => ({
                      ...current,
                      attendance: event.target.value as RsvpFormValue["attendance"],
                    }))
                  }
                  aria-invalid={Boolean(errors.attendance)}
                  aria-describedby={errors.attendance ? attendanceErrorId : undefined}
                  className="mt-3 h-[49px] w-full appearance-none rounded-full bg-[#D6C8B6] px-5 outline-none focus-visible:ring-2 focus-visible:ring-[#7C5649] transition-shadow duration-300"
                >
                  <option value="">Select response</option>
                  <option value="attending">Joyfully attending</option>
                  <option value="not_attending">Unable to attend</option>
                </select>
              </motion.label>
              {errors.attendance ? (
                <p id={attendanceErrorId} className="mt-1 text-xs text-[#7C2D24]">
                  {errors.attendance}
                </p>
              ) : null}

              <motion.label variants={itemVariants} className="font-playfair mt-4 block text-[15px] text-[#453F2F]">
                Name of guest:
                <input
                  value={value.name}
                  onChange={(event) =>
                    setValue((current) => ({ ...current, name: event.target.value }))
                  }
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? nameErrorId : undefined}
                  className="mt-3 h-[49px] w-full rounded-full bg-[#D6C8B6] px-5 outline-none focus-visible:ring-2 focus-visible:ring-[#7C5649] transition-shadow duration-300"
                />
              </motion.label>
              {errors.name ? (
                <p id={nameErrorId} className="mt-1 text-xs text-[#7C2D24]">
                  {errors.name}
                </p>
              ) : null}

              <motion.label variants={itemVariants} className="font-playfair mt-4 block text-[15px] text-[#453F2F]">
                Number of guests:
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={value.guests}
                  onChange={(event) =>
                    setValue((current) => ({ ...current, guests: Number(event.target.value) }))
                  }
                  aria-invalid={Boolean(errors.guests)}
                  aria-describedby={errors.guests ? guestsErrorId : undefined}
                  className="mt-3 h-[49px] w-full rounded-full bg-[#D6C8B6] px-5 outline-none focus-visible:ring-2 focus-visible:ring-[#7C5649] transition-shadow duration-300"
                />
              </motion.label>
              {errors.guests ? (
                <p id={guestsErrorId} className="mt-1 text-xs text-[#7C2D24]">
                  {errors.guests}
                </p>
              ) : null}

              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                type="submit"
                disabled={!isConfigured || isSubmitting}
                className="font-playfair mt-[50px] h-[49px] w-full rounded-full bg-[#7C5649] text-[14.5px] text-white disabled:cursor-not-allowed disabled:opacity-70 transition-colors hover:bg-[#684439] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5649] shadow-md"
              >
                {isSubmitting ? "SENDING..." : "CONFIRM"}
              </motion.button>
              {!isConfigured ? (
                <p className="font-playfair mt-3 text-center text-xs text-[#62483E]">
                  RSVP will be available soon.
                </p>
              ) : null}
              {submitError ? (
                <p role="alert" className="mt-3 text-center text-xs text-[#7C2D24]">
                  {submitError}
                </p>
              ) : null}
            </form>
          </motion.div>
        )}
      </div>
    </StorySection>
  );
}

export default function RsvpSection({ mode, onOpen, onSubmitted, onClose }: RsvpSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={mode === "intro" ? "intro" : "form"}
        initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 18 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: shouldReduceMotion ? 0 : -18 }}
        transition={shouldReduceMotion ? { duration: 0 } : transition}
      >
        {mode === "intro" ? (
          <RsvpIntro onOpen={onOpen} />
        ) : (
          <RsvpForm mode={mode} onSubmitted={onSubmitted} onClose={onClose} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
