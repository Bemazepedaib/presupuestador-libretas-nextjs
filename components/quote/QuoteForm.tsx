"use client";

import { useMemo, useState } from "react";
import { calculateQuote, RING_BY_SIZE } from "@/lib/pricing";
import type { CoverType, NotebookType, Orientation, PaperColor, PrintMode, QuoteInput, Rounding, Size } from "@/lib/types";
import { InputField } from "../ui/InputField";
import { SelectField } from "../ui/SelectField";
import { QuoteSummary } from "./QuoteSummary";

const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2
});

export function QuoteForm() {
  const [form, setForm] = useState<QuoteInput>({
    quantity: 10,
    type: "anillada",
    size: "A5",
    orientation: "vertical",
    coverType: "blanda",
    sheets: 50,
    printedPages: 0,
    ringPrice: 0.5504,
    paperColor: "blanco",
    printMode: "bntinta",
    rounding: "none"
  });

  const result = useMemo(() => {
    try {
      return calculateQuote(form);
    } catch {
      return null;
    }
  }, [form]);

  const ringMode = RING_BY_SIZE[form.size][form.orientation].mode;

  function update<K extends keyof QuoteInput>(key: K, value: QuoteInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleNumber(key: "quantity" | "sheets" | "printedPages" | "ringPrice", value: string) {
    const parsed = Number(value);
    update(key, Number.isFinite(parsed) ? parsed : 0);
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            Herramienta de producción
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Presupuestador de libretas
          </h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            Calcula materiales, mano de obra, pasajes, margen por producción y precio final por presupuesto.
          </p>
        </header>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_430px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Datos del trabajo</h2>
                <p className="text-sm text-slate-500">Ingresa los parámetros de producción.</p>
              </div>
              <button
                type="button"
                onClick={() => window.print()}
                className="no-print hidden rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 sm:block"
              >
                Imprimir presupuesto
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <InputField
                label="Cantidad de libretas"
                type="number"
                min={1}
                step={1}
                value={form.quantity}
                onChange={(e) => handleNumber("quantity", e.target.value)}
              />

              <SelectField
                label="Tipo de libreta"
                value={form.type}
                onChange={(e) => update("type", e.target.value as NotebookType)}
                options={[
                  { value: "anillada", label: "Anillada" },
                  { value: "cosida", label: "Cosida" }
                ]}
                help={form.type === "cosida" ? "La información de costos de cosido no fue proporcionada; se omite el anillado." : undefined}
              />

              <SelectField
                label="Tamaño"
                value={form.size}
                onChange={(e) => update("size", e.target.value as Size)}
                options={["A4", "A5", "A6", "A7"].map((size) => ({ value: size, label: size }))}
              />

              <SelectField
                label="Orientación del anillado"
                value={form.orientation}
                onChange={(e) => update("orientation", e.target.value as Orientation)}
                options={[
                  { value: "horizontal", label: "Horizontal" },
                  { value: "vertical", label: "Vertical" }
                ]}
                help={ringMode === "none" ? "Esta combinación no utiliza anilla." : `${ringMode === "simple" ? "Anillado simple" : "Anillado doble"} · ${RING_BY_SIZE[form.size][form.orientation].fraction} anilla equivalente`}
              />

              <SelectField
                label="Tipo de portada"
                value={form.coverType}
                onChange={(e) => update("coverType", e.target.value as CoverType)}
                options={[
                  { value: "blanda", label: "Tapa blanda — Foldcote" },
                  { value: "dura", label: "Tapa dura — Cartón paja + SA3" }
                ]}
              />

              <InputField
                label="Cantidad de hojas"
                type="number"
                min={1}
                step={1}
                value={form.sheets}
                onChange={(e) => handleNumber("sheets", e.target.value)}
                help="Hojas físicas, no páginas."
              />

              <InputField
                label="Páginas impresas"
                type="number"
                min={0}
                step={1}
                value={form.printedPages}
                onChange={(e) => handleNumber("printedPages", e.target.value)}
                help={`Máximo recomendado: ${form.sheets * 2} páginas para ${form.sheets} hojas.`}
              />

              <SelectField
                label="Precio de la anilla"
                value={form.ringPrice}
                onChange={(e) => update("ringPrice", Number(e.target.value))}
                options={[
                  { value: "1.012", label: "7/8″ — S/ 1.012" },
                  { value: "0.5504", label: "9/16″ — S/ 0.5504" },
                  { value: "0.381", label: "7/16″ — S/ 0.381" },
                ]}
                help="Ingresa el tamaño de la medida de anilla."
              />

              <SelectField
                label="Papel"
                value={form.paperColor}
                onChange={(e) => update("paperColor", e.target.value as PaperColor)}
                options={[
                  { value: "blanco", label: "A4 75g blanco — S/ 0.0211" },
                  { value: "marfil", label: "A4 75g marfil — S/ 0.0313" }
                ]}
              />

              <SelectField
                label="Impresión de hojas"
                value={form.printMode}
                onChange={(e) => update("printMode", e.target.value as PrintMode)}
                options={[
                  { value: "bntinta", label: "B/N Tinta — S/ 0.02 por página" },
                  { value: "bnlaser", label: "B/N Láser — S/ 0.05 por página" },
                  { value: "color", label: "Color — S/ 0.10 por página" }
                ]}
              />

              <SelectField
                label="Redondeo final"
                value={form.rounding}
                onChange={(e) => update("rounding", e.target.value as Rounding)}
                options={[
                  { value: "none", label: "Sin redondeo" },
                  { value: "up", label: "Hacia arriba — múltiplo de S/ 0.25" },
                  { value: "down", label: "Hacia abajo — múltiplo de S/ 0.25" }
                ]}
              />
            </div>
          </section>

          <QuoteSummary result={result} input={form} money={money} />
        </div>
      </div>
    </main>
  );
}