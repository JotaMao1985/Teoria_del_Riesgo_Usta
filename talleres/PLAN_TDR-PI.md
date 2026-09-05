# Plan del proyecto integrador — `TDR-PI.qmd`
## Teoría del Riesgo · Unidades 1, 2 y 3 · RA1–RA9 · instrumento calificado con defensa oral

> **Estado:** propuesta, pendiente de aprobación. Este documento planifica un instrumento;
> no lo escribe. El plan maestro sigue siendo
> [`PLAN_MATERIAL_TEORIA_DEL_RIESGO.md`](../PLAN_MATERIAL_TEORIA_DEL_RIESGO.md) y este es
> subordinado suyo — concretamente, el tercero de los tres talleres de unidad que la
> tarea 22 contempla, ascendido a proyecto integrador.

---

## 1. Qué se va a construir, y qué problema resuelve

Un cuaderno Quarto, `talleres/TDR-PI.qmd`, **individualizado por número de documento**, que
evalúa las tres unidades a la vez. No mide si el estudiante sabe calcular: mide si sabe
**leer lo que salió, decir por qué salió así, y sostenerlo en voz alta**. El andamio de
código va dado y ya ejecutado; lo que se califica es lo que el estudiante dice sobre la
salida.

Esa inversión no es estilística. Es la respuesta directa a la premisa del encargo: los
estudiantes van a usar IA, y **un modelo de lenguaje escribe código excelente y lee
resultados muy mal**. Todo el diseño que sigue coloca la dificultad donde el modelo es
débil y la retira de donde es fuerte.

### Las cuatro decisiones que ya están tomadas

| # | Decisión | Consecuencia |
|---|---|---|
| **PI-A** | El taller se construye **ahora**, calculando sus cifras sobre los datos congelados, y esas cifras quedan **canónicas** | Se invierte la dependencia: los capítulos 8–15 tendrán que reproducirlas. El taller manda, como `datos/` manda sobre la regla 9 |
| **PI-B** | **Individualizado por documento**, con generador de clave de respuestas | Nadie comparte cifras con nadie. Exige barrido de invarianza y multiplica la superficie de error de mi parte |
| **PI-C** | Es el **proyecto integrador de la U3** del syllabus, **con defensa oral individual No-AI** | La defensa carga parte de la nota. El taller es el artefacto que se interroga |
| **PI-D** | La renta fija va sobre una **curva cero cupón literal declarada** en el propio taller | Desbloquea RA5 y RA6 hoy, sin `curva_tes.csv`. Cuando llegue la curva real, se sustituye y se regenera la clave — es una revisión de D-D, no un cambio silencioso |

### Lo que NO entra

- No sustituye a `TDR-U1.qmd`, que sigue siendo el instrumento calificado de la unidad 1.
- No sustituye al taller de unidad 2 (tarea 22): ese sigue pendiente y es de práctica.
- No es el examen final presencial No-AI acumulativo, que sigue apoyándose en los quince
  cuestionarios integradores de los capítulos.
- No incluye montaje en el aula virtual ni banco Moodle.

---

## 2. El estado real del material, que es lo que hace este plan inusual

| Unidad | Material | Datos | Puede evaluarse hoy |
|---|---|---|---|
| **1** · C1–C6 | ✅ completa y verificada | `bvc_diario.csv` | ✅ con cifras ya publicadas |
| **2** · C7 | 🟡 a medias, sin commitear (3 `MCQ`, 0 `Laboratorio`, 0 `Quiz`) | `bvc_diario.csv` | ✅ calculando las cifras aquí |
| **2** · C8 | ⬜ no empezado | `bvc_diario.csv` | ✅ calculando las cifras aquí |
| **2** · C9–C10 | ⬜ no empezados | ❌ `curva_tes.csv` pendiente | ✅ **con la curva literal de PI-D** |
| **3** · C11–C12 | ⬜ no empezados | no necesitan datos externos | ✅ calculando las cifras aquí |
| **3** · C13–C14 | ⬜ no empezados | `german_credit.csv` | ✅ calculando las cifras aquí |
| **3** · C15 | ⬜ no empezado | `perdidas_operativas.csv`, `sp500_diario.csv` | ✅ calculando las cifras aquí |

Entorno comprobado el 2026-08-17: Python 3.12.13 con `cvxpy`, `arch`, `QuantLib`,
`xgboost`, `pyextremes` y `sklearn`; R 4.6.0 con `quadprog`, `extRemes` y `rugarch`.

