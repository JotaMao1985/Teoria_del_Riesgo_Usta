# Plan de mejora del contenido del capítulo 3 — borrador para aprobar

> Escrito el 2026-11-12 por la sesión maestra, sobre la línea base del vault (el mismo proceso que los capítulos 1 y
> 2). Archivo: `Material html/03_TDR_CAPM.html`, commit `049960e`. **Nada de esto está hecho: es la propuesta que el
> docente aprueba, cambia o recorta.**

## Contexto

El capítulo 3 parte el riesgo de un activo en la parte que explica el mercado y la que no, estima la beta con su
error estándar, lee la SML y el alfa, mide cuánto quita la diversificación y termina en los límites del modelo, con
la beta del fondo contra su propio índice (0,6779) como problema central. Pasa las 24 reglas del verificador con
`--con-salidas`. No tiene **ninguna cita** ni lista de referencias, y lo que la línea base encontró es, como en los
capítulos 1 y 2, de **sentido, fuentes y coherencia**, con un error de fondo en la sección 5.

| Medida (línea base, 2026-11-12) | Cifra |
|---|---|
| Afirmaciones inventariadas (tres inventarios, fusionados por línea) | 168 (24 citadas, 13 criterio, 68 derivadas, 46 ejecutadas, 1 ilustrativa, 16 sin clasificar) |
| Contradichas por los datos, el código, el repositorio o el propio curso | **22** |
| Dudosas o sin poder juzgar sin leer la fuente | 65 |
| Fórmulas sin desarrollar, sin una hipótesis o que no dicen lo que hace su bloque | 14 de 20 sin derivación; 17 con algo que falta |
| Ejercicios con un defecto de contenido | 3 altos, 11 medios (sin contar los de gravedad baja) |
| Hilos con otros capítulos que no se cumplen o se cumplen a medias | 31 de 62 |
| `Eq` · `Derivacion` · `Anatomia` · `Cita` | 12 · 1 · 0 · 0 |

El detalle, una nota por afirmación, figura, símbolo, concepto e hilo, está en el vault (etiqueta
`linea-base-c03`; la evidencia y los guiones en `Capítulos/Cap 03 - línea base/`). Lo más grave, **comprobado por la
sesión maestra** sobre `datos/bvc_diario.csv` (`m_chk1.py`, `m_chk2.py`):

1. **La sección 5 culpa del tercio de beta que falta a las acciones que no se negocian, y el que llega tarde es sobre
   todo el índice** (`:4538–4552`). Regresando el fondo sobre el ETF de dos días antes a dos días después, el término
   que pesa es el del **día siguiente** (+0,209, t = 9,3); el del día anterior suma +0,067. Ecopetrol, Grupo Sura e ISA
   se mueven un día antes que el ETF (m(t+1) ≈ +0,27 cada una) y solo Banco de Bogotá va detrás, que es el caso que el
   capítulo cuenta. La suma de los cinco términos da **0,9983**. El argumento de espaciar el intervalo se sostiene; el
   mecanismo, no. Y el subtítulo atribuye el sesgo al defecto que declaró el capítulo 4 (las 101 ruedas sin variación),
   que lleva la beta solo a **0,7333**: un quinto de la brecha, como dice `CLAUDE.md` y promete el capítulo 1 (`:3766`)
   sin que el 3 lo mida.
2. **El fondo no rindió 7,69 %** (`:4057`, `:4162`, `:4198`, `:4765`, R7 de la sección 3, pregunta 10): es w′μ, la
   convención, que no es el rendimiento de ninguna cartera. Rebalanceado cada rueda rindió 11,83 % (media logarítmica ×
   252, como el 8,10 % del índice; compuesto, 12,56 % anual) y le ganó al índice;
   el alfa ronda +4,16 en vez de +0,02, y sigue sin distinguirse de cero. **La corrección ya existe**: el commit
   `ee8bfc3` (rama `claude/sweet-mclaren-0a350c`, sin fusionar), que además arregla el alfa de ISA (+5,20 → +5,29) y la
   pregunta del cuestionario. Se aplica limpio sobre la rama de trabajo.
