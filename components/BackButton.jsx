import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    return (
        <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-red-400"
        >
            <ArrowLeft size={18} />
            Back to Help Centre
        </Link>
    );
}