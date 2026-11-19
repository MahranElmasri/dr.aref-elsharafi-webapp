import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("common");
  return (
    <main id="inhalt" className="wrap py-16">
      <h1 className="text-heading">{t("notFound")}</h1>
      <p className="mt-6"><Link className="btn btn-primary" href="/">{t("backHome")}</Link></p>
    </main>
  );
}
