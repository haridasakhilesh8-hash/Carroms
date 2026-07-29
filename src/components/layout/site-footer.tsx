import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[rgba(11,16,22,0.92)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 text-sm text-[var(--color-mist)] sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-lg text-white">DCM Carroms</p>
          <p className="mt-2 max-w-sm">
            A simple local helper for DCM carrom tournaments with reusable player names, random chit-style draws,
            and winner or runner-up cards.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white">Use It For</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/">Name bank</Link>
            <Link href="/">Random singles draw</Link>
            <Link href="/">Random doubles teams</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-white">Extra Pages</p>
          <div className="mt-3 flex flex-col gap-2">
            <Link href="/organizer">Organizer dashboard</Link>
            <Link href="/tournaments">Tournament pages</Link>
            <Link href="/players">Player pages</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
