import { ACCEPTED_EXTENSIONS, UPLOAD_LIMITS, fileExtension, formatBytes } from "@/lib/quote-schema";

export type ValidatedFile = {
  filename: string;
  contentType: string;
  size: number;
  content: Buffer;
};

const MIME: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".xls": "application/vnd.ms-excel",
  ".csv": "text/csv",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".doc": "application/msword",
  ".txt": "text/plain",
};

const startsWith = (buf: Buffer, bytes: number[], offset = 0) =>
  buf.length >= offset + bytes.length && bytes.every((b, i) => buf[offset + i] === b);

const ZIP = [0x50, 0x4b, 0x03, 0x04];
const OLE = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];

/** Confere a assinatura binária do arquivo — a extensão sozinha não é confiável. */
function matchesSignature(ext: string, buf: Buffer): boolean {
  switch (ext) {
    case ".pdf":
      return startsWith(buf, [0x25, 0x50, 0x44, 0x46]);
    case ".png":
      return startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case ".jpg":
    case ".jpeg":
      return startsWith(buf, [0xff, 0xd8, 0xff]);
    case ".webp":
      return startsWith(buf, [0x52, 0x49, 0x46, 0x46]) && startsWith(buf, [0x57, 0x45, 0x42, 0x50], 8);
    case ".xlsx":
    case ".docx":
      return startsWith(buf, ZIP);
    case ".xls":
    case ".doc":
      return startsWith(buf, OLE);
    case ".csv":
    case ".txt": {
      const sample = buf.subarray(0, 8192);
      if (sample.includes(0)) return false;
      try {
        new TextDecoder("utf-8", { fatal: true }).decode(sample.subarray(0, sample.length - 4));
        return true;
      } catch {
        // Aceita planilhas exportadas em Latin-1/Windows-1252 (comum no Excel em português).
        return sample.every((b) => b === 9 || b === 10 || b === 13 || b >= 32);
      }
    }
    default:
      return false;
  }
}

/** Remove caminhos, caracteres de controle e nomes perigosos. */
export function sanitizeFilename(name: string) {
  const ext = fileExtension(name);
  const base = name
    .slice(0, name.length - ext.length)
    .split(/[\\/]/)
    .pop()!
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._ -]/g, "")
    .replace(/^[.\s-]+/, "")
    .trim()
    .slice(0, 80);
  return `${base || "anexo"}${ext}`;
}

export async function validateFiles(
  entries: FormDataEntryValue[],
): Promise<{ ok: true; files: ValidatedFile[] } | { ok: false; message: string }> {
  const files = entries.filter((e): e is File => typeof e !== "string" && e.size > 0);
  if (files.length > UPLOAD_LIMITS.maxFiles)
    return { ok: false, message: `Envie no máximo ${UPLOAD_LIMITS.maxFiles} arquivos.` };

  let total = 0;
  const result: ValidatedFile[] = [];
  for (const file of files) {
    const ext = fileExtension(file.name);
    if (!(ACCEPTED_EXTENSIONS as readonly string[]).includes(ext))
      return { ok: false, message: `Tipo de arquivo não aceito: ${sanitizeFilename(file.name)}.` };
    if (file.size > UPLOAD_LIMITS.maxFileBytes)
      return { ok: false, message: `Cada arquivo deve ter até ${formatBytes(UPLOAD_LIMITS.maxFileBytes)}.` };
    total += file.size;
    if (total > UPLOAD_LIMITS.maxTotalBytes)
      return { ok: false, message: `O total de anexos deve ser de até ${formatBytes(UPLOAD_LIMITS.maxTotalBytes)}.` };

    const content = Buffer.from(await file.arrayBuffer());
    if (!matchesSignature(ext, content))
      return {
        ok: false,
        message: `O conteúdo de "${sanitizeFilename(file.name)}" não corresponde ao tipo informado.`,
      };
    result.push({ filename: sanitizeFilename(file.name), contentType: MIME[ext], size: file.size, content });
  }
  return { ok: true, files: result };
}
