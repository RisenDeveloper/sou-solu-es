import type { Metadata } from "next";
import { CategoryCard } from "@/components/CategoryCard";
import { PageHeader } from "@/components/PageHeader";
import { QuoteLink } from "@/components/QuoteLink";
import { regionLabel } from "@/config/site";
import { categories } from "@/content/categories";

export const metadata: Metadata = {
  title: "Produtos e categorias industriais",
  description: `Rolamentos, flanges, válvulas, fixadores, tubos, pneumática, materiais elétricos e mais. Solicite a cotação de materiais industriais com a SOU Soluções Industriais — ${regionLabel}.`,
  alternates: { canonical: "/produtos" },
};

export default function ProdutosPage() {
  return (
    <>
      <PageHeader crumbs={[{ label: "Início", href: "/" }, { label: "Produtos" }]} title="Produtos e categorias industriais">
        Linhas de fornecimento para indústrias, manutenção, oficinas, construtoras e departamentos de compras. Envie sua
        necessidade e receba uma cotação.
      </PageHeader>
      <section className="bg-ink-50 py-16 lg:py-24">
        <div className="container-site">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <CategoryCard key={c.slug} category={c} index={i} />
            ))}
          </div>
          <div className="mt-14 flex flex-col items-start gap-5 rounded-2xl border border-ink-200 bg-white p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-ink-950">Não encontrou o que procura?</h2>
              <p className="mt-2 text-ink-500">Envie a descrição ou o código do item. Nossa equipe verifica as opções de fornecimento.</p>
            </div>
            <QuoteLink className="btn btn-primary shrink-0">Solicitar cotação</QuoteLink>
          </div>
        </div>
      </section>
    </>
  );
}
