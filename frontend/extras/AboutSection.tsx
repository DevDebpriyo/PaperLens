import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLDivElement>(null);
  const developedByRef = useRef<HTMLDivElement>(null);
  const kingmonRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const text = "A smart raid assistant designed for Infinity Raiders Clan. This bot integrates seamlessly with Pokémon bot, helping organize teams, guide strategies, and coordinate raids in real time. From optimized setups to clear instructions, it ensures every member is prepared and aligned. Whether you're new or experienced, it simplifies teamwork and maximizes success - so you can focus on conquering raids together, efficiently and consistently.";

  useEffect(() => {
    if (!paraRef.current || !developedByRef.current || !kingmonRef.current || !sectionRef.current) return;

    let ctx = gsap.context(() => {
      const heading = headingRef.current;
      if (heading) {
        const chars = heading.querySelectorAll(".text-char");
        gsap.fromTo(chars, 
          { y: 40, color: "#00FF66", opacity: 0 },
          { 
            y: 0, 
            color: "", 
            opacity: 1,
            stagger: { each: 0.04, from: "start" },
            duration: 0.6, 
            ease: "sine.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 80%"
            }
          }
        );
      }

      const letters = paraRef.current?.querySelectorAll(".char");
      const devLetters = developedByRef.current?.querySelectorAll(".devChar");
      const kingLetters = kingmonRef.current?.querySelectorAll(".kingChar");
      
      if (!letters || !devLetters || !kingLetters) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top -10px",
          end: "+=2000%",
          scrub: 1.5,
          pin: true,
        }
      });

      // 1. Reveal paragraph
      tl.to(letters, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.1,
        ease: "power2.out",
      });

      // 2. Hold paragraph
      tl.to({}, { duration: 2 });

      // 3. Fade out paragraph
      tl.to(paraRef.current, {
        opacity: 0,
        filter: "blur(20px)",
        duration: 5,
        ease: "power2.inOut",
      });

      // 4. Reveal "Developed By :"
      tl.to(devLetters, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 2,
        stagger: 0.4,
        ease: "power2.out",
      }, "+=1");

      // 5. Hold "Developed By :"
      tl.to({}, { duration: 2 });

      // 6. Fade out "Developed By :"
      tl.to(developedByRef.current, {
        opacity: 0,
        filter: "blur(20px)",
        duration: 5,
        ease: "power2.inOut",
      });

      // 7. Reveal "Kingmon"
      tl.to(kingLetters, {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        duration: 3,
        stagger: 0.6,
        ease: "power3.out",
      }, "+=1");

      // 8. Hold final state for a bit
      tl.to({}, { duration: 2 });
      
      // 9. Zoom into 'G'
      tl.addLabel("zoomStart");
      const kingG = sectionRef.current?.querySelector(".kingmon-g");
      if (kingG) {
         tl.set(sectionRef.current, { zIndex: 60 }, "zoomStart");

         const otherKingLetters = Array.from(kingLetters).filter(el => !el.classList.contains('kingmon-g'));
         
         tl.to(kingG, {
           scale: 300,
           duration: 6,
           ease: "power3.in",
         }, "zoomStart");

         tl.to(sectionRef.current, { 
           backgroundColor: "#ffffff",
           duration: 3, 
         }, "zoomStart+=3");

         tl.to(otherKingLetters, {
           opacity: 0,
           filter: "blur(20px)",
           duration: 2,
           ease: "power2.inOut",
         }, "zoomStart");

         tl.to(kingG, {
           opacity: 0,
           duration: 0.1, 
         }, "zoomStart+=5.9");
      }

      tl.to({}, { duration: 1 });
    });

    return () => ctx.revert();
  }, []);

  // Split text by words, then by characters to prevent awkward line breaks inside words
  const words = text.split(" ");

  return (
    <section 
      ref={sectionRef} 
      className="min-h-screen flex flex-col items-center justify-center px-6 py-32 md:py-48 bg-background relative z-10 border-t border-primary/20 bg-gradient-to-b from-background to-primary/5 overflow-hidden"
    >
      <h3 
        ref={headingRef}
        className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-primary mb-12 tracking-[0.2em] uppercase drop-shadow-sm flex justify-center"
      >
        {"ABOUT".split("").map((char, i) => (
          <span key={i} className="text-char inline-block" style={{ opacity: 0 }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h3>
      
      <div className="relative w-full max-w-[70rem] mx-auto flex flex-col items-center justify-center min-h-[40vh] md:min-h-[50vh]">
        {/* Paragraph */}
        <div 
          ref={paraRef} 
          className="text-center font-body text-xl md:text-2xl lg:text-4xl text-foreground font-medium leading-[1.6] px-4"
        >
          {words.map((word, wIdx) => {
            const isPurple = ["smart", "raid", "assistant", "infinity", "clan", "pokémon", "bot", "conquering", "together", "success", "optimized", "clear", "setups", "instructions", "new", "experienced"].some(kw => word.toLowerCase().includes(kw));
            
            return (
              <span key={wIdx}>
                <span className={`inline-block whitespace-nowrap ${isPurple ? "text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-colors duration-1000" : ""}`}>
                  {word.split("").map((char, cIdx) => (
                    <span 
                      key={cIdx} 
                      className="char inline-block"
                      style={{ opacity: 0, filter: "blur(12px)", willChange: "opacity, filter" }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                {wIdx !== words.length - 1 && " "}
              </span>
            );
          })}
        </div>

        {/* Developed By */}
        <div
          ref={developedByRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center font-body text-4xl md:text-5xl lg:text-7xl text-foreground/80 font-bold leading-tight pointer-events-none tracking-wide"
        >
          <div>
            {"Developed By".split("").map((char, i) => (
              <span 
                key={i} 
                className="devChar inline-block" 
                style={{ opacity: 0, filter: "blur(15px)", willChange: "opacity, filter" }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>
        </div>

        {/* Kingmon */}
        <div
          ref={kingmonRef}
          className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none"
        >
          <div className="flex flex-row items-center justify-center drop-shadow-[0_10px_40px_rgba(168,85,247,0.6)]">
            {"Kingmon".split("").map((char, i) => {
              const isPurple = i % 2 === 0;
              return (
                <span 
                  key={i}
                  className={`kingChar inline-block origin-center ${char.toLowerCase() === 'g' ? 'kingmon-g' : ''} text-7xl md:text-9xl lg:text-[11rem] font-black tracking-widest uppercase ${isPurple ? "text-primary drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" : "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"}`}
                  style={{ opacity: 0, filter: "blur(20px)", transform: "scale(1.5)", willChange: "opacity, filter, transform" }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
