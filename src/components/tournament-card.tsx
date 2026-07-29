import Link from "next/link";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Tournament } from "@/lib/types";

export function TournamentCard({ tournament }: { tournament: Tournament }) {
  return (
    <Card className="flex h-full flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-3">
          <Badge>{tournament.status.replace("_", " ")}</Badge>
          <span className="text-xs uppercase tracking-[0.24em] text-[var(--color-mist)]">{tournament.format.replace("_", " ")}</span>
        </div>
        <h3 className="mt-5 font-display text-2xl text-white">{tournament.name}</h3>
        <p className="mt-3 text-sm leading-6 text-[var(--color-mist)]">{tournament.description}</p>
      </div>
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm text-[var(--color-sand)]">
          <div>
            <p className="text-[var(--color-mist)]">Location</p>
            <p>{tournament.location}</p>
          </div>
          <div>
            <p className="text-[var(--color-mist)]">Dates</p>
            <p>{format(new Date(tournament.startDate), "dd MMM")} - {format(new Date(tournament.endDate), "dd MMM yyyy")}</p>
          </div>
        </div>
        <Link
          href={`/tournaments/${tournament.slug}`}
          className="inline-flex w-full items-center justify-center rounded-full border border-[var(--color-gold)]/40 px-4 py-3 text-sm font-semibold text-white transition hover:border-[var(--color-gold)] hover:bg-white/5"
        >
          View tournament
        </Link>
      </div>
    </Card>
  );
}
