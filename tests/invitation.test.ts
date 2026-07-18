import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

type InvitationModule = typeof import("../lib/invitation.ts");

async function loadInvitationModule(): Promise<Partial<InvitationModule>> {
  return import("../lib/invitation.ts").catch(() => ({}));
}

test("to wins over guest", async () => {
  const invitation = await loadInvitationModule();

  assert.equal(typeof invitation.resolveGuestName, "function");
  assert.equal(invitation.resolveGuestName?.("?guest=Secondary&to=Primary"), "Primary");
});

test("blank to falls through to guest", async () => {
  const invitation = await loadInvitationModule();

  assert.equal(typeof invitation.resolveGuestName, "function");
  assert.equal(invitation.resolveGuestName?.("?to=%20%20&guest=%20Taylor%20"), "Taylor");
});

test("g is URL decoded", async () => {
  const invitation = await loadInvitationModule();

  assert.equal(typeof invitation.resolveGuestName, "function");
  assert.equal(invitation.resolveGuestName?.("?g=Rina+%26+Fajar"), "Rina & Fajar");
});

test("returns object when supported values are absent or blank", async () => {
  const invitation = await loadInvitationModule();

  assert.equal(typeof invitation.resolveGuestName, "function");
  assert.equal(invitation.resolveGuestName?.("?to=%20&guest=&g=%09&name=Ignored"), "object");
});

test("open maps splash to main", async () => {
  const invitation = await loadInvitationModule();

  assert.equal(typeof invitation.invitationViewReducer, "function");
  assert.equal(invitation.invitationViewReducer?.("splash", { type: "open" }), "main");
});

test("repeated open remains main", async () => {
  const invitation = await loadInvitationModule();

  assert.equal(typeof invitation.invitationViewReducer, "function");
  if (!invitation.invitationViewReducer) {
    return;
  }

  const openedView = invitation.invitationViewReducer("splash", { type: "open" });

  assert.equal(invitation.invitationViewReducer(openedView, { type: "open" }), "main");
});

test("main screen assets use eight unique local image paths", async () => {
  const invitation = await loadInvitationModule();

  assert.equal(typeof invitation.MAIN_SCREEN_ASSETS, "object");
  if (!invitation.MAIN_SCREEN_ASSETS) {
    return;
  }

  assert.deepEqual(invitation.MAIN_SCREEN_ASSETS, {
    paperTexture: "/images/main-screen/paper-texture.webp",
    centerFloralOrnament: "/images/main-screen/center-floral-ornament.png",
    butterfly: "/images/main-screen/butterfly.png",
    topFloralFrame: "/images/main-screen/top-floral-frame.png",
    hangingVines: "/images/main-screen/hanging-vines.png",
    tornPaperDivider: "/images/main-screen/torn-paper-divider.png",
    lowerBotanicalFrame: "/images/main-screen/lower-botanical-frame.png",
    topFloralOverlay: "/images/main-screen/top-floral-overlay.png",
  });

  const paths = Object.values(invitation.MAIN_SCREEN_ASSETS);

  assert.equal(paths.length, 8);
  assert.equal(new Set(paths).size, 8);
  assert.ok(paths.every((path) => path.startsWith("/images/main-screen/")));
  assert.ok(paths.every((path) => !path.includes("figma.com")));
});

test("main screen scroll region is keyboard accessible", async () => {
  const experienceSource = await readFile(
    new URL("../components/InvitationExperience.tsx", import.meta.url),
    "utf8"
  );
  const mainScreenSource = await readFile(
    new URL("../components/main-screen/MainScreen.tsx", import.meta.url),
    "utf8"
  );
  const mainRegion = experienceSource.match(/<motion\.div\s+key="main"[\s\S]*?>/)?.[0];

  assert.ok(mainRegion);
  assert.match(mainRegion, /role="region"/);
  assert.match(mainRegion, /aria-labelledby="main-screen-title"/);
  assert.match(mainRegion, /tabIndex=\{0\}/);
  assert.match(mainRegion, /data-lenis-prevent=""/);
  assert.match(mainRegion, /focus-visible:ring-2/);
  assert.match(mainRegion, /focus-visible:ring-inset/);
  assert.equal(
    (experienceSource + mainScreenSource).match(/aria-labelledby="main-screen-title"/g)?.length,
    1
  );
});
