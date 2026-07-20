"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import DecorativeImage from "@/components/invitation/DecorativeImage";
import MusicButton from "@/components/invitation/MusicButton";
import StorySection from "@/components/invitation/StorySection";
import {
  buildGoogleCalendarUrl,
  calculateCountdown,
  type CountdownValue,
  STORY_ASSETS,
  WEDDING_EVENT,
} from "@/lib/invitation-story";

type CountdownDisplayValue = Partial<CountdownValue>;

const EMPTY_COUNTDOWN_DISPLAY: CountdownDisplayValue = {};

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

function isComplete(value: CountdownValue): boolean {
  return value.days === 0 && value.hours === 0 && value.minutes === 0 && value.seconds === 0;
}

function Countdown() {
  const [value, setValue] = useState<CountdownDisplayValue>(EMPTY_COUNTDOWN_DISPLAY);

  useEffect(() => {
    let timeout: number | undefined;
    const update = () => {
      const nextValue = calculateCountdown(WEDDING_EVENT.start);
      setValue(nextValue);
      if (isComplete(nextValue)) return;

      timeout = window.setTimeout(update, 1000);
    };

    update();
    return () => {
      if (timeout !== undefined) window.clearTimeout(timeout);
    };
  }, []);

  return (
    <motion.div
      className="absolute top-[211px] left-1/2 flex -translate-x-1/2 justify-center gap-[15px] text-center text-black"
      {...anim(0.3, 15)}
    >
      {(
        [
          [value.days, "Days"],
          [value.hours, "Hours"],
          [value.minutes, "Minutes"],
          [value.seconds, "Seconds"],
        ] as const
      ).map(([number, label]) => (
        <div key={label} className="w-[79px]">
          <p className="font-prata text-[24px] leading-[44.188px] tracking-[0.9336px] tabular-nums">
            {number === undefined ? "--" : String(number).padStart(2, "0")}
          </p>
          <p className="font-playfair text-[19.347px] leading-[27.86px] tracking-[0.5886px]">
            {label}
          </p>
        </div>
      ))}
    </motion.div>
  );
}