⚠️ **Consecuencia didáctica que hay que asumir en voz alta:** el instrumento existirá antes
que el material que evalúa. Mientras los capítulos 8–15 no estén escritos, este taller **no
se puede aplicar** — un estudiante no puede leer lo que no ha estudiado. Lo que se
construye ahora es el instrumento y su clave; la aplicación espera al punto de control E.

---

## 3. El hilo, y las cuatro contradicciones que son el instrumento

D7 fija un solo relato: el portafolio de un fondo de pensiones colombiano —cuatro acciones
de la BVC, un tramo de TES, una opción de cobertura— sobre 800 000 millones. El taller lo
recoge en el punto en que las tres áreas del fondo entregan números que **no cuadran entre
sí**, y el comité tiene que aprobar un portafolio y un presupuesto de capital.

Un taller integrador no es la suma de tres talleres de unidad. Es el sitio donde se ve que
una decisión de la unidad 1 le pone precio a una de la 2 y le rompe un supuesto a una de la
3. De ahí que el corazón del instrumento sean **cuatro contradicciones plantadas, todas
reales y todas documentadas en el material**:

### C-1 · La Σ diaria contra la beta de 0,68 · une U1 con U2

El capítulo 3 midió que la negociación no simultánea se lleva **un tercio de la beta**: 0,68
con datos diarios contra 0,95 con semanales. La frontera eficiente del capítulo 7 se estima
sobre **esa misma matriz diaria**. Las correlaciones sesgadas hacia cero inflan el beneficio
de diversificación que el optimizador promete.

**Lo que se pide:** recalcular la frontera con Σ semanal, medir cuánto se mueven los pesos
óptimos y la volatilidad prometida, y decidir cuál Σ va al comité. Se califica la decisión y
su costo en pesos, no el recálculo.

### C-2 · La cola que mejor se estima es la que peor se valida · une U1 con U3

Sobre el mismo panel, la unidad 1 da un ES histórico al 99 % de **6,599 %** —convención
declarada del curso: promedio simple de las ruedas que exceden— y la unidad 3 dará otro por
POT/GPD. El estudiante tiene que elegir. Y entonces choca con la parte 5.3 de `TDR-U1`: la
potencia de Kupiec con T = 250 al 99 % es la que es, y **la estimación más sofisticada de la
cola es precisamente la que menos se puede validar con la ventana regulatoria**.

**Lo que se pide:** el número, el veredicto y la incomodidad. Una respuesta que recomiende
EVT sin decir que no puede validarla pierde el criterio entero.

### C-3 · Las dos coberturas que suponen lo que la cola desmiente · une U2 con U3

La cobertura por duración supone desplazamientos paralelos de la curva. La cobertura delta
supone volatilidad constante y rebalanceo continuo. Los dos supuestos se rompen en el mismo
evento, y la EVT dice con qué frecuencia.

**Lo que se pide:** el P&L de las dos coberturas en el escenario de cola de su semilla, y qué
debería haber incluido la cifra de capital que no incluyó.

### C-4 · La tasa libre de riesgo en tres sitios · atraviesa las tres unidades

D-D fija **7,00 % E.A.**, y tiene **dos** conversiones declaradas: bajarla a diaria efectiva
y anualizar por 252 da **6,7668 %**; `ln(1,07)` da **6,7659 %**. Separadas por 0,0009 pp. La
tasa aparece en la CML (C7), en el descuento de derivados (C11 y C12) y en la curva (C9).

**Lo que se pide:** declarar cuál usa en cada sitio y no mezclarlas dentro de una misma
cifra. Es la contradicción más barata en pesos y la más reveladora: un modelo de lenguaje
elige una de las dos según cómo se le pregunte, y no declara ninguna.

⚠️ Las cuatro comparten una propiedad y por eso están: **su respuesta no está en el taller.**
Está en los capítulos. Un modelo que solo tenga el `.qmd` responde el manual — y el manual,
aquí, está mal.

---

## 4. Estructura del instrumento

