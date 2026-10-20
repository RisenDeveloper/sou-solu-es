"use client";

import { AlertCircle, CheckCircle2, FileText, Loader2, Paperclip, Send, Upload, X } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { categories } from "@/content/categories";
import { trackConversion } from "@/lib/analytics";
import {
  ACCEPTED_EXTENSIONS,
  UF,
  UPLOAD_LIMITS,
  checkFiles,
  formatBytes,
  quoteSchema,
  type QuoteApiResponse,
} from "@/lib/quote-schema";
import { whatsappLink } from "@/lib/whatsapp";
import { QUOTE_EVENT, type QuoteIntent } from "../QuoteLink";
import { WhatsAppIcon } from "../WhatsApp";

type Status =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success"; protocol: string }
  | { type: "error"; message: string; fallback: boolean };

const FIELD_ORDER = [
  "name",
  "company",
  "cnpj",
  "email",
  "phone",
  "city",
  "state",
  "category",
  "products",
  "quantity",
  "specs",
  "notes",
  "attachments",
  "consent",
];

const MIXED = "Lista com várias categorias";
const OTHER = "Outro / não sei classificar";

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const maskCnpj = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 14);
  return d
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
};

function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
  className = "",
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-ink-400">(opcional)</span>
        ) : (
          <span className="ml-0.5 text-brand-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function summaryForWhatsapp(fd: FormData) {
  const get = (k: string) => String(fd.get(k) ?? "").trim();
  const lines = [
    "Olá! Gostaria de solicitar uma cotação pelo site da SOU Soluções Industriais.\n",
    `Nome: ${get("name")}`,
    `Empresa: ${get("company")}`,
    get("cnpj") && `CNPJ: ${get("cnpj")}`,
    `E-mail: ${get("email")}`,
    `Telefone: ${get("phone")}`,
    `Entrega: ${get("city")}/${get("state")}`,
    get("category") && `Categoria: ${get("category")}`,
    `Produtos: ${get("products")}`,
    get("quantity") && `Quantidade: ${get("quantity")}`,
    get("specs") && `Especificações: ${get("specs")}`,
    get("notes") && `Observações: ${get("notes")}`,
  ].filter(Boolean);
  return lines.join("\n").slice(0, 3500);
}

