import { siteConfig } from "@/config/site";

/** Retorna o link do WhatsApp comercial, ou null se o número não estiver configurado. */
export function whatsappLink(message: string = siteConfig.contact.whatsappMessage): string | null {
  const number = siteConfig.contact.whatsapp;
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const hasWhatsapp = Boolean(siteConfig.contact.whatsapp);

export function formatPhoneBR(digits: string) {
  const d = digits.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return digits;
}
