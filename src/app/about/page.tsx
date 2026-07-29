import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="About"
        title="Built for local carrom communities"
        description="The product is shaped around apartment leagues, club events, office tournaments, and community championships that need a clean public presence without enterprise complexity."
      />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl text-white">Why it exists</h2>
          <p className="mt-4 text-[var(--color-mist)]">
            Most local events still run through paper charts, spreadsheets, and WhatsApp updates. This product brings the tournament flow into one mobile-friendly place.
          </p>
        </Card>
        <Card>
          <h2 className="font-display text-2xl text-white">What Phase 1 covers</h2>
          <p className="mt-4 text-[var(--color-mist)]">
            Authentication, tournament setup, player and team management, manual fixtures, result entry, public pages, and winner visibility.
          </p>
        </Card>
      </div>
    </div>
  );
}
