# Teoría del Riesgo — contexto del proyecto

Material de estudio autónomo del espacio académico **Teoría del Riesgo** (Universidad Santo
Tomás, Estadística, periodo 8, 2 créditos, 2026-II). Quince capítulos, cada uno un archivo
HTML autocontenido que se abre con doble clic.

**El plan es la fuente de verdad:** [`PLAN_MATERIAL_TEORIA_DEL_RIESGO.md`](PLAN_MATERIAL_TEORIA_DEL_RIESGO.md).
Trae las decisiones de arquitectura (D1–D9), el detalle capítulo por capítulo, la lista de
tareas con sus criterios de aceptación y el registro de ejecución. Léalo antes de tocar nada.

Las convenciones de autoría están en [`Material html/README.md`](Material%20html/README.md).

## Estado

| Fase | Estado |
|---|---|
| 0 · Fundación (T1–T5) | ✅ completada 2026-08-07 · punto de control A aprobado |
| 1 · Piloto: capítulo 4 (VaR) — tarea 6 | ✅ completada 2026-08-08 · punto de control B **aprobado** |
| 2 · Unidad 1 (T7–T11) | 🔄 en curso · **T7 (cap. 1), T8 (cap. 2), T9 (cap. 3) y T10 (cap. 5) completadas** · siguen **T10-bis (saneamiento)** y T11 (cap. 6) |

⚠️ **Antes de escribir el capítulo 6 va la tarea 10-bis**, que arregla cuatro defectos
que el verificador no ve y que cada capítulo nuevo hereda: el barajado de opciones
—se toca el componente, así que hay que re-estampar y re-verificar los cinco—, el
`Accordion` del capítulo 4, la clase `chart-h-400` y los `<title>` estáticos. El
encargo completo, con criterios de aceptación, está en el plan.
| 3–5 · Unidad 2, unidad 3, portal y Quarto | pendientes |

Los capítulos **4** (VaR) y **1** (riesgo y rendimiento) son la **rebanada de referencia**:
lo que allí quedó decidido se repite trece veces. Antes de escribir otro capítulo, léalos —
del 4, sobre todo la sección 3, donde el material trata las anomalías del panel, y la 4, el
primer bloque cuyas dos pestañas declaran cifras distintas a propósito; del 1, la sección 3,
que es donde se cuantifica y se declara la convención de rendimientos que usan los quince.

El **capítulo 5** añade la segunda excepción de las dos pestañas —su bloque de Montecarlo— y
la segunda convención de estimación declarada del curso: el **ES es el promedio simple de las
ruedas que exceden el VaR**, no el ES exacto de la muestra. La brecha está medida y escrita
(30 millones al 97,5 %, **884 al 99 %**), como la de agregación del capítulo 1. Cualquier
capítulo que vuelva a calcular un ES —el 8, el 15— usa esa misma convención o declara por qué
no.

**Las tres decisiones abiertas están resueltas** (2026-08-08, detalle en el plan):

- **D-A · pesos del portafolio:** se mantienen 30/20/25/25 sobre 800 000 millones. El
  capítulo 1 los presenta como decisión declarada del curso, con tres criterios explícitos.
- **D-B · `arch` contra `rugarch`:** se declara la discrepancia, como la sección 4 del
  capítulo 4. El capítulo 2 lo cuenta; el 1 ya lo anuncia.
- **D-C · punto de control B:** aprobado tal cual. Mismas convenciones para lo que queda.

⚠️ **D-D está declarada pero sin ratificar** (2026-08-09). El capítulo 3 necesitaba una
tasa libre de riesgo y no había ninguna en el plan, así que declara **7,00 % E.A.** como
decisión del curso, del mismo tipo que D-A. La usan dos bloques y una gráfica del capítulo
3, y **afecta a C7, C11 y C12**: conviene ratificarla o cambiarla antes de la fase 3.
Ojo con la convención: el 7,00 % es efectivo y el curso anualiza logarítmicos por 252, con
lo que la misma tasa vale **6,7667 %**. Mezclarlas mueve las cifras de la SML.

⚠️ **El verificador tiene dos zonas ciegas, y las dos se cierran abriendo el capítulo.**

1. **No parsea JavaScript.** Un error de sintaxis en el JSX —`-a ** 2`, que es ilegal— deja
   la página **en blanco** y `verificar.py` devuelve OK igual: las doce reglas son análisis
   estático de texto. En el capítulo 1 esa pasada cazó exactamente eso.
