"use client";

import { useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function DashboardPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const clerk = useClerk();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      clerk.openSignIn();
    }
  }, [isLoaded, isSignedIn, clerk]);

  if (!isLoaded || !isSignedIn) {
    return (
      <main className="flex flex-col w-full min-h-screen bg-[#fbe1b1] text-[#354230]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl font-medium animate-pulse">
            {!isLoaded ? "Loading workspace..." : "Please sign in to continue..."}
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex flex-col w-full min-h-screen bg-[#fbe1b1] text-[#354230] font-sans">
      <Navbar />
      
      {/* Main Dashboard Content */}
      <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Welcome back, {user.firstName || "Creator"}.
          </h1>
          <p className="text-lg text-[#354230]/80 max-w-2xl">
            This is your personal PaperLens workspace. Manage your web3 applications, smart contracts, and frontends all from a single minimal interface.
          </p>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Projects */}
          <div className="col-span-1 md:col-span-2 bg-white/40 backdrop-blur-md border border-[#354230]/10 rounded-3xl p-8 hover:bg-white/50 transition-colors duration-300">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
               Recent Projects
            </h2>
            <div className="flex flex-col items-center justify-center py-12 text-[#354230]/60 border-2 border-dashed border-[#354230]/20 rounded-xl">
              <p>No projects created yet.</p>
              <button className="mt-4 px-6 py-2 bg-[#354230] text-[#fbe1b1] rounded-full text-sm font-medium hover:bg-[#354230]/90 transition-colors">
                 Create Project
              </button>
            </div>
          </div>

          {/* Card 2: Quick Links */}
          <div className="col-span-1 bg-white/40 backdrop-blur-md border border-[#354230]/10 rounded-3xl p-8 hover:bg-white/50 transition-colors duration-300">
            <h2 className="text-2xl font-semibold mb-6">Resources</h2>
            <ul className="space-y-4">
              {[
                { label: "Documentation", desc: "Learn how to use PaperLens" },
                { label: "Deployments", desc: "Manage your deployed dapps" },
                { label: "Settings", desc: "Configure your workspace" }
              ].map((item, i) => (
                <li key={i} className="group cursor-pointer">
                  <h3 className="font-medium group-hover:text-primary transition-colors">{item.label}</h3>
                  <p className="text-sm text-[#354230]/70">{item.desc}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}
