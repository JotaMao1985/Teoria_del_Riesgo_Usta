# Manifiesto de los datos congelados

Generado por `datos/descargar.py`. **No edite este archivo a mano**: se
reescribe entero en cada descarga.

El SHA-256 es lo que permite reponer una instantánea sin adivinar qué había
dentro, y lo que delata que un archivo cambió bajo los pies del material.

> ⚠️ **La instantánea la congela git, no el guion.** Yahoo recalcula los precios
> ajustados hacia atrás con cada dividendo, así que volver a descargar produce
> una instantánea *equivalente*, no *idéntica* — se midieron 24 celdas distintas
> de 9585, de un peso cada una. Después de reponer datos hay que correr
> `verificar.py --con-salidas` y actualizar los `#>` que se hayan movido.

## `bvc_diario.csv`

- **Fuente:** Yahoo Finance vía yfinance · cierre ajustado · ECOPETROL.CL, BOGOTA.CL, GRUPOSURA.CL, ISA.CL, ICOLCAP.CL
- **Descargado:** 2026-08-07
- **Contenido:** 1917 filas · 2018-01-02 → 2025-12-30
- **Tamaño:** 74 KB
- **SHA-256:** `a85a47257ae6b4ab6c38bc881f8b9fd22a72b28b8144f8a0a34605a317ab2246`

## `german_credit.csv`

- **Fuente:** UCI German Credit vía OpenML (credit-g, v1)
- **Descargado:** 2026-08-07
- **Contenido:** 1000 filas · 21 columnas · {'good': 700, 'bad': 300}
- **Tamaño:** 136 KB
- **SHA-256:** `38b6dbf6fb4b0311a3ffc005730f42623128591fb36473ab3c22d270c0467632`

## `perdidas_operativas.csv`

- **Fuente:** evir::danish · incendios daneses 1980–1990
- **Descargado:** 2026-08-07
- **Contenido:** 2167 siniestros · millones de coronas de 1985
- **Tamaño:** 33 KB
- **SHA-256:** `6e6cd3bc77d06a448065bca765b0e5f1138758197088a77f7457d805404c1820`

## `sp500_diario.csv`

- **Fuente:** Yahoo Finance vía yfinance · índice ^GSPC
- **Descargado:** 2026-08-07
- **Contenido:** 2010 filas · 2018-01-02 → 2025-12-30
- **Tamaño:** 40 KB
- **SHA-256:** `c076615810ce6fb5a0e0c80e274f4821fa06f060f83af59c9c5de825c635cb7a`

## `curva_tes.csv` — PENDIENTE

Curva cero cupón de los TES, cortes mensuales. Bloquea los capítulos 9 y 10.

No se descarga desde aquí porque el Banco de la República no expone la serie
por un extremo estable que un guion pueda invocar. Hay que bajarla a mano de
las estadísticas del emisor y anotar en este archivo la fecha, la ruta exacta
y el SHA-256 resultante.
