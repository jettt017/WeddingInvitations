import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readSource(path: string): Promise<string> {
  return readFile(new URL(path, import.meta.url), "utf8").catch(() => "");
}

test("invitation story renders the updated designs in narrative order", async () => {
  const source = await readSource("../components/invitation/InvitationStory.tsx");
  const components = [
    "<MainScreen",
    "<GroomBrideSection",
    "<CouplePhotoSection",
    "<DateEventSection",
    "<RsvpSection",
    "<TransactionSection",
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
    "TransactionSection.tsx",
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
    "244:41",
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
  assert.match(source, /<InvitationStory\b/);
  assert.doesNotMatch(source, /import MainScreen/);
});

test("RSVP form never reports a submission when Supabase is unavailable", async () => {
  const source = await readSource("../components/invitation/RsvpSection.tsx");
  const supabaseSource = await readSource("../lib/supabase.ts");

  assert.match(source, /const isConfigured = supabase !== null/);
  assert.match(source, /disabled=\{!isConfigured/);
  assert.match(source, /RSVP will be available soon/);
  assert.doesNotMatch(source, /persistInvitationAccess/);
  assert.match(supabaseSource, /supabase = hasSupabaseConfig/);
  assert.match(supabaseSource, /: null/);
});

test("RSVP transitions focus their mounted destination and announce form feedback", async () => {
  const source = await readSource("../components/invitation/RsvpSection.tsx");
  const experienceSource = await readSource("../components/InvitationExperience.tsx");
  const storySource = await readSource("../components/invitation/InvitationStory.tsx");

  assert.match(source, /useId/);
  assert.match(source, /attendanceRef\.current\?\.focus\(\)/);
  assert.match(source, /ref=\{attendanceRef\}/);
  assert.match(source, /function RsvpSuccess[\s\S]*successRef\.current\?\.focus\(\)/);
  assert.match(source, /ref=\{successRef\}[\s\S]*role="status"[\s\S]*tabIndex=\{-1\}/);
  assert.match(source, /submitError[\s\S]*role="alert"/);
  assert.match(source, /submissionInFlightRef/);
  assert.match(source, /navigator\.locks\.request/);
  assert.match(source, /renewRsvpSubmissionLease/);
  assert.match(source, /window\.setInterval/);
  assert.match(source, /inert=\{isSubmitting \|\| undefined\}/);
  assert.match(source, /if \(submissionInFlightRef\.current\) return/);
  assert.match(source, /if \(isSubmitting \|\| submissionInFlightRef\.current\) return/);
  assert.match(experienceSource, /const rsvpTriggerRef = useRef<HTMLButtonElement>\(null\)/);
  assert.match(experienceSource, /rsvpTriggerRef\.current\?\.focus\(\)/);
  assert.match(storySource, /triggerRef=\{rsvpTriggerRef\}/);

  const insertBoundary = source.indexOf("async function insertOnce");
  const completionMarker = source.indexOf("onSubmitted();", insertBoundary);
  const leaseRelease = source.indexOf("releaseRsvpSubmissionLease", completionMarker);
  assert.ok(insertBoundary >= 0 && completionMarker > insertBoundary);
  assert.ok(leaseRelease > completionMarker);

  for (const field of ["attendance", "name", "guests"]) {
    const errorId = `${field}ErrorId`;

    assert.match(source, new RegExp(`id=\\{${errorId}\\}`));
    assert.match(
      source,
      new RegExp(`aria-describedby=\\{errors\\.${field} \\? ${errorId} : undefined\\}`)
    );
  }
});

test("personalized invitations confirm and deduplicate RSVP data by the to guest name", async () => {
  const source = await readSource("../components/invitation/RsvpSection.tsx");
  const experienceSource = await readSource("../components/InvitationExperience.tsx");
  const guestSource = await readSource("../lib/rsvp-guest.ts");

  assert.match(experienceSource, /resolveGuestName/);
  assert.match(experienceSource, /isPersonalizedGuestName/);
  assert.match(experienceSource, /findRsvpByGuestName\(supabase, guestName\)/);
  assert.match(experienceSource, /guestName=\{guestName\}/);
  assert.match(source, /guestName\?: string/);
  assert.match(source, /readOnly=\{isPersonalizedGuest\}/);
  assert.match(source, /Please make sure your RSVP details are correct/);
  assert.match(source, /BACK TO EDIT/);
  assert.match(source, /YES, SEND RSVP/);
  assert.match(source, /findRsvpByGuestName\(configuredClient, guestIdentity\)/);
  assert.match(
    guestSource,
    /\.select\("id"\)[\s\S]*\.eq\("name", normalizedName\)[\s\S]*\.limit\(1\)/
  );
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

test("decorative image wrappers never cover interactive controls", async () => {
  const source = await readSource("../components/invitation/DecorativeImage.tsx");

  assert.match(source, /<motion\.div[\s\S]*className="pointer-events-none"/);
});

test("production component sources do not reference temporary Figma asset URLs", async () => {
  const files = [
    "InvitationStory.tsx",
    "GroomBrideSection.tsx",
    "CouplePhotoSection.tsx",
    "DateEventSection.tsx",
    "RsvpSection.tsx",
    "TransactionSection.tsx",
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
  assert.match(gallerySource, /src=\{fallback\.src\}/);
  assert.match(gallerySource, /alt=\{photo\.alt\}[\s\S]*object-cover/);
  assert.doesNotMatch(gallerySource, /blur-\[10px\]|object-contain/);
  assert.doesNotMatch(gallerySource, /const crop = fallback\.crop/);
  assert.match(gallerySource, /alt=\{photo\.alt\}/);
  assert.doesNotMatch(source, /photo placeholder/i);
  assert.doesNotMatch(source, /figma\.com\/api\/mcp\/asset/);
});

test("transaction section is gated by RSVP and reveals account details on demand", async () => {
  const experienceSource = await readSource("../components/InvitationExperience.tsx");
  const storySource = await readSource("../components/invitation/InvitationStory.tsx");
  const rsvpSource = await readSource("../components/invitation/RsvpSection.tsx");
  const transactionSource = await readSource("../components/invitation/TransactionSection.tsx");
  const routeSource = await readSource("../app/api/transaction/route.ts");

  assert.ok(
    storySource.indexOf("<RsvpSection") < storySource.indexOf("<TransactionSection") &&
      storySource.indexOf("<TransactionSection") < storySource.indexOf("<GallerySection")
  );
  assert.match(storySource, /interaction\.transaction !== "locked"/);
  assert.match(storySource, /mode=\{interaction\.transaction\}/);
  assert.match(storySource, /type: "reveal_transaction"/);
  assert.match(storySource, /completed=\{interaction\.transaction !== "locked"\}/);
  assert.match(transactionSource, /figmaNode="244:41"/);
  assert.match(transactionSource, /SUPPORT THE STORY/);
  assert.match(transactionSource, /Be Part of This Journey/);
  assert.match(transactionSource, /TAP TO REVEAL/);
  assert.match(transactionSource, /aria-expanded=\{mode === "revealed"\}/);
  assert.match(transactionSource, /aria-controls="transaction-account-details"/);
  assert.match(transactionSource, /fetch\("\/api\/transaction"/);
  assert.doesNotMatch(transactionSource, /\b\d{10,16}\b/);
  assert.doesNotMatch(transactionSource, /FAIZ ARDYSYAHPUTRA|PRAMESTHI WAHYURING KINASIH/);
  assert.doesNotMatch(routeSource, /\b\d{10,16}\b/);
  assert.match(routeSource, /readTransactionAccounts\(process\.env\)/);
  assert.match(routeSource, /status:\s*503/);
  assert.match(routeSource, /private, no-store/);
  assert.match(rsvpSource, /RSVP RECEIVED/);
  assert.match(experienceSource, /loadInvitationAccessSafely/);
  assert.match(experienceSource, /persistInvitationAccessSafely/);
  assert.match(experienceSource, /window\.addEventListener\("storage"/);
  assert.match(experienceSource, /RSVP_ACCESS_STORAGE_KEY/);
  assert.match(experienceSource, /onAlreadyCompleted=\{handleRsvpCompletionCheck\}/);
  assert.doesNotMatch(experienceSource, /InvitationAccess\(window\.localStorage/);
  assert.match(transactionSource, /STORY_ASSETS\.transaction/);
  assert.doesNotMatch(transactionSource, /figma\.com\/api\/mcp\/asset/);
});

test("RSVP overlay behaves as a modal and hides the invitation story", async () => {
  const source = await readSource("../components/InvitationExperience.tsx");

  assert.match(source, /const isRsvpOverlayOpen/);
  assert.match(source, /const shouldHideStory = isRsvpOverlayOpen \|\| isRsvpDialogExiting/);
  assert.match(source, /aria-hidden=\{shouldHideStory \|\| undefined\}/);
  assert.match(source, /inert=\{shouldHideStory \|\| undefined\}/);
  assert.match(source, /key="rsvp-dialog"/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /onKeyDown=\{handleRsvpDialogKeyDown\}/);
});

test("groom portrait crop keeps the face centered inside the arch", async () => {
  const source = await readSource("../components/invitation/GroomBrideSection.tsx");

  assert.match(source, /\? \{ left: -117, top: -94, width: 349, height: 523 \}/);
  assert.match(source, /sizes=\{isGroom \? "349px" : "343px"\}/);
});

test("document metadata matches Kinan and Faiz on 16 August 2026", async () => {
  const source = await readSource("../app/layout.tsx");

  assert.match(source, /Kinan & Faiz/);
  assert.match(source, /August 16, 2026/);
  assert.match(source, /Surabaya/);
  assert.doesNotMatch(source, /Bandung/);
  assert.doesNotMatch(source, /Alexander|Eleanor|Florence/);
});

test("event details render one compact Surabaya Suites reception card", async () => {
  const source = await readSource("../components/invitation/DateEventSection.tsx");

  assert.match(source, /height=\{938\}/);
  assert.match(source, /RESEPSI/);
  assert.match(source, /WEDDING_EVENT\.venue/);
  assert.match(source, /WEDDING_EVENT\.displayAddress/);
  assert.match(source, /href=\{WEDDING_EVENT\.mapUrl\}/);
  assert.doesNotMatch(source, /AKAD NIKAH|Masjid Raya|Bandung|ringsIcon/);
});

test("gallery matches the Figma photo windows without stretching images", async () => {
  const gallerySource = await readSource("../components/invitation/GallerySection.tsx");
  const storySource = await readSource("../lib/invitation-story.ts");

  assert.match(gallerySource, /width=\{fallback\.width\}/);
  assert.match(gallerySource, /height=\{fallback\.height\}/);
  assert.match(gallerySource, /left=\{89\} top=\{149\}/);
  assert.match(gallerySource, /left=\{67\}[\s\S]*top=\{318\}/);
  assert.match(gallerySource, /left=\{126\}[\s\S]*top=\{467\}/);
  assert.match(gallerySource, /top-\[170px\][\s\S]*h-\[617px\][\s\S]*w-\[347px\]/);
  assert.match(storySource, /gallery-feature-01-crop-[a-f0-9]{8}\.webp/);
  assert.match(storySource, /gallery-feature-02-crop-[a-f0-9]{8}\.webp/);
  assert.match(storySource, /gallery-feature-03-crop-[a-f0-9]{8}\.webp/);
  assert.match(storySource, /collage-85e96837\.webp/);
  assert.match(storySource, /groom-photo-[a-f0-9]{8}\.webp/);
  assert.doesNotMatch(storySource, /7a15de79|2933126a|76885071/);
  assert.doesNotMatch(gallerySource, /objectFit:\s*"fill"/);
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
