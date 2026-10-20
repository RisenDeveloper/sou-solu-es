import { Compass, Target, Users } from "lucide-react";
import Image from "next/image";
import { images } from "@/content/categories";

const pillars = [
  { icon: Target, title: "Foco na necessidade", text: "Entender o que sua operação precisa antes de propor." },
  { icon: Compass, title: "Busca orientada", text: "Opções de fornecimento alinhadas às especificações." },
  { icon: Users, title: "Relacionamento", text: "Contato próximo do pedido ao alinhamento da entrega." },
];

export function About() {
  return (
    <section id="sobre" aria-labelledby="sobre-titulo" className="relative isolate overflow-hidden bg-ink-50 py-24 lg:py-32">
      <div aria-hidden="true" className="bg-grid absolute inset-0 -z-10 [mask-image:linear-gradient(to_left,black,transparent_60%)]" />
      <div className="container-site grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div>
          <p className="reveal eyebrow">Sobre nós</p>
          <h2
            id="sobre-titulo"
            className="reveal mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance text-ink-950 sm:text-4xl lg:text-[2.75rem]"
          >
            Mais do que fornecer materiais, conectamos sua indústria às soluções certas.
          </h2>
          <p className="reveal mt-6 text-lg leading-relaxed text-ink-600">
            A SOU Soluções Industriais atua no fornecimento de materiais, peças, componentes e equipamentos para
            empresas que precisam de agilidade e praticidade em seus processos de compra. Nosso objetivo é compreender
            cada necessidade e facilitar a busca por soluções adequadas para as operações dos nossos clientes.
          </p>

          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {pillars.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="reveal border-t-2 border-ink-900 pt-5" style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
                <Icon className="size-5 text-brand-600" strokeWidth={1.6} aria-hidden="true" />
                <h3 className="mt-3 font-display text-base font-bold text-ink-950">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">{text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink-200 lg:aspect-[4/5]">
          <Image
            src={images.about}
            alt="Estrutura metálica industrial em aço azul"
            fill
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-950/50 to-transparent" />
        </div>
      </div>
    </section>
  );
}
