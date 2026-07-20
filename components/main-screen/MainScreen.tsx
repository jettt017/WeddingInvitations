import type { CSSProperties } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { MAIN_SCREEN_ASSETS } from "@/lib/invitation";

import { type MotionProps } from "framer-motion";

interface DecorativeImageProps extends MotionProps {
  src: string;
  box: CSSProperties;
  imageBox?: CSSProperties;
  sizes: string;
  figmaNode: string;
  mirror?: boolean;
  opacity?: number;
}

const positioningKeys = ["position", "left", "right", "top", "bottom", "width", "height", "zIndex"];

function DecorativeImage({
  src,
  box,
  imageBox = { inset: 0 },
  sizes,
  figmaNode,
  mirror = false,
  opacity,
  ...motionProps
}: DecorativeImageProps) {
  const positioning: CSSProperties = { position: "absolute" };
  const styling: CSSProperties = {};

  if (box) {
    Object.entries(box).forEach(([key, value]) => {
      if (positioningKeys.includes(key)) {
        (positioning as any)[key] = value;
      } else {
        (styling as any)[key] = value;
      }
    });
  }

  return (
    <motion.div
      style={positioning}
      {...motionProps}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
        data-figma-node={figmaNode}
        style={{
          ...styling,
          opacity,
          transform: mirror ? "scaleX(-1)" : (styling.transform as string),
        }}
      >
        <div className="absolute" style={imageBox}>
          <Image src={src} alt="" fill sizes={sizes} draggable={false} className="select-none" />
        </div>
      </div>
    </motion.div>
  );
}

