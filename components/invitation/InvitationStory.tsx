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
import { INITIAL_STORY_INTERACTION, storyInteractionReducer } from "@/lib/invitation-story";

export default function InvitationStory() {
  const [interaction, dispatch] = useReducer(storyInteractionReducer, INITIAL_STORY_INTERACTION);

  return (
    <MusicProvider>
      <ResponsiveStoryCanvas>
        <div className="relative min-h-full w-full bg-[#FAEBE0]">
          <MainScreen />
          <GroomBrideSection />
          <CouplePhotoSection />
          <DateEventSection />
          <RsvpSection
            mode={interaction.rsvp}
            onOpen={() => dispatch({ type: "open_rsvp" })}
            onSubmitted={() => dispatch({ type: "rsvp_submitted" })}
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
