import { ArrowRight, Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { regionLabel, siteConfig } from "@/config/site";
import { formatPhoneBR } from "@/lib/whatsapp";
import { QuoteLink } from "../QuoteLink";
import { SectionHeading } from "../SectionHeading";
import { WhatsAppIcon, WhatsAppLink } from "../WhatsApp";

function Channel({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="reveal flex h-full flex-col rounded-xl border border-ink-200 bg-white p-6 transition-colors hover:border-ink-300">
      {icon}
      <p className="mt-5 font-display text-xs font-semibold tracking-[0.16em] text-ink-400 uppercase">{title}</p>
      <div className="mt-2 text-ink-900">{children}</div>
    </div>
  );
}

const iconBox = (Icon: LucideIcon) => (
  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
    <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
  </span>
);

export function Contact() {
  const { whatsapp, phone, email, address, businessHours } = siteConfig.contact;
  return (
    <section id="contato" aria-labelledby="contato-titulo" className="py-24 lg:py-28">
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:gap-16">
        <SectionHeading id="contato-titulo" eyebrow="Contato" title="Fale com a equipe comercial.">
          Escolha o canal mais prático para você. Atendimento a empresas de {regionLabel} e região.
        </SectionHeading>

        <div className="grid gap-5 sm:grid-cols-2">
          {whatsapp && (
            <Channel
              title="WhatsApp comercial"
              icon={
                <span className="inline-flex size-11 items-center justify-center rounded-lg bg-whatsapp/10 text-whatsapp">
                  <WhatsAppIcon className="size-5" />
                </span>
              }
            >
              <WhatsAppLink location="secao_contato" className="group inline-flex items-center gap-2 font-display text-lg font-semibold hover:text-brand-700">
                {formatPhoneBR(whatsapp)}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </WhatsAppLink>
            </Channel>
          )}
          {phone && (
            <Channel title="Telefone" icon={iconBox(Phone)}>
              <a href={`tel:+${phone.replace(/\D/g, "")}`} className="font-display text-lg font-semibold hover:text-brand-700">
                {formatPhoneBR(phone)}
              </a>
            </Channel>
          )}
          {email && (
            <Channel title="E-mail" icon={iconBox(Mail)}>
              <a href={`mailto:${email}`} className="font-display font-semibold break-all hover:text-brand-700">
                {email}
              </a>
            </Channel>
          )}
          {address && (
            <Channel title="Endereço" icon={iconBox(MapPin)}>
              <address className="not-italic">{address}</address>
            </Channel>
          )}
          {businessHours && (
            <Channel title="Horário" icon={iconBox(Clock)}>
              {businessHours}
            </Channel>
          )}
          <div className="reveal flex h-full flex-col justify-between rounded-xl bg-ink-950 p-6 text-white">
            <p className="font-display text-lg leading-snug font-bold">Tem uma lista de materiais pronta?</p>
            <QuoteLink focus="attachments" className="btn btn-primary mt-6 min-h-11 text-sm">
              Enviar lista para cotação
            </QuoteLink>
          </div>
        </div>
      </div>
    </section>
  );
}
