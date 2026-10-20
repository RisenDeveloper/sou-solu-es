"use client";

import type { ReactNode } from "react";

export const QUOTE_EVENT = "sou:quote";
export type QuoteIntent = { category?: string; focus?: "attachments" | "products" };

/**
 * Link para o formulário de cotação. Na página inicial, rola até o formulário e
 * pré-seleciona a categoria; nas demais páginas, navega para /?categoria=...#cotacao.
 */
export function QuoteLink({
  category,
  focus,
  className,
  children,
  onNavigate,
}: QuoteIntent & { className?: string; children: ReactNode; onNavigate?: () => void }) {
  const params = new URLSearchParams();
  if (category) params.set("categoria", category);
  if (focus === "attachments") params.set("lista", "1");
  const qs = params.toString();
  const href = `/${qs ? `?${qs}` : ""}#cotacao`;

  return (
    <a
      href={href}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        const target = document.getElementById("cotacao");
        if (!target || window.location.pathname !== "/") return;
        e.preventDefault();
        window.dispatchEvent(new CustomEvent<QuoteIntent>(QUOTE_EVENT, { detail: { category, focus } }));
        target.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        history.replaceState(null, "", "#cotacao");
      }}
    >
      {children}
    </a>
  );
}
