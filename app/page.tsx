import HeroBackground from "@/components/splash-screen/HeroBackground";
import DesktopPreview from "@/components/layout/DesktopPreview";

export default function Home() {
  return (
    <>
      {/* Mobile (<1024px): fullscreen hero background */}
      <div className="block lg:hidden w-full">
        <HeroBackground />
      </div>

      {/* Desktop (>=1024px): blurred bg + centered phone canvas */}
      <div className="hidden lg:block">
        <DesktopPreview>
          <HeroBackground />
        </DesktopPreview>
      </div>
    </>
  );
}
