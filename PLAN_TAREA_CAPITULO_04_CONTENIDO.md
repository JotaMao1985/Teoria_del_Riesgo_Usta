# Plan de mejora del contenido del capítulo 4 — borrador para aprobar

> Escrito el 2026-11-13 por la sesión maestra, sobre la línea base del vault (el mismo proceso que los capítulos 1,
> 2 y 3). Archivo: `Material html/04_TDR_Valor_en_riesgo.html`, commit `7951f31`. **Nada de esto está hecho: es la
> propuesta que el docente aprueba, cambia o recorta.**

## Contexto

El capítulo 4 es la **rebanada de referencia del curso**: lo citan el 1, el 2, el 3, el 5, el 6, el 10 y el 12, y su
sección 3 es donde el material trata las anomalías del panel. Enseña el VaR paramétrico (normal y t), el histórico,
el de Montecarlo, el reparto entre posiciones y el escalamiento temporal. Pasa las 24 reglas del verificador con
`--con-salidas`. No tiene **ninguna cita** ni lista de referencias, y lo que la línea base encontró es, como en los
tres anteriores, de **sentido, fuentes y coherencia** — pero aquí con dos contradicciones del capítulo consigo mismo.

| Medida (línea base, 2026-11-13) | Cifra |
|---|---|
| Afirmaciones inventariadas (tres inventarios, fusionados por línea) | 152 (12 citadas, 25 criterio, 55 derivadas, 39 ejecutadas, 4 ilustrativas, 17 sin clasificar) |
| Contradichas por los datos, el código, el repositorio o el propio capítulo | **16** |
| Dudosas o sin poder juzgar sin leer la fuente | 53 |
| Fórmulas sin desarrollar, sin una hipótesis o que no dicen lo que hace su bloque | 15 inventariadas; 9 `Eq` de contenido, 1 `Derivacion`, 0 `Anatomia` |
| Ejercicios con un defecto de contenido | **6 altos**, 12 medios |
| Hilos con otros capítulos que no se cumplen o se cumplen a medias | 26 de 61 |
| `Eq` · `Derivacion` · `Anatomia` · `Cita` | 11 · 1 · 0 · 0 |

El detalle está en el vault (etiqueta `linea-base-c04`; la evidencia y los guiones en `Capítulos/Cap 04 - línea
base/`). Lo más grave, **comprobado por la sesión maestra** sobre `datos/bvc_diario.csv` (`m_chk1.py` a `m_chk4.py`):

1. **La sección 2 argumenta con el dato que la sección 3 invalida** (`:3701` contra `:3865`). La motivación del VaR
   paramétrico usa la caída del 19/2/2025 —el fondo perdió 13,17 %, ocho desviaciones— como prueba de que el mercado
   tiene colas gruesas. Dos secciones después, ese mismo día es «una cotización defectuosa» que el capítulo enseña a
   detectar. La tesis de la sección 2 **se sostiene sin ese día** —quedan 20 pérdidas más allá de −4 % y 35 ruedas
   más allá de ±4 %—, pero hoy descansa sobre él.
2. **La raíz del tiempo: el capítulo aplica al cuantil un factor que es de la volatilidad** (`:4413`, `:3437`). El
   bloque calcula, con las autocorrelaciones, que la varianza de diez días crece un 7,4 % más que diez veces la
   diaria, y la prosa concluye que «el factor real es 3,3972 en vez de 3,1623», es decir que la raíz subestima el
   VaR. Pero el VaR es un cuantil, no una desviación: **el propio bloque imprime que lo medido a diez días es
   11,409 %**, por debajo del 12,893 % de la raíz. El factor que de verdad lleva el VaR de un día al de diez es
   **2,7984**. Son dos efectos de signo contrario —la autocorrelación sube la varianza, la agregación adelgaza la
   cola— y el capítulo solo cuenta el primero. Esto es también lo que lo enfrenta al **capítulo 12**, que mide que la
   raíz sobrestima a seis meses: medido sobre el mismo panel, la razón de varianzas pasa de 1,16 a diez ruedas a 0,60
   a ciento veintiséis.
