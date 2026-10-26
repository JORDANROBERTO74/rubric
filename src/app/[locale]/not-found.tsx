import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const locale = await getLocale();

  return (
    <main
      id="main"
      className="container flex min-h-[60vh] flex-col items-start justify-center py-24"
    >
      <p className="eyebrow">404</p>
      <h1 className="display mt-4 text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-md text-muted-foreground">{t("body")}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 border border-foreground/20 px-5 py-2.5 text-sm transition-colors hover:border-foreground"
      >
        {t("back")}
      </Link>
    </main>
  );
}
