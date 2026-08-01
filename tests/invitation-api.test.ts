import assert from "node:assert/strict";
import test from "node:test";

type InvitationApiModule = typeof import("../lib/invitation-api.ts");

async function loadInvitationApi(): Promise<Partial<InvitationApiModule>> {
  return import("../lib/invitation-api.ts").catch(() => ({}));
}

function createRpcClient(responses: Array<{ data: unknown; error: { message: string } | null }>) {
  const calls: Array<{ name: string; params: Record<string, unknown> }> = [];
  const client = {
    rpc(name: string, params: Record<string, unknown>) {
      calls.push({ name, params });
      return Promise.resolve(responses.shift() ?? { data: null, error: null });
    },
  };

  return { client, calls };
}

test("guest resolution uses the URL slug without exposing the guests table", async () => {
  const api = await loadInvitationApi();
  const { client, calls } = createRpcClient([
    {
      data: [
        {
          guest_id: "guest-1",
          slug: "rina-fajar",
          display_name: "Rina & Fajar",
          max_guests: 2,
          has_rsvp: true,
          has_wish: false,
        },
      ],
      error: null,
    },
  ]);

  assert.equal(typeof api.resolveInvitationGuest, "function");
  if (!api.resolveInvitationGuest) return;

  const result = await api.resolveInvitationGuest(
    client as unknown as Parameters<typeof api.resolveInvitationGuest>[0],
    "  RINA-FAJAR  "
  );

  assert.deepEqual(calls, [{ name: "resolve_guest", params: { p_slug: "rina-fajar" } }]);
  assert.deepEqual(result, {
    status: "found",
    guest: {
      id: "guest-1",
      slug: "rina-fajar",
      displayName: "Rina & Fajar",
      maxGuests: 2,
      hasRsvp: true,
      hasWish: false,
    },
  });
});

test("blank and unknown guest slugs remain unpersonalized", async () => {
  const api = await loadInvitationApi();
  const blankClient = createRpcClient([]);
  const missingClient = createRpcClient([{ data: [], error: null }]);

  assert.equal(typeof api.resolveInvitationGuest, "function");
  if (!api.resolveInvitationGuest) return;

  assert.deepEqual(
    await api.resolveInvitationGuest(
      blankClient.client as unknown as Parameters<typeof api.resolveInvitationGuest>[0],
      "   "
    ),
    { status: "missing" }
  );
  assert.equal(blankClient.calls.length, 0);
  assert.deepEqual(
    await api.resolveInvitationGuest(
      missingClient.client as unknown as Parameters<typeof api.resolveInvitationGuest>[0],
      "unknown"
    ),
    { status: "missing" }
  );
});

test("RSVP submission is slug-based and reports an existing confirmation", async () => {
  const api = await loadInvitationApi();
  const submittedClient = createRpcClient([{ data: "rsvp-1", error: null }]);
  const duplicateClient = createRpcClient([
    { data: null, error: { message: "RSVP_ALREADY_EXISTS" } },
  ]);

  assert.equal(typeof api.submitGuestRsvp, "function");
  if (!api.submitGuestRsvp) return;

  assert.deepEqual(
    await api.submitGuestRsvp(
      submittedClient.client as unknown as Parameters<typeof api.submitGuestRsvp>[0],
      "Rina-Fajar",
      2
    ),
    { status: "submitted", id: "rsvp-1" }
  );
  assert.deepEqual(submittedClient.calls, [
    {
      name: "submit_rsvp",
      params: { p_slug: "rina-fajar", p_guest_count: 2 },
    },
  ]);
  assert.deepEqual(
    await api.submitGuestRsvp(
      duplicateClient.client as unknown as Parameters<typeof api.submitGuestRsvp>[0],
      "rina-fajar",
      2
    ),
    { status: "already-completed" }
  );
});

test("wishes use their own RPCs and map visible messages", async () => {
  const api = await loadInvitationApi();
  const submitClient = createRpcClient([{ data: "wish-1", error: null }]);
  const listClient = createRpcClient([
    {
      data: [
        {
          id: "wish-1",
          sender_name: "Rina",
          message: "Semoga bahagia selalu.",
          created_at: "2026-08-01T00:00:00.000Z",
        },
      ],
      error: null,
    },
  ]);

  assert.equal(typeof api.submitGuestWish, "function");
  assert.equal(typeof api.listVisibleWishes, "function");
  if (!api.submitGuestWish || !api.listVisibleWishes) return;

  assert.deepEqual(
    await api.submitGuestWish(
      submitClient.client as unknown as Parameters<typeof api.submitGuestWish>[0],
      "rina-fajar",
      " Rina ",
      " Semoga bahagia selalu. "
    ),
    { status: "submitted", id: "wish-1" }
  );
  assert.deepEqual(submitClient.calls, [
    {
      name: "submit_wish",
      params: {
        p_slug: "rina-fajar",
        p_sender_name: "Rina",
        p_message: "Semoga bahagia selalu.",
      },
    },
  ]);

  assert.deepEqual(
    await api.listVisibleWishes(
      listClient.client as unknown as Parameters<typeof api.listVisibleWishes>[0],
      25
    ),
    {
      status: "loaded",
      wishes: [
        {
          id: "wish-1",
          senderName: "Rina",
          message: "Semoga bahagia selalu.",
          createdAt: "2026-08-01T00:00:00.000Z",
        },
      ],
    }
  );
  assert.deepEqual(listClient.calls, [{ name: "list_visible_wishes", params: { p_limit: 25 } }]);
});