3. **La convención `w′μ` no se declara, y el capítulo es el primero que lleva sus cifras a pesos** (`:3638`,
   `:4103`). Todas sus cifras salen de `r @ w` y se convierten multiplicando. El VaR histórico del acta, **32 617
   millones**, con el fondo rebalanceado cada rueda y componiendo son **31 025**: 1 592 de diferencia, un 5,1 %. El
   1, el 7 y el 8 ya declaran esto y ponen la columna exacta al lado; el 4 no.
4. **Tres cifras distintas circulan como «el VaR al 99 % a un día del portafolio»** y nada las distingue: 32 617
   (histórico), 29 094 (paramétrico con media) y 29 338 (paramétrico con media cero, que es el de la sección 5 y el
   del cuestionario). Que la sección 5 fije μ = 0 solo lo dice un comentario dentro del código.
5. **El par de febrero de 2025 está mal descrito** (`:3865`, `:3870`): «los cuatro caen entre 10 % y 20 % y recuperan
   exactamente lo mismo» es falso por las dos mitades —caen 9,3 a 18,4 % y suben 12,8 a 22,8 %—. Es la misma frase que
   ya se corrigió en el capítulo 1 y que el manifiesto declara bien.
6. **Seis ejercicios con defecto grave.** El R3 de la sección 6 declara una salida que su código no produce (dice 11,50 % y su código
   imprime 11,60 %: 2,3263 × 1,5763842 × √10 = 11,5965); el R1 de la sección 5 no se puede acertar desde lo mostrado (con la columna
   redondeada que la tabla enseña sale 3 936,59 → 3 937 y la celda espera 3 936, y entonces tampoco cuadra la fila de
   la suma: la zona ciega 4); el R8 ofrece como razón decisiva que «el histórico no se puede escalar a diez días»
   y dos secciones después el capítulo escala precisamente el cuantil histórico; el MCQ de la sección 3 compara el
   paramétrico de la muestra completa con el histórico de 250 ruedas sin fijar la ventana (medido: −5,1 % contra
   −10,5 %, y el paramétrico sobre 250 ruedas cae **−33,7 %**); el R9 pregunta por un cruce que la malla del capítulo
   sitúa en **h = 3** y no en h = 13; y el R5 tiene dos pares de pasos sin anclar.
7. **La ficha de norma cita el SARM y el Capítulo XXI de la Circular Básica Contable y Financiera como vigentes**
   (`:4467`): el SARM pasó al SIAR en 2023 y la circular fue sustituida en 2026. Los capítulos 1 y 2 ya se
   corrigieron. Además, el capítulo da por hecho que al fondo se le exigen pruebas retrospectivas de modelo interno,
   y el capítulo 1 ya verificó con la norma vigente que **una AFP usa el modelo estándar**.
8. **Dos gráficas afirman lo que no muestran.** El histograma de la sección 2 (`:3758`) dice que «a partir de ±4 % la
   normal se desploma varios órdenes de magnitud por debajo de lo que el mercado hizo», y más allá de ±4 % casi todos
   los contenedores están vacíos, así que la normal queda **encima** de la barra; lo que prueba la tesis son las 20
   pérdidas más allá de −4 % y, sobre todo, las **siete ruedas que la gráfica no dibuja** por caer fuera de ±10 %. Y la de los tres cortes (`:4106`) descarta siete ruedas en silencio, cuatro de ellas las
   peores pérdidas del panel.
9. **«101 ruedas sin variación en ningún precio»** (`:3233`): son las ruedas sin variación en los **cuatro
   emisores**; con el ETF incluido son **4**. La etiqueta errónea viaja a un distractor del cuestionario. Y el efecto
   de esas 101 ruedas nunca se mide, aunque el capítulo 3 se lo atribuye al 4 (excluirlas sube la volatilidad de
   1,5764 % a 1,6197 %).
