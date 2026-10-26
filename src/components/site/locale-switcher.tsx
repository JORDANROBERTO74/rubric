"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

const labels: Record<Locale, string> = { en: "EN", es: "ES" };

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 font-mono text-[11px] tracking-[0.12em]">
      {locales.map((item) => {
        const rest = pathname.replace(/^\/(en|es)(?=\/|$)/, "");
        return (
          <Link
            key={item}
            href={`/${item}${rest}`}
            hrefLang={item}
            aria-current={item === locale ? "true" : undefined}
            className={cn(
              "rounded px-1.5 py-1 transition-colors",
              item === locale
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {labels[item]}
          </Link>
        );
      })}
    </div>
  );
}
