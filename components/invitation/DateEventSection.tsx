"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import DecorativeImage from "@/components/invitation/DecorativeImage";
import MusicButton from "@/components/invitation/MusicButton";
import StorySection from "@/components/invitation/StorySection";
import {
  buildGoogleCalendarUrl,
  calculateCountdown,
  EMPTY_COUNTDOWN,
  STORY_ASSETS,
  WEDDING_EVENT,
} from "@/lib/invitation-story";

function Countdown() {
  const [value, setValue] = useState(EMPTY_COUNTDOWN);

  useEffect(() => {
    const update = () => setValue(calculateCountdown(WEDDING_EVENT.start));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="absolute top-[211px] left-1/2 flex -translate-x-1/2 justify-center gap-[15px] text-center text-black">
      {(
        [
          [value.days, "Days"],
          [value.hours, "Hours"],
          [value.minutes, "Minutes"],
          [value.seconds, "Seconds"],
        ] as const
      ).map(([number, label]) => (
        <div key={label} className="w-[79px]">
          <p className="font-playfair text-[24px] leading-[32px] tracking-[0.9336px] tabular-nums">
            {String(number).padStart(2, "0")}
          </p>
          <p className="font-playfair text-[17px] leading-[25px] tracking-[0.3px]">{label}</p>
        </div>
      ))}
    </div>
  );
}

function EventCard({ title, icon, top }: { title: string; icon: string; top: number }) {
  const mapUrl = useMemo(
    () =>
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        WEDDING_EVENT.location
      )}`,
    []
  );

  return (
    <article
      className="absolute left-[39px] h-[328.7px] w-[315.283px] rounded-[20.124px] border border-black"
      style={{ top }}
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
    </article>
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
      />
      <MusicButton className="top-5 left-5" />

      <h2 className="font-playfair absolute top-[48px] left-[78px] text-[30.699px] leading-[44.207px] tracking-[0.934px]">
        SAVE THE DATE
      </h2>
      <DecorativeImage
        src={assets.dateFlourish}
        box={{ left: 124, top: 114, width: 154, height: 38 }}
        sizes="154px"
        imageStyle={{ objectPosition: "bottom" }}
      />
      <p className="font-playfair absolute top-[164px] w-full text-center text-[22.317px] leading-[32.137px] tracking-[0.679px]">
        August, 16th 2026
      </p>
      <Countdown />

      <a
        href={buildGoogleCalendarUrl(WEDDING_EVENT)}
        target="_blank"
        rel="noreferrer"
        className="font-playfair absolute top-[318px] left-1/2 flex h-[50.475px] w-[268px] -translate-x-1/2 items-center justify-center gap-3 rounded-full bg-[#D6C8B6] text-[15.2px] font-bold tracking-[0.35px] text-[#453F2F] transition-transform active:scale-[0.98]"
      >
        ADD TO CALENDAR
        <Image src={assets.calendarIcon} alt="" width={19} height={19} />
      </a>
      <DecorativeImage
        src={assets.butterfly}
        box={{ left: 310, top: 291, width: 32, height: 57 }}
        sizes="32px"
        imageStyle={{ objectFit: "cover" }}
      />

      <DecorativeImage
        src={assets.tornTransition}
        box={{ left: 0, top: 275, width: 393, height: 173 }}
        sizes="393px"
      />
      <DecorativeImage
        src={assets.paperTear}
        box={{ left: -236, top: 365, width: 948, height: 129 }}
        imageBox={{ left: 0, top: "-938.89%", width: "100%", height: "1977.78%" }}
        sizes="948px"
      />
      <DecorativeImage
        src={assets.leftLeaves}
        box={{ left: -130, top: 409, width: 240, height: 154 }}
        sizes="240px"
        imageStyle={{ objectPosition: "bottom" }}
      />
      <DecorativeImage
        src={assets.rightLeaves}
        box={{ left: 276, top: 797, width: 156, height: 182 }}
        sizes="156px"
        imageStyle={{ objectPosition: "bottom" }}
      />

      <h2 className="font-playfair absolute top-[462px] left-[78px] text-[30.699px] leading-[44.207px] tracking-[0.934px]">
        EVENT DETAILS
      </h2>
      <DecorativeImage
        src={assets.sectionFlourish}
        box={{ left: 86, top: 528, width: 221, height: 23 }}
        sizes="221px"
        imageStyle={{ objectPosition: "bottom" }}
      />

      <EventCard title="AKAD NIKAH" icon={assets.ringsIcon} top={563} />
      <EventCard title="RESEPSI" icon={assets.giftIcon} top={939} />

      <DecorativeImage
        src={assets.bottomFoliage}
        box={{ left: -237, top: 1061, width: 534, height: 397 }}
        sizes="534px"
        imageStyle={{ objectPosition: "bottom" }}
      />
      <DecorativeImage
        src={assets.branchVines}
        box={{ left: -595, top: 448, width: 1268, height: 880, transform: "rotate(77.86deg)" }}
        sizes="1268px"
        imageStyle={{ objectFit: "cover" }}
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
      />
    </StorySection>
  );
}
