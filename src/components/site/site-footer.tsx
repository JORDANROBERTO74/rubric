import { getTranslations } from "next-intl/server";
import { RubricMark } from "@/components/brand/mark";

const sourceUrl = "https://github.com/JORDANROBERTO74/rubric";
const licenseUrl = "https://github.com/JORDANROBERTO74/rubric/blob/main/LICENSE";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer>
      <div className="container grid gap-8 py-12 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className=" max-w-md">
          <div className="flex items-center gap-2.5">
            <RubricMark className="h-5 w-5" />
            <span className="font-display text-xl leading-none">Rubric</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {t("tagline")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          <a href={sourceUrl} className="transition-colors hover:text-foreground">
            {t("source")}
          </a>
          <a
            href={licenseUrl}
            className="transition-colors hover:text-foreground"
          >
            {t("license")}
          </a>
          <span>{t("rights")}</span>
        </div>
      </div>
    </footer>
  );
}
