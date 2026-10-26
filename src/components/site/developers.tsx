import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

const sample = `const decision = await rubric.decisions.create({
  subject: "account:acme",
  question: "Is this account at risk?",
  evidence: ["support", "usage", "billing", "crm"],
  policy: "retention.v3",
});

decision.risk;       // { level: "high", confidence: 0.82 }
await decision.requestApproval({ role: "cs_lead" });
await decision.execute({ action: "notify_owner" });`;

export async function Developers() {
  const t = await getTranslations("developers");
  const points = t.raw("points") as string[];

  return (
    <section id="developers" className="scroll-mt-16 border-b border-border">
      <div className="container grid gap-12 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h2 className="display mt-4 max-w-lg text-4xl leading-[1.02] sm:text-5xl">
            {t("title")}
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            {t("lead")}
          </p>
          <ul className="mt-8 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex gap-3 text-sm">
                <span className="mt-2 h-px w-4 shrink-0 bg-primary" />
                <span className="text-muted-foreground">{point}</span>
              </li>
            ))}
          </ul>
          <a
            href="https://github.com/JORDANROBERTO74/rubric"
            className="mt-9 inline-flex items-center gap-1.5 text-sm font-medium underline decoration-primary decoration-2 underline-offset-4"
          >
            {t("docs")}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>

        <figure className="min-w-0 self-start">
          <div className="overflow-hidden rounded border border-foreground/15 bg-foreground">
            <div className="flex items-center justify-between border-b border-background/15 px-4 py-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-background/50">
                decisions.ts
              </span>
              <span className="flex gap-1.5" aria-hidden>
                <span className="h-2 w-2 rounded-full bg-background/20" />
                <span className="h-2 w-2 rounded-full bg-background/20" />
                <span className="h-2 w-2 rounded-full bg-primary" />
              </span>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-[12px] leading-relaxed text-background/85">
              <code>{sample}</code>
            </pre>
          </div>
          <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            {t("caption")}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
