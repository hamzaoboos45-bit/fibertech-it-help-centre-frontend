"use client";

import Link from "next/link";
import { useState } from "react";
import { Settings, Ticket, X } from "lucide-react";
import ThemeToggle from "../theme/ThemeToggle";

export default function SettingsMenu() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed right-6 top-6 z-50">
            {/* Settings Button */}
            <button
                type="button"
                onClick={() => setIsOpen((current) => !current)}
                aria-label={isOpen ? "Close settings" : "Open settings"}
                aria-expanded={isOpen}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[#18365D] shadow-sm transition hover:border-[#18365D] hover:shadow-md"
            >
                {isOpen ? (
                    <X size={20} strokeWidth={2} />
                ) : (
                    <Settings size={20} strokeWidth={2} />
                )}
            </button>

            {/* Settings Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                    {/* Header */}
                    <div className="border-b border-slate-100 px-5 py-4">
                        <p className="text-sm font-bold text-[#18365D]">
                            Settings
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                            Quick access and user preferences
                        </p>
                    </div>

                    {/* Ticket Status */}
                    <div className="p-3">
                        <Link
                            href="/check-ticket"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-slate-50"
                        >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#18365D]/10 text-[#18365D]">
                                <Ticket size={18} />
                            </span>

                            <span className="min-w-0">
                                <span className="block text-sm font-semibold text-slate-800">
                                    CHECK YOUR TICKET STATUS
                                </span>

                                <span className="mt-1 block text-xs text-slate-500">
                                    Track your submitted help request
                                </span>
                            </span>
                        </Link>
                    </div>

                    {/* Appearance */}
                    <div className="border-t border-slate-100 px-5 py-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            Appearance
                        </p>

                        <ThemeToggle />
                    </div>
                </div>
            )}
        </div>
    );
}