import Image from "next/image";

export default function HeroBackground() {
  return (
    <div className="relative w-full h-dvh overflow-hidden">
      <Image
        src="/images/splash-screen/hero-background.webp"
        alt="Wedding hero background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
    </div>
  );
}
