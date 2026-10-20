"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { navigation } from "@/config/site";
import { QuoteLink } from "../QuoteLink";
import { WhatsAppIcon, WhatsAppLink } from "../WhatsApp";

export function HeaderShell({ logo }: { logo: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("a,button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab" && panel) {
        const items = [...panel.querySelectorAll<HTMLElement>("a,button")];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-[box-shadow,border-color] duration-300 supports-[backdrop-filter]:bg-white/85 ${
        scrolled ? "border-ink-200 shadow-[0_8px_30px_-18px_rgb(11_13_15/0.35)]" : "border-transparent"
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <div className="container-site flex h-[88px] items-center justify-between gap-6">
        <Link href="/" aria-label="SOU Soluções Industriais — página inicial" className="shrink-0">
          {logo}
        </Link>

        <nav aria-label="Navegação principal" className="hidden lg:block">
          <ul className="flex items-center gap-0.5 xl:gap-1">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative rounded-md px-2.5 py-2 text-[0.9375rem] whitespace-nowrap xl:px-3 font-medium text-ink-700 transition-colors after:absolute after:right-3 after:bottom-1 after:left-3 after:h-0.5 after:origin-left after:scale-x-0 after:bg-brand-600 after:transition-transform after:duration-300 hover:text-ink-950 hover:after:scale-x-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <QuoteLink className="btn btn-primary hidden min-h-11 px-5 text-sm whitespace-nowrap sm:inline-flex">
            Solicitar cotação
          </QuoteLink>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-lg border border-ink-200 text-ink-900 transition-colors hover:bg-ink-50 lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
    </header>

      {/* Menu mobile — fora do <header>: o backdrop-filter dele prenderia elementos fixed */}
      <div
        className={`fixed inset-x-0 top-[88px] bottom-0 z-40 bg-ink-950/40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden="true"
      />
      <div
        id="menu-mobile"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!open}
        className="fixed inset-x-0 top-[88px] bottom-0 z-50 overflow-y-auto bg-white lg:hidden"
      >
        <nav aria-label="Navegação principal (celular)" className="container-site py-6">
          <ul className="divide-y divide-ink-100 border-y border-ink-100">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  className="flex items-center justify-between py-4 font-display text-lg font-semibold text-ink-900"
                >
                  {item.label}
                  <ArrowRight className="size-4 text-ink-400" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            <QuoteLink className="btn btn-primary w-full" onNavigate={close}>
              Solicitar cotação
            </QuoteLink>
            <WhatsAppLink className="btn btn-outline w-full" location="menu_mobile" onNavigate={close}>
              <WhatsAppIcon className="size-5 text-whatsapp" />
              Falar com um especialista
            </WhatsAppLink>
          </div>
        </nav>
      </div>
    </>
  );
}
