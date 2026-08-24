import type {
  CoverType,
  NotebookType,
  Orientation,
  PaperColor,
  PrintMode,
  QuoteInput,
  Rounding,
  Size
} from "./types";

export const PAPER_PRICES: Record<PaperColor, number> = {
  marfil: 0.0313,
  blanco: 0.0211
};

export const PRINT_PRICES: Record<PrintMode, number> = {
  bn: 0.05,
  color: 0.10
};

export const RING_BY_SIZE: Record<Size, Record<Orientation, { fraction: number; mode: "simple" | "doble" | "none" }>> = {
  A4: {
    horizontal: { fraction: 0, mode: "none" },
    vertical: { fraction: 1, mode: "doble" }
  },
  A5: {
    horizontal: { fraction: 0.5, mode: "simple" },
    vertical: { fraction: 1, mode: "doble" }
  },
  A6: {
    horizontal: { fraction: 0.5, mode: "simple" },
    vertical: { fraction: 0.5, mode: "simple" }
  },
  A7: {
    horizontal: { fraction: 0.25, mode: "simple" },
    vertical: { fraction: 0, mode: "none" }
  }
};

export const LABOR = {
  anilladoSimple: 0.10,
  anilladoDoble: 0.20,
  entapadoDura: 0.50,
  hojaPerforadaSimple: 0.005,
  hojaPerforadaDoble: 0.01,
  portadaDuraSimple: 0.10,
  portadaDuraDoble: 0.20,
  portadaBlandaSimple: 0.025,
  portadaBlandaDoble: 0.05,
  pasaje2: 6.0,
  pasaje3Plus: 2.0
} as const;

export const COVER_MATERIAL: Record<CoverType, { name: string; unitCost: number }> = {
  dura: { name: "Cartón paja A5", unitCost: 0.15 },
  blanda: { name: "Foldcote impreso", unitCost: 2.00 }
};

export const ADHESIVE_PRINT = {
  one: 2.50,
  moreThan50: 2.20
};

export const FOLDCOTE_PRINT = {
  one: 2.00,
  moreThan50: 1.80
};

export const LAMINATION_TIERS = [
  { min: 50, price: 0.30 },
  { min: 10, price: 0.50 },
  { min: 3, price: 1.00 },
  { min: 2, price: 1.50 },
  { min: 1, price: 2.00 }
] as const;

export const COVER_CAPACITY: Record<Size, { sa3: number; foldcote: number }> = {
  A4: { sa3: 1, foldcote: 2 },
  A5: { sa3: 2, foldcote: 4 },
  A6: { sa3: 4, foldcote: 8 },
  A7: { sa3: 8, foldcote: 16 }
};

export function getPrintPrice(
  printMode: PrintMode,
  size: Size
): number {
  const basePrice = PRINT_PRICES[printMode];

  const divisor: Record<Size, number> = {
    A4: 1,
    A5: 2,
    A6: 4,
    A7: 8
  };

  return basePrice / divisor[size];
}

export function getPaperPrice(
  paperColor: PaperColor,
  size: Size
) : number {
  const basePrice = PAPER_PRICES[paperColor];

  const divisor: Record<Size, number> = {
    A4: 1,
    A5: 2,
    A6: 4,
    A7: 8
  }

  return basePrice / divisor[size];
}

export function getCardboardPrice(size: Size): number {
  const basePrice = COVER_MATERIAL.dura.unitCost;

  const multiplier: Record<Size, number> = {
    A4: 2,
    A5: 1,
    A6: 0.5,
    A7: 0.25
  };

  return basePrice * multiplier[size];
}

export function ceilDiv(a: number, b: number): number {
  return Math.ceil(a / b);
}

export function coverPrintUnitCost(coverType: CoverType, totalPrintSheets: number): number {
  if (coverType === "dura") {
    return totalPrintSheets > 50 ? ADHESIVE_PRINT.moreThan50 : ADHESIVE_PRINT.one;
  }
  return totalPrintSheets > 50 ? FOLDCOTE_PRINT.moreThan50 : FOLDCOTE_PRINT.one;
}

