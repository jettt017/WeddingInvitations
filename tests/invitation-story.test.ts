import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import path from "node:path";
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
  assert.equal(story.WEDDING_EVENT.venue, "Surabaya Suites Hotel");
  assert.equal(
    story.WEDDING_EVENT.location,
    "Surabaya Suites Hotel, Plaza Boulevard, Jl. Pemuda No. 33-37, Surabaya 60271"
  );
  assert.equal(story.WEDDING_EVENT.mapUrl, "https://maps.app.goo.gl/twKJBT2aUCQFUfLC7");
  assert.doesNotMatch(story.WEDDING_EVENT.details, /akad/i);
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

test("countdown uses the exact UTC instants for the wedding event", async () => {
  const story = await loadStoryModule();

  assert.equal(story.WEDDING_EVENT.start, "2026-08-16T08:00:00+07:00");
  assert.equal(story.WEDDING_EVENT.end, "2026-08-16T12:00:00+07:00");
  assert.equal(new Date(story.WEDDING_EVENT.start).toISOString(), "2026-08-16T01:00:00.000Z");
  assert.equal(new Date(story.WEDDING_EVENT.end).toISOString(), "2026-08-16T05:00:00.000Z");
});

test("countdown rounds positive partial seconds up", async () => {
  const story = await loadStoryModule();

  assert.deepEqual(
    story.calculateCountdown("2026-08-16T08:00:00+07:00", new Date("2026-08-16T00:59:59.999Z")),
    { days: 0, hours: 0, minutes: 0, seconds: 1 }
  );
});

