"use client";

import { useEffect, useRef } from "react";
import RotatingText from "@/components/ui/rotating-text";

export function Hero() {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.playbackRate = 0.85;
        }
    }, []);

    return (
        <>
            <div className="w-full h-[53vh]" aria-hidden="true" />

            {/* Absolute video background - moves with the parent container */}
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover pointer-events-none -z-10"
                style={{ objectPosition: "0% 25%" }}
            >
                <source src="/video.mp4" type="video/mp4" />
            </video>


            {/* Text Overlay 1 */}
            <div
                className="absolute flex items-center justify-center gap-4 text-center z-10 pointer-events-none font-sans tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                style={{
                    left: '52.5%',
                    top: '48.5%',
                    width: 'auto',
                    whiteSpace: 'nowrap',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '85px',
                    lineHeight: '87px',
                }}
            >
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-amber-100 to-amber-600">See Papers</span>
                <RotatingText
                    texts={['Differently,', 'Interactively,', 'Intelligently,', 'Beautifully,']}
                    mainClassName="px-4 bg-amber-500 text-[#1A1A1A] overflow-hidden py-1 justify-center rounded-2xl"
                    staggerFrom={"last"}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-120%" }}
                    staggerDuration={0.025}
                    splitLevelClassName="overflow-hidden pb-1"
                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                    rotationInterval={2000}
                />
            </div>

            {/* Text Overlay 2 */}
            <div
                className="absolute text-center z-10 pointer-events-none font-sans font-medium bg-clip-text text-transparent bg-gradient-to-b from-amber-100 to-amber-600 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                style={{
                    left: '57.8%',
                    top: '58%',
                    width: 'auto',
                    whiteSpace: 'nowrap',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '52px',
                    lineHeight: '54px',
                    letterSpacing: '0px',
                }}
            >
                With PaperLens
            </div>
        </>
    );
}