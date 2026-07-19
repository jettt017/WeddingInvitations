import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readSource(path: string): Promise<string> {
  return readFile(new URL(path, import.meta.url), "utf8").catch(() => "");
}

test("invitation story renders the seven designs in narrative order", async () => {
  const source = await readSource("../components/invitation/InvitationStory.tsx");
  const components = [
    "<MainScreen",
    "<GroomBrideSection",
    "<CouplePhotoSection",
    "<DateEventSection",
    "<RsvpSection",
    "<GallerySection",
    "<ThankYouSection",
  ];
  const positions = components.map((component) => source.indexOf(component));

  assert.ok(positions.every((position) => position >= 0));
  assert.deepEqual(
    positions,
    [...positions].sort((a, b) => a - b)
  );
});

test("implemented sections retain their source Figma frame identifiers", async () => {
  const files = [
    "GroomBrideSection.tsx",
    "CouplePhotoSection.tsx",
    "DateEventSection.tsx",
    "RsvpSection.tsx",
    "GallerySection.tsx",
    "ThankYouSection.tsx",
  ];
  const source = (
    await Promise.all(files.map((file) => readSource(`../components/invitation/${file}`)))
  ).join("\n");

  for (const node of [
    "31:29",
    "62:43",
    "106:2",
    "115:151",
    "116:190",
    "115:135",
    "149:398",
    "128:88",
  ]) {
    assert.match(
      source,
      new RegExp(`(?:data-figma-node|figmaNode)=[\\\"']${node.replace(":", "\\:")}`)
    );
  }
});

test("opening the invitation renders the complete story instead of only MainScreen", async () => {
  const source = await readSource("../components/InvitationExperience.tsx");

  assert.match(source, /import InvitationStory/);
  assert.match(source, /<InvitationStory\s*\/>/);
  assert.doesNotMatch(source, /import MainScreen/);
});

test("RSVP form never reports a submission when Supabase is unavailable", async () => {
  const source = await readSource("../components/invitation/RsvpSection.tsx");
  const supabaseSource = await readSource("../lib/supabase.ts");

  assert.match(source, /const isConfigured = supabase !== null/);
  assert.match(source, /disabled=\{!isConfigured/);
  assert.match(source, /RSVP will be available soon/);
  assert.doesNotMatch(source, /localStorage/);
  assert.match(supabaseSource, /supabase = hasSupabaseConfig/);
  assert.match(supabaseSource, /: null/);
});

test("RSVP transitions focus their mounted destination and announce form feedback", async () => {
  const source = await readSource("../components/invitation/RsvpSection.tsx");

  assert.match(source, /useId/);
  assert.match(source, /attendanceRef\.current\?\.focus\(\)/);
  assert.match(source, /ref=\{attendanceRef\}/);
  assert.match(source, /function RsvpSuccess[\s\S]*successRef\.current\?\.focus\(\)/);
  assert.match(source, /ref=\{successRef\}[\s\S]*role="status"[\s\S]*tabIndex=\{-1\}/);
  assert.match(source, /submitError[\s\S]*role="alert"/);

  for (const field of ["attendance", "name", "guests"]) {
    const errorId = `${field}ErrorId`;

    assert.match(source, new RegExp(`id=\\{${errorId}\\}`));
    assert.match(
      source,
      new RegExp(`aria-describedby=\\{errors\\.${field} \\? ${errorId} : undefined\\}`)
    );
  }
});

test("gallery transitions focus the newly mounted back button and restore the preview trigger", async () => {
  const source = await readSource("../components/invitation/GallerySection.tsx");

  assert.match(source, /function GalleryExpanded[\s\S]*backButtonRef\.current\?\.focus\(\)/);
  assert.match(source, /ref=\{backButtonRef\}/);
  assert.match(source, /setShouldRestorePreviewFocus\(true\)/);
  assert.match(source, /function GalleryPreview[\s\S]*viewMoreRef\.current\?\.focus\(\)/);
  assert.match(source, /ref=\{viewMoreRef\}/);
  assert.match(source, /setShouldRestorePreviewFocus\(false\)/);
});

test("music controls use an optional configured source and remain accessible without it", async () => {
  const source = await readSource("../components/invitation/MusicButton.tsx");

  assert.match(source, /NEXT_PUBLIC_WEDDING_MUSIC_SRC/);
  assert.match(source, /disabled=\{!canPlay\}/);
  assert.match(source, /aria-label/);
});

test("production component sources do not reference temporary Figma asset URLs", async () => {
  const files = [
    "InvitationStory.tsx",
    "GroomBrideSection.tsx",
    "CouplePhotoSection.tsx",
    "DateEventSection.tsx",
    "RsvpSection.tsx",
    "GallerySection.tsx",
    "ThankYouSection.tsx",
    "MusicButton.tsx",
  ];
  const source = (
    await Promise.all(files.map((file) => readSource(`../components/invitation/${file}`)))
  ).join("\n");

  assert.ok(source.length > 0);
  assert.doesNotMatch(source, /figma\.com\/api\/mcp\/asset/);
});

test("couple cover and gallery preview render configured photos without placeholders", async () => {
  const coupleSource = await readSource("../components/invitation/CouplePhotoSection.tsx");
  const gallerySource = await readSource("../components/invitation/GallerySection.tsx");
  const source = `${coupleSource}\n${gallerySource}`;

  assert.match(coupleSource, /import Image from ["']next\/image["']/);
  assert.match(coupleSource, /STORY_PHOTOS\.coupleCover/);
  assert.match(coupleSource, /role="img"/);
  assert.match(coupleSource, /aria-label=\{photo\.alt\}/);
  assert.match(gallerySource, /STORY_PHOTOS\.galleryFeature01/);
  assert.match(gallerySource, /STORY_PHOTOS\.galleryFeature02/);
  assert.match(gallerySource, /STORY_PHOTOS\.galleryFeature03/);
  assert.match(gallerySource, /alt=\{photo\.alt\}/);
  assert.doesNotMatch(source, /photo placeholder/i);
  assert.doesNotMatch(gallerySource, /bg-black/);
  assert.doesNotMatch(source, /figma\.com\/api\/mcp\/asset/);
});

test("document metadata matches Kinan and Faiz on 16 August 2026", async () => {
  const source = await readSource("../app/layout.tsx");

  assert.match(source, /Kinan & Faiz/);
  assert.match(source, /August 16, 2026/);
  assert.doesNotMatch(source, /Alexander|Eleanor|Florence/);
});

test("countdown starts with placeholders, schedules timeouts, and uses the Figma fonts", async () => {
  const source = await readSource("../components/invitation/DateEventSection.tsx");

  assert.match(source, /useState<CountdownDisplayValue>\(EMPTY_COUNTDOWN_DISPLAY\)/);
  assert.match(source, /number === undefined \? "--"/);
  assert.match(source, /window\.setTimeout\(update, 1000\)/);
  assert.match(source, /window\.clearTimeout\(timeout\)/);
  assert.match(source, /if \(isComplete\(nextValue\)\) return;/);
  assert.match(
    source,
    /font-prata text-\[24px\] leading-\[44\.188px\] tracking-\[0\.9336px\] tabular-nums/
  );
  assert.match(
    source,
    /font-playfair text-\[19\.347px\] leading-\[27\.86px\] tracking-\[0\.5886px\]/
  );
  assert.doesNotMatch(source, /useState\(\(\) => calculateCountdown/);
  assert.doesNotMatch(source, /setInterval/);
});
