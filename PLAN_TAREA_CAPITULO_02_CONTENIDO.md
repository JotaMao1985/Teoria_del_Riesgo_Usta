# Plan de mejora del contenido del capítulo 2 — borrador para aprobar

> Escrito el 2026-11-12 por la sesión maestra, sobre la línea base del vault (el mismo proceso que el capítulo 1).
> Archivo: `Material html/02_TDR_Volatilidad.html`, commit `097da44`. **Nada de esto está hecho: es la propuesta
> que el docente aprueba, cambia o recorta.**

## Contexto

El capítulo 2 enseña a modelar la volatilidad: ventana móvil, EWMA, ARCH, GARCH(1,1), su diagnóstico y su
pronóstico a h días. Pasa las 24 reglas del verificador con `--con-salidas`: las salidas de sus bloques son las que el código produce.
No tiene **ninguna cita** ni lista de referencias, y lo que la línea base encontró es, como en el capítulo 1, de
**sentido, fuentes y coherencia** — pero aquí con un error de fondo en el argumento central de la sección 5.

| Medida (línea base, 2026-11-12) | Cifra |
|---|---|
| Afirmaciones inventariadas (tres inventarios, fusionados por línea) | 151 (19 citadas, 8 criterio, 54 derivadas, 44 ejecutadas, 4 ilustrativas, 22 sin clasificar) |
| Contradichas por los datos, el código, la norma vigente o el propio curso | **26** |
| Dudosas o sin poder juzgar sin leer la fuente | 58 |
| Fórmulas sin desarrollar, sin una hipótesis o que no dicen lo que hace su bloque | 17 de 19 |
| Ejercicios con un defecto de contenido | 3 altos, 10 medios (sin contar los de gravedad baja) |
| Hilos con otros capítulos que no se cumplen o se cumplen a medias | 28 de 66 |
| `Eq` · `Derivacion` · `Anatomia` · `Cita` | 12 · 1 · 0 · 0 |

El detalle, una nota por afirmación, figura, símbolo, concepto e hilo, está en el vault (etiqueta
`linea-base-c02`; la evidencia y los guiones de comprobación en `Capítulos/Cap 02 - línea base/`). Lo más grave,
**comprobado por la sesión maestra** sobre `datos/bvc_diario.csv`:

1. **La explicación de por qué `arch` y `rugarch` dan cifras distintas es falsa** (`:4238–4246`, `:4274`, `:3696`,
   `:4815`, solución del R8). El capítulo dice que «maximizan la misma verosimilitud» y que R «encontró un punto
   marginalmente mejor». No es la misma función: cada paquete arranca la recursión de la varianza de otro modo
   (`rugarch` con la media de todos los ε², 2,4841; `arch` con su *backcast*, 1,6524). Si a `arch` se le arranca como
   a `rugarch`, da **persistencia 0,926397 y log-verosimilitud −3150,4956**, la columna de R (0,926398 · −3150,4906).
   La decisión D-B —declarar la discrepancia— se sostiene; su porqué no. El mismo porqué está en el **capítulo 1**
   (`:4649–4651`), el **7** (pregunta de `:5320`), el **plan** (D-B, `:930`) y la clave privada del taller T2 (4.3).
2. **La motivación de la sección 1 inventa una caída** (`:3784–3786`): «el 19 perdió otro 12,50 %». El 19/3/2020
   el fondo **subió 1,87 %**; el +12,50 % es una ganancia del 25/3. La escena de cuatro pérdidas seguidas no ocurrió.
3. **El pie de la ACF afirma lo que la gráfica no muestra** (`:3823`): r² no queda fuera de la banda «veinte rezagos
   seguidos» ni vale +0,11 en el 20. Sale en **9 de 20** rezagos y vale −0,0012 en el 20. La que sí se queda fuera
   hasta el rezago 17 es |r|, que no se dibuja. Y el título «r no se autocorrelaciona» choca con el Ljung-Box del
   propio bloque (30,9 contra 23,2 al 1 %).
