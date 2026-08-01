"use client";

import { type RefObject } from "react";

import CouplePhotoSection from "@/components/invitation/CouplePhotoSection";
import DateEventSection from "@/components/invitation/DateEventSection";
import GallerySection from "@/components/invitation/GallerySection";
import GroomBrideSection from "@/components/invitation/GroomBrideSection";
import ResponsiveStoryCanvas from "@/components/invitation/ResponsiveStoryCanvas";
import RsvpSection from "@/components/invitation/RsvpSection";
import ThankYouSection from "@/components/invitation/ThankYouSection";
import TransactionSection from "@/components/invitation/TransactionSection";
import WishesSection from "@/components/invitation/WishesSection";
import MainScreen from "@/components/main-screen/MainScreen";
import type { InvitationGuest } from "@/lib/invitation-api";
import {
  getInvitationStoryHeight,
  type StoryInteractionState,
  type StoryInteractionEvent,
} from "@/lib/invitation-story";

interface InvitationStoryProps {
  interaction: StoryInteractionState;
  dispatch: React.Dispatch<StoryInteractionEvent>;
  guest: InvitationGuest | null;
  rsvpTriggerRef?: RefObject<HTMLButtonElement | null>;
  transactionRevealRef?: RefObject<HTMLButtonElement | null>;
  onRsvpOpen?: () => void;
  onTransactionReveal?: () => void;
  onWishSubmitted?: () => void;
}

export default function InvitationStory({
  interaction,
  dispatch,
  guest,
  rsvpTriggerRef,
  transactionRevealRef,
  onRsvpOpen,
  onTransactionReveal,
  onWishSubmitted,
}: InvitationStoryProps) {
  const storyHeight = getInvitationStoryHeight(interaction.transaction);

  return (
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
          guest={guest}
          completed={guest?.hasRsvp ?? false}
          triggerRef={rsvpTriggerRef}
        />
        <TransactionSection
          mode={interaction.transaction}
          onReveal={onTransactionReveal ?? (() => dispatch({ type: "toggle_transaction" }))}
          revealButtonRef={transactionRevealRef}
        />
        <WishesSection
          key={guest?.slug ?? "anonymous"}
          guest={guest}
          onWishSubmitted={onWishSubmitted ?? (() => {})}
        />
        <GallerySection
          mode={interaction.gallery}
          onOpen={() => dispatch({ type: "open_gallery" })}
          onClose={() => dispatch({ type: "close_gallery" })}
        />
        <ThankYouSection />
      </div>
    </ResponsiveStoryCanvas>
  );
}
