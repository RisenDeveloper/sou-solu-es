"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { CONSENT_KEY } from "@/lib/analytics";

const GTM_ID = siteConfig.integrations.gtmId;
const OPEN_EVENT = "sou:consent-open";

function loadGtm() {
  if (!GTM_ID || document.getElementById("gtm-script")) return;
  const w = window as Window & { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const s = document.createElement("script");
  s.id = "gtm-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`;
  document.head.appendChild(s);
}

function readConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

function writeConsent(value: "granted" | "denied") {
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* navegação privada */
  }
}

/**
 * Banner de cookies (LGPD). Só aparece quando há uma ferramenta de medição configurada
 * (NEXT_PUBLIC_GTM_ID). Nenhum script de rastreamento é carregado sem consentimento.
 */
export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!GTM_ID) return;
    const current = readConsent();
    if (current === "granted") loadGtm();
    // Sincroniza com o armazenamento do navegador após a hidratação.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    else if (current === null) setVisible(true);
    const open = () => setVisible(true);
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  if (!GTM_ID || !visible) return null;

  const choose = (value: "granted" | "denied") => {
    writeConsent(value);
    setVisible(false);
    if (value === "granted") loadGtm();
    else if (document.getElementById("gtm-script")) window.location.reload();
  };

  return (
    <div
      role="region"
      aria-label="Preferências de cookies"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-3xl rounded-xl border border-ink-200 bg-white p-5 shadow-[0_20px_50px_-20px_rgb(0_0_0/0.35)] sm:inset-x-6 sm:bottom-6"
    >
      <p className="text-sm leading-relaxed text-ink-700">
        Utilizamos cookies de medição para entender como o site é usado e melhorar o atendimento. Eles só são ativados
        com a sua autorização. Saiba mais na{" "}
        <Link href="/politica-de-privacidade" className="font-semibold text-brand-700 underline underline-offset-2">
          Política de Privacidade
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button type="button" className="btn btn-outline min-h-11 text-sm" onClick={() => choose("denied")}>
          Recusar
        </button>
        <button type="button" className="btn btn-primary min-h-11 text-sm" onClick={() => choose("granted")}>
          Aceitar medição
        </button>
      </div>
    </div>
  );
}

export function ConsentSettingsButton() {
  if (!GTM_ID) return null;
  return (
    <button
      type="button"
      className="transition-colors hover:text-white"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
    >
      Preferências de cookies
    </button>
  );
}