4. **La gráfica `cap2-abs` pierde el día que la motivación cuenta** (`:3799`): al quedarse con una rueda de cada dos
   deja fuera 7 de las 9 ruedas de mayor |r|, entre ellas el −17,76 % del 16/3/2020; el pico más alto que dibuja es
   el +17,39 % del par defectuoso de febrero de 2025.
5. **«ω es el suelo»** (`:4205`, tabla `:4268`): el piso de la varianza es ω/(1−β) —la línea siguiente de la misma
   derivación lo muestra—, y la columna «Qué controla» le da a ω la lectura que el R6 asigna a ω/(1−α−β): quien
   copie de la tabla falla el ejercicio.
6. **Se estiman cinco parámetros y el capítulo dice dos, tres o cuatro** (`:4193`, `:4177`, `:4225`, `:4469`):
   μ, ω, α, β y ν. Y llama **«memoria larga»** a lo que en un GARCH(1,1) es decaimiento geométrico (`:4195` y otras
   cuatro): memoria larga es un término técnico con otro significado.
7. **El pie de `cap2-tres` describe dos comportamientos que no ocurren** (`:4429`): EWMA y GARCH no reaccionan «el
   mismo día» (usan r_{t−1}: el 16/3/2020 marcan 3,99 % y saltan el 17), y el GARCH filtrado no «tiende a la línea
   roja» en calma: queda debajo el 91–95 % de las ruedas de 2019 y 2024. La reversión está en el pronóstico.
8. **Tres ejercicios de gravedad alta**: el R3 de la sección 5 audita una persistencia de 1,004 que ninguno de los
   dos paquetes puede devolver (`arch` impone α+β ≤ 1 y `rugarch` trae `stationarity = 1`); el R7 parte de «abril de
   2020, σ = 7,48 %» (ese máximo es del 17/3; en abril va de 5,26 a 2,12 %) y de que el fondo usa modelos internos
   (una AFP usa el modelo estándar, CBF 1.1.2.91); la solución del R8 cita el SARM, derogado.
9. **La pregunta 10 del cuestionario usa un dato distinto del que da** (`:4840`): el enunciado da σ = 1,2922 % y la
   correcta es 1,3751·√20 = 6,1497; con el dato del enunciado sale 5,7789. Y en el cuestionario, **marcar la única
   opción con «:» saca 4,5 de 10** (el techo del curso es 3–4).
10. **La persistencia depende mucho de la ventana y el capítulo no lo dice.** Medido por la sesión maestra con el
    mismo modelo: **0,94** en 2018–2019, 0,93 en 2020–2021, **0,96** en 2022–2023 y **0,50** en 2024–2025 (0,38 con
    las últimas 250 ruedas). El capítulo estima sobre la muestra completa (0,9248) sin ninguna alternativa, que es lo
    que pide la cuarta convención del curso, y el par de febrero de 2025 cae en las ventanas recientes: según el
    inventario C, sin esas dos ruedas la persistencia del panel completo pasa de 0,9248 a 0,9465 y ν de 3,98 a 4,27
    (a recomprobar en la fase 4).

Dos afirmaciones sobre el mundo sin respaldo que hay que resolver con el docente: **«En la evaluación del año
pasado, casi todos supieron escribir la ecuación del GARCH(1,1) y menos de uno de cada cuatro supo decir sobre qué
serie se hace el diagnóstico»** (`:4751`) y «los modelos de lenguaje cometen estos dos errores con frecuencia»
(`:4875`).

## Decisiones que necesita el docente

