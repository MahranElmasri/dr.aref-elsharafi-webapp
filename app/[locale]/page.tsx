import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { WeekStrip } from "@/components/home/WeekStrip";
import { BUILT_AT } from "@/lib/buildTime";

// Placeholder sections so header navigation can be checked; real sections arrive in T8–T11.
const sections = ["leistungen", "vorsorge", "team", "kontakt", "fragen"];

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="inhalt">
      <Hero builtAt={BUILT_AT} />
      <WeekStrip builtAt={BUILT_AT} />
      <div className="wrap">
        {sections.map((id) => (
          <section key={id} id={id} className="min-h-[50vh] py-16">
            <h2 className="text-heading">{id}</h2>
          </section>
        ))}
      </div>
    </main>
  );
}
