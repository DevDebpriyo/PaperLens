import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { IntentBox } from "@/components/landing/IntentBox";

import { Logos } from "@/components/landing/Marquee";
import { Footer } from "@/components/landing/Footer";
import { ReactLenis } from 'lenis/react';



import { About } from "@/components/landing/About";

export default function LandingPage() {
  return (
    <ReactLenis root>
      <main className="flex flex-col w-full bg-[#fbe1b1] text-[#354230]">
        <Navbar />
        {/* Intro block in normal flow so following sections (including footer) render correctly */}
        <div className="relative z-10">
          <div className="relative flex flex-col items-center w-full min-h-screen px-6 pt-[10vh] pb-20 overflow-hidden">
            <Hero />
          </div>
          <Logos />
        </div>
        {/* <ScrollRevealGallery /> */}
        <About />

        {/* Explicit scroll space so GSAP's pinSpacing has room to work.
            Without content below, the page ends too early for the animation. */}
        <div style={{ height: "500vh" }} aria-hidden="true" />

        {/* These sections sit at z-10, above the sticky About (z-0),
            so they naturally scroll over the white background */}
        <div className="relative z-10">
          <Footer />
        </div>
      </main>
    </ReactLenis>
  );
}