3. **«El uno queda a catorce errores estándar»** (`:4411`, `:4596`, bloque `:3154`): el 0,0228 es el error estándar
   de MCO con varianza constante, y el capítulo anterior enseña que no lo es. Con errores robustos sale 0,0685 (HC1)
   y **0,0849** (Newey-West, 5 rezagos): el uno queda a 4,7 o 3,8. La conclusión sobrevive; la cifra no.
4. **Las betas semanal y mensual son una de cinco y una de veintiuna** (`:4550`, `:4565`): dependen de la rueda en que
   se empiece a sumar. La semanal va de 0,8651 a 0,9549 según la fase y la mensual de 0,8736 a 1,0175; el 0,8522
   quincenal que el texto llama «fila suelta» es la peor de diez fases. El R7 de la sección 5 se apoya en el 0,9486
   (759 000 millones de cobertura).
5. **La motivación de la sección 1 cuenta un día que no ocurrió** (`:3741`): «un mes antes, Grupo Sura había caído sola
   un día en que el índice subió». Entre el 15/1 y el 12/3/2020 el único día así es el 19/2, con −0,12 %.
6. **La fórmula de la diversificación no es la del equiponderado** (`:4260–4283`): usa la media de las desviaciones y
   de las correlaciones. Con la varianza media y la covarianza media es una identidad exacta, reproduce el 1,5469 sin
   error y el suelo es 1,1361, no 1,1322. Y la tabla llama al suelo «el riesgo de que Colombia entera se mueva»
   mientras la pregunta 6 del cuestionario dice que el 44 % de él no lo explica el índice. «Con cuatrocientos,
   exactamente lo mismo que con cuarenta» (`:4224`) es falso: 52,2 % contra 50,4 %.
7. **La portada está desactualizada en lo que declara** (`:3674`, `:3688`): dice que `curva_tes.csv` «todavía no está»
   y que el 7,00 % se sustituirá cuando exista. Existe desde el 2026-09-29 y D-D se **mantuvo**. Y la tasa anualizada
   sale 6,7667 donde va 6,7668 (`:4154`), presentada como «logarítmica» y explicada con ln(1,07) = 6,7659, que es la
   otra convención.
8. **Tres ejercicios altos**: el R7 de la sección 3 (el gestor «empató» sobre w′μ: se resuelve con `ee8bfc3`), la
   pregunta 10 del cuestionario (ídem) y el R3 del R² de ISA, cuyo enunciado delata la respuesta («lo que falla es la
   línea de comentario», y hay una) mientras la línea siguiente trae el mismo error y no puntúa.
9. **El par de febrero de 2025 no entra «arriba y abajo» del cociente** (`:4576`): el ETF subió 1,55 % y 2,02 % esos
   días; la anomalía está solo en los emisores. La beta casi no se mueve porque los dos productos cruzados se
   compensan.
10. **Promesas a otros capítulos que no se cumplen**: «la beta vuelve como razón de cobertura» en el capítulo 11
    (`:4780`: el 11 no la menciona); la sección 5 «muestra» la beta de Banco de Bogotá afectada por iliquidez
    (`:3794`, `:3991`: solo reestima la del portafolio); «salir del país» en la unidad 2; la «ventana distinta de la de
    evaluación» en el 7. La tabla de niveles de IA omite el R8 (`:4786`), lo mismo que el capítulo 2 corrigió.

Afirmaciones sobre el mundo sin respaldo: la línea de tiempo entera salvo Markowitz (Sharpe 1964, Jensen 1968 y sus
«115 fondos», Roll 1977, Dimson 1979, Fama y French 1992), la tasa de política del Banco de la República («empieza en
4,25 %, baja a 1,75 %, llega a 13,25 %»), «lo que casi nadie hace» (`:3656`), «0,60 es lo normal entre acciones de un
mismo sector» (`:4339`), «pesados casi como los pesa el índice» (`:4409`: el panel no tiene Bancolombia) y «treinta y
dos emisores son prácticamente todo» (`:4282`).

## Decisiones que necesita el docente

