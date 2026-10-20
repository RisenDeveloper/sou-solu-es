"use client";

import type { ReactNode } from "react";
import { trackConversion } from "@/lib/analytics";
import { whatsappLink } from "@/lib/whatsapp";
import { QuoteLink } from "./QuoteLink";

export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.09 3.2 5.07 4.48.71.31 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35M12.05 21.5h-.01a9.4 9.4 0 0 1-4.8-1.31l-.34-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.43 9.44-9.43 2.52 0 4.89.98 6.67 2.77a9.37 9.37 0 0 1 2.76 6.67c0 5.2-4.24 9.43-9.44 9.43M20.08 4.0A11.27 11.27 0 0 0 12.05.67C5.8.67.7 5.75.7 12c0 2 .52 3.95 1.52 5.67L.6 23.33l5.8-1.52a11.3 11.3 0 0 0 5.64 1.44h.01c6.26 0 11.35-5.09 11.35-11.34 0-3.03-1.18-5.88-3.32-8.02" />
    </svg>
  );
}

/**
 * Abre o WhatsApp comercial. Se o número ainda não foi configurado,
 * o link leva ao formulário de cotação — nunca fica sem ação.
 */
export function WhatsAppLink({
  className,
  children,
  message,
  location,
  onNavigate,
}: {
  className?: string;
  children: ReactNode;
  message?: string;
  location: string;
  onNavigate?: () => void;
}) {
  const href = whatsappLink(message);
  if (!href)
    return (
      <QuoteLink className={className} onNavigate={onNavigate}>
        {children}
      </QuoteLink>
    );
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => {
        trackConversion("whatsapp_click", { location });
        onNavigate?.();
      }}
    >
      {children}
    </a>
  );
}

export function WhatsAppFloat() {
  const href = whatsappLink();
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a equipe comercial pelo WhatsApp (abre em nova aba)"
      onClick={() => trackConversion("whatsapp_click", { location: "botao_flutuante" })}
      className="group fixed right-4 bottom-4 z-40 flex items-center gap-2 rounded-full bg-whatsapp p-3.5 text-white shadow-[0_10px_30px_-8px_rgb(0_0_0/0.45)] transition-transform duration-200 hover:-translate-y-0.5 sm:right-6 sm:bottom-6 sm:pr-5"
    >
      <WhatsAppIcon className="size-6" />
      <span className="hidden font-display text-sm font-semibold sm:inline">WhatsApp</span>
    </a>
  );
}
