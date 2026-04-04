"use client";
import { MoveRight, Mic, MessageCircle, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Mockup Components for each step
const Step1Mockup = () => (
  <div className="w-full h-full p-4 flex flex-col gap-3">
    <div className="text-xs text-black/60 mb-1">Story Input</div>
    <div className="bg-white border-2 border-black rounded-lg p-3 h-28 relative overflow-hidden group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex gap-2 items-center mb-2">
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
        <div className="w-2 h-2 rounded-full bg-[#FFA500]" />
      </div>
      <div className="space-y-1 text-[10px] leading-tight text-[#1A1A1A] font-mono font-medium pr-8">
        <p className="flex items-center gap-1">
          <span className="text-black/60">Paper:</span>
          <span className="truncate">attention-is-all-you-need.pdf</span>
        </p>
        <p className="flex items-center gap-1">
          <span className="text-black/60">Mode:</span>
          <span>Story</span>
        </p>
        <p className="flex items-center gap-1">
          <span className="text-black/60">Tone:</span>
          <span>Beginner-friendly</span>
        </p>
      </div>
      <div className="absolute bottom-2 right-2">
        <div className="bg-[#354230]/10 p-1.5 rounded-md">
          <MoveRight className="w-3 h-3 text-[#1A1A1A]" />
        </div>
      </div>
    </div>
  </div>
);

const Step2Mockup = () => (
  <div className="w-full h-full p-4 flex flex-col gap-2">
    <div className="flex items-center justify-between border-b border-black/5 pb-2">
      <div className="flex items-center gap-2 text-xs text-neutral-600">
        <Mic className="w-3 h-3 text-neutral-500" />
        <span>podcast-script.txt</span>
      </div>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
        <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
      </div>
    </div>
    <div className="space-y-2 font-mono text-[10px] text-neutral-600">
      <p><span className="text-[#FFA500] font-bold">Host:</span> Welcome to Paper Breakdown.</p>
      <p><span className="text-[#D98E28] font-bold">Guest:</span> Today we decode transformer models.</p>
      <p><span className="text-[#FFA500] font-bold">Host:</span> Attention lets words weigh each other.</p>
      <div className="pt-1 flex gap-1">
        <div className="h-2 w-1 rounded-full bg-[#FFA500]/80" />
        <div className="h-3 w-1 rounded-full bg-[#FFA500]" />
        <div className="h-4 w-1 rounded-full bg-[#D98E28]" />
        <div className="h-2 w-1 rounded-full bg-[#FFA500]/70" />
        <div className="h-3 w-1 rounded-full bg-[#FFA500]/90" />
      </div>
    </div>
  </div>
);

const Step3Mockup = () => (
  <div className="w-full h-full p-4 flex flex-col justify-center gap-2">
    <div className="bg-white border-2 border-black rounded-lg p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="text-[10px] text-neutral-500 mb-1">Question</div>
      <p className="text-xs font-semibold text-[#1A1A1A]">What is self-attention in this paper?</p>
    </div>

    <div className="bg-[#FFF7E8] border-2 border-black/20 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-3 h-3 text-[#FFA500]" />
        <span className="text-[10px] font-bold text-[#D98E28]">PaperLens Answer</span>
      </div>
      <p className="text-[10px] text-neutral-700 leading-relaxed">
        It helps each token focus on the most relevant words before generating context-aware output.
      </p>
    </div>

    <div className="flex items-center justify-between px-1 text-[10px] text-neutral-500">
      <div className="flex items-center gap-1">
        <MessageCircle className="w-3 h-3" />
        <span>Citations: 3</span>
      </div>
      <span>Confidence: 94%</span>
    </div>
  </div>
);

const steps = [
  {
    Mockup: Step1Mockup,
    title: "Story Mode",
    description: "Turns complex research papers into clear, narrative-driven explanations that are easy to follow and remember.",
    step: "STEP 1"
  },
  {
    Mockup: Step2Mockup,
    title: "Podcast Mode",
    description: "Converts papers into engaging multi-speaker conversations, making learning feel like listening to a discussion.",
    step: "STEP 2"
  },
  {
    Mockup: Step3Mockup,
    title: "Q&A Mode",
    description: "Lets you interact with the paper—ask questions, explore concepts, and get instant, contextual answers.",
    step: "STEP 3"
  },
];

export function HowItWorks() {
  const targetRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  });

  // By mapping from 0% to -100%, the entire container will pan fully across.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-white border-t border-black/5">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col pt-[12vh] md:pt-[18vh]">
        
        {/* Title stays fixed while cards scroll */}
        <div className="w-full px-6 z-10 flex justify-center shrink-0">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-black uppercase text-center">
            Features
          </h2>
        </div>

        {/* Scrollable Container */}
        {/* pl-[100vw] places the first card precisely off-screen to the right at the start */}
        <motion.div 
          style={{ x }} 
          className="flex gap-8 md:gap-16 items-center w-max mt-[10vh] md:mt-[15vh] pl-[100vw] pr-[20vw]"
        >
          {steps.map((step, i) => (
            <div
              key={i}
              className="w-[85vw] md:w-[400px] shrink-0 group relative flex flex-col p-4 rounded-3xl bg-[#FFA500] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-500 h-[480px]"
            >
              {/* Number Badge */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#FFCC00] border-2 border-black flex items-center justify-center z-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors">
                <span className="text-[#D98E28] font-mono font-bold text-lg">0{i + 1}</span>
                <div className="absolute -top-1 -right-1 text-[#D98E28]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" /></svg>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-[#D98E28]/20 blur-[10px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />

              {/* UI Mockup Area */}
              <div className="h-64 w-full bg-[#FFF3E0] rounded-[20px] overflow-hidden relative border-2 border-black/10">
                {/* Subtle Gradient in Mockup BG */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-50" />
                <step.Mockup />
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col flex-1 mt-4 bg-white/50 rounded-2xl border border-black/5">
                <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">{step.title}</h3>
                <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}