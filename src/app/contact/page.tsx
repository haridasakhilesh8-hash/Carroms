import { SectionTitle } from "@/components/section-title";
import { Card } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Contact"
        title="Talk to the organizing team"
        description="A future production version can route this into a CRM or support inbox. For the MVP, the page is positioned as a public support surface."
      />
      <Card className="mt-8">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-[var(--color-mist)]">Email</p>
            <p className="mt-2 text-lg text-white">hello@carrommatchbook.app</p>
          </div>
          <div>
            <p className="text-sm text-[var(--color-mist)]">Phone</p>
            <p className="mt-2 text-lg text-white">+91 90000 00000</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
