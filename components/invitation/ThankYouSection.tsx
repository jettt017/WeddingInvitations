import DecorativeImage from "@/components/invitation/DecorativeImage";
import MusicButton from "@/components/invitation/MusicButton";
import StorySection from "@/components/invitation/StorySection";
import { STORY_ASSETS } from "@/lib/invitation-story";

export default function ThankYouSection() {
  const assets = STORY_ASSETS.thankYou;

  return (
    <StorySection figmaNode="128:88" section="thank-you">
      <div data-figma-node="128:88" className="absolute inset-0">
        <DecorativeImage
          src={assets.backgroundBlur}
          box={{ left: -46, top: 3, width: 485, height: 846, filter: "blur(3.65px)" }}
          sizes="485px"
          imageStyle={{ objectFit: "cover" }}
        />
        <DecorativeImage
          src={assets.backgroundPhoto}
          box={{ left: -36, top: -5, width: 465, height: 862, filter: "blur(2px)" }}
          sizes="465px"
          imageStyle={{ objectFit: "cover" }}
        />
        <div className="absolute top-[7px] left-0 h-[845px] w-[393px] bg-gradient-to-b from-transparent to-black/75" />

        <div className="absolute top-[227px] left-1/2 z-10 w-full -translate-x-1/2 text-center text-white">
          <h2 className="font-playfair text-[48px] leading-[44.207px] font-semibold tracking-[0.934px]">
            THANK YOU
          </h2>
          <p className="font-playfair mt-7 text-[20px] leading-[27px] font-medium">
            For Being Part Of Our
            <br />
            Special Day
          </p>
          <DecorativeImage
            src={assets.headingFlourish}
            box={{ left: 102, top: 144, width: 189, height: 36 }}
            sizes="189px"
            imageStyle={{ objectPosition: "bottom" }}
          />
          <p className="font-qwitcher mt-[82px] text-[60.495px] leading-[72.594px] tracking-[-1.5124px]">
            With love,
          </p>
          <p className="font-qwitcher -mt-5 text-[77.883px] leading-[93.46px] tracking-[-1.9471px]">
            Kinan &amp; Faiz
          </p>
        </div>

        <DecorativeImage
          src={assets.floralVines}
          box={{ left: -511, top: -706, width: 1131, height: 2010 }}
          sizes="1131px"
          imageStyle={{ objectFit: "cover" }}
        />
        <DecorativeImage
          src={assets.floralVines}
          box={{
            left: -428,
            top: -597,
            width: 1131,
            height: 2010,
            transform: "scaleY(-1) rotate(180deg)",
          }}
          sizes="1131px"
          imageStyle={{ objectFit: "cover" }}
        />
        <DecorativeImage
          src={assets.topCanopy}
          box={{ left: -180, top: -86, width: 754, height: 406 }}
          sizes="754px"
          imageStyle={{ objectPosition: "bottom" }}
        />
        <DecorativeImage
          src={assets.bottomGround}
          box={{ left: -172, top: 633, width: 684, height: 326, filter: "blur(2px)" }}
          sizes="684px"
          imageStyle={{ objectPosition: "bottom" }}
        />
        <DecorativeImage
          src={assets.rings}
          box={{ left: -190, top: 426, width: 810, height: 400 }}
          imageBox={{ left: 0, top: "-145%", width: "100%", height: "360%" }}
          sizes="810px"
        />

        <MusicButton className="top-5 left-5" />
      </div>
    </StorySection>
  );
}
