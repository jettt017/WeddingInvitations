"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import DecorativeImage from "@/components/invitation/DecorativeImage";
import StorySection from "@/components/invitation/StorySection";
import { STORY_ASSETS } from "@/lib/invitation-story";
import type { TransactionAccount, TransactionBank, TransactionResponse } from "@/lib/transaction";

interface TransactionSectionProps {
  mode: "ready" | "revealed";
  onReveal: () => void;
  revealButtonRef?: RefObject<HTMLButtonElement | null>;
}

interface AccountLayout {
  logo: string;
  logoBox: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  top: number;
}

const ACCOUNT_LAYOUT: Record<TransactionBank, AccountLayout> = {
  Mandiri: {
    logo: STORY_ASSETS.transaction.mandiriLogo,
    logoBox: { left: 164, top: 195, width: 79, height: 27 },
    top: 144,
  },
  BRI: {
    logo: STORY_ASSETS.transaction.briLogo,
    logoBox: { left: 177, top: 284, width: 49, height: 49 },
    top: 241,
  },
  BCA: {
    logo: STORY_ASSETS.transaction.bcaLogo,
    logoBox: { left: 167, top: 390, width: 69, height: 52 },
    top: 351,
  },
};

type LoadState =
  | { status: "idle" | "loading" }
  | { status: "loaded"; accounts: TransactionAccount[] }
  | { status: "error" };

function isTransactionResponse(value: unknown): value is TransactionResponse {
  if (!value || typeof value !== "object") return false;

  const accounts = (value as Partial<TransactionResponse>).accounts;
  if (!Array.isArray(accounts)) return false;

  return accounts.every(
    (account) =>
      account &&
      typeof account === "object" &&
      (account.bank === "Mandiri" || account.bank === "BRI" || account.bank === "BCA") &&
      typeof account.name === "string" &&
      typeof account.number === "string"
  );
}