2. **La regla 9 audita los bloques de código, no los laboratorios.** Lo que calcula el
   navegador solo lo comprueba quien lo abra. En el capítulo 2, el laboratorio del
   pronóstico pasaba las doce reglas devolviendo 1,4057 % donde su propio bloque declara
   1,4370 %, y su nota afirmaba que coincidían.

Y una tercera cosa que solo se ve mirando: en el capítulo 1, un pie de gráfica afirmaba lo
contrario de lo que la gráfica mostraba. **Abra el capítulo, recorra las secciones, mueva
los deslizadores y mire la consola antes de darlo por terminado.**

El capítulo 3 añadió dos zonas ciegas más, y ninguna es JavaScript:

3. **La regla 6 comprueba que `lineaCorrecta` sea un objeto por lenguaje, no que apunte a
   la línea correcta.** En el capítulo 3 señalaba en Python la primera línea de un
   comentario de tres, que era la verdadera; la falsa estaba en la segunda. **Responda cada
   R3 en pantalla, en los dos lenguajes.**
4. **Una `TablaTraza` puede no ser reproducible a mano.** Si los factores se muestran
   redondeados y el resultado sale del cálculo exacto, el estudiante multiplica lo que ve y
   la tabla le dice que está mal. Calcule cada casilla **desde los valores redondeados que
   se muestran**.

El capítulo 5 añadió dos más, y la segunda afecta a todo lo escrito hasta ahora:

5. **Ninguna regla valida los NOMBRES de las propiedades de un componente.** `Accordion`
   recibe `titulo` y `contenido`; escribirle `title` y `content` —que es lo que usa el resto
   del mundo React— deja el acordeón con las filas **vacías**, sin un error. Las doce reglas
   pasan. ⚠️ **El capítulo 4 lo tiene sin corregir** en su sección 1. Antes de usar un
   componente, mire su firma en `_plantilla/tr-core-extra.jsx` o `tr-core-base.jsx`.
6. **`MCQ` y `Quiz` NO barajan las opciones.** En los capítulos 1 a 4 la respuesta correcta
   es **siempre la primera**, 15 de 15 en cada uno: se saca 10 sobre 10 sin leer. El
   capítulo 5 reparte la posición correcta entre las cuatro. Al escribir un capítulo nuevo,
   repártalas; y decida si conviene barajar en el componente, que arregla los cuatro
   anteriores de una vez pero obliga a re-estampar TR-CORE y re-verificar los cinco.

Y una advertencia de estilo que el verificador tampoco ve: `chart-h-400` **no está definida**
en el CSS y se usa trece veces en los capítulos 1 a 4. Plotly cae en su altura por omisión y
la gráfica sale más alta de lo que el autor escribió. Las clases que existen son
`chart-h-320`, `chart-h-360` y `chart-h-420`; el capítulo 5 solo usa esas.

## Ciclo de trabajo

```bash
conda activate teoria-riesgo
python3 "Material html/_plantilla/ensamblar.py"                    # fuentes → tr-base.html
python3 "Material html/_plantilla/migrar.py"                       # plantilla → capítulos
python3 "Material html/_plantilla/verificar.py" --con-salidas      # las doce reglas
```

⚠️ **La regla 9 ejecuta los bloques de Python con el mismo intérprete que corre el
verificador** (`sys.executable`). Si lo lanza desde el Python del sistema, todo capítulo que
importe `arch`, `QuantLib`, `cvxpy`, `xgboost` o `pyextremes` fallará con un
`ModuleNotFoundError` que parece un error del material y no lo es. Active el entorno
primero. `python3 entorno/humo.py` comprueba que esté todo.

⚠️ **Si `conda activate` no funciona** —dentro de un agente en modo restringido devuelve
`__conda_exe: permission denied`— use el intérprete del entorno por ruta absoluta, que es
exactamente lo que `conda activate` deja en `sys.executable`:

```bash
/opt/homebrew/Caskroom/mambaforge/base/envs/teoria-riesgo/bin/python3 "Material html/_plantilla/verificar.py" --con-salidas
```

R va aparte: `verificar.py` invoca el `Rscript` del sistema (`/opt/homebrew/bin/Rscript`),
no uno del entorno de conda, y los paquetes de `entorno/instalar.R` están instalados ahí.

