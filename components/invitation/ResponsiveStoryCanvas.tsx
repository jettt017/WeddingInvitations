"use client";

import { type ReactNode, useSyncExternalStore } from "react";

import {
  INVITATION_DESIGN_WIDTH,
  INVITATION_STORY_HEIGHT,
  calculateInvitationScale,
} from "@/lib/invitation-story";

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

interface ResponsiveStoryCanvasProps {
  children: ReactNode;
  storyHeight?: number;
}

export default function ResponsiveStoryCanvas({
  children,
  storyHeight = INVITATION_STORY_HEIGHT,
}: ResponsiveStoryCanvasProps) {
  const viewportWidth = useSyncExternalStore(
    subscribeToViewport,
    getViewportWidth,
    getServerViewportWidth
  );
  const scale = calculateInvitationScale(viewportWidth);

  return (
    <div
      className="relative mx-auto shrink-0 overflow-hidden"
      data-responsive-story-wrapper=""
      style={{
        width: INVITATION_DESIGN_WIDTH * scale,
        height: storyHeight * scale,
      }}
    >
      <div
        className="absolute top-0 left-0"
        data-responsive-story-canvas=""
        style={{
          width: INVITATION_DESIGN_WIDTH,
          height: storyHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
