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
import MusicButton from "@/components/invitation/MusicButton";
import RsvpCelebration from "@/components/invitation/RsvpCelebration";
import StorySection from "@/components/invitation/StorySection";
import { isPersonalizedGuestName } from "@/lib/invitation";
import { type RsvpFormValue, STORY_ASSETS, validateRsvp } from "@/lib/invitation-story";
import { RSVP_SUCCESS_DURATION_MS } from "@/lib/rsvp-celebration";
import { findRsvpByGuestName, normalizeRsvpGuestName } from "@/lib/rsvp-guest";
import {
  acquireRsvpSubmissionLease,
  releaseRsvpSubmissionLease,
  renewRsvpSubmissionLease,
  RSVP_SUBMISSION_LOCK_NAME,
} from "@/lib/rsvp-persistence";
import { supabase } from "@/lib/supabase";

interface RsvpSectionProps {
  mode: "intro" | "form" | "success";
  onOpen: () => void;
  onSubmitted: () => void;
  onClose: () => void;
  rsvpState?: "intro" | "form" | "success";
  completed?: boolean;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

const transition = { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const };

const anim = (delay: number, y = 20) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-60px" },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const fadeAnim = (delay: number) => ({
  initial: { opacity: 0, scale: 1.01 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: false, margin: "-60px" },
  transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] as const },
});

interface Wish {
  id: string;
  name: string;
  wishes: string;
  created_at: string;
}

function getRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    if (diffMs < 0) return "Baru saja";
    
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    
    if (diffSecs < 60) {
      return "Baru saja";
    } else if (diffMins < 60) {
      return `${diffMins} menit yang lalu`;
    } else if (diffHours < 24) {
      return `${diffHours} jam yang lalu`;
    } else if (diffDays < 7) {
      return `${diffDays} hari yang lalu`;
    } else {
      return `${diffWeeks} minggu yang lalu`;
    }
  } catch (e) {
    return "";
  }
}

