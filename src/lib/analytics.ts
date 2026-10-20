/**
 * Eventos de conversão. São enviados ao dataLayer do Google Tag Manager somente
 * quando o GTM está configurado E o visitante aceitou cookies de medição.
 * Nenhum dado pessoal (nome, e-mail, telefone) é enviado nos eventos.
 */

export type ConversionEvent =
  | "quote_submit"
  | "material_list_submit"
  | "whatsapp_click"
  | "contact_request";

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

export const CONSENT_KEY = "sou-consent-v1";

export function hasAnalyticsConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY) === "granted";
  } catch {
    return false;
  }
}

export function trackConversion(event: ConversionEvent, params: Record<string, string | number | boolean> = {}) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...params });
}
