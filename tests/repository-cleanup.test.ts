import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const removedPaths = [
  "components/providers/lenis-provider.tsx",
  "components/ui/button.tsx",
  "components/ui/input.tsx",
  "lib/animations.ts",
  "utils/cn.ts",
  "public/file.svg",
  "public/globe.svg",
  "public/next.svg",
  "public/vercel.svg",
  "public/window.svg",
  "public/images/desktop/desktop-background.webp",
  "public/images/splash-screen/decoration.png",
  "public/images/story/date-event/rings-icon.svg",
  "public/images/story/groom-bride/groom-photo.webp",
  "public/images/story/gallery/collage.webp",
  "lib/rsvp-guest.ts",
  "lib/rsvp-persistence.ts",
  "types/rsvp.ts",
] as const;

test("unused source files and legacy assets are removed", async () => {
  for (const relativePath of removedPaths) {
    const absolutePath = path.join(process.cwd(), relativePath);
    const exists = await access(absolutePath).then(
      () => true,
      () => false
    );

    assert.equal(exists, false, `expected ${relativePath} to be removed`);
  }
});

test("unused scrolling and utility dependencies leave no runtime residue", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  const globals = await readFile("app/globals.css", "utf8");
  const experience = await readFile("components/InvitationExperience.tsx", "utf8");

  for (const dependency of ["clsx", "lenis", "react-intersection-observer", "tailwind-merge"]) {
    assert.equal(packageJson.dependencies?.[dependency], undefined);
    assert.equal(packageJson.devDependencies?.[dependency], undefined);
  }

  assert.doesNotMatch(globals, /\.lenis|data-lenis-prevent/);
  assert.doesNotMatch(experience, /data-lenis-prevent/);
});
