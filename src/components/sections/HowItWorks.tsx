import { ArrowRight, FileSpreadsheet, PackageCheck, ReceiptText, SearchCheck } from "lucide-react";
import { QuoteLink } from "../QuoteLink";
import { SectionHeading } from "../SectionHeading";

const steps = [
  {
    icon: FileSpreadsheet,
    title: "Envie sua lista",
    text: "Informe os produtos, quantidades, códigos ou especificações técnicas.",
  },
  {
    icon: SearchCheck,
    title: "Analisamos sua necessidade",
    text: "Nossa equipe verifica os requisitos e busca opções de fornecimento.",
  },
  {
    icon: ReceiptText,
    title: "Receba sua cotação",
    text: "Apresentamos os valores e as condições comerciais confirmadas.",
  },
  {
    icon: PackageCheck,
    title: "Avance com seu pedido",
    text: "Após a aprovação, alinhamos os próximos passos do fornecimento.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-titulo"
      className="relative isolate overflow-hidden bg-brand-950 py-24 text-white lg:py-32"
    >
      <div aria-hidden="true" className="bg-grid-dark absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="container-site">
        <SectionHeading id="como-funciona-titulo" eyebrow="Como funciona" title="Da lista de materiais ao pedido, em quatro etapas." tone="dark" />

        <ol className="reveal relative mt-16 grid gap-10 lg:grid-cols-4 lg:gap-8">
          {/* Linha de conexão */}
          <span
            aria-hidden="true"
            className="step-line absolute top-0 bottom-0 left-6 w-px bg-gradient-to-b from-brand-400 via-brand-400/60 to-transparent lg:top-6 lg:right-[12.5%] lg:bottom-auto lg:left-6 lg:h-px lg:w-auto lg:bg-gradient-to-r"
          />
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative pl-20 lg:pl-0">
              <span className="absolute top-0 left-0 inline-flex size-12 items-center justify-center rounded-full border border-brand-400/50 bg-brand-900 font-display text-sm font-bold text-white shadow-[0_0_0_6px_var(--color-brand-950)] lg:relative">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="lg:mt-8">
                <Icon className="size-6 text-brand-300" strokeWidth={1.5} aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
                <p className="mt-3 leading-relaxed text-white/65">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="reveal mt-16 flex flex-col items-start gap-4 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-white/70">Tem a lista pronta? Envie em PDF, planilha ou foto — nossa equipe organiza a cotação.</p>
          <QuoteLink focus="attachments" className="btn btn-primary">
            Começar minha cotação
            <ArrowRight className="size-4" aria-hidden="true" />
          </QuoteLink>
        </div>
      </div>
    </section>
  );
}
