import Image from "next/image";
import { motion } from "framer-motion";

import DecorativeImage from "@/components/invitation/DecorativeImage";
import MusicButton from "@/components/invitation/MusicButton";
import StorySection from "@/components/invitation/StorySection";
import { STORY_ASSETS, STORY_PHOTOS } from "@/lib/invitation-story";

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

export default function CouplePhotoSection() {
  const assets = STORY_ASSETS.couplePhoto;
  const photo = STORY_PHOTOS.coupleCover;

  return (
    <StorySection figmaNode="62:43" section="couple-photo">
      <motion.div
        role="img"
        aria-label={photo.alt}
        className="absolute top-0 left-0 flex h-[413px] w-[393px] overflow-hidden"
        {...fadeAnim(0.15)}
      >
        {photo.fallbacks.map((fallback) => (
          <div key={fallback.src} className="relative h-full flex-1 overflow-hidden">
            <Image
              src={fallback.src}
              alt=""
              fill
              sizes="197px"
              className="object-cover"
              style={{ objectPosition: fallback.objectPosition }}
            />
          </div>
        ))}
        <div aria-hidden="true" className="absolute inset-0 bg-black/10" />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="absolute top-[689px] left-0 h-[163px] w-[393px] bg-gradient-to-b from-transparent to-black/10"
        {...fadeAnim(0.2)}
      />

      <motion.div
        aria-hidden="true"
        className="font-playfair absolute top-[154px] left-[61px] flex rotate-[-12.65deg] flex-col text-center text-[92.613px] leading-[78px] tracking-[17px] text-white"
        {...anim(0.3, 20)}
      >
        <span>K</span>
        <span className="pl-8">F</span>
      </motion.div>

      <h2 className="font-qwitcher absolute top-[478px] left-1/2 -translate-x-1/2 text-center text-[62.623px] leading-[75.148px] tracking-[-1.5656px] whitespace-nowrap">
        <motion.span className="block" {...anim(0.35, 10)}>Kinan &amp; Faiz</motion.span>
      </h2>
      <motion.p
        className="font-playfair absolute top-[574px] left-1/2 w-full -translate-x-1/2 text-center text-[15.729px] leading-[22.02px] tracking-[0.3932px]"
        {...anim(0.4, 15)}
      >
        TWO SOULS, ONE BEAUTIFUL JOURNEY
        <br />
        FOREVER STARTS HERE
      </motion.p>

      <DecorativeImage
        src={assets.centerFlowers}
        box={{ left: 144, top: 574, width: 105, height: 186 }}
        sizes="105px"
        imageStyle={{ objectFit: "cover" }}
        {...fadeAnim(0.45)}
      />
      <DecorativeImage
        src={assets.botanicalFrame}
        box={{ left: -128, top: -179, width: 662, height: 1177 }}
        sizes="662px"
        imageStyle={{ objectFit: "cover" }}
        {...fadeAnim(0.1)}
      />
      <DecorativeImage
        src={assets.foregroundLeaves}
        box={{ left: -620, top: -1258, width: 826, height: 2929 }}
        imageBox={{ left: 0, top: "-0.01%", width: "199.52%", height: "100.03%" }}
        sizes="1650px"
        {...fadeAnim(0.25)}
      />
      <DecorativeImage
        src={assets.foregroundLeaves}
        box={{ left: 347, top: -1104, width: 274, height: 1748 }}
        imageBox={{ left: "-501.46%", top: "-0.02%", width: "601.46%", height: "167.61%" }}
        sizes="1650px"
        {...fadeAnim(0.3)}
      />
      <DecorativeImage
        src={assets.topBranch}
        box={{ left: -83, top: -204, width: 260, height: 462 }}
        sizes="260px"
        imageStyle={{ objectFit: "cover" }}
        {...fadeAnim(0.2)}
      />
      <DecorativeImage
        src={assets.bottomLandscape}
        box={{ left: -57, top: 706, width: 522, height: 146 }}
        imageBox={{ left: 0, top: "-247.95%", width: "100%", height: "635.62%" }}
        sizes="522px"
        {...fadeAnim(0.5)}
      />

      <MusicButton className="top-5 left-5" />
    </StorySection>
  );
}
