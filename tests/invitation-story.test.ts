import assert from "node:assert/strict";
import test from "node:test";

async function loadStoryModule() {
  return import("../lib/invitation-story.ts");
}

test("wedding event is scheduled for 16 August 2026 in Jakarta time", async () => {
  const story = await loadStoryModule();

  assert.equal(typeof story.WEDDING_EVENT, "object");
  if (!("WEDDING_EVENT" in story)) return;

  assert.equal(story.WEDDING_EVENT.dateLabel, "August, 16th 2026");
  assert.equal(story.WEDDING_EVENT.start, "2026-08-16T08:00:00+07:00");
});

test("countdown separates remaining time into days hours minutes and seconds", async () => {
  const story = await loadStoryModule();

  assert.equal(typeof story.calculateCountdown, "function");
  if (!("calculateCountdown" in story)) return;

  assert.deepEqual(
    story.calculateCountdown("2026-08-16T08:00:00+07:00", new Date("2026-08-15T00:00:00+07:00")),
    { days: 1, hours: 8, minutes: 0, seconds: 0 }
  );
});

test("countdown stops at zero after the event starts", async () => {
  const story = await loadStoryModule();

  assert.equal(typeof story.calculateCountdown, "function");
  if (!("calculateCountdown" in story)) return;

  assert.deepEqual(
    story.calculateCountdown("2026-08-16T08:00:00+07:00", new Date("2026-08-17T00:00:00+07:00")),
    { days: 0, hours: 0, minutes: 0, seconds: 0 }
  );
});

test("calendar link contains the configured couple date and venue", async () => {
  const story = await loadStoryModule();

  assert.equal(typeof story.buildGoogleCalendarUrl, "function");
  assert.equal(typeof story.WEDDING_EVENT, "object");
  if (!("buildGoogleCalendarUrl" in story) || !("WEDDING_EVENT" in story)) return;

  const url = new URL(story.buildGoogleCalendarUrl(story.WEDDING_EVENT));

  assert.equal(url.origin + url.pathname, "https://calendar.google.com/calendar/render");
  assert.equal(url.searchParams.get("action"), "TEMPLATE");
  assert.match(url.searchParams.get("text") ?? "", /Kinan.*Faiz/i);
  assert.match(url.searchParams.get("dates") ?? "", /^20260816T010000Z\//);
  assert.match(url.searchParams.get("location") ?? "", /Bandung/i);
});

test("RSVP integration is disabled when Supabase values are missing", async () => {
  const story = await loadStoryModule();

  assert.equal(typeof story.hasSupabaseConfig, "function");
  if (!("hasSupabaseConfig" in story)) return;

  assert.equal(story.hasSupabaseConfig("", ""), false);
  assert.equal(story.hasSupabaseConfig("https://example.supabase.co", "anon-key"), true);
});

test("RSVP validation requires a response and guest name", async () => {
  const story = await loadStoryModule();

  assert.equal(typeof story.validateRsvp, "function");
  if (!("validateRsvp" in story)) return;

  assert.deepEqual(story.validateRsvp({ attendance: "", name: "", guests: 1 }), {
    attendance: "Please select your response.",
    name: "Please enter the guest name.",
  });
  assert.deepEqual(
    story.validateRsvp({ attendance: "attending", name: "  Rina & Fajar  ", guests: 2 }),
    {}
  );
});

test("RSVP validation limits the guest count to one through ten", async () => {
  const story = await loadStoryModule();

  assert.deepEqual(story.validateRsvp({ attendance: "attending", name: "Rina", guests: 0 }), {
    guests: "Please enter between 1 and 10 guests.",
  });
  assert.deepEqual(story.validateRsvp({ attendance: "attending", name: "Rina", guests: 11 }), {
    guests: "Please enter between 1 and 10 guests.",
  });
});

test("gallery interaction opens and closes the expanded design", async () => {
  const story = await loadStoryModule();

  assert.equal(typeof story.storyInteractionReducer, "function");
  assert.equal(typeof story.INITIAL_STORY_INTERACTION, "object");
  if (!("storyInteractionReducer" in story) || !("INITIAL_STORY_INTERACTION" in story)) return;

  const expanded = story.storyInteractionReducer(story.INITIAL_STORY_INTERACTION, {
    type: "open_gallery",
  });

  assert.equal(expanded.gallery, "expanded");
  assert.equal(
    story.storyInteractionReducer(expanded, { type: "close_gallery" }).gallery,
    "preview"
  );
});

test("RSVP interaction opens the form and records a successful submission", async () => {
  const story = await loadStoryModule();

  assert.equal(typeof story.storyInteractionReducer, "function");
  assert.equal(typeof story.INITIAL_STORY_INTERACTION, "object");
  if (!("storyInteractionReducer" in story) || !("INITIAL_STORY_INTERACTION" in story)) return;

  const form = story.storyInteractionReducer(story.INITIAL_STORY_INTERACTION, {
    type: "open_rsvp",
  });
  const success = story.storyInteractionReducer(form, { type: "rsvp_submitted" });

  assert.equal(form.rsvp, "form");
  assert.equal(success.rsvp, "success");
});

test("story assets are committed local files rather than temporary Figma URLs", async () => {
  const story = await loadStoryModule();

  assert.equal(typeof story.STORY_ASSETS, "object");
  if (!("STORY_ASSETS" in story)) return;

  const collectPaths = (value: unknown): string[] => {
    if (typeof value === "string") return [value];
    if (!value || typeof value !== "object") return [];
    return Object.values(value).flatMap(collectPaths);
  };
  const paths = collectPaths(story.STORY_ASSETS);

  assert.ok(paths.length >= 50);
  assert.ok(paths.every((path) => path.startsWith("/images/")));
  assert.ok(paths.every((path) => !path.includes("figma.com")));
  assert.ok(paths.some((path) => path.endsWith("gallery/collage.webp")));
  assert.ok(paths.some((path) => path.endsWith("thank-you/rings.webp")));
});
