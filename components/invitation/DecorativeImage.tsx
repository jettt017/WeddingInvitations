import type { CSSProperties } from "react";
import Image from "next/image";

interface DecorativeImageProps {
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
}: DecorativeImageProps) {
  return (
    <div
      aria-hidden={alt ? undefined : true}
      className={`pointer-events-none absolute overflow-hidden ${className}`}
      style={box}
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
  );
}
