"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    ArrowRight,
    AppWindow,
    CircleHelp,
    Globe,
    Laptop,
    Monitor,
    Network,
    Printer,
    Settings,
    ShieldCheck,
    Wifi,
} from "lucide-react";
import Logo from "./Logo";
import CategoryHeader from "./CategoryHeader";
import { getFrontendSubcategoryRoute, getSubcategories } from "../lib/api";

const iconMap = {
    "computer-and-desktop": Monitor,
    laptop: Laptop,
    printer: Printer,
    "monitor-and-display": Monitor,
    "keyboard-and-mouse": Settings,
    "other-hardware": CircleHelp,
    "wi-fi-issues": Wifi,
    "internet-connection": Network,
    "vpn-access": ShieldCheck,
    "network-access": Network,
    "network-equipment": Settings,
    "password-issues": ShieldCheck,
    "account-access": ShieldCheck,
    "access-permissions": ShieldCheck,
    "mfa-authentication": ShieldCheck,
    "account-security": ShieldCheck,
    applications: AppWindow,
    "operating-system": Monitor,
    "software-errors": CircleHelp,
    "installation-updates": Settings,
    "microsoft-office": AppWindow,
    browser: Globe,
    "general-it-support": CircleHelp,
    "technical-questions": CircleHelp,
    "system-configuration": Settings,
    "it-advice": CircleHelp,
    "other-technical-issue": CircleHelp,
};

const categoryMeta = {
    hardware: {
        label: "HARDWARE SUPPORT",
        title: "Hardware",
        highlight: "Issues",
        description: "Get help with computers, laptops, printers, displays, input devices and other hardware-related issues.",
    },
    network: {
        label: "NETWORK SUPPORT",
        title: "Network & Connectivity",
        highlight: "Issues",
        description: "Get help with Wi-Fi, internet access, VPN, network access and network equipment.",
    },
    security: {
        label: "SECURITY SUPPORT",
        title: "Security & Access",
        highlight: "Issues",
        description: "Get help with passwords, account access, permissions, authentication and account security.",
    },
    software: {
        label: "SOFTWARE SUPPORT",
        title: "Software",
        highlight: "Issues",
        description: "Get support for applications, operating systems, installations, browsers and other software-related issues.",
    },
    other: {
        label: "GENERAL IT SUPPORT",
        title: "Other IT",
        highlight: "Issues",
        description: "Cannot find your issue in another category? Select the option that best describes the support you need.",
    },
};

export default function CategoryBrowser({ categorySlug }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const meta = categoryMeta[categorySlug] || categoryMeta.other;

    useEffect(() => {
        let active = true;
        getSubcategories(categorySlug)
            .then((data) => {
                if (active) setItems(data);
            })
            .catch((err) => {
                if (active) setError(err.message || "Unable to load support categories.");
            })
            .finally(() => {
                if (active) setLoading(false);
            });

        return () => {
            active = false;
        };
    }, [categorySlug]);

    return (
        <main className="min-h-screen bg-slate-100">
            <CategoryHeader
                label={meta.label}
                title={meta.title}
                highlight={meta.highlight}
                description={meta.description}
            />
            <Logo />

            <section className="px-6 py-16 md:px-12 lg:px-20">
                <div className="mx-auto max-w-7xl">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold tracking-[0.2em] text-red-600">
                            {meta.label}
                        </p>
                        <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
                            What do you need help with?
                        </h2>
                        <p className="mt-4 text-lg leading-relaxed text-slate-600">
                            Select the support area that best matches your issue.
                        </p>
                    </div>

                    {loading && (
                        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
                            Loading support categories...
                        </div>
                    )}

                    {error && !loading && (
                        <div className="mt-12 rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
                            <p className="font-semibold">Unable to load support categories.</p>
                            <p className="mt-2 text-sm">{error}</p>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {items.map((item) => {
                                const Icon = iconMap[item.slug] || CircleHelp;
                                return (
                                    <Link
                                        href={`/${categorySlug}/${getFrontendSubcategoryRoute(categorySlug, item.slug)}`}
                                        key={item.id}
                                        className="group rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm transition duration-300 hover:-translate-y-2 hover:border-red-200 hover:shadow-xl"
                                    >
                                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-red-50 text-red-600 transition duration-300 group-hover:bg-red-600 group-hover:text-white">
                                            <Icon size={30} />
                                        </div>
                                        <h3 className="mt-6 text-2xl font-bold text-slate-900">{item.name}</h3>
                                        <p className="mt-3 leading-relaxed text-slate-600">{item.description}</p>
                                        <div className="mt-8 flex justify-end text-red-600 transition-transform duration-300 group-hover:translate-x-2">
                                            <ArrowRight size={24} />
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
