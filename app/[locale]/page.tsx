import { setRequestLocale } from "next-intl/server";

// Placeholder sections so header navigation and scroll-spy can be checked; real sections arrive in T7–T11.
const sections = ["leistungen", "vorsorge", "team", "kontakt", "fragen"];

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="inhalt" className="wrap">
      {sections.map((id) => (
        <section key={id} id={id} className="min-h-[70vh] py-16">
          <h2 className="text-heading">{id}</h2>
        </section>
      ))}
    </main>
  );
}
