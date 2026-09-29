"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("system");

    useEffect(() => {
        const savedTheme = localStorage.getItem("fibertech-theme");

        if (
            savedTheme === "light" ||
            savedTheme === "dark" ||
            savedTheme === "system"
        ) {
            setTheme(savedTheme);
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;

        root.classList.remove("light", "dark");

        if (theme === "light") {
            root.classList.add("light");
        }

        if (theme === "dark") {
            root.classList.add("dark");
        }

        if (theme === "system") {
            const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

            root.classList.add(prefersDark ? "dark" : "light");
        }

        localStorage.setItem("fibertech-theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }

    return context;
}