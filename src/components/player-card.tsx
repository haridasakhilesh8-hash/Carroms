import Image from "next/image";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import type { Player } from "@/lib/types";

export function PlayerCard({ player }: { player: Player }) {
  return (
    <Card className="flex h-full flex-col gap-5">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl">
          <Image src={player.imageUrl ?? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80"} alt={player.fullName} fill className="object-cover" />
        </div>
        <div>
          <h3 className="font-display text-2xl text-white">{player.displayName}</h3>
          <p className="text-sm text-[var(--color-mist)]">{player.city} • {player.organization}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <div>
          <p className="text-[var(--color-mist)]">Wins</p>
          <p className="mt-2 text-xl font-semibold text-white">{player.overall.matchesWon}</p>
        </div>
        <div>
          <p className="text-[var(--color-mist)]">Win %</p>
          <p className="mt-2 text-xl font-semibold text-white">{player.overall.winPercentage}</p>
        </div>
        <div>
          <p className="text-[var(--color-mist)]">Titles</p>
          <p className="mt-2 text-xl font-semibold text-white">{player.overall.titles}</p>
        </div>
      </div>
      <Link href={`/players/${player.slug}`} className="mt-auto text-sm font-semibold text-[var(--color-gold)]">
        Open profile
      </Link>
    </Card>
  );
}
