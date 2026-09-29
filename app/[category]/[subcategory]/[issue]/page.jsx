"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Check,
    CircleAlert,
    CircleCheck,
    Clock3,
    ExternalLink,
    Mail,
    Send,
    Ticket,
    User,
    X,
} from "lucide-react";

import Logo from "../../../../components/Logo";
import { createHelpRequest, getIssue } from "../../../../lib/api";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const NAME_PATTERN = /^(?=.*\p{L})[\p{L}][\p{L}\s.'-]{1,98}$/u;

function renderBody(body) {
    if (!Array.isArray(body)) return null;

    return body.map((block, index) => {
        if (typeof block === "string") {
            return (
                <div
                    key={index}
                    className="flex gap-5 rounded-xl border border-slate-200 bg-slate-50 p-5"
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-600 text-sm font-bold text-white">
                        {String(index + 1).padStart(2, "0")}
                    </div>

                    <p className="pt-1 text-sm leading-7 text-slate-600 md:text-base">
                        {block}
                    </p>
                </div>
            );
        }

        if (!block || typeof block !== "object") return null;

        if (block.type === "heading") {
            return (
                <h3
                    key={index}
                    className="mt-8 text-xl font-bold text-slate-900"
                >
                    {block.text}
                </h3>
            );
        }

        if (block.type === "steps") {
            return (
                <ol
                    key={index}
                    className="mt-4 list-decimal space-y-3 pl-6 text-slate-700"
                >
                    {(block.items || []).map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                    ))}
                </ol>
            );
        }

        if (block.type === "list") {
            return (
                <ul
                    key={index}
                    className="mt-4 list-disc space-y-2 pl-6 text-slate-700"
                >
                    {(block.items || []).map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                    ))}
                </ul>
            );
        }

        return (
            <p key={index} className="mt-4 leading-7 text-slate-700">
                {block.text || ""}
            </p>
        );
    });
}

function getValidationState(value, type) {
    const trimmed = value.trim();

    if (!trimmed) return "empty";

    if (type === "email") {
        return EMAIL_PATTERN.test(trimmed) ? "valid" : "invalid";
    }

    return NAME_PATTERN.test(trimmed) ? "valid" : "invalid";
}

function FieldState({ state, message }) {
    if (state === "valid") {
        return (
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                <CircleCheck className="h-3.5 w-3.5" />
                Valid
            </span>
        );
    }

    if (state === "invalid") {
        return (
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-red-600">
                <CircleAlert className="h-3.5 w-3.5" />
                {message}
            </span>
        );
    }

    return null;
}

