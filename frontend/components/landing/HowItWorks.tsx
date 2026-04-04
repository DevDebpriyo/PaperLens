"use client";
import { MoveRight, Sparkles, Check, Terminal, Globe } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Mockup Components for each step
const Step1Mockup = () => (
  <div className="w-full h-full p-4 flex flex-col gap-3">
    <div className="text-xs text-black/60 mb-1">Prompt</div>
    <div className="bg-white border-2 border-black rounded-lg p-3 h-24 relative overflow-hidden group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex gap-2 items-center mb-2">
        <div className="w-2 h-2 rounded-full bg-red-400" />
        <div className="w-2 h-2 rounded-full bg-yellow-400" />
        <div className="w-2 h-2 rounded-full bg-[#FFA500]" />
      </div>
      <p className="text-xs text-[#1A1A1A] font-mono font-medium">
        Build a Soroban staking contract with rewards...
      </p>
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
        <Terminal className="w-3 h-3 text-neutral-500" />
        <span>contract.rs</span>
      </div>
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
        <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
      </div>
    </div>
    <div className="space-y-1.5 font-mono text-[10px] text-neutral-600">
      <div className="flex gap-2">
        <span className="text-purple-700 font-bold">pub fn</span>
        <span className="text-yellow-700 font-bold">init</span>(e: Env) {"{"}
      </div>
      <div className="pl-4 text-neutral-400 italic">// Initializing...</div>
      <div className="pl-4 flex gap-2">
        <span className="text-blue-700">let</span>
        <span className="text-black font-medium">token</span> = ...
      </div>
      <div className="pl-4 text-[#FFA500] font-medium">Ok(token)</div>
      <div>{"}"}</div>
    </div>
  </div>
);

const Step3Mockup = () => (
  <div className="w-full h-full p-4 flex flex-col justify-center gap-3">
    <div className="bg-white border-2 border-black rounded-lg p-3 flex items-center gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="bg-[#FFA500] p-1.5 rounded-full">
        <Check className="w-3 h-3 text-white" />
      </div>
      <div>
        <div className="text-xs font-bold text-[#FFA500]">Deployment Success</div>
        <div className="text-[10px] text-[#FFA500]/70">Network: Futurenet</div>
      </div>
    </div>
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <Globe className="w-3 h-3" />
        <span>Explorer Link</span>
      </div>
      <div className="text-[10px] text-blue-600 underline font-medium">View hash</div>
    </div>
  </div>
);

const steps = [
  {
    Mockup: Step1Mockup,
    title: "Describe Your Intent",
    description: "Tell PaperLens what you want to build. From simple tokens to complex DeFi protocols.",
    step: "STEP 1"
  },
  {
    Mockup: Step2Mockup,
    title: "AI Generates Code",
    description: "Our agent writes production-ready Soroban contracts and frontend bindings in seconds.",
    step: "STEP 2"
  },
  {
    Mockup: Step3Mockup,
    title: "Deploy to Stellar",
    description: "One-click deployment to Testnet or Mainnet with automated verification checks.",
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
            How It Works
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