| | Pregunta | Recomendación |
|---|---|---|
| **C2-A** | ¿Qué se hace con la discrepancia `arch`/`rugarch`? | **Mantener los valores por omisión en las dos pestañas** (la excepción declarada sigue) y **reescribir su porqué**: la recursión arranca distinto. El bloque añade una línea que reajusta `arch` con el arranque de `rugarch` y reproduce la columna de R. Es la misma lección del capítulo 10 —un valor por omisión decide— y deja medido lo que hoy se afirma. Se corrige en el mismo trabajo el porqué del capítulo 1, de la pregunta del 7, del plan (D-B) y de esta nota de `CLAUDE.md`; la clave privada del T2 la revisa el docente. |
| **C2-B** | ¿Se declara la fragilidad del GARCH ante la ventana y el par de febrero? | **Sí, como en los capítulos 4, 7, 8 y 12**: una tabla corta en la sección 5 con la persistencia y ν por subperíodo y sin el par, sin cambiar ninguna cifra del ajuste de referencia. Es la cuarta convención (la ventana se declara y se reporta una alternativa) y cumple lo que el capítulo 1 promete («en el capítulo 2 se tropieza con el par»). |
| **C2-C** | ¿Cómo se arregla `cap2-abs`? | **Diezmar por el máximo de \|r\| de cada par de ruedas** en vez de tomar las pares: no pierde ningún pico y no añade peso. Marcar el par de febrero de 2025 en la gráfica. |
| **C2-D** | ¿Qué hacemos con «la evaluación del año pasado» y «los modelos de lenguaje cometen estos errores con frecuencia»? | Si el docente tiene esa evaluación, se queda con su cifra; si no, **se reescribe como criterio** («la ecuación se aprende rápido; lo difícil es…»). La de los modelos de lenguaje, como criterio del docente. |
| **C2-E** | ¿El R7 sigue hablando de capital regulatorio? | **No**: se replantea sobre el **límite interno de VaR** del fondo, que no depende de qué modelo exige la norma a una AFP, con la fecha y la σ correctas (17/3/2020, 7,48 %). |
| **C2-F** | ¿Qué fuentes se leen? | Tanda 03 a Zotero: la **información científica del Nobel de 2003** (Real Academia Sueca: historia de ARCH y de GARCH, la mención del riesgo, Bollerslev), **Engle (2001), «GARCH 101»** (*Journal of Economic Perspectives*, abierto), **Ljung y Box (1978)**, **Fama (1970)** para la eficiencia, y el **FRTB de 2016** (BCBS d352), contrastado con MAR33. Y que el docente adjunte en Zotero los PDF de **Engle (1982)** y **Bollerslev (1986)** —JSTOR y Elsevier no dejan bajarlos— y, si lo tiene, McNeil–Frey–Embrechts (cap. 4). RiskMetrics (1996) ya está leído. |
| **C2-G** | ¿Qué se hace con lo que la línea base encontró **fuera** del capítulo 2? | Lo que es **el mismo error** (el porqué de `arch`/`rugarch` en los capítulos 1 y 7, el plan y `CLAUDE.md`) se corrige aquí, en la fase 7. Lo demás va a la fase 7 como comprobación o a una sesión aparte: el capítulo 6 dice «19 excepciones» con el GARCH del 2 y el inventario cuenta 18; el `Pipeline` promete que el capítulo 4 usa la σ de cada día y el 4 usa una σ muestral; el capítulo 12 «once anteriores» ya está corregido en la rama `claude/sweet-mclaren-0a350c`, sin fusionar. |

## Fases

Mismo orden que en el capítulo 1: fuentes antes de la prosa, exactitud antes de la ampliación, y el capítulo entero
antes de la coherencia hacia afuera. Cada fase cierra con el verificador en verde y un commit.

### Fase 0 · Preparación
- Traer la línea de normas de `cool-euclid-5c3617` («BCBS 239 y el SARM» → BCBS 239 y el SIAR de la CBF), con
  `<Cita>` a los pares ya verificados en el capítulo 1 (`sfc2026cbf`, `bcbs2013agregacion`).
- Exportar `referencias.json` desde Zotero; `<Referencias />` al final de la evaluación.

