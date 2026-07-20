"use client";

import { useReducer, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import InvitationStory from "@/components/invitation/InvitationStory";
import { RsvpForm } from "@/components/invitation/RsvpSection";
import HeroBackground from "@/components/splash-screen/HeroBackground";
import { invitationViewReducer } from "@/lib/invitation";
import {
  INITIAL_STORY_INTERACTION,
  storyInteractionReducer,
  calculateInvitationScale,
  INVITATION_DESIGN_WIDTH,
} from "@/lib/invitation-story";

const transitionEase = [0.16, 1, 0.3, 1] as const;

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

export default function InvitationExperience() {
  const [view, dispatch] = useReducer(invitationViewReducer, "splash");
  const [interaction, dispatchInteraction] = useReducer(
    storyInteractionReducer,
    INITIAL_STORY_INTERACTION
  );
  const shouldReduceMotion = useReducedMotion();

  const viewportWidth = useSyncExternalStore(
    subscribeToViewport,
    getViewportWidth,
    getServerViewportWidth
  );
  const scale = calculateInvitationScale(viewportWidth);

  return (
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
            <InvitationStory interaction={interaction} dispatch={dispatchInteraction} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen scaled RSVP Form Overlay */}
      <AnimatePresence>
        {view === "main" &&
          (interaction.rsvp === "form" || interaction.rsvp === "success") && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.985, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 20, scale: 0.99, filter: "blur(2px)" }}
              transition={{ duration: 0.75, ease: transitionEase }}
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
                    mode={interaction.rsvp}
                    onSubmitted={() => dispatchInteraction({ type: "rsvp_submitted" })}
                    onClose={() => dispatchInteraction({ type: "close_rsvp" })}
                  />
                </div>
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
