import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";

export default function CreateTournamentPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle eyebrow="Create tournament" title="Set up a tournament for public sharing" description="The form mirrors the MVP schema so it can map directly onto Supabase tables and server actions." />
      <Card className="mt-8">
        <form className="grid gap-4 md:grid-cols-2">
          {[
            "Tournament name",
            "Organizer name",
            "Location",
            "Start date",
            "End date",
            "Registration closing date"
          ].map((label) => (
            <label key={label} className="space-y-2 text-sm text-[var(--color-mist)]">
              <span>{label}</span>
              <input className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" />
            </label>
          ))}
          <label className="space-y-2 text-sm text-[var(--color-mist)]">
            <span>Visibility</span>
            <select className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none">
              <option>Public</option>
              <option>Private</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-[var(--color-mist)]">
            <span>Format</span>
            <select className="w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none">
              <option>Knockout</option>
              <option>Round robin</option>
              <option>Group stage followed by knockout</option>
            </select>
          </label>
          <label className="space-y-2 text-sm text-[var(--color-mist)] md:col-span-2">
            <span>Description</span>
            <textarea className="min-h-36 w-full rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-white outline-none" />
          </label>
          <div className="md:col-span-2 flex flex-wrap gap-3">
            {["Singles", "Doubles", "Singles and doubles"].map((option) => (
              <button key={option} type="button" className="rounded-full border border-white/15 px-4 py-2 text-sm text-white">
                {option}
              </button>
            ))}
          </div>
          <div className="md:col-span-2">
            <button className="rounded-full bg-[var(--color-gold)] px-6 py-3 font-semibold text-[var(--color-ink)]" type="submit">
              Save tournament draft
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