### Fase 1 · Fuentes
- Tanda 03 (C2-F) por el mismo circuito: metadatos copiados, RIS, comprobación por la API, vista previa APA.
- Leer las abiertas y las que el docente adjunte; cada pasaje con página en su nota de afirmación.
- Las 19 citadas pasan a `verificada` o se reescriben; las 58 en `revisar` se resuelven una por una.

### Fase 2 · Exactitud
Las 26 contradichas y los tres ejercicios altos, sin ampliar nada. Una lista cerrada:
- Sección 1: la motivación del 16–19/3/2020 (con las cifras exactas, como el capítulo 1); el título «r **casi** no se
  autocorrelaciona» con la cifra del Ljung-Box; el pie de la ACF reescrito sobre lo que se ve, o dibujar |r| (o las
  dos); la gráfica `cap2-abs` (C2-C).
- Sección 2: «seis ruedas antes» → cuatro (justificación del R7).
- Sección 5: ω y el piso ω/(1−β); la tabla «Qué controla» alineada con el R6; cinco parámetros; «memoria larga» →
  «persistencia» o «memoria que decae despacio»; el porqué de `arch`/`rugarch` (C2-A).
- Sección 6: el pie de `cap2-tres`; los «cuatro parámetros» del `Comparador`.
- Sección 7: la columna que el bloque rotula «raiz del tiempo» y es el acumulado; la pista del R1 que cita cifras que
  el bloque no imprime.
- Ejercicios: el R3 de la sección 5 sobre un escenario que pueda ocurrir y esté medido; el R7 (C2-E); el R8 con la
  norma vigente.
- Evaluación: «las dos únicas excepciones» → la lista completa (4, 5, 12, y una línea del 10); preguntas 7, 9 y 10.

### Fase 3 · Secciones 1 a 3
- Los hechos estilizados con fuente (Mandelbrot, 1963; Cont, 2001) y la eficiencia con Fama (1970), no «la hipótesis
  dice».
- La fórmula de la ventana dice lo que hace el código (hoy la suma excluye r_t y el código lo incluye) y define r̄.
- EWMA: la recursión con su semilla (la varianza de las 250 primeras ruedas) y la media cero declarada; el paso de
  «desplegar la recursión» escrito; «los coeficientes suman uno» corregido (lo que no se olvida es el pronóstico,
  no el peso de un choque); λ = 0,94 con RiskMetrics citado y la fecha de 1994 respaldada o cambiada.
- El R1 de EWMA reproducible a mano arrastrando cuatro decimales (zona ciega 4), y la pista que hoy revela dos casillas.

### Fase 4 · Secciones 4 y 5
- ARCH(q) con sus restricciones (ω > 0, αᵢ ≥ 0) y la prueba ARCH-LM atribuida a Engle (1982); la prosa dice ε², no r².
- `Derivacion` completa de la varianza incondicional (falta E[ε²] = E[σ²]); la sustitución que da el ARCH(∞) escrita.
- **`Anatomia` del GARCH(1,1)** (la primera del capítulo): μ, ω, α, β, ν, la persistencia α+β, el piso ω/(1−β), σ∞ y
  la vida media, cada uno con su cifra del ajuste.
- La tabla de fragilidad (C2-B): persistencia y ν por subperíodo y sin el par de febrero.
- Las dos «vidas medias» del capítulo (el peso de una observación en EWMA y la distancia del pronóstico en GARCH)
  distinguidas; β¹⁰ y la vida media de 8,9 ruedas dejan de presentarse como la misma cosa.

### Fase 5 · Secciones 6 y 7
- El estadístico de Ljung-Box como `Eq`, citado (Ljung y Box, 1978), con un solo nivel de significancia en todo el
  capítulo (hoy el 1 % en la sección 1 y el 5 % en la 6 y el cuestionario) y la advertencia de los grados de
  libertad sobre residuos estimados.
- ν = 3,98 de máxima verosimilitud contra 5,01 por momentos (y 4,23 en el capítulo 4), reconciliados en una frase: con
  ν < 4 la curtosis de la t no existe.
