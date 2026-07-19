import Image from "next/image";

import DecorativeImage from "@/components/invitation/DecorativeImage";
import MusicButton from "@/components/invitation/MusicButton";
import StorySection from "@/components/invitation/StorySection";
import { STORY_ASSETS } from "@/lib/invitation-story";

function Portrait({
  side,
  photo,
  vines,
  branch,
}: {
  side: "groom" | "bride";
  photo: string;
  vines: string;
  branch: string;
}) {
  const isGroom = side === "groom";
  const left = isGroom ? 215 : 17;
  const top = isGroom ? 56 : 497;
  const photoBox = isGroom
    ? { left: -178, top: -282, width: 490, height: 734 }
    : { left: -99, top: -93, width: 343, height: 513 };

  return (
    <div
      aria-label={`${side} portrait`}
      className="absolute"
      style={{ left, top, width: 161, height: 281 }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-t-[86px] rounded-b-[6px]">
        <div className="absolute" style={photoBox}>
          <Image
            src={photo}
            alt={isGroom ? "Faiz Ardisyahputra" : "Pramesthi Wahyuring Kinasih"}
            fill
            sizes={isGroom ? "490px" : "343px"}
            className="object-cover"
          />
        </div>
      </div>
      <DecorativeImage
        src={vines}
        box={{ left: 0, top: -96, width: 161, height: 286 }}
        sizes="161px"
        imageStyle={{ objectPosition: "bottom" }}
      />
      <DecorativeImage
        src={branch}
        box={{ left: 24, top: -42, width: 137, height: 184 }}
        sizes="137px"
        imageStyle={{ objectPosition: "bottom" }}
      />
      <DecorativeImage
        src={STORY_ASSETS.groomBride.portraitFlowers}
        box={{ left: -18, top: 230, width: 198, height: 71 }}
        imageBox={{ left: 0, top: "-201.41%", width: "100%", height: "495.77%" }}
        sizes="198px"
      />
    </div>
  );
}

export default function GroomBrideSection() {
  const assets = STORY_ASSETS.groomBride;

  return (
    <StorySection figmaNode="31:29" section="groom-bride">
      <DecorativeImage
        src={assets.leavesFrame}
        box={{ left: -26, top: -355, width: 445, height: 792 }}
        sizes="445px"
        imageStyle={{ objectFit: "cover" }}
      />
      <DecorativeImage
        src={assets.leavesFrame}
        box={{ left: -70, top: 355, width: 551, height: 846, transform: "rotate(-171.96deg)" }}
        sizes="551px"
        imageStyle={{ objectFit: "cover" }}
      />

      <MusicButton className="top-5 left-5" />

      <p className="font-qwitcher absolute top-[86px] left-[10px] text-[54.716px] leading-[65.659px] tracking-[-1.3679px]">
        The Groom
      </p>
      <div className="font-playfair absolute top-[151px] left-[17px] text-[25px] leading-9 tracking-[0.7606px]">
        <p>Faiz</p>
        <p>Ardisyahputra</p>
      </div>
      <div className="font-literata absolute top-[238px] left-[17px] leading-[19.512px] tracking-[0.4122px]">
        <p className="text-[10.577px]">son of</p>
        <p className="text-[13.55px]">Nurhayati Fauzi</p>
        <p className="text-[13.55px]">&amp; Bayu Praditpa</p>
      </div>

      <Portrait
        side="groom"
        photo={assets.groomPhoto}
        vines={assets.groomVines}
        branch={assets.groomBranch}
      />

      <DecorativeImage
        src={assets.leafDivider}
        box={{ left: -65, top: 357, width: 498, height: 112 }}
        imageBox={{ left: "-0.04%", top: "-346.43%", width: "100.08%", height: "791.07%" }}
        sizes="498px"
      />

      <Portrait
        side="bride"
        photo={assets.bridePhoto}
        vines={assets.brideVines}
        branch={assets.brideBranch}
      />

      <p className="font-qwitcher absolute top-[515px] left-[216px] text-[54.716px] leading-[65.659px] tracking-[-1.3679px]">
        The Bride
      </p>
      <div className="font-playfair absolute top-[574px] left-[215px] text-[25px] leading-9 tracking-[0.7606px]">
        <p>Pramesthi</p>
        <p>Wahyuring</p>
        <p>Kinasih</p>
      </div>
      <div className="font-literata absolute top-[696px] left-[215px] leading-[19.512px] tracking-[0.4122px]">
        <p className="text-[10.577px]">daughter of</p>
        <p className="text-[13.55px]">Tri Wahjoedi</p>
        <p className="text-[13.55px]">&amp; Riring Isyunani</p>
      </div>
    </StorySection>
  );
}
