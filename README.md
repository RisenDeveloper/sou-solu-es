# SOU Soluções Industriais — site institucional B2B

Site em **Next.js 16 (App Router) + TypeScript + Tailwind CSS 4 + Lucide**, focado em gerar solicitações de cotação.

## Antes de publicar — checklist

1. **Logo oficial**: já está em `public/brand/logo.jpg` (arquivo original, sem alterações). Se tiver uma versão PNG com fundo transparente ou SVG, coloque em `public/brand/` e ajuste `NEXT_PUBLIC_LOGO_PATH`.
2. **Envio das cotações**: configure ao menos um canal (Resend **ou** webhook) — veja abaixo. Sem isso, o formulário **não finge sucesso**: avisa o visitante e oferece o envio pelo WhatsApp com os dados já preenchidos.
3. **Dados de contato**: e-mail, telefone, endereço, CNPJ e redes sociais em `.env` (campos vazios não aparecem).
4. `NEXT_PUBLIC_SITE_URL` com o domínio final (usado no sitemap, robots e metadados).
5. Revisão jurídica da página `/politica-de-privacidade`.

## Executar localmente

```bash
npm install
cp .env.example .env.local   # no Windows: copy .env.example .env.local
npm run dev                  # http://localhost:3000
```

Build de produção: `npm run build && npm start`. Lint: `npm run lint`.

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Contatos, WhatsApp, redes, região, logo | `src/config/site.ts` (valores vêm do `.env`) |
| Categorias, textos e fotos dos produtos | `src/content/categories.ts` |
| Seções da página inicial | `src/components/sections/*` |
| Formulário de cotação | `src/components/quote/QuoteForm.tsx` |
| Regras de validação (cliente e servidor) | `src/lib/quote-schema.ts` |
| API de cotação | `src/app/api/cotacao/route.ts` + `src/lib/server/*` |
| Cores e tipografia | `src/app/globals.css` (`@theme`) |

O WhatsApp oficial (`+55 41 9285-5815`) já está configurado como padrão; pode ser trocado por `NEXT_PUBLIC_WHATSAPP_NUMBER`. As variáveis `NEXT_PUBLIC_*` são lidas no build — após alterá-las, publique novamente.

## Envio das cotações (credenciais necessárias)

**Opção 1 — e-mail via [Resend](https://resend.com)** (inclui os anexos):
```
RESEND_API_KEY=re_...
QUOTE_TO_EMAIL=comercial@seudominio.com.br
QUOTE_FROM_EMAIL=Site SOU <cotacoes@seudominio.com.br>   # domínio verificado no Resend
```
O e-mail chega com todos os campos, protocolo, anexos e "responder para" o e-mail do cliente.

**Opção 2 — webhook** (CRM, planilha Google via Apps Script, n8n, Make, Zapier...):
```
QUOTE_WEBHOOK_URL=https://...
QUOTE_WEBHOOK_SECRET=um-segredo-longo   # opcional: header X-Signature-SHA256 (HMAC do corpo)
```
Recebe JSON com os dados e a lista de anexos (nome, tipo, tamanho — o conteúdo dos arquivos segue só pelo e-mail). Útil para registrar as oportunidades comerciais em banco de dados/CRM.

Com os dois configurados, o envio é considerado concluído quando ao menos um confirma.

## Segurança e LGPD

- Validação dupla (navegador e servidor) com Zod; CNPJ com dígito verificador.
- Anexos: até 5 arquivos, 8 MB cada, 20 MB no total; tipos PDF, imagens, Excel, CSV, Word e TXT; **conteúdo binário conferido** (um `.exe` renomeado para `.pdf` é recusado); nomes sanitizados; nada é gravado em disco nem em pasta pública.
- Anti-spam: campo armadilha, tempo mínimo de preenchimento, limite de 5 envios / 10 min por IP, bloqueio de origem externa e Cloudflare Turnstile opcional (`NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY`).
  - O limite por IP fica em memória de cada instância; em hospedagem serverless com muito tráfego, troque por Upstash/Redis.
- Consentimento obrigatório no formulário + Política de Privacidade.
- Medição (Google Tag Manager, `NEXT_PUBLIC_GTM_ID`) só carrega após o visitante aceitar no aviso de cookies.
- Nenhum segredo usa prefixo `NEXT_PUBLIC_`; cabeçalhos de segurança em `next.config.ts`.

## Conversões rastreadas (via dataLayer/GTM, sem dados pessoais)

`quote_submit`, `material_list_submit` (cotação com anexos), `whatsapp_click` (com o local do clique) — configure as tags/conversões no GTM (GA4, Google Ads, Meta).

## SEO

Metadados por página, URLs amigáveis por categoria (`/produtos/rolamentos-e-mancais` etc.), `sitemap.xml`, `robots.txt`, imagem Open Graph, dados estruturados (Organization e BreadcrumbList) e referência geográfica a Paranaguá/PR.

## Publicação

**Vercel (recomendado)**: importe o repositório, cadastre as variáveis do `.env.example` em *Settings → Environment Variables*, publique e aponte o domínio.

**Servidor próprio (Node 20.9+)**: `npm ci && npm run build && npm start` (porta 3000) atrás de um proxy HTTPS (Nginx/Caddy). Garanta que o proxy aceite uploads de pelo menos 25 MB.

## Imagens

Fotos do [Unsplash](https://unsplash.com/license) (uso comercial gratuito). Para usar fotos próprias, coloque-as em `public/images/` e troque os caminhos em `src/content/categories.ts`.
