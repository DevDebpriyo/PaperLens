import { Marquee } from "@/components/ui/marquee"
import Image from "next/image"

const companies = [
    {
        name: "ElevenLabs",
        url: "/elevenlabs.png",
    },
    {
        name: "Gemini",
        url: "/gemini.png",
    },
    {
        name: "Github",
        url: "/github.png",
    },
    {
        name: "Vercel",
        url: "/vercel.png",
    },
]

export function Logos() {
    return (
        <section
            id="logos"
            className="relative w-full z-20"
            style={{ marginTop: 'calc(1.25rem - 150px)' }}
        >
            {/* Glass prism panel — wraps content, not clipped */}
            <div
                className="relative w-full py-2"
                style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.22) 0%, rgba(255,240,200,0.14) 40%, rgba(200,220,255,0.16) 70%, rgba(255,255,255,0.12) 100%)",
                    backdropFilter: "blur(20px) saturate(180%) brightness(1.08)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%) brightness(1.08)",
                }}
            >

                {/* Marquee content */}
                <div className="relative z-10">
                    <Marquee className="max-w-full [--duration:12s]">
                        {companies.map((company, idx) => (
                            <div
                                key={idx}
                                className="flex items-center justify-center mx-16"
                                style={{ height: "72px", width: "220px" }}
                            >
                                <Image
                                    src={company.url || "/placeholder.svg"}
                                    alt={company.name}
                                    width={220}
                                    height={72}
                                    className="object-contain brightness-0 opacity-70 hover:opacity-100 transition-opacity duration-300"
                                    style={{ height: "72px", width: "auto", maxWidth: "220px" }}
                                    priority={idx < 2}
                                />
                            </div>
                        ))}
                    </Marquee>
                </div>
            </div>
        </section>
    )
}