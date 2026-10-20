import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({
  crumbs,
  title,
  children,
}: {
  crumbs: { label: string; href?: string }[];
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 py-16 text-white lg:py-20">
      <div aria-hidden="true" className="bg-grid-dark absolute inset-0 -z-10 [mask-image:linear-gradient(to_right,black,transparent)]" />
      <div className="container-site">
        <nav aria-label="Trilha de navegação">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-white/60">
            {crumbs.map((c, i) => (
              <li key={c.label} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="size-3.5" aria-hidden="true" />}
                {c.href ? (
                  <Link href={c.href} className="hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-white/90">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight font-bold tracking-tight text-balance sm:text-5xl">
          {title}
        </h1>
        {children && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">{children}</div>}
      </div>
    </section>
  );
}
