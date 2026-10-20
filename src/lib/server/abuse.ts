/**
 * Proteções contra spam e abuso do formulário:
 *  - limite de envios por IP (em memória — por instância do servidor);
 *  - campo "honeypot" invisível e tempo mínimo de preenchimento;
 *  - Cloudflare Turnstile (opcional, ativado quando as chaves estão configuradas).
 */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

export function rateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return true;
}

export function clientIp(headers: Headers) {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

const MIN_FILL_MS = 3000;
const MAX_FILL_MS = 1000 * 60 * 60 * 24;

/** true quando o envio parece automatizado. */
export function looksLikeBot(honeypot: string, startedAt: string) {
  if (honeypot.trim() !== "") return true;
  const started = Number(startedAt);
  if (!Number.isFinite(started)) return true;
  const elapsed = Date.now() - started;
  return elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS;
}

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // não configurado
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return false;
  }
}
