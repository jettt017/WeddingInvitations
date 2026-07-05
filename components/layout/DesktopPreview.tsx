import { type ReactNode } from "react";

interface DesktopPreviewProps {
  children: ReactNode;
}

export default function DesktopPreview({ children }: DesktopPreviewProps) {
  return (
    <div className="fixed inset-0">
      {/* Layer 1 — Desktop background: fills entire viewport, stays behind everything */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/desktop/desktop-background.webp"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Layer 2 — Overlay: sits above background, does NOT blur the phone */}
      <div className="absolute inset-0 z-10 bg-black/15" />

      {/* Layer 3 — Phone preview: floats above both, right-aligned, vertically centered */}
      <div className="absolute z-20 top-1/2 right-20 -translate-y-1/2 w-phone h-phone overflow-hidden rounded-[2.5rem] shadow-2xl">
        {children}
      </div>
    </div>
  );
}
