"use client";

import {
  type FormEvent,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import DecorativeImage from "@/components/invitation/DecorativeImage";
import RsvpCelebration from "@/components/invitation/RsvpCelebration";
import StorySection from "@/components/invitation/StorySection";
import { type InvitationGuest, submitGuestRsvp } from "@/lib/invitation-api";
import { type RsvpFormValue, STORY_ASSETS, validateRsvp } from "@/lib/invitation-story";
import { RSVP_SUCCESS_DURATION_MS } from "@/lib/rsvp-celebration";
import {
  acquireRsvpSubmissionLease,
  releaseRsvpSubmissionLease,
  renewRsvpSubmissionLease,
  RSVP_SUBMISSION_LOCK_NAME,
} from "@/lib/rsvp-submission-lock";
import { supabase } from "@/lib/supabase";

interface RsvpSectionProps {
  mode: "intro" | "form" | "success";
  onOpen: () => void;
  onSubmitted: () => void;
  onClose: () => void;
  guest: InvitationGuest | null;
  completed?: boolean;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

const transition = { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const };

const anim = (delay: number, y = 20) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const fadeAnim = (delay: number) => ({
  initial: { opacity: 0, scale: 1.01 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] as const },
});

function RsvpIntro({
  onOpen,
  guest,
  completed = false,
  triggerRef,
}: {
  onOpen: () => void;
  guest: InvitationGuest | null;
  completed?: boolean;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}) {
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
          {completed ? (
            <>
              Thank you, your response is saved.
              <br />
              We look forward to celebrating with you.
            </>
          ) : (
            <>
              Kindly confirm your attendance
              <br />
              by filling out the form below.
            </>
          )}
        </motion.p>
        {completed ? (
          <motion.div
            role="status"
            className="font-playfair absolute top-[302px] left-1/2 flex h-[50px] w-[297px] -translate-x-1/2 items-center justify-center gap-4 rounded-full bg-[#D6C8B6] text-[15.2px] font-bold tracking-[0.4px] text-[#453F2F]"
            {...anim(0.35)}
          >
            RSVP RECEIVED
            <Image src={assets.envelope} alt="" width={22} height={19} />
          </motion.div>
        ) : (
          <motion.button
            ref={triggerRef}
            type="button"
            onClick={onOpen}
            disabled={!guest}
            className="font-playfair absolute top-[302px] left-1/2 flex h-[50px] w-[297px] -translate-x-1/2 items-center justify-center gap-4 rounded-full bg-[#D6C8B6] text-[15.2px] font-bold tracking-[0.4px] text-[#453F2F] transition-transform active:scale-[0.98]"
            {...anim(0.35)}
          >
            {guest ? "CONFIRM ATTENDANCE" : "PERSONAL LINK REQUIRED"}
            <Image src={assets.envelope} alt="" width={22} height={19} />
          </motion.button>
        )}
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
}
const containerVariants = {
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
    <>
      <RsvpCelebration />
      <motion.div
        ref={successRef}
        role="status"
        aria-live="polite"
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.94, y: 15, filter: "blur(3px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-playfair absolute top-[235px] left-1/2 z-20 w-[310px] -translate-x-1/2 overflow-hidden rounded-[28px] bg-[#D6C8B6]/90 px-7 py-10 text-center shadow-lg"
      >
        <h2 className="text-[34px] text-[#453F2F]">Thank You</h2>
        <p className="mt-4 text-[15px] leading-6 text-[#453F2F]/95">Your RSVP has been received.</p>

        <p className="mt-6 animate-pulse font-sans text-[10px] font-bold tracking-[0.2em] text-[#7C5649] uppercase motion-reduce:animate-none">
          Returning to invitation...
        </p>

        {/* Progress Bar / Countdown Loader */}
        <div className="absolute bottom-0 left-0 h-[4px] w-full overflow-hidden rounded-b-[28px] bg-[#7C5649]/20">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: RSVP_SUCCESS_DURATION_MS / 1_000, ease: "linear" }}
            className="h-full bg-[#7C5649]"
          />
        </div>
      </motion.div>
    </>
  );
}

type RsvpSubmissionOutcome = "submitted" | "already-completed" | "failed" | "busy";

