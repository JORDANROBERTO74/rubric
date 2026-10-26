import { getTranslations } from "next-intl/server";

type Item = { title: string; body: string };

export async function Governance() {
  const t = await getTranslations("governance");
  const items = t.raw("items") as Item[];

  return (
    <section
      id="governance"
      className="scroll-mt-16 border-b border-border bg-foreground text-background"
    >
      <div className="container py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-background/50">
              {t("eyebrow")}
            </p>
            <h2 className="display mt-4 text-4xl leading-[1.02] sm:text-5xl">
              {t("title")}
            </h2>
          </div>
          <p className="max-w-xl self-end text-base leading-relaxed text-background/65">
            {t("lead")}
          </p>
        </div>

        <div className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="border-t border-background/20 pt-6">
              <h3 className="text-lg font-medium">{item.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-background/60">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
