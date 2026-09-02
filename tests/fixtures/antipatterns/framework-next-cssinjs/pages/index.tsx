import { FeatureGrid } from "../components/FeatureGrid";
import { Hero } from "../components/Hero";
import { Testimonials } from "../components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <Testimonials />
    </>
  );
}
