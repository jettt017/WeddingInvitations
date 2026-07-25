import assert from "node:assert/strict";
import test from "node:test";

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

class MemoryStorage implements StorageLike {
  readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

async function loadPersistenceModule() {
  return import("../lib/rsvp-persistence.ts").catch(() => null);
}

test("successful RSVP access survives refresh without storing guest data", async () => {
  const persistence = await loadPersistenceModule();

  assert.ok(persistence, "expected the RSVP persistence module to exist");
  if (!persistence) return;

  const storage = new MemoryStorage();

  assert.equal(persistence.loadPersistedInvitationAccess(storage), "locked");

  persistence.persistInvitationAccess(storage, "ready");
  assert.equal(persistence.loadPersistedInvitationAccess(storage), "ready");

  persistence.persistInvitationAccess(storage, "revealed");
  assert.equal(persistence.loadPersistedInvitationAccess(storage), "revealed");

  const serialized = storage.getItem(persistence.RSVP_ACCESS_STORAGE_KEY);
  assert.ok(serialized);
  assert.doesNotMatch(serialized, /name|guest|wishes|attendance/i);
});

test("invalid or unavailable browser storage keeps transaction access locked", async () => {
  const persistence = await loadPersistenceModule();

  assert.ok(persistence, "expected the RSVP persistence module to exist");
  if (!persistence) return;

  const invalid = new MemoryStorage();
  invalid.setItem(persistence.RSVP_ACCESS_STORAGE_KEY, "{not-json");

  const unavailable: StorageLike = {
    getItem() {
      throw new Error("storage unavailable");
    },
    setItem() {
      throw new Error("storage unavailable");
    },
    removeItem() {
      throw new Error("storage unavailable");
    },
  };

  assert.equal(persistence.loadPersistedInvitationAccess(invalid), "locked");
  assert.equal(persistence.loadPersistedInvitationAccess(unavailable), "locked");
  assert.doesNotThrow(() => persistence.persistInvitationAccess(unavailable, "ready"));
});

test("browser storage property failures never block in-session RSVP completion", async () => {
  const persistence = await loadPersistenceModule();

  assert.ok(persistence, "expected the RSVP persistence module to exist");
  if (!persistence) return;

  const storage = new MemoryStorage();
  const getStorage = () => storage;
  const blockedStorage = () => {
    throw new DOMException("Access denied", "SecurityError");
  };

  assert.equal(persistence.loadInvitationAccessSafely(getStorage), "locked");
  assert.equal(persistence.persistInvitationAccessSafely(getStorage, "ready"), true);
  assert.equal(persistence.loadInvitationAccessSafely(getStorage), "ready");

  assert.equal(persistence.loadInvitationAccessSafely(blockedStorage), "locked");
  assert.equal(persistence.persistInvitationAccessSafely(blockedStorage, "ready"), false);
});

test("fallback RSVP submission lease blocks other tabs and can only be released by its owner", async () => {
  const persistence = await loadPersistenceModule();

  assert.ok(persistence, "expected the RSVP persistence module to exist");
  if (!persistence) return;

  const storage = new MemoryStorage();
  const firstOwner = "tab-one";
  const secondOwner = "tab-two";

  assert.equal(persistence.acquireRsvpSubmissionLease(storage, firstOwner, 1_000), true);
  assert.equal(persistence.acquireRsvpSubmissionLease(storage, secondOwner, 1_001), false);
  assert.equal(persistence.releaseRsvpSubmissionLease(storage, secondOwner), false);
  assert.equal(persistence.acquireRsvpSubmissionLease(storage, secondOwner, 1_002), false);
  assert.equal(persistence.releaseRsvpSubmissionLease(storage, firstOwner), true);
  assert.equal(persistence.acquireRsvpSubmissionLease(storage, secondOwner, 1_003), true);
});

test("an expired fallback RSVP submission lease can be recovered after a closed tab", async () => {
  const persistence = await loadPersistenceModule();

  assert.ok(persistence, "expected the RSVP persistence module to exist");
  if (!persistence) return;

  const storage = new MemoryStorage();

  assert.equal(persistence.acquireRsvpSubmissionLease(storage, "closed-tab", 1_000, 500), true);
  assert.equal(persistence.acquireRsvpSubmissionLease(storage, "new-tab", 1_499, 500), false);
  assert.equal(persistence.acquireRsvpSubmissionLease(storage, "new-tab", 1_500, 500), true);
});

test("the fallback RSVP submission lease can be renewed only by its owner", async () => {
  const persistence = await loadPersistenceModule();

  assert.ok(persistence, "expected the RSVP persistence module to exist");
  if (!persistence) return;

  const storage = new MemoryStorage();

  assert.equal(persistence.acquireRsvpSubmissionLease(storage, "active-tab", 1_000, 500), true);
  assert.equal(persistence.renewRsvpSubmissionLease(storage, "other-tab", 1_400, 500), false);
  assert.equal(persistence.renewRsvpSubmissionLease(storage, "active-tab", 1_400, 500), true);
  assert.equal(persistence.acquireRsvpSubmissionLease(storage, "other-tab", 1_500, 500), false);
  assert.equal(persistence.acquireRsvpSubmissionLease(storage, "other-tab", 1_900, 500), true);
});
