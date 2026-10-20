import { About } from "@/components/sections/About";
import { Buyers } from "@/components/sections/Buyers";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Products } from "@/components/sections/Products";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { WhyUs } from "@/components/sections/WhyUs";

export default function Home() {
  return (
    <>
      <Hero />
      <Products />
      <WhyUs />
      <HowItWorks />
      <Buyers />
      <About />
      <QuoteSection />
      <Contact />
    </>
  );
}
