import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cotización de Libretas",
  description: "Calculadora modular de costos para libretas anilladas y cosidas."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}