import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-sm text-[var(--color-mist)]">{label}</p>
      <p className="mt-3 font-display text-3xl text-white">{value}</p>
      {hint ? <p className="mt-2 text-sm text-[var(--color-sand)]">{hint}</p> : null}
    </Card>
  );
}
