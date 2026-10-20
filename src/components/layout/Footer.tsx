import { Mail, MapPin, Phone } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { navigation, regionLabel, siteConfig } from "@/config/site";
import { categories } from "@/content/categories";
import { formatPhoneBR } from "@/lib/whatsapp";
import { Logo } from "../Logo";
import { QuoteLink } from "../QuoteLink";
import { WhatsAppIcon, WhatsAppLink } from "../WhatsApp";
import { SocialLinks } from "../SocialLinks";
import { ConsentSettingsButton } from "../ConsentBanner";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  const { contact, legal } = siteConfig;
  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr_1fr] lg:gap-10">
        <div>
          <Link href="/" aria-label="SOU Soluções Industriais — página inicial" className="inline-block rounded-xl bg-[#fbfbfb] p-2">
            <Logo size={96} />
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-400">
            Fornecimento de materiais, peças, componentes e equipamentos para empresas que precisam de agilidade e
            praticidade nas compras. Atendimento comercial em {regionLabel} e região.
          </p>
          <SocialLinks className="mt-6" />
        </div>

        <nav aria-label="Links do rodapé">
          <h2 className="font-display text-xs font-semibold tracking-[0.18em] text-white uppercase">Navegação</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/produtos" className="transition-colors hover:text-white">
                Todas as categorias
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-xs font-semibold tracking-[0.18em] text-white uppercase">Categorias</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/produtos/${c.slug}`} className="transition-colors hover:text-white">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-xs font-semibold tracking-[0.18em] text-white uppercase">Contato comercial</h2>
          <ul className="mt-5 space-y-4 text-sm">
            {contact.whatsapp && (
              <li>
                <WhatsAppLink location="rodape" className="flex items-start gap-3 transition-colors hover:text-white">
                  <WhatsAppIcon className="mt-0.5 size-4 shrink-0 text-whatsapp" />
                  WhatsApp {formatPhoneBR(contact.whatsapp)}
                </WhatsAppLink>
              </li>
            )}
            {contact.phone && (
              <li>
                <a href={`tel:+${contact.phone.replace(/\D/g, "")}`} className="flex items-start gap-3 transition-colors hover:text-white">
                  <Phone className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden="true" />
                  {formatPhoneBR(contact.phone)}
                </a>
              </li>
            )}
            {contact.email && (
              <li>
                <a href={`mailto:${contact.email}`} className="flex items-start gap-3 break-all transition-colors hover:text-white">
                  <Mail className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden="true" />
                  {contact.email}
                </a>
              </li>
            )}
            {contact.address && (
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden="true" />
                <address className="not-italic">{contact.address}</address>
              </li>
            )}
            <li>
              <QuoteLink className="btn btn-primary mt-2 min-h-11 px-5 text-sm">Solicitar cotação</QuoteLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-site flex flex-col gap-4 pt-6 pb-24 text-xs text-ink-400 sm:pb-6 sm:pr-40 md:flex-row md:items-center md:justify-between">
          <p>
            © <CopyrightYear /> {legal.companyName || siteConfig.name}
            {legal.cnpj && ` · CNPJ ${legal.cnpj}`}. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/politica-de-privacidade" className="transition-colors hover:text-white">
              Política de privacidade
            </Link>
            <ConsentSettingsButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
