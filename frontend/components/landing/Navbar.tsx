"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LiquidMetalButton } from "@/components/liquid-metal-button";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className="fixed z-50 w-full px-2 pt-7 top-0 left-0 right-0">
            <div
                className={cn(
                    "mx-auto px-4 sm:px-6 transition-all duration-500 ease-out lg:px-5",
                    scrolled
                        ? "max-w-4xl rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] ring-1 ring-white/10"
                        : "max-w-6xl rounded-full border border-white/20 bg-white/10 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] ring-1 ring-white/10"
                )}
            >
                <div className="relative flex items-center justify-between py-3 lg:py-4">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/navbar.png"
                            alt="PaperLens"
                            width={200}
                            height={52}
                            className="h-12 w-auto object-contain ml-2.5"
                            priority
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3">
                        {clerkEnabled ? (
                            <>
                                {/* Always show UserButton when signed in */}
                                <Show when="signed-in">
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                userButtonAvatarBox: "w-10 h-10 ring-2 ring-white/20",
                                            },
                                        }}
                                    />
                                </Show>

                                {/* Signed-out: initial = Login + Signup, scrolled = Explore PaperLens */}
                                <Show when="signed-out">
                                    <div
                                        className={cn(
                                            "flex items-center gap-3 transition-all duration-500",
                                            scrolled ? "opacity-0 pointer-events-none w-0 overflow-hidden" : "opacity-100"
                                        )}
                                    >
                                        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                            <div id="navbar-login-btn">
                                                <LiquidMetalButton
                                                    label="Login"
                                                    onClick={() => {}}
                                                    width={120}
                                                />
                                            </div>
                                        </SignInButton>
                                        <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                                            <div id="navbar-signup-btn">
                                                <LiquidMetalButton
                                                    label="Sign Up"
                                                    onClick={() => {}}
                                                    width={120}
                                                    variant="white"
                                                />
                                            </div>
                                        </SignUpButton>
                                    </div>
                                    <div
                                        className={cn(
                                            "transition-all duration-500",
                                            scrolled ? "opacity-100" : "opacity-0 pointer-events-none w-0 overflow-hidden"
                                        )}
                                    >
                                        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                            <div>
                                                <LiquidMetalButton
                                                    label="Getting Started"
                                                    onClick={() => {}}
                                                    width={190}
                                                />
                                            </div>
                                        </SignInButton>
                                    </div>
                                </Show>
                            </>
                        ) : (
                            <Link href="/chat">
                                <LiquidMetalButton
                                    label="Getting Started"
                                    onClick={() => {}}
                                    width={190}
                                />
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <>
                    <div
                        className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm top-18"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="md:hidden fixed top-18 left-2 right-2 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl p-4 space-y-3 z-50 ring-1 ring-white/10 flex flex-col items-center">
                        {clerkEnabled ? (
                            <>
                                <Show when="signed-out">
                                    {scrolled ? (
                                        <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                            <div>
                                                <LiquidMetalButton
                                                    label="Getting Started"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    width={280}
                                                />
                                            </div>
                                        </SignInButton>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3 w-full">
                                            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                                                <div id="mobile-login-btn" onClick={() => setMobileMenuOpen(false)}>
                                                    <LiquidMetalButton
                                                        label="Login"
                                                        onClick={() => {}}
                                                        width={280}
                                                    />
                                                </div>
                                            </SignInButton>
                                            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                                                <div id="mobile-signup-btn" onClick={() => setMobileMenuOpen(false)}>
                                                    <LiquidMetalButton
                                                        label="Sign Up"
                                                        onClick={() => {}}
                                                        width={280}
                                                        variant="white"
                                                    />
                                                </div>
                                            </SignUpButton>
                                        </div>
                                    )}
                                </Show>
                                <Show when="signed-in">
                                    <UserButton
                                        appearance={{
                                            elements: {
                                                userButtonAvatarBox: "w-16 h-16 ring-2 ring-white/20",
                                            },
                                        }}
                                    />
                                </Show>
                            </>
                        ) : (
                            <Link href="/chat" onClick={() => setMobileMenuOpen(false)}>
                                <LiquidMetalButton
                                    label="Open Workspace"
                                    onClick={() => {}}
                                    width={280}
                                />
                            </Link>
                        )}
                    </div>
                </>
            )}
        </nav>
    );
}
