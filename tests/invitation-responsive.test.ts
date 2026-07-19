import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function loadStoryModule() {
  return import("../lib/invitation-story.ts");
}

async function readSource(path: string): Promise<string> {
  return readFile(new URL(path, import.meta.url), "utf8").catch(() => "");
}

test("responsive story exports the Figma design dimensions", async () => {
  const story = await loadStoryModule();

  assert.equal(story.INVITATION_DESIGN_WIDTH, 393);
  assert.equal(story.INVITATION_STORY_HEIGHT, 6426);
});

test("responsive story scales only below the Figma design width", async () => {
  const story = await loadStoryModule();

  assert.equal(typeof story.calculateInvitationScale, "function");
  assert.equal(story.calculateInvitationScale(320), 320 / 393);
  assert.equal(story.calculateInvitationScale(360), 360 / 393);
  assert.equal(story.calculateInvitationScale(393), 1);
  assert.equal(story.calculateInvitationScale(768), 1);
  assert.equal(story.calculateInvitationScale(1440), 1);
});

test("responsive story ignores invalid and nonpositive viewport widths", async () => {
  const story = await loadStoryModule();

  assert.equal(typeof story.calculateInvitationScale, "function");
  assert.equal(story.calculateInvitationScale(0), 1);
  assert.equal(story.calculateInvitationScale(-320), 1);
  assert.equal(story.calculateInvitationScale(Number.NaN), 1);
});

test("responsive wrapper contains the complete seven-screen narrative", async () => {
  const source = await readSource("../components/invitation/InvitationStory.tsx");
  const wrapperStart = source.indexOf("<ResponsiveStoryCanvas>");
  const wrapperEnd = source.indexOf("</ResponsiveStoryCanvas>");
  const screens = [
    "<MainScreen",
    "<GroomBrideSection",
    "<CouplePhotoSection",
    "<DateEventSection",
    "<RsvpSection",
    "<GallerySection",
    "<ThankYouSection",
  ];
  const positions = screens.map((screen) => source.indexOf(screen));

  assert.ok(wrapperStart >= 0);
  assert.ok(wrapperEnd > wrapperStart);
  assert.ok(positions.every((position) => position > wrapperStart && position < wrapperEnd));
  assert.deepEqual(
    positions,
    [...positions].sort((a, b) => a - b)
  );
});

test("responsive wrapper derives both boxes from the exported design constants", async () => {
  const source = await readSource("../components/invitation/ResponsiveStoryCanvas.tsx");

  assert.match(source, /useSyncExternalStore/);
  assert.match(
    source,
    /import\s*\{[\s\S]*INVITATION_DESIGN_WIDTH[\s\S]*INVITATION_STORY_HEIGHT[\s\S]*calculateInvitationScale[\s\S]*\}\s*from\s*"@\/lib\/invitation-story"/
  );
  assert.match(source, /width:\s*INVITATION_DESIGN_WIDTH\s*\*\s*scale/);
  assert.match(source, /height:\s*INVITATION_STORY_HEIGHT\s*\*\s*scale/);
  assert.match(source, /width:\s*INVITATION_DESIGN_WIDTH[,\s]/);
  assert.match(source, /height:\s*INVITATION_STORY_HEIGHT[,\s]/);
  assert.match(source, /transformOrigin:\s*"top left"/);
});
