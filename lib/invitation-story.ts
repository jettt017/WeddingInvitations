export const WEDDING_EVENT = {
  title: "The Wedding of Kinan & Faiz",
  dateLabel: "August, 16th 2026",
  start: "2026-08-16T09:30:00+07:00",
  end: "2026-08-16T11:30:00+07:00",
  venue: "Surabaya Suites Hotel",
  timeLabel: "09.30–11.30 WIB",
  displayAddress: "Plaza Boulevard, Jl. Pemuda No. 33-37, Surabaya 60271",
  location: "Surabaya Suites Hotel, Plaza Boulevard, Jl. Pemuda No. 33-37, Surabaya 60271",
  mapUrl: "https://maps.app.goo.gl/twKJBT2aUCQFUfLC7",
  details: "Wedding reception for Kinan & Faiz.",
} as const;

export const INVITATION_DESIGN_WIDTH = 393;
export const DESKTOP_PREVIEW_BREAKPOINT = 1_024;
export const INVITATION_STORY_HEIGHT = 7_420;

export type TransactionAccess = "ready" | "revealed";

export function getInvitationStoryHeight(transaction: TransactionAccess): number {
  void transaction;
  return INVITATION_STORY_HEIGHT;
}

export function calculateInvitationScale(viewportWidth: number): number {
  if (!Number.isFinite(viewportWidth) || viewportWidth <= 0) return 1;
  return viewportWidth < DESKTOP_PREVIEW_BREAKPOINT ? viewportWidth / INVITATION_DESIGN_WIDTH : 1;
}

const storyAsset = (path: string) => `/images/story/${path}`;

export const STORY_ASSETS = {
  paperTexture: "/images/main-screen/paper-texture.webp",
  groomBride: {
    leavesFrame: storyAsset("groom-bride/leaves-frame.webp"),
    groomPhoto: storyAsset("groom-bride/groom-photo-bedf8ff4.webp"),
    archMask: storyAsset("groom-bride/arch-mask.svg"),
    groomVines: storyAsset("groom-bride/groom-vines.webp"),
    groomBranch: storyAsset("groom-bride/groom-branch.webp"),
    portraitFlowers: storyAsset("groom-bride/portrait-flowers.webp"),
    bridePhoto: storyAsset("groom-bride/bride-photo.webp"),
    brideVines: storyAsset("groom-bride/bride-vines.webp"),
    brideBranch: storyAsset("groom-bride/bride-branch.webp"),
    leafDivider: storyAsset("groom-bride/leaf-divider.webp"),
  },
  couplePhoto: {
    coupleCover: storyAsset("couple-photo/couple-cover.webp"),
    bottomLandscape: storyAsset("couple-photo/bottom-landscape.webp"),
    centerFlowers: storyAsset("couple-photo/center-flowers.webp"),
    botanicalFrame: storyAsset("couple-photo/botanical-frame.webp"),
    foregroundLeaves: storyAsset("couple-photo/foreground-leaves.webp"),
    topBranch: storyAsset("couple-photo/top-branch.webp"),
  },
  dateEvent: {
    leftLeaves: storyAsset("date-event/left-leaves.webp"),
    rightLeaves: storyAsset("date-event/right-leaves.webp"),
    paperTear: storyAsset("date-event/paper-tear.webp"),
    dateFlourish: storyAsset("date-event/date-flourish.webp"),
    topCanopy: storyAsset("date-event/top-canopy.webp"),
    sectionFlourish: storyAsset("date-event/section-flourish.webp"),
    butterfly: storyAsset("date-event/butterfly.webp"),
    bottomFoliage: storyAsset("date-event/bottom-foliage.webp"),
    branchVines: storyAsset("date-event/branch-vines.webp"),
    tornTransition: storyAsset("date-event/torn-transition.svg"),
    calendarIcon: storyAsset("date-event/calendar-icon.svg"),
    underline: storyAsset("date-event/underline.svg"),
    mapPin: storyAsset("date-event/map-pin.svg"),
    giftIcon: storyAsset("date-event/gift-icon.svg"),
  },
  rsvp: {
    tornTransition: storyAsset("rsvp/torn-transition.svg"),
    paperTear: storyAsset("rsvp/paper-tear.webp"),
    topCanopy: storyAsset("rsvp/top-canopy.webp"),
    butterfly: storyAsset("rsvp/butterfly.webp"),
    blurredVines: storyAsset("rsvp/blurred-vines.webp"),
    headingFlourish: storyAsset("rsvp/heading-flourish.webp"),
    envelope: storyAsset("rsvp/envelope.svg"),
  },
  rsvpForm: {
    topVines: storyAsset("rsvp-form/top-vines.webp"),
    bottomLandscape: storyAsset("rsvp-form/bottom-landscape.webp"),
    sideVines: storyAsset("rsvp-form/side-vines.webp"),
    headingFlourish: storyAsset("rsvp-form/heading-flourish.webp"),
  },
  gallery: {
    floralFrame: storyAsset("gallery/floral-frame.webp"),
    foregroundLeaves: storyAsset("gallery/foreground-leaves.webp"),
    butterfly: storyAsset("gallery/butterfly.webp"),
    headingFlourish: storyAsset("gallery/heading-flourish.webp"),
    cameraIcon: storyAsset("gallery/camera-icon.svg"),
    feature01: storyAsset("gallery/gallery-feature-01-crop-b6e2f828.webp"),
    feature02: storyAsset("gallery/gallery-feature-02-crop-f046c69c.webp"),
    feature03: storyAsset("gallery/gallery-feature-03-crop-49b79301.webp"),
    collage: storyAsset("gallery/collage-85e96837.webp"),
    backIcon: storyAsset("gallery/back-icon.svg"),
  },
  transaction: {
    topLeaves: storyAsset("transaction/top-leaves.webp"),
    paperTear: storyAsset("transaction/paper-tear.webp"),
    bottomFoliage: storyAsset("transaction/bottom-foliage.webp"),
    mandiriLogo: storyAsset("transaction/logo-mandiri.webp"),
    briLogo: storyAsset("transaction/logo-bri.webp"),
    bcaLogo: storyAsset("transaction/logo-bca.webp"),
  },
  thankYou: {
    backgroundBlur: storyAsset("thank-you/background-blur.webp"),
    backgroundPhoto: storyAsset("thank-you/background-photo.webp"),
    headingFlourish: storyAsset("thank-you/heading-flourish.webp"),
    floralVines: storyAsset("thank-you/floral-vines.webp"),
    topCanopy: storyAsset("thank-you/top-canopy.webp"),
    bottomGround: storyAsset("thank-you/bottom-ground.webp"),
    rings: storyAsset("thank-you/rings.webp"),
  },
} as const;