| | Pregunta | Recomendación |
|---|---|---|
| **C3-A** | ¿Se trae `ee8bfc3`? | **Sí, en la fase 0, tal cual** (cherry-pick sobre la rama; se aplica sin conflicto y pesa 4 KB). Es el mismo error que la línea base encontró en cuatro sitios, ya corregido, ejecutado y con las letras de la regla 14 vueltas a medir. Los otros dos commits de esa rama (capítulos 4, 6, 7, 9, 11 y 12) no son de este capítulo y siguen esperando su propia fusión. |
| **C3-B** | ¿Cómo se reporta el error estándar de la beta? | **Las dos columnas, como la convención del curso**: el bloque de la sección 2 imprime el de MCO y el de Newey-West, escrito a mano en las dos pestañas (es una suma de autocovarianzas; así no hace falta declarar `sandwich` en el entorno de R), y la prosa dice que con heterocedasticidad —la del capítulo 2— el honesto es el segundo. «Catorce errores estándar» pasa a «casi cuatro»; ninguna conclusión cambia. |
| **C3-C** | ¿Qué se hace con el mecanismo de la sección 5? | **Medirlo y decirlo.** El bloque añade la regresión con el mercado de un día antes y uno después y la suma de sus coeficientes (el estimador de Dimson; cómo se relaciona con el de Scholes y Williams se dice solo después de leer las dos fuentes): 0,9359 con un día a cada lado y 0,9983 con dos; la prosa cuenta que el que llega tarde es sobre todo el ETF y que Banco de Bogotá es el caso de la acción que no cotiza. Las betas semanal y mensual con el rango de sus fases (la regla del capítulo 7 para todo submuestreo) y las 101 ruedas medidas: un quinto. El R7 de cobertura se reescribe sobre esas cifras. |
| **C3-D** | ¿Qué fórmula de diversificación? | **La exacta, con varianza media y covarianza media**: reproduce el equiponderado sin error, el laboratorio sigue igual de simple (dos deslizadores) y el «error de 0,0059» desaparece porque no era un error. El suelo se llama «la covarianza media» y no «el riesgo de que Colombia entera se mueva», y la pregunta 6 queda coherente con la tabla. |
| **C3-E** | ¿Qué dice la portada de la tasa? | **D-D tal como quedó**: 7,00 % E.A. declarada, mantenida tras medirla contra `curva_tes.csv` en el capítulo 9 (0,21 pp sobre el promedio de la curva a un año en 2018–2025), con remisión al 9 y sin «cuando exista». La anualizada es **6,7668 % (diaria efectiva × 252)**, y ln(1,07) = 6,7659 se nombra como la otra convención, la que usa un capítulo en logaritmos puros, no como su explicación. La tasa de política con fuente (serie del Banco de la República) o fuera. |
| **C3-F** | ¿Qué fuentes se leen? | Tanda 04 a Zotero, todas abiertas: **Fama y French (2004), «The Capital Asset Pricing Model: Theory and Evidence»** (*Journal of Economic Perspectives*), que según su resumen repasa la teoría y las pruebas del modelo —qué cubre de Sharpe, Lintner, Jensen, Roll y Fama-French 1992, y con qué página, se sabe al leerlo—; la **información científica de los Nobel de 1990** (Markowitz, Sharpe) **y de 2013** (Fama: pruebas del CAPM, tres factores); la **tasa de política monetaria** del Banco de la República (SUAMECA); y la ficha del **iShares MSCI COLCAP** para lo que es el ETF. Que el docente adjunte, si los tiene, Sharpe (1964), Jensen (1968), Roll (1977), Dimson (1979) y Scholes y Williams (1977): están en Wiley y Elsevier. Si Jensen no llega, «115 fondos» se dice por lo que diga la fuente leída o sale. |
| **C3-G** | ¿Qué se hace con lo que la línea base encontró **fuera** del capítulo 3? | Lo que es **una línea** se corrige aquí en la fase 7: la remisión al capítulo 11 (la beta como razón de cobertura vive en el propio capítulo 3 y en el T3), la nota del `arch`/`rugarch` de `:3907` (el porqué que el capítulo 2 corrigió) y lo que el capítulo 1 promete del 3 (el «un quinto»). El **taller `TDR-03.qmd`** —no cubre la sección 3 y pide una beta de Dimson que el capítulo no enseña; con C3-C la enseñaría— se revisa en una sesión aparte, después de este capítulo. |

## Fases