| Parte | Qué es | Nivel AIAS | Peso |
|---|---|---:|---:|
| **0** | Individualización y declaración previa | 3 · con bitácora | 5 % |
| **1** | Unidad 1 · leer y auditar el informe de la mesa de mercado | 3 (R1 interno en 1) | 10 % |
| **2** | Unidad 2 · frontera, CVaR y renta fija | 3 (R1 interno en 1) | 15 % |
| **3** | Unidad 3 · derivados, crédito y cola | 3 (R1 interno en 1) | 15 % |
| **4** | **La conciliación** · las cuatro contradicciones | 3 | 20 % |
| **5** | Audita a la IA | **1 · No AI** | 10 % |
| **6** | Bitácora de prompts | — | 5 % |
| **7** | Nota al comité + las tres preguntas que no quiere que le hagan | 3 | 10 % |
| **8** | **Defensa oral individual** | **1 · No AI** | 10 % |

**Reproducir las cifras vale cero puntos y es requisito de calificación.** Si las cifras de
la clave no aparecen reproducidas, el taller no se califica. Es un umbral, no una nota: que
la máquina calcule está bien, es a lo que se dedica.

### Reparto por lo que usted pidió evaluar

| Dimensión | Peso acumulado | Dónde vive |
|---|---:|---|
| Interpretación de resultados y lectura de gráficas | **~30 %** | Partes 1, 2 y 3 |
| Conciliación e integración entre unidades | **20 %** | Parte 4 |
| Comprensión de procedimientos y sus dependencias | **~15 %** | R5 de la parte 0, R1 de 1–3 |
| Criterio profesional bajo escrutinio | **20 %** | Partes 7 y 8 |
| Auditoría de salidas de IA | **10 %** | Parte 5 |
| Honestidad del proceso | **5 %** | Parte 6 |

### Los cinco mecanismos anti-delegación, y qué ataca cada uno

1. **El código va dado y ejecutado.** Retira de la nota lo que la IA hace bien.
2. **Las respuestas viven en los capítulos, no en el taller.** Un modelo con solo el `.qmd`
   contesta el manual y falla las convenciones declaradas del curso — las cinco: ES como
   promedio simple, backtest que reestima rueda a rueda, las dos conversiones del 7 %, la
   agregación de logarítmicos que es barata sobre dispersión y ruinosa sobre niveles, y los
   dos defectos del panel que no se corrigen.
3. **La rúbrica califica coherencia entre partes, no partes sueltas.** La declaración previa
   de la parte 0 se contrasta con la recomendación de la parte 7. Pegar pregunta por pregunta
   produce contradicciones que se cobran.
4. **Cada estudiante lee su propia gráfica**, cuya forma depende de su semilla y de lo que
   declaró antes. No hay respuesta compartible.
5. **La defensa oral.** No se delega. Y el taller obliga a escribir en la parte 7 las tres
   preguntas que el estudiante menos quiere que le hagan — que son las que se le hacen.

---

## 5. La individualización, en concreto

`semilla(documento)` = FNV-1a del documento → LCG, el mismo par que TR-CORE ya usa para
barajar opciones y que `verificar.py` porta en su regla 14. Reutilizarlo evita inventar un
segundo generador y permite auditarlo con código que ya existe.

### Ejes de la rejilla

| Eje | Valores | ¿La conclusión cualitativa cambia? |
|---|---|---|
| Ventana del backtest | 125 · 250 · 500 | **Sí** — la pregunta se plantea sobre el efecto, nunca sobre el veredicto |
| Nivel de reporte | 97,5 % · 99 % | No — el orden entre medidas se conserva |
| Ventana de estimación de Σ | 250 · 500 · 1 000 ruedas | **Sí** — es literalmente la sección 6 del capítulo 7 |
| Emisor excluido en la prueba de fragilidad | ECOPETROL · BOGOTA · GRUPOSURA · ISA | No |
| Escenario de curva | base · +100 pb paralelo · empinamiento 50 pb | No |
| Umbral EVT de partida | percentil 90 · 92,5 · 95 | **Sí** — es la sección 4 del capítulo 15 |
| Partición de crédito | entero derivado del documento | No — AUC dentro de banda declarada |

⚠️ **La regla técnica más importante de todo el plan:** *cada pregunta declara de qué ejes
depende y si su respuesta cualitativa es invariante a la semilla.* Donde no lo sea, el
enunciado se escribe para que las dos conclusiones sean defendibles y se califique el
argumento — igual que `TDR-U1` hace con la exclusión del par de febrero de 2025.

