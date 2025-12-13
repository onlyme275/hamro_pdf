// src/pages/HomePage.jsx

import FeaturesSection from "../components/Sections/FeaturesSection.jsx";
import CTASection from "../components/Sections/CTASection.jsx";
import PremiumSection from "../components/Sections/PremiumSection.jsx";
import HeroCarousel from "../components/Sections/HeroCarousel.jsx";
import ToolsGridSection from "../components/Sections/ToolsGridSection.jsx";
import SplashScreenDisplay from "../components/splashScreen.jsx"; // ✅ Add this

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* ✅ Splash Screen - Shows on page load */}
      <SplashScreenDisplay />

      {/* Hero Section with Carousel */}
      <HeroCarousel />
      <ToolsGridSection />

      {/* Features / Advantages Section */}
      <FeaturesSection />

      {/* Call To Action Section */}
      <CTASection />

      {/* Premium Section */}
      <PremiumSection />
    </div>
  );
}
