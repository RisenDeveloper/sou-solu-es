import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = "left",
  tone = "light",
  id,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  id?: string;
}) {
  const center = align === "center";
  return (
    <div className={`reveal max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
      <p className={`eyebrow ${tone === "dark" ? "text-brand-300" : ""} ${center ? "justify-center" : ""}`}>{eyebrow}</p>
      <h2
        id={id}
        className={`mt-4 font-display text-3xl leading-[1.12] font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] ${
          tone === "dark" ? "text-white" : "text-ink-950"
        }`}
      >
        {title}
      </h2>
      {children && (
        <p className={`mt-5 text-lg leading-relaxed ${tone === "dark" ? "text-white/70" : "text-ink-500"}`}>{children}</p>
      )}
    </div>
  );
}
