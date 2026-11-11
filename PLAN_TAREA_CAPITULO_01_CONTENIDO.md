# Plan de mejora del contenido del capítulo 1 — borrador para el PC4

> Escrito el 2026-11-11 por la sesión maestra, sobre la línea base del vault (F4 de la gestión documental).
> Archivo: `Material html/01_TDR_Riesgo_y_rendimiento.html`, commit `e7fc9d1`. **Nada de esto está hecho:
> es la propuesta que el docente aprueba, cambia o recorta.**

## Contexto

El capítulo 1 es el que los otros catorce dan por sabido: declara la convención de rendimientos, presenta el
fondo y sus pesos, el panel congelado y el entorno reproducible. Pasa las diecisiete reglas del verificador y sus
cifras ejecutadas son exactas (las diecisiete que se recalcularon coinciden). Lo que la línea base encontró no es
de cálculo sino de **sentido, fuentes y coherencia**:

| Medida (línea base, 2026-11-11) | Cifra |
|---|---|
| Afirmaciones inventariadas | 163 (42 citadas, 44 criterio, 42 derivadas, 29 ejecutadas, 6 ilustrativas) |
| Contradichas por los datos, la norma vigente o el propio curso | **17** |
| Dudosas o sin poder juzgar sin leer la fuente | 77 |
| Citadas sin ninguna fuente en Zotero | 9 (historia, Knight, tres líneas, creación de la SFC…) |
| Fórmulas sin desarrollar o con una hipótesis de menos | 10 de 12 |
| Ejercicios con un defecto de contenido | 3 altos, 11 medios (sin contar los de gravedad baja) |
| Hilos con otros capítulos que no se cumplen o se cumplen a medias | 36 de 78 |

El detalle, una nota por afirmación, figura, símbolo, concepto e hilo, está en el vault (`Vault/Afirmaciones/`
con la etiqueta `linea-base-c01`, y la nota `Cap 01`). Lo más grave, comprobado por la sesión maestra:

1. **Una frase falsa en la definición de riesgo** (`:3353`): «uno que rinde 30 % o −20 % con la misma
   probabilidad lo tiene, aunque su media sea mejor». La media es 5 %, peor que 8 %; el Quiz 1 lo dice bien.
2. **El capítulo incumple su propia regla de niveles.** Prohíbe reportar lo ganado con la serie de la convención
   (`:4194–4196`) y luego: la motivación de la sección 4 dice que el fondo «perdió 17,76 %» el 16/3/2020 (fue
   **−16,12 %**); la gráfica del índice termina en +79,4 % cuando el fondo hizo +145,82 %; la tabla de momentos
   anualiza «componiendo» un 7,99 %.
3. **Un supuesto que nunca se declara: el fondo se rebalancea a diario a 30/20/25/25.** El +145,82 % y el
   +10,21 % de 2022 son los de ese fondo; comprando y manteniendo serían +88,58 % y +3,85 %.
4. **La peor brecha de la convención (103,95 pb) no cae en un día extremo** (`:3681`): cae el 31/3/2022, con el
   portafolio en −2,41 % y Banco de Bogotá en −27 %. La causa es la dispersión entre activos
   (½[Σwᵢrᵢ² − (Σwᵢrᵢ)²], que reproduce la brecha con correlación 0,999), no el tamaño del movimiento.
5. **«Las dos ruedas más extremas de los ocho años»** (`:4007`, `:4405`, Quiz 8): el par de febrero de 2025 es la
   2.ª y la 3.ª; la 1.ª es el 16/3/2020.
6. **Las 101 ruedas «sin variación en ningún precio» que «se llevan un tercio de la beta»** (`:3417`, `:4150`):
   son los cuatro emisores quietos (el ETF se mueve en 97) y explican un quinto. Es el error que `CLAUDE.md` ya
   advierte.
7. **Normas sustituidas presentadas como vigentes**: SARM/SARC/SARO/SARL y el Capítulo XXI (`:3399`, `:3473`,
   `:4468`, línea de tiempo). La corrección ya existe sin commit en el worktree `cool-euclid-5c3617`.
8. **BCBS 239 parafraseado de más** (`:3484`): el documento no pide que los datos tengan «el mismo nivel que los
   modelos», y va dirigido a bancos sistémicos, no a un fondo de pensiones.
9. **El pie del QQ-plot dice lo contrario de lo que se ve** (`:3943`): el centro no «se pega a la diagonal»; queda
   0,25–0,30 desviaciones por debajo, porque la σ está inflada por las colas.
10. **El paso 4 de la derivación omite una hipótesis** (`:3608`): Var(Σr) = Tσ² exige igual varianza, no solo
    independencia. Es la hipótesis que el capítulo 2 rompe y de la que cuelga la raíz del tiempo del 4 y del 12.