function Account({ account }: { account: TransactionAccount }) {
  const layout = ACCOUNT_LAYOUT[account.bank];

  return (
    <div>
      <div
        className="absolute left-[49px] z-10 w-[295px] text-center text-black"
        style={{ top: layout.top }}
      >
        <p className="font-playfair text-[15.7px] leading-[21.979px] font-bold tracking-[0.3925px]">
          {account.name}
        </p>
        <p className="font-literata text-[15.7px] leading-[21.979px] tracking-[0.3925px] tabular-nums">
          {account.number}
        </p>
      </div>
      <div
        className="absolute z-10"
        style={{
          left: layout.logoBox.left,
          top: layout.logoBox.top,
          width: layout.logoBox.width,
          height: layout.logoBox.height,
        }}
      >
        <Image
          src={layout.logo}
          alt={`${account.bank} logo`}
          fill
          sizes={`${layout.logoBox.width}px`}
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default function TransactionSection({
  mode,
  onReveal,
  revealButtonRef,
}: TransactionSectionProps) {
  const assets = STORY_ASSETS.transaction;
  const shouldReduceMotion = useReducedMotion();
  const [loadState, setLoadState] = useState<LoadState>({ status: "idle" });
  const requestRef = useRef<Promise<TransactionAccount[]> | null>(null);

  const loadAccounts = useCallback(async () => {
    const request =
      requestRef.current ??
      fetch("/api/transaction", { cache: "no-store" }).then(async (result) => {
        if (!result.ok) throw new Error("Account details could not be loaded.");

        const payload: unknown = await result.json();
        if (!isTransactionResponse(payload)) {
          throw new Error("Account details returned an unexpected response.");
        }

        return payload.accounts;
      });

    requestRef.current = request;

    try {
      const accounts = await request;
      setLoadState({ status: "loaded", accounts });
    } catch {
      requestRef.current = null;
      setLoadState({ status: "error" });
    }
  }, []);

  useEffect(() => {
    if (mode === "revealed" && loadState.status === "idle") {
      void loadAccounts();
    }
  }, [loadAccounts, loadState.status, mode]);

  const handleRetry = () => {
    requestRef.current = null;
    setLoadState({ status: "loading" });
    void loadAccounts();
  };

  return (
    <StorySection figmaNode="244:41" section="transaction" height={518} className="isolate">
      <div
        data-figma-node="244:41"
        aria-labelledby="transaction-title"
        className="absolute inset-0"
      >
        <div
          aria-hidden="true"
          className="absolute top-[355px] left-0 h-[163px] w-[393px] bg-gradient-to-b from-transparent to-black/10"
        />

        <DecorativeImage
          src={assets.topLeaves}
          box={{ left: -26, top: 0, width: 223, height: 272, zIndex: 2 }}
          imageBox={{
            left: "-0.07%",
            top: "-45.96%",
            width: "100.14%",
            height: "145.96%",
          }}
          sizes="223px"
        />
        <DecorativeImage
          src={assets.topLeaves}
          box={{
            left: 197,
            top: 0,
            width: 223,
            height: 272,
            zIndex: 2,
            transform: "scaleX(-1)",
          }}
          imageBox={{
            left: "-0.07%",
            top: "-45.96%",
            width: "100.14%",
            height: "145.96%",
          }}
          sizes="223px"
        />

        <DecorativeImage
          src={assets.paperTear}
          box={{ left: -77, top: 0, width: 547, height: 34, zIndex: 3 }}
          sizes="547px"
          imageStyle={{ objectFit: "cover" }}
        />

        <DecorativeImage
          src={assets.bottomFoliage}
          box={{ left: -254, top: 217, width: 675, height: 722, zIndex: 1 }}
          imageBox={{ left: 0, top: "-66.15%", width: "100%", height: "166.26%" }}
          sizes="675px"
        />
        <DecorativeImage
          src={assets.bottomFoliage}
          box={{
            left: -29,
            top: 230,
            width: 675,
            height: 709,
            zIndex: 1,
            transform: "scaleX(-1)",
          }}
          imageBox={{ left: 0, top: "-69.29%", width: "100%", height: "169.39%" }}
          sizes="675px"
        />

        <header className="absolute top-[41px] left-0 z-10 w-full text-center text-black">
          <h2
            id="transaction-title"
            className="font-playfair text-[30.059px] leading-[43.285px] font-bold tracking-[0.9145px]"
          >
            SUPPORT THE STORY
          </h2>
          <p className="font-playfair -mt-[9px] text-[17.908px] leading-[25.787px] tracking-[0.5448px]">
            Be Part of This Journey
          </p>
        </header>

        <button
          ref={revealButtonRef}
          type="button"
          onClick={onReveal}
          aria-expanded={mode === "revealed"}
          aria-controls="transaction-account-details"
          className={`font-playfair absolute left-1/2 z-20 -translate-x-1/2 rounded-full border border-[#7C5649]/35 bg-[#EEE3D4]/95 font-bold tracking-[1.3px] text-[#5B4037] shadow-[0_8px_22px_rgba(73,48,38,0.16)] transition-[top,width,height,background-color] focus-visible:ring-2 focus-visible:ring-[#7C5649] focus-visible:ring-offset-2 focus-visible:outline-none ${
            mode === "ready"
              ? "top-[151px] h-[72px] w-[285px] text-[14px] active:bg-[#E2D1BD]"
              : "top-[108px] h-[30px] w-[204px] text-[10.5px] active:bg-[#E2D1BD]"
          }`}
        >
          {mode === "ready" ? "TAP TO REVEAL" : "TAP AGAIN TO HIDE"}
          {mode === "ready" ? (
            <span className="mt-1 block text-[9px] font-normal tracking-[0.8px]">
              Wedding gift information
            </span>
          ) : null}
        </button>

        <div
          id="transaction-account-details"
          className="absolute inset-0 z-10"
          aria-live="polite"
          aria-busy={
            mode === "revealed" && (loadState.status === "idle" || loadState.status === "loading")
          }
        >
          {mode === "ready" ? (
            <p className="font-playfair absolute top-[244px] left-[65px] w-[263px] text-center text-[12px] leading-[18px] text-[#5B4037]/80">
              Tap the button to view the wedding gift accounts. Tap it again whenever you want to
              hide the details.
            </p>
          ) : null}

          {mode === "revealed" &&
          (loadState.status === "idle" || loadState.status === "loading") ? (
            <p
              role="status"
              className="font-playfair absolute top-[226px] w-full text-center text-sm"
            >
              Loading account details...
            </p>
          ) : null}

          {mode === "revealed" && loadState.status === "error" ? (
            <div
              role="alert"
              className="font-playfair absolute top-[202px] left-[60px] w-[273px] text-center"
            >
              <p className="text-[13px] leading-5">Account details could not be loaded.</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 min-h-11 rounded-full bg-[#7C5649] px-7 text-[12px] font-bold tracking-wider text-white focus-visible:ring-2 focus-visible:ring-[#7C5649] focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                TRY AGAIN
              </button>
            </div>
          ) : null}

          {mode === "revealed" && loadState.status === "loaded" ? (
            <motion.div
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.22 }}
              className="absolute inset-0"
            >
              {loadState.accounts.map((account) => (
                <Account key={account.bank} account={account} />
              ))}
            </motion.div>
          ) : null}
        </div>

        <div
          aria-hidden="true"
          className="absolute top-[472px] left-[181px] z-10 flex items-center gap-[7px]"
        >
          <span className="size-[5px] rotate-45 bg-black" />
          <span className="size-[8px] rotate-45 bg-black" />
          <span className="size-[5px] rotate-45 bg-black" />
        </div>
      </div>
    </StorySection>
  );
}
