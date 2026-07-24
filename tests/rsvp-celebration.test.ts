import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function loadCelebrationConfig() {
  return import("../lib/rsvp-celebration.ts");
}

async function readSource(path: string): Promise<string> {
  return readFile(new URL(path, import.meta.url), "utf8").catch(() => "");
}

test("RSVP flower celebration shoots and settles before the success window closes", async () => {
  const config = await loadCelebrationConfig();

  assert.equal(config.RSVP_SUCCESS_DURATION_MS, 3_500);
  assert.ok(Array.isArray(config.RSVP_CELEBRATION_PETALS));
  if (!Array.isArray(config.RSVP_CELEBRATION_PETALS)) return;

  const petals = config.RSVP_CELEBRATION_PETALS;
  assert.equal(petals.length, 40);
  assert.equal(new Set(petals.map((petal) => petal.id)).size, petals.length);
  assert.ok(
    petals.every(
      (petal) =>
        Number.isFinite(petal.delay) &&
        Number.isFinite(petal.duration) &&
        petal.delay >= 0 &&
        petal.delay + petal.duration <= 3
    ),
    "every petal should settle for at least 0.5 seconds before the success view closes"
  );
  assert.ok(
    petals.every(
      (petal) =>
        (petal.startX <= 56 || petal.startX >= 337) &&
        petal.startY >= 720 &&
        petal.apexY < petal.landingY
    ),
    "petals should launch from the two bottom corners and travel upward"
  );
  assert.ok(
    petals.every(
      (petal) =>
        Number.isFinite(petal.landingX) &&
        Number.isFinite(petal.landingY) &&
        petal.landingX >= 8 &&
        petal.landingX <= 385 &&
        petal.landingY >= 735 &&
        petal.landingY <= 805
    ),
    "petals should land in a visible pile directly above the grass"
  );
});

test("RSVP floral brush fills the entire bottom edge with varied flowers and leaves", async () => {
  const config = await loadCelebrationConfig();
  const blooms = config.RSVP_FLORAL_BRUSH_BLOOMS;
  const leaves = config.RSVP_FLORAL_BRUSH_LEAVES;

  assert.ok(Array.isArray(blooms));
  assert.ok(Array.isArray(leaves));
  if (!Array.isArray(blooms) || !Array.isArray(leaves)) return;

  assert.equal(blooms.length, 24);
  assert.equal(leaves.length, 30);
  assert.equal(new Set(blooms.map((bloom) => bloom.id)).size, blooms.length);
  assert.equal(new Set(leaves.map((leaf) => leaf.id)).size, leaves.length);
  assert.ok(
    Math.min(...blooms.map((bloom) => bloom.x - bloom.size / 2)) <= 0 &&
      Math.max(...blooms.map((bloom) => bloom.x + bloom.size / 2)) >= 393,
    "blooms should cover the invitation from the left edge to the right edge"
  );
  assert.ok(
    blooms.every((bloom) => bloom.y >= 480 && bloom.y <= 805),
    "blooms should form a deep brush from below the card down to the grass"
  );
  assert.ok(
    new Set(blooms.map((bloom) => bloom.petalColor)).size >= 5,
    "the brush should contain at least five flower color variations"
  );
  assert.ok(
    Math.min(...leaves.map((leaf) => leaf.x - leaf.width / 2)) <= 0 &&
      Math.max(...leaves.map((leaf) => leaf.x + leaf.width / 2)) >= 393,
    "leaves should reinforce both screen edges"
  );
  assert.ok(
    new Set(leaves.map((leaf) => leaf.color)).size >= 4,
    "the foliage should use multiple green tones"
  );
});

test("RSVP success mounts an accessible reduced-motion floral celebration", async () => {
  const rsvpSource = await readSource("../components/invitation/RsvpSection.tsx");
  const celebrationSource = await readSource("../components/invitation/RsvpCelebration.tsx");
  const brushSource = await readSource("../components/invitation/RsvpFloralBrush.tsx");

  assert.match(rsvpSource, /import RsvpCelebration/);
  assert.match(rsvpSource, /function RsvpSuccess[\s\S]*<RsvpCelebration \/>/);
  assert.match(rsvpSource, /setTimeout\([\s\S]*RSVP_SUCCESS_DURATION_MS/);
  assert.match(celebrationSource, /useReducedMotion/);
  assert.match(celebrationSource, /aria-hidden="true"/);
  assert.match(celebrationSource, /pointer-events-none/);
  assert.match(celebrationSource, /STORY_ASSETS\.groomBride\.portraitFlowers/);
  assert.match(celebrationSource, /RSVP_CELEBRATION_PETALS\.map/);
  assert.match(celebrationSource, /CANNON_RAYS\.map/);
  assert.match(celebrationSource, /data-rsvp-cannon/);
  assert.match(celebrationSource, /z-\[44\]/);
  assert.match(celebrationSource, /top-\[738px\]/);
  assert.match(celebrationSource, /w-\[150px\]/);
  assert.match(celebrationSource, /import RsvpFloralBrush/);
  assert.match(celebrationSource, /<RsvpFloralBrush/);
  assert.match(celebrationSource, /data-rsvp-petal/);
  assert.match(celebrationSource, /opacity: \[0, 1, 1, 1, 1\]/);
  assert.match(celebrationSource, /petal\.landingX/);
  assert.match(celebrationSource, /petal\.landingY/);
  assert.match(celebrationSource, /zIndex: 46 \+ \(index % 7\)/);
  assert.match(brushSource, /data-rsvp-floral-brush/);
  assert.match(brushSource, /BRUSH_IMAGE_LAYERS\.map/);
  assert.match(brushSource, /RSVP_FLORAL_BRUSH_BLOOMS\.map/);
  assert.match(brushSource, /RSVP_FLORAL_BRUSH_LEAVES\.map/);
  assert.match(brushSource, /STORY_ASSETS\.groomBride\.portraitFlowers/);
  assert.match(brushSource, /STORY_ASSETS\.groomBride\.groomBranch/);
  assert.match(brushSource, /STORY_ASSETS\.rsvpForm\.topVines/);
  assert.match(brushSource, /clipPath/);
  assert.doesNotMatch(celebrationSource, /Math\.random/);
  assert.doesNotMatch(brushSource, /Math\.random/);
});
