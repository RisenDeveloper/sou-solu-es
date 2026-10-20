import { createHmac } from "node:crypto";
import type { QuoteInput } from "@/lib/quote-schema";
import type { ValidatedFile } from "./files";

/**
 * Entrega da solicitação de cotação. Canais suportados (configuráveis por variáveis de ambiente):
 *  1. E-mail via Resend (RESEND_API_KEY, QUOTE_TO_EMAIL, QUOTE_FROM_EMAIL) — inclui os anexos.
 *  2. Webhook HTTPS (QUOTE_WEBHOOK_URL, QUOTE_WEBHOOK_SECRET) — para CRM, planilha, n8n, Make, Zapier etc.
 *
 * Os anexos nunca são gravados em disco nem em pasta pública: são lidos em memória,
 * validados e encaminhados apenas pelo canal de e-mail.
 */

export type QuoteRequest = QuoteInput & {
  protocol: string;
  receivedAt: string;
  files: ValidatedFile[];
  source: string;
};

export function deliveryChannels() {
  const email = Boolean(process.env.RESEND_API_KEY && process.env.QUOTE_TO_EMAIL && process.env.QUOTE_FROM_EMAIL);
  const webhook = Boolean(process.env.QUOTE_WEBHOOK_URL);
  return { email, webhook, any: email || webhook };
}

const esc = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function rows(q: QuoteRequest): [string, string][] {
  return [
    ["Protocolo", q.protocol],
    ["Recebido em", new Date(q.receivedAt).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })],
    ["Nome", q.name],
    ["Empresa", q.company],
    ["CNPJ", q.cnpj || "—"],
    ["E-mail", q.email],
    ["Telefone/WhatsApp", q.phone],
    ["Entrega", `${q.city}/${q.state}`],
    ["Categoria", q.category || "—"],
    ["Produtos / materiais", q.products],
    ["Quantidade", q.quantity || "—"],
    ["Especificações / marca / código", q.specs || "—"],
    ["Observações", q.notes || "—"],
    ["Anexos", q.files.length ? q.files.map((f) => f.filename).join(", ") : "—"],
    ["Origem", q.source],
  ];
}

function emailHtml(q: QuoteRequest) {
  const body = rows(q)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #e3e6ea;color:#5b626b;font-size:13px;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 12px;border-bottom:1px solid #e3e6ea;color:#111418;font-size:14px;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Arial,sans-serif;max-width:680px"><h2 style="color:#0c2f73;margin:0 0 4px">Nova solicitação de cotação</h2><p style="color:#5b626b;margin:0 0 16px">Enviada pelo site da SOU Soluções Industriais.</p><table style="border-collapse:collapse;width:100%">${body}</table><p style="color:#8a9099;font-size:12px;margin-top:16px">Responda este e-mail para falar diretamente com o solicitante.</p></div>`;
}

const emailText = (q: QuoteRequest) => rows(q).map(([k, v]) => `${k}: ${v}`).join("\n");

async function sendEmail(q: QuoteRequest) {
  const to = process.env.QUOTE_TO_EMAIL!.split(",").map((s) => s.trim()).filter(Boolean);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.QUOTE_FROM_EMAIL,
      to,
      reply_to: q.email,
      subject: `Cotação ${q.protocol} — ${q.company}`,
      html: emailHtml(q),
      text: emailText(q),
      attachments: q.files.map((f) => ({ filename: f.filename, content: f.content.toString("base64") })),
    }),
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`Resend respondeu ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

async function sendWebhook(q: QuoteRequest) {
  const { files, ...data } = q;
  const payload = JSON.stringify({
    type: "quote_request",
    ...data,
    attachments: files.map((f) => ({ filename: f.filename, contentType: f.contentType, size: f.size })),
  });
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const secret = process.env.QUOTE_WEBHOOK_SECRET;
  if (secret) headers["X-Signature-SHA256"] = createHmac("sha256", secret).update(payload).digest("hex");
  const res = await fetch(process.env.QUOTE_WEBHOOK_URL!, {
    method: "POST",
    headers,
    body: payload,
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`Webhook respondeu ${res.status}`);
}

/** Envia por todos os canais configurados. Sucesso quando ao menos um canal confirma o recebimento. */
export async function deliverQuote(q: QuoteRequest): Promise<{ delivered: boolean }> {
  const channels = deliveryChannels();
  const tasks: Promise<void>[] = [];
  if (channels.email) tasks.push(sendEmail(q));
  if (channels.webhook) tasks.push(sendWebhook(q));
  const results = await Promise.allSettled(tasks);
  for (const r of results) {
    if (r.status === "rejected") console.error(`[cotacao ${q.protocol}] falha no envio:`, r.reason);
  }
  return { delivered: results.some((r) => r.status === "fulfilled") };
}
