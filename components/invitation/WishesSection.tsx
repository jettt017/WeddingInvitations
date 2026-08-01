"use client";

import { type FormEvent, useEffect, useId, useState } from "react";

import DecorativeImage from "@/components/invitation/DecorativeImage";
import StorySection from "@/components/invitation/StorySection";
import {
  type InvitationGuest,
  listVisibleWishes,
  submitGuestWish,
  type VisibleWish,
} from "@/lib/invitation-api";
import { STORY_ASSETS } from "@/lib/invitation-story";
import { supabase } from "@/lib/supabase";

interface WishesSectionProps {
  guest: InvitationGuest | null;
  onWishSubmitted: () => void;
}

function getRelativeTime(dateString: string): string {
  const value = new Date(dateString).getTime();
  if (!Number.isFinite(value)) return "";

  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - value) / 60_000));
  if (elapsedMinutes < 1) return "Baru saja";
  if (elapsedMinutes < 60) return `${elapsedMinutes} menit yang lalu`;

  const hours = Math.floor(elapsedMinutes / 60);
  if (hours < 24) return `${hours} jam yang lalu`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari yang lalu`;
  return `${Math.floor(days / 7)} minggu yang lalu`;
}

export default function WishesSection({ guest, onWishSubmitted }: WishesSectionProps) {
  const assets = STORY_ASSETS.rsvp;
  const formId = useId();
  const [senderName, setSenderName] = useState(guest?.displayName ?? "");
  const [message, setMessage] = useState("");
  const [wishes, setWishes] = useState<VisibleWish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(Boolean(guest?.hasWish));
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadWishes() {
      if (!supabase) {
        setIsLoading(false);
        return;
      }

      const result = await listVisibleWishes(supabase, 50);
      if (cancelled) return;

      if (result.status === "loaded") {
        setWishes(result.wishes);
      }
      setIsLoading(false);
    }

    void loadWishes();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !guest || isCompleted || isSubmitting) return;

    const normalizedName = senderName.trim();
    const normalizedMessage = message.trim();
    if (!normalizedName || !normalizedMessage) {
      setError("Please enter your name and message.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    const result = await submitGuestWish(supabase, guest.slug, normalizedName, normalizedMessage);
    setIsSubmitting(false);

    if (result.status === "failed") {
      setError("Your message could not be saved. Please try again.");
      return;
    }

    setIsCompleted(true);
    onWishSubmitted();

    if (result.status === "submitted") {
      setWishes((current) => [
        {
          id: result.id,
          senderName: normalizedName,
          message: normalizedMessage,
          createdAt: new Date().toISOString(),
        },
        ...current,
      ]);
    }
  }

  const canSubmit = Boolean(supabase && guest && !isCompleted);

  return (
    <StorySection figmaNode="wishes" section="wishes">
      <div className="absolute inset-0 text-[#453F2F]">
        <DecorativeImage
          src={assets.topCanopy}
          box={{ left: -65, top: -72, width: 522, height: 301 }}
          sizes="522px"
          imageStyle={{ objectPosition: "bottom" }}
        />
        <DecorativeImage
          src={assets.blurredVines}
          box={{ left: -545, top: -115, width: 1136, height: 269, filter: "blur(3px)" }}
          imageBox={{ left: "-0.01%", top: "-345.35%", width: "100.02%", height: "750.93%" }}
          sizes="1136px"
        />

        <header className="absolute top-[70px] left-0 z-10 w-full text-center">
          <h2 className="font-playfair text-[39px] leading-[52px] tracking-[1.1px]">
            Wishes &amp; Prayers
          </h2>
          <p className="font-literata mt-1 text-[12px] leading-5">
            Leave a warm message for Kinan &amp; Faiz
          </p>
        </header>
        <DecorativeImage
          src={assets.headingFlourish}
          box={{ left: 101, top: 150, width: 191, height: 29 }}
          sizes="191px"
          imageStyle={{ objectPosition: "bottom" }}
        />

        <form
          onSubmit={handleSubmit}
          aria-labelledby={`${formId}-title`}
          className="absolute top-[198px] left-[25px] z-10 w-[343px] rounded-[24px] border border-[#7C5649]/15 bg-[#E9DCCB]/90 px-5 py-5 shadow-[0_18px_45px_-28px_rgba(69,63,47,0.65)]"
        >
          <h3 id={`${formId}-title`} className="sr-only">
            Send a wish
          </h3>
          <label className="font-playfair block text-[13px]">
            Sender name
            <input
              value={senderName}
              maxLength={80}
              onChange={(event) => setSenderName(event.target.value)}
              disabled={!canSubmit}
              className="mt-2 h-11 w-full rounded-full bg-[#FAEBE0]/90 px-4 outline-none focus-visible:ring-2 focus-visible:ring-[#7C5649] disabled:opacity-70"
            />
          </label>
          <label className="font-playfair mt-3 block text-[13px]">
            Message
            <textarea
              value={message}
              maxLength={1000}
              rows={3}
              onChange={(event) => setMessage(event.target.value)}
              disabled={!canSubmit}
              className="mt-2 w-full resize-none rounded-[17px] bg-[#FAEBE0]/90 px-4 py-3 font-sans text-[12px] leading-5 outline-none focus-visible:ring-2 focus-visible:ring-[#7C5649] disabled:opacity-70"
            />
          </label>
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="font-playfair mt-3 h-11 w-full rounded-full bg-[#7C5649] text-[12px] font-bold tracking-[0.08em] text-white focus-visible:ring-2 focus-visible:ring-[#7C5649] focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isSubmitting ? "SENDING..." : isCompleted ? "WISH RECEIVED" : "SEND WISH"}
          </button>
          {!guest ? (
            <p className="font-literata mt-2 text-center text-[10px] leading-4 text-[#62483E]">
              Open your personal invitation link to send a message.
            </p>
          ) : null}
          {error ? (
            <p role="alert" className="mt-2 text-center text-[10px] text-[#7C2D24]">
              {error}
            </p>
          ) : null}
        </form>

        <section
          aria-label="Guest wishes"
          className="absolute top-[536px] left-[25px] z-10 flex h-[268px] w-[343px] flex-col"
        >
          <h3 className="font-playfair text-center text-[16px] font-bold tracking-[0.06em] uppercase">
            Messages from our guests
          </h3>
          <div className="mx-auto mt-1 mb-3 h-px w-16 bg-[#7C5649]/35" />
          <div className="min-h-0 flex-1 [scrollbar-width:none] space-y-3 overflow-y-auto px-2 pb-8 [&::-webkit-scrollbar]:hidden">
            {isLoading ? (
              <p className="font-literata mt-6 text-center text-xs italic opacity-60">
                Loading wishes...
              </p>
            ) : wishes.length === 0 ? (
              <p className="font-literata mt-6 text-center text-xs italic opacity-60">
                Be the first to leave a wish!
              </p>
            ) : (
              wishes.map((wish) => (
                <article key={wish.id} className="border-b border-[#7C5649]/15 pb-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-playfair text-[13px] font-bold">{wish.senderName}</h4>
                    <time className="shrink-0 font-sans text-[9px] opacity-55">
                      {getRelativeTime(wish.createdAt)}
                    </time>
                  </div>
                  <p className="font-literata mt-1 text-[11px] leading-[16px] whitespace-pre-wrap italic">
                    &ldquo;{wish.message}&rdquo;
                  </p>
                </article>
              ))
            )}
          </div>
          <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-10 bg-gradient-to-t from-[#FAEBE0] to-transparent" />
        </section>
      </div>
    </StorySection>
  );
}
