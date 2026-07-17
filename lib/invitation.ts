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

export function resolveGuestName(search: string): string {
  const params = new URLSearchParams(search);

  for (const key of ["to", "guest", "g"]) {
    const value = params.get(key)?.trim();

    if (value) {
      return value;
    }
  }

  return "object";
}

export type InvitationView = "splash" | "main";
export type InvitationEvent = { type: "open" };

export function invitationViewReducer(
  view: InvitationView,
  event: InvitationEvent,
): InvitationView {
  if (event.type === "open" && view === "splash") {
    return "main";
  }

  return view;
}
