"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CircleAlert, Search, X } from "lucide-react";
import Logo from "./Logo";
import { getIssues, getSubcategory } from "../lib/api";

export default function IssueBrowser({
    categorySlug,
    subcategorySlug,
    routeSubcategorySlug,
    backLabel,
}) {
    const [subcategory, setSubcategory] = useState(null);
    const [issues, setIssues] = useState([]);
    const [search, setSearch] = useState("");
    const [solutionFilter, setSolutionFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        Promise.all([
            getSubcategory(categorySlug, subcategorySlug),
            getIssues(categorySlug, subcategorySlug),
        ])
            .then(([subcategoryData, issueData]) => {
                if (!active) return;

                setSubcategory(subcategoryData);
                setIssues(issueData);
            })
            .catch((err) => {
                if (active) {
                    setError(err.message || "Unable to load issues.");
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [categorySlug, subcategorySlug]);

    const filteredIssues = useMemo(() => {
        const query = search.trim().toLowerCase();

        return issues.filter((issue) => {
            const matchesSearch =
                !query ||
                issue.name.toLowerCase().includes(query) ||
                issue.description.toLowerCase().includes(query);

            const hasSolution = Boolean(issue.article);

            const matchesSolutionFilter =
                solutionFilter === "all" ||
                (solutionFilter === "with-solution" && hasSolution) ||
                (solutionFilter === "without-solution" && !hasSolution);

            return matchesSearch && matchesSolutionFilter;
        });
    }, [issues, search, solutionFilter]);

    return (
        <main className="min-h-screen bg-slate-100">
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
                    <nav className="flex h-20 items-center justify-between">
                        <Link
                            href={`/${categorySlug}`}
                            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-red-600"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            {backLabel || "Back"}
                        </Link>

                        <Logo />
                    </nav>
                </div>
            </header>

            {/* Page Introduction */}
            <section className="pb-12 pt-8 md:pb-16">
                <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-10 bg-red-600" />

                        <span className="text-sm font-bold tracking-[0.18em] text-red-600">
                            IT SUPPORT
                        </span>
                    </div>

                    <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
                        {subcategory?.name || "Support Issues"}
                    </h1>

                    <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
                        {subcategory?.description ||
                            "Select the issue that best matches the problem you need help with."}
                    </p>
                </div>
            </section>

            {/* Issues Section */}
            <section className="px-6 py-10 md:px-12 md:py-14 lg:px-20">
                <div className="mx-auto max-w-5xl">
                    {/* Information Card */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-sm md:px-8">
                        <div className="absolute left-0 top-0 h-full w-1 bg-red-600" />

                        <div className="flex items-start gap-5">
                            <div className="hidden rounded-xl bg-red-50 p-3 text-red-600 sm:block">
                                <CircleAlert className="h-6 w-6" />
                            </div>

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Select an issue
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Choose an issue to open its support solution. The
                                    list is loaded directly from the Help Centre
                                    backend.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mt-8">
                        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={`Search ${
                                subcategory?.name || "issues"
                            }...`}
                            className="h-14 w-full rounded-xl border border-slate-200 bg-white pl-14 pr-12 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() => setSearch("")}
                                aria-label="Clear search"
                                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Issue Filter */}
                    <div className="mt-5">
                        <p className="mb-2 text-sm font-semibold text-slate-700">
                            Filter Issues
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {[
                                {
                                    value: "all",
                                    label: "All",
                                },
                                {
                                    value: "with-solution",
                                    label: "With Solution",
                                },
                                {
                                    value: "without-solution",
                                    label: "Without Solution",
                                },
                            ].map((filter) => (
                                <button
                                    key={filter.value}
                                    type="button"
                                    onClick={() =>
                                        setSolutionFilter(filter.value)
                                    }
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                                        solutionFilter === filter.value
                                            ? "bg-red-600 text-white shadow-sm"
                                            : "border border-slate-200 bg-white text-slate-600 hover:border-red-200 hover:text-red-600"
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Loading */}
                    {loading && (
                        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
                            Loading issues...
                        </div>
                    )}

                    {/* Error */}
                    {error && !loading && (
                        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-8 text-red-700">
                            <p className="font-semibold">
                                Unable to load issues.
                            </p>

                            <p className="mt-2 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Issues */}
                    {!loading && !error && (
                        <>
                            <div className="mt-10 flex items-center justify-between border-b border-slate-200 pb-4">
                                <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                                    Issues
                                </h2>

                                <span className="text-sm font-semibold text-slate-400">
                                    {filteredIssues.length}{" "}
                                    {filteredIssues.length === 1
                                        ? "result"
                                        : "results"}
                                </span>
                            </div>

                            {filteredIssues.length > 0 ? (
                                <div className="mt-5 space-y-3">
                                    {filteredIssues.map((issue) => (
                                        <Link
                                            key={issue.id}
                                            href={`/${categorySlug}/${
                                                routeSubcategorySlug ||
                                                subcategorySlug
                                            }/${issue.slug}`}
                                            className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-md"
                                        >
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                                                <CircleAlert size={21} />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h3 className="font-bold text-slate-900">
                                                    {issue.name}
                                                </h3>

                                                <p className="mt-1 text-sm leading-6 text-slate-500">
                                                    {issue.description}
                                                </p>

                                                {issue.article && (
                                                    <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-wider text-green-600">
                                                        Solution available
                                                    </span>
                                                )}
                                            </div>

                                            <ArrowRight
                                                className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-red-600"
                                                size={20}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="mt-8 rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
                                    <p className="font-semibold text-slate-900">
                                        No issues found
                                    </p>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Try another search term or change the
                                        selected filter.
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}