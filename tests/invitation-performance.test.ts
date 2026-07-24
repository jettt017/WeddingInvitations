import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readSource(path: string): Promise<string> {
  return readFile(new URL(path, import.meta.url), "utf8").catch(() => "");
}

test("the responsive shell hydrates only one invitation experience", async () => {
  const pageSource = await readSource("../app/page.tsx");
  const layoutSource = await readSource("../app/layout.tsx");
  const previewSource = await readSource("../components/layout/DesktopPreview.tsx");
  const experienceCount = pageSource.match(/<InvitationExperience\b/g)?.length ?? 0;

  assert.equal(experienceCount, 1);
  assert.match(pageSource, /<DesktopPreview>[\s\S]*<InvitationExperience/);
  assert.doesNotMatch(layoutSource, /LenisProvider|ReactLenis/);
  assert.match(previewSource, /lg:block/);
  assert.match(previewSource, /bg-\[url\('\/images\/desktop\/desktop-background\.webp'\)\]/);
  assert.doesNotMatch(previewSource, /<Image|<img/);
});

test("offscreen story sections are contained and entrance motion only runs once", async () => {
  const sectionSource = await readSource("../components/invitation/StorySection.tsx");
  const animatedFiles = [
    "../components/main-screen/MainScreen.tsx",
    "../components/invitation/GroomBrideSection.tsx",
    "../components/invitation/CouplePhotoSection.tsx",
    "../components/invitation/DateEventSection.tsx",
    "../components/invitation/RsvpSection.tsx",
    "../components/invitation/GallerySection.tsx",
    "../components/invitation/ThankYouSection.tsx",
  ];
  const animationSource = (await Promise.all(animatedFiles.map((file) => readSource(file)))).join(
    "\n"
  );

  assert.match(sectionSource, /contentVisibility:\s*"auto"/);
  assert.match(sectionSource, /contain:\s*"layout paint"/);
  assert.doesNotMatch(animationSource, /once:\s*false/);
  assert.doesNotMatch(animationSource, /initial:\s*\{ opacity: 0, y, filter: "blur\(2px\)" \}/);
});

test("motion and splash images respect device capabilities", async () => {
  const experienceSource = await readSource("../components/InvitationExperience.tsx");
  const heroSource = await readSource("../components/splash-screen/HeroBackground.tsx");
  const rsvpSource = await readSource("../components/invitation/RsvpSection.tsx");
  const priorityCount = heroSource.match(/\bpriority\b/g)?.length ?? 0;

  assert.match(experienceSource, /<MotionConfig reducedMotion="user">/);
  assert.match(heroSource, /sizes="\(min-width: 1024px\) 393px, 100vw"/);
  assert.match(heroSource, /alt="Rings ornament"[\s\S]*sizes="160px"/);
  assert.match(heroSource, /alt="Open Invitation"[\s\S]*sizes="210px"/);
  assert.match(heroSource, /motion-reduce:animate-none/);
  assert.equal(rsvpSource.match(/motion-reduce:animate-none/g)?.length, 3);
  assert.equal(priorityCount, 1);
});
