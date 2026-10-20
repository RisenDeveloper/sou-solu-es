import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import { ConsentBanner } from "@/components/ConsentBanner";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { hasLogoFile } from "@/components/Logo";
import { RevealObserver } from "@/components/RevealObserver";
import { WhatsAppFloat } from "@/components/WhatsApp";
import { regionLabel, siteConfig } from "@/config/site";
import { categories } from "@/content/categories";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `Fornecedor de materiais industriais em ${regionLabel} | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "fornecedor de materiais industriais",
    "fornecimento de peças industriais",
    "distribuidor de componentes industriais",
    "cotação de materiais industriais",
    "rolamentos industriais",
    "flanges e conexões",
    "válvulas industriais",
    "manutenção industrial",
    `fornecedor industrial ${siteConfig.region.city}`,
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: siteConfig.name,
    url: "/",
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

function OrganizationJsonLd() {
  const { contact, social } = siteConfig;
  const sameAs = [social.instagram, social.linkedin, social.facebook].filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    ...(hasLogoFile && { logo: new URL(siteConfig.logo.src, siteConfig.url).toString() }),
    description: siteConfig.description,
    areaServed: { "@type": "City", name: siteConfig.region.city },
    knowsAbout: categories.map((c) => c.title),
    ...(sameAs.length && { sameAs }),
    ...((contact.email || contact.phone || contact.whatsapp) && {
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        availableLanguage: "Portuguese",
        ...(contact.email && { email: contact.email }),
        ...((contact.phone || contact.whatsapp) && {
          telephone: `+${(contact.phone || contact.whatsapp).replace(/\D/g, "")}`,
        }),
      },
    }),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add("js")` }} />
        <OrganizationJsonLd />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Header />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <ConsentBanner />
        <RevealObserver />
      </body>
    </html>
  );
}
