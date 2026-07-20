import type { ReactNode } from "react";
import { motion } from "framer-motion";

import DecorativeImage from "@/components/invitation/DecorativeImage";
import { STORY_ASSETS } from "@/lib/invitation-story";

interface StorySectionProps {
  children: ReactNode;
  height?: number;
  figmaNode: string;
  section: string;
  className?: string;
}

export default function StorySection({
  children,
  height = 852,
  figmaNode,
  section,
  className = "",
}: StorySectionProps) {
  return (
    <section
      className={`relative left-1/2 w-[393px] shrink-0 -translate-x-1/2 overflow-hidden bg-[#FAEBE0] text-black ${className}`}
      style={{ height }}
      data-figma-node={figmaNode}
      data-section={section}
    >
      <DecorativeImage
        src={STORY_ASSETS.paperTexture}
        box={{ left: -72, top: -102, width: 537, height: Math.max(954, height + 102) }}
        sizes="537px"
        imageStyle={{ objectFit: "cover", opacity: 0.4 }}
      />
      {children}
    </section>
  );
}
