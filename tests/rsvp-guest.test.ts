import assert from "node:assert/strict";
import test from "node:test";

type RsvpGuestModule = typeof import("../lib/rsvp-guest.ts");

async function loadRsvpGuestModule(): Promise<Partial<RsvpGuestModule>> {
  return import("../lib/rsvp-guest.ts").catch(() => ({}));
}

function createLookupClient(result: {
  data: Array<{ id: string }> | null;
  error: { message: string } | null;
}) {
  const calls: Array<[string, string | number]> = [];
  const client = {
    from(table: string) {
      calls.push(["from", table]);
      return {
        select(columns: string) {
          calls.push(["select", columns]);
          return {
            eq(column: string, value: string) {
              calls.push(["eq", `${column}:${value}`]);
              return {
                limit(count: number) {
                  calls.push(["limit", count]);
                  return Promise.resolve(result);
                },
              };
            },
          };
        },
      };
    },
  };

  return { client, calls };
}

test("RSVP lookup trims the URL guest identity and detects an existing response", async () => {
  const rsvpGuest = await loadRsvpGuestModule();
  const { client, calls } = createLookupClient({
    data: [{ id: "existing-rsvp" }],
    error: null,
  });

  assert.equal(typeof rsvpGuest.findRsvpByGuestName, "function");
  if (!rsvpGuest.findRsvpByGuestName) return;

  const result = await rsvpGuest.findRsvpByGuestName(
    client as Parameters<typeof rsvpGuest.findRsvpByGuestName>[0],
    "  Rina   &   Fajar  "
  );

  assert.equal(result, "found");
  assert.deepEqual(calls, [
    ["from", "rsvps"],
    ["select", "id"],
    ["eq", "name:Rina & Fajar"],
    ["limit", 1],
  ]);
});

test("RSVP lookup distinguishes missing data from a failed Supabase check", async () => {
  const rsvpGuest = await loadRsvpGuestModule();

  assert.equal(typeof rsvpGuest.findRsvpByGuestName, "function");
  if (!rsvpGuest.findRsvpByGuestName) return;

  const missing = createLookupClient({ data: [], error: null });
  const failed = createLookupClient({
    data: null,
    error: { message: "network unavailable" },
  });

  assert.equal(
    await rsvpGuest.findRsvpByGuestName(
      missing.client as Parameters<typeof rsvpGuest.findRsvpByGuestName>[0],
      "Rina & Fajar"
    ),
    "missing"
  );
  assert.equal(
    await rsvpGuest.findRsvpByGuestName(
      failed.client as Parameters<typeof rsvpGuest.findRsvpByGuestName>[0],
      "Rina & Fajar"
    ),
    "failed"
  );
});
