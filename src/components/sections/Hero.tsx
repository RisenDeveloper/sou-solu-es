import { ArrowRight, Boxes, ClipboardList, Headset } from "lucide-react";
import Image from "next/image";
import { images } from "@/content/categories";
import { hasLogoFile, Logo } from "../Logo";
import { QuoteLink } from "../QuoteLink";
import { WhatsAppIcon, WhatsAppLink } from "../WhatsApp";

const highlights = [
  { icon: ClipboardList, text: "Cotação por lista, código ou especificação" },
  { icon: Boxes, text: "Diversas categorias em um só contato" },
  { icon: Headset, text: "Atendimento comercial direto" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 text-white">
      <Image
        src={images.hero}
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-zoom -z-20 object-cover object-center"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(6_22_54/0.96)_0%,rgb(6_22_54/0.88)_38%,rgb(6_22_54/0.55)_70%,rgb(6_22_54/0.35)_100%)]"
      />
      <div aria-hidden="true" className="bg-grid-dark absolute inset-0 -z-10 [mask-image:linear-gradient(to_right,black,transparent_65%)]" />

      <div className="container-site flex min-h-[calc(100svh-88px)] flex-col justify-center py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
        <div className="max-w-3xl">
          <p className="hero-in eyebrow text-brand-300" style={{ ["--d" as string]: "0ms" }}>
            Fornecimento industrial B2B
          </p>
          <h1
            className="hero-in mt-6 font-display text-[2.5rem] leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl lg:text-[4.25rem]"
            style={{ ["--d" as string]: "80ms" }}
          >
            Tudo o que sua indústria precisa.{" "}
            <span className="text-brand-300">Em um só lugar.</span>
          </h1>
          <p
            className="hero-in mt-6 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl"
            style={{ ["--d" as string]: "160ms" }}
          >
            A SOU Soluções Industriais conecta sua empresa aos materiais, componentes e equipamentos necessários para
            manter sua operação funcionando. Mais agilidade nas cotações, atendimento próximo e soluções para as
            necessidades da sua indústria.
          </p>
          <div className="hero-in mt-10 flex flex-col gap-3 sm:flex-row" style={{ ["--d" as string]: "240ms" }}>
            <QuoteLink className="btn btn-primary group h-14 px-7 text-base">
              Solicitar uma cotação
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </QuoteLink>
            <WhatsAppLink location="hero" className="btn btn-ghost-light h-14 px-7 text-base">
              <WhatsAppIcon className="size-5" />
              Falar com um especialista
            </WhatsAppLink>
          </div>
        </div>

        {hasLogoFile && (
          <div className="hero-in hidden justify-end lg:flex" style={{ ["--d" as string]: "200ms" }}>
            <div className="relative w-full max-w-[400px]">
              <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] bg-brand-500/25 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl bg-[#fbfbfb] p-3 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.7)] ring-1 ring-white/40">
                <Logo size={336} priority />
              </div>
            </div>
          </div>
        )}
        </div>

        <ul
          className="hero-in mt-16 grid max-w-4xl gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:mt-20"
          style={{ ["--d" as string]: "360ms" }}
        >
          {highlights.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 bg-brand-950/70 px-5 py-4 backdrop-blur-sm">
              <Icon className="size-5 shrink-0 text-brand-300" strokeWidth={1.6} aria-hidden="true" />
              <span className="text-sm font-medium text-white/85">{text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
