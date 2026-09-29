"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CircleAlert, CircleCheck, Clock3, Search, Ticket } from "lucide-react";
import Logo from "../../components/Logo";
import { getTicketStatus } from "../../lib/api";

const STATUS_STEPS = [
    { key: "OPEN", label: "OPEN", description: "Ticket received" },
    { key: "REVIEWING", label: "REVIEWING", description: "IT Team is reviewing your request" },
    { key: "IN_PROGRESS", label: "IN PROGRESS", description: "Work has started on your issue" },
    { key: "RESOLVED", label: "RESOLVED", description: "The reported issue has been resolved" },
    { key: "CLOSED", label: "CLOSED", description: "The ticket has been closed" },
];

function normalizeStatus(status) {
    return String(status || "OPEN").toUpperCase().replace(/\s+/g, "_");
}

function TicketStatusContent() {
    const searchParams = useSearchParams();
    const queryTicket = searchParams.get("ticket") || "";
    const [ticketId, setTicketId] = useState(queryTicket);
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (queryTicket) {
            lookupTicket(queryTicket);
        }
        // lookupTicket intentionally handles the async request and its state.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [queryTicket]);

    async function lookupTicket(value = ticketId) {
        const normalized = value.trim();
        setError("");
        setTicket(null);

        if (!normalized) {
            setError("Please enter your Ticket ID.");
            return;
        }

        setLoading(true);
        try {
            const result = await getTicketStatus(normalized);
            setTicket(result);
        } catch (err) {
            setError(err.message || "Unable to find this ticket.");
        } finally {
            setLoading(false);
        }
    }

    const currentStatus = normalizeStatus(ticket?.status);
    const currentIndex = STATUS_STEPS.findIndex((step) => step.key === currentStatus);

    return (
        <main className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
                    <nav className="flex h-20 items-center justify-between">
                        <Link href="/" className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-red-600">
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            Back to Help Centre
                        </Link>
                        <Logo />
                    </nav>
                </div>
            </header>

            <section className="pb-8 pt-10 md:pb-10 md:pt-14">
                <div className="mx-auto max-w-4xl px-6 md:px-12">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-10 bg-red-600" />
                        <span className="text-sm font-bold tracking-[0.18em] text-red-600">IT SUPPORT</span>
                    </div>
                    <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">Check Ticket Status</h1>
                    <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-500">
                        Enter the unique Ticket ID provided after submitting your request to view its current state.
                    </p>
                </div>
            </section>

            <section className="px-6 pb-16 md:px-12 lg:px-20">
                <div className="mx-auto max-w-4xl">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            lookupTicket();
                        }}
                        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
                    >
                        <div className="flex items-start gap-4">
                            <div className="rounded-xl bg-slate-900 p-3 text-white"><Ticket className="h-6 w-6" /></div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900">Find Your Ticket</h2>
                                <p className="mt-1 text-sm text-slate-500">Search by the exact Ticket ID.</p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                            <input
                                value={ticketId}
                                onChange={(event) => setTicketId(event.target.value)}
                                placeholder="Example: FT-2026-000123"
                                autoComplete="off"
                                className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 font-mono text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-red-600 px-6 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Search className="h-4 w-4" />
                                {loading ? "Checking..." : "Check Status"}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                                <div className="flex items-center gap-2 font-bold"><CircleAlert className="h-4 w-4" /> Ticket lookup failed</div>
                                <p className="mt-1">{error}</p>
                            </div>
                        )}
                    </form>

                    {ticket && (
                        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
                            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-6">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Ticket ID</p>
                                    <p className="mt-2 font-mono text-lg font-bold text-slate-900">{ticket.ticket_id || ticket.ticketId || ticket.id}</p>
                                </div>
                                <div className="rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-800">
                                    {String(ticket.status || "OPEN").replace(/_/g, " ")}
                                </div>
                            </div>

                            <div className="mt-8 space-y-5">
                                {STATUS_STEPS.map((step, index) => {
                                    const completed = currentIndex >= index;
                                    const active = currentIndex === index;
                                    return (
                                        <div key={step.key} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 ${completed ? "border-green-500 bg-green-50 text-green-700" : "border-slate-200 bg-white text-slate-400"}`}>
                                                    {completed ? <CircleCheck className="h-5 w-5" /> : <Clock3 className="h-4 w-4" />}
                                                </div>
                                                {index < STATUS_STEPS.length - 1 && <div className={`mt-1 h-10 w-px ${currentIndex > index ? "bg-green-300" : "bg-slate-200"}`} />}
                                            </div>
                                            <div className="pt-1">
                                                <p className={`text-sm font-bold ${active ? "text-red-600" : completed ? "text-slate-900" : "text-slate-400"}`}>{step.label}</p>
                                                <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-8 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2">
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Submitted</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800">{ticket.created_at || ticket.createdAt || "—"}</p>
                                </div>
                                <div className="rounded-xl bg-slate-50 p-4">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Last Updated</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800">{ticket.updated_at || ticket.updatedAt || "—"}</p>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </section>
        </main>
    );
}

export default function TicketStatusPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-slate-100">
                    <div className="flex min-h-screen items-center justify-center">
                        <p className="text-sm font-semibold text-slate-500">
                            Loading ticket status...
                        </p>
                    </div>
                </main>
            }
        >
            <TicketStatusContent />
        </Suspense>
    );
}