function EventCard({ title, icon, top, delay }: { title: string; icon: string; top: number; delay: number }) {
  const mapUrl = useMemo(
    () =>
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        WEDDING_EVENT.location
      )}`,
    []
  );

  return (
    <motion.article
      className="absolute left-[39px] h-[328.7px] w-[315.283px] rounded-[20.124px] border border-black bg-[#FAEBE0]"
      style={{ top }}
      {...anim(delay, 25)}
    >
      <div className="absolute top-[34px] left-1/2 size-[43px] -translate-x-1/2">
        <Image src={icon} alt="" fill sizes="43px" className="object-contain" />
      </div>
      <h3 className="font-playfair absolute top-[98px] w-full text-center text-[19.925px] leading-[28.692px] tracking-[0.6062px]">
        {title}
      </h3>
      <p className="font-playfair absolute top-[142px] w-full text-center text-[16.271px] leading-[22.78px] font-bold tracking-[0.4068px]">
        08.00 WIB
      </p>
      <p className="font-playfair absolute top-[201px] w-full text-center text-[15.2px] leading-[22.2px] tracking-[0.3px]">
        Masjid Raya Baiturrahman
        <br />
        Jl. Merdeka No. 1, Bandung
      </p>
      <a
        href={mapUrl}
        target="_blank"
        rel="noreferrer"
        className="font-playfair absolute top-[270px] left-1/2 flex -translate-x-1/2 items-center gap-2 text-[16px] leading-6 whitespace-nowrap underline underline-offset-4 focus-visible:rounded-sm focus-visible:outline-2"
      >
        OPEN MAP
        <Image src={STORY_ASSETS.dateEvent.mapPin} alt="" width={12} height={15} />
      </a>
    </motion.article>
  );
}

export default function DateEventSection() {
  const assets = STORY_ASSETS.dateEvent;

  return (
    <StorySection figmaNode="106:2" section="date-event" height={1314}>
      <DecorativeImage
        src={assets.topCanopy}
        box={{ left: -196, top: -97, width: 718, height: 173 }}
        sizes="718px"
        imageStyle={{ objectPosition: "bottom" }}
        {...fadeAnim(0.1)}
      />
      <MusicButton className="top-5 left-5" />

      <motion.h2
        className="font-playfair absolute top-[48px] left-[78px] text-[30.699px] leading-[44.207px] tracking-[0.934px]"
        {...anim(0.15)}
      >
        SAVE THE DATE
      </motion.h2>
      <DecorativeImage
        src={assets.dateFlourish}
        box={{ left: 124, top: 114, width: 154, height: 38 }}
        sizes="154px"
        imageStyle={{ objectPosition: "bottom" }}
        {...fadeAnim(0.2)}
      />
      <motion.p
        className="font-playfair absolute top-[164px] w-full text-center text-[22.317px] leading-[32.137px] tracking-[0.679px]"
        {...anim(0.25)}
      >
        August, 16th 2026
      </motion.p>
      <Countdown />

      <motion.a
        href={buildGoogleCalendarUrl(WEDDING_EVENT)}
        target="_blank"
        rel="noreferrer"
        className="font-playfair absolute top-[318px] left-1/2 flex h-[50.475px] w-[268px] -translate-x-1/2 items-center justify-center gap-3 rounded-full bg-[#D6C8B6] text-[15.2px] font-bold tracking-[0.35px] text-[#453F2F] transition-transform active:scale-[0.98]"
        {...anim(0.35)}
      >
        ADD TO CALENDAR
        <Image src={assets.calendarIcon} alt="" width={19} height={19} />
      </motion.a>
      <DecorativeImage
        src={assets.butterfly}
        box={{ left: 310, top: 291, width: 32, height: 57 }}
        sizes="32px"
        imageStyle={{ objectFit: "cover" }}
        {...fadeAnim(0.4)}
      />

      <DecorativeImage
        src={assets.tornTransition}
        box={{ left: 0, top: 275, width: 393, height: 173 }}
        sizes="393px"
        {...fadeAnim(0.1)}
      />
      <DecorativeImage
        src={assets.paperTear}
        box={{ left: -236, top: 365, width: 948, height: 129 }}
        imageBox={{ left: 0, top: "-938.89%", width: "100%", height: "1977.78%" }}
        sizes="948px"
        {...fadeAnim(0.15)}
      />
      <DecorativeImage
        src={assets.leftLeaves}
        box={{ left: -130, top: 409, width: 240, height: 154 }}
        sizes="240px"
        imageStyle={{ objectPosition: "bottom" }}
        {...fadeAnim(0.2)}
      />
      <DecorativeImage
        src={assets.rightLeaves}
        box={{ left: 276, top: 797, width: 156, height: 182 }}
        sizes="156px"
        imageStyle={{ objectPosition: "bottom" }}
        {...fadeAnim(0.25)}
      />

      <motion.h2
        className="font-playfair absolute top-[462px] left-[78px] text-[30.699px] leading-[44.207px] tracking-[0.934px]"
        {...anim(0.3, 15)}
      >
        EVENT DETAILS
      </motion.h2>
      <DecorativeImage
        src={assets.sectionFlourish}
        box={{ left: 86, top: 528, width: 221, height: 23 }}
        sizes="221px"
        imageStyle={{ objectPosition: "bottom" }}
        {...fadeAnim(0.35)}
      />

      <EventCard title="AKAD NIKAH" icon={assets.ringsIcon} top={563} delay={0.4} />
      <EventCard title="RESEPSI" icon={assets.giftIcon} top={939} delay={0.45} />

      <DecorativeImage
        src={assets.bottomFoliage}
        box={{ left: -237, top: 1061, width: 534, height: 397 }}
        sizes="534px"
        imageStyle={{ objectPosition: "bottom" }}
        {...fadeAnim(0.6)}
      />
      <DecorativeImage
        src={assets.branchVines}
        box={{ left: -595, top: 448, width: 1268, height: 880, transform: "rotate(77.86deg)" }}
        sizes="1268px"
        imageStyle={{ objectFit: "cover" }}
        {...fadeAnim(0.2)}
      />
      <DecorativeImage
        src={assets.branchVines}
        box={{
          left: 176,
          top: 439,
          width: 850,
          height: 1256,
          transform: "rotate(169.54deg) scaleY(-1)",
        }}
        sizes="850px"
        imageStyle={{ objectFit: "cover" }}
        {...fadeAnim(0.25)}
      />
    </StorySection>
  );
}
