"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-blueprint px-6 text-white">
      <div className="w-full max-w-2xl border border-white/25 p-8 sm:p-12">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-warn">SYSTEM ERROR</p>
        <h1 className="mt-5 font-display text-5xl font-extrabold tracking-tight-3">
          This page failed to load.
        </h1>
        <p className="mt-5 text-lg text-white/70">
          Try the page again. If the problem continues, return home or email sudosapient@gmail.com.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="h-12 bg-white px-6 font-mono text-xs font-medium uppercase tracking-[0.1em] text-blueprint"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-12 items-center border border-white px-6 font-mono text-xs font-medium uppercase tracking-[0.1em] text-white"
          >
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
