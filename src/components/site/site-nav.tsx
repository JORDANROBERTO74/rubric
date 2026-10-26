"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { RubricMark } from "@/components/brand/mark";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const sections = [
  { id: "product", key: "product" },
  { id: "demo", key: "demo" },
  { id: "governance", key: "governance" },
  { id: "developers", key: "developers" },
] as const;

const sourceUrl = "https://github.com/JORDANROBERTO74/rubric";

export function SiteNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5"
          aria-label={t("home")}
        >
          <RubricMark className="h-5 w-5" />
          <span className="font-display text-xl leading-none">Rubric</span>
        </Link>

        <nav
          aria-label={t("primary")}
          className="hidden items-center gap-7 md:flex"
        >
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(section.key)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LocaleSwitcher />
          <a
            href={sourceUrl}
            className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("source")}
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LocaleSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("openMenu")}>
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetTitle className="font-display text-xl">Rubric</SheetTitle>
              <nav aria-label={t("primary")} className="mt-8 flex flex-col">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    onClick={() => setOpen(false)}
                    className="border-b border-border py-3 text-base"
                  >
                    {t(section.key)}
                  </a>
                ))}
                <a
                  href={sourceUrl}
                  className="py-3 font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground"
                >
                  {t("source")}
                </a>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