export function laminationUnitCost(totalLaminationSheets: number): number {
  return LAMINATION_TIERS.find((tier) => totalLaminationSheets >= tier.min)?.price ?? 2;
}

export function roundToQuarter(value: number, mode: Rounding): number {
  if (mode === "none") return value;
  const factor = 4;
  if (mode === "up") return Math.ceil(value * factor - 1e-9) / factor;
  return Math.floor(value * factor + 1e-9) / factor;
}

export function ringLaborCost(mode: "simple" | "doble" | "none"): number {
  if (mode === "simple") return LABOR.anilladoSimple;
  if (mode === "doble") return LABOR.anilladoDoble;
  return 0;
}

export function perforationLaborCost(mode: "simple" | "doble" | "none", sheets: number): number {
  if (mode === "simple") return sheets * LABOR.hojaPerforadaSimple;
  if (mode === "doble") return sheets * LABOR.hojaPerforadaDoble;
  return 0;
}

export function coverLaborCost(mode: "simple" | "doble" | "none", coverType: CoverType): number {
  if (mode === "none") return 0;
  if (coverType === "dura") {
    return mode === "simple" ? LABOR.portadaDuraSimple : LABOR.portadaDuraDoble;
  }
  return mode === "simple" ? LABOR.portadaBlandaSimple : LABOR.portadaBlandaDoble;
}