export function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const startedAt = useRef<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [category, setCategory] = useState("");
  const [highlightFiles, setHighlightFiles] = useState(false);
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const [phone, setPhone] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [fallbackHref, setFallbackHref] = useState<string | null>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const turnstileKey = siteConfig.integrations.turnstileSiteKey;

  useEffect(() => {
    startedAt.current = Date.now();

    const apply = ({ category: cat, focus }: QuoteIntent) => {
      if (cat) {
        const match = categories.find((c) => c.slug === cat || c.title === cat);
        if (match) setCategory(match.title);
      }
      if (focus === "attachments") {
        setHighlightFiles(true);
        window.setTimeout(() => setHighlightFiles(false), 2600);
      }
    };

    const params = new URLSearchParams(window.location.search);
    if (params.has("categoria") || params.has("lista")) {
      apply({ category: params.get("categoria") ?? undefined, focus: params.has("lista") ? "attachments" : undefined });
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.hash}`);
    }

    const onIntent = (e: Event) => apply((e as CustomEvent<QuoteIntent>).detail ?? {});
    window.addEventListener(QUOTE_EVENT, onIntent);
    return () => window.removeEventListener(QUOTE_EVENT, onIntent);
  }, []);

  const addFiles = (incoming: FileList | File[]) => {
    const next = [...files];
    for (const f of Array.from(incoming)) {
      if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
    }
    const problem = checkFiles(next);
    if (problem) setErrors((e) => ({ ...e, attachments: problem }));
    else {
      clearError("attachments");
      setFiles(next);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((list) => list.filter((_, i) => i !== index));
    clearError("attachments");
  };

  function clearError(name: string) {
    setErrors((e) => {
      if (!e[name]) return e;
      const next = { ...e };
      delete next[name];
      return next;
    });
  }

  const focusFirstError = (errs: Record<string, string>) => {
    const first = FIELD_ORDER.find((k) => errs[k]);
    if (!first) return;
    const el =
      first === "attachments" ? dropRef.current : formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.focus();
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status.type === "submitting") return;
    const form = event.currentTarget;
    const fd = new FormData(form);
    fd.delete("attachments");
    // Capturado antes de desabilitar os campos (campos desabilitados ficam fora do FormData).
    const whatsappSummary = summaryForWhatsapp(fd);

    const values = Object.fromEntries(
      FIELD_ORDER.filter((k) => k !== "attachments").map((k) => [k, String(fd.get(k) ?? "")]),
    );
    const parsed = quoteSchema.safeParse(values);
    const nextErrors: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        nextErrors[key] ??= issue.message;
      }
    }
    const fileProblem = checkFiles(files);
    if (fileProblem) nextErrors.attachments = fileProblem;

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus({ type: "idle" });
      focusFirstError(nextErrors);
      return;
    }

    files.forEach((f) => fd.append("attachments", f, f.name));
    fd.set("_started", String(startedAt.current));
    setErrors({});
    setStatus({ type: "submitting" });

    try {
      const res = await fetch("/api/cotacao", { method: "POST", body: fd });
      const data = (await res.json().catch(() => null)) as QuoteApiResponse | null;

      if (data?.ok) {
        trackConversion("quote_submit", { categoria: String(values.category || "nao_informada") });
        if (files.length) trackConversion("material_list_submit", { arquivos: files.length });
        setStatus({ type: "success", protocol: data.protocol });
        setFiles([]);
        form.reset();
        setCategory("");
        setPhone("");
        setCnpj("");
        requestAnimationFrame(() => statusRef.current?.focus());
        return;
      }

      if (data && !data.ok && data.fieldErrors) {
        setErrors(data.fieldErrors);
        focusFirstError(data.fieldErrors);
      }
      const fallback =
        !data || data.code === "NOT_CONFIGURED" || data.code === "DELIVERY_FAILED" || data.code === "RATE_LIMIT";
      setFallbackHref(fallback ? whatsappLink(whatsappSummary) : null);
      setStatus({
        type: "error",
        message: data?.message ?? "Não foi possível enviar agora. Verifique sua conexão e tente novamente.",
        fallback,
      });
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch {
      setFallbackHref(whatsappLink(whatsappSummary));
      setStatus({
        type: "error",
        message: "Não foi possível enviar agora. Verifique sua conexão e tente novamente.",
        fallback: true,
      });
      requestAnimationFrame(() => statusRef.current?.focus());
    } finally {
      (window as Window & { turnstile?: { reset: () => void } }).turnstile?.reset();
    }
  }

  if (status.type === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="flex min-h-[520px] flex-col items-center justify-center px-6 py-16 text-center outline-none"
      >
        <span className="inline-flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="size-9" strokeWidth={1.6} aria-hidden="true" />
        </span>
        <h3 className="mt-6 font-display text-2xl font-bold text-ink-950">Solicitação enviada com sucesso</h3>
        <p className="mt-3 max-w-md leading-relaxed text-ink-500">
          Recebemos sua solicitação de cotação. Nossa equipe comercial vai analisar os itens e entrar em contato pelos
          dados informados.
        </p>
        <p className="mt-6 rounded-lg border border-ink-200 bg-ink-50 px-5 py-3 font-display text-sm">
          Protocolo: <strong className="text-brand-800">{status.protocol}</strong>
        </p>
        <button
          type="button"
          className="btn btn-outline mt-8"
          onClick={() => {
            startedAt.current = Date.now();
            setStatus({ type: "idle" });
          }}
        >
          Enviar nova solicitação
        </button>
      </div>
    );
  }

  const submitting = status.type === "submitting";
  const errorCount = Object.keys(errors).length;
  const a11y = (name: string, hint?: boolean) => ({
    "aria-invalid": errors[name] ? (true as const) : undefined,
    "aria-describedby": errors[name] ? `${name}-error` : hint ? `${name}-hint` : undefined,
  });

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-busy={submitting} className="p-6 sm:p-10">
      {turnstileKey && (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
      )}

      <div ref={statusRef} tabIndex={-1} className="outline-none" aria-live="assertive">
        {status.type === "error" && (
          <div role="alert" className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
            <p className="flex items-start gap-2 font-semibold">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {status.message}
            </p>
            {status.fallback && (fallbackHref || siteConfig.contact.email) && (
              <div className="mt-3 flex flex-wrap gap-2 pl-6">
                {fallbackHref && (
                  <a
                    href={fallbackHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackConversion("whatsapp_click", { location: "fallback_formulario" })}
                    className="btn min-h-10 bg-whatsapp px-4 text-sm text-white hover:brightness-95"
                  >
                    <WhatsAppIcon className="size-4" />
                    Enviar pelo WhatsApp
                  </a>
                )}
                {siteConfig.contact.email && (
                  <a href={`mailto:${siteConfig.contact.email}?subject=Solicitação de cotação`} className="btn btn-outline min-h-10 px-4 text-sm">
                    Enviar por e-mail
                  </a>
                )}
              </div>
            )}
            {status.fallback && fallbackHref && (
              <p className="mt-2 pl-6 text-xs text-red-800">
                Os dados preenchidos vão na mensagem. Se tiver anexos, envie-os na própria conversa.
              </p>
            )}
          </div>
        )}
        {status.type !== "error" && errorCount > 0 && (
          <div role="alert" className="mb-8 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-900">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {errorCount === 1 ? "Revise o campo destacado." : `Revise os ${errorCount} campos destacados.`}
          </div>
        )}
      </div>

      <fieldset className="grid gap-5 sm:grid-cols-2" disabled={submitting}>
        <legend className="mb-5 font-display text-xs font-semibold tracking-[0.16em] text-ink-400 uppercase">
          Dados da empresa
        </legend>
        <Field id="name" label="Nome do solicitante" error={errors.name}>
          <input id="name" name="name" autoComplete="name" className="field" maxLength={120} onInput={() => clearError("name")} {...a11y("name")} />
        </Field>
        <Field id="company" label="Empresa" error={errors.company}>
          <input id="company" name="company" autoComplete="organization" className="field" maxLength={160} onInput={() => clearError("company")} {...a11y("company")} />
        </Field>
        <Field id="cnpj" label="CNPJ" optional error={errors.cnpj}>
          <input
            id="cnpj"
            name="cnpj"
            inputMode="numeric"
            className="field"
            placeholder="00.000.000/0000-00"
            value={cnpj}
            onChange={(e) => {
              setCnpj(maskCnpj(e.target.value));
              clearError("cnpj");
            }}
            {...a11y("cnpj")}
          />
        </Field>
        <Field id="email" label="E-mail corporativo" error={errors.email}>
          <input id="email" name="email" type="email" autoComplete="email" className="field" placeholder="nome@empresa.com.br" maxLength={160} onInput={() => clearError("email")} {...a11y("email")} />
        </Field>
        <Field id="phone" label="Telefone / WhatsApp" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            className="field"
            placeholder="(41) 99999-9999"
            value={phone}
            onChange={(e) => {
              setPhone(maskPhone(e.target.value));
              clearError("phone");
            }}
            {...a11y("phone")}
          />
        </Field>
        <div className="grid grid-cols-[1fr_6.5rem] gap-3">
          <Field id="city" label="Cidade de entrega" error={errors.city}>
            <input id="city" name="city" autoComplete="address-level2" className="field" maxLength={100} onInput={() => clearError("city")} {...a11y("city")} />
          </Field>
          <Field id="state" label="UF" error={errors.state}>
            <select id="state" name="state" autoComplete="address-level1" className="field" defaultValue="" onChange={() => clearError("state")} {...a11y("state")}>
              <option value="" disabled>
                —
              </option>
              {UF.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-10 grid gap-5 sm:grid-cols-2" disabled={submitting}>
        <legend className="mb-5 font-display text-xs font-semibold tracking-[0.16em] text-ink-400 uppercase">
          O que você precisa
        </legend>
        <Field id="category" label="Categoria principal" optional className="sm:col-span-2">
          <select id="category" name="category" className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Selecione</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.title}>
                {c.title}
              </option>
            ))}
            <option value={MIXED}>{MIXED}</option>
            <option value={OTHER}>{OTHER}</option>
          </select>
        </Field>
        <Field id="products" label="Produtos ou materiais desejados" error={errors.products} className="sm:col-span-2">
          <textarea
            id="products"
            name="products"
            rows={4}
            maxLength={4000}
            className="field resize-y"
            placeholder={"Ex.: Rolamento 6205 2RS\nVálvula esfera 2\" inox\nParafuso sextavado M12 x 50 classe 8.8"}
            onInput={() => clearError("products")}
            {...a11y("products")}
          />
        </Field>
        <Field id="quantity" label="Quantidade" optional hint="Total ou por item, se preferir." className="sm:col-span-2">
          <input id="quantity" name="quantity" className="field" maxLength={500} placeholder="Ex.: 20 unidades de cada" {...a11y("quantity", true)} />
        </Field>
        <Field id="specs" label="Especificações técnicas, marca ou código do fabricante" optional>
          <textarea id="specs" name="specs" rows={3} maxLength={4000} className="field resize-y" />
        </Field>
        <Field id="notes" label="Observações adicionais" optional>
          <textarea id="notes" name="notes" rows={3} maxLength={4000} className="field resize-y" placeholder="Prazo desejado, condições, aplicação…" />
        </Field>

        {/* Anexos */}
        <div className="sm:col-span-2">
          <p className="field-label" id={`${uid}-files-label`}>
            Lista de materiais, imagens ou planilhas <span className="font-normal text-ink-400">(opcional)</span>
          </p>
          <div
            ref={dropRef}
            tabIndex={-1}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
            }}
            className={`rounded-xl border-2 border-dashed p-6 text-center transition-[border-color,background-color,box-shadow] duration-300 outline-none ${
              errors.attachments
                ? "border-red-300 bg-red-50/50"
                : dragging
                  ? "border-brand-500 bg-brand-50"
                  : highlightFiles
                    ? "border-brand-500 bg-brand-50 shadow-[0_0_0_4px_rgb(36_87_209/0.15)]"
                    : "border-ink-300 bg-ink-50/60"
            }`}
          >
            <Upload className="mx-auto size-7 text-brand-600" strokeWidth={1.5} aria-hidden="true" />
            <p className="mt-3 text-sm text-ink-700">
              Arraste os arquivos aqui ou{" "}
              <label htmlFor={`${uid}-files`} className="cursor-pointer font-semibold text-brand-700 underline underline-offset-2 hover:text-brand-900">
                selecione no computador
              </label>
            </p>
            <p className="mt-1 text-xs text-ink-500">
              PDF, imagens, Excel, CSV ou Word · até {UPLOAD_LIMITS.maxFiles} arquivos · {formatBytes(UPLOAD_LIMITS.maxFileBytes)} cada
            </p>
            <input
              ref={fileInputRef}
              id={`${uid}-files`}
              name="attachments"
              type="file"
              multiple
              accept={ACCEPTED_EXTENSIONS.join(",")}
              className="sr-only"
              aria-labelledby={`${uid}-files-label`}
              aria-describedby={errors.attachments ? "attachments-error" : undefined}
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
          </div>
          {errors.attachments && (
            <p id="attachments-error" className="field-error">
              {errors.attachments}
            </p>
          )}
          {files.length > 0 && (
            <ul className="mt-3 space-y-2" aria-label="Arquivos selecionados">
              {files.map((f, i) => (
                <li key={`${f.name}-${f.size}`} className="flex items-center gap-3 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm">
                  {f.type.startsWith("image/") ? (
                    <Paperclip className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
                  ) : (
                    <FileText className="size-4 shrink-0 text-ink-400" aria-hidden="true" />
                  )}
                  <span className="min-w-0 flex-1 truncate text-ink-800">{f.name}</span>
                  <span className="shrink-0 text-xs text-ink-400">{formatBytes(f.size)}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-900"
                    aria-label={`Remover ${f.name}`}
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </fieldset>

      {/* Campo armadilha para robôs — invisível para pessoas */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Não preencha este campo</label>
        <input id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className="mt-8 border-t border-ink-200 pt-6">
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            className="mt-1 size-4 shrink-0 accent-brand-600"
            onChange={() => clearError("consent")}
            disabled={submitting}
            {...a11y("consent")}
          />
          <label htmlFor="consent" className="text-sm leading-relaxed text-ink-600">
            Autorizo a SOU Soluções Industriais a utilizar os dados informados para elaborar a cotação e entrar em contato
            comigo, conforme a{" "}
            <Link href="/politica-de-privacidade" target="_blank" className="font-semibold text-brand-700 underline underline-offset-2">
              Política de Privacidade
            </Link>
            .
          </label>
        </div>
        {errors.consent && (
          <p id="consent-error" className="field-error pl-7">
            {errors.consent}
          </p>
        )}

        {turnstileKey && <div className="cf-turnstile mt-6" data-sitekey={turnstileKey} data-language="pt-br" />}

        <button type="submit" className="btn btn-primary mt-8 h-14 w-full text-base sm:w-auto sm:px-10" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="size-5 animate-spin" aria-hidden="true" />
              Enviando solicitação…
            </>
          ) : (
            <>
              Enviar solicitação de cotação
              <Send className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
