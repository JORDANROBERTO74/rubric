import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

const sourceUrl = "https://github.com/JORDANROBERTO74/rubric";

export async function CallToAction() {
  const t = await getTranslations("cta");

  return (
    <section className="border-b border-border bg-foreground text-background">
      <div className="container grid gap-8 py-16 sm:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div>
          <h2 className="display max-w-xl text-4xl leading-[1.02] sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-background/65">
            {t("lead")}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 lg:justify-end">
          <a
            href={sourceUrl}
            className="group inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            {t("primary")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 border border-background/25 px-6 py-3 text-sm font-medium transition-colors hover:border-background"
          >
            {t("secondary")}
          </a>
        </div>
      </div>
    </section>
  );
}