function inputClass(state) {
    const base =
        "mt-2 h-12 w-full rounded-xl border bg-slate-50 px-4 font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2";

    if (state === "valid") {
        return `${base} border-green-400 focus:border-green-500 focus:ring-green-100`;
    }

    if (state === "invalid") {
        return `${base} border-red-400 focus:border-red-500 focus:ring-red-100`;
    }

    return `${base} border-slate-200 focus:border-red-500 focus:ring-red-100`;
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

        getIssue(route.category, route.subcategory, route.issue)
            .then((result) => {
                if (active) {
                    setData(result);
                }
            })
            .catch((err) => {
                if (active) {
                    setError(
                        err.message || "Unable to load this issue."
                    );
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
    }, [route]);

    const article = data?.articles?.[0] || null;

    const subject =
        article?.title ||
        data?.name ||
        "IT Support Request";

    const isTechnicalQuestion =
        route?.subcategory === "technical-questions" ||
        data?.subcategory?.slug === "technical-questions";

    const nameState = useMemo(
        () => getValidationState(name, "name"),
        [name]
    );

    const emailState = useMemo(
        () => getValidationState(email, "email"),
        [email]
    );

    const descriptionValid = description.trim().length > 0;

    const validationErrors = useMemo(() => {
        const errors = [];

        if (nameState === "empty") {
            errors.push("Name is required.");
        }

        if (nameState === "invalid") {
            errors.push("Please enter a valid name.");
        }

        if (emailState === "empty") {
            errors.push("Email is required.");
        }

        if (emailState === "invalid") {
            errors.push("Please enter a valid email address.");
        }

        if (!descriptionValid) {
            errors.push("Problem description is required.");
        }

        return errors;
    }, [nameState, emailState, descriptionValid]);

    const canSubmit =
        validationErrors.length === 0 && !submitting;

    async function handleSubmit(event) {
        event.preventDefault();

        setSubmitted(null);

        if (!canSubmit) {
            return;
        }

        setSubmitting(true);

        try {
            const result = await createHelpRequest({
                name: name.trim(),
                email: email.trim(),
                subject,
                description: description.trim(),
            });

            setSubmitted({
                success: true,
                ticketId:
                    result.ticket_id ||
                    result.ticketId ||
                    result.id,
                status: result.status || "OPEN",
            });

            setDescription("");
        } catch (err) {
            setSubmitted({
                success: false,
                message:
                    err.message ||
                    "Unable to submit the help request.",
            });
        } finally {
            setSubmitting(false);
        }
    }

    function handleFeedback(value) {
        setFeedback(value);
    }

    return (
        <main className="min-h-screen bg-slate-100">
            {/* =====================================================
                HEADER
            ====================================================== */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
                    <nav className="flex h-20 items-center justify-between">
                        <Link
                            href={
                                route
                                    ? `/${route.category}/${route.subcategory}`
                                    : "/"
                            }
                            className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-red-600"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to issues
                        </Link>

                        <Logo />
                    </nav>
                </div>
            </header>

            {/* =====================================================
                PAGE TITLE
            ====================================================== */}
            <section className="pb-8 pt-10 md:pb-10 md:pt-14">
                <div className="mx-auto max-w-5xl px-6 md:px-12">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-10 bg-red-600" />

                        <span className="text-sm font-bold tracking-[0.18em] text-red-600">
                            {isTechnicalQuestion
                                ? "TECHNICAL QUESTION"
                                : "IT SUPPORT"}
                        </span>
                    </div>

                    <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
                        {loading ? "Loading..." : subject}
                    </h1>
                </div>
            </section>

            {/* =====================================================
                MAIN CONTENT
            ====================================================== */}
            <section className="px-6 pb-16 md:px-12 lg:px-20">
                <div className="mx-auto max-w-5xl">

                    {/* Loading */}
                    {loading && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                            Loading issue...
                        </div>
                    )}

                    {/* Error */}
                    {error && !loading && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
                            <div className="flex items-center gap-3 font-semibold">
                                <CircleAlert size={20} />
                                Unable to load this issue.
                            </div>

                            <p className="mt-2 text-sm">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Loaded */}
                    {!loading && !error && data && (
                        <>
                            {/* =================================================
                                METADATA
                            ================================================== */}
                            <div className="grid gap-4 md:grid-cols-[auto_1fr] md:items-start">
                                {/* Last Updated */}
                                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500">
                                    <Clock3 className="h-4 w-4 text-red-600" />

                                    Last Updated:

                                    <span className="text-slate-700">
                                        {article?.lastUpdated ||
                                            "Not available"}
                                    </span>
                                </div>

                                {/* Tags */}
                                {article?.tags?.length > 0 && (
                                    <div className="flex flex-wrap gap-2 md:justify-end">
                                        {article.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* =================================================
                                SOLUTION / TECHNICAL QUESTION
                            ================================================== */}

                            {isTechnicalQuestion ? (
                                /*
                                 * TECHNICAL QUESTIONS
                                 *
                                 * No normal "SOLUTION" label.
                                 * No "A direct technical answer..." placeholder.
                                 * No feedback section.
                                 *
                                 * The actual article content is displayed
                                 * when available.
                                 */
                                article && (
                                    <section className="mt-6 overflow-hidden rounded-2xl border border-sky-200 bg-white shadow-sm">
                                        <div className="border-b border-sky-100 bg-sky-50 px-6 py-5 md:px-8">
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-lg bg-sky-100 p-2 text-sky-700">
                                                    <CircleAlert className="h-5 w-5" />
                                                </div>

                                                <h2 className="text-sm font-bold tracking-[0.16em] text-sky-800">
                                                    TECHNICAL QUESTION
                                                </h2>
                                            </div>
                                        </div>

                                        <div className="px-6 py-8 md:px-8 md:py-10">
                                            <p className="mb-7 text-lg font-semibold text-slate-900">
                                                {article.title}
                                            </p>

                                            <div className="space-y-5">
                                                {renderBody(article.body)}
                                            </div>
                                        </div>
                                    </section>
                                )
                            ) : (
                                /*
                                 * NORMAL SUPPORT ISSUE
                                 */
                                <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                                    <div className="border-b border-slate-200 px-6 py-5 md:px-8">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`h-2 w-2 rounded-full ${
                                                    article
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }`}
                                            />

                                            <h2 className="text-sm font-bold tracking-[0.16em] text-slate-500">
                                                {article
                                                    ? "SOLUTION AVAILABLE"
                                                    : "SOLUTION UNAVAILABLE"}
                                            </h2>
                                        </div>
                                    </div>

                                    <div className="px-6 py-8 md:px-8 md:py-10">
                                        {article ? (
                                            <>
                                                <p className="mb-7 text-lg font-semibold text-slate-900">
                                                    {article.title}
                                                </p>

                                                <div className="space-y-5">
                                                    {renderBody(article.body)}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center">
                                                <CircleAlert className="mx-auto h-8 w-8 text-red-500" />

                                                <h3 className="mt-4 font-bold text-slate-900">
                                                    Solution is not available yet
                                                </h3>

                                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                                    You can submit a help ticket to the IT Team if you need assistance.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}

                            {/* =================================================
                                DESCRIPTION
                            ================================================== */}
                            <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                                <h2 className="text-sm font-bold tracking-[0.16em] text-slate-500">
                                    DESCRIPTION
                                </h2>

                                <p className="mt-4 text-base leading-8 text-slate-600">
                                    {data.description ||
                                        "No additional description is available for this issue."}
                                </p>
                            </section>

                            {/* =================================================
                                HELP TICKET REQUEST
                            ================================================== */}
                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                            >
                                {/* Form Header */}
                                <div className="border-b border-slate-200 bg-slate-50 px-6 py-6 md:px-8">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-xl bg-slate-900 p-3 text-white">
                                            <Ticket className="h-6 w-6" />
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-bold text-slate-900">
                                                HELP TICKET REQUEST
                                            </h2>

                                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                                Request assistance from the FIBERTECH IT Team if the available information did not resolve your issue.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Content */}
                                <div className="p-6 md:p-8">
                                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                                        {/* Ticket Header */}
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-red-50 p-2 text-red-600">
                                                <Ticket className="h-5 w-5" />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-bold tracking-[0.16em] text-slate-700">
                                                    TICKET OF IT TEAM
                                                </h3>

                                                <p className="mt-1 text-xs text-slate-500">
                                                    Please provide accurate contact information so the IT Team can follow up.
                                                </p>
                                            </div>
                                        </div>

                                        {/* Name + Email */}
                                        <div className="mt-6 grid gap-5 md:grid-cols-2">

                                            {/* Name */}
                                            <label className="text-sm font-semibold text-slate-700">
                                                <span className="inline-flex items-center gap-2">
                                                    <User className="h-4 w-4 text-slate-400" />
                                                    Name
                                                </span>

                                                <input
                                                    value={name}
                                                    onChange={(event) =>
                                                        setName(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Enter your name"
                                                    maxLength={100}
                                                    autoComplete="name"
                                                    className={inputClass(
                                                        nameState
                                                    )}
                                                />

                                                <FieldState
                                                    state={nameState}
                                                    message="Please enter a valid name."
                                                />
                                            </label>

                                            {/* Email */}
                                            <label className="text-sm font-semibold text-slate-700">
                                                <span className="inline-flex items-center gap-2">
                                                    <Mail className="h-4 w-4 text-slate-400" />
                                                    Email
                                                </span>

                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(event) =>
                                                        setEmail(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Enter your email"
                                                    maxLength={255}
                                                    autoComplete="email"
                                                    className={inputClass(
                                                        emailState
                                                    )}
                                                />

                                                <FieldState
                                                    state={emailState}
                                                    message="Please enter a valid email address."
                                                />
                                            </label>
                                        </div>

                                        {/* Subject */}
                                        <div className="mt-5">
                                            <div className="text-sm font-semibold text-slate-700">
                                                Subject
                                            </div>

                                            <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                                {subject}
                                            </div>
                                        </div>

                                        {/* Problem Description */}
                                        <div className="mt-5">
                                            <label className="text-sm font-semibold text-slate-700">
                                                Problem Description

                                                <textarea
                                                    value={description}
                                                    onChange={(event) =>
                                                        setDescription(
                                                            event.target.value
                                                        )
                                                    }
                                                    placeholder="Describe your problem..."
                                                    maxLength={500}
                                                    className={`mt-2 min-h-40 w-full resize-y rounded-xl border bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                                                        descriptionValid
                                                            ? "border-green-400 focus:border-green-500 focus:ring-green-100"
                                                            : "border-slate-200 focus:border-red-500 focus:ring-red-100"
                                                    }`}
                                                />
                                            </label>

                                            <div className="mt-2 flex justify-between text-xs font-medium text-slate-400">
                                                <span>
                                                    {!descriptionValid &&
                                                        "Required"}
                                                </span>

                                                <span>
                                                    {description.length} / 500
                                                </span>
                                            </div>
                                        </div>

                                        {/* Validation Errors */}
                                        {validationErrors.length > 0 &&
                                            !submitted?.success && (
                                                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                                    <div className="flex items-center gap-2 font-bold">
                                                        <CircleAlert className="h-4 w-4" />

                                                        Please check the following fields:
                                                    </div>

                                                    <ul className="mt-2 list-disc space-y-1 pl-5">
                                                        {validationErrors.map(
                                                            (item) => (
                                                                <li key={item}>
                                                                    {item}
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}

                                        {/* =================================================
                                            SUCCESS
                                        ================================================== */}
                                        {submitted?.success && (
                                            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-5 text-green-800">

                                                <div className="flex items-center gap-3 font-bold">
                                                    <CircleCheck className="h-5 w-5" />
                                                    DONE — TICKET SUBMITTED
                                                </div>

                                                <p className="mt-2 text-sm">
                                                    Your ticket has been successfully sent to the IT Team.
                                                </p>

                                                {/* Ticket Information */}
                                                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                                                    {/* Ticket ID */}
                                                    <div className="rounded-lg border border-green-200 bg-white/70 p-3">
                                                        <div className="text-xs font-bold uppercase tracking-wider text-green-700">
                                                            Ticket ID
                                                        </div>

                                                        <div className="mt-1 font-mono text-sm font-bold text-slate-900">
                                                            {submitted.ticketId ||
                                                                "Assigned by IT Team"}
                                                        </div>
                                                    </div>

                                                    {/* Status */}
                                                    <div className="rounded-lg border border-green-200 bg-white/70 p-3">
                                                        <div className="text-xs font-bold uppercase tracking-wider text-green-700">
                                                            Status
                                                        </div>

                                                        <div className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-slate-900">
                                                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />

                                                            {submitted.status}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* =================================================
                                                    SUCCESS ACTIONS
                                                ================================================== */}
                                                <div className="mt-4 flex flex-wrap items-center gap-4">

                                                    {/* Check Ticket */}
                                                    {submitted.ticketId && (
                                                        <Link
                                                            href={`/check-ticket?ticket=${encodeURIComponent(
                                                                submitted.ticketId
                                                            )}`}
                                                            className="inline-flex items-center gap-2 text-sm font-bold text-green-800 underline decoration-green-300 underline-offset-4 transition hover:text-green-950"
                                                        >
                                                            Check Ticket Status

                                                            <ExternalLink className="h-4 w-4" />
                                                        </Link>
                                                    )}

                                                    {/* Back */}
                                                    <Link
                                                        href={
                                                            route
                                                                ? `/${route.category}/${route.subcategory}`
                                                                : "/"
                                                        }
                                                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900"
                                                    >
                                                        <ArrowLeft className="h-4 w-4" />

                                                        Back to Issues
                                                    </Link>
                                                </div>
                                            </div>
                                        )}

                                        {/* =================================================
                                            SUBMIT ERROR
                                        ================================================== */}
                                        {submitted?.success === false && (
                                            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5 text-red-800">
                                                <div className="flex items-center gap-2 font-bold">
                                                    <CircleAlert className="h-5 w-5" />

                                                    TICKET COULD NOT BE SUBMITTED
                                                </div>

                                                <p className="mt-2 text-sm leading-6">
                                                    {submitted.message}
                                                </p>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <div className="mt-6 flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={!canSubmit}
                                                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
                                            >
                                                <Send className="h-4 w-4" />

                                                {submitting
                                                    ? "Submitting..."
                                                    : "Submit Ticket"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>

                            {/* =================================================
                                FEEDBACK
                                Only normal solutions.
                                Technical Questions do NOT show feedback.
                            ================================================== */}
                            {!isTechnicalQuestion && (
                                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm md:p-8">
                                    <h2 className="font-bold text-slate-900">
                                        Was this solution helpful?
                                    </h2>

                                    <div className="mt-5 flex justify-center gap-3">
                                        {/* YES */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleFeedback("yes")
                                            }
                                            className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                                                feedback === "yes"
                                                    ? "border-green-300 bg-green-50 text-green-700"
                                                    : "border-slate-200 text-slate-600 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                                            }`}
                                        >
                                            <Check className="h-4 w-4" />
                                            Yes
                                        </button>

                                        {/* NO */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleFeedback("no")
                                            }
                                            className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold transition ${
                                                feedback === "no"
                                                    ? "border-red-300 bg-red-50 text-red-700"
                                                    : "border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                                            }`}
                                        >
                                            <X className="h-4 w-4" />
                                            No
                                        </button>
                                    </div>

                                    {/* Feedback Result */}
                                    {feedback && (
                                        <div className="mx-auto mt-5 max-w-md rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">
                                            <div className="flex items-center justify-center gap-2">
                                                <CircleCheck className="h-4 w-4" />

                                                DONE — THANK YOU FOR YOUR FEEDBACK
                                            </div>

                                            <p className="mt-1 font-normal text-green-700">
                                                Your response has been recorded for this session.
                                            </p>
                                        </div>
                                    )}
                                </section>
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    );
}