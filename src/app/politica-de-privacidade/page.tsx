import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { siteConfig } from "@/config/site";
import { formatPhoneBR } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como a SOU Soluções Industriais trata os dados pessoais enviados pelo site, em conformidade com a LGPD.",
  alternates: { canonical: "/politica-de-privacidade" },
};

/*
 * Modelo de política alinhado à LGPD (Lei 13.709/2018). Recomenda-se revisão jurídica
 * antes da publicação definitiva, em especial prazos de retenção e fornecedores utilizados.
 */
export default function PrivacyPage() {
  const { contact, legal } = siteConfig;
  const controller = legal.companyName || siteConfig.name;
  const channel = contact.email
    ? `pelo e-mail ${contact.email}`
    : contact.whatsapp
      ? `pelo WhatsApp ${formatPhoneBR(contact.whatsapp)}`
      : "pelos canais de contato informados no site";

  return (
    <>
      <PageHeader crumbs={[{ label: "Início", href: "/" }, { label: "Política de privacidade" }]} title="Política de privacidade">
        Transparência sobre como tratamos as informações enviadas pelo site.
      </PageHeader>
      <article className="container-site max-w-3xl py-16 lg:py-24 [&_h2]:mt-12 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink-950 [&_li]:mt-2 [&_p]:mt-4 [&_p]:leading-relaxed [&_p]:text-ink-600 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-ink-600">
        <p>
          Esta política explica como <strong>{controller}</strong>
          {legal.cnpj && <> (CNPJ {legal.cnpj})</>}, controladora dos dados, coleta, utiliza e protege as informações
          pessoais enviadas por meio deste site, em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei nº
          13.709/2018 — LGPD).
        </p>

        <h2>1. Dados coletados</h2>
        <p>Ao solicitar uma cotação, podemos receber:</p>
        <ul>
          <li>nome, empresa, CNPJ (opcional), e-mail, telefone/WhatsApp e cidade/estado de entrega;</li>
          <li>descrição dos produtos, quantidades, especificações e observações;</li>
          <li>arquivos anexados, como listas de materiais, planilhas e imagens;</li>
          <li>dados técnicos mínimos de segurança, como endereço IP, usados para prevenir spam e abusos.</li>
        </ul>

        <h2>2. Finalidade e base legal</h2>
        <p>
          Os dados são usados exclusivamente para analisar sua solicitação, elaborar a cotação e manter contato
          comercial sobre ela. O tratamento tem como base a execução de procedimentos preliminares relacionados a
          contrato a pedido do titular (art. 7º, V, da LGPD) e o seu consentimento, registrado no envio do formulário.
        </p>

        <h2>3. Compartilhamento</h2>
        <p>
          Não vendemos nem cedemos seus dados. As informações podem ser processadas por fornecedores de tecnologia
          necessários ao funcionamento do site e ao recebimento das solicitações (hospedagem, envio de e-mail e
          ferramentas de atendimento), que atuam como operadores e seguem obrigações de confidencialidade e segurança.
        </p>

        <h2>4. Cookies e medição</h2>
        <p>
          O site não utiliza cookies de publicidade. Ferramentas de medição de audiência só são ativadas após a sua
          autorização no aviso de cookies, e você pode alterar essa escolha a qualquer momento em “Preferências de
          cookies”, no rodapé.
        </p>

        <h2>5. Armazenamento e segurança</h2>
        <p>
          A comunicação com o site é criptografada (HTTPS). Os anexos são verificados quanto ao tipo e ao tamanho, não
          ficam disponíveis publicamente e são encaminhados apenas à equipe comercial. Os dados são mantidos pelo tempo
          necessário para atender à solicitação e ao relacionamento comercial, ou para cumprir obrigações legais.
        </p>

        <h2>6. Seus direitos</h2>
        <p>Nos termos do art. 18 da LGPD, você pode solicitar a qualquer momento:</p>
        <ul>
          <li>confirmação da existência de tratamento e acesso aos dados;</li>
          <li>correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>revogação do consentimento e eliminação dos dados tratados com base nele;</li>
          <li>informações sobre o compartilhamento dos dados.</li>
        </ul>

        <h2>7. Contato</h2>
        <p>
          Para exercer seus direitos ou tirar dúvidas sobre esta política, entre em contato {channel}.
        </p>
        <p className="text-sm text-ink-400">Esta política pode ser atualizada periodicamente. A versão vigente é sempre a publicada nesta página.</p>
      </article>
    </>
  );
}