const anim = (delay: number, y = 20) => ({
  initial: { opacity: 0, y, filter: "blur(2px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: false, margin: "-60px" },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

const fadeAnim = (delay: number) => ({
  initial: { opacity: 0, scale: 1.01 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: false, margin: "-60px" },
  transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export default function MainScreen() {
  return (
    <section
      className="relative left-1/2 h-[852px] w-[393px] shrink-0 -translate-x-1/2 overflow-hidden bg-[#FAEBE0] text-black"
      data-figma-node="42:2"
    >
      <DecorativeImage
        src={MAIN_SCREEN_ASSETS.paperTexture}
        box={{ left: -72, top: -102, width: 537, height: 954 }}
        sizes="537px"
        figmaNode="44:45"
        opacity={0.4}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-[163px] w-[393px]"
        style={{
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.12), rgba(102, 102, 102, 0))",
        }}
        data-figma-node="147:126"
        {...fadeAnim(0)}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-[375px] left-0 h-[74px] w-[393px]"
        style={{
          background: "linear-gradient(to bottom, rgba(102, 102, 102, 0), rgba(0, 0, 0, 0.12))",
        }}
        data-figma-node="44:50"
        {...fadeAnim(0.1)}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-[689px] left-0 h-[163px] w-[393px]"
        style={{
          background: "linear-gradient(to bottom, rgba(102, 102, 102, 0), rgba(0, 0, 0, 0.12))",
        }}
        data-figma-node="70:131"
        {...fadeAnim(0.2)}
      />

      <div className="absolute top-[111px] left-[88px] h-[235px] w-[225px]" data-figma-node="60:22">
        <motion.p
          className="font-literata absolute top-0 left-0 flex w-full justify-center text-center font-normal whitespace-nowrap"
          style={{
            fontSize: 17.612,
            lineHeight: "24.656px",
            letterSpacing: 0.4403,
          }}
          {...anim(0.2, 10)}
        >
          We Invite you to
        </motion.p>

        <motion.h1
          id="main-screen-title"
          className="font-qwitcher absolute top-0 left-[7px] flex h-[119.927px] w-[203.83px] items-center justify-center text-center font-normal whitespace-nowrap"
          style={{
            fontSize: 93.483,
            lineHeight: "112.179px",
            letterSpacing: -2.3371,
            transform: "rotate(-2deg)",
          }}
          {...anim(0.3, 10)}
        >
          Celebrate
        </motion.h1>

        <motion.p
          className="font-literata absolute top-[91.701px] left-0 flex h-[30.598px] w-full items-center justify-center text-center font-normal whitespace-nowrap"
          style={{
            fontSize: 21.856,
            lineHeight: "30.598px",
            letterSpacing: 0.5464,
          }}
          {...anim(0.4, 10)}
        >
          Our Wedding
        </motion.p>

        <motion.div
          className="font-playfair absolute top-[178px] left-0 flex h-[57px] w-[218px] flex-col justify-center text-center font-normal whitespace-nowrap"
          style={{
            fontSize: 13.536,
            lineHeight: "18.95px",
            letterSpacing: 0.3384,
          }}
          {...anim(0.5, 10)}
        >
          <span>We are delighred to invite you</span>
          <span>to share in the joy and celebration</span>
          <span>of our marriage.</span>
        </motion.div>

          <DecorativeImage
            src={MAIN_SCREEN_ASSETS.centerFloralOrnament}
            box={{ left: 70, top: 129, width: 78, height: 42 }}
            imageBox={{
              left: 0,
              top: "-112.7%",
              width: "100%",
              height: "330.16%",
            }}
            sizes="78px"
            figmaNode="44:40"
            {...anim(0.6, 5)}
          />
          <DecorativeImage
            src={MAIN_SCREEN_ASSETS.butterfly}
            box={{ left: 193, top: 6, width: 32, height: 57 }}
            sizes="32px"
            figmaNode="45:65"
            {...anim(0.7, 5)}
          />
      </div>

      <motion.div
        className="font-playfair absolute top-[572px] left-[55px] flex h-[104px] w-[284px] flex-col justify-center text-center font-normal whitespace-nowrap"
        style={{
          fontSize: 14.785,
          lineHeight: "20.699px",
          letterSpacing: 0.3696,
        }}
        data-figma-node="58:4"
        {...anim(0.4)}
      >
        <span>“And of his signs is that</span>
        <span>He created for you mates from among</span>
        <span>yourselves, that you may find tranquality</span>
        <span>in them, and He placed between you</span>
        <span>affection and mercy.”</span>
      </motion.div>
      <motion.p
        className="font-playfair absolute top-[705.26px] left-[129.28px] flex h-[21px] w-[137px] items-center justify-center text-center font-normal whitespace-nowrap"
        style={{
          fontSize: 14.785,
          lineHeight: "20.699px",
          letterSpacing: 0.3696,
        }}
        data-figma-node="59:17"
        {...anim(0.5)}
      >
        - Q.S. Ar-Rum : 21 -
      </motion.p>

      <DecorativeImage
        src={MAIN_SCREEN_ASSETS.topFloralFrame}
        box={{ left: -52, top: -26, width: 498, height: 475 }}
        sizes="498px"
        figmaNode="60:19"
        {...fadeAnim(0.2)}
      />

      <DecorativeImage
        src={MAIN_SCREEN_ASSETS.hangingVines}
        box={{ left: -26, top: 449, width: 223, height: 272 }}
        imageBox={{
          left: "-0.07%",
          top: "-45.96%",
          width: "100.14%",
          height: "145.96%",
        }}
        sizes="224px"
        figmaNode="62:107"
        {...anim(0.3, 10)}
      />
      <DecorativeImage
        src={MAIN_SCREEN_ASSETS.hangingVines}
        box={{ left: 197, top: 449, width: 223, height: 272 }}
        imageBox={{
          left: "-0.07%",
          top: "-45.96%",
          width: "100.14%",
          height: "145.96%",
        }}
        sizes="224px"
          figmaNode="62:107"
        mirror
        {...anim(0.3, 10)}
      />

      <DecorativeImage
        src={MAIN_SCREEN_ASSETS.tornPaperDivider}
        box={{ left: -77, top: 446, width: 547, height: 493 }}
        imageBox={{
          left: 0,
          top: "-97.65%",
          width: "100%",
          height: "197.65%",
        }}
        sizes="547px"
        figmaNode="62:111"
        {...anim(0.4, 15)}
      />

      <DecorativeImage
        src={MAIN_SCREEN_ASSETS.lowerBotanicalFrame}
        box={{ left: -208, top: 171, width: 606, height: 1076 }}
        sizes="606px"
        figmaNode="147:127"
        {...fadeAnim(0.35)}
      />
      <DecorativeImage
        src={MAIN_SCREEN_ASSETS.lowerBotanicalFrame}
        box={{ left: -6, top: 171, width: 606, height: 1076 }}
        sizes="606px"
        figmaNode="147:127"
        mirror
        {...fadeAnim(0.35)}
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-[784px] left-[181px] h-[11.31px] w-[31.34px]"
        data-figma-node="188:61"
        {...anim(0.6)}
      >
        <span className="absolute top-[3px] left-0 flex size-[6.343px] items-center justify-center">
          <span className="block size-[4.5px] rotate-45 bg-black" />
        </span>
        <span className="absolute top-0 left-[10px] flex size-[11.314px] items-center justify-center">
          <span className="block size-2 rotate-45 bg-black" />
        </span>
        <span className="absolute top-[3px] left-[25px] flex size-[6.343px] items-center justify-center">
          <span className="block size-[4.5px] rotate-45 bg-black" />
        </span>
      </motion.div>

      <DecorativeImage
        src={MAIN_SCREEN_ASSETS.topFloralOverlay}
        box={{ left: -242, top: -382, width: 815, height: 828 }}
        imageBox={{
          left: 0,
          top: "-0.05%",
          width: "100%",
          height: "174.99%",
        }}
        sizes="815px"
        figmaNode="147:124"
        {...fadeAnim(0.25)}
      />
    </section>
  );
}
