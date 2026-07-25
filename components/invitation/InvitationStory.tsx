"use client";

import { type RefObject } from "react";

import CouplePhotoSection from "@/components/invitation/CouplePhotoSection";
import DateEventSection from "@/components/invitation/DateEventSection";
import GallerySection from "@/components/invitation/GallerySection";
import GroomBrideSection from "@/components/invitation/GroomBrideSection";
import { MusicProvider } from "@/components/invitation/MusicButton";
import ResponsiveStoryCanvas from "@/components/invitation/ResponsiveStoryCanvas";
import RsvpSection from "@/components/invitation/RsvpSection";
import ThankYouSection from "@/components/invitation/ThankYouSection";
import TransactionSection from "@/components/invitation/TransactionSection";
import MainScreen from "@/components/main-screen/MainScreen";
import {
  getInvitationStoryHeight,
  type StoryInteractionState,
  type StoryInteractionEvent,
} from "@/lib/invitation-story";

interface InvitationStoryProps {
  interaction: StoryInteractionState;
  dispatch: React.Dispatch<StoryInteractionEvent>;
  rsvpTriggerRef?: RefObject<HTMLButtonElement | null>;
  transactionRevealRef?: RefObject<HTMLButtonElement | null>;
  onRsvpOpen?: () => void;
  onTransactionReveal?: () => void;
}

export default function InvitationStory({
  interaction,
  dispatch,
  rsvpTriggerRef,
  transactionRevealRef,
  onRsvpOpen,
  onTransactionReveal,
}: InvitationStoryProps) {
  const storyHeight = getInvitationStoryHeight(interaction.transaction);

  return (
    <MusicProvider>
      <ResponsiveStoryCanvas storyHeight={storyHeight}>
        <div className="relative min-h-full w-full bg-[#FAEBE0]">
          <MainScreen />
          <GroomBrideSection />
          <CouplePhotoSection />
          <DateEventSection />
          <RsvpSection
            mode="intro"
            onOpen={onRsvpOpen ?? (() => dispatch({ type: "open_rsvp" }))}
            onSubmitted={() => {}}
            onClose={() => {}}
            rsvpState={interaction.rsvp}
            completed={interaction.transaction !== "locked"}
            triggerRef={rsvpTriggerRef}
          />
          {interaction.transaction !== "locked" ? (
            <TransactionSection
              mode={interaction.transaction}
              onReveal={onTransactionReveal ?? (() => dispatch({ type: "reveal_transaction" }))}
              revealButtonRef={transactionRevealRef}
            />
          ) : null}
          <GallerySection
            mode={interaction.gallery}
            onOpen={() => dispatch({ type: "open_gallery" })}
            onClose={() => dispatch({ type: "close_gallery" })}
          />
          <ThankYouSection />
        </div>
      </ResponsiveStoryCanvas>
    </MusicProvider>
  );
}
