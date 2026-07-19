import DecorativeImage from "@/components/invitation/DecorativeImage";
import MusicButton from "@/components/invitation/MusicButton";
import StorySection from "@/components/invitation/StorySection";
import { STORY_ASSETS } from "@/lib/invitation-story";

export default function CouplePhotoSection() {
  const assets = STORY_ASSETS.couplePhoto;

  return (
    <StorySection figmaNode="62:43" section="couple-photo">
      <div
        aria-label="Couple photo placeholder"
        className="absolute top-0 left-0 h-[413px] w-[393px] bg-[#D9D9D9]"
      />
      <div
        aria-hidden="true"
        className="absolute top-[689px] left-0 h-[163px] w-[393px] bg-gradient-to-b from-transparent to-black/10"
      />

      <div
        aria-hidden="true"
        className="font-playfair absolute top-[154px] left-[61px] flex rotate-[-12.65deg] flex-col text-center text-[92.613px] leading-[78px] tracking-[17px] text-white"
      >
        <span>K</span>
        <span className="pl-8">F</span>
      </div>

      <h2 className="font-qwitcher absolute top-[478px] left-1/2 -translate-x-1/2 text-center text-[62.623px] leading-[75.148px] tracking-[-1.5656px] whitespace-nowrap">
        Kinan &amp; Faiz
      </h2>
      <p className="font-playfair absolute top-[574px] left-1/2 w-full -translate-x-1/2 text-center text-[15.729px] leading-[22.02px] tracking-[0.3932px]">
        TWO SOULS, ONE BEAUTIFUL JOURNEY
        <br />
        FOREVER STARTS HERE
      </p>

      <DecorativeImage
        src={assets.centerFlowers}
        box={{ left: 144, top: 574, width: 105, height: 186 }}
        sizes="105px"
        imageStyle={{ objectFit: "cover" }}
      />
      <DecorativeImage
        src={assets.botanicalFrame}
        box={{ left: -128, top: -179, width: 662, height: 1177 }}
        sizes="662px"
        imageStyle={{ objectFit: "cover" }}
      />
      <DecorativeImage
        src={assets.foregroundLeaves}
        box={{ left: -620, top: -1258, width: 826, height: 2929 }}
        imageBox={{ left: 0, top: "-0.01%", width: "199.52%", height: "100.03%" }}
        sizes="1650px"
      />
      <DecorativeImage
        src={assets.foregroundLeaves}
        box={{ left: 347, top: -1104, width: 274, height: 1748 }}
        imageBox={{ left: "-501.46%", top: "-0.02%", width: "601.46%", height: "167.61%" }}
        sizes="1650px"
      />
      <DecorativeImage
        src={assets.topBranch}
        box={{ left: -83, top: -204, width: 260, height: 462 }}
        sizes="260px"
        imageStyle={{ objectFit: "cover" }}
      />
      <DecorativeImage
        src={assets.bottomLandscape}
        box={{ left: -57, top: 706, width: 522, height: 146 }}
        imageBox={{ left: 0, top: "-247.95%", width: "100%", height: "635.62%" }}
        sizes="522px"
      />

      <MusicButton className="top-5 left-5" />
    </StorySection>
  );
}
