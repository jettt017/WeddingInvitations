import assert from "node:assert/strict";
import test from "node:test";

type TransactionModule = typeof import("../lib/transaction.ts");

async function loadTransactionModule(): Promise<Partial<TransactionModule>> {
  return import("../lib/transaction.ts").catch(() => ({}));
}

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
  return import("../lib/rsvp-submission-lock.ts").catch(() => null);
}

test("transaction accounts are assembled only from complete server environment values", async () => {
  const transaction = await loadTransactionModule();

  assert.equal(typeof transaction.readTransactionAccounts, "function");
  if (!transaction.readTransactionAccounts) return;

  const accounts = transaction.readTransactionAccounts({
    WEDDING_MANDIRI_ACCOUNT_NAME: " Mandiri Holder ",
    WEDDING_MANDIRI_ACCOUNT_NUMBER: " 111222333 ",
    WEDDING_BRI_ACCOUNT_NAME: "BRI Holder",
    WEDDING_BRI_ACCOUNT_NUMBER: "444555666",
    WEDDING_BCA_ACCOUNT_NAME: "BCA Holder",
    WEDDING_BCA_ACCOUNT_NUMBER: "777888999",
  });

  assert.deepEqual(accounts, [
    { bank: "Mandiri", name: "Mandiri Holder", number: "111222333" },
    { bank: "BRI", name: "BRI Holder", number: "444555666" },
    { bank: "BCA", name: "BCA Holder", number: "777888999" },
  ]);
  assert.equal(
    transaction.readTransactionAccounts({
      WEDDING_MANDIRI_ACCOUNT_NAME: "Mandiri Holder",
    }),
    null
  );
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
