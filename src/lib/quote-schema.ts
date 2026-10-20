import { z } from "zod";

/** Regras compartilhadas entre o formulário (cliente) e a API (servidor). */

export const UPLOAD_LIMITS = {
  maxFiles: 5,
  maxFileBytes: 8 * 1024 * 1024,
  maxTotalBytes: 20 * 1024 * 1024,
} as const;

export const ACCEPTED_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".xlsx",
  ".xls",
  ".csv",
  ".docx",
  ".doc",
  ".txt",
] as const;

export const UF = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

const digits = (v: string) => v.replace(/\D/g, "");

export function isValidCnpj(value: string): boolean {
  const cnpj = digits(value);
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  const calc = (base: string, weights: number[]) => {
    const sum = weights.reduce((acc, w, i) => acc + Number(base[i]) * w, 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  const d1 = calc(cnpj, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const d2 = calc(cnpj, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return d1 === Number(cnpj[12]) && d2 === Number(cnpj[13]);
}

const text = (max: number) => z.string().trim().max(max, `Use no máximo ${max} caracteres.`);

export const quoteSchema = z.object({
  name: text(120).min(3, "Informe seu nome completo."),
  company: text(160).min(2, "Informe o nome da empresa."),
  cnpj: text(20)
    .optional()
    .default("")
    .refine((v) => v === "" || isValidCnpj(v), "CNPJ inválido. Confira os números ou deixe em branco."),
  email: z
    .string()
    .trim()
    .max(160)
    .pipe(z.email("Informe um e-mail válido.")),
  phone: text(30).refine((v) => {
    const n = digits(v).length;
    return n >= 10 && n <= 13;
  }, "Informe um telefone com DDD."),
  city: text(100).min(2, "Informe a cidade de entrega."),
  state: z.enum(UF, { error: "Selecione o estado." }),
  category: text(120).optional().default(""),
  products: text(4000).min(3, "Descreva os produtos ou materiais desejados."),
  quantity: text(500).optional().default(""),
  specs: text(4000).optional().default(""),
  notes: text(4000).optional().default(""),
  consent: z.literal("on", { error: "É necessário aceitar a Política de Privacidade para enviar." }),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export type QuoteApiResponse =
  | { ok: true; protocol: string }
  | {
      ok: false;
      code:
        | "VALIDATION"
        | "FILES"
        | "SPAM"
        | "RATE_LIMIT"
        | "TOO_LARGE"
        | "NOT_CONFIGURED"
        | "DELIVERY_FAILED"
        | "BAD_REQUEST";
      message: string;
      fieldErrors?: Record<string, string>;
    };
export type QuoteField = keyof QuoteInput | "attachments";

export const formatBytes = (bytes: number) =>
  bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export function fileExtension(name: string) {
  const i = name.lastIndexOf(".");
  return i === -1 ? "" : name.slice(i).toLowerCase();
}

/** Validação rápida de anexos no navegador (o servidor revalida, inclusive o conteúdo). */
export function checkFiles(files: File[]): string | null {
  if (files.length > UPLOAD_LIMITS.maxFiles) return `Envie no máximo ${UPLOAD_LIMITS.maxFiles} arquivos.`;
  let total = 0;
  for (const f of files) {
    if (!(ACCEPTED_EXTENSIONS as readonly string[]).includes(fileExtension(f.name)))
      return `O arquivo "${f.name}" não é de um tipo aceito.`;
    if (f.size === 0) return `O arquivo "${f.name}" está vazio.`;
    if (f.size > UPLOAD_LIMITS.maxFileBytes)
      return `O arquivo "${f.name}" ultrapassa ${formatBytes(UPLOAD_LIMITS.maxFileBytes)}.`;
    total += f.size;
  }
  if (total > UPLOAD_LIMITS.maxTotalBytes)
    return `O total de anexos ultrapassa ${formatBytes(UPLOAD_LIMITS.maxTotalBytes)}.`;
  return null;
}
