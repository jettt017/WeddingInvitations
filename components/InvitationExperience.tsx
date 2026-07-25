"use client";

import {
  type KeyboardEvent,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";

import InvitationStory from "@/components/invitation/InvitationStory";
import { RsvpForm } from "@/components/invitation/RsvpSection";
import HeroBackground from "@/components/splash-screen/HeroBackground";
import { invitationViewReducer, isPersonalizedGuestName, resolveGuestName } from "@/lib/invitation";
import {
  INITIAL_STORY_INTERACTION,
  storyInteractionReducer,
  calculateInvitationScale,
  INVITATION_DESIGN_WIDTH,
} from "@/lib/invitation-story";
import {
  loadInvitationAccessSafely,
  persistInvitationAccessSafely,
  RSVP_ACCESS_STORAGE_KEY,
} from "@/lib/rsvp-persistence";
import { findRsvpByGuestName } from "@/lib/rsvp-guest";
import { supabase } from "@/lib/supabase";

const transitionEase = [0.16, 1, 0.3, 1] as const;
const dialogFocusableSelector =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function subscribeToViewport(onStoreChange: () => void): () => void {
  window.addEventListener("resize", onStoreChange);
  return () => window.removeEventListener("resize", onStoreChange);
}

function getViewportWidth(): number {
  return window.innerWidth;
}

function getServerViewportWidth(): number {
  return INVITATION_DESIGN_WIDTH;
}

function subscribeToGuestName(onStoreChange: () => void): () => void {
  window.addEventListener("popstate", onStoreChange);
  return () => window.removeEventListener("popstate", onStoreChange);
}

function getGuestName(): string {
  return resolveGuestName(window.location.search);
}

function getServerGuestName(): string {
  return resolveGuestName("");
}

export default function InvitationExperience() {
  const [view, dispatch] = useReducer(invitationViewReducer, "splash");
  const [interaction, dispatchInteraction] = useReducer(
    storyInteractionReducer,
    INITIAL_STORY_INTERACTION
  );
  const shouldReduceMotion = useReducedMotion();
  const [isRsvpDialogExiting, setIsRsvpDialogExiting] = useState(false);
  const rsvpTriggerRef = useRef<HTMLButtonElement>(null);
  const transactionRevealRef = useRef<HTMLButtonElement>(null);
  const rsvpDialogRef = useRef<HTMLDivElement>(null);
  const isRsvpDialogClosingRef = useRef(false);
  const shouldFocusRsvpTriggerRef = useRef(false);
  const shouldFocusTransactionRef = useRef(false);

  const viewportWidth = useSyncExternalStore(
    subscribeToViewport,
    getViewportWidth,
    getServerViewportWidth
  );
  const guestName = useSyncExternalStore(subscribeToGuestName, getGuestName, getServerGuestName);
  const isPersonalizedGuest = isPersonalizedGuestName(guestName);
  const scale = calculateInvitationScale(viewportWidth);
  const isRsvpOverlayOpen =
    view === "main" && (interaction.rsvp === "form" || interaction.rsvp === "success");
  const shouldHideStory = isRsvpOverlayOpen || isRsvpDialogExiting;

  const restorePersistedAccess = useCallback(() => {
    if (isPersonalizedGuest) return "locked" as const;

    const transaction = loadInvitationAccessSafely(() => window.localStorage);

    if (transaction !== "locked") {
      dispatchInteraction({
        type: "restore_invitation_access",
        transaction,
      });
    }

    return transaction;
  }, [isPersonalizedGuest]);

  useEffect(() => {
    if (isPersonalizedGuest) return;

    restorePersistedAccess();

    function handleStorage(event: StorageEvent) {
      if (event.key !== RSVP_ACCESS_STORAGE_KEY) return;

      if (rsvpDialogRef.current) {
        isRsvpDialogClosingRef.current = true;
        setIsRsvpDialogExiting(true);
        shouldFocusTransactionRef.current = true;
      }

      restorePersistedAccess();
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [isPersonalizedGuest, restorePersistedAccess]);

  useEffect(() => {
    if (!isPersonalizedGuest || !supabase) return;

    let cancelled = false;
    dispatchInteraction({ type: "reset_invitation_access" });

    void findRsvpByGuestName(supabase, guestName).then((lookup) => {
      if (cancelled || lookup !== "found") return;

      if (rsvpDialogRef.current) {
        isRsvpDialogClosingRef.current = true;
        setIsRsvpDialogExiting(true);
        shouldFocusTransactionRef.current = true;
      }

      dispatchInteraction({
        type: "restore_invitation_access",
        transaction: "ready",
      });
    });

    return () => {
      cancelled = true;
    };
  }, [guestName, isPersonalizedGuest]);

  const handleRsvpOpen = useCallback(() => {
    if (restorePersistedAccess() === "locked") {
      isRsvpDialogClosingRef.current = false;
      dispatchInteraction({ type: "open_rsvp" });
    }
  }, [restorePersistedAccess]);

  const handleRsvpCompletionCheck = useCallback(() => {
    const isCompleted = restorePersistedAccess() !== "locked";

    if (isCompleted && rsvpDialogRef.current) {
      isRsvpDialogClosingRef.current = true;
      setIsRsvpDialogExiting(true);
      shouldFocusTransactionRef.current = true;
    }

    return isCompleted;
  }, [restorePersistedAccess]);

  const handleRsvpSubmitted = useCallback(() => {
    const transaction = interaction.transaction === "revealed" ? "revealed" : "ready";

    if (!isPersonalizedGuest) {
      persistInvitationAccessSafely(() => window.localStorage, transaction);
    }

    if (isRsvpDialogClosingRef.current) {
      dispatchInteraction({
        type: "restore_invitation_access",
        transaction,
      });
      return;
    }

    dispatchInteraction({ type: "rsvp_submitted" });
  }, [interaction.transaction, isPersonalizedGuest]);

  const handleRsvpClose = useCallback(() => {
    isRsvpDialogClosingRef.current = true;
    setIsRsvpDialogExiting(true);

    if (interaction.rsvp === "success") {
      shouldFocusTransactionRef.current = true;
    } else {
      shouldFocusRsvpTriggerRef.current = true;
    }

    dispatchInteraction({ type: "close_rsvp" });
  }, [interaction.rsvp]);

  const handleTransactionReveal = useCallback(() => {
    if (!isPersonalizedGuest) {
      persistInvitationAccessSafely(() => window.localStorage, "revealed");
    }
    dispatchInteraction({ type: "reveal_transaction" });
  }, [isPersonalizedGuest]);

  const handleRsvpDialogKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;

    const focusableElements = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(dialogFocusableSelector)
    ).filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");

    if (focusableElements.length === 0) {
      event.preventDefault();
      event.currentTarget.focus();
      return;
    }

    const activeIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    const nextIndex = event.shiftKey ? focusableElements.length - 1 : 0;
    const shouldWrap = event.shiftKey
      ? activeIndex <= 0
      : activeIndex === -1 || activeIndex === focusableElements.length - 1;

    if (shouldWrap) {
      event.preventDefault();
      focusableElements[nextIndex]?.focus();
    }
  }, []);

  useEffect(() => {
    if (
      isRsvpOverlayOpen ||
      isRsvpDialogExiting ||
      interaction.transaction === "locked" ||
      !shouldFocusTransactionRef.current
    ) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const revealButton = transactionRevealRef.current;
      if (!revealButton) return;

      revealButton.focus();
      shouldFocusTransactionRef.current = false;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [interaction.transaction, isRsvpDialogExiting, isRsvpOverlayOpen]);

  useEffect(() => {
    if (
      isRsvpOverlayOpen ||
      isRsvpDialogExiting ||
      interaction.transaction !== "locked" ||
      !shouldFocusRsvpTriggerRef.current
    ) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      rsvpTriggerRef.current?.focus();
      shouldFocusRsvpTriggerRef.current = false;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [interaction.transaction, isRsvpDialogExiting, isRsvpOverlayOpen]);

  const handleRsvpExitComplete = useCallback(() => {
    isRsvpDialogClosingRef.current = false;
    setIsRsvpDialogExiting(false);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="relative h-dvh w-full overflow-hidden lg:h-full">
        <AnimatePresence mode="wait">
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
              aria-hidden={shouldHideStory || undefined}
              inert={shouldHideStory || undefined}
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
              <InvitationStory
                interaction={interaction}
                dispatch={dispatchInteraction}
                rsvpTriggerRef={rsvpTriggerRef}
                transactionRevealRef={transactionRevealRef}
                onRsvpOpen={handleRsvpOpen}
                onTransactionReveal={handleTransactionReveal}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fullscreen scaled RSVP Form Overlay */}
        <AnimatePresence onExitComplete={handleRsvpExitComplete}>
          {isRsvpOverlayOpen && (
            <motion.div
              key="rsvp-dialog"
              ref={rsvpDialogRef}
              role="dialog"
              aria-modal="true"
              aria-label={interaction.rsvp === "success" ? "RSVP confirmation" : "RSVP form"}
              tabIndex={-1}
              onKeyDown={handleRsvpDialogKeyDown}
              initial={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 30,
                scale: shouldReduceMotion ? 1 : 0.985,
                filter: shouldReduceMotion ? "none" : "blur(3px)",
              }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "none" }}
              exit={{
                opacity: 0,
                y: shouldReduceMotion ? 0 : 20,
                scale: shouldReduceMotion ? 1 : 0.99,
                filter: shouldReduceMotion ? "none" : "blur(2px)",
              }}
              transition={{
                duration: shouldReduceMotion ? 0 : 0.75,
                ease: transitionEase,
              }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-[#FAEBE0]"
            >
              <div
                className="relative shrink-0 overflow-hidden"
                style={{
                  width: INVITATION_DESIGN_WIDTH * scale,
                  height: 852 * scale,
                }}
              >
                <div
                  className="absolute top-0 left-0"
                  style={{
                    width: INVITATION_DESIGN_WIDTH,
                    height: 852,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  <RsvpForm
                    mode={interaction.rsvp === "success" ? "success" : "form"}
                    guestName={guestName}
                    onSubmitted={handleRsvpSubmitted}
                    onClose={handleRsvpClose}
                    onAlreadyCompleted={handleRsvpCompletionCheck}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