⚠️ **Y la que hace el trabajo viable:** el barrido de invarianza se hace **por eje, no por
producto cartesiano**. El producto son 648 combinaciones y hay un XGBoost dentro; los ejes
son 18 ejecuciones. La clave se genera además una vez por documento matriculado. Para que
esto sea legítimo, ninguna pregunta puede depender de más de dos ejes con interacción, y esa
es una restricción de diseño que el verificador comprueba.

### Lo que hay que congelar para que los dos lenguajes coincidan

- **Choques de Montecarlo** en `talleres/datos_taller/choques_mc.csv`, con entrada propia de
  manifiesto. `np.random.default_rng(2026)` y `set.seed(2026)` no dan la misma muestra —
  regla 3 del material— y aquí las dos rutas tienen que dar lo mismo.
- **Curva cero cupón literal** (PI-D) en el propio `.qmd`, con sus plazos y sus tasas
  escritos, y una nota que diga que es dato del enunciado y no observación de mercado.
- **Tolerancias declaradas** donde no puedan coincidir: `cvxpy` contra `quadprog` no dan
  pesos idénticos bit a bit. Se declara la tolerancia y se reporta a cuatro decimales.

---

## 6. Lista de tareas

### Fase A · Cimientos del instrumento

#### T-PI-1 · Especificación y matriz de cobertura
**Descripción:** Una tabla que cruza pregunta × RA × tipo R1–R9 × nivel AIAS × peso × ejes de
semilla × invarianza. Es el contrato del que cuelgan todas las demás tareas y contra el que
audita el verificador.

**Criterios de aceptación:**
- [ ] Los nueve RA tienen al menos una pregunta que los evalúa
- [ ] Cada pregunta declara tipo, nivel, ejes e invarianza
- [ ] Los pesos suman 100 % y coinciden con la tabla de la sección 4

**Verificación:** revisión a mano contra el syllabus; la comprueba después `verificar_taller.py`
reglas 2, 3, 4 y 6.
**Dependencias:** ninguna · **Alcance:** S · **Archivos:** `talleres/TDR-PI-cobertura.md`

#### T-PI-2 · Mecanismo de individualización
**Descripción:** `semilla.py` y su gemelo en R, que del documento derivan los siete ejes.
Portan el FNV-1a + LCG de TR-CORE.

**Criterios de aceptación:**
- [ ] Mismo documento → mismos parámetros en los dos lenguajes, comprobado sobre 50 documentos sintéticos
- [ ] La rejilla completa se genera sin valores fuera de rango
- [ ] Documentos de longitud distinta (8, 10 y 11 dígitos) se reparten sin sesgo visible

**Verificación:** script de contraste que corre las dos implementaciones y compara.
**Dependencias:** T-PI-1 · **Alcance:** S-M · **Archivos:** `talleres/clave/semilla.py`, `talleres/clave/semilla.R`

#### T-PI-3 · Datos del taller
**Descripción:** Curva literal declarada, choques de Montecarlo congelados, y su manifiesto.

**Criterios de aceptación:**
- [ ] `choques_mc.csv` con SHA-256 en un manifiesto propio
- [ ] Las dos rutas leen los mismos choques y producen el mismo precio
- [ ] La curva literal trae plazos, tasas y una nota de procedencia declarada

**Verificación:** un bloque en los dos lenguajes que valora la misma opción y coincide.
**Dependencias:** ninguna · **Alcance:** S · **Archivos:** `talleres/datos_taller/`

> #### ✅ Punto de control A
> - [ ] La rejilla barre por eje sin error
> - [ ] Los dos lenguajes derivan la misma semilla
> - [ ] La matriz de cobertura cubre RA1–RA9
> - [ ] **Revisión con usted antes de calcular cifras**

---

### Fase B · Las cifras canónicas

Cada tarea de esta fase produce un fragmento de `talleres/clave/congelador.py` (+ gemelo en R
donde haga falta) que **recalcula desde los datos congelados** todas las cifras que el taller
va a declarar. Ninguna cifra se escribe a mano en el `.qmd`: se cita del congelador.

#### T-PI-4 · Cifras de la unidad 1
**Descripción:** Extraer de los capítulos 1–6 las cifras que el taller va a usar y
**reproducirlas**, no copiarlas. Son las únicas que ya existen publicadas.

