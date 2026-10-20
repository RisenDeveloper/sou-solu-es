/**
 * Dados institucionais da SOU Soluções Industriais.
 *
 * Todas as informações de contato vêm de variáveis de ambiente (veja .env.example).
 * Campos vazios simplesmente não são exibidos no site — nada é inventado.
 * Como são variáveis NEXT_PUBLIC_, alterações exigem um novo build/deploy.
 */

const env = (value: string | undefined) => (value ?? "").trim();

export const siteConfig = {
  name: "SOU Soluções Industriais",
  shortName: "SOU",
  url: env(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000",
  description:
    "Fornecimento de materiais, peças, componentes e equipamentos industriais. Envie sua lista e receba uma cotação com atendimento comercial direto. Paranaguá/PR e região.",
  /** Região de referência usada em SEO e textos. */
  region: {
    city: env(process.env.NEXT_PUBLIC_CITY) || "Paranaguá",
    state: env(process.env.NEXT_PUBLIC_STATE) || "PR",
  },
  logo: {
    /** Arquivo oficial. Substitua por PNG com fundo transparente ou SVG quando disponível. */
    src: env(process.env.NEXT_PUBLIC_LOGO_PATH) || "/brand/logo.jpg",
    width: 1254,
    height: 1254,
    alt: "SOU Soluções Industriais",
  },
  contact: {
    /** Somente dígitos, com DDI e DDD. Ex.: 5541999999999 */
    whatsapp: (env(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) || "554192855815").replace(/\D/g, ""),
    whatsappMessage:
      "Olá! Conheci a SOU Soluções Industriais pelo site e gostaria de solicitar uma cotação para minha empresa.",
    phone: env(process.env.NEXT_PUBLIC_CONTACT_PHONE),
    email: env(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    address: env(process.env.NEXT_PUBLIC_ADDRESS),
    businessHours: env(process.env.NEXT_PUBLIC_BUSINESS_HOURS),
  },
  legal: {
    companyName: env(process.env.NEXT_PUBLIC_LEGAL_NAME),
    cnpj: env(process.env.NEXT_PUBLIC_CNPJ),
  },
  social: {
    instagram: env(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
    linkedin: env(process.env.NEXT_PUBLIC_LINKEDIN_URL),
    facebook: env(process.env.NEXT_PUBLIC_FACEBOOK_URL),
  },
  integrations: {
    gtmId: env(process.env.NEXT_PUBLIC_GTM_ID),
    turnstileSiteKey: env(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY),
  },
} as const;

export const regionLabel = `${siteConfig.region.city}/${siteConfig.region.state}`;

export const navigation = [
  { label: "Início", href: "/" },
  { label: "Produtos", href: "/#produtos" },
  { label: "Soluções", href: "/#solucoes" },
  { label: "Como funciona", href: "/#como-funciona" },
  { label: "Sobre nós", href: "/#sobre" },
  { label: "Contato", href: "/#contato" },
] as const;
