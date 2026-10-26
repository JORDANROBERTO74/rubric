import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";

const DecisionDemo = dynamic(
  () => import("@/components/slack-demo/SlackRevenueDemo"),
  {
    ssr: false,
    loading: () => (
      <div
        className="min-h-[520px] animate-pulse rounded bg-muted"
        aria-hidden
      />
    ),
  }
);

export async function DemoSection() {
  const t = await getTranslations("demo");

  return (
    <section id="demo" className="scroll-mt-16 border-b border-border">
      <div className="container py-16 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="display mt-4 text-4xl leading-[1.02] sm:text-5xl">
              {t("title")}
            </h2>
          </div>
          <div className="max-w-xl self-end">
            <p className="text-base leading-relaxed text-muted-foreground">
              {t("lead")}
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {t("note")}
            </p>
          </div>
        </div>

        <div className="mt-10 border border-foreground/15 bg-card">
          <DecisionDemo />
        </div>
      </div>
    </section>
  );
}
