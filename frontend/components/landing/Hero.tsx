"use client";

import { useEffect, useRef } from "react";

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
                className="absolute text-center z-10 pointer-events-none font-sans tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-amber-100 to-amber-600 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
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
                See Papers Differently,
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