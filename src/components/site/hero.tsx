import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

const sourceUrl = "https://github.com/JORDANROBERTO74/rubric";

export async function Hero() {
  const t = await getTranslations("hero");

  const rows = [
    ["account", "accountValue"],
    ["signal", "signalValue"],
    ["risk", "riskValue"],
    ["confidence", "confidenceValue"],
    ["gate", "gateValue"],
  ] as const;

  return (
    <section className="border-b border-border">
      <div className="container grid gap-14 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div className="max-w-2xl">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1 className="display mt-6 whitespace-pre-line text-[2.9rem] leading-[0.95] sm:text-6xl lg:text-[4.75rem]">
            {t("title")}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {t("lead")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#demo"
              className="group inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground"
            >
              {t("primary")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href={sourceUrl}
              className="inline-flex items-center gap-2 border border-foreground/20 px-6 py-3 text-sm font-medium transition-colors hover:border-foreground"
            >
              {t("secondary")}
            </a>
          </div>
          <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {t("note")}
          </p>
        </div>

        <div className="self-start border border-foreground/15 bg-card">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <span className="eyebrow">{t("record.label")}</span>
            <span className="font-mono text-[11px] text-muted-foreground">
              dec_01J8QK
            </span>
          </div>
          <dl className="divide-y divide-border">
            {rows.map(([label, value]) => (
              <div
                key={label}
                className="grid grid-cols-[7.5rem_1fr] gap-4 px-5 py-3.5"
              >
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                  {t(`record.${label}`)}
                </dt>
                <dd className="text-sm leading-snug">
                  {t(`record.${value}`)}
                </dd>
              </div>
            ))}
          </dl>
          <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
            <span className="flex items-center gap-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-approval" />
              {t("record.statusValue")}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {t("record.status")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