10. **El capítulo 6 usa ν = 4,23 «del capítulo 4» en un backtest que declara sin fuga de información**, y ese ν sale
    de la curtosis de las 1 916 ruedas, posteriores a casi todo lo que el 6 predice. Recalculado, el conteo de
    excepciones no cambia, pero la frase del 6 es falsa y el 4 no avisa.

Afirmaciones sobre el mundo sin respaldo: **«en la evaluación del año pasado, cuatro de cada cinco estudiantes… y
menos de uno de cada tres…»** (`:4546`, dos proporciones precisas en un material que se estrena en 2026-II: es la
misma clase de frase que el capítulo 2 resolvió), «el horizonte que exige el supervisor», «Basilea pide 10 días de
tenencia» dentro del bloque que el alumno audita, y la línea de tiempo (G-30 de 1993, RiskMetrics de 1994, Basilea
de 1996, el FRTB).

## Decisiones que necesita el docente

| | Pregunta | Recomendación |
|---|---|---|
| **C4-A** | ¿Qué se hace con la raíz del tiempo? | **Separar los dos efectos y medirlos**, que es el hallazgo del capítulo. El bloque ya imprime las tres cifras: se le añade el factor medido sobre el cuantil (2,7984) y la prosa dice que la autocorrelación hace crecer la **varianza** un 7,4 % más que la raíz, mientras el **cuantil** a diez días queda un 11,5 % por debajo de lo escalado, porque la cola se adelgaza al agregar. Con eso el capítulo deja de contradecir al 12, que mide lo mismo a seis meses, y el R9 y el pie se reescriben sobre el cruce real (h = 3). |
| **C4-B** | ¿Se declara la convención y se añade la columna exacta? | **Sí, como en los capítulos 1, 7 y 8**: la portada declara que todas las cifras salen de `w′r`, el bloque de la sección 1 imprime al lado la columna exacta del fondo rebalanceado (31 025 contra 32 617) y la prosa dice qué cambia y qué no. Ninguna cifra de la convención se toca: el 2, el 3, el 5, el 6 y el 12 citan varias y seguirían válidas. |
| **C4-C** | ¿Qué se hace con las tres cifras del VaR a un día? | **Una tabla corta en la sección 5** con las tres —histórico 32 617, paramétrico con media 29 094, paramétrico con media cero 29 338— y la frase que hoy falta: cuál usa cada sección y por qué. La decisión de fijar μ = 0 sale del comentario del código a la prosa, que es donde la derivación ya dice que hay que declararla. |
| **C4-D** | ¿La motivación de la sección 2 sigue apoyándose en el 19/2/2025? | **No**: se reescribe sobre marzo de 2020, que es un episodio real y que el capítulo ya usa, y se añade una línea que remite a la sección 3. La tesis no cambia; el ejemplo sí. |
| **C4-E** | ¿Qué fuentes se leen? | Tanda 05, corta: **Basilea 1996** (el marco de modelos internos: VaR al 99 % a diez días y el escalamiento por la raíz) y **Basilea 1996 de backtesting**, **RiskMetrics**, **Artzner (1999)** para la subaditividad y el FRTB, **todas ya en Zotero y ya leídas en los capítulos 1 y 2**: hay **82 pasajes verificados reutilizables**, entre ellos el de Basilea 1996 p. 44 y el de la Circular Básica Financiera. Lo único nuevo sería **Jorion (2007), *Value at Risk*, cap. 7**, que es la fuente natural del VaR marginal, componente e incremental: si el docente tiene el libro, se cita; si no, esa sección se escribe como derivación propia, sin atribuirla. |
| **C4-F** | ¿La ficha de norma? | **Reescribirla con el SIAR y la Circular Básica Financiera** y con lo que el capítulo 1 ya verificó: a una AFP se le exige el **modelo estándar**, y las pruebas retrospectivas son del modelo interno. El capítulo 6, que repite lo mismo, se corrige en la fase 7. |
| **C4-G** | ¿Qué se hace con lo que la línea base encontró **fuera** del capítulo 4? | Lo que es **una línea** se corrige aquí en la fase 7: el aviso de ν = 4,23 para el capítulo 6, la remisión al capítulo 15 (el plan reserva su sección 6 para cópulas; los valores extremos están en las 2 a 5), la del capítulo 12 (no calcula el VaR de una opción por revaluación) y la pregunta 9 del cuestionario, que atribuye al capítulo 7 una maximización que no hace. El **taller 4** se revisa en una sesión aparte, después de este capítulo. |

