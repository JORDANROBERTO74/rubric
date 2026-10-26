import { getTranslations } from "next-intl/server";

type Item = { index: string; title: string; body: string };

export async function Product() {
  const t = await getTranslations("product");
  const items = t.raw("items") as Item[];

  return (
    <section id="product" className="scroll-mt-16 border-b border-border">
      <div className="container py-16 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="eyebrow">{t("eyebrow")}</p>
            <h2 className="display mt-4 max-w-md text-4xl leading-[1.02] sm:text-5xl">
              {t("title")}
            </h2>
          </div>
          <p className="max-w-xl self-end text-base leading-relaxed text-muted-foreground">
            {t("lead")}
          </p>
        </div>

        <dl className="mt-14 divide-y divide-border border-y border-border">
          {items.map((item) => (
            <div
              key={item.index}
              className="grid gap-3 py-7 md:grid-cols-[5rem_16rem_1fr] md:gap-8"
            >
              <dt className="font-mono text-xs text-primary">{item.index}</dt>
              <dd className="text-lg font-medium">{item.title}</dd>
              <dd className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
