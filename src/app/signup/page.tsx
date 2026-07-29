import Link from "next/link";

import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Organizer access" title="Create organizer account" description="Phase 1 only requires organizer authentication, keeping player participation account-free." />
      <Card className="mt-8">
        <form className="space-y-4">
          <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" placeholder="Full name" type="text" />
          <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" placeholder="Email address" type="email" />
          <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" placeholder="Password" type="password" />
          <button className="w-full rounded-full bg-[var(--color-gold)] px-4 py-3 font-semibold text-[var(--color-ink)]" type="submit">
            Create account
          </button>
        </form>
        <p className="mt-4 text-sm text-[var(--color-mist)]">
          Already registered? <Link href="/login" className="text-[var(--color-gold)]">Log in</Link>
        </p>
      </Card>
    </div>
  );
}