**Criterios de aceptación:**
- [ ] 1 916 ruedas, VaR 99 % 4,077 %, ES 99 % 6,599 %, 26 excepciones sobre 1 666, LR~uc~ 4,5175 · LR~ind~ 17,6911 · LR~cc~ 22,2086, Z₁ +0,2487, 7 excepciones regulatorias, m = 3,65, 371 675 millones
- [ ] Beta 0,68 diaria contra 0,95 semanal, reproducida
- [ ] Cualquier discrepancia con lo publicado se investiga antes de seguir, no se ajusta

**Verificación:** contraste automático contra las cifras citadas en `CLAUDE.md`.
**Dependencias:** T-PI-2 · **Alcance:** S

#### T-PI-5 · Congelador U2-a · frontera eficiente
Frontera, mínima varianza, máximo Sharpe con la CML al 7,00 % —declarando cuál de las dos
conversiones—, restricción sin cortos, límites por emisor, y **fragilidad de Σ por ventana**.
**Criterios:** las dos rutas coinciden dentro de tolerancia declarada · la frontera se genera
para los tres valores del eje de ventana · los pesos suman 1 en todos los casos.
**Dependencias:** T-PI-2, T-PI-4 · **Alcance:** M

#### T-PI-6 · Congelador U2-b · CVaR Rockafellar–Uryasev
Programa lineal por escenarios, frontera media-CVaR superpuesta a media-varianza,
composición comparada.
**Criterios:** ζ aparece explícita como variable · el CVaR del óptimo CVaR es menor que el del
óptimo media-varianza, y la diferencia está cuantificada en pesos.
**Dependencias:** T-PI-5 · **Alcance:** M

#### T-PI-7 · Congelador U2-c · renta fija sobre la curva literal
Bootstrapping a mano y con QuantLib, duración de Macaulay y modificada, convexidad, DV01,
cobertura del tramo, y los tres escenarios de curva.
**Criterios:** el bootstrapping a mano y QuantLib coinciden · la convención de conteo de días
va declarada (30/360) y el contraste con Actual/360 está medido, porque es el R3 del capítulo
10 · la aproximación de segundo orden se compara con el precio exacto.
**Dependencias:** T-PI-3 · **Alcance:** M

#### T-PI-8 · Congelador U3-a · derivados
Árbol binomial de tres pasos con sus nodos, Black-Scholes cerrado, Montecarlo sobre los
choques congelados **con error estándar**, las cinco griegas analíticas contra diferencias
finitas, P&L de una cobertura delta rebalanceada.
**Criterios:** el Montecarlo cae dentro de ±2 EE del cerrado y el EE está reportado · la
probabilidad neutral al riesgo está separada de la real en la salida, que es el R3 del
capítulo 11.
**Dependencias:** T-PI-3 · **Alcance:** M

#### T-PI-9 · Congelador U3-b · crédito
Logística con el escalador **dentro** del pipeline, WoE e IV, scorecard, XGBoost, ROC, KS,
curva de calibración, Brier, PSI.
**Criterios:** la partición se deriva de la semilla y el AUC queda dentro de una banda
declarada para todas las semillas del curso · discriminación y calibración se reportan por
separado, que es la sección 3 del capítulo 14 · ninguna variable posterior al incumplimiento
entra al modelo.
**Dependencias:** T-PI-2 · **Alcance:** M

#### T-PI-10 · Congelador U3-c · valores extremos
POT sobre `perdidas_operativas.csv` y sobre la cola del portafolio, ajuste GPD, mean excess
plot, estabilidad de ξ por umbral, VaR y ES por EVT contra los históricos de U1.
**Criterios:** los tres umbrales del eje producen ajuste convergente · la comparación con el
ES histórico de 6,599 % está hecha sobre la misma serie y la misma convención · ξ y su error
estándar van reportados juntos.
**Dependencias:** T-PI-4 · **Alcance:** M

> #### ✅ Punto de control B — las cifras canónicas
> - [ ] Todas reproducidas en los dos lenguajes dentro de la tolerancia declarada
> - [ ] El congelador corre entero de una vez, sin intervención manual
> - [ ] Se anota en el plan maestro que estas cifras **son las que los capítulos 8–15 tendrán
>       que reproducir**, y que un capítulo que produzca otra abre una discrepancia que se
>       investiga, no se ajusta
> - [ ] **Revisión con usted antes de redactar**

---

### Fase C · Redacción del instrumento

