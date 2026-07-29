import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(8,10,18,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full border border-[var(--color-gold)]/50 bg-[radial-gradient(circle_at_35%_35%,#f3d38a_0,#d9a441_54%,#452316_100%)] text-sm font-black text-[var(--color-ink)] shadow-[0_10px_30px_rgba(217,164,65,0.22)]">
            DCM
          </div>
          <div>
            <p className="font-display text-lg tracking-wide text-white">DCM Carroms</p>
            <p className="text-xs text-[var(--color-mist)]">Knockout scheduler, draw board, and result cards</p>
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-ink)] shadow-[0_12px_26px_rgba(217,164,65,0.18)] transition hover:bg-[var(--color-gold-soft)]"
          >
            Start Draw
          </Link>
        </div>
      </div>
    </header>
  );
}
