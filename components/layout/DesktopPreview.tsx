import { type ReactNode } from "react";

interface DesktopPreviewProps {
  children: ReactNode;
}

export default function DesktopPreview({ children }: DesktopPreviewProps) {
  return (
    <div
      data-figma-node="154:40"
      className="relative h-dvh w-full overflow-hidden bg-white lg:fixed lg:inset-0"
    >
      {/* Layer 1 — Desktop background: fills entire viewport, stays behind everything */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 hidden bg-[url('/images/desktop/desktop-background-figma.webp')] bg-cover bg-center lg:block"
      />

      {/* Layer 2 — Phone preview: floats above the background, right-aligned, vertically centered */}
      <div className="lg:h-phone lg:w-phone absolute inset-0 z-20 overflow-hidden lg:inset-auto lg:top-1/2 lg:right-20 lg:-translate-y-1/2 lg:rounded-[2.5rem] lg:shadow-2xl">
        {children}
      </div>
    </div>
  );
}
