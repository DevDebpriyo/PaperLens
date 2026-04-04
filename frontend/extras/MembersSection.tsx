import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BACKEND_URL = '/api';

interface FeedbackCard {
  id: number;
  user_id: number;
  display_name: string;
  profile_picture: string;
  feedback: string;
  uid: string;
}

const renderFormattedText = (text: string) => {
  if (!text) return text;
  
  const parts = text.split(/(\*\*.*?\*\*|__.*?__|\*.*?\*|_.*?_)/g);
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('__') && part.endsWith('__')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('_') && part.endsWith('_')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
};

const cardVariants = {
  initial: (custom: { dir: number, isSelected: boolean }) => ({
    opacity: 0,
    scale: 0,
    originX: custom.dir === 1 ? 1 : 0, 
    originY: 1
  }),
  animate: (custom: { dir: number, isSelected: boolean }) => ({
    opacity: 1,
    scale: 1,
    originX: custom.dir === 1 ? 1 : 0, 
    originY: 1
  }),
  exit: (custom: { dir: number, isSelected: boolean }) => ({
    opacity: 0,
    scale: 0,
    originX: custom.dir === 1 ? 0 : 1, 
    originY: 1
  })
};

const MembersSection = () => {
  const [cards, setCards] = useState<FeedbackCard[]>([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/names`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: "feedbacks" })
        });
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCards(data.map((item: any, index: number) => ({
            ...item,
            id: index + 1,
            uid: `${item.user_id || index}-init`
          })));
        }
      } catch (e) {
        console.error("Failed to fetch feedbacks", e);
      }
    };
    fetchFeedbacks();
  }, []);
  const [direction, setDirection] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const isWindowOpenRef = useRef(false);

  useEffect(() => {
    const updateCount = () => {
      if (window.innerWidth >= 1024) setVisibleCount(4);
      else if (window.innerWidth >= 768) setVisibleCount(3);
      else setVisibleCount(2);
    };
    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const isAnimatingRef = useRef(isAnimating);
  useEffect(() => {
    isAnimatingRef.current = isAnimating;
  }, [isAnimating]);
  
  const selectedRef = useRef(selectedId);
  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  const handleNext = useCallback(() => {
    if (isAnimatingRef.current || selectedRef.current !== null) return;
    setIsAnimating(true);
    setDirection(1);
    setCards((prev) => {
      const newArr = [...prev];
      const first = newArr.shift();
      newArr.push({ ...first!, uid: `${first!.id}-${Date.now()}` });
      return newArr;
    });
  }, []);

  const handlePrev = useCallback(() => {
    if (isAnimatingRef.current || selectedRef.current !== null) return;
    setIsAnimating(true);
    setDirection(-1);
    setCards((prev) => {
      const newArr = [...prev];
      const last = newArr.pop();
      newArr.unshift({ ...last!, uid: `${last!.id}-${Date.now()}` });
      return newArr;
    });
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Allow normal page scrolling until the window is fully opened
      if (!isWindowOpenRef.current) return;

      e.stopPropagation();
      e.preventDefault();
      if (selectedRef.current !== null) return;
      if (e.deltaY > 0) {
        handleNext();
      } else if (e.deltaY < 0) {
        handlePrev();
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [handleNext, handlePrev]);

  const sectionRef = useRef<HTMLDivElement>(null);
  const leftDoorRef = useRef<HTMLDivElement>(null);
  const rightDoorRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    
    let ctx = gsap.context(() => {
      const revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=200%", // Reduced from 1500% so it opens smoothly but doesn't take 15 screen heights
          scrub: 1.5,
          pin: true,
          onUpdate: (self) => {
            const isOpen = self.progress > 0.99;
            if (isWindowOpenRef.current !== isOpen) {
              isWindowOpenRef.current = isOpen;
              setIsWindowOpen(isOpen);
            }
          }
        }
      });

      // Open sliding doors & widen the yellow line physically attached to them
      revealTl.to(leftDoorRef.current, {
        xPercent: -100,
        ease: "power2.inOut",
        duration: 1
      }, 0);
      
      revealTl.to(rightDoorRef.current, {
        xPercent: 100,
        ease: "power2.inOut",
        duration: 1
      }, 0);
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const heading = headingRef.current;
    if (heading) {
      let ctx = gsap.context(() => {
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
      });
      return () => ctx.revert();
    }
  }, []);

  return (
    <div ref={sectionRef} className="w-full relative">
      {/* Doors Mask */}
      <div className="absolute inset-0 z-[60] overflow-hidden pointer-events-none">
        <div ref={leftDoorRef} className="absolute top-0 bottom-0 left-0 w-1/2 bg-white flex justify-end transform-gpu will-change-transform">
          <div className="w-[3px] md:w-[4px] h-full bg-primary shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
        </div>
        <div ref={rightDoorRef} className="absolute top-0 bottom-0 right-0 w-1/2 bg-white flex justify-start transform-gpu will-change-transform">
          <div className="w-[3px] md:w-[4px] h-full bg-primary shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
        </div>
      </div>

      <section className="w-full min-h-[100vh] flex flex-col justify-center items-center bg-background py-20 px-4 relative z-40 border-t border-primary/20">
        <h3 
          ref={headingRef}
          className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-primary mb-16 tracking-[0.2em] uppercase drop-shadow-sm flex justify-center w-full"
        >
          {"MEMBERS".split("").map((char, i) => (
            <span key={i} className="text-char inline-block" style={{ opacity: 0 }}>
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </h3>
      
      <div 
        ref={containerRef}
        data-lenis-prevent={isWindowOpen ? "true" : undefined}
        className="overflow-hidden max-w-7xl w-full touch-none p-2"
      >
        <motion.div 
          className="flex gap-2 md:gap-3 w-full"
          animate={{ 
            x: selectedId !== null && cards.findIndex(c => c.id === selectedId) === visibleCount - 1 
              ? (visibleCount === 4 ? "-25%" : visibleCount === 3 ? "-33.333%" : "-50%") 
              : "0%" 
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
        <AnimatePresence 
          mode="popLayout" 
          custom={direction}
          onExitComplete={() => setIsAnimating(false)}
        >
          {cards.map((card) => {
            const isSelected = selectedId === card.id;

            return (
              <motion.div
                key={card.uid}
                custom={{ dir: direction, isSelected }}
                layout
                onClick={() => setSelectedId(isSelected ? null : card.id)}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{
                  layout: { type: "spring", stiffness: 200, damping: 25 },
                  scale: { duration: 0.4, ease: "easeIn" },
                  opacity: { duration: 0.4, ease: "easeIn" }
                }}
                className={`shrink-0 relative overflow-visible bg-transparent cursor-pointer transition-all duration-500 ${isSelected ? 'w-[calc(100%-0.5rem)] md:w-[calc(66.666%-0.5rem)] lg:w-[calc(50%-0.5625rem)] aspect-[4/3] z-20' : 'w-[calc(50%-0.25rem)] md:w-[calc(33.333%-0.5rem)] lg:w-[calc(25%-0.5625rem)] aspect-[3/4]'}`}
                style={{ perspective: 1000 }}
              >
                {/* 3D Rotator */}
                <motion.div 
                  className="w-full h-full relative"
                  animate={{ rotateY: isSelected ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* FRONT FACE (Card Graphics) */}
                  <div 
                    className="absolute inset-0 flex flex-col justify-center items-center p-4 md:p-6 overflow-hidden rounded-xl border border-white/10 bg-background/50 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.4)]"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    
                    <img 
                      src={card.profile_picture} 
                      alt={`${card.display_name}'s avatar`} 
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-4 border-2 border-primary/50 shadow-lg relative z-10"
                    />
                    <span className="text-xl md:text-2xl font-bold font-display text-zinc-100 text-center relative z-10">
                      {card.display_name}
                    </span>
                  </div>

                  {/* BACK FACE (Info Panel) */}
                  <div 
                    className="absolute inset-0 flex flex-col justify-center items-start p-6 md:p-10 text-left bg-neutral-900 border border-primary/50 shadow-[0_0_50px_rgba(168,85,247,0.3)] rounded-xl overflow-y-auto"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                  >
                    <h3 className="text-2xl md:text-3xl font-display text-primary font-bold mb-4 drop-shadow-sm">
                      {card.display_name}'s feedback :
                    </h3>
                    <p className="text-foreground/80 font-body text-sm md:text-base leading-relaxed">
                      "{renderFormattedText(card.feedback)}"
                    </p>
                  </div>

                </motion.div>

              </motion.div>
            );
          })}
        </AnimatePresence>
        </motion.div>
      </div>
     </section>
    </div>
  );
};

export default MembersSection;
