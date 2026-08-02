import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

type InvitationModule = typeof import("../lib/invitation.ts");

async function loadInvitationModule(): Promise<Partial<InvitationModule>> {
  return import("../lib/invitation.ts").catch(() => ({}));
}

test("guest identity uses only the to slug", async () => {
  const invitation = await loadInvitationModule();

  assert.equal(typeof invitation.resolveGuestSlug, "function");
  assert.equal(invitation.resolveGuestSlug?.("?guest=secondary&to=Rina-Fajar"), "rina-fajar");
  assert.equal(invitation.resolveGuestSlug?.("?guest=secondary"), "");
});

test("blank or invalid to values do not create a guest identity", async () => {
  const invitation = await loadInvitationModule();

  assert.equal(typeof invitation.resolveGuestSlug, "function");
  assert.equal(invitation.resolveGuestSlug?.("?to=%20%20"), "");
  assert.equal(invitation.resolveGuestSlug?.("?to=Rina%20%26%20Fajar"), "");
  assert.equal(invitation.resolveGuestSlug?.("?to=rina_fajar"), "");
});

test("guest greeting stays hidden while a valid invitation is resolving", async () => {
  const invitation = await loadInvitationModule();

  assert.equal(typeof invitation.resolveGuestGreetingName, "function");
  assert.equal(
    invitation.resolveGuestGreetingName?.({
      requestedSlug: "ellen-lusman",
      completedSlug: "",
      displayName: null,
      canResolve: true,
    }),
    null
  );
});

test("guest greeting uses the resolved Supabase display name", async () => {
  const invitation = await loadInvitationModule();

  assert.equal(typeof invitation.resolveGuestGreetingName, "function");
  assert.equal(
    invitation.resolveGuestGreetingName?.({
      requestedSlug: "ellen-lusman",
      completedSlug: "ellen-lusman",
      displayName: "Ibu Ellen Lusman",
      canResolve: true,
    }),
    "Ibu Ellen Lusman"
  );
});

test("guest greeting falls back to Guest when identity is unavailable", async () => {
  const invitation = await loadInvitationModule();

  assert.equal(typeof invitation.resolveGuestGreetingName, "function");
  assert.equal(
    invitation.resolveGuestGreetingName?.({
      requestedSlug: "missing-guest",
      completedSlug: "missing-guest",
      displayName: null,
      canResolve: true,
    }),
    "Guest"
  );
  assert.equal(
    invitation.resolveGuestGreetingName?.({
      requestedSlug: "",
      completedSlug: "",
      displayName: null,
      canResolve: true,
    }),
    "Guest"
  );
});

test("guest greeting layout stacks long names without changing short names", async () => {
  const invitation = await loadInvitationModule();

  assert.equal(typeof invitation.getGuestGreetingLayout, "function");
  assert.equal(invitation.getGuestGreetingLayout?.("Ibu Ellen Lusman"), "inline");
  assert.equal(
    invitation.getGuestGreetingLayout?.("dr. Nanang Rudianto Widodo, Sp.OG. (K) FER"),
    "stacked"
  );
  assert.equal(invitation.getGuestGreetingLayout?.(null), "inline");
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
  assert.doesNotMatch(mainRegion, /data-lenis-prevent/);
  assert.match(mainRegion, /focus-visible:ring-2/);
  assert.match(mainRegion, /focus-visible:ring-inset/);
  assert.equal(
    (experienceSource + mainScreenSource).match(/aria-labelledby="main-screen-title"/g)?.length,
    1
  );
});
