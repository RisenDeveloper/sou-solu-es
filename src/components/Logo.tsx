import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";
import { siteConfig } from "@/config/site";

const logoFile = path.join(process.cwd(), "public", siteConfig.logo.src);
export const hasLogoFile = existsSync(logoFile);

/**
 * Logo oficial, exibida sem cortes, distorções ou alterações de cor.
 * Enquanto o arquivo não estiver em /public/brand/logo.png, mostra o nome da empresa em texto simples
 * (não é uma recriação da marca — apenas um marcador até a logo ser adicionada).
 */
export function Logo({ size = 64, priority = false }: { size?: number; priority?: boolean }) {
  if (!hasLogoFile) {
    return (
      <span className="flex flex-col leading-none" style={{ minHeight: size * 0.6 }}>
        <span className="font-display text-lg font-extrabold tracking-tight text-brand-800">SOU</span>
        <span className="font-display text-[10px] font-semibold tracking-[0.2em] text-ink-700 uppercase">
          Soluções Industriais
        </span>
      </span>
    );
  }
  return (
    <Image
      src={siteConfig.logo.src}
      alt={siteConfig.logo.alt}
      width={siteConfig.logo.width}
      height={siteConfig.logo.height}
      priority={priority}
      sizes={`${size}px`}
      style={{ width: size, height: "auto" }}
    />
  );
}
