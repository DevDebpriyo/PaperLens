"use client";
import { useState } from "react";
import { LiquidMetalButton } from "@/components/liquid-metal-button";

const examplePrompts = [
  "Create a staking contract with 7-day lockup period",
  "Build a token swap interface for XLM to USDC",
  "Generate a voting DAO with proposal system",
];

export function IntentBox() {


  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setPrompt("");
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="absolute -inset-0.5 bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl blur-xl opacity-30" />
      <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm bg-[#7d5656]/45 border border-white/10 shadow-2xl ring-1 ring-white/5">


        {/* Textarea */}
        <div className="p-4 relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Build a Soroban staking contract with automated rewards distribution..."
            className="w-full h-32 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-white/95 placeholder:opacity-90 placeholder:font-medium text-sm leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-white/4">
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, i) => (
              <button
                key={i}
                onClick={() => setPrompt(example)}
                className="text-xs text-white/70 hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
              >
                {example.slice(0, 30)}...
              </button>
            ))}
          </div>
          <LiquidMetalButton onClick={handleGenerate} />
        </div>
      </div>
    </div>
  );
}
