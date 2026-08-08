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

---

## Anomalías conocidas de `bvc_diario.csv`

Encontradas al escribir el capítulo 4 (2026-08-08). **No se corrigen en el
archivo**: se declaran aquí y el capítulo 4 las convierte en material —la
sección 3 las diagnostica con código y un ejercicio pide decidir qué hacer con
ellas—. Limpiar el panel en silencio enseñaría que los datos llegan limpios.

- **101 ruedas de 1 916 (5,3 %) sin variación en ninguno de los cuatro
  precios.** El panel se cruza por fechas comunes con el ETF `ICOLCAP.CL`, que
  cotiza días en que las acciones no registran negociación efectiva y Yahoo
  arrastra el cierre anterior. Se concentran en 2018-2019 y 2022. Diluyen la
  volatilidad estimada: excluirlas la sube de 1,5764 % a 1,6197 % diaria.
- **19 y 20 de febrero de 2025: cotización defectuosa.** Los cuatro emisores
  caen entre 10 % y 20 % el 19 y recuperan lo mismo el 20, mientras el ETF que
  los replica sube 1,5 % y 2,0 %. Un desplome real habría arrastrado al ETF.
  Excluir el par mueve la volatilidad de 1,5764 % a 1,4963 %, el VaR histórico
  al 99 % de la muestra completa de 4,077 % a 4,037 %, y el de la ventana de
  250 ruedas de 4,294 % a 3,858 %.

El diagnóstico que las delata —comparar el rendimiento del portafolio con el
del índice que lo replica— está implementado en la sección 3 del capítulo 4.
