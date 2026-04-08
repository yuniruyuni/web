import FanArtGuidelines from "./components/FanArtGuidelines";
import HeroSection from "./components/HeroSection";
import ProfileSection from "./components/ProfileSection";
import StreamingProducts from "./components/StreamingProducts";

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <main id="content" className="container mx-auto px-4">
        <ProfileSection />
        <StreamingProducts />
        <FanArtGuidelines />
      </main>
    </div>
  );
}
