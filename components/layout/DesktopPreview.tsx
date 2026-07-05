import Image from "next/image";
import { type ReactNode } from "react";

interface DesktopPreviewProps {
  children: ReactNode;
}

export default function DesktopPreview({ children }: DesktopPreviewProps) {
  return (
    <>
      {/* Full-screen fixed desktop background — left-anchored, subtle blur + dark overlay */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/desktop/desktop-background.webp"
          alt="Desktop wedding background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-left-center brightness-90 blur-[2px]"
        />
        {/* Subtle dark overlay — only decorative */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Phone canvas — pushed to the right side (~60-65% area) */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="ml-auto mr-24 relative w-phone h-phone overflow-hidden rounded-[2.5rem] shadow-2xl">
          {children}
        </div>
      </div>
    </>
  );
}
