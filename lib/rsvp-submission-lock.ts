interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface SubmissionLease {
  owner: string;
  expiresAt: number;
}

export const RSVP_SUBMISSION_LOCK_KEY = "wedding-invitation:rsvp-submission-lock:v1";
export const RSVP_SUBMISSION_LOCK_NAME = "wedding-invitation:rsvp-submission";

function readSubmissionLease(storage: StorageLike): SubmissionLease | null {
  try {
    const serialized = storage.getItem(RSVP_SUBMISSION_LOCK_KEY);
    if (!serialized) return null;

    const value: unknown = JSON.parse(serialized);
    if (!value || typeof value !== "object") return null;

    const lease = value as Partial<SubmissionLease>;
    if (
      typeof lease.owner !== "string" ||
      !lease.owner ||
      typeof lease.expiresAt !== "number" ||
      !Number.isFinite(lease.expiresAt)
    ) {
      return null;
    }

    return { owner: lease.owner, expiresAt: lease.expiresAt };
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

    const nextLease: SubmissionLease = { owner, expiresAt: now + durationMs };
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
    if (!currentLease || currentLease.owner !== owner || currentLease.expiresAt <= now) {
      return false;
    }

    const renewedLease: SubmissionLease = { owner, expiresAt: now + durationMs };
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
