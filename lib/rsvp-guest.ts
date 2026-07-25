import type { SupabaseClient } from "@supabase/supabase-js";

export type RsvpGuestLookup = "found" | "missing" | "failed";

export function normalizeRsvpGuestName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export async function findRsvpByGuestName(
  client: SupabaseClient,
  guestName: string
): Promise<RsvpGuestLookup> {
  const normalizedName = normalizeRsvpGuestName(guestName);
  if (!normalizedName) return "missing";

  const { data, error } = await client
    .from("rsvps")
    .select("id")
    .eq("name", normalizedName)
    .limit(1);

  if (error) return "failed";
  return data && data.length > 0 ? "found" : "missing";
}
