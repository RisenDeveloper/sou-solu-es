import { ArrowRight, Info } from "lucide-react";
import { categories } from "@/content/categories";
import { CategoryCard } from "../CategoryCard";
import { QuoteLink } from "../QuoteLink";
import { SectionHeading } from "../SectionHeading";

export function Products() {
  return (
    <section id="produtos" aria-labelledby="produtos-titulo" className="bg-ink-50 py-24 lg:py-32">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading id="produtos-titulo" eyebrow="Produtos e categorias" title="Materiais para manter sua operação em movimento.">
            Centralize em um único canal a cotação de itens de diferentes categorias — da manutenção de rotina a
            componentes sob especificação.
          </SectionHeading>
          <QuoteLink focus="attachments" className="btn btn-dark reveal shrink-0 self-start lg:self-auto">
            Enviar lista de materiais
            <ArrowRight className="size-4" aria-hidden="true" />
          </QuoteLink>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, i) => (
            <CategoryCard key={category.slug} category={category} index={i} />
          ))}
        </div>

        <p className="reveal mt-10 flex items-start gap-3 rounded-lg border border-ink-200 bg-white px-5 py-4 text-sm leading-relaxed text-ink-500">
          <Info className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />
          As categorias indicam as linhas de fornecimento atendidas. Especificações, disponibilidade e prazo de entrega
          são confirmados pela nossa equipe comercial em cada cotação.
        </p>
      </div>
    </section>
  );
}
