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

## `curva_tes.csv`

- **Fuente:** Banco de la República · SUAMECA, servicio REST · series 15272–15285 (plan BETAS_TASAS_TES) · SEN y MEC con cálculos del Banco
- **Descargado:** 2026-09-29
- **Contenido:** 276 meses · 2003-01-31 → 2025-12-30 · vértices de 1, 5 y 10 años en pesos y en UVR + parámetros de Nelson-Siegel · corte UVR distinto del de pesos en 32 meses
- **Tamaño:** 26 KB
- **SHA-256:** `72c0eff2129b6c0e8dabd009aa03ebcd3a0f8b05935ae6cb9f63e9f9d4d8df27`

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

## `sen_tes_dic2025.csv`

- **Fuente:** Banco de la República · cierres puntuales del Sistema Electrónico de Negociación (SEN), diciembre de 2025 · https://www.banrep.gov.co/sites/default/files/CierrespuntualesDiciembre2025.zip
- **Descargado:** 2026-10-01
- **Contenido:** 6199 operaciones de contado (rueda CONH) de 16 TES tasa fija, de 14624 cierres del mes · 20 ruedas · 2025-12-01 → 2025-12-30 · el Excel de origen tiene SHA-256 `ec677aee12ea041d692391a1c8fdbefa7c4394db6b0f852cea016c990e566b9d`
- **Tamaño:** 419 KB
- **SHA-256:** `18ec3584c120323f621027e09d4b89b012254146f6755a593e752c32f19c1f44`

## `sp500_diario.csv`

- **Fuente:** Yahoo Finance vía yfinance · índice ^GSPC
- **Descargado:** 2026-08-07
- **Contenido:** 2010 filas · 2018-01-02 → 2025-12-30
- **Tamaño:** 40 KB
- **SHA-256:** `c076615810ce6fb5a0e0c80e274f4821fa06f060f83af59c9c5de825c635cb7a`

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

---

## Advertencias de `curva_tes.csv`

Medidas al congelarla (2026-09-29) sobre los 276 cortes del archivo. Como las
del panel, **no se corrigen**: se declaran, y el capítulo que use la curva las
hereda.

- **No es una curva entera: son tres vértices.** El Banco publica la tasa cero
  cupón a 1, 5 y 10 años, en pesos y en UVR, y los parámetros de Nelson-Siegel
  con que la calcula. Cualquier otro plazo es una reconstrucción, y hay que
  decir con qué.
- **τ no se estima: está fijo** en 3,7 años para pesos y 2,3 para UVR en los
  276 meses. Con τ fijo, los tres vértices determinan exactamente los tres β
  —el sistema 3×3 tiene número de condición 38,8 en pesos y 27,1 en UVR—, así
  que Nelson-Siegel sobre estos datos es una interpolación y su error de ajuste
  es cero por construcción.
- **Los parámetros de pesos se publican en fracción y con dos decimales**:
  `b0_pesos` = 0.12 es un 12 %, con resolución de un punto porcentual.
  Reconstruir los vértices con ellos se equivoca 0,29 pp en promedio y 0,93 pp
  en el peor corte (5 años, 2018-03-28), y pasa de 0,25 pp en 176 de los 276
  meses. Los de UVR van en porcentaje y reconstruyen sus vértices con 0,004 pp.
  Resolver el sistema 3×3 con τ = 3,7 devuelve los β de pesos que reproducen
  los vértices exactos.
- **Y el redondeo no lo explica todo antes de 2019.** Desde el 4 de marzo de
  2019 los β recuperados y los publicados no se separan más de 0,52 pp, lo que
  cabe en los dos redondeos juntos: el de los β a un punto, 0,5, y el de los
  vértices a centésimas, que mueve los β recuperados hasta 0,06 · 0,04 · 0,13 pp.
  Antes llegan a 0,82 · 0,92 · 1,76 pp en β₀ · β₁ · β₂, así que en la historia
  vieja parámetros y vértices no salen del mismo cálculo. El archivo no permite
  saber por qué. Lo mide el bloque de la sección 5 del capítulo 9.
