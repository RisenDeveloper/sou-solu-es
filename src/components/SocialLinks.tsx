import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

/** Mostra apenas as redes sociais oficiais configuradas. */
export function SocialLinks({ className = "" }: { className?: string }) {
  const links = [
    { label: "Instagram", href: siteConfig.social.instagram },
    { label: "LinkedIn", href: siteConfig.social.linkedin },
    { label: "Facebook", href: siteConfig.social.facebook },
  ].filter((l) => l.href);
  if (!links.length) return null;
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`} aria-label="Redes sociais">
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-ink-300 transition-colors hover:border-white/40 hover:text-white"
          >
            {l.label}
            <ArrowUpRight className="size-3" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
