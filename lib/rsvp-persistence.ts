export type PersistedTransactionAccess = "locked" | "ready" | "revealed";

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface PersistedAccessPayload {
  version: 1;
  transaction: Exclude<PersistedTransactionAccess, "locked">;
}

export const RSVP_ACCESS_STORAGE_KEY = "wedding-invitation:rsvp-access:v1";
export const RSVP_SUBMISSION_LOCK_KEY = "wedding-invitation:rsvp-submission-lock:v1";
export const RSVP_SUBMISSION_LOCK_NAME = "wedding-invitation:rsvp-submission";

interface PersistedSubmissionLease {
  owner: string;
  expiresAt: number;
}

function isPersistedAccessPayload(value: unknown): value is PersistedAccessPayload {
  if (!value || typeof value !== "object") return false;

  const payload = value as Partial<PersistedAccessPayload>;

  return (
    payload.version === 1 && (payload.transaction === "ready" || payload.transaction === "revealed")
  );
}

export function loadPersistedInvitationAccess(storage: StorageLike): PersistedTransactionAccess {
  try {
    const serialized = storage.getItem(RSVP_ACCESS_STORAGE_KEY);
    if (!serialized) return "locked";

    const payload: unknown = JSON.parse(serialized);
    return isPersistedAccessPayload(payload) ? payload.transaction : "locked";
  } catch {
    return "locked";
  }
}

export function persistInvitationAccess(
  storage: StorageLike,
  transaction: Exclude<PersistedTransactionAccess, "locked">
): boolean {
  try {
    const payload: PersistedAccessPayload = {
      version: 1,
      transaction,
    };

    storage.setItem(RSVP_ACCESS_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    // Browser privacy settings or a full storage quota must not break the invitation.
    return false;
  }
}

export function loadInvitationAccessSafely(
  getStorage: () => StorageLike
): PersistedTransactionAccess {
  try {
    return loadPersistedInvitationAccess(getStorage());
  } catch {
    return "locked";
  }
}

export function persistInvitationAccessSafely(
  getStorage: () => StorageLike,
  transaction: Exclude<PersistedTransactionAccess, "locked">
): boolean {
  try {
    return persistInvitationAccess(getStorage(), transaction);
  } catch {
    return false;
  }
}

function readSubmissionLease(storage: StorageLike): PersistedSubmissionLease | null {
  try {
    const serialized = storage.getItem(RSVP_SUBMISSION_LOCK_KEY);
    if (!serialized) return null;

    const value: unknown = JSON.parse(serialized);
    if (!value || typeof value !== "object") return null;

    const lease = value as Partial<PersistedSubmissionLease>;
    if (
      typeof lease.owner !== "string" ||
      !lease.owner ||
      typeof lease.expiresAt !== "number" ||
      !Number.isFinite(lease.expiresAt)
    ) {
      return null;
    }

    return {
      owner: lease.owner,
      expiresAt: lease.expiresAt,
    };
  } catch {
    return null;
  }
}

export function acquireRsvpSubmissionLease(
  storage: StorageLike,
  owner: string,
  now = Date.now(),
  durationMs = 30_000
): boolean {
  try {
    const currentLease = readSubmissionLease(storage);
    if (currentLease && currentLease.expiresAt > now && currentLease.owner !== owner) {
      return false;
    }

    const nextLease: PersistedSubmissionLease = {
      owner,
      expiresAt: now + durationMs,
    };
    storage.setItem(RSVP_SUBMISSION_LOCK_KEY, JSON.stringify(nextLease));

    return readSubmissionLease(storage)?.owner === owner;
  } catch {
    return false;
  }
}

export function renewRsvpSubmissionLease(
  storage: StorageLike,
  owner: string,
  now = Date.now(),
  durationMs = 30_000
): boolean {
  try {
    const currentLease = readSubmissionLease(storage);
    if (
      !currentLease ||
      currentLease.owner !== owner ||
      currentLease.expiresAt <= now
    ) {
      return false;
    }

    const renewedLease: PersistedSubmissionLease = {
      owner,
      expiresAt: now + durationMs,
    };
    storage.setItem(RSVP_SUBMISSION_LOCK_KEY, JSON.stringify(renewedLease));

    const storedLease = readSubmissionLease(storage);
    return storedLease?.owner === owner && storedLease.expiresAt === renewedLease.expiresAt;
  } catch {
    return false;
  }
}

export function releaseRsvpSubmissionLease(storage: StorageLike, owner: string): boolean {
  try {
    if (readSubmissionLease(storage)?.owner !== owner) return false;

    storage.removeItem(RSVP_SUBMISSION_LOCK_KEY);
    return true;
  } catch {
    return false;
  }
}
