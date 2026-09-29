"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Check,
    CircleAlert,
    X,
} from "lucide-react";
import Logo from "../../../../components/Logo";
import { getIssue } from "../../../../lib/api";

export default function SolutionPage({ params }) {
    const [issue, setIssue] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        let active = true;

        async function loadIssue() {
            try {
                const resolvedParams = await params;

                const data = await getIssue(
                    "hardware",
                    "laptop",
                    resolvedParams.issueSlug
                );

                if (active) {
                    setIssue(data);
                }
            } catch (err) {
                if (active) {
                    setError(err.message || "Unable to load solution.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadIssue();

        return () => {
            active = false;
        };
    }, [params]);

    return (
        <main className="min-h-screen bg-slate-100">
            {/* HEADER */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
                    <nav className="flex h-20 items-center justify-between">
                        <Link
                            href="/hardware/laptop"
                            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-red-600"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Laptop
                        </Link>

                        <Logo />
                    </nav>
                </div>
            </header>

            {/* PAGE INTRO */}
            <section className="pb-10 pt-10 md:pb-14 md:pt-14">
                <div className="mx-auto max-w-5xl px-6 md:px-12">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-10 bg-red-600" />

                        <span className="text-sm font-bold tracking-[0.18em] text-red-600">
                            IT SUPPORT
                        </span>
                    </div>

                    <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
                        {loading
                            ? "Loading..."
                            : issue?.articles?.[0]?.title ||
                                issue?.name ||
                                "Solution"}
                    </h1>

                    {!loading && issue?.description && (
                        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">
                            {issue.description}
                        </p>
                    )}
                </div>
            </section>

            {/* CONTENT */}
            <section className="px-6 pb-16 md:px-12 lg:px-20">
                <div className="mx-auto max-w-5xl">
                    {/* LOADING */}
                    {loading && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                            Loading solution...
                        </div>
                    )}

                    {/* ERROR */}
                    {error && !loading && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
                            <div className="flex items-start gap-4">
                                <CircleAlert className="mt-0.5 h-6 w-6 shrink-0" />

                                <div>
                                    <p className="font-semibold">
                                        Unable to load solution.
                                    </p>

                                    <p className="mt-2 text-sm">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DATA */}
                    {!loading && !error && issue && (
                        <>
                            {issue.articles?.[0] ? (
                                <>
                                    {/* THE SOLUTION */}
                                    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                        <div className="border-b border-slate-200 px-6 py-6 md:px-8">
                                            <div className="flex items-center gap-3">
                                                <span className="h-2 w-2 rounded-full bg-red-600" />

                                                <h2 className="text-sm font-bold tracking-[0.16em] text-slate-500">
                                                    THE SOLUTION
                                                </h2>
                                            </div>
                                        </div>

                                        <div className="px-6 py-8 md:px-8 md:py-10">
                                            <div className="space-y-5">
                                                {issue.articles[0].body?.map(
                                                    (step, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5"
                                                        >
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white">
                                                                {String(
                                                                    index + 1
                                                                ).padStart(
                                                                    2,
                                                                    "0"
                                                                )}
                                                            </div>

                                                            <p className="pt-1 text-sm leading-7 text-slate-600 md:text-base">
                                                                {step}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </section>

                                    {/* DESCRIPTION */}
                                    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                                        <h2 className="text-sm font-bold tracking-[0.16em] text-slate-500">
                                            DESCRIPTION
                                        </h2>

                                        <p className="mt-2 text-sm leading-6 text-slate-500">
                                            Describe your problem so IT support
                                            can better understand your issue.
                                        </p>

                                        <textarea
                                            value={description}
                                            onChange={(event) =>
                                                setDescription(
                                                    event.target.value
                                                )
                                            }
                                            placeholder="Describe your problem..."
                                            maxLength={500}
                                            className="mt-6 min-h-40 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                                        />

                                        <div className="mt-3 flex justify-end">
                                            <span className="text-xs font-medium text-slate-400">
                                                {description.length} / 500
                                            </span>
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <button
                                                type="button"
                                                className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700"
                                            >
                                                Submit Help Request
                                            </button>
                                        </div>
                                    </section>

                                    {/* TAGS */}
                                    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                                        <h2 className="text-sm font-bold tracking-[0.16em] text-slate-500">
                                            TAGS
                                        </h2>

                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {issue.articles[0].tags?.map(
                                                (tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
                                                    >
                                                        {tag}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </section>

                                    {/* LAST UPDATED */}
                                    <div className="mt-6 text-sm text-slate-400">
                                        Last Updated:{" "}
                                        <span className="font-semibold text-slate-500">
                                            {
                                                issue.articles[0]
                                                    .lastUpdated
                                            }
                                        </span>
                                    </div>

                                    {/* FEEDBACK */}
                                    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm md:p-8">
                                        <h2 className="font-bold text-slate-900">
                                            Was this solution helpful?
                                        </h2>

                                        <div className="mt-5 flex justify-center gap-3">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                                            >
                                                <Check className="h-4 w-4" />
                                                Yes
                                            </button>

                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                                No
                                            </button>
                                        </div>
                                    </section>
                                </>
                            ) : (
                                <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                                    <CircleAlert className="mx-auto h-8 w-8 text-slate-400" />

                                    <h2 className="mt-4 font-bold text-slate-900">
                                        Solution not available yet
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-slate-500">
                                        A solution article has not been added
                                        for this issue yet.
                                    </p>
                                </section>
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}