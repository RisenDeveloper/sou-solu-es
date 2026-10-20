import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/content/categories";
import { QuoteLink } from "./QuoteLink";

export function CategoryCard({ category, index }: { category: Category; index: number }) {
  return (
    <article
      className="reveal group flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-ink-300 hover:shadow-[0_24px_48px_-28px_rgb(11_35_87/0.45)]"
      style={{ ["--reveal-delay" as string]: `${(index % 3) * 70}ms` }}
    >
      <Link href={`/produtos/${category.slug}`} className="relative block aspect-[16/10] overflow-hidden bg-ink-100" tabIndex={-1} aria-hidden="true">
        <Image
          src={category.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute top-3 left-3 rounded-md bg-white/90 px-2 py-1 font-display text-xs font-bold text-brand-800 backdrop-blur">
          {String(index + 1).padStart(2, "0")}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg leading-snug font-bold text-ink-950">
          <Link href={`/produtos/${category.slug}`} className="inline-flex items-start gap-1 hover:text-brand-700">
            {category.title}
            <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-ink-400 transition-colors group-hover:text-brand-600" aria-hidden="true" />
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-ink-500">{category.summary}</p>
        <QuoteLink
          category={category.slug}
          className="mt-5 inline-flex items-center gap-2 self-start font-display text-sm font-semibold text-brand-700 transition-colors hover:text-brand-900"
        >
          Solicitar cotação
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </QuoteLink>
      </div>
    </article>
  );
}