- `Derivacion` del pronóstico a h días (E_t[ε²_{t+k}] = E_t[σ²_{t+k}] y la recursión geométrica), con sus hipótesis;
  la σ acumulada con la advertencia de que exige rendimientos sin autocorrelación y de que el cuantil de una suma de t
  no es una t.
- `cap2-abanico`: 39 ruedas, no cuarenta; el último punto de la historia es la última rueda.

### Fase 6 · Portada, cierre y evaluación
- La línea de tiempo con `<Cita>` en cada hito: Engle 1982, Bollerslev 1986 (y «doctorando de Engle» solo si una
  fuente leída lo dice), RiskMetrics, el Nobel de 2003 con la mención del comité literal, el FRTB con lo que de verdad
  exige.
- C2-D; «Es el modelo que ajusta hoy cualquier mesa de riesgo del mundo» y «nadie lo hace» como criterio.
- La tabla de niveles de IA con el R8; «Antes de cerrar el capítulo» y el `Pipeline` del cierre con los destinos
  correctos (la σ condicional entra al VaR en el capítulo 6, no en el 4).
- Quiz 7, 8, 9 y 10 y la pista del «:»; volver a medir las reglas 13–17 y las zonas ciegas de forma.

### Fase 7 · Coherencia hacia afuera (C2-G)
- El porqué de `arch`/`rugarch` en el capítulo 1 (`:4649–4651`), la pregunta del 7 (`:5320`), el plan (D-B) y
  `CLAUDE.md`. Nota al docente para la clave del T2.
- Comprobar las «19 excepciones» del capítulo 6 con el GARCH del 2 y la promesa del capítulo 4; lo que no sea una
  línea va a una sesión aparte.
- El taller `TDR-02.qmd`: que sus cifras y su recuadro de escala sigan coincidiendo con el capítulo corregido.

### Fase 8 · Cierre
- `verificar.py --con-salidas` con las 24 reglas; recorrido en el navegador (las siete secciones, los dos
  laboratorios barridos, las gráficas con su pie al lado, consola, 375 px).
- Lectura independiente de cada pareja cita–pasaje, hasta que no quede ningún «no-respalda».
- Las 151 afirmaciones en un estado final; `CLAUDE.md` con lo que el capítulo 2 deja dicho para los otros.

## Modelos y agentes
| Trabajo | Quién |
|---|---|
| Redacción, integración, cada punto de control | Sesión maestra (Opus 5.5) |
| Verificar cada pareja afirmación–pasaje, en contexto limpio | Opus 5.5, esfuerzo alto (D07) |
| Metadatos de la tanda 03, barridos, recálculo de cifras | Sonnet 5.5 |
| Recorrido en el navegador y medición de pistas | Sesión maestra |

## Peso
El capítulo pesa **359 KB** (368 000 bytes) contra el tope de 420 KB. El capítulo 1 creció **49 KB** con un trabajo
parecido (de 342 a 390 KB): si este crece igual, queda en unos 408 KB, a 12 del tope. Por eso el presupuesto es de
**40 KB** y se mide al cerrar cada fase. Lo que no cabe sale primero de la prosa repetida (el porqué de
`arch`/`rugarch` aparece hoy en cinco sitios; basta uno y cuatro remisiones) y de los pies de gráfica largos; las
citas, la anatomía y las derivaciones tienen prioridad. C2-C no añade peso.

## Verificación
- Verificador en verde con las 24 reglas, con el intérprete del entorno.
- Toda cifra nueva sale de un bloque ejecutado o de un recálculo archivado en el vault.
- Cada `<Cita>` con su fila en el registro y su pasaje leído; la lectura independiente no deja ningún «no-respalda».
- Ninguna afirmación de la línea base en `revisar`.
- En pantalla: las siete secciones, los dos R3 en los dos lenguajes, el cuestionario con la respuesta (10/10) y con la
  estrategia del «:» y de la opción más corta (3–4 de 10).
