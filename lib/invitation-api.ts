import type { SupabaseClient } from "@supabase/supabase-js";

export interface InvitationGuest {
  id: string;
  slug: string;
  displayName: string;
  maxGuests: number;
  hasRsvp: boolean;
  hasWish: boolean;
}

export interface VisibleWish {
  id: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export type GuestResolution =
  | { status: "found"; guest: InvitationGuest }
  | { status: "missing" | "failed" };

export type SubmissionResult =
  | { status: "submitted"; id: string }
  | { status: "already-completed" | "failed" };

export type WishesResult =
  | { status: "loaded"; wishes: VisibleWish[] }
  | { status: "failed"; wishes: [] };

interface GuestRpcRow {
  guest_id: string;
  slug: string;
  display_name: string;
  max_guests: number;
  has_rsvp: boolean;
  has_wish: boolean;
}

interface WishRpcRow {
  id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

function isGuestRpcRow(value: unknown): value is GuestRpcRow {
  if (!value || typeof value !== "object") return false;

  const row = value as Partial<GuestRpcRow>;
  return (
    typeof row.guest_id === "string" &&
    typeof row.slug === "string" &&
    typeof row.display_name === "string" &&
    Number.isInteger(row.max_guests) &&
    typeof row.has_rsvp === "boolean" &&
    typeof row.has_wish === "boolean"
  );
}

function isWishRpcRow(value: unknown): value is WishRpcRow {
  if (!value || typeof value !== "object") return false;

  const row = value as Partial<WishRpcRow>;
  return (
    typeof row.id === "string" &&
    typeof row.sender_name === "string" &&
    typeof row.message === "string" &&
    typeof row.created_at === "string"
  );
}

export function normalizeGuestSlug(value: string): string {
  return value.trim().toLocaleLowerCase("en-US");
}

export async function resolveInvitationGuest(
  client: SupabaseClient,
  guestSlug: string
): Promise<GuestResolution> {
  const slug = normalizeGuestSlug(guestSlug);
  if (!slug) return { status: "missing" };

  const { data, error } = await client.rpc("resolve_guest", { p_slug: slug });
  if (error) return { status: "failed" };

  const row = Array.isArray(data) ? data[0] : data;
  if (!isGuestRpcRow(row)) return { status: "missing" };

  return {
    status: "found",
    guest: {
      id: row.guest_id,
      slug: row.slug,
      displayName: row.display_name,
      maxGuests: row.max_guests,
      hasRsvp: row.has_rsvp,
      hasWish: row.has_wish,
    },
  };
}

export async function submitGuestRsvp(
  client: SupabaseClient,
  guestSlug: string,
  guestCount: number
): Promise<SubmissionResult> {
  const { data, error } = await client.rpc("submit_rsvp", {
    p_slug: normalizeGuestSlug(guestSlug),
    p_guest_count: guestCount,
  });

  if (error?.message.includes("RSVP_ALREADY_EXISTS")) {
    return { status: "already-completed" };
  }
  if (error || typeof data !== "string") return { status: "failed" };

  return { status: "submitted", id: data };
}

export async function submitGuestWish(
  client: SupabaseClient,
  guestSlug: string,
  senderName: string,
  message: string
): Promise<SubmissionResult> {
  const { data, error } = await client.rpc("submit_wish", {
    p_slug: normalizeGuestSlug(guestSlug),
    p_sender_name: senderName.trim(),
    p_message: message.trim(),
  });

  if (error?.message.includes("WISH_ALREADY_EXISTS")) {
    return { status: "already-completed" };
  }
  if (error || typeof data !== "string") return { status: "failed" };

  return { status: "submitted", id: data };
}

export async function listVisibleWishes(client: SupabaseClient, limit = 50): Promise<WishesResult> {
  const safeLimit = Math.max(1, Math.min(Math.trunc(limit) || 50, 100));
  const { data, error } = await client.rpc("list_visible_wishes", { p_limit: safeLimit });

  if (error || !Array.isArray(data) || !data.every(isWishRpcRow)) {
    return { status: "failed", wishes: [] };
  }

  return {
    status: "loaded",
    wishes: data.map((wish) => ({
      id: wish.id,
      senderName: wish.sender_name,
      message: wish.message,
      createdAt: wish.created_at,
    })),
  };
}
