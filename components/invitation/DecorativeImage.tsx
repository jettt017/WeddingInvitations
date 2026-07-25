import type { CSSProperties } from "react";
import Image from "next/image";
import { motion, type MotionProps } from "framer-motion";

interface DecorativeImageProps extends MotionProps {
  src: string;
  alt?: string;
  box: CSSProperties;
  imageBox?: CSSProperties;
  imageStyle?: CSSProperties;
  sizes: string;
  className?: string;
  priority?: boolean;
}

export default function DecorativeImage({
  src,
  alt = "",
  box,
  imageBox = { inset: 0 },
  imageStyle,
  sizes,
  className = "",
  priority = false,
  ...motionProps
}: DecorativeImageProps) {
  const {
    position = "absolute",
    left,
    right,
    top,
    bottom,
    width,
    height,
    zIndex,
    ...styling
  } = box;
  const positioning: CSSProperties = {
    position,
    left,
    right,
    top,
    bottom,
    width,
    height,
    zIndex,
  };

  return (
    <motion.div className="pointer-events-none" style={positioning} {...motionProps}>
      <div
        aria-hidden={alt ? undefined : true}
        className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
        style={styling}
      >
        <div className="absolute" style={imageBox}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            draggable={false}
            className="select-none"
            style={imageStyle}
          />
        </div>
      </div>
    </motion.div>
  );
}
