import { randomBytes } from "node:crypto";
import { quoteSchema, UPLOAD_LIMITS, type QuoteApiResponse } from "@/lib/quote-schema";
import { clientIp, looksLikeBot, rateLimit, verifyTurnstile } from "@/lib/server/abuse";
import { deliverQuote, deliveryChannels } from "@/lib/server/delivery";
import { validateFiles } from "@/lib/server/files";

const json = (body: QuoteApiResponse, status: number) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

const MAX_BODY = UPLOAD_LIMITS.maxTotalBytes + 1024 * 1024;

function protocolNumber() {
  const d = new Date();
  const ymd = `${d.getFullYear() % 100}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `SOU-${ymd}-${randomBytes(3).toString("hex").toUpperCase()}`;
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request))
    return json({ ok: false, code: "BAD_REQUEST", message: "Origem da requisição não permitida." }, 403);

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY)
    return json({ ok: false, code: "TOO_LARGE", message: "Os anexos ultrapassam o tamanho máximo permitido." }, 413);

  const ip = clientIp(request.headers);
  if (!rateLimit(ip))
    return json(
      { ok: false, code: "RATE_LIMIT", message: "Muitas solicitações em pouco tempo. Aguarde alguns minutos e tente novamente." },
      429,
    );

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, code: "BAD_REQUEST", message: "Não foi possível ler os dados enviados." }, 400);
  }

  const str = (k: string) => {
    const v = form.get(k);
    return typeof v === "string" ? v : "";
  };

  if (looksLikeBot(str("website"), str("_started")))
    return json(
      { ok: false, code: "SPAM", message: "Não foi possível validar o envio. Aguarde alguns segundos e tente novamente." },
      400,
    );

  if (!(await verifyTurnstile(str("cf-turnstile-response"), ip)))
    return json({ ok: false, code: "SPAM", message: "Confirme a verificação de segurança e tente novamente." }, 400);

  const parsed = quoteSchema.safeParse({
    name: str("name"),
    company: str("company"),
    cnpj: str("cnpj"),
    email: str("email"),
    phone: str("phone"),
    city: str("city"),
    state: str("state"),
    category: str("category"),
    products: str("products"),
    quantity: str("quantity"),
    specs: str("specs"),
    notes: str("notes"),
    consent: str("consent"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return json({ ok: false, code: "VALIDATION", message: "Revise os campos destacados.", fieldErrors }, 400);
  }

  const files = await validateFiles(form.getAll("attachments"));
  if (!files.ok)
    return json({ ok: false, code: "FILES", message: files.message, fieldErrors: { attachments: files.message } }, 400);

  if (!deliveryChannels().any) {
    console.error("[cotacao] Nenhum canal de entrega configurado (RESEND_* ou QUOTE_WEBHOOK_URL).");
    return json(
      {
        ok: false,
        code: "NOT_CONFIGURED",
        message: "O envio pelo site está temporariamente indisponível. Envie sua solicitação pelo WhatsApp.",
      },
      503,
    );
  }

  const protocol = protocolNumber();
  const { delivered } = await deliverQuote({
    ...parsed.data,
    protocol,
    receivedAt: new Date().toISOString(),
    files: files.files,
    source: request.headers.get("referer") ?? "site",
  });

  if (!delivered)
    return json(
      {
        ok: false,
        code: "DELIVERY_FAILED",
        message: "Não conseguimos registrar sua solicitação agora. Tente novamente ou fale conosco pelo WhatsApp.",
      },
      502,
    );

  return json({ ok: true, protocol }, 200);
}
