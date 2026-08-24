# Presupuestador de Libretas

Aplicación Next.js + TypeScript + Tailwind CSS para calcular presupuestos de libretas.

## Requisitos

- Node.js 20+
- npm

## Instalación

```bash
npm install
npm run dev
```

Luego abre `http://localhost:3000`.

## Estructura

- `app/`: rutas y estilos globales.
- `components/ui/`: componentes de formulario reutilizables.
- `components/quote/`: formulario y resumen del presupuesto.
- `lib/types.ts`: tipos TypeScript.
- `lib/pricing.ts`: reglas y motor de cálculo.

## Reglas implementadas

- Tamaños A4, A5, A6 y A7.
- Orientación horizontal/vertical.
- Libretas anilladas y cosidas.
- 50, 96 o cualquier número de hojas.
- Tapas blandas con foldcote.
- Tapas duras con cartón paja + adhesivo SA3.
- Impresión B/N o color de las páginas.
- Capacidades de impresión de portadas según tamaño.
- Plastificación por escalas.
- Anillas fraccionadas según tamaño/orientación.
- Mano de obra según perforación, anillado y tapa.
- Pasajes según número de impresiones de portada.
- Fórmula de producción final.
- Redondeo hacia arriba/abajo a S/ 0.25.
- Vista de desglose e impresión del presupuesto.

## Nota sobre las reglas ambiguas

Los datos suministrados contienen algunos puntos que no especifican completamente cómo calcularlos. La implementación usa estas interpretaciones:

1. El precio de impresión de foldcote/SA3 se aplica por cada pliego de impresión necesario para producir las 2 portadas por libreta.
2. La plastificación se aplica por cada pliego de portada impreso.
3. El costo de cartón paja se aplica como S/ 0.15 por cada portada de tapa dura.
4. El pasaje se considera un costo total del trabajo y se distribuye entre las libretas.
5. La fórmula final usa `cantidad + 1` para menos de 12 unidades y `cantidad + ceil(cantidad / 12)` para 12 o más.
6. La opción "cosida" no agrega costo de anillado/perforación porque no se proporcionó una tarifa de costura.
7. Los costos de hoja e impresión interior se muestran como costos por libreta. El costo final aplica exactamente la fórmula indicada, incluido el multiplicador por producción.

Si deseas cambiar cualquiera de estas reglas, basta modificar `lib/pricing.ts`; la interfaz no necesita cambios.
# presupuestador-libretas-nextjs
