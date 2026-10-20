import Link from "next/link";
import { QuoteLink } from "@/components/QuoteLink";

export default function NotFound() {
  return (
    <section className="bg-grid py-28">
      <div className="container-site max-w-2xl text-center">
        <p className="eyebrow justify-center">Erro 404</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink-950">Página não encontrada</h1>
        <p className="mt-4 text-lg text-ink-500">O endereço pode ter mudado. Volte ao início ou envie sua solicitação de cotação.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-outline">
            Voltar ao início
          </Link>
          <QuoteLink className="btn btn-primary">Solicitar cotação</QuoteLink>
        </div>
      </div>
    </section>
  );
}
