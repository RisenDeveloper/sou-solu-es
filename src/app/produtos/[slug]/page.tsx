import { ArrowRight, Check, Info } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryCard } from "@/components/CategoryCard";
import { PageHeader } from "@/components/PageHeader";
import { QuoteLink } from "@/components/QuoteLink";
import { WhatsAppIcon, WhatsAppLink } from "@/components/WhatsApp";
import { regionLabel, siteConfig } from "@/config/site";
import { categories, getCategory } from "@/content/categories";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/produtos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return {
    title: `${category.seoTitle} — cotação em ${regionLabel}`,
    description: `${category.description.slice(0, 150)}`,
    alternates: { canonical: `/produtos/${category.slug}` },
    openGraph: { images: [{ url: `${category.image}?w=1200&h=630&fit=crop&q=75`, width: 1200, height: 630 }] },
  };
}

export default async function CategoryPage({ params }: PageProps<"/produtos/[slug]">) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const related = categories.filter((c) => c.slug !== category.slug).slice(0, 3);
  const message = `Olá! Conheci a SOU Soluções Industriais pelo site e gostaria de solicitar uma cotação de ${category.title.toLowerCase()} para minha empresa.`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: siteConfig.url },
      { "@type": "ListItem", position: 2, name: "Produtos", item: `${siteConfig.url}/produtos` },
      { "@type": "ListItem", position: 3, name: category.title, item: `${siteConfig.url}/produtos/${category.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd).replace(/</g, "\\u003c") }} />
      <PageHeader
        crumbs={[{ label: "Início", href: "/" }, { label: "Produtos", href: "/produtos" }, { label: category.title }]}
        title={category.title}
      >
        {category.summary}
      </PageHeader>

      <section className="py-16 lg:py-24">
        <div className="container-site grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <p className="text-lg leading-relaxed text-ink-600">{category.description}</p>

            <h2 className="mt-12 font-display text-xl font-bold text-ink-950">Exemplos de itens para cotação</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {category.examples.map((ex) => (
                <li key={ex} className="flex items-start gap-3 rounded-lg border border-ink-200 px-4 py-3 text-ink-700">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand-600" strokeWidth={2.5} aria-hidden="true" />
                  {ex}
                </li>
              ))}
            </ul>

            <p className="mt-8 flex items-start gap-3 rounded-lg bg-ink-50 px-5 py-4 text-sm leading-relaxed text-ink-500">
              <Info className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden="true" />
              Itens sob consulta. Especificações, disponibilidade e prazo de entrega são confirmados pela equipe comercial
              em cada cotação.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <QuoteLink category={category.slug} className="btn btn-primary">
                Solicitar cotação
                <ArrowRight className="size-4" aria-hidden="true" />
              </QuoteLink>
              <WhatsAppLink message={message} location={`categoria_${category.slug}`} className="btn btn-outline">
                <WhatsAppIcon className="size-5 text-whatsapp" />
                Falar pelo WhatsApp
              </WhatsAppLink>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-100 lg:sticky lg:top-28 lg:aspect-[4/5] lg:self-start">
            <Image src={category.image} alt={category.imageAlt} fill priority sizes="(min-width: 1024px) 500px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-ink-50 py-16 lg:py-24">
        <div className="container-site">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-2xl font-bold text-ink-950 sm:text-3xl">Outras categorias</h2>
            <Link href="/produtos" className="hidden items-center gap-2 font-display text-sm font-semibold text-brand-700 hover:text-brand-900 sm:inline-flex">
              Ver todas <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CategoryCard key={c.slug} category={c} index={categories.indexOf(c)} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