## Fases

Mismo orden que en los tres anteriores: fuentes antes de la prosa, exactitud antes de la ampliación, y el capítulo
entero antes de la coherencia hacia afuera. Cada fase cierra con el verificador en verde y un commit.

### Fase 0 · Preparación
- Exportar `referencias.json` desde Zotero; `<Referencias />` al final de la evaluación.
- Reunir los 82 pasajes ya verificados que este capítulo puede reutilizar (`pares_verificados.json` del vault).

### Fase 1 · Fuentes
- Tanda 05 (C4-E) por el mismo circuito, si hace falta alguna. Las que ya están leídas se copian con su pasaje,
  como el capítulo 2 hizo con el 1, y **cada par vuelve al verificador independiente hasta quedar en «respalda»**.
- Las 12 citadas pasan a `verificada` o se reescriben; las 53 en `revisar` se resuelven una por una.

### Fase 2 · Exactitud
Las 16 contradichas y los seis ejercicios altos, sin ampliar nada. Una lista cerrada:
- Portada y sección 1: la convención (C4-B); «el horizonte que exige el supervisor» con fuente o como criterio.
- Sección 2: la motivación (C4-D); el pie del histograma sobre lo que se ve y las ocho ruedas que no se dibujan.
- Sección 3: el par de febrero con sus cifras reales; la etiqueta de las 101 ruedas y su efecto medido; «cincuenta
  veces» → 7,7; el MCQ con la ventana fijada.
- Sección 4: «la única de las cinco filas» (el Montecarlo normal también revalúa); las cifras en pesos que no salen
  de ningún bloque.
- Sección 5: las tres cifras (C4-C); el R1 reproducible desde lo mostrado; la fila de la suma; «las cuatro primeras
  se miden en pesos».
- Sección 6: la raíz del tiempo (C4-A); el R3 con la salida que su código produce; el R8; el R9 y el pie sobre h = 3.
- Evaluación: la ficha de norma (C4-F); «la evaluación del año pasado»; la pregunta 9; el R8 en la tabla de IA.

### Fase 3 · Secciones 1 y 2
- El VaR definido con su signo y su horizonte declarados; de dónde sale z = Φ⁻¹ y qué supone.
- La t escalada: por qué se divide por √(ν/(ν−2)), y las condiciones ν > 2 y ν > 4 —con ν̂ = 4,23 el capítulo está al
  borde de que la curtosis no exista, que es justo lo que el capítulo 2 dejó dicho—.
- La fragilidad de ν: con otra ventana el VaR t al 99 % se mueve; el capítulo 1 ya lo advierte y el 4 no.

### Fase 4 · Secciones 3 y 4
- El VaR histórico como **estadístico de orden**, con la interpolación que usa el código (hoy no hay fórmula de
  sección que lo sostenga, y es la cifra principal del capítulo).
- El efecto fantasma con su cuenta; las 101 ruedas medidas.
- Montecarlo: el error estándar de la simulación al lado del resultado (sexta convención del curso), y qué distingue
  de verdad a cada fila de la tabla de métodos.

### Fase 5 · Secciones 5 y 6
- **`Derivacion` del VaR componente**: la varianza de cartera w′Σw, la derivada ∂σₚ/∂wᵢ y el teorema de Euler, que es
  lo que hace que los componentes sumen el total. Hoy se afirma sin mostrarlo.
