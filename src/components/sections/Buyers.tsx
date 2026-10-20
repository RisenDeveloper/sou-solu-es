import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { images } from "@/content/categories";
import { QuoteLink } from "../QuoteLink";

const points = [
  "Solicitações de diferentes categorias em um só canal.",
  "Envio de listas de materiais em PDF, planilha ou imagem.",
  "Identificação por código, fabricante ou especificação.",
  "Possibilidade de avaliar alternativas de fornecimento.",
  "Canal direto com o atendimento comercial.",
];

export function Buyers() {
  return (
    <section aria-labelledby="compradores-titulo" className="py-24 lg:py-32">
      <div className="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="reveal relative order-2 lg:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ink-100 sm:aspect-[5/4] lg:aspect-[4/5]">
            <Image
              src={images.buyers}
              alt="Armazém com estantes de materiais organizados"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -right-3 -bottom-6 max-w-[17rem] rounded-xl border border-ink-200 bg-white p-5 shadow-[0_24px_48px_-24px_rgb(11_35_87/0.4)] sm:-right-6">
            <p className="font-display text-xs font-semibold tracking-[0.16em] text-brand-600 uppercase">Para equipes de</p>
            <p className="mt-2 font-display text-base leading-snug font-bold text-ink-950">
              Compras, manutenção e suprimentos
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="reveal eyebrow">Compradores e suprimentos</p>
          <h2
            id="compradores-titulo"
            className="reveal mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance text-ink-950 sm:text-4xl lg:text-[2.75rem]"
          >
            Sua próxima cotação industrial começa aqui.
          </h2>
          <p className="reveal mt-5 text-lg leading-relaxed text-ink-500">
            Menos tempo procurando fornecedores, mais tempo cuidando da operação. Reúna seus itens em uma única
            solicitação e acompanhe com um contato comercial direto.
          </p>
          <ul className="mt-8 space-y-4">
            {points.map((p, i) => (
              <li key={p} className="reveal flex items-start gap-3" style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
                <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
                  <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-ink-700">{p}</span>
              </li>
            ))}
          </ul>
          <QuoteLink focus="attachments" className="reveal btn btn-primary mt-10">
            Enviar lista para cotação
            <ArrowRight className="size-4" aria-hidden="true" />
          </QuoteLink>
        </div>
      </div>
    </section>
  );
}
