import Image from "next/image";
import Link from "next/link";

import {
  Monitor,
  AppWindow,
  Network,
  ShieldCheck,
  CircleHelp,
  UsersRound,
  Zap,
} from "lucide-react";
export default function Home() {
  return (
    <main>
    {/* Header / Hero Section */}
<header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-6 py-8 text-white md:px-12 lg:px-20">

  {/* =============================== */}
  {/* Decorative Red Glow Background */}
  {/* =============================== */}

  <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />

  <div className="pointer-events-none absolute right-0 top-0 h-full w-px bg-red-500/20" />


  {/* =============================== */}
  {/* Technical Network Background */}
  {/* =============================== */}

  <div className="pointer-events-none absolute inset-0 overflow-hidden">

    {/* Left Network Lines */}

    <div className="absolute left-0 top-10 h-px w-72 bg-gradient-to-r from-red-500/70 to-transparent" />

    <div className="absolute left-14 top-8 h-44 w-px rotate-45 bg-red-500/40" />

    <div className="absolute left-56 top-16 h-px w-60 rotate-12 bg-red-500/30" />


    {/* Right Network Lines */}

    <div className="absolute right-0 top-52 h-px w-80 bg-gradient-to-l from-red-500/60 to-transparent" />

    <div className="absolute right-20 top-20 h-52 w-px -rotate-45 bg-red-500/30" />

    <div className="absolute right-64 top-12 h-px w-52 -rotate-12 bg-red-500/20" />


    {/* =============================== */}
    {/* Glowing Network Nodes */}
    {/* =============================== */}

    <div className="absolute left-14 top-8 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_20px_5px_rgba(239,68,68,0.8)]" />

    <div className="absolute left-72 top-20 h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_15px_4px_rgba(239,68,68,0.7)]" />

    <div className="absolute right-24 top-48 h-3 w-3 rounded-full bg-red-500 shadow-[0_0_20px_5px_rgba(239,68,68,0.8)]" />

    <div className="absolute right-80 top-32 h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_15px_4px_rgba(239,68,68,0.7)]" />

  </div>


  {/* =============================== */}
  {/* Fiber Red Glow Effect */}
  {/* =============================== */}

  <div className="pointer-events-none absolute inset-0 overflow-hidden">

    {/* Main Fiber Arc */}

    <div className="absolute -bottom-20 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-[50%] border-2 border-red-500/50 blur-[1px]" />


    {/* Inner Fiber Glow */}

    <div className="absolute -bottom-24 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-[50%] border border-red-500/30 blur-md" />


    {/* Strong Red Glow */}

    <div className="absolute -bottom-40 left-1/2 h-64 w-[500px] -translate-x-1/2 rounded-full bg-red-600/10 blur-3xl" />

  </div>


  {/* =============================== */}
  {/* Top Logo */}
  {/* =============================== */}

  <div className="relative z-10 mx-auto flex max-w-7xl justify-end">

    <Image
      src="/FIBERTECH-LOGO/LOGO FIBERTECH.png"
      alt="Fibertech Logo"
      width={220}
      height={100}
      priority
      className="h-auto w-36 md:w-44"
    />

  </div>


  {/* =============================== */}
  {/* Hero Content */}
  {/* =============================== */}

  <div className="relative z-10 mx-auto max-w-7xl py-20 md:py-28">

    <div className="max-w-3xl">

      <p className="mb-5 text-sm font-semibold tracking-[0.25em] text-sky-400">
        INTERNAL IT SUPPORT
      </p>


      <h1 className="font-extrabold tracking-tight">

  {/* Fibertech */}
  <span className="block text-5xl leading-none text-red-600 md:text-7xl lg:text-8xl">
    Fibertech
  </span>

  {/* IT Help Centre */}
  <span className="mt-4 block text-4xl leading-none text-white md:text-6xl lg:text-7xl">
    IT Help Centre
  </span>

</h1>

{/* Fibertech Accent Line */}
<div className="mt-7 h-1 w-24 rounded-full bg-red-600" />


      
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl">
  Find the right support for your technical issues and get the help you need.
</p>

{/* Hero Features */}
<div className="mt-10 flex flex-wrap gap-4">

  {/* Secure */}
  <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
    <ShieldCheck size={20} className="text-red-500" />

    <span className="text-sm font-semibold text-slate-200">
      Secure
    </span>
  </div>


  {/* For Our People */}
  <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
    <UsersRound size={20} className="text-red-500" />

    <span className="text-sm font-semibold text-slate-200">
      For Our People
    </span>
  </div>


  {/* Fast Support */}
  <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-sm">
    <Zap size={20} className="text-red-500" />

    <span className="text-sm font-semibold text-slate-200">
      Fast Support
    </span>
  </div>

</div>

    </div>

  </div>

</header>


      

      {/* Categories Section */}
<section className="bg-slate-100 px-6 py-20 md:px-12 lg:px-20">
  <div className="mx-auto max-w-7xl">
    
    {/* Section Heading */}
    <div className="max-w-2xl">
      <p className="text-sm font-semibold tracking-[0.2em] text-sky-600">
        SUPPORT CATEGORIES
      </p>

      <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
        How can we help you?
      </h2>

      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        Select the category that best matches your technical issue.
      </p>
    </div>
{/* Category Cards Grid */}
<div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
<Link href="/hardware" className="block">
  <article className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-sky-400">
      <Monitor size={30} />
    </div>

    <h3 className="mt-6 text-2xl font-bold text-slate-900">
      Hardware Issues
    </h3>

    <p className="mt-3 leading-relaxed text-slate-600">
      Problems with computers, devices, printers and technical equipment.
    </p>

    <div className="mt-8 flex items-center justify-end text-2xl font-semibold text-sky-600 transition-transform duration-300 group-hover:translate-x-2">
      →
    </div>

  </article>
</Link>
<Link href="/software" className="block">
  <article className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-sky-400">
      <AppWindow size={30} />
    </div>

    <h3 className="mt-6 text-2xl font-bold text-slate-900">
      Software Issues
    </h3>

    <p className="mt-3 leading-relaxed text-slate-600">
      Problems with applications, systems and software.
    </p>

    <div className="mt-8 flex items-center justify-end text-2xl font-semibold text-sky-600 transition-transform duration-300 group-hover:translate-x-2">
      →
    </div>

  </article>
</Link>
<Link href="/network" className="block">
  <article className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-sky-400">
      <Network size={30} />
    </div>

    <h3 className="mt-6 text-2xl font-bold text-slate-900">
      Network & Connectivity
    </h3>

    <p className="mt-3 leading-relaxed text-slate-600">
      Problems with internet, Wi-Fi, VPN and network access.
    </p>

    <div className="mt-8 flex items-center justify-end text-2xl font-semibold text-sky-600 transition-transform duration-300 group-hover:translate-x-2">
      →
    </div>

  </article>
</Link>

<Link href="/security" className="block">
  <article className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-sky-400">
      <ShieldCheck size={30} />
    </div>

    <h3 className="mt-6 text-2xl font-bold text-slate-900">
      Security & Access
    </h3>

    <p className="mt-3 leading-relaxed text-slate-600">
      Problems with passwords, accounts and access permissions.
    </p>

    <div className="mt-8 flex items-center justify-end text-2xl font-semibold text-sky-600 transition-transform duration-300 group-hover:translate-x-2">
      →
    </div>

  </article>
</Link>
<Link href="/other" className="block">
  <article className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">

    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-sky-400">
      <CircleHelp size={30} />
    </div>

    <h3 className="mt-6 text-2xl font-bold text-slate-900">
      Other IT Issues
    </h3>

    <p className="mt-3 leading-relaxed text-slate-600">
      Get help with any other technical issue.
    </p>

    <div className="mt-8 flex items-center justify-end text-2xl font-semibold text-sky-600 transition-transform duration-300 group-hover:translate-x-2">
      →
    </div>

  </article>
</Link>

</div>


  </div>
</section>

    </main>
  );
}