- **La capitalización no está declarada, pero los precios la deciden: es
  efectiva anual.** La ficha de SUAMECA dice «Porcentaje» y nada más, y el
  documento con que el Banco fundó la curva —Arango, Melo y Vásquez (2002),
  *Borradores de Economía* 196, ec. A.1.2.3— descontaba en continua. La serie de
  hoy no se comporta así: valorados con la curva del 2025-09-30, diez TES tasa
  fija salen con −8 pb de error medio frente a sus tasas del SEN en el tramo
  2030–2033 si se lee efectiva, y con +56 pb si se lee continua (+81 en los
  diez). Lo mide el bloque de contraste de la sección 1 del capítulo 9. No es un
  detalle: el 2025-12-30 un cero a diez años vale 29,12 por cada 100 leído en
  efectiva y 26,90 leído en continua.
- **La serie de pesos cambia de método el 4 de marzo de 2019.** Según nota
  aclaratoria del Banco, un ajuste metodológico de mayo de 2021 recalculó la
  historia de pesos desde esa fecha, y no la anterior. La ventana del curso
  (2018–2025) cruza la ruptura, aunque en los cortes mensuales no se ve un salto.
- **Uso informativo, no de valoración.** Otra nota aclaratoria, vigente desde
  2023: las tasas TES del Banco no están pensadas para valorar portafolios, y
  para eso remite a los proveedores de precios. El curso las usa como curva de
  referencia declarada, no como precio oficial del tramo de TES.
- **El corte UVR lleva su propia fecha** (`fecha_uvr`). La serie UVR tiene 548
  días sin dato, casi todos entre 2006 y 2013, y en 32 meses su último dato cae
  entre 1 y 10 días antes que el de pesos.
- **La serie diaria, que no se congela, tiene un día roto**: el 2009-06-23 el
  vértice de pesos a un año vale 0,51 %, entre 5,74 % y 5,63 %. No toca ningún
  corte mensual; quien congele la diaria tiene que decidir qué hace con él.

---

## Advertencias de `sen_tes_dic2025.csv`

Medidas al congelarlo (2026-10-01) sobre sus 6 199 operaciones. Tampoco se
corrigen: se declaran.

- **Es un mes y es una selección.** El Excel del Banco trae los 14 624 cierres
  de diciembre de 2025, de contado y de simultáneas, de TES en pesos y en UVR.
  Se congelan las operaciones de contado (rueda `CONH`) de TES tasa fija en
  pesos —nemotécnico `TFIT`—: dieciséis referencias, de agosto de 2026 a marzo
  de 2058, en veinte ruedas. El 8 de diciembre, lunes, no hay rueda, porque es
  festivo en Colombia: un calendario que solo descuente los fines de semana lo
  daría por hábil. Tampoco la hay el 31, que no es festivo de ley y que la Bolsa
  de Valores de Colombia ha declarado día no bursátil.
- **El cupón no viene, pero se recupera del archivo.** El nemotécnico trae el
  vencimiento —`TFIT16181034` vence el 18/10/2034— y no la tasa. El contravalor
  sí la trae escondida: `contravalor / nominal × 100` es el precio sucio, el
  sucio menos el limpio son los intereses causados, y esos intereses sobre los
  días desde el último cupón, por 365, devuelven el cupón. La mediana de cada
  referencia cae a menos de una milésima de punto de un cuarto de punto
  —7,25 % en la de 2034, 6,00 % en la de 2028—.
- **Precio y TIR van con tres decimales, y no siempre redondeados.** En 174
  operaciones la TIR publicada queda entre 0,07 y 0,10 pb por debajo de la que
  da su precio, que es lo que deja un truncamiento. Quien contraste una
  convención con este archivo tiene que darle una milésima de holgura a cada
  cifra publicada; sin ella se le caen operaciones que están bien.
- **Los días se cuentan en NL/365 sobre las fechas del título sin ajustar.** Con
  esa holgura, el precio y la TIR de las 6 199 operaciones se explican uno al
  otro contando los días reales sin el 29 de febrero, sobre 365. Con Actual/365
  solo cuadran 346 —las de las dos referencias que vencen antes del 29 de
  febrero de 2028, donde las dos convenciones cuentan igual—; con 30/360, el
  10,1 %; con Actual/360, ninguna; y moviendo cada pago al día hábil siguiente
  con los festivos de Colombia, el 29,7 %. La prueba se hace sobre el precio
  sucio que sale del contravalor, y la mide el bloque de la sección 4 del
  capítulo 10.
- **Se liquida el mismo día (T+0).** Los intereses causados que trae el
  contravalor van hasta la fecha de la operación: con un día más se separarían
  0,03 por cada 100 en la mediana, y lo observado no pasa de 0,00005.