#### T-PI-11 · Partes 0 y 1
Individualización, declaración previa, y la unidad 1 como **lectura y auditoría** de un
informe ya producido por la mesa de mercado —no como recálculo, que es lo que `TDR-U1` ya
hizo—.
**Criterios:** la parte 0 se entrega antes de ver resultados y el documento lo registra ·
ninguna pregunta de la parte 1 repite una de `TDR-U1` · al menos dos preguntas piden leer una
gráfica y una pide detectar lo que la gráfica **no** muestra.
**Dependencias:** punto de control B · **Alcance:** M

#### T-PI-12 · Parte 2 · unidad 2
**Criterios:** R1 de bootstrapping a mano reproducible **desde los valores redondeados que se
muestran** —zona ciega 4— · lectura del mapa de calor, de la frontera y de la composición
apilada · la restricción sin cortos aparece como decisión de régimen, no como detalle técnico.
**Dependencias:** T-PI-11 · **Alcance:** M

#### T-PI-13 · Parte 3 · unidad 3
**Criterios:** R1 de árbol binomial a mano · lectura de ROC, KS y curva de calibración, con
una pregunta que solo se responde distinguiendo discriminación de calibración · lectura del
mean excess plot con el umbral de su semilla · el Montecarlo se lee **con** su error estándar.
**Dependencias:** T-PI-12 · **Alcance:** M

#### T-PI-14 · Parte 4 · la conciliación ← **el corazón del instrumento**
Las cuatro contradicciones de la sección 3, cada una con su número, su decisión y su costo.
**Criterios:** cada contradicción exige una cifra propia del estudiante y una decisión
declarada · ninguna admite respuesta salomónica sin costo · las cuatro son verificables
contra la clave · **ninguna se puede responder con el `.qmd` en la mano y sin los capítulos**,
y eso se comprueba empíricamente en T-PI-20.
**Dependencias:** T-PI-13 · **Alcance:** M

#### T-PI-15 · Partes 5, 6 y 7
Auditoría a la IA con la taxonomía de siete errores y el costo en pesos; bitácora; nota al
comité de una página sin fórmulas; y las tres preguntas que el estudiante menos quiere que le
hagan, respondidas.
**Criterios:** la parte 5 declara nivel 1 y el estudiante genera él mismo el material que
audita · la nota al comité se entiende sin la palabra «cuantil» · las tres preguntas de la
parte 7 alimentan la defensa oral.
**Dependencias:** T-PI-14 · **Alcance:** S-M

#### T-PI-16 · Rúbrica, guía de calificación y guía de la defensa
Documento docente aparte: rúbrica desagregada, qué se descuenta, y un guion de defensa oral
con tres preguntas por estudiante derivadas de **su** taller.
**Criterios:** cada criterio de la rúbrica apunta a preguntas concretas · la lista de
descuentos recoge los errores que el material documenta como más frecuentes · la guía de
defensa explica cómo se generan las preguntas desde el taller entregado.
**Dependencias:** T-PI-15 · **Alcance:** M · **Archivos:** `talleres/TDR-PI-rubrica.md`

> #### ✅ Punto de control C
> - [ ] `quarto render` limpio en la ruta R y en la ruta Python
> - [ ] Yo resuelvo el taller entero bajo una semilla, en pantalla, de principio a fin
> - [ ] **Revisión con usted antes de auditar**

---

### Fase D · Clave y auditoría de mi propio trabajo

Esta fase es la que usted pidió que el plan contemplara, y son cuatro capas porque las tres
primeras no bastan: el material ya tiene diez zonas ciegas documentadas, y **ocho de ellas
sobrevivieron a un verificador que devolvía OK**.

#### T-PI-17 · Generador de clave y barrido de invarianza
**Descripción:** `generar_clave.py` toma un CSV de documentos matriculados y emite la tabla
de respuestas esperadas de cada estudiante. El barrido por eje comprueba las declaraciones de
invarianza de T-PI-1.

**Criterios de aceptación:**
- [ ] La clave se genera para todos los documentos del curso, sin `NaN` ni excepciones
- [ ] Toda pregunta declarada invariante **lo es** en las 18 ejecuciones del barrido por eje
- [ ] Toda pregunta declarada no invariante **cambia** de veredicto en al menos un valor del eje — si no cambia, la declaración estaba mal y se corrige
- [ ] Ninguna pregunta depende de más de dos ejes con interacción