Mismo orden que en los capítulos 1 y 2: fuentes antes de la prosa, exactitud antes de la ampliación, y el capítulo
entero antes de la coherencia hacia afuera. Cada fase cierra con el verificador en verde y un commit.

### Fase 0 · Preparación
- `ee8bfc3` por cherry-pick (C3-A); verificador con `--con-salidas`.
- Exportar `referencias.json` desde Zotero; `<Referencias />` al final de la evaluación.

### Fase 1 · Fuentes
- Tanda 04 (C3-F) por el mismo circuito: metadatos copiados, RIS, comprobación por la API, vista previa APA.
- Leer las abiertas y las que el docente adjunte; cada pasaje con página en su nota de afirmación, con un lector y un
  verificador independiente.
- Las 24 citadas pasan a `verificada` o se reescriben; las 65 en `revisar` se resuelven una por una.

### Fase 2 · Exactitud
Las 22 contradichas y los tres ejercicios altos, sin ampliar nada. Una lista cerrada:
- Portada: la tasa (C3-E); «lo que casi nadie hace» como criterio.
- Sección 1: la motivación con un día real (el 2/3/2020, si sirve: Sura −3,33 % con el índice +1,45 %, aunque ese día
  también cayeron Ecopetrol e ISA; o el día que el panel dé); el pie de `cap3-descomp` sobre lo que se ve.
- Sección 2: 189 → 179 ruedas; la nota de `:3907` sobre `arch`/`rugarch`; el error estándar (C3-B).
- Sección 3: 6,7668 y su convención; la pista del R1 que dice que los seis valores coinciden (el paso 1 da 1,33 y el
  bloque 1,34); el comentario del bloque con 8,0987 (es 8,1027).
- Sección 4: la fórmula exacta (C3-D), «exactamente lo mismo con cuatrocientos», el suelo, y la pregunta del
  laboratorio sobre los emisores extranjeros (con correlación 0,3 diversifican **menos** que veinte locales: replantear).
- Sección 5: el mecanismo y las fases (C3-C); el par de febrero; el R3 del R² de ISA (enunciado que no delate, y la
  línea del `print` resuelta: o se corrige o puntúa); el R7 de cobertura.
- Evaluación: pregunta 6 coherente con la tabla; «t = 0,0024» (sale 0,0023); la tabla de niveles con el R8.

### Fase 3 · Secciones 1 y 2
- El modelo de mercado dice lo que hace el código: rendimientos logarítmicos brutos, sin exceso; el mercado es el ETF
  ICOLCAP; la covarianza cero entre mercado y residuo es una identidad de MCO, no un supuesto.
- La descomposición exacta solo con el mismo divisor en los dos lados (el R3 de la sección 5 depende de eso).
- β = ρ·σᵢ/σ_M escrito antes de usarlo en R² = ρ²; el error estándar de la beta con su fórmula y sus hipótesis.
- La beta de Banco de Bogotá con su versión semanal (0,3466 → 0,618), que es lo que las secciones 1 y 2 prometen.

### Fase 4 · Secciones 3 y 4
- La SML y el alfa de Jensen como `Eq`, con Sharpe y Lintner citados; el alfa del modelo de mercado (pb diarios) y el
  de Jensen (pp anuales) distinguidos —hoy la misma letra en dos unidades— y R mayúscula, que en el capítulo 1 es el
  rendimiento simple.
- **`Anatomia` de la regresión del modelo de mercado** (α, β, σ²_ε, R², EE(β)), cada pieza con su cifra del capítulo,
  y **`Derivacion` de la diversificación** (la varianza del equiponderado en dos líneas, de la forma general
  ΣΣwᵢwⱼσᵢⱼ al suelo c̄).
- La beta del portafolio como promedio ponderado: exacta sobre w′r; el fondo rebalanceado tiene 0,6756.

### Fase 5 · Sección 5
- C3-C entero; el error estándar de la media y el tamaño de muestra con sus unidades (hoy n son ruedas y dos líneas
  después años); la crítica de Roll y el ETF como sustituto, citados.

