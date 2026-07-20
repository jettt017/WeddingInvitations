"use client";

import { useReducer } from "react";

import CouplePhotoSection from "@/components/invitation/CouplePhotoSection";
import DateEventSection from "@/components/invitation/DateEventSection";
import GallerySection from "@/components/invitation/GallerySection";
import GroomBrideSection from "@/components/invitation/GroomBrideSection";
import { MusicProvider } from "@/components/invitation/MusicButton";
import ResponsiveStoryCanvas from "@/components/invitation/ResponsiveStoryCanvas";
import RsvpSection from "@/components/invitation/RsvpSection";
import ThankYouSection from "@/components/invitation/ThankYouSection";
import MainScreen from "@/components/main-screen/MainScreen";
import { type StoryInteractionState, type StoryInteractionEvent } from "@/lib/invitation-story";

interface InvitationStoryProps {
  interaction: StoryInteractionState;
  dispatch: React.Dispatch<StoryInteractionEvent>;
}

export default function InvitationStory({ interaction, dispatch }: InvitationStoryProps) {
  return (
    <MusicProvider>
      <ResponsiveStoryCanvas>
        <div className="relative min-h-full w-full bg-[#FAEBE0]">
          <MainScreen />
          <GroomBrideSection />
          <CouplePhotoSection />
          <DateEventSection />
          <RsvpSection
            mode="intro"
            onOpen={() => dispatch({ type: "open_rsvp" })}
            onSubmitted={() => {}}
            onClose={() => {}}
          />
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
