export const WEDDING_EVENT = {
  title: "The Wedding of Kinan & Faiz",
  dateLabel: "August, 16th 2026",
  start: "2026-08-16T08:00:00+07:00",
  end: "2026-08-16T12:00:00+07:00",
  location: "Masjid Raya Baiturrahman, Jl. Merdeka No. 1, Bandung",
  details: "Akad Nikah and wedding reception for Kinan & Faiz.",
} as const;

const storyAsset = (path: string) => `/images/story/${path}`;

export const STORY_ASSETS = {
  paperTexture: "/images/main-screen/paper-texture.webp",
  groomBride: {
    leavesFrame: storyAsset("groom-bride/leaves-frame.webp"),
    groomPhoto: storyAsset("groom-bride/groom-photo.webp"),
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
    ringsIcon: storyAsset("date-event/rings-icon.svg"),
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
    collage: storyAsset("gallery/collage.webp"),
    backIcon: storyAsset("gallery/back-icon.svg"),
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
  const remaining = Math.max(0, new Date(target).getTime() - now.getTime());
  const totalSeconds = Math.floor(remaining / 1000);

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

export type RsvpAttendance = "" | "attending" | "not_attending";

export interface RsvpFormValue {
  attendance: RsvpAttendance;
  name: string;
  guests: number;
}

export function validateRsvp(
  value: RsvpFormValue
): Partial<Record<"attendance" | "name" | "guests", string>> {
  const errors: Partial<Record<"attendance" | "name" | "guests", string>> = {};

  if (!value.attendance) errors.attendance = "Please select your response.";
  if (!value.name.trim()) errors.name = "Please enter the guest name.";
  if (!Number.isInteger(value.guests) || value.guests < 1 || value.guests > 10) {
    errors.guests = "Please enter between 1 and 10 guests.";
  }

  return errors;
}

export interface StoryInteractionState {
  rsvp: "intro" | "form" | "success";
  gallery: "preview" | "expanded";
}

export type StoryInteractionEvent =
  | { type: "open_rsvp" }
  | { type: "close_rsvp" }
  | { type: "rsvp_submitted" }
  | { type: "open_gallery" }
  | { type: "close_gallery" };

export const INITIAL_STORY_INTERACTION: StoryInteractionState = {
  rsvp: "intro",
  gallery: "preview",
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
      return { ...state, rsvp: "success" };
    case "open_gallery":
      return { ...state, gallery: "expanded" };
    case "close_gallery":
      return { ...state, gallery: "preview" };
    default:
      return state;
  }
}
