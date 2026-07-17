import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-blueprint px-6 text-white">
      <div className="w-full max-w-3xl border border-white/25 p-8 sm:p-12">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-warn">ERROR · 404</p>
        <h1 className="mt-6 font-display text-5xl font-extrabold leading-[0.95] tracking-tight-3 sm:text-7xl">
          This sheet was not found.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
          The page may have moved, or the address may be incorrect. Return to the studio or browse
          the systems we have shipped.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Button asChild variant="solid" size="lg">
            <Link href="/">Return home</Link>
          </Button>
          <Button asChild variant="primary" size="lg">
            <Link href="/work">View work →</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
