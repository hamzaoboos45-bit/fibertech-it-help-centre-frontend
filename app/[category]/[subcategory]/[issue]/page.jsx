"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, CircleAlert, Send, X } from "lucide-react";
import Logo from "../../../../components/Logo";
import { createHelpRequest, getIssue } from "../../../../lib/api";
function renderBody(body) {
    if (!Array.isArray(body)) return null;

    return body.map((block, index) => {
        if (typeof block === "string") {
            return (
                <div key={index} className="flex gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white">
                        {String(index + 1).padStart(2, "0")}
                    </div>
                    <p className="pt-1 text-sm leading-7 text-slate-600 md:text-base">{block}</p>
                </div>
            );
        }

        if (!block || typeof block !== "object") return null;

        if (block.type === "heading") {
            return <h3 key={index} className="mt-8 text-xl font-bold text-slate-900">{block.text}</h3>;
        }

        if (block.type === "steps") {
            return (
                <ol key={index} className="mt-4 list-decimal space-y-3 pl-6 text-slate-700">
                    {(block.items || []).map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                </ol>
            );
        }

        if (block.type === "list") {
            return (
                <ul key={index} className="mt-4 list-disc space-y-2 pl-6 text-slate-700">
                    {(block.items || []).map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
                </ul>
            );
        }

        return <p key={index} className="mt-4 leading-7 text-slate-700">{block.text || ""}</p>;
    });
}

export default function IssuePage({ params }) {
    const [route, setRoute] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(null);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        Promise.resolve(params).then(setRoute);
    }, [params]);

    useEffect(() => {
        if (!route) return;

        let active = true;
        setLoading(true);
        setError("");

        getIssue(route.category, route.subcategory, route.issue)
            .then((result) => active && setData(result))
            .catch((err) => active && setError(err.message || "Unable to load this issue."))
            .finally(() => active && setLoading(false));

        return () => { active = false; };
    }, [route]);

    const article = data?.articles?.[0] || null;
    const subject = article?.title || data?.name || "IT Support Request";
    const canSubmit = useMemo(
        () => name.trim() && email.trim() && description.trim() && !submitting,
        [name, email, description, submitting],
    );

    async function handleSubmit(event) {
        event.preventDefault();
        if (!canSubmit) return;

        setSubmitting(true);
        setSubmitted(null);

        try {
            const result = await createHelpRequest({
                name: name.trim(),
                email: email.trim(),
                subject,
                description: description.trim(),
            });
            setSubmitted({ success: true, id: result.id });
            setDescription("");
        } catch (err) {
            setSubmitted({ success: false, message: err.message || "Unable to submit the help request." });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
                    <nav className="flex h-20 items-center justify-between">
                        <Link
                            href={route ? `/${route.category}/${route.subcategory}` : "/"}
                            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-red-600"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to issues
                        </Link>
                        <Logo />
                    </nav>
                </div>
            </header>

            <section className="pb-10 pt-10 md:pb-14 md:pt-14">
                <div className="mx-auto max-w-5xl px-6 md:px-12">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-10 bg-red-600" />
                        <span className="text-sm font-bold tracking-[0.18em] text-red-600">IT SUPPORT</span>
                    </div>
                    <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
                        {loading ? "Loading..." : subject}
                    </h1>
                    {!loading && data?.description && (
                        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">{data.description}</p>
                    )}
                </div>
            </section>

            <section className="px-6 pb-16 md:px-12 lg:px-20">
                <div className="mx-auto max-w-5xl">
                    {loading && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">Loading solution...</div>
                    )}

                    {error && !loading && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
                            <div className="flex items-center gap-3 font-semibold"><CircleAlert size={20} /> Unable to load this issue.</div>
                            <p className="mt-2 text-sm">{error}</p>
                        </div>
                    )}

                    {!loading && !error && data && (
                        <>
                            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <div className="border-b border-slate-200 px-6 py-6 md:px-8">
                                    <div className="flex items-center gap-3">
                                        <span className="h-2 w-2 rounded-full bg-red-600" />
                                        <h2 className="text-sm font-bold tracking-[0.16em] text-slate-500">THE SOLUTION</h2>
                                    </div>
                                </div>

                                <div className="px-6 py-8 md:px-8 md:py-10">
                                    {article ? (
                                        <>
                                            <p className="mb-7 text-lg font-semibold text-slate-900">{article.title}</p>
                                            <div className="space-y-5">{renderBody(article.body)}</div>
                                        </>
                                    ) : (
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                                            <CircleAlert className="mx-auto h-8 w-8 text-slate-400" />
                                            <h3 className="mt-4 font-bold text-slate-900">Solution not available yet</h3>
                                            <p className="mt-2 text-sm leading-6 text-slate-500">A detailed solution article has not been published for this issue yet.</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                                <div>
                                    <h2 className="text-sm font-bold tracking-[0.16em] text-slate-500">DESCRIPTION</h2>
                                    <p className="mt-2 text-sm leading-6 text-slate-500">Describe your problem so IT support can better understand your issue.</p>
                                </div>

                                <textarea
                                    value={description}
                                    onChange={(event) => setDescription(event.target.value)}
                                    placeholder="Describe your problem..."
                                    maxLength={500}
                                    required
                                    className="mt-6 min-h-40 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                                />

                                <div className="mt-3 flex justify-end text-xs font-medium text-slate-400">{description.length} / 500</div>

                                <div className="mt-6 grid gap-4 md:grid-cols-2">
                                    <label className="text-sm font-semibold text-slate-700">
                                        Your Name
                                        <input
                                            value={name}
                                            onChange={(event) => setName(event.target.value)}
                                            placeholder="Enter your name"
                                            maxLength={100}
                                            required
                                            className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                                        />
                                    </label>

                                    <label className="text-sm font-semibold text-slate-700">
                                        Email
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                            placeholder="Enter your email"
                                            maxLength={255}
                                            required
                                            className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                                        />
                                    </label>
                                </div>

                                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                                    <span className="font-semibold text-slate-700">Subject:</span> {subject}
                                </div>

                                {submitted?.success && (
                                    <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                                        Help request #{submitted.id} was submitted successfully.
                                    </div>
                                )}

                                {submitted?.success === false && (
                                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                        {submitted.message}
                                    </div>
                                )}

                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={!canSubmit}
                                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Send className="h-4 w-4" />
                                        {submitting ? "Submitting..." : "Submit Help Request"}
                                    </button>
                                </div>
                            </form>

                            {article && (
                                <>
                                    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                                        <h2 className="text-sm font-bold tracking-[0.16em] text-slate-500">TAGS</h2>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {article.tags?.map((tag) => (
                                                <span key={tag} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">{tag}</span>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="mt-6 text-sm text-slate-400">
                                        Last Updated: <span className="font-semibold text-slate-500">{article.lastUpdated}</span>
                                    </div>
                                </>
                            )}

                            <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm md:p-8">
                                <h2 className="font-bold text-slate-900">Was this solution helpful?</h2>
                                <div className="mt-5 flex justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFeedback("yes")}
                                        className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${feedback === "yes" ? "border-green-300 bg-green-50 text-green-700" : "border-slate-200 text-slate-600 hover:border-green-200 hover:bg-green-50 hover:text-green-700"}`}
                                    >
                                        <Check className="h-4 w-4" /> Yes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFeedback("no")}
                                        className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${feedback === "no" ? "border-red-300 bg-red-50 text-red-700" : "border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"}`}
                                    >
                                        <X className="h-4 w-4" /> No
                                    </button>
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}