export const STORY_PHOTOS = {
  coupleCover: {
    replacementFile: "couple-cover.webp",
    alt: "Kinan and Faiz posing outdoors",
    fallbacks: [
      {
        src: STORY_ASSETS.couplePhoto.coupleCover,
        objectPosition: "50% 50%",
      },
    ],
  },
  galleryFeature01: {
    replacementFile: "gallery-feature-01.webp",
    alt: "Kinan and Faiz sitting together beneath the trees",
    fallbacks: [
      {
        src: STORY_ASSETS.gallery.feature01,
        objectPosition: "50% 50%",
        sizes: "182px",
        width: 182,
        height: 175,
      },
    ],
  },
  galleryFeature02: {
    replacementFile: "gallery-feature-02.webp",
    alt: "Kinan and Faiz posing together by a red lattice wall",
    fallbacks: [
      {
        src: STORY_ASSETS.gallery.feature02,
        objectPosition: "50% 50%",
        sizes: "182px",
        width: 182,
        height: 190,
      },
    ],
  },
  galleryFeature03: {
    replacementFile: "gallery-feature-03.webp",
    alt: "Kinan and Faiz smiling together beneath the trees",
    fallbacks: [
      {
        src: STORY_ASSETS.gallery.feature03,
        objectPosition: "50% 50%",
        sizes: "182px",
        width: 182,
        height: 175,
      },
    ],
  },
} as const;

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const EMPTY_COUNTDOWN: CountdownValue = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

export function calculateCountdown(target: string | Date, now: Date = new Date()): CountdownValue {
  const targetTime = new Date(target).getTime();
  const currentTime = now.getTime();

  if (!Number.isFinite(targetTime) || !Number.isFinite(currentTime) || targetTime <= currentTime) {
    return EMPTY_COUNTDOWN;
  }

  const totalSeconds = Math.ceil((targetTime - currentTime) / 1000);

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}

function formatGoogleCalendarDate(value: string): string {
  return new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export function buildGoogleCalendarUrl(event: typeof WEDDING_EVENT): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatGoogleCalendarDate(event.start)}/${formatGoogleCalendarDate(event.end)}`,
    details: event.details,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function hasSupabaseConfig(url: string | undefined, anonKey: string | undefined): boolean {
  return Boolean(url?.trim() && anonKey?.trim());
}

export interface RsvpFormValue {
  guests: number;
  maxGuests: number;
}

export function validateRsvp(value: RsvpFormValue): Partial<Record<"guests", string>> {
  const errors: Partial<Record<"guests", string>> = {};

  if (
    !Number.isInteger(value.guests) ||
    !Number.isInteger(value.maxGuests) ||
    value.maxGuests < 1 ||
    value.guests < 1 ||
    value.guests > value.maxGuests
  ) {
    errors.guests = `Please enter between 1 and ${Math.max(1, value.maxGuests)} guests.`;
  }

  return errors;
}

export interface StoryInteractionState {
  rsvp: "intro" | "form" | "success";
  gallery: "preview" | "expanded";
  transaction: TransactionAccess;
}

export type StoryInteractionEvent =
  | { type: "open_rsvp" }
  | { type: "close_rsvp" }
  | { type: "rsvp_submitted" }
  | { type: "toggle_transaction" }
  | { type: "open_gallery" }
  | { type: "close_gallery" };

export const INITIAL_STORY_INTERACTION: StoryInteractionState = {
  rsvp: "intro",
  gallery: "preview",
  transaction: "ready",
};

export function storyInteractionReducer(
  state: StoryInteractionState,
  event: StoryInteractionEvent
): StoryInteractionState {
  switch (event.type) {
    case "open_rsvp":
      return { ...state, rsvp: "form" };
    case "close_rsvp":
      return { ...state, rsvp: "intro" };
    case "rsvp_submitted":
      return {
        ...state,
        rsvp: "success",
      };
    case "toggle_transaction":
      return { ...state, transaction: state.transaction === "ready" ? "revealed" : "ready" };
    case "open_gallery":
      return { ...state, gallery: "expanded" };
    case "close_gallery":
      return { ...state, gallery: "preview" };
    default:
      return state;
  }
}
