import Approach from "./Components/Approach";
import Dossier from "./Components/Dossier";
import FinalCta from "./Components/FinalCta";
import Hero from "./Components/Hero";
import JourneySection from "./Components/JourneySection";
import Navbar from "./Components/Navbar";
import Problem from "./Components/Problem";
import Signals from "./Components/Signals";
import SiteFooter from "./Components/SiteFooter";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground">
      <Navbar />
      <Hero />
      <Problem />
      <Approach />
      <JourneySection />
      <Signals />
      <Dossier />
      <FinalCta />
      <SiteFooter />
    </div>
  );
}