## Decisiones que necesita el docente (PC4)

| | Pregunta | Recomendación |
|---|---|---|
| **C1-A** | ¿Cómo se define «riesgo»? | Mantener la del curso (dispersión de resultados, con Knight) pero **contrastada y citada**: la de la Superfinanciera (posibilidad de pérdida), la de ISO 31000 (efecto de la incertidumbre sobre los objetivos) y la de un texto del syllabus. Hoy el capítulo usa las dos sin decirlo: dispersión en la prosa, pérdida en el mapa y en el R6. |
| **C1-B** | ¿Se declara el rebalanceo diario? | **Sí, como convención declarada del curso**, en la portada y en la sección 3, con la cifra de comprar y mantener al lado una vez. No cambia ninguna cifra de ningún capítulo. |
| **C1-C** | ¿Qué cifra lleva la motivación de la sección 4? | La exacta (−16,12 %, 128 963 millones), con la de la convención en la sección 3, donde se explica. |
| **C1-D** | ¿Se trae la actualización de normas de `cool-euclid-5c3617`? | **Sí, para el capítulo 1**, revisada contra la vigencia que verificó F2 y con citas `<Cita>`. La de los capítulos 2, 4, 6 y 9 va aparte. |
| **C1-E** | ¿La portada lleva la caja de convenciones de los capítulos 7–12? | **Sí**: rendimientos (logarítmicos como convención, aritméticos para niveles), rebalanceo diario, 252 ruedas por año como convención (el panel trae 239,5), pesos D-A y la tasa del curso (7,00 % E.A., que el capítulo 3 usa y el 1 no menciona). |
| **C1-F** | ¿Qué fuentes se leen? | Tanda 02 a Zotero: Knight (1921), Bachelier (1900), Mandelbrot (1963), el modelo de tres líneas del IIA (2020), el decreto que crea la SFC (2005), **Cont (2001) sobre los hechos estilizados** —la fuente natural de la sección 4— e ISO 31000. Y que el docente adjunte en Zotero los PDF de McNeil–Frey–Embrechts (cap. 1 y 3) y, si los tiene, Hull y De Lara. |
| **C1-G** | ¿Qué se hace con lo que la línea base encontró **fuera** del capítulo 1? | Una sesión aparte por grupo, cada una con su plan: el capítulo 3 reporta «rindió 7,69 %» con la serie de la convención; el 7 habla de «D-A» y del «tercer criterio» (en el 1 es el segundo); el 12 dice que «los once anteriores» coinciden siempre en las dos pestañas (el 5 y el 10 no); las normas de los capítulos 4 y 6. |

## Fases

Cada fase cierra en un punto de control. El orden importa: las fuentes antes de la prosa, la exactitud antes de la
ampliación, y el capítulo entero antes de la coherencia hacia afuera.

### Fase 0 · Preparación
- Fusionar en esta rama el circuito de citas de F3 (`refs/heads/claude/happy-kalam-922ce4`), con permiso del
  docente; sin él no hay `<Cita>` ni lista de referencias.
- Traer el parche de normas de `cool-euclid-5c3617` para el capítulo 1 (C1-D) y comparar con lo que el archivo
  cambió después del 2026-10-01.
- Exportar `referencias.json` desde Zotero.

### Fase 1 · Fuentes (antes de escribir una línea)
- Tanda 02 (C1-F), con el mismo circuito de F2: metadatos verificados, RIS, comprobación por la API, vista previa.
- Leer las abiertas y las que el docente adjunte; cada pasaje con página en su nota de afirmación.
- Las 42 citadas pasan a `leida` o se reescriben como criterio, derivada o ilustrativa. Las 77 en `revisar` se
  resuelven una por una con decisión escrita.

### Fase 2 · Exactitud
Las 17 contradichas y los 3 ejercicios de gravedad alta (el R6 y el R2 de la sección 1 y el Quiz 8), sin ampliar nada: la frase de la media, las «dos ruedas
más extremas» (prosa, pista y Quiz 8), las 101 ruedas y el tercio de la beta, la motivación del 16/3/2020, el pie del
QQ-plot, la peor brecha, «los quince capítulos leen el panel», la sustitución del índice (declararla en
`MANIFIESTO.md`, que es donde el capítulo dice que está), la lista de dónde difieren las pestañas, el R2 sobre el bono
ilíquido (valoración con proveedor de precios, no a último precio). Commit propio.

