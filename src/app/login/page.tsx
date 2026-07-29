import Link from "next/link";

import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Organizer access" title="Log in" description="Supabase Auth will own this flow in production. The screen is already designed around the real organizer journey." />
      <Card className="mt-8">
        <form className="space-y-4">
          <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" placeholder="Email address" type="email" />
          <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" placeholder="Password" type="password" />
          <button className="w-full rounded-full bg-[var(--color-gold)] px-4 py-3 font-semibold text-[var(--color-ink)]" type="submit">
            Continue to dashboard
          </button>
        </form>
        <p className="mt-4 text-sm text-[var(--color-mist)]">
          Need an account? <Link href="/signup" className="text-[var(--color-gold)]">Create one</Link>
        </p>
      </Card>
    </div>
  );
}
