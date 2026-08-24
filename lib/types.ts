export type NotebookType = "anillada" | "cosida";
export type Size = "A4" | "A5" | "A6" | "A7";
export type Orientation = "horizontal" | "vertical";
export type CoverType = "dura" | "blanda";
export type PaperColor = "marfil" | "blanco";
export type PrintMode = "bntinta" | "bnlaser" | "color";
export type Rounding = "none" | "up" | "down";

export interface QuoteInput {
  quantity: number;
  type: NotebookType;
  size: Size;
  orientation: Orientation;
  coverType: CoverType;
  sheets: number;
  printedPages: number;
  ringPrice: number;
  paperColor: PaperColor;
  printMode: PrintMode;
  utility: number;
  rounding: Rounding;
}

export interface LineItem {
  name: string;
  quantity: number;
  unitCost: number;
  total: number;
  note?: string;
}

export interface QuoteResult {
  unitMaterialCost: number;
  unitLaborCost: number;
  baseUnitCost: number;
  adjustedUnitPrice: number;
  roundedUnitPrice: number;
  totalQuote: number;
  overageUnits: number;
  coverPrintSheets: number;
  coverPrintTrips: number;
  laminationSheets: number;
  ringEquivalent: number;
  ringCountPerNotebook: number;
  items: LineItem[];
  laborItems: LineItem[];
}