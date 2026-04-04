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
        <section id="logos" className="w-full py-10 overflow-hidden">
            <Marquee className="max-w-full [--duration:12s]">
                {companies.map((company, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-center mx-16"
                        style={{ height: "96px", width: "240px" }}
                    >
                        <Image
                            src={company.url || "/placeholder.svg"}
                            alt={company.name}
                            width={240}
                            height={96}
                            className="object-contain brightness-0 opacity-80 hover:opacity-100 transition-opacity duration-300"
                            style={{ height: "96px", width: "auto", maxWidth: "240px" }}
                            priority={idx < 2}
                        />
                    </div>
                ))}
            </Marquee>
        </section>
    )
}