import { getTranslations } from "next-intl/server";

type Step = { index: string; title: string; body: string };

export async function HowItWorks() {
  const t = await getTranslations("how");
  const steps = t.raw("steps") as Step[];

  return (
    <section id="how" className="scroll-mt-16 border-b border-border">
      <div className="container py-16 sm:py-24">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2 className="display mt-4 text-4xl leading-[1.02] sm:text-5xl">
          {t("title")}
        </h2>

        <ol className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {steps.map((step) => (
            <li key={step.index} className="border-t border-foreground/25 pt-6">
              <span className="font-mono text-xs text-primary">
                {step.index}
              </span>
              <h3 className="mt-3 text-xl font-medium">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
