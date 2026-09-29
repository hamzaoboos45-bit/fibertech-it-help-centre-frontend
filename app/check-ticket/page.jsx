"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getTicketStatus } from "../../lib/api";

const STATUS_STYLES = {
    OPEN: {
        label: "OPEN",
        className: "border-blue-200 bg-blue-50 text-blue-700",
    },

    REVIEWING: {
        label: "REVIEWING",
        className: "border-yellow-200 bg-yellow-50 text-yellow-700",
    },

    IN_PROGRESS: {
        label: "IN PROGRESS",
        className: "border-purple-200 bg-purple-50 text-purple-700",
    },

    RESOLVED: {
        label: "RESOLVED",
        className: "border-green-200 bg-green-50 text-green-700",
    },

    CLOSED: {
        label: "CLOSED",
        className: "border-gray-200 bg-gray-50 text-gray-700",
    },
};

function formatDate(dateString) {
    if (!dateString) return "—";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function getStatusStyle(status) {
    return (
        STATUS_STYLES[status] || {
            label: status || "UNKNOWN",
            className: "border-gray-200 bg-gray-50 text-gray-700",
        }
    );
}

export default function CheckTicketPage() {
    const router = useRouter();

    const [ticketId, setTicketId] = useState("");
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleBack() {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.push("/");
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const normalizedTicketId = ticketId.trim().toUpperCase();

        if (!normalizedTicketId) {
            setError("Please enter your Ticket ID.");
            setTicket(null);
            return;
        }

        setLoading(true);
        setError("");
        setTicket(null);

        try {
            const data = await getTicketStatus(normalizedTicketId);

            setTicket(data);
        } catch (err) {
            setError(
                err?.message ||
                    "Ticket lookup failed. Please check your Ticket ID and try again."
            );
        } finally {
            setLoading(false);
        }
    }

    const currentStatus = ticket
        ? getStatusStyle(ticket.status)
        : null;

    return (
        <main className="min-h-screen bg-white px-6 py-12 text-[#18365D]">
            <div className="mx-auto w-full max-w-4xl">

                {/* =====================================================
                    BACK
                ====================================================== */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-red-600"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

                        Back
                    </button>
                </div>

                {/* =====================================================
                    HEADER
                ====================================================== */}
                <div className="mb-10 text-center">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#E31B23]">
                        FIBERTECH IT HELP CENTRE
                    </p>

                    <h1 className="text-3xl font-bold sm:text-4xl">
                        Check Your Ticket Status
                    </h1>

                    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
                        Enter your exact Ticket ID to view the current status
                        and status history of your help request.
                    </p>
                </div>

                {/* =====================================================
                    SEARCH CARD
                ====================================================== */}
                <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <form onSubmit={handleSubmit}>
                        <label
                            htmlFor="ticket-id"
                            className="mb-2 block text-sm font-semibold text-[#18365D]"
                        >
                            Ticket ID
                        </label>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <input
                                id="ticket-id"
                                type="text"
                                value={ticketId}
                                onChange={(event) =>
                                    setTicketId(event.target.value)
                                }
                                placeholder="FT-2026-000001"
                                autoComplete="off"
                                className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-[#18365D] focus:ring-2 focus:ring-[#18365D]/10"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="rounded-xl bg-[#18365D] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102746] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Checking..." : "Check Status"}
                            </button>
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                            Example: FT-2026-000001
                        </p>
                    </form>

                    {/* Error */}
                    {error && (
                        <div
                            role="alert"
                            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            {error}
                        </div>
                    )}
                </section>

                {/* =====================================================
                    TICKET RESULT
                ====================================================== */}
                {ticket && (
                    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Ticket ID
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-[#18365D]">
                                    {ticket.ticket_id}
                                </h2>

                                <p className="mt-2 text-sm text-gray-600">
                                    {ticket.subject || "Help Request"}
                                </p>
                            </div>

                            <span
                                className={`inline-flex w-fit rounded-full border px-4 py-2 text-xs font-bold ${currentStatus.className}`}
                            >
                                {currentStatus.label}
                            </span>
                        </div>

                        {/* =================================================
                            DATES
                        ================================================== */}
                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Created
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-800">
                                    {formatDate(ticket.createdAt)}
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Last Updated
                                </p>

                                <p className="mt-1 text-sm font-medium text-gray-800">
                                    {formatDate(ticket.updatedAt)}
                                </p>
                            </div>
                        </div>

                        {/* =================================================
                            STATUS HISTORY
                        ================================================== */}
                        <div className="mt-10">
                            <h3 className="text-lg font-bold text-[#18365D]">
                                Status History
                            </h3>

                            <div className="mt-5 space-y-4">
                                {ticket.statusHistory?.map(
                                    (entry, index) => {
                                        const status = getStatusStyle(
                                            entry.status
                                        );

                                        return (
                                            <div
                                                key={`${entry.status}-${entry.createdAt}-${index}`}
                                                className="relative rounded-xl border border-gray-200 p-4"
                                            >
                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <span
                                                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
                                                        >
                                                            {status.label}
                                                        </span>

                                                        <p className="mt-2 text-sm text-gray-700">
                                                            {entry.note}
                                                        </p>
                                                    </div>

                                                    <time className="text-xs text-gray-500 sm:text-right">
                                                        {formatDate(
                                                            entry.createdAt
                                                        )}
                                                    </time>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}