**Verificación:** el barrido corre entero y emite un informe por pregunta.
**Dependencias:** punto de control C · **Alcance:** M

#### T-PI-18 · `verificar_taller.py` · las doce reglas
Modelado sobre `verificar.py`, que ya tiene catorce reglas y 946 líneas de precedente.

| # | Regla |
|---|---|
| 1 | Toda cifra declarada en el enunciado procede del congelador. Ninguna escrita a mano |
| 2 | Cobertura bidireccional: cada criterio de rúbrica → ≥1 pregunta, y cada pregunta → ≥1 criterio |
| 3 | RA1–RA9 con al menos una pregunta cada uno |
| 4 | Cada pregunta declara tipo R1–R9 y nivel AIAS; se cumple la cuota |
| 5 | **Fuga:** ninguna respuesta de la clave aparece literalmente en el texto del estudiante |
| 6 | Cada pregunta declara sus ejes y su invarianza, y el barrido de T-PI-17 la confirma |
| 7 | Los dos lenguajes coinciden dentro de la tolerancia declarada, y la tolerancia está escrita |
| 8 | `quarto render` limpio en las dos rutas |
| 9 | Ninguna pregunta pide construir desde cero — regla 5 del material |
| 10 | Ninguna pregunta ni justificación nombra una opción por su posición |
| 11 | Término en inglés con traducción en su primera aparición — D9 |
| 12 | Toda magnitud reportada como **nivel** —un acumulado, un precio, un capital— tiene su recálculo exacto al lado — zona ciega 10 |

**Criterios de aceptación:** las doce corren sobre `TDR-PI.qmd` y devuelven 0 · cada regla
tiene un caso de prueba que la hace fallar a propósito, porque una regla que nunca ha fallado
no está comprobada.
**Dependencias:** T-PI-17 · **Alcance:** M

#### T-PI-19 · Capa 2 · el recorrido que ninguna regla puede hacer
Las zonas ciegas del material, trasladadas al taller:

- **Zona 1 (JavaScript en blanco) →** el análogo aquí es un chunk que falla en silencio
  bajo una semilla y no bajo otra. Se corre el render **con tres semillas distintas**.
- **Zona 4 (`TablaTraza` irreproducible) →** cada R1 se resuelve a mano, con calculadora,
  **desde los valores redondeados que el enunciado muestra**.
- **Zona 6 («no existe ninguno» se barre, no se razona) →** toda afirmación del taller sobre
  el rango de un parámetro se barre. Si el taller dice «ninguna ventana pasa la prueba», se
  comprueban todas.
- **Zona 7 (corregir los casos conocidos no cierra la familia) →** las correcciones se barren
  por propiedad y no por nombre.
- **Zona 10 (nivel contra dispersión) →** toda cifra que sea un nivel se recalcula por la vía
  exacta y se compara. Si la brecha crece con el horizonte, la convención no aplica ahí.

**Criterios:** el recorrido queda registrado con lo que encontró · el taller se resuelve
entero al menos una vez de principio a fin.
**Dependencias:** T-PI-18 · **Alcance:** S-M

#### T-PI-20 · Capa 3 · calibración adversaria ← **la que convierte la afirmación en medida**

Tres pases, cada uno en contexto aislado, calificados con la rúbrica de T-PI-16:

| Pase | Qué recibe | Criterio de aceptación |
|---|---|---|
| **A** | Solo el `.qmd` y los datos. Sin capítulos | **< 55 %**, y falla específicamente en las cuatro contradicciones y en las convenciones declaradas |
| **B** | El `.qmd`, los datos y los quince capítulos | Alto en lo mecánico —es lo esperado y lo deseado—, pero **< 80 %** sin la defensa oral |
| **C** | El `.qmd`, respondiendo **pregunta por pregunta sin contexto global** | Produce ≥ 3 contradicciones internas que la rúbrica cobra. Si no las produce, el mecanismo de coherencia no funciona y hay que rediseñarlo |

**Qué se hace con el resultado:** si el pase A aprueba, el instrumento no discrimina y se
rediseñan las preguntas que aprobó. Si el pase B pasa del 80 %, se rebalancean los pesos hacia
la conciliación y la defensa. Los tres pases quedan archivados con sus respuestas y sus notas,
que es la evidencia de que la dificultad está calibrada y no supuesta.

