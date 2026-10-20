"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="py-28">
      <div className="container-site max-w-2xl text-center">
        <p className="eyebrow justify-center">Algo deu errado</p>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-950">Não foi possível carregar esta página</h1>
        <p className="mt-4 text-ink-500">Tente novamente em instantes. Se o problema continuar, fale com a nossa equipe.</p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={reset} className="btn btn-primary">
            Tentar novamente
          </button>
          <Link href="/" className="btn btn-outline">
            Voltar ao início
          </Link>
        </div>
      </div>
    </section>
  );
}
