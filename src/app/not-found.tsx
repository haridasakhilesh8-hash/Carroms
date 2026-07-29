import Link from "next/link";

import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 py-14 sm:px-6 lg:px-8">
      <Card className="w-full text-center">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--color-gold)]">404</p>
        <h1 className="mt-4 font-display text-4xl text-white">We could not find that page.</h1>
        <p className="mt-4 text-[var(--color-mist)]">Try heading back to the DCM home screen or the organizer dashboard.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="rounded-full bg-[var(--color-gold)] px-5 py-3 font-semibold text-[var(--color-ink)]">
            DCM home
          </Link>
          <Link href="/organizer" className="rounded-full border border-white/15 px-5 py-3 text-white">
            Organizer dashboard
          </Link>
        </div>
      </Card>
    </div>
  );
}