test("countdown returns zero at the exact event start", async () => {
  const story = await loadStoryModule();

  assert.deepEqual(
    story.calculateCountdown("2026-08-16T08:00:00+07:00", new Date("2026-08-16T01:00:00.000Z")),
    { days: 0, hours: 0, minutes: 0, seconds: 0 }
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

test("countdown never exposes NaN for invalid dates", async () => {
  const story = await loadStoryModule();

  assert.deepEqual(story.calculateCountdown("not-a-date", new Date("2026-08-16T00:00:00.000Z")), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  assert.deepEqual(story.calculateCountdown("2026-08-16T08:00:00+07:00", new Date("not-a-date")), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
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
  assert.match(url.searchParams.get("location") ?? "", /Surabaya Suites Hotel/i);
  assert.match(url.searchParams.get("location") ?? "", /Surabaya 60271/i);
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

test("RSVP completion unlocks and preserves transaction access", async () => {
  const story = await loadStoryModule();

  assert.equal(typeof story.storyInteractionReducer, "function");
  assert.equal(typeof story.INITIAL_STORY_INTERACTION, "object");
  if (!("storyInteractionReducer" in story) || !("INITIAL_STORY_INTERACTION" in story)) return;

  assert.equal(story.INITIAL_STORY_INTERACTION.transaction, "locked");

  const ignoredReveal = story.storyInteractionReducer(story.INITIAL_STORY_INTERACTION, {
    type: "reveal_transaction",
  });
  const form = story.storyInteractionReducer(story.INITIAL_STORY_INTERACTION, {
    type: "open_rsvp",
  });
  const success = story.storyInteractionReducer(form, { type: "rsvp_submitted" });
  const closed = story.storyInteractionReducer(success, { type: "close_rsvp" });
  const revealed = story.storyInteractionReducer(closed, { type: "reveal_transaction" });
  const repeated = story.storyInteractionReducer(revealed, { type: "rsvp_submitted" });
  const restored = story.storyInteractionReducer(story.INITIAL_STORY_INTERACTION, {
    type: "restore_invitation_access",
    transaction: "revealed",
  });
  const restoredWhileOpen = story.storyInteractionReducer(form, {
    type: "restore_invitation_access",
    transaction: "ready",
  });

  assert.equal(ignoredReveal.transaction, "locked");
  assert.equal(form.rsvp, "form");
  assert.equal(success.rsvp, "success");
  assert.equal(success.transaction, "ready");
  assert.equal(closed.rsvp, "intro");
  assert.equal(closed.transaction, "ready");
  assert.equal(revealed.transaction, "revealed");
  assert.equal(repeated.transaction, "revealed");
  assert.equal(restored.transaction, "revealed");
  assert.equal(restoredWhileOpen.rsvp, "intro");
  assert.equal(restoredWhileOpen.transaction, "ready");
});

test("transaction visibility controls the responsive story height", async () => {
  const story = await loadStoryModule();

  assert.equal(story.INVITATION_STORY_HEIGHT_WITHOUT_TRANSACTION, 6_050);
  assert.equal(story.INVITATION_STORY_HEIGHT, 6_568);
  assert.equal(story.getInvitationStoryHeight("locked"), 6_050);
  assert.equal(story.getInvitationStoryHeight("ready"), 6_568);
  assert.equal(story.getInvitationStoryHeight("revealed"), 6_568);
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
  assert.ok(paths.some((path) => /gallery\/collage-[a-f0-9]{8}\.webp$/.test(path)));
  assert.ok(paths.some((path) => path.endsWith("transaction/logo-mandiri.webp")));
  assert.ok(paths.some((path) => path.endsWith("transaction/bottom-foliage.webp")));
  assert.ok(paths.some((path) => path.endsWith("thank-you/rings.webp")));
});

test("photo slots record meaningful local fallbacks and their final replacement names", async () => {
  const story = await loadStoryModule();

  assert.equal(typeof story.STORY_PHOTOS, "object");
  if (!("STORY_PHOTOS" in story)) return;

  assert.equal(story.STORY_PHOTOS.coupleCover.replacementFile, "couple-cover.webp");
  assert.equal(story.STORY_PHOTOS.galleryFeature01.replacementFile, "gallery-feature-01.webp");
  assert.equal(story.STORY_PHOTOS.galleryFeature02.replacementFile, "gallery-feature-02.webp");
  assert.equal(story.STORY_PHOTOS.galleryFeature03.replacementFile, "gallery-feature-03.webp");

  const photos = Object.values(story.STORY_PHOTOS);
  assert.ok(photos.every((photo) => photo.alt.trim().length > 0));
  assert.ok(
    photos.every((photo) =>
      photo.fallbacks.every((fallback) => {
        const objectPosition =
          "objectPosition" in fallback
            ? fallback.objectPosition
            : "crop" in fallback
              ? fallback.crop.objectPosition
              : "";

        return (
          fallback.src.startsWith("/images/") &&
          !fallback.src.includes("figma.com") &&
          objectPosition.trim().length > 0
        );
      })
    )
  );
  assert.deepEqual(
    story.STORY_PHOTOS.coupleCover.fallbacks.map((fallback) => fallback.objectPosition),
    ["50% 63%", "50% 52%"]
  );
  assert.match(
    story.STORY_PHOTOS.galleryFeature01.fallbacks[0].src,
    /gallery\/gallery-feature-01-crop-[a-f0-9]{8}\.webp$/
  );
  assert.match(
    story.STORY_PHOTOS.galleryFeature02.fallbacks[0].src,
    /gallery\/gallery-feature-02-crop-[a-f0-9]{8}\.webp$/
  );
  assert.match(
    story.STORY_PHOTOS.galleryFeature03.fallbacks[0].src,
    /gallery\/gallery-feature-03-crop-[a-f0-9]{8}\.webp$/
  );
  assert.ok(
    [
      story.STORY_PHOTOS.galleryFeature01,
      story.STORY_PHOTOS.galleryFeature02,
      story.STORY_PHOTOS.galleryFeature03,
    ].every(
      (photo) =>
        photo.fallbacks[0].objectPosition === "50% 50%" &&
        photo.fallbacks[0].sizes === "182px" &&
        photo.fallbacks[0].width === 182 &&
        [175, 190].includes(photo.fallbacks[0].height) &&
        !("crop" in photo.fallbacks[0])
    )
  );
  assert.match(story.STORY_ASSETS.gallery.collage, /gallery\/collage-85e96837\.webp$/);
});

test("updated story height includes the 518 pixel transaction section", async () => {
  const story = await loadStoryModule();

  assert.equal(story.INVITATION_STORY_HEIGHT, 6_568);
  assert.equal(
    story.INVITATION_STORY_HEIGHT - story.INVITATION_STORY_HEIGHT_WITHOUT_TRANSACTION,
    518
  );
});

test("new gallery and transaction assets stay lightweight", async () => {
  const story = await loadStoryModule();
  const assetPaths = [
    story.STORY_PHOTOS.galleryFeature01.fallbacks[0].src,
    story.STORY_PHOTOS.galleryFeature02.fallbacks[0].src,
    story.STORY_PHOTOS.galleryFeature03.fallbacks[0].src,
    story.STORY_ASSETS.gallery.collage,
    story.STORY_ASSETS.transaction.topLeaves,
    story.STORY_ASSETS.transaction.bottomFoliage,
    story.STORY_ASSETS.transaction.paperTear,
    story.STORY_ASSETS.transaction.mandiriLogo,
    story.STORY_ASSETS.transaction.briLogo,
    story.STORY_ASSETS.transaction.bcaLogo,
  ];

  for (const assetPath of assetPaths) {
    const filePath = path.join(process.cwd(), "public", assetPath.replace(/^\//, ""));
    const fileStats = await stat(filePath);

    assert.ok(
      fileStats.size <= 250_000,
      `expected ${assetPath} to be at most 250 KB, received ${fileStats.size} bytes`
    );
  }
});

test("groom portrait uses a compressed local asset", async () => {
  const story = await loadStoryModule();
  const groomPhoto = story.STORY_ASSETS.groomBride.groomPhoto;

  assert.match(groomPhoto, /groom-photo-[a-f0-9]{8}\.webp$/);

  const groomPhotoPath = path.join(process.cwd(), "public", groomPhoto.replace(/^\//, ""));
  const groomPhotoStats = await stat(groomPhotoPath);

  assert.ok(
    groomPhotoStats.size <= 1_000_000,
    `expected groom portrait to be at most 1 MB, received ${groomPhotoStats.size} bytes`
  );
});
