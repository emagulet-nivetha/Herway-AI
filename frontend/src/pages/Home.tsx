import { Hero } from "@/components/home/Hero";
import { Problems } from "@/components/home/Problems";
import { Solutions } from "@/components/home/Solutions";
import { HowItWorks } from "@/components/home/HowItWorks";
import {
  AIPreview, FinalCta, ImpactDashboard, MarketplacePreview, SkillPreview, StoriesPreview,
} from "@/components/home/Previews";

export function Home() {
  return (
    <>
      <Hero />
      <Problems />
      <Solutions />
      <HowItWorks />
      <MarketplacePreview />
      <SkillPreview />
      <AIPreview />
      <ImpactDashboard />
      <StoriesPreview />
      <FinalCta />
    </>
  );
}