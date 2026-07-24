import Image from "next/image";

import DecorativeImage from "@/components/invitation/DecorativeImage";
import StorySection from "@/components/invitation/StorySection";
import { STORY_ASSETS } from "@/lib/invitation-story";

interface AccountDetails {
  bank: "Mandiri" | "BRI" | "BCA";
  name: string;
  number: string;
  logo: string;
  logoBox: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
  top: number;
}

const ACCOUNTS: readonly AccountDetails[] = [
  {
    bank: "Mandiri",
    name: "FAIZ ARDYSYAHPUTRA",
    number: "***REMOVED***",
    logo: STORY_ASSETS.transaction.mandiriLogo,
    logoBox: { left: 164, top: 195, width: 79, height: 27 },
    top: 144,
  },
  {
    bank: "BRI",
    name: "FAIZ ARDYSYAHPUTRA",
    number: "***REMOVED***",
    logo: STORY_ASSETS.transaction.briLogo,
    logoBox: { left: 177, top: 284, width: 49, height: 49 },
    top: 241,
  },
  {
    bank: "BCA",
    name: "PRAMESTHI WAHYURING KINASIH",
    number: "***REMOVED***",
    logo: STORY_ASSETS.transaction.bcaLogo,
    logoBox: { left: 167, top: 390, width: 69, height: 52 },
    top: 351,
  },
];

function Account({ account }: { account: AccountDetails }) {
  return (
    <div>
      <div
        className="absolute left-[55px] z-10 w-[295px] text-center text-black"
        style={{ top: account.top }}
      >
        <p className="font-playfair text-[15.7px] leading-[21.979px] font-bold tracking-[0.3925px]">
          {account.name}
        </p>
        <p className="font-literata text-[15.7px] leading-[21.979px] tracking-[0.3925px]">
          {account.number}
        </p>
      </div>
      <div
        className="absolute z-10"
        style={{
          left: account.logoBox.left,
          top: account.logoBox.top,
          width: account.logoBox.width,
          height: account.logoBox.height,
        }}
      >
        <Image
          src={account.logo}
          alt={`${account.bank} logo`}
          fill
          sizes={`${account.logoBox.width}px`}
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default function TransactionSection() {
  const assets = STORY_ASSETS.transaction;

  return (
    <StorySection figmaNode="244:41" section="transaction" height={518} className="isolate">
      <div
        data-figma-node="244:41"
        aria-labelledby="transaction-title"
        className="absolute inset-0"
      >
        <div
          aria-hidden="true"
          className="absolute top-[355px] left-0 h-[163px] w-[393px] bg-gradient-to-b from-transparent to-black/10"
        />

        <DecorativeImage
          src={assets.topLeaves}
          box={{ left: -26, top: 0, width: 223, height: 272, zIndex: 2 }}
          imageBox={{
            left: "-0.07%",
            top: "-45.96%",
            width: "100.14%",
            height: "145.96%",
          }}
          sizes="223px"
        />
        <DecorativeImage
          src={assets.topLeaves}
          box={{
            left: 197,
            top: 0,
            width: 223,
            height: 272,
            zIndex: 2,
            transform: "scaleX(-1)",
          }}
          imageBox={{
            left: "-0.07%",
            top: "-45.96%",
            width: "100.14%",
            height: "145.96%",
          }}
          sizes="223px"
        />

        <DecorativeImage
          src={assets.paperTear}
          box={{ left: -77, top: 0, width: 547, height: 34, zIndex: 3 }}
          sizes="547px"
          imageStyle={{ objectFit: "cover" }}
        />

        <DecorativeImage
          src={assets.bottomFoliage}
          box={{ left: -254, top: 217, width: 675, height: 722, zIndex: 1 }}
          imageBox={{ left: 0, top: "-66.15%", width: "100%", height: "166.26%" }}
          sizes="675px"
        />
        <DecorativeImage
          src={assets.bottomFoliage}
          box={{
            left: -29,
            top: 230,
            width: 675,
            height: 709,
            zIndex: 1,
            transform: "scaleX(-1)",
          }}
          imageBox={{ left: 0, top: "-69.29%", width: "100%", height: "169.39%" }}
          sizes="675px"
        />

        <header className="absolute top-[41px] left-0 z-10 w-full text-center text-black">
          <h2
            id="transaction-title"
            className="font-playfair text-[30.059px] leading-[43.285px] font-bold tracking-[0.9145px]"
          >
            SUPPORT THE STORY
          </h2>
          <p className="font-playfair -mt-[9px] text-[17.908px] leading-[25.787px] tracking-[0.5448px]">
            Be Part of This Journey
          </p>
        </header>

        {ACCOUNTS.map((account) => (
          <Account key={account.bank} account={account} />
        ))}

        <div
          aria-hidden="true"
          className="absolute top-[472px] left-[181px] z-10 flex items-center gap-[7px]"
        >
          <span className="size-[5px] rotate-45 bg-black" />
          <span className="size-[8px] rotate-45 bg-black" />
          <span className="size-[5px] rotate-45 bg-black" />
        </div>
      </div>
    </StorySection>
  );
}