- **`Anatomia` de las cuatro medidas** (aislado, marginal, componente, incremental) con sus unidades y su cifra.
- El conteo que produce el peso (1 − k/h) de la fórmula del factor, y las dos preguntas que C4-A separa.

### Fase 6 · Portada, cierre y evaluación
- La línea de tiempo con `<Cita>` en cada hito que se pueda leer; lo que no, fuera.
- El `Pipeline` y «Antes de cerrar» con destinos que existen; la tabla de niveles de IA con el R8.
- Volver a medir las reglas 13–17 y las zonas ciegas de forma.

### Fase 7 · Coherencia hacia afuera (C4-G)
- El aviso de ν = 4,23 y la frase del capítulo 6; la ficha del SARM del 6; las remisiones al 12 y al 15; la
  pregunta 9. Lo que no sea una línea va a una sesión aparte.

### Fase 8 · Cierre
- `verificar.py --con-salidas` con las 24 reglas; recorrido en el navegador (las seis secciones, los laboratorios
  barridos, las gráficas con su pie al lado, consola, 375 px).
- Cada pareja cita–pasaje vuelve al verificador hasta quedar en «respalda».
- Un agente con contexto limpio audita **todas las cifras nuevas** del diff que no sean salidas `#>`.
- Las 152 afirmaciones en un estado final; `CLAUDE.md` con lo que el capítulo 4 deja dicho para los otros.

## Auditoría del propio plan (2026-11-13)
Antes de pedir la aprobación, la sesión maestra recalculó sobre el panel todas las cifras de este plan que venían de
los inventarios (`m_chk1.py` a `m_chk5.py`, en la carpeta de la línea base del vault): el factor del cuantil a diez
días (2,7984 contra el 3,3972 de la volatilidad), las razones de varianzas por horizonte, los 31 025 contra 32 617,
las tres cifras del VaR a un día, el par de febrero en simples y en logarítmicos, las 101 ruedas y su efecto, el
cruce de la malla en h = 3, el R1 de la sección 5 y lo que imprime el código del R3. Todas se sostienen. Se
corrigieron tres cosas del borrador: «quedan siete ruedas más allá de ±4 %» (son 35; las siete son las que caen
fuera del rango que el histograma dibuja), el peso del capítulo y lo que crecieron los tres anteriores. Dos cosas
quedan dichas: el conteo de excepciones del capítulo 6 con ν fijo lo midió el inventario C y no lo he rehecho, y la
causa de que la cola adelgace con el horizonte está medida como efecto, no explicada.

## Modelos y agentes
| Trabajo | Quién |
|---|---|
| Redacción, integración, cada punto de control | Sesión maestra (Opus) |
| Verificar cada pareja afirmación–pasaje, en contexto limpio | Opus, esfuerzo alto (D07) |
| Barridos y recálculo de cifras | Sonnet |
| Recorrido en el navegador y medición de pistas | Sesión maestra |

## Peso
El capítulo pesa **340 KB** contra el tope de 420: es el más holgado de los cuatro, con **80 KB** de margen. Los
capítulos 1, 2 y 3 crecieron 48, 24 y 24 KB con un trabajo parecido, así que el presupuesto es de **45 KB** y se
mide al cerrar cada fase.

## Verificación
- Verificador en verde con las 24 reglas, con el intérprete del entorno.
- Toda cifra nueva sale de un bloque ejecutado o de un recálculo archivado en el vault.
- Cada `<Cita>` con su fila en el registro y su pasaje leído; ninguna pareja se queda sin «respalda».
- Ninguna afirmación de la línea base en `revisar`.
- En pantalla: las seis secciones, los dos R3 en los dos lenguajes, el R1 de la sección 5 reproducible a mano, el
  cuestionario con la respuesta (10/10) y con la estrategia de la opción más corta y del «:» (3–4 de 10).