Un capítulo nuevo nace copiando `_plantilla/tr-base.html`, cambiando `CONFIG` y
reemplazando las secciones. **El bloque entre `TR-CORE INICIO` y `TR-CORE FIN` no se edita
a mano**: se genera y se estampa. La comprobación 1 existe para cazar exactamente eso.

## Seis reglas que no se negocian

Están todas comprobadas por `verificar.py`, pero conviene saberlas antes de escribir:

1. **Dos lenguajes, siempre.** Todo bloque de código trae Python y R, dentro de un
   `CodeTabs`. Python es la pestaña por defecto.
2. **Toda salida declarada tras `#>` debe haberse ejecutado.** La regla 9 corre el código
   en los dos lenguajes y compara. No escriba una cifra sin haberla producido.
3. **Nada de simular dentro de un bloque cuando las dos pestañas deben coincidir.**
   `np.random.default_rng(2026)` y `set.seed(2026)` **no** dan la misma muestra. Los datos
   van literales o del CSV congelado. Donde el capítulo simule de verdad (Montecarlo en el
   4 y en el 12), hay que decirlo en el texto.
4. **Cada sección abre con `<Motivacion>`**: escena concreta, tensión, gancho. Máximo ~80
   palabras. Nunca «En esta sección estudiaremos…».
5. **Ningún ejercicio pide construir desde cero.** Se traza, se audita, se compara, se
   interpreta y se justifica. Escribir el programa es de los talleres.
6. **Cuota R1–R9 por capítulo**, con R1, R3, R7 y R9 obligatorios. R3 es «Audita a la IA» y
   lleva cuota de dos: es un compromiso explícito del syllabus.

## Datos

`datos/` está versionado **a propósito** (no en `.gitignore`): sin instantáneas congeladas,
la regla 9 no puede existir. `datos/MANIFIESTO.md` guarda fuente, fecha y SHA-256.

⚠️ Volver a ejecutar `datos/descargar.py` produce una instantánea **equivalente pero no
idéntica** —Yahoo reajusta los precios hacia atrás con cada dividendo—. Si lo hace, mire el
`git diff` y vuelva a correr `verificar.py --con-salidas`.

⚠️ **`bvc_diario.csv` tiene dos defectos conocidos y NO se corrigen**: 101 ruedas de 1 916
sin variación en ningún precio, y el par 19–20 de febrero de 2025, que es una cotización
defectuosa (los cuatro emisores caen 10–20 % y el ETF que los replica sube). Están
declarados en `datos/MANIFIESTO.md` y la sección 3 del capítulo 4 los diagnostica con
código. Limpiar el panel en silencio rompería las cifras del capítulo 4 y el argumento del
material.

**Los dos defectos no estropean lo mismo, y eso ya está medido.** Excluir el par de febrero
de 2025 mueve el VaR histórico un 1 %, la volatilidad un **5 %**, el VaR de la ventana de
250 ruedas un **10 %** y la beta apenas un 0,5 %. Las ruedas sin variación no tocan a los
tres primeros y en cambio se llevan **un tercio de la beta** —la del portafolio contra su
propio índice sale 0,68 en vez de ~1, y sube a 0,95 midiendo el rendimiento por semanas—:
es el sesgo de negociación no simultánea, y es la sección 5 del capítulo 3. Quien escriba un
capítulo que estime una covarianza con datos diarios tiene que contarlo.

⚠️ **`curva_tes.csv` está pendiente** y bloquea los capítulos 9 y 10. Hay que bajarla a mano
del Banco de la República. Ningún otro capítulo depende de ella.

## Notas de entorno

- Los paquetes no se llaman como parece: `arch-py`, `quantlib-python`, `lpSolve`. El de
  QuantLib es traicionero: con `quantlib` a secas el entorno se crea sin error y falla
  después, en un `import QuantLib`.
- `Laboratorio` solo puede hacer **aritmética**: el cálculo ocurre en el navegador. Ajustar
  un GARCH o resolver un programa cuadrático se precomputa en Python sobre una malla y se
  declara con `modo="malla"`.

## Idioma y estilo

Todo en español. Término técnico en inglés con la traducción entre paréntesis la primera
vez de cada capítulo (*Expected Shortfall* (déficit esperado), *backtesting* (prueba
retrospectiva)); después solo en inglés. Excepción: lo que tiene traducción asentada va en
español a secas —valor en riesgo, volatilidad, duración, convexidad, cópula—.

Coma decimal en la prosa y en las gráficas; punto dentro de los bloques de código, que es
la convención de los dos lenguajes.
