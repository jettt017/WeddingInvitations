import InvitationExperience from "@/components/InvitationExperience";
import DesktopPreview from "@/components/layout/DesktopPreview";

export default function Home() {
  return (
    <>
      {/* Mobile (<1024px): fullscreen hero background */}
      <div className="block w-full lg:hidden">
        <InvitationExperience />
      </div>

      {/* Desktop (>=1024px): blurred bg + centered phone canvas */}
      <div className="hidden lg:block">
        <DesktopPreview>
          <InvitationExperience />
        </DesktopPreview>
      </div>
    </>
  );
}