function RsvpIntro({
  onOpen,
  rsvpState,
  completed = false,
  triggerRef,
}: {
  onOpen: () => void;
  rsvpState?: "intro" | "form" | "success";
  completed?: boolean;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}) {
  const assets = STORY_ASSETS.rsvp;
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishes() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("rsvps")
          .select("id, name, wishes, created_at")
          .not("wishes", "is", null)
          .neq("wishes", "")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setWishes(data || []);
      } catch (err) {
        console.error("Error fetching wishes:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWishes();

    if (supabase) {
      const client = supabase;
      const channel = client
        .channel("realtime-wishes")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "rsvps",
          },
          (payload) => {
            const newRsvp = payload.new as Wish;
            if (newRsvp.wishes) {
              setWishes((prev) => {
                if (prev.some((w) => w.id === newRsvp.id)) return prev;
                return [newRsvp, ...prev];
              });
            }
          }
        )
        .subscribe();

      return () => {
        client.removeChannel(channel);
      };
    }
  }, [rsvpState]);

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
          {completed ? (
            <>
              Thank you, your response is saved.
              <br />
              Your wedding gift details are now available.
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
            className="font-playfair absolute top-[302px] left-1/2 flex h-[50px] w-[297px] -translate-x-1/2 items-center justify-center gap-4 rounded-full bg-[#D6C8B6] text-[15.2px] font-bold tracking-[0.4px] text-[#453F2F] transition-transform active:scale-[0.98]"
            {...anim(0.35)}
          >
            CONFIRM ATTENDANCE
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

        {/* Wishes List overlay in the empty space below the RSVP button */}
        <div className="absolute top-[480px] left-[25px] z-20 flex h-[330px] w-[343px] flex-col text-[#453F2F]">
          <h3 className="font-playfair text-center text-[18px] font-bold tracking-[0.05em] uppercase">
            Wishes & Prayers
          </h3>
          <div className="mx-auto mt-1 mb-4 h-[0.5px] w-16 bg-[#7C5649]/40" />

          <div className="relative flex-1 min-h-0">
            <div className="h-full [scrollbar-width:none] space-y-3.5 overflow-y-auto px-2 pb-10 [&::-webkit-scrollbar]:hidden">
              {loading ? (
                <p className="font-literata mt-8 text-center text-xs text-[#7C5649]/60 italic">
                  Loading wishes...
                </p>
              ) : wishes.length === 0 ? (
                <p className="font-literata mt-8 text-center text-xs text-[#7C5649]/60 italic">
                  Be the first to leave a wish!
                </p>
              ) : (
                wishes.map((w, index) => (
                  <motion.div
                    key={w.id || index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
                    className="border-b border-[#7C5649]/15 pb-3.5 pt-1.5 last:border-b-0"
                  >
                    <div className="flex justify-between items-baseline gap-2">
                      <p className="font-playfair text-[13px] font-bold text-[#453F2F] tracking-wide">{w.name}</p>
                      {w.created_at && (
                        <span className="font-sans text-[9px] tracking-wider text-[#7C5649]/55 font-medium shrink-0">
                          {getRelativeTime(w.created_at)}
                        </span>
                      )}
                    </div>
                    <p className="font-literata mt-1.5 text-[12px] leading-[17px] whitespace-pre-line text-[#62483E] italic">
                      &ldquo;{w.wishes}&rdquo;
                    </p>
                  </motion.div>
                ))
              )}
            </div>
            {/* Smooth Fade Mask at the bottom scroll boundary */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#FAEBE0] to-transparent pointer-events-none z-10" />
          </div>
        </div>
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
  guestName = "object",
  onSubmitted,
  onClose,
  onAlreadyCompleted,
}: {
  mode: "form" | "success";
  guestName?: string;
  onSubmitted: () => void;
  onClose: () => void;
  onAlreadyCompleted?: () => boolean;
}) {
  const assets = STORY_ASSETS.rsvpForm;
  const isConfigured = supabase !== null;
  const isPersonalizedGuest = isPersonalizedGuestName(guestName);
  const formId = useId();
  const attendanceErrorId = `${formId}-attendance-error`;
  const nameErrorId = `${formId}-name-error`;
  const guestsErrorId = `${formId}-guests-error`;
  const attendanceRef = useRef<HTMLSelectElement>(null);
  const confirmationRef = useRef<HTMLHeadingElement>(null);
  const loadingStatusRef = useRef<HTMLDivElement>(null);
  const submissionInFlightRef = useRef(false);
  const isMountedRef = useRef(true);
  const [value, setValue] = useState<RsvpFormValue>({
    attendance: "",
    name: isPersonalizedGuest ? guestName : "",
    guests: 1,
    wishes: "",
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
    if (mode === "form") attendanceRef.current?.focus();
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

    const nextErrors = validateRsvp({
      ...value,
      name: isPersonalizedGuest ? guestName : value.name,
    });
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0 || !isConfigured) return;
    setIsReviewing(true);
  }

  async function handleConfirmedSubmit() {
    if (submissionInFlightRef.current) return;
    if (onAlreadyCompleted?.()) return;

    const client = supabase;
    if (!client) return;
    const configuredClient = client;
    const guestIdentity = normalizeRsvpGuestName(isPersonalizedGuest ? guestName : value.name);

    submissionInFlightRef.current = true;
    setIsSubmitting(true);

    async function insertOnce(): Promise<RsvpSubmissionOutcome> {
      if (onAlreadyCompleted?.()) return "already-completed";

      const lookup = await findRsvpByGuestName(configuredClient, guestIdentity);
      if (lookup === "found") {
        onSubmitted();
        return "already-completed";
      }
      if (lookup === "failed") return "failed";

      const { error } = await configuredClient.from("rsvps").insert({
        name: guestIdentity,
        attending: value.attendance === "attending",
        guests: value.guests,
        wishes: value.wishes?.trim() || null,
      });

      if (error) return "failed";

      onSubmitted();
      return "submitted";
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
    window.requestAnimationFrame(() => attendanceRef.current?.focus());
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
          {/* Buttons slide/fade in */}
          <motion.button
            type="button"
            disabled={isSubmitting}
            onClick={handleClose}
            aria-label="Back to invitation"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-5 left-5 z-30 size-[34px] rounded-full transition-transform hover:scale-105 active:scale-95"
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
                      <dt className="text-[#62483E]/75">Attendance</dt>
                      <dd className="text-right font-semibold">
                        {value.attendance === "attending"
                          ? "Joyfully attending"
                          : "Unable to attend"}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-[#62483E]/75">Guest</dt>
                      <dd className="max-w-[190px] text-right font-semibold">
                        {normalizeRsvpGuestName(isPersonalizedGuest ? guestName : value.name)}
                      </dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-[#62483E]/75">Guests</dt>
                      <dd className="text-right font-semibold">{value.guests}</dd>
                    </div>
                    {value.wishes?.trim() ? (
                      <div className="border-t border-[#7C5649]/15 pt-3">
                        <dt className="text-[#62483E]/75">Wishes &amp; Prayers</dt>
                        <dd className="font-literata mt-1 max-h-[74px] overflow-y-auto text-[11px] leading-[16px] whitespace-pre-wrap italic">
                          {value.wishes.trim()}
                        </dd>
                      </div>
                    ) : null}
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
                  <motion.label
                    variants={itemVariants}
                    className="font-playfair block text-[15px] text-[#453F2F]"
                  >
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
                      className="mt-3 h-[49px] w-full appearance-none rounded-full bg-[#D6C8B6] px-5 transition-shadow duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#7C5649]"
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

                  <motion.label
                    variants={itemVariants}
                    className="font-playfair mt-4 block text-[15px] text-[#453F2F]"
                  >
                    Name of guest:
                    <input
                      value={isPersonalizedGuest ? guestName : value.name}
                      readOnly={isPersonalizedGuest}
                      onChange={(event) =>
                        setValue((current) => ({ ...current, name: event.target.value }))
                      }
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? nameErrorId : undefined}
                      className="mt-3 h-[49px] w-full rounded-full bg-[#D6C8B6] px-5 transition-shadow duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#7C5649]"
                    />
                  </motion.label>
                  {errors.name ? (
                    <p id={nameErrorId} className="mt-1 text-xs text-[#7C2D24]">
                      {errors.name}
                    </p>
                  ) : null}

                  <motion.label
                    variants={itemVariants}
                    className="font-playfair mt-4 block text-[15px] text-[#453F2F]"
                  >
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
                      className="mt-3 h-[49px] w-full rounded-full bg-[#D6C8B6] px-5 transition-shadow duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#7C5649]"
                    />
                  </motion.label>
                  {errors.guests ? (
                    <p id={guestsErrorId} className="mt-1 text-xs text-[#7C2D24]">
                      {errors.guests}
                    </p>
                  ) : null}

                  <motion.label
                    variants={itemVariants}
                    className="font-playfair mt-4 block text-[15px] text-[#453F2F]"
                  >
                    Wishes & Prayers:
                    <textarea
                      rows={2}
                      value={value.wishes}
                      onChange={(event) =>
                        setValue((current) => ({ ...current, wishes: event.target.value }))
                      }
                      className="mt-3 w-full resize-none rounded-[18px] bg-[#D6C8B6] px-5 py-3 font-sans text-sm transition-shadow duration-300 outline-none focus-visible:ring-2 focus-visible:ring-[#7C5649]"
                      placeholder="Leave a message for Kinan & Faiz..."
                    />
                  </motion.label>

                  <motion.button
                    variants={itemVariants}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    disabled={!isConfigured || isSubmitting}
                    className="font-playfair mt-6 h-[49px] w-full rounded-full bg-[#7C5649] text-[14.5px] text-white shadow-md transition-colors hover:bg-[#684439] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5649] disabled:cursor-not-allowed disabled:opacity-70"
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
  rsvpState,
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
          <RsvpIntro
            onOpen={onOpen}
            rsvpState={rsvpState}
            completed={completed}
            triggerRef={triggerRef}
          />
        ) : (
          <RsvpForm mode={mode} onSubmitted={onSubmitted} onClose={onClose} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
