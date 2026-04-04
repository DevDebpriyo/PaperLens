"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MoveRight, Check, Terminal, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const description =
  "PaperLens is a revolutionary platform designed to bridge the gap between human intent and complex research, transforming static papers into immersive, easy-to-digest experiences. Making knowledge accessible, intuitive, and engaging.";

// ─── How It Works mockups (inlined so they render inside the pinned section) ───
const Step1Mockup = () => (
  <div className="w-full h-full p-4 flex flex-col gap-3">
    <div className="text-xs text-black/60 mb-1">Prompt</div>
    <div className="bg-white border-2 border-black rounded-lg p-3 h-24 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
      <div className="pl-4 text-neutral-400 italic">{"// Initializing..."}</div>
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
    description:
      "Tell PaperLens what you want to build. From simple tokens to complex DeFi protocols.",
    step: "STEP 1",
  },
  {
    Mockup: Step2Mockup,
    title: "AI Generates Code",
    description:
      "Our agent writes production-ready Soroban contracts and frontend bindings in seconds.",
    step: "STEP 2",
  },
  {
    Mockup: Step3Mockup,
    title: "Deploy to Stellar",
    description:
      "One-click deployment to Testnet or Mainnet with automated verification checks.",
    step: "STEP 3",
  },
];

export function About() {
  const sectionRef    = useRef<HTMLDivElement>(null);
  const paraRef       = useRef<HTMLDivElement>(null);
  const plRef         = useRef<HTMLDivElement>(null);
  const leftDoorRef   = useRef<HTMLDivElement>(null);
  const rightDoorRef  = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !sectionRef.current ||
      !paraRef.current ||
      !plRef.current ||
      !leftDoorRef.current ||
      !rightDoorRef.current ||
      !howItWorksRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const charEls  = paraRef.current!.querySelectorAll<HTMLElement>(".char");
      const paperEls = plRef.current!.querySelectorAll<HTMLElement>(".paper-char");

      // Doors start fully off-screen
      gsap.set(leftDoorRef.current,  { xPercent: -100 });
      gsap.set(rightDoorRef.current, { xPercent:  100 });

      // How It Works starts invisible
      gsap.set(howItWorksRef.current, { opacity: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2500",   // ~60% more than original +=5500 to accommodate HowItWorks
          scrub: 1.5,
          pin: true,
        },
      });

      /* ── Phase 1: description char-by-char ── */
      tl.to(charEls, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.05,
        ease: "power2.out",
      });

      tl.to({}, { duration: 2 }); // hold

      /* ── Phase 2: description blurs out ── */
      tl.to(paraRef.current, {
        opacity: 0,
        filter: "blur(24px)",
        duration: 3,
        ease: "power2.inOut",
      });

      /* ── Phase 3: PAPERLENS letters appear ── */
      tl.to(
        paperEls,
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          duration: 2,
          stagger: 0.45,
          ease: "power3.out",
        },
        "+=0.5"
      );

      tl.to({}, { duration: 2.5 }); // hold

      /* ── Phase 4: R zooms → doors close → bg → white → doors open ── */
      tl.addLabel("zoomStart");

      const zoomEl = sectionRef.current!.querySelector<HTMLElement>(".paper-zoom");

      if (zoomEl) {
        const others = Array.from(paperEls).filter(
          (el) => !el.classList.contains("paper-zoom")
        );

        tl.set(sectionRef.current, { zIndex: 60 }, "zoomStart");

        tl.to(
          others,
          { opacity: 0, filter: "blur(20px)", duration: 2, ease: "power2.inOut" },
          "zoomStart"
        );

        tl.to(
          zoomEl,
          { scale: 350, duration: 5, ease: "power3.in" },
          "zoomStart"
        );

        tl.to(zoomEl, { opacity: 0, duration: 0.1 }, "zoomStart+=4.9");

        /* ── DOORS CLOSE ── */
        tl.to(
          leftDoorRef.current,
          { xPercent: 0, duration: 2.5, ease: "power2.inOut" },
          "zoomStart+=2.5"
        );
        tl.to(
          rightDoorRef.current,
          { xPercent: 0, duration: 2.5, ease: "power2.inOut" },
          "zoomStart+=2.5"
        );

        // Brief hold — doors fully closed
        tl.to({}, { duration: 1.5 });

        // Flip bg to white while doors are hiding everything
        tl.set(sectionRef.current, { backgroundColor: "#ffffff" });

        /* ── DOORS OPEN ── */
        tl.addLabel("doorsOpen");
        tl.to(
          leftDoorRef.current,
          { xPercent: -100, duration: 3, ease: "power2.inOut" },
          "doorsOpen"
        );
        tl.to(
          rightDoorRef.current,
          { xPercent: 100, duration: 3, ease: "power2.inOut" },
          "doorsOpen"
        );

        /* ── Phase 5: How It Works fades in after doors open ── */
        tl.to(
          howItWorksRef.current,
          { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" },
          "doorsOpen+=1.5"  // starts as doors are nearly open
        );
      }

      tl.to({}, { duration: 2 }); // brief hold so user can see HowItWorks

      // Reset zIndex so sections below (BentoGrid, FAQ, Footer) are visible after pin releases
      tl.set(sectionRef.current, { zIndex: 20 });
    });

    return () => ctx.revert();
  }, []);

  const words = description.split(" ");

  return (
    <div
      ref={sectionRef}
      id="about-wrapper"
      className="relative z-20 w-full"
      style={{ backgroundColor: "#1A1A1A" }}
    >
      {/* ═══ DOOR PANELS ═══ */}
      <div className="absolute inset-0 z-[45] overflow-hidden pointer-events-none">
        {/* Left door */}
        <div
          ref={leftDoorRef}
          className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#1A1A1A] transform-gpu will-change-transform flex justify-end"
        >
          <div className="w-[3px] h-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
        </div>

        {/* Right door */}
        <div
          ref={rightDoorRef}
          className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#1A1A1A] transform-gpu will-change-transform flex justify-start"
        >
          <div className="w-[3px] h-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
        </div>
      </div>

      {/* ═══ MAIN CONTENT (dark phase) ═══ */}
      <section
        id="about"
        className="w-full min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden relative z-10"
      >
        {/* Description */}
        <div
          ref={paraRef}
          className="text-center text-xl md:text-2xl lg:text-4xl text-amber-400 font-medium leading-[1.6] px-4 max-w-5xl"
        >
          {words.map((word, wIdx) => (
            <span key={wIdx}>
              <span className="inline-block whitespace-nowrap">
                {word.split("").map((char, cIdx) => (
                  <span
                    key={cIdx}
                    className="char inline-block"
                    style={{
                      opacity: 0,
                      filter: "blur(12px)",
                      willChange: "opacity, filter",
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
              {wIdx !== words.length - 1 && "\u00A0"}
            </span>
          ))}
        </div>

        {/* PAPERLENS letters */}
        <div
          ref={plRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="flex flex-row items-center justify-center">
            {"PAPERLENS".split("").map((char, i) => (
              <span
                key={i}
                className={
                  [
                    "paper-char",
                    "inline-block",
                    "origin-center",
                    char === "R" ? "paper-zoom" : "",
                    "font-black",
                    "text-7xl",
                    "md:text-9xl",
                    "lg:text-[10rem]",
                    "tracking-widest",
                    i % 2 === 0 ? "text-amber-400" : "text-white",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
                style={{
                  opacity: 0,
                  filter: "blur(20px)",
                  transform: "scale(1.5)",
                  willChange: "opacity, filter, transform",
                }}
              >
                {char}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS — revealed inside the white stage ═══
          z-20: above the dark content (z-10) but below the doors (z-45).
          Starts invisible; GSAP fades it in after the doors open.           */}
      <div
        ref={howItWorksRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center px-8 md:px-20 lg:px-32 pointer-events-none"
        style={{ opacity: 0 }}
      >
        {/* Title */}
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-black uppercase text-center mt-[15px] mb-12 md:mb-16">
          Features
        </h2>

        {/* Steps grid */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 items-center justify-center w-full max-w-5xl">
          {steps.map((step, i) => (
            <div
              key={i}
              className="w-full md:w-[300px] lg:w-[340px] shrink-0 relative flex flex-col p-4 rounded-3xl bg-[#FFA500] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-[400px] md:h-[440px]"
            >
              {/* Number badge */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#FFCC00] border-2 border-black flex items-center justify-center z-20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-[#D98E28] font-mono font-bold text-lg">0{i + 1}</span>
                <div className="absolute -top-1 -right-1 text-[#D98E28]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9L12 0Z" />
                  </svg>
                </div>
              </div>

              {/* UI Mockup */}
              <div className="h-52 w-full bg-[#FFF3E0] rounded-[20px] overflow-hidden relative border-2 border-black/10 mt-4">
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-50" />
                <step.Mockup />
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1 mt-4 bg-white/50 rounded-2xl border border-black/5">
                <h3 className="text-lg font-bold mb-2 text-[#1A1A1A]">{step.title}</h3>
                <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