### Fase 6 · Portada, cierre y evaluación
- La línea de tiempo con `<Cita>` en cada hito que se pueda leer; lo que no, reescrito sin la cifra o fuera.
- El `Pipeline` y «Antes de cerrar» con destinos que existen; la tabla de niveles de IA.
- Volver a medir las reglas 13–17 y las zonas ciegas de forma: el R7 de la sección 5 tiene la correcta como única
  opción con «:» y la única que niega; el R5 tiene dos pares de pasos sin anclar; el emparejamiento empareja α con la
  definición de Jensen mientras el enunciado habla de la salida de la regresión.

### Fase 7 · Coherencia hacia afuera (C3-G)
- Capítulo 1 (`:3766`, la promesa del quinto), la remisión al 11, y lo que capítulos 7, 11 y 12 y el taller 7 citan
  del 3 (6,7668, 0,6779, 0,9486), comprobado después de la fase 5.
- Nota para la sesión del taller 3.

### Fase 8 · Cierre
- `verificar.py --con-salidas` con las 24 reglas; recorrido en el navegador (las cinco secciones, los laboratorios
  barridos, las gráficas con su pie al lado, consola, 375 px).
- Lectura independiente de cada pareja cita–pasaje, y cada una corregida vuelve al verificador hasta quedar en
  «respalda» (no basta con que no quede ningún «no-respalda»).
- Un agente con contexto limpio audita todas las cifras nuevas del diff que no sean salidas `#>`.
- Las 168 afirmaciones en un estado final; `CLAUDE.md` con lo que el capítulo 3 deja dicho para los otros.

## Auditoría del propio plan (2026-11-12)
Antes de pedir la aprobación, la sesión maestra recalculó sobre el panel **todas** las cifras de este plan que venían
de los inventarios (`m_chk3.py`, en la carpeta de la línea base del vault): la identidad exacta del equiponderado
(1,5469 y el suelo 1,1361), las reducciones con 4, 40 y 400 emisores (35,19 · 50,39 · 52,18 %), el 44 % del suelo que
el índice no explica, 8,1027, 6,766773, la beta del fondo rebalanceado (0,6756), la de Banco de Bogotá (0,3466 y
0,6180 semanal), el alfa de Jensen sobre w′r (0,0176, EE 7,5040, t = 0,0023) y las dos líneas del R3 de ISA que
llevan el mismo error. Todas se sostienen. Se corrigieron tres cosas del borrador: el 11,83 % iba sin su convención,
el plan atribuía a Scholes y Williams una forma del estimador sin haberlo leído, y decía de memoria qué cubre Fama y
French (2004). Dos limitaciones quedan dichas: el mecanismo por el que el ETF llega tarde **no está medido** (el plan
mide el efecto, no su causa), y en el vault las afirmaciones ejecutadas y derivadas que un inventario dio por
sostenidas quedaron en `verificada`, como en los capítulos 1 y 2, aunque el esquema reserva ese estado al verificador
independiente de una cita: ninguna de ellas es una cita.

## Modelos y agentes
| Trabajo | Quién |
|---|---|
| Redacción, integración, cada punto de control | Sesión maestra (Opus 5.5) |
| Verificar cada pareja afirmación–pasaje, en contexto limpio | Opus 5.5, esfuerzo alto (D07) |
| Metadatos de la tanda 04, barridos, recálculo de cifras | Sonnet 5.5 |
| Recorrido en el navegador y medición de pistas | Sesión maestra |

## Peso
El capítulo pesa **373 KB** contra el tope de 420. `ee8bfc3` le suma 4 KB, y los capítulos 1 y 2 crecieron 49 y
24 KB con un trabajo parecido. El presupuesto es de **40 KB** y se mide al cerrar cada fase. Si no cabe, sale primero
de la prosa repetida (la negociación no simultánea se cuenta hoy en tres secciones) y de los pies largos.

## Verificación
- Verificador en verde con las 24 reglas, con el intérprete del entorno.
- Toda cifra nueva sale de un bloque ejecutado o de un recálculo archivado en el vault.
- Cada `<Cita>` con su fila en el registro y su pasaje leído; la lectura independiente no deja ningún «no-respalda».
- Ninguna afirmación de la línea base en `revisar`.
- En pantalla: las cinco secciones, los R3 en los dos lenguajes, el emparejamiento, el cuestionario con la respuesta
  (10/10) y con la estrategia del «:» y de la opción más corta (3–4 de 10).
