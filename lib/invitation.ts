export const MAIN_SCREEN_ASSETS = {
  paperTexture: "/images/main-screen/paper-texture.webp",
  centerFloralOrnament: "/images/main-screen/center-floral-ornament.png",
  butterfly: "/images/main-screen/butterfly.png",
  topFloralFrame: "/images/main-screen/top-floral-frame.png",
  hangingVines: "/images/main-screen/hanging-vines.png",
  tornPaperDivider: "/images/main-screen/torn-paper-divider.png",
  lowerBotanicalFrame: "/images/main-screen/lower-botanical-frame.png",
  topFloralOverlay: "/images/main-screen/top-floral-overlay.png",
} as const;

const GUEST_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function resolveGuestSlug(search: string): string {
  const value = new URLSearchParams(search).get("to")?.trim().toLocaleLowerCase("en-US") ?? "";
  return GUEST_SLUG_PATTERN.test(value) ? value : "";
}

interface GuestGreetingInput {
  requestedSlug: string;
  completedSlug: string;
  displayName: string | null;
  canResolve: boolean;
}

export function resolveGuestGreetingName({
  requestedSlug,
  completedSlug,
  displayName,
  canResolve,
}: GuestGreetingInput): string | null {
  if (requestedSlug && canResolve && completedSlug !== requestedSlug) {
    return null;
  }

  if (requestedSlug && completedSlug === requestedSlug && displayName?.trim()) {
    return displayName.trim();
  }

  return "Guest";
}

export function getGuestGreetingLayout(displayName: string | null): "inline" | "stacked" {
  return (displayName?.trim().length ?? 0) > 24 ? "stacked" : "inline";
}

export type InvitationView = "splash" | "main";
export type InvitationEvent = { type: "open" };

export function invitationViewReducer(
  view: InvitationView,
  event: InvitationEvent
): InvitationView {
  if (event.type === "open" && view === "splash") {
    return "main";
  }

  return view;
}
