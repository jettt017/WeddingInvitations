import Image from "next/image";
import { type ReactNode } from "react";

interface DesktopPreviewProps {
  children: ReactNode;
}

export default function DesktopPreview({ children }: DesktopPreviewProps) {
  return (
    <>
      {/* Full-screen fixed blurred desktop background */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/desktop/desktop-background.webp"
          alt="Desktop wedding background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center brightness-75 blur-sm"
        />
      </div>

      {/* Centered phone canvas overlay */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="relative w-phone h-phone overflow-hidden rounded-[2.5rem] shadow-2xl">
          {children}
        </div>
      </div>
    </>
  );
}
