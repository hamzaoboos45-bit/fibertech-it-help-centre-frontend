import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CategoryHeader({
    label,
    title,
    highlight,
    description,
}) {
    return (
        <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-8 text-white md:px-12 lg:px-20">

            {/* Decorative Red Glow */}

            <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />

            <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-red-500/20" />


            {/* Background Lines */}

            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                <div className="absolute left-0 top-16 h-px w-72 bg-gradient-to-r from-red-500/70 to-transparent" />

                <div className="absolute left-14 top-8 h-44 w-px rotate-45 bg-red-500/40" />

                <div className="absolute left-56 top-16 h-px w-60 rotate-12 bg-red-500/30" />

                <div className="absolute right-0 top-40 h-px w-80 bg-gradient-to-l from-red-500/60 to-transparent" />

                <div className="absolute right-20 top-16 h-52 w-px -rotate-45 bg-red-500/30" />

                {/* Glowing Nodes */}

                <div className="absolute left-14 top-14 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_20px_5px_rgba(239,68,68,0.8)]" />

                <div className="absolute right-24 top-36 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_20px_5px_rgba(239,68,68,0.8)]" />

            </div>


            {/* Header Content */}

            <div className="relative z-10 mx-auto max-w-7xl py-12 md:py-16">

                {/* Top Navigation */}

                <div className="flex items-center justify-between">

                    {/* Back Button */}

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-red-400"
                    >
                        <ArrowLeft size={18} />
                        Back to Help Centre
                    </Link>


                    {/* Fibertech Logo */}

                    

                </div>


                {/* Hero Text */}

                <div className="mt-12 max-w-3xl">

                    <p className="text-sm font-semibold tracking-[0.25em] text-red-400">
                        {label}
                    </p>

                    <h1 className="mt-5 text-5xl font-extrabold tracking-tight md:text-7xl">
                        {title}{" "}

                        {highlight && (
                            <span className="text-red-500">
                                {highlight}
                            </span>
                        )}
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
                        {description}
                    </p>

                </div>

            </div>

        </header>
    );
}