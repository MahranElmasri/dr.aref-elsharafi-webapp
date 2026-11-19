import { setRequestLocale } from "next-intl/server";
import { Faq } from "@/components/home/Faq";
import { Hero } from "@/components/home/Hero";
import { CareFinder } from "@/components/home/CareFinder";
import { Reviews } from "@/components/home/Reviews";
import { Services } from "@/components/home/Services";
import { Steps } from "@/components/home/Steps";
import { Tasks } from "@/components/home/Tasks";
import { Visit } from "@/components/home/Visit";
import { Team } from "@/components/home/Team";
import { WeekStrip } from "@/components/home/WeekStrip";
import { BUILT_AT } from "@/lib/buildTime";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="inhalt">
      <Hero builtAt={BUILT_AT} />
      <WeekStrip builtAt={BUILT_AT} />
      <Tasks />
      <Services />
      <Steps />
      <CareFinder />
      <Team />
      <Reviews />
      <Faq />
      <Visit />
    </main>
  );
}