⚠️ Los tres pases exigen contextos genuinamente aislados —subagentes—, y por tanto **su visto
bueno explícito** antes de lanzarlos.
**Dependencias:** T-PI-19 · **Alcance:** M

#### T-PI-21 · Capa 4 · revisión pedagógica y prueba de cronómetro
**Criterios:**
- [ ] Cada pregunta tiene un nivel de Bloom declarado, y la parte 4 está en Evaluar o Crear
- [ ] Los niveles AIAS declarados son coherentes con D8
- [ ] **Prueba de cronómetro:** el taller se resuelve completo y se mide cuánto tarda. Si excede
      las horas autónomas asignadas, se recorta y el recorte se declara
- [ ] La rúbrica discrimina: dos respuestas de calidad distinta caen en notas distintas,
      comprobado sobre las respuestas de los pases A y B

**Dependencias:** T-PI-20 · **Alcance:** S

#### T-PI-22 · Registro y cierre
Registro de ejecución en el plan maestro, pointer en `CLAUDE.md`, entrada de las cifras
canónicas para los capítulos 8–15, y commit por ruta —nunca `git add -A`, que barre la salida
de Quarto—.
**Dependencias:** T-PI-21 · **Alcance:** S

> #### ✅ Punto de control final
> - [ ] Las doce reglas devuelven 0
> - [ ] La clave se genera para todos los documentos matriculados
> - [ ] Los tres pases adversarios dentro de sus criterios
> - [ ] El taller cabe en las horas asignadas, medido
> - [ ] `_salida/` fuera del commit

---

## 7. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Las cifras canónicas divergen cuando se escriban los capítulos 8–15 | **Alto** | PI-A invierte la dependencia: el congelador es la fuente y los capítulos la citan. Una divergencia se investiga, no se ajusta |
| La individualización multiplica la superficie de error | **Alto** | Barrido por eje obligatorio (T-PI-17), rejilla pequeña, y la restricción de no más de dos ejes con interacción por pregunta |
| El taller no cabe en las horas autónomas | Medio | Prueba de cronómetro (T-PI-21) con recorte declarado, no silencioso |
| `cvxpy` y `quadprog` no coinciden bit a bit | Medio | Tolerancia declarada y reporte a cuatro decimales. Es la misma decisión que D-B tomó con `arch` y `rugarch` |
| Montecarlo entre lenguajes | Medio | Choques congelados en CSV con manifiesto (T-PI-3) |
| La curva literal se sustituye cuando llegue `curva_tes.csv` | Bajo | La clave se regenera y queda anotado como revisión de D-D |
| Un modelo con el material saca 95 % | Medio | Rebalanceo hacia conciliación y defensa. La defensa oral es la válvula que no se puede delegar |
| El instrumento existe antes que el material que evalúa | **Alto** | No se aplica hasta el punto de control E. Está dicho arriba y hay que sostenerlo |

---

## 8. Preguntas abiertas — no bloquean, pero afinan

1. **La lista de documentos matriculados.** El generador de clave la necesita; hasta que
   exista, se barre con documentos sintéticos.
2. **Horas asignadas al instrumento.** Supuesto declarado mientras tanto: **12–15 h
   autónomas**, que es lo que la U3 tiene en el syllabus. La prueba de cronómetro lo confirma
   o lo desmiente.
3. **Duración y formato de la defensa oral.** Supuesto: individual, 15 minutos, tres preguntas
   derivadas del taller entregado.
4. **Individual o en grupo.** Supuesto: individual, porque la defensa lo es.
5. **Fecha de entrega y de defensa**, para encajarlas con el punto de control E.
6. **¿El estudiante entrega el HTML renderizado**, como en `TDR-U1`? Supuesto: sí, mismo
   criterio —el código que no corre no se califica—.

---

## 9. Resumen de esfuerzo

| Fase | Tareas | Alcance |
|---|---|---|
| A · Cimientos | T-PI-1 a T-PI-3 | S + S-M + S |
| B · Cifras canónicas | T-PI-4 a T-PI-10 | S + 6×M ← **la fase más pesada** |
| C · Redacción | T-PI-11 a T-PI-16 | 4×M + S-M + M |
| D · Clave y auditoría | T-PI-17 a T-PI-22 | 3×M + S-M + 2×S |

La fase B es la que carga el plan, y es la que además deja producto reutilizable: sus siete
congeladores son el material numérico de los capítulos 8 a 15.
