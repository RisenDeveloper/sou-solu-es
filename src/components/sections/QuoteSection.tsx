import { FileCheck2, Hash, ListChecks, ShieldCheck } from "lucide-react";
import { siteConfig } from "@/config/site";
import { formatPhoneBR } from "@/lib/whatsapp";
import { QuoteForm } from "../quote/QuoteForm";
import { WhatsAppIcon, WhatsAppLink } from "../WhatsApp";

const tips = [
  { icon: ListChecks, text: "Liste os itens e as quantidades — um por linha facilita a análise." },
  { icon: Hash, text: "Inclua códigos, marcas ou normas sempre que possível." },
  { icon: FileCheck2, text: "Anexe planilhas, PDFs ou fotos das peças e plaquetas." },
];

export function QuoteSection() {
  const { whatsapp } = siteConfig.contact;
  return (
    <section id="cotacao" aria-labelledby="cotacao-titulo" className="relative scroll-mt-20 bg-ink-50 py-24 lg:py-32">
      <div className="container-site">
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-[0_40px_80px_-48px_rgb(11_35_87/0.45)] lg:grid lg:grid-cols-[0.85fr_1.6fr]">
          <aside className="relative isolate overflow-hidden bg-brand-950 p-8 text-white sm:p-10 lg:p-12">
            <div aria-hidden="true" className="bg-grid-dark absolute inset-0 -z-10" />
            <div aria-hidden="true" className="absolute -top-32 -right-32 -z-10 size-80 rounded-full bg-brand-600/30 blur-3xl" />
            <p className="eyebrow text-brand-300">Cotação rápida</p>
            <h2 id="cotacao-titulo" className="mt-4 font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
              Solicite sua cotação
            </h2>
            <p className="mt-4 leading-relaxed text-white/70">
              Preencha os dados e envie sua necessidade. Nossa equipe comercial analisa os itens e retorna com as
              condições confirmadas.
            </p>

            <ul className="mt-10 space-y-5">
              {tips.map(({ icon: Icon, text }) => (
                <li key={text} className="flex gap-3 text-sm leading-relaxed text-white/80">
                  <Icon className="mt-0.5 size-5 shrink-0 text-brand-300" strokeWidth={1.6} aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="flex items-start gap-3 text-sm text-white/70">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-brand-300" strokeWidth={1.6} aria-hidden="true" />
                Seus dados são usados apenas para responder à sua solicitação.
              </p>
              {whatsapp && (
                <WhatsAppLink
                  location="secao_cotacao"
                  className="mt-6 flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-whatsapp">
                    <WhatsAppIcon className="size-5" />
                  </span>
                  <span>
                    <span className="block text-xs text-white/60">Prefere conversar?</span>
                    <span className="block font-display font-semibold">{formatPhoneBR(whatsapp)}</span>
                  </span>
                </WhatsAppLink>
              )}
            </div>
          </aside>

          <div className="relative">
            <QuoteForm />
          </div>
        </div>
      </div>
    </section>
  );
}
