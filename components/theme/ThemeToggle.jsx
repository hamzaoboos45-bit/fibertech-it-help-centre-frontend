"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const themes = [
    {
        value: "light",
        label: "Light",
        icon: Sun,
    },
    {
        value: "dark",
        label: "Dark",
        icon: Moon,
    },
    {
        value: "system",
        label: "System",
        icon: Monitor,
    },
];

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="mt-3 grid grid-cols-3 gap-2">
            {themes.map(({ value, label, icon: Icon }) => {
                const active = theme === value;

                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setTheme(value)}
                        aria-pressed={active}
                        className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-semibold transition ${
                            active
                                ? "border-[#18365D] bg-[#18365D] text-white"
                                : "border-slate-200 bg-white text-slate-600 hover:border-[#18365D]/40 hover:bg-slate-50"
                        }`}
                    >
                        <Icon size={17} />
                        <span>{label}</span>
                    </button>
                );
            })}
        </div>
    );
}