import { Building2, Factory, Handshake, HardHat, Layers, ShoppingCart, Timer, Wrench, type LucideIcon } from "lucide-react";
import { SectionHeading } from "../SectionHeading";

const reasons: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Timer,
    title: "Agilidade nas cotações",
    text: "Facilite suas compras com um canal comercial preparado para receber suas necessidades.",
  },
  {
    icon: Layers,
    title: "Fornecimento de múltiplas categorias",
    text: "Centralize solicitações de diferentes materiais industriais em um único contato.",
  },
  {
    icon: Building2,
    title: "Atendimento empresarial",
    text: "Atendimento direcionado às necessidades de compras, manutenção, produção e suprimentos.",
  },
  {
    icon: Handshake,
    title: "Parceria comercial",
    text: "Buscamos alternativas de fornecimento adequadas às especificações e necessidades de cada empresa.",
  },
];

const audiences: { icon: LucideIcon; label: string }[] = [
  { icon: Factory, label: "Indústrias" },
  { icon: Wrench, label: "Empresas de manutenção" },
  { icon: HardHat, label: "Oficinas industriais" },
  { icon: Building2, label: "Construtoras" },
  { icon: ShoppingCart, label: "Compras e suprimentos" },
];

export function WhyUs() {
  return (
    <section id="solucoes" aria-labelledby="solucoes-titulo" className="py-24 lg:py-32">
      <div className="container-site">
        <SectionHeading id="solucoes-titulo" eyebrow="Soluções" title="Por que escolher a SOU?">
          Um parceiro comercial para simplificar a busca por materiais industriais, do pedido pontual à compra
          recorrente.
        </SectionHeading>

        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-ink-200 bg-ink-200 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className="reveal group relative bg-white p-8 transition-colors hover:bg-brand-50/40"
              style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
            >
              <span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-600 transition-transform duration-500 group-hover:scale-x-100" />
              <span className="inline-flex size-12 items-center justify-center rounded-lg border border-brand-100 bg-brand-50 text-brand-700">
                <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-display text-lg font-bold text-ink-950">{title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-500">{text}</p>
            </div>
          ))}
        </div>

        <div className="reveal mt-12 flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
          <p className="shrink-0 font-display text-sm font-semibold text-ink-900">Atendimento para:</p>
          <ul className="flex flex-wrap gap-2.5">
            {audiences.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm text-ink-700"
              >
                <Icon className="size-4 text-brand-600" strokeWidth={1.6} aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
