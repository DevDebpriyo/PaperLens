"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";

export function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Exponential scale for smoother feeling of zoom. 
  const scale = useTransform(scrollYProgress, [0.1, 0.6, 0.9], [1, 20, 200]);

  // Fade to black when the 'R' is taking over the screen
  const overlayOpacity = useTransform(scrollYProgress, [0.6, 0.9], [0, 1]);

  return (
    <section id="about" className="relative w-full border-t border-black/5 z-20">
      {/* Zoom Container - 250vh allows plenty of scroll for the zoom */}
      <div ref={containerRef} className="h-[250vh] relative">
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">

          {/* Section Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="absolute top-12 md:top-24 w-full flex justify-center z-10"
          >
            <h2 className="font-sans text-5xl md:text-7xl font-bold tracking-tighter text-black uppercase text-center">
              ABOUT
            </h2>
          </motion.div>

          {/* PAPERLENS Text */}
          <motion.h1
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ margin: "-20%" }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              scale,
              transformOrigin: "49.5% 50%" // The 'R' is roughly in the middle, adjusted slightly to perfectly hit the vertical stroke
            }}
            className="text-[13vw] md:text-[15vw] font-bold text-[#1A1A1A] tracking-tighter leading-none m-0 p-0 font-[Helvetica,Arial,sans-serif]"
          >
            PAPERLENS
          </motion.h1>

          {/* Black overlay that fades in to seamlessly hide any jagged scalable edges and transition to black screen */}
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-[#1A1A1A] pointer-events-none z-20"
          />
        </div>
      </div>

      {/* Paragraph Reveal Container - Seamless extension of the black screen */}
      <div className="min-h-[120vh] bg-[#1A1A1A] relative z-30 flex items-center justify-center px-6 md:px-24 py-32 border-b border-white/5">
        <div className="font-mono max-w-5xl mx-auto flex flex-col items-center justify-center h-full gap-8">
          <ScrollReveal
            textClassName="text-white md:text-5xl text-3xl font-light leading-snug text-center"
            baseOpacity={0.1}
            blurStrength={4}
          >
            PaperLens is a revolutionary platform designed to bridge the gap between human intent and production-ready smart contracts. We make building on Stellar Soroban as easy as typing a sentence, accelerating the transition to a decentralized future.
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
