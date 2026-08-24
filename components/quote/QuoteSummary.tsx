import type { QuoteInput, QuoteResult } from "@/lib/types";

interface Props {
  result: QuoteResult | null;
  input: QuoteInput;
  money: Intl.NumberFormat;
}

export function QuoteSummary({ result, input, money }: Props) {
  if (!result) {
    return (
      <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <h2 className="font-bold">Revisa los datos</h2>
        <p className="mt-1 text-sm">Hay valores inválidos para realizar el cálculo.</p>
      </aside>
    );
  }

  return (
    <aside className="print-card rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="border-b border-slate-200 pb-5">
        <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Resultado</p>
        <h2 className="mt-1 text-2xl font-black text-slate-950">Presupuesto</h2>
        <div className="mt-4 rounded-2xl bg-indigo-600 p-5 text-white">
          <p className="text-sm text-indigo-100">Precio final del presupuesto por {String(input.quantity)} libretas</p>
          <p className="mt-1 text-4xl font-black">{money.format(result.totalQuote)}</p>
          <p className="text-sm text-indigo-100 font-black">Costo unitario redondeado {money.format(result.roundedUnitPrice)}</p>
          <p className="mt-2 text-xs text-indigo-100">
            Incluye el multiplicador de producción y el redondeo seleccionado.
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Metric label="Costo materiales" value={money.format(result.unitMaterialCost)} />
          <Metric label="Mano de obra" value={money.format(result.unitLaborCost)} />
          <Metric label="Costo base" value={money.format(result.baseUnitCost)} />
          <Metric label="Costo ajustado" value={money.format(result.adjustedUnitPrice)} />
        </div>
      </div>

      <Section title="Datos calculados">
        <Row label="Libretas" value={String(input.quantity)} />
        <Row label="Hojas por libreta" value={String(input.sheets)} />
        <Row label="Páginas impresas" value={String(input.printedPages)} />
        <Row label="Impresiones de portada" value={String(result.coverPrintSheets)} />
        <Row label="Laminaciones" value={String(result.laminationSheets)} />
        <Row label="Adicionales de producción" value={String(result.overageUnits)} />
      </Section>

      <Section title="Materiales por libreta">
        {result.items.map((item) => (
          <Row
            key={item.name}
            label={`${item.name}${item.note ? ` · ${item.note}` : ""}`}
            value={money.format(item.total)}
          />
        ))}
      </Section>

      <Section title="Mano de obra por libreta">
        {result.laborItems.length ? result.laborItems.map((item) => (
          <Row
            key={item.name}
            label={`${item.name}${item.note ? ` · ${item.note}` : ""}`}
            value={money.format(item.total)}
          />
        )) : <p className="text-sm text-slate-500">Sin mano de obra configurada para esta combinación.</p>}
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">{title}</h3>
      <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
        {children}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-3 py-2.5 text-sm">
      <span className="min-w-0 text-slate-600">{label}</span>
      <span className="shrink-0 font-semibold text-slate-900">{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-900">{value}</p>
    </div>
  );
}