### Fase 3 · Secciones 1 y 2
- Definición de riesgo (C1-A) y el par riesgo/incertidumbre con fuente.
- Liquidez de mercado y de financiación separadas (hoy se mezclan entre el mapa y el R6).
- Apetito, tolerancia, capacidad y límite distinguidos; el modelo de tres líneas con la versión de 2020 del IIA.
- Normas vigentes con `<Cita>` (**es el piloto de F3**): SIAR en la CBF, BCBS 239 con su alcance real.
- «La primera pregunta de un supervisor… no aparece en ningún manual» se reescribe como criterio del docente.

### Fase 4 · Sección 3 (rendimientos)
- `Anatomia` de R_t y r_t: qué es P_t (cierre **ajustado**: rendimiento total), unidades, y el término siguiente de
  la aproximación (ln(1+x) = x − x²/2 + …), que explica cuándo importa.
- `Derivacion` nueva: del portafolio exacto a la convención, con la desigualdad de Jensen y la brecha
  ½[Σwᵢrᵢ² − (Σwᵢrᵢ)²]; de ahí sale por qué la peor brecha es un día de dispersión y no de caída.
- El rebalanceo diario declarado (C1-B), con comprar y mantener al lado.
- El paso 4 de la derivación con su hipótesis completa (no correlación e igual varianza) y el puente honesto al
  capítulo 12, que mide que en este panel no se cumple.
- Una sola letra para el número de rendimientos (hoy T, n y h) y un nombre para el acumulado.

### Fase 5 · Sección 4 (momentos)
- `Anatomia` de los estimadores: σ̂ con n − 1, σ̃ con n (hoy sin definir), ŝ (que choca con la `s` de los bloques) y
  κ̂; por qué `pandas.kurt()` da 25,84 y no 25,77.
- Las dos fórmulas que hoy solo están en el código: ν = 6/κ + 4 para la t (con su condición ν > 4 y su
  fragilidad: quitar ocho ruedas lleva 4,23 a 6,37) y los años esperados entre dos eventos de |z| = 11.
- Los hechos estilizados con fuente (Cont, 2001; McNeil et al.) en vez de «el patrón habitual».
- El R1 de la curtosis reproducible a mano desde lo que muestra (hoy no lo es en los pasos 7 y 8).

### Fase 6 · Sección 5 (entorno reproducible)
- Las 101 ruedas bien descritas; la lista de excepciones de las dos pestañas completa (4, 5, 12; y QuantLib en 9–10).
- El R5 con el paso «elegir la definición de rendimiento» anclado; el R8 coherente con la sección sobre quién decide
  el tratamiento del par defectuoso.

### Fase 7 · Portada, cierre y evaluación
- La caja de convenciones (C1-E); la línea de tiempo con `<Cita>` en cada hito y el de 2023 (SIAR); el gancho de la
  portada declarado ilustrativo.
- «Antes de cerrar el capítulo», como en el 7–11; el `Pipeline` del cierre hasta la unidad 3, que hoy llega al 4.
- La tabla de niveles de IA con el R8 que la portada promete.
- Quiz 2 (choca con la medida de Roll del taller 10), 4 (el distractor del rebalanceo es defendible), 6 y 8.
- Volver a medir las reglas 13–17 y las zonas ciegas de forma: tocar opciones mueve sus pistas.

### Fase 8 · Cierre
- `verificar.py --con-salidas` con las 24 reglas; recorrido en el navegador (todas las secciones, deslizadores,
  consola, 375 px); lectura independiente de cada pareja cita–pasaje.
- Las notas del vault en su estado final; `CLAUDE.md` con lo que el capítulo 1 deja dicho para los otros.

## Modelos y agentes
| Trabajo | Quién |
|---|---|
| Redacción, integración, cada punto de control | Sesión maestra (Opus 5.5) |
| Verificar cada pareja afirmación–pasaje, en contexto limpio | Opus 5.5, esfuerzo alto (D07) |
| Metadatos de la tanda 02, barridos, recálculo de cifras | Sonnet 5.5 |
| Recorrido en el navegador y medición de pistas | Sesión maestra |
| Lo que está fuera del capítulo 1 (C1-G) | Sesiones aparte, una por grupo |

## Verificación
- Verificador en verde con las 24 reglas, con el intérprete del entorno.
- Toda cifra nueva sale de un bloque ejecutado o de un recálculo archivado en el vault.
- Cada `<Cita>` con su fila en el registro y su pasaje leído; la lectura independiente no deja ningún «no-respalda».
- Las 163 afirmaciones en un estado final (`resuelta`, `verificada`, `leida` o `eliminar`), ninguna en `revisar`.
- En pantalla: las siete secciones, las gráficas con su pie al lado, los dos R3 en los dos lenguajes, el cuestionario
  respondido con la respuesta (10/10) y con la estrategia de la opción más corta (3–4 de 10).
