import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { IntentBox } from "@/components/landing/IntentBox";

import { Logos } from "@/components/landing/Marquee";
import PaperLensBentoGrid from "@/components/landing/BentoGrid";
import FAQ from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";
import { ReactLenis } from 'lenis/react';



import { About } from "@/components/landing/About";

export default function LandingPage() {
  return (
    <ReactLenis root>
      <main className="flex flex-col w-full min-h-screen bg-[#fbe1b1] text-[#354230]">
        <Navbar />
        {/* Sticky hero + marquee block — About slides over on scroll */}
        <div className="sticky top-0 z-10">
          <div className="relative flex flex-col items-center w-full min-h-screen px-6 pt-[10vh] pb-20 overflow-hidden">
            <Hero />
          </div>
          <Logos />
        </div>
        {/* <ScrollRevealGallery /> */}
        <About />

        <PaperLensBentoGrid />
        <FAQ />
        <Footer />
      </main>
    </ReactLenis>
  );
}