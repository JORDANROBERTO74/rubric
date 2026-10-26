import { unstable_setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/site/hero";
import { DemoSection } from "@/components/site/demo-section";
import { Product } from "@/components/site/product";
import { HowItWorks } from "@/components/site/how-it-works";
import { Governance } from "@/components/site/governance";
import { Developers } from "@/components/site/developers";
import { CallToAction } from "@/components/site/call-to-action";
import { SiteFooter } from "@/components/site/site-footer";

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  return (
    <>
      <main id="main">
        <Hero />
        <DemoSection />
        <Product />
        <HowItWorks />
        <Governance />
        <Developers />
        <CallToAction />
      </main>
      <SiteFooter />
    </>
  );
}