function createRsvpSubmissionOwner(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function RsvpForm({
  mode,
  guest,
  onSubmitted,
  onClose,
  onAlreadyCompleted,
}: {
  mode: "form" | "success";
  guest: InvitationGuest | null;
  onSubmitted: () => void;
  onClose: () => void;
  onAlreadyCompleted?: () => boolean;
}) {
  const assets = STORY_ASSETS.rsvpForm;
  const isConfigured = supabase !== null;
  const canSubmit = isConfigured && guest !== null && !guest.hasRsvp;
  const formId = useId();
  const guestsErrorId = `${formId}-guests-error`;
  const guestsRef = useRef<HTMLInputElement>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const loadingStatusRef = useRef<HTMLDivElement>(null);
  const submissionInFlightRef = useRef(false);
  const isMountedRef = useRef(true);
  const [value, setValue] = useState<RsvpFormValue>({
    guests: 1,
    maxGuests: guest?.maxGuests ?? 1,
  });
  const [errors, setErrors] = useState<ReturnType<typeof validateRsvp>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);

  const handleClose = useCallback(() => {
    if (isSubmitting || submissionInFlightRef.current) return;
    onClose();
  }, [isSubmitting, onClose]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isSubmitting) loadingStatusRef.current?.focus();
  }, [isSubmitting]);

  useEffect(() => {
    if (isReviewing) confirmationRef.current?.focus();
  }, [isReviewing]);

  useEffect(() => {
    if (mode === "form") guestsRef.current?.focus();
    if (mode === "success") {
      const timer = setTimeout(() => {
        handleClose();
      }, RSVP_SUCCESS_DURATION_MS);
      return () => clearTimeout(timer);
    }
  }, [handleClose, mode]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInFlightRef.current) return;
    if (onAlreadyCompleted?.()) return;

    const nextErrors = validateRsvp(value);
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0 || !canSubmit) return;
    setIsReviewing(true);
  }

  async function handleConfirmedSubmit() {
    if (submissionInFlightRef.current) return;
    if (onAlreadyCompleted?.()) return;

    const client = supabase;
    if (!client || !guest) return;
    const configuredClient = client;
    const currentGuest = guest;

    submissionInFlightRef.current = true;
    setIsSubmitting(true);

    async function insertOnce(): Promise<RsvpSubmissionOutcome> {
      if (onAlreadyCompleted?.()) return "already-completed";

      const result = await submitGuestRsvp(configuredClient, currentGuest.slug, value.guests);
      if (result.status === "failed") return "failed";

      onSubmitted();
      return result.status;
    }

    let outcome: RsvpSubmissionOutcome = "failed";

    try {
      if (navigator.locks) {
        outcome = await navigator.locks.request(RSVP_SUBMISSION_LOCK_NAME, insertOnce);
      } else {
        let storage: Storage | null = null;
        try {
          storage = window.localStorage;
        } catch {
          // The in-tab guard still prevents double submits when browser storage is unavailable.
        }

        if (!storage) {
          outcome = await insertOnce();
        } else {
          const owner = createRsvpSubmissionOwner();
          if (!acquireRsvpSubmissionLease(storage, owner)) {
            outcome = "busy";
          } else {
            const renewalTimer = window.setInterval(() => {
              renewRsvpSubmissionLease(storage, owner);
            }, 10_000);

            try {
              outcome = await insertOnce();
            } finally {
              window.clearInterval(renewalTimer);
              releaseRsvpSubmissionLease(storage, owner);
            }
          }
        }
      }
    } catch {
      outcome = "failed";
    } finally {
      submissionInFlightRef.current = false;
      if (isMountedRef.current) setIsSubmitting(false);
    }

    if (!isMountedRef.current || outcome === "already-completed") return;

    if (outcome === "busy") {
      setSubmitError("An RSVP is already being saved in another tab. Please wait.");
      return;
    }

    if (outcome === "failed") {
      setIsReviewing(false);
      setSubmitError(
        "We could not verify or save your RSVP. Please check your connection and try again."
      );
      return;
    }
  }

  function handleBackToEdit() {
    setIsReviewing(false);
    window.requestAnimationFrame(() => guestsRef.current?.focus());
  }

  return (
    <StorySection figmaNode="116:190" section="rsvp-form">
      <div data-figma-node="116:190" className="absolute inset-0 overflow-hidden">
        {/* Background images fade & zoom in softly */}
        <motion.div
          variants={bgVariants}
          initial="hidden"
          animate="visible"
          className="pointer-events-none absolute inset-0 z-0 select-none"
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

        <div inert={isSubmitting || undefined} className="absolute inset-0">
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
                className="absolute top-[194px] left-[101px] h-[21px] w-[191px]"
              >
                <DecorativeImage
                  src={assets.headingFlourish}
                  box={{ left: 0, top: 0, width: 191, height: 21 }}
                  imageBox={{ left: 0, top: "-988.97%", width: "100%", height: "1588.97%" }}
                  sizes="191px"
                />
              </motion.div>

              {isReviewing ? (
                <motion.section
                  variants={itemVariants}
                  role="alertdialog"
                  aria-labelledby={`${formId}-confirmation-title`}
                  aria-describedby={`${formId}-confirmation-warning`}
                  className="absolute top-[222px] left-[25px] w-[343px] rounded-[26px] border border-[#7C5649]/15 bg-[#E9DCCB]/95 px-6 py-7 text-[#453F2F] shadow-[0_18px_45px_-24px_rgba(69,63,47,0.65)] backdrop-blur-[2px]"
                >
                  <h3
                    ref={confirmationRef}
                    id={`${formId}-confirmation-title`}
                    tabIndex={-1}
                    className="font-playfair text-center text-[25px] leading-8 outline-none"
                  >
                    Confirm Your RSVP
                  </h3>
                  <p
                    id={`${formId}-confirmation-warning`}
                    className="font-literata mt-3 text-center text-[11px] leading-[17px] text-[#7C2D24]"
                  >
                    Please make sure your RSVP details are correct. Your response cannot be changed
                    after it is sent.
                  </p>

                  <dl className="font-playfair mt-5 space-y-3 rounded-[18px] bg-[#FAEBE0]/80 px-5 py-4 text-[13px]">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-[#62483E]/75">Guest</dt>
                      <dd className="max-w-[190px] text-right font-semibold">
                        {guest?.displayName ?? "Invitation not found"}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-[#62483E]/75">Guests</dt>
                      <dd className="text-right font-semibold">{value.guests}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleBackToEdit}
                      className="font-playfair h-[46px] rounded-full border border-[#7C5649] text-[11px] font-bold tracking-[0.04em] text-[#7C5649] focus-visible:ring-2 focus-visible:ring-[#7C5649] focus-visible:outline-none"
                    >
                      BACK TO EDIT
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleConfirmedSubmit}
                      className="font-playfair h-[46px] rounded-full bg-[#7C5649] px-3 text-[11px] font-bold tracking-[0.04em] text-white shadow-md focus-visible:ring-2 focus-visible:ring-[#7C5649] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      YES, SEND RSVP
                    </button>
                  </div>
                </motion.section>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="absolute top-[236px] left-[25px] w-[343px]"
                >
                  <motion.div
                    variants={itemVariants}
                    className="font-playfair rounded-[18px] bg-[#D6C8B6]/90 px-5 py-4 text-[14px] text-[#453F2F]"
                  >
                    <span className="block text-[11px] tracking-[0.08em] text-[#62483E]/70 uppercase">
                      Invitation for
                    </span>
                    <strong className="mt-1 block text-[17px] font-semibold">
                      {guest?.displayName ?? "Personal invitation not found"}
                    </strong>
                  </motion.div>

                  <motion.label
                    variants={itemVariants}
                    className="font-playfair mt-4 block text-[15px] text-[#453F2F]"
                  >
                    Number of guests:
                    <input
                      ref={guestsRef}
                      type="number"
                      min={1}
                      max={guest?.maxGuests ?? 1}
                      value={value.guests}
                      onChange={(event) =>
                        setValue((current) => ({ ...current, guests: Number(event.target.value) }))
                      }
                      aria-invalid={Boolean(errors.guests)}
                      aria-describedby={errors.guests ? guestsErrorId : undefined}
                      className="mt-3 h-[49px] w-full rounded-full bg-[#D6C8B6] px-5 transition-shadow duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#7C5649]"
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
                    disabled={!canSubmit || isSubmitting}
                    className="font-playfair mt-6 h-[49px] w-full rounded-full bg-[#7C5649] text-[14.5px] text-white shadow-md transition-colors hover:bg-[#684439] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5649] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? "SENDING..." : "CONFIRM"}
                  </motion.button>
                  {!isConfigured ? (
                    <p className="font-playfair mt-3 text-center text-xs text-[#62483E]">
                      RSVP will be available soon.
                    </p>
                  ) : !guest ? (
                    <p className="font-playfair mt-3 text-center text-xs text-[#62483E]">
                      Open this invitation using your personal guest link.
                    </p>
                  ) : guest.hasRsvp ? (
                    <p className="font-playfair mt-3 text-center text-xs text-[#62483E]">
                      Your RSVP has already been received.
                    </p>
                  ) : null}
                  {submitError ? (
                    <p role="alert" className="mt-3 text-center text-xs text-[#7C2D24]">
                      {submitError}
                    </p>
                  ) : null}
                </form>
              )}
            </motion.div>
          )}
        </div>
        {isSubmitting && (
          <div
            ref={loadingStatusRef}
            role="status"
            aria-live="polite"
            tabIndex={-1}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#FAEBE0]/80 backdrop-blur-[1.5px] outline-none"
          >
            <svg
              className="mb-4 h-10 w-10 animate-spin text-[#7C5649] motion-reduce:animate-none"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="font-playfair animate-pulse text-[15px] font-medium tracking-widest text-[#7C5649] uppercase motion-reduce:animate-none">
              Saving response...
            </p>
          </div>
        )}
      </div>
    </StorySection>
  );
}

export default function RsvpSection({
  mode,
  onOpen,
  onSubmitted,
  onClose,
  guest,
  completed = false,
  triggerRef,
}: RsvpSectionProps) {
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
          <RsvpIntro onOpen={onOpen} guest={guest} completed={completed} triggerRef={triggerRef} />
        ) : (
          <RsvpForm guest={guest} mode={mode} onSubmitted={onSubmitted} onClose={onClose} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