export function calculateQuote(input: QuoteInput) {
  const {
    quantity,
    type,
    size,
    orientation,
    coverType,
    sheets,
    printedPages,
    ringPrice,
    paperColor,
    printMode,
    rounding
  } = input;

  if (quantity < 1 || sheets < 1 || printedPages < 0) {
    throw new Error("Los valores de cantidad, hojas y páginas deben ser válidos.");
  }

  const ringRule = RING_BY_SIZE[size][orientation];
  const ringCountPerNotebook = ringRule.fraction;
  const ringCost = ringCountPerNotebook * ringPrice;

  const paperUnitPrice = getPaperPrice(paperColor, size);
  const paperCost = sheets * paperUnitPrice;

  const printUnitPrice = getPrintPrice(printMode, size);
  const printCost = printedPages * printUnitPrice;

  const coverCapacity = COVER_CAPACITY[size][coverType === "dura" ? "sa3" : "foldcote"];
  const coverPrintSheets = ceilDiv(2 * quantity, coverCapacity);
  const coverPrintUnit = coverPrintUnitCost(coverType, coverPrintSheets);

  // Cada hoja de impresión de portada contiene varias portadas.
  const coverMaterialCostTotal = coverPrintSheets * coverPrintUnit;

  // Para tapa dura, el cartón paja se calcula como 2 portadas por libreta.
  // El precio proporcionado corresponde a una pieza A5; se conserva como
  // referencia unitaria para cada portada.
  const cardboardUnitPrice = getCardboardPrice(size);

  const cardboardTotal = coverType === "dura" ? quantity * 2 * cardboardUnitPrice : 0;

  const laminationSheets = coverPrintSheets;
  const laminationUnit = laminationUnitCost(laminationSheets);
  const laminationTotal = laminationSheets * laminationUnit;

  const unitCoverCost =
    (coverMaterialCostTotal + cardboardTotal + laminationTotal) / quantity;

  const unitMaterialCost = paperCost + printCost + ringCost + unitCoverCost;

  const sheetLabor = perforationLaborCost(ringRule.mode, sheets);
  const coverLabor = coverLaborCost(ringRule.mode, coverType);
  const bindingLabor = type === "anillada" ? ringLaborCost(ringRule.mode) : 0;
  const hardCoverLabor = coverType === "dura" ? LABOR.entapadoDura : 0;

  // Los pasajes se calculan según las impresiones de portada requeridas.
  const passCostTotal = coverPrintSheets === 2
    ? LABOR.pasaje2
    : coverPrintSheets >= 3
      ? LABOR.pasaje3Plus
      : 0;

  const unitLaborCost = sheetLabor + coverLabor + bindingLabor + hardCoverLabor;

  const baseUnitCost = (unitMaterialCost * 2) + unitLaborCost;

  // Regla indicada por el usuario:
  // < 12: multiplicador quantity + 1.
  // >= 12: quantity + un adicional por cada bloque/fracción de 12.
  const extraUnits = quantity < 12 ? 1 : Math.ceil(quantity / 12);

  let adjustedUnitPrice = ( ( baseUnitCost * (quantity + extraUnits) ) + passCostTotal) / quantity;

  let roundedUnitPrice = roundToQuarter(
    adjustedUnitPrice,
    rounding
  );

  const totalQuote = ( roundedUnitPrice * quantity );

  const paperLabel = paperColor === "marfil" ? "Hoja A4 75g marfil" : "Hoja A4 75g blanco";
  const printLabel = printMode === "bn" ? "Impresión página A4 B/N" : "Impresión página A4 Color";

  const items = [
    {
      name: paperLabel,
      quantity: sheets,
      unitCost: paperUnitPrice,
      total: paperCost
    },
    {
      name: printLabel,
      quantity: printedPages,
      unitCost: printUnitPrice,
      total: printCost
    },
    ...(type === "anillada" && ringCountPerNotebook > 0
      ? [{
          name: "Anilla seleccionada",
          quantity: ringCountPerNotebook,
          unitCost: ringPrice,
          total: ringCost
        }]
      : []),
    ...(coverType === "dura"
      ? [{
          name: "Cartón paja A5",
          quantity: 2,
          unitCost: COVER_MATERIAL.dura.unitCost,
          total: 2 * COVER_MATERIAL.dura.unitCost
        }]
      : []),
    {
      name: coverType === "dura" ? "Impresión Adhesivo SA3" : "Impresión foldcote",
      quantity: coverPrintSheets / quantity,
      unitCost: coverPrintUnit,
      total: coverMaterialCostTotal / quantity,
      note: `${coverPrintSheets} impresión(es) para ${quantity} libreta(s)`
    },
    {
      name: "Plastificación",
      quantity: laminationSheets / quantity,
      unitCost: laminationUnit,
      total: laminationTotal / quantity
    }
  ];

  const laborItems = [
    ...(type === "anillada" && bindingLabor > 0
      ? [{
          name: ringRule.mode === "simple" ? "Anillado simple" : "Anillado doble",
          quantity: 1,
          unitCost: bindingLabor,
          total: bindingLabor
        }]
      : []),
    ...(sheetLabor > 0
      ? [{
          name: ringRule.mode === "simple" ? "Hoja perforada simple" : "Hoja perforada doble",
          quantity: sheets,
          unitCost: ringRule.mode === "simple" ? LABOR.hojaPerforadaSimple : LABOR.hojaPerforadaDoble,
          total: sheetLabor
        }]
      : []),
    ...(coverLabor > 0
      ? [{
          name: coverType === "dura"
            ? (ringRule.mode === "simple" ? "Portada dura perforada simple" : "Portada dura perforada doble")
            : (ringRule.mode === "simple" ? "Portada blanda perforada simple" : "Portada blanda perforada doble"),
          quantity: 1,
          unitCost: coverLabor,
          total: coverLabor
        }]
      : []),
    ...(hardCoverLabor > 0
      ? [{
          name: "Entapado tapa dura",
          quantity: 1,
          unitCost: hardCoverLabor,
          total: hardCoverLabor
        }]
      : [])
  ];

  return {
    unitMaterialCost,
    unitLaborCost,
    baseUnitCost,
    adjustedUnitPrice,
    roundedUnitPrice,
    totalQuote,
    overageUnits: extraUnits,
    coverPrintSheets,
    coverPrintTrips: coverPrintSheets >= 3 ? 3 : coverPrintSheets,
    laminationSheets,
    ringEquivalent: ringCountPerNotebook,
    ringCountPerNotebook,
    items,
    laborItems
  };
}