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
| 2 · Unidad 1 (T7–T11, 11-bis) | ✅ completada 2026-08-10 · los **seis capítulos** pasan las doce reglas · punto de control C **aprobado** |
| 3 · Unidad 2 (T12–T15) | 🟡 a medias · **T12 y T13, capítulos 7 y 8, terminadas el 2026-08-24** · T14 y T15 bloqueadas por `curva_tes.csv` |
| 4 · Unidad 3 (T16–T20) | 🟡 empezada · **T16 y T17, capítulos 11 y 12, terminadas el 2026-09-05** · los **diez** capítulos pasan las catorce reglas con `--con-salidas` |
| 5 · Portal y Quarto | pendiente |

⚠️ **Las tareas 14 y 15 —capítulos 9 y 10, bonos y duración— siguen bloqueadas por
`curva_tes.csv`**, que hay que bajar a mano del Banco de la República. Las tareas 16 y 17 se
adelantaron por eso y ya están hechas; lo siguiente que no necesita datos externos es la
**tarea 18, el capítulo 13 (riesgo de crédito con ML: PD y scorecards)**, que usa
`datos/german_credit.csv` y no depende de la curva.

✅ **La centésima que el 11 dejó pendiente quedó explicada, y no era un error de nadie.**
El árbol promediado de 991 a 1 000 da 213,0764 y Black-Scholes 213,0648, pero esos diez
árboles van de **213,0436 a 213,1089**: su amplitud, 0,0653, es **5,6 veces la brecha**, y la
fórmula cae dentro del rango. De ahí sale una regla que vale para todo el curso: **un método
aproximado reporta su aproximación al lado de su resultado** —el árbol su amplitud, el
Montecarlo su error estándar, la diferencia finita su paso—. El punto de control C
quedó aprobado el 2026-08-10 con las cuatro comprobaciones hechas con evidencia, y
**D-D quedó ratificada**: la tasa libre de riesgo del curso es **7,00 % E.A.**, y la usan
C3, C7, C11 y C12. Ojo con la convención, porque **hay dos y no una**, y el 7,00 % es
efectivo. El capítulo 3 la baja a tasa **diaria efectiva** —`(1,07)^(1/252) − 1` = 2,6852 pb—
y la anualiza por 252, con lo que vale **6,7668 %**. Un capítulo que trabaje en logarítmicos
puros usa `ln(1,07)` = **6,7659 %**. La brecha entre las dos es de 0,0009 pp anuales y no
mueve ninguna conclusión, pero **el capítulo que use la tasa declara cuál de las dos aplica**
y no las mezcla dentro de una misma cifra.

⚠️ Y ojo con la aritmética al citarla: `ln(1,07)` = 6,7659 % **no** es «la versión correcta»
de 6,7667 %, sino otra convención. El 6,7667 que aparece tres veces en el capítulo 3 es la
primera de las dos, bien calculada y mal redondeada en el cuarto decimal —6,766773 redondea
a 6,7668—. Es una diezmilésima y no se ha tocado.

El instrumento calificado de la unidad 1 es **`Material html/T1_TDR_Taller_unidad_1.html`**
—HTML interactivo, individualizado por número de documento, 7 bloques y 23 preguntas—, y está
enlazado desde `index.html` desde el 2026-08-20. Su fuente, su clave y su rúbrica viven en
`talleres/clave/`, que es **privado** y está en `.gitignore`; se retoma por
`talleres/clave/ESTADO.md`.

⚠️ **`talleres/TDR-U1.qmd` dejó de ser el calificado el 2026-08-19** y bajó a **práctica
previa**; no se toca. Los **diez** talleres de capítulo son práctica —`TDR-07.qmd` y
`TDR-08.qmd`, del 2026-08-24, son los primeros que se renderizaron de verdad con Quarto;
`TDR-11.qmd`, del 2026-08-25, es el tercero, y `TDR-12.qmd`, del 2026-09-05, el cuarto—. Las unidades 2 y 3 necesitan el suyo de unidad,
y va en la tarea 22.

## Publicación

El repositorio **está en GitHub y es público** desde el 2026-08-11:
`origin` → `https://github.com/JotaMao1985/Teoria_del_Riesgo_Usta.git`, rama `main`. Todo
lo que se commitea aquí acaba siendo visible, incluidos el plan, este archivo y los
talleres con sus rúbricas — es una decisión tomada, no un descuido.

⚠️ **`index.html` es un portal PROVISIONAL y no es un capítulo.** No lleva TR-CORE, no lo
estampa `migrar.py` y el verificador no lo mira: es HTML plano con la paleta de los
capítulos, para que la raíz del sitio no devuelva 404 mientras no exista el portal de
verdad. **La tarea 21 lo sustituye en la fase 5.** Un capítulo nuevo hay que añadirlo a
mano a su rejilla —los nueve pendientes ya están, en gris y sin enlace—.

✅ **El sitio está publicado**: <https://jotamao1985.github.io/Teoria_del_Riesgo_Usta/>.
Pages quedó activado el 2026-08-11 con origen «GitHub Actions», y desde entonces cada push
a `main` despliega solo. Comprobado en producción: el portal, el capítulo 6 con sus siete
secciones y su cuestionario, sin errores de consola.

Las siete ejecuciones que fallaron antes de esa fecha —todas con `Get Pages site failed` a
los diez segundos— eran eso y solo eso: Pages sin activar. Si el flujo vuelve a fallar así,
lo primero es `gh api repos/JotaMao1985/Teoria_del_Riesgo_Usta/pages`; un 404 significa que
se desactivó, y se reactiva con:

```bash
gh api -X POST repos/JotaMao1985/Teoria_del_Riesgo_Usta/pages -f build_type=workflow
```

✅ **Quarto SÍ está, y no hace falta instalarlo**: viene dentro de RStudio, y `brew
install --cask quarto` —que exige `sudo` y no se puede correr desde un agente— era un
callejón sin salida. Es la 1.9.38 y no está en el `PATH`, así que se invoca por ruta:

```bash
export PATH="/Applications/RStudio.app/Contents/Resources/app/quarto/bin:$PATH"
cd talleres && quarto render
```

La salida va a `talleres/_salida/`, que **está en `.gitignore`**: son artefactos: un solo
`TDR-01.html` pesa 1,9 MB porque `_quarto.yml` embebe todo con `embed-resources: true`. Lo
que se versiona es el `.qmd`.

⚠️ **`git add -A` en este repositorio barre la salida de Quarto si alguien acaba de
renderizar.** Ya pasó una vez, el artefacto de 1,9 MB llegó al repositorio público y hubo
que reescribir el historial con `filter-repo` y forzar el push. Mire `git status` antes de
añadir, o añada por ruta.

⚠️ **El historial se reescribió el 2026-08-11** (`filter-repo`, `push --force-with-lease`).
Si alguien clonó el repositorio antes de esa fecha, su copia diverge y tiene que rehacerla:
`git fetch origin && git reset --hard origin/main`.

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

El **capítulo 8** minimiza la cola y trae **la primera excepción declarada a una convención
del curso**: el ES del capítulo 5 es el promedio simple de las ruedas que exceden el VaR, y
aquí no se puede usar, porque la función de Rockafellar-Uryasev **es** el CVaR exacto por
construcción. La portada lo declara y el primer bloque imprime las dos columnas al lado: la
brecha es de **30 millones al 97,5 %** y **884 al 99 %**, las mismas que midió el capítulo 5.
Sus cifras de referencia: cartera declarada CVaR 97,5 % **4,7311 %** (37 849 millones),
mínima varianza 4,6067 % y **mínima CVaR 4,5815 %** con 19,36 · 34,61 · 16,43 · 29,60 y
ζ = 2,7215 %. Dos resultados que conviene no volver a descubrir: **minimizar la varianza
empeora la cola al 99 %** —6,733 % contra el 6,710 % de la declarada, 187 millones— y las
**dos fronteras casi coinciden**, con una brecha de 23 a 219 millones sobre siete retornos
objetivo. El capítulo no termina con «adopte CVaR» a propósito.

⚠️ **Y deja medido cuántos datos hay detrás de una cola**, que es lo que el capítulo 15
volverá a necesitar: al 97,5 % sobre el panel entero son **47,9 escenarios**; con 250 ruedas,
6,3; al 99 % con 250 ruedas, **2,5**. El par defectuoso de febrero de 2025 —dos ruedas de
1 916— mueve el CVaR al 99 % en **3 777 millones**, contra 1,27 pp de volatilidad en el
capítulo 7: una anomalía apenas toca la varianza y domina la cola. Todo capítulo que
optimice o estime sobre una cola reporta ese conteo al lado de la cifra.

El **capítulo 11** abre la unidad 3 y es el primero que **no optimiza nada**: su objeto es una
sola posición del fondo —el 30 % en Ecopetrol, 240 000 millones, 134,6801 millones de acciones
al cierre de **1 782** del 30/12/2025— y su asunto es que el precio de un derivado **no depende
de lo que nadie crea que va a pasar**. σ = **38,6492 %** y la deriva medida es **9,0576 %**, que
es justo la cifra que el capítulo existe para no usar: meterla en la probabilidad devuelve
270,2980 donde la replicación da **259,0098**, y son 1 520 millones sobre la posición.

Sus cifras de referencia, por si otro capítulo las cita: forward a seis meses **1 843,3151**
(prima de 61,3151 sobre el contado, 8 258 millones); call europea K = 1 800 **213,1513** y put
**171,2770**, con paridad **41,8743**; réplica de un período delta **0,549648** y B **−720,4636**;
p neutral al riesgo **0,494274** contra p real 0,515815; árbol de tres pasos **228,5938** y
límite **213,0764**; put americana **177,5030**, prima de ejercicio anticipado **6,2261** —839
millones— y frontera de ejercicio en **1 243,0910**, un 30,24 % abajo.

⚠️ **La quinta convención declarada del curso sale de aquí, y es sobre lo que NO está en el
panel: q = 0,00 % es una decisión, no una estimación.** El panel congelado trae cierres
ajustados y ningún calendario de dividendos, así que el capítulo declara la tasa de dividendo en
cero, lo dice en la portada y **mide qué cuesta**: con q = 10 % el forward pasa de 8 258
millones por encima del contado a 3 850 por debajo. Todo capítulo que valore un derivado sobre
una acción hereda la regla — y hereda también la consecuencia, que no es cosmética: **con q = 0
la call americana vale exactamente lo mismo que la europea**, y ese resultado del capítulo es
consecuencia de la decisión declarada, no de la fórmula.

**Tres resultados que conviene no volver a descubrir.** La **paridad put-call se cumple con
cualquier árbol**: con un paso la call vale 259,0098 y con quinientos 213,1513, y C − P vale
41,8743 en las seis filas — por eso es lo único de una cotización que no depende del modelo que
se audita, y por eso aplicarla a una americana (donde falla por la prima de 6,2261) es el R3 de
la sección 6. **La convergencia del árbol no es monótona**: C(100) = 213,1501, C(200) =
213,1874 y C(400) = 213,1639, así que duplicar los pasos de 100 a 200 *aleja* el precio 0,0373,
y el salto mayor entre dos n seguidos en ese tramo —0,2424— es mayor que la distancia de 100 a
1 000. Y las dos coberturas de una misma posición **se cruzan en 2 020,4854**, un 13,38 % arriba:
por debajo de ahí el forward vendido deja más que la put comprada, y el capítulo se detiene ahí
a propósito porque la probabilidad de superarlo es pregunta del comité y no del modelo.

El **capítulo 12** le pone fórmula al árbol del 11 y después la somete a juicio, sobre la misma
posición y sin mover un parámetro. Sus cifras: call **213,0648**, put **171,1905**, paridad
**41,8743** —idéntica a la de los seis árboles del 11, porque no depende del modelo—, con
**N(d₁) = 0,588487**, que es el delta, y **N(d₂) = 0,480206**, que es la probabilidad neutral al
riesgo de ejercicio. Confundirlas es el error más común del capítulo. Griegas: gamma 0,000799,
vega **4,902761** por punto porcentual (660 millones), theta **−0,674040** por día (91 millones),
rho 4,178097.

⚠️ **Su argumento central es que la elección de σ vale tres órdenes de magnitud más que la
precisión del método.** La misma call vale **147,9580** con la volatilidad de 2019 y
**293,8791** con la de 2020: **19 653 millones** sobre la posición. Compárelo con lo que cuesta
todo el aparato numérico del capítulo —el error del árbol, 2 millones; el error estándar de un
Montecarlo de un millón de sorteos, 47—. Cualquier capítulo que discuta métodos numéricos antes
de declarar su ventana de estimación tiene el orden de prioridades al revés.

⚠️ **Y deja medido que la raíz del tiempo NO se cumple en este panel, con la advertencia
pegada.** La dispersión observada de Ecopetrol a seis meses es **17,6477 %** donde σ√T predice
**27,3291 %**: razón de varianzas **0,4170**. Pero detrás hay **quince ventanas disjuntas**, no
las 1 791 solapadas, así que la dirección está clara y la magnitud no. A 21 ruedas el VR sube a
**0,9258** con **91** ventanas disjuntas, y a 252 baja a 0,3046 con **7**: el horizonte que da el
VR más llamativo es el que menos datos tiene. Todo capítulo que escale una volatilidad por √T
—el 15, sobre todo— hereda la comprobación.

**Cuatro resultados que conviene no volver a descubrir.** La **sonrisa se descompone**: la
inclinación (28,53 → 20,83 %) viene de la asimetría de −0,6610 y **sobrevive** a reescalar la
distribución al nivel de σ (42,26 → 32,83 %), mientras el nivel lo explica el VR; corregir uno
no toca el otro. **Una volatilidad implícita hereda el error de modelo del precio que se
invirtió**: invertir con la fórmula los 239,5814 que el capítulo 11 sacó de un árbol de 500
pasos devuelve 44,0626 % donde la σ era 44,0444 %, y esos 0,0181 pp son los 0,0888 COP del
árbol disfrazados. **Las antitéticas reducen el error estándar un factor de 1,2644, no de
diez**, porque el pago de una call no es lineal en z. Y **la cobertura real se desvía 3,56 veces
más que la del mundo del modelo** —53,5594 contra 15,0451, 7 213 millones—, con **ninguna** de
las quince ventanas dentro de ±1 desviación del modelo, donde bajo normalidad deberían caber
unas diez. Rebalancear más no lo arregla: de 63 a 126 mejora 3,7240 COP y cuesta 195 millones
más.

⚠️ **La sexta convención declarada del curso sale de aquí: un método aproximado reporta su
aproximación al lado de su resultado.** El árbol su amplitud, el Montecarlo su error estándar,
la diferencia finita su paso. Y el capítulo 12 es el **segundo que simula de verdad** —el otro
es el 4—: sus bloques de Montecarlo y de cobertura declaran cifras distintas en Python y en R
a propósito, y lo que se exige que coincida son las conclusiones, no los dígitos.

El **capítulo 7** abre la unidad 2 y trae **la primera aplicación de la tasa libre de riesgo
en logarítmicos** —`ln(1,07)` = 6,7659 %, declarada en su portada— y las cifras que los
capítulos 8 a 10 van a tener que reproducir o discutir. Sobre el panel completo: cartera
declarada 7,69 % de retorno y **25,02 %** de volatilidad; mínima varianza **23,93 %** con
20,76 · 38,13 · 15,97 · 25,14; frontera al retorno declarado **24,40 %** —la brecha es de
0,62 pp— y al riesgo declarado **8,43 %** de retorno —0,74 pp—; cartera tangente 5,52 · 0 · 0
· **94,48** con Sharpe **0,1673**, y con tope del 30 % por emisor 30/10/30/30 con Sharpe
**0,0714**. Dos cosas que conviene no volver a descubrir: la razón de Sharpe de la mínima
varianza es **negativa** (−0,0188), porque rinde menos que el TES, y la de Grupo Sura es
−0,0000, porque rindió 6,7655 % — cuatro diezmilésimas por debajo de la tasa del curso.

⚠️ **La cuarta convención declarada del curso sale de aquí: la ventana de estimación se
declara ANTES de estimar, y con ella se reporta al menos una alternativa.** No es retórica:
con 250 ruedas la mínima varianza deja a Ecopetrol en 0 % y sube el Banco de Bogotá al
65,70 %; con 1 000 reparte 24,59 · 30,68 · 17,40 · 27,33. Todo capítulo que estime una matriz
de covarianzas —el 8, sobre todo— hereda la regla y la nombra. Y el tope del **30 % por
emisor** es un criterio **declarado del curso** (el tercero de D-A), no una cifra de la norma:
el régimen real está en el Decreto 2555 de 2010 y es más estricto.

El **capítulo 6** cierra la unidad 1 y fija la tercera convención: **el backtest reestima el
modelo rueda a rueda con las 250 anteriores**, nunca sobre la muestra completa. Todo capítulo
que valide un modelo —el 14, con el de crédito— hereda esa regla y la nombra. Sus cifras de
referencia, por si otro capítulo las cita: 1 666 ruedas de prueba, **26 excepciones** del VaR
histórico al 99 %, LR_uc 4,5175 · LR_ind 17,6911 · LR_cc 22,2086, Z₁ +0,2487, y **7
excepciones** en la ventana regulatoria — zona amarilla, m = 3,65, 371 675 millones de
capital. Los valores críticos de Acerbi-Székely (+0,0515 y +0,4217) van literales porque
exigen simulación; están calculados con 200 000 réplicas y comprobados con tres semillas.

**Las cuatro decisiones están resueltas** (detalle en el plan):

- **D-A · pesos del portafolio:** se mantienen 30/20/25/25 sobre 800 000 millones. El
  capítulo 1 los presenta como decisión declarada del curso, con tres criterios explícitos.
- **D-B · `arch` contra `rugarch`:** se declara la discrepancia, como la sección 4 del
  capítulo 4. El capítulo 2 lo cuenta; el 1 ya lo anuncia.
- **D-C · punto de control B:** aprobado tal cual. Mismas convenciones para lo que queda.

- **D-D · tasa libre de riesgo: ratificada** (2026-08-10) en **7,00 % E.A.**, sin recálculo.
  Decisión declarada del curso, no estimación. Se sustituirá por el TES del plazo que
  corresponda cuando exista `curva_tes.csv`, y esa sustitución será una revisión de D-D.

⚠️ **El verificador tiene dos zonas ciegas, y las dos se cierran abriendo el capítulo.**

1. **No parsea JavaScript.** Un error de sintaxis en el JSX —`-a ** 2`, que es ilegal— deja
   la página **en blanco** y `verificar.py` devuelve OK igual: las doce reglas son análisis
   estático de texto. En el capítulo 1 esa pasada cazó exactamente eso.
2. **La regla 9 audita los bloques de código, no los laboratorios.** Lo que calcula el
   navegador solo lo comprueba quien lo abra. En el capítulo 2, el laboratorio del
   pronóstico pasaba las doce reglas devolviendo 1,4057 % donde su propio bloque declara
   1,4370 %, y su nota afirmaba que coincidían. **Y corregir el laboratorio no corrigió lo
   que lo citaba**: el `MCQ` de esa misma sección se quedó con las cifras de la convención
   vieja —1,455 % y 1,363 % donde el laboratorio ya devolvía 1,4687 % y 1,4145 %— hasta la
   auditoría del 2026-08-11. Cuando un laboratorio y una pregunta comparten cifras, hay que
   leer las dos **con el deslizador puesto**.

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

El capítulo 5 añadió una quinta, y es la que más veces se ha repetido:

5. **Ninguna regla valida los NOMBRES de las propiedades de un componente.** `Accordion`
   recibe `titulo` y `contenido`; escribirle `title` y `content` —que es lo que usa el resto
   del mundo React— deja el acordeón con las filas **vacías**, sin un error. Las doce reglas
   pasan. Estaba en los capítulos 1 y 4, y la tarea 10-bis lo corrigió en los dos. Antes de
   usar un componente, mire su firma en `_plantilla/tr-core-extra.jsx` o `tr-core-base.jsx`.

**La tarea 10-bis (2026-08-10) cerró cuatro defectos de este tipo. Lo que dejó dicho:**

- **`MCQ` y `Quiz` ya barajan**, con una permutación estable derivada de un FNV-1a del
  enunciado. No hay que repartir las opciones a mano al escribir un capítulo. Escape:
  `barajar={false}` en el `MCQ`, `barajar: false` en una pregunta del `Quiz`, solo para las
  opciones con orden propio —una escala creciente, una cronología—.
- **`chart-h-400` ya existe.** Las cuatro clases definidas son `chart-h-320`, `-360`, `-400`
  y `-420`. Van en el `<style>` de la cabecera, que **`migrar.py` no estampa**: una clase
  nueva hay que añadirla en `_plantilla/tr-head.html` **y a mano en cada capítulo**.
- **El método que estos cinco defectos dejan:** todos son propiedades o clases que no
  existen, y ni React ni el verificador se quejan de lo que no existe. Antes de cerrar un
  capítulo, además del recorrido: `grep` de los nombres de propiedad contra la firma del
  componente, y `grep` de las clases `chart-h-*` contra las cuatro que el CSS define.

El capítulo 6 añadió una sexta zona ciega, y esta es de prosa:

6. **Una afirmación de la forma «no existe ninguno» hay que barrerla, no razonarla.** El
   laboratorio del capítulo 6 afirmaba que ninguna combinación de ventana y nivel pasa la
   prueba de independencia. Al recorrer las 170 que permiten los deslizadores resultó que
   cinco la pasan y una pasa la conjunta. El verificador no puede comprobar una afirmación
   sobre el rango de un laboratorio: solo quien la barra. **El hallazgo real casi siempre
   es mejor que el que se dio por supuesto** — allí se convirtió en el argumento de por qué
   las pruebas se fijan por escrito antes de correrlas.

Y una advertencia de mecánica que el capítulo 6 pagó: **escribir los dos lenguajes es lo
que caza los desfases de índice, pero no siempre al primer bloque.** La recursión del EWMA
en R iba un índice corrida y el primer bloque no lo vio, porque las dos versiones daban el
mismo conteo de excepciones por casualidad; lo destapó el segundo, con la matriz de
transición. Cuando dos bloques comparten un cálculo, compare **más de un resumen** de él.

El punto de control C (2026-08-10) añadió la séptima, y es sobre cómo se cierran las otras:

7. **Corregir los casos conocidos no cierra una familia de defectos; hay que barrer el
   rango.** La tarea 10-bis dio por resuelto el asunto de las alturas añadiendo
   `chart-h-400`, y el capítulo 2 seguía usando **`chart-h-380`**, que no existe: sus dos
   elementos medían 450 px, la altura por omisión de Plotly. Mismo defecto, valor distinto,
   sobrevivió a su propia corrección. Lo mismo pasó con las justificaciones: el pendiente
   decía «los `MCQ`» y eran **90 preguntas** en tres familias —4 `MCQ` + 1 `Comparador` +
   10 `Quiz` por capítulo—, porque **el `Comparador` monta un `MCQ` por dentro** y un `grep`
   de `<MCQ` no lo encuentra. Barra por propiedad (`opciones={`, `preguntas={`) y no por
   nombre de componente, y cuente haciendo clic, no leyendo el archivo.

La auditoría del capítulo 1 (2026-08-11) añadió la octava, y es la más cara de todas porque
ninguna de las siete anteriores la habría encontrado:

8. **La opción correcta se delataba por ser la MÁS LARGA, en 89 de las 90 preguntas de la
   unidad.** Razón media: 2,1 veces sus distractores. Un estudiante que marque la más larga
   sin leer saca la nota completa, y eso vale para el capítulo 1, el 2, el 3, el 5 y el 6
   —quince de quince en cada uno— y para catorce de quince del 4. La causa es de redacción:
   la opción correcta arrastraba su propia justificación pegada al texto. Y es la zona ciega
   7 otra vez en su forma pura — `barajarOpciones` cerró la pista de la **posición** y nadie
   miró que la **longitud** siguiera abierta, porque barajar no la toca—. **Ahora la vigila
   la regla 13** de `verificar.py`: falla si la correcta es la más larga en más de un tercio
   de las preguntas, o si mide más de 1,3 veces la media de sus distractores. El arreglo es
   mover el razonamiento a `justificacion`, que es donde la regla editorial ya decía que va.

✅ **Los seis capítulos pasan hoy la regla 13**, y con ellos `verificar.py` sin argumentos
devuelve **0** por primera vez (2026-08-14). El 2 se corrigió el 2026-08-11 en la fase B de
su auditoría; el 3, el 4 y el 5 el mismo día; y el **6 el 2026-08-14**, que era el último
—15 preguntas, 15 de 15, de razón 1,4–2,1 a **0,76–1,09** tras el recorte—. La receta de
abajo se ha aplicado seis veces sin variarla, y las seis veces el trabajo real estuvo en
leer entera la justificación antes de ampliarla.

⚠️ **Los repartos de letras de la regla 14, para cuando haya que tocar un enunciado.** Son
**c1 a:3 · b:5 · c:4 · d:3**, **c2 a:4 · b:4 · c:4 · d:3**, **c3 a:1 · b:6 · c:4 · d:4**,
**c4 a:1 · b:6 · c:3 · d:5**, **c5 a:3 · b:3 · c:2 · d:7** y **c6 a:1 · b:5 · c:3 · d:6**.
Los seis pasan. El del 5 es el margen más estrecho —7 de 15 es el 46,7 % contra un techo
del 50 %— y el 3, el 4 y el 6 dejan la (a) con una sola aparición. Reescribir las opciones
no mueve ninguna letra, pero **tocar un enunciado sí**: quien reformule uno tiene que volver
a mirar el reparto de su capítulo. La comprobación barata, si se dudó, es extraer los quince
enunciados de antes y de después y contar cuántos cambiaron; en el 6 fueron cero.

**Cómo se hizo en el capítulo 2, por si sirve de receta.** El objetivo por pregunta es
`min(máximo de los distractores − 1, 1,30 × su media)`: la correcta deja de ser la más larga
y baja a razón 0,66–1,09. Lo que se recorta **no se tira**, se integra en `justificacion`
—que ya existía en las quince— sin repetir la opción. Y el reparto de la posición va
**después** de reescribir los textos, porque mover el índice no toca el hash pero tocar el
enunciado sí invalida la tabla de destinos.

El capítulo 3 se hizo con esa misma receta y la confirma en dos puntos. **Nueve de las
quince justificaciones ya contenían el material que se recortó**, así que solo hubo que
tocar seis: antes de reescribir una, léala entera —repetir lo que ya dice es el error
fácil—. Y el **recorrido en pantalla sigue siendo obligatorio**: acortar quince cadenas
dentro de JSX es exactamente el tipo de cambio que la regla 9 no ve, así que hay que
responder las quince en el navegador y comprobar que el `MCQ` sigue marcando correcta la que
se acortó y que la justificación ampliada aparece. En el 3 salió 10/10 en el `Quiz`, los
cinco `MCQ` de sección en verde y la consola limpia.

⚠️ **El panel del navegador sirve los capítulos como `data:` URL cuando el archivo está
fuera de la carpeta del proyecto, y ahí TR-CORE no arranca**: `localStorage` está prohibido
en ese esquema, React lanza un `SecurityError` y la página queda **en blanco**. Es un
artefacto del panel, no un defecto del capítulo, y se confunde con la zona ciega 1. La
salida es servir por HTTP y abrir `localhost`, que sí es un origen de verdad:

```bash
python3 -m http.server 8731 --bind 127.0.0.1 --directory "Material html"
```

Y al recorrer un capítulo en pantalla, **cuente los botones «Comprobar» de la sección antes
de pulsar**: la sección 4 del capítulo 4 tiene dos preguntas —un `Comparador` y un `MCQ`— y
pulsar el primero deja sin responder el otro, con lo que parece que la pregunta falla
cuando lo que falta es contestarla.

La auditoría del capítulo 2 (2026-08-11) añadió la novena, y es la propia regla 13
mordiéndose la cola:

9. **La POSICIÓN volvió a abrirse por detrás, y arreglar la regla 13 no la cierra.** En el
   capítulo 2 la correcta sale en la **(c) nueve veces de quince** y en la **(a) ninguna**:
   descartar la (a) y marcar la (c) aprueba sin leer. La causa es que `barajarOpciones`
   siembra el hash con el **ENUNCIADO** y no con las opciones, y que la correcta se escribe
   siempre en el índice 0 del arreglo —las 15 de 15, en los seis capítulos—: la letra acaba
   siendo función del enunciado y solo de él. **Reescribir las opciones para la regla 13 no
   mueve ni una letra.** Hay que cambiar de índice la correcta en el fuente. **Ahora lo
   vigila la regla 14** de `verificar.py`, que porta el FNV-1a + LCG de TR-CORE, calcula la
   letra de cada pregunta e imprime a qué índice hay que mover cada correcta. El capítulo 2
   quedó en **a:4 · b:4 · c:4 · d:3** moviendo siete preguntas; los otros cinco ya repartían
   bien y ninguno la falla.

La auditoría de los bloques del capítulo 1 (2026-08-12) añadió la décima, y es la primera
que no es de forma sino de sentido: las catorce reglas pasaban y las salidas eran exactas.

10. **Una convención medida como barata sobre la DISPERSIÓN puede ser ruinosa sobre un
    NIVEL, porque el sesgo no se promedia: se acumula.** El capítulo 1 mide lo que cuesta
    combinar logarítmicos entre activos —0,16 % en la volatilidad, 3,1 % en el cuantil al
    99 %— y concluye que sale barata. Las dos son medidas de dispersión. Después la sección 5
    usaba esa misma serie para un **acumulado anual**, y allí el sesgo de −1,643 pb por rueda
    se multiplica por las ruedas del año: la tabla reportaba **−0,08 % en 2022, un año en que
    el fondo ganó +10,21 %** —el signo, no la cifra—, y **+79,44 % contra +145,82 % en los
    ocho años**. La regla 9 no lo ve porque la salida declarada **era** la que el código
    produce; el código calculaba bien otra cosa. Y el capítulo ya traía escrita la regla que
    incumplía, al cierre de la sección 3: «¿Va a reportarle una rentabilidad a alguien que la
    va a cobrar? Aritméticos, siempre». **Cómo se caza: para toda magnitud que el material
    reporte como un nivel —un acumulado, un precio, un valor de portafolio—, recalcúlela por
    la vía exacta y compare. Si la brecha crece con el horizonte en vez de promediarse, la
    convención no aplica ahí.** El arreglo del capítulo 1 fue añadir la columna exacta y la
    brecha, no cambiar la convención: la volatilidad se sigue midiendo sobre la serie de la
    convención y por eso el 40,87 % de 2020 que cita el capítulo 2 no se movió.

    Corolario de vocabulario, que salió de la misma pasada: al corregirlo, el laboratorio de
    agregación de la sección 3 quedó llamando «acumulado real» a `exp(Σ conv) − 1`, que es
    justo lo que la sección 5 acababa de declarar que no lo es. **Una corrección puede abrir
    una colisión de términos en otra sección del mismo capítulo**; se pasó a «acumulado
    compuesto». Y su pregunta R9 afirmaba una forma de la nube «a partir de h = 20» que el
    barrido desmiente a partir de h ≈ 68 —el brazo de las pérdidas se levanta—: zona ciega 6
    otra vez, en un laboratorio distinto.

El capítulo 7 añadió la undécima, y a diferencia de las diez anteriores **está viva en dos
capítulos ya publicados**:

11. **Una casilla de `TablaTraza` con exactamente tres decimales no se puede acertar
    escribiéndola con coma decimal.** `normalizarCelda` casa `0.167` con su expresión de
    notación de miles —`^-?\d{1,3}(\.\d{3})+(,\d+)?$`— y la convierte en `0167`, mientras
    que quien teclea `0,167`, que es como escribe la prosa del material, obtiene `0.167`. La
    traza marca la celda en rojo e imprime debajo, en verde, la misma cifra. Es el gemelo
    exacto del menos tipográfico que ya se cerró, en el mismo componente. **Casillas afectadas
    hoy: `3.285` y `1.475` en el capítulo 5 y `0.048` en el capítulo 6**; el 7 se escribió
    esquivándolo, con cuatro decimales. El arreglo de verdad es de TR-CORE —exigir dos grupos
    de miles, o mirar el número de dígitos— y toca los siete capítulos y el taller calificado,
    cuyo TR-CORE tiene que seguir siendo byte a byte el del capítulo 6. **Mientras no se haga:
    ninguna casilla nueva con tres decimales.**

El capítulo 8 añadió la duodécima, que es de gráfica y es barata de evitar:

12. **Plotly lee un eje de fechas como eje TEMPORAL, aunque las categorías sean veinte.** La
    gráfica de las veinte peores ruedas repartía sus barras sobre ocho años de calendario y
    quedaban finísimas, con el pie describiendo una lectura —«ocho de 2020, siete de 2022»—
    que no se veía. Se arregla con `xaxis: { type: 'category' }`. La familia es la de
    siempre: **el pie afirma y solo lo comprueba quien mire**, y por eso el recorrido en
    pantalla incluye abrir cada gráfica y leer su pie al lado.

El capítulo 11 añadió la decimotercera, y es la más barata de cerrar de todas:

13. **Una `usePlotly` sin su `ChartFrame` deja la gráfica sin existir, en silencio.** La
    sección 5 del capítulo 11 registraba `cap11-conv` y no había ningún contenedor con ese
    `id`. `usePlotly` comprueba `if (el && window.Plotly)` y se va sin quejarse: no hay error
    de consola, el capítulo compila, pasa las catorce reglas y la gráfica sencillamente no
    está. Se cierra con un `grep` antes de dar por terminado un capítulo — los `id` de
    `usePlotly` tienen que aparecer todos como `ChartFrame id=` o como `id=` de un
    `Laboratorio`:

    ```bash
    grep -o "usePlotly('[^']*'" cap.html | sed "s/.*('//;s/'//" | sort -u > /tmp/a
    grep -oE 'id="[^"]+"' cap.html | sed 's/id="//;s/"//' | sort -u > /tmp/b
    comm -23 /tmp/a /tmp/b     # lo que salga aquí no se dibuja
    ```

    El segundo `grep` va sin prefijo a propósito: filtrarlo por `cap[0-9]+-` parece más
    preciso y deja fuera el taller calificado, cuyas gráficas se llaman `g-hist`, `g-qq` y
    demás — y entonces la receta las reporta a las seis como rotas cuando están bien. Los
    nueve capítulos y el taller pasan hoy esta comprobación.

    Y de la misma pasada salieron dos recordatorios que no son zonas ciegas nuevas sino las
    viejas mordiendo otra vez. **Un laboratorio puede contradecir a su bloque en una cifra que
    ninguno declara como suya**: el de convergencia estimaba el límite promediando n de 191 a
    200 —213,1801— mientras el bloque lo promedia de 991 a 1 000 —213,0764—, y el estudiante
    ve las dos a dos clics de distancia. **Y la pregunta de un laboratorio puede dar por
    supuesto un cruce que no ocurre**: preguntaba cuántas veces cruza el precio el límite entre
    n = 90 y n = 120, y la respuesta es ninguna. Barra el rango antes de escribir la pregunta.

El capítulo 12 añadió la decimocuarta, y es la zona ciega 5 con la consecuencia de la 1:

14. **Una propiedad con la FORMA equivocada deja la sección entera en blanco.** `Comparador`
    recibe `a` y `b` como objetos `{ etiqueta, codigo }` —y `codigo` admite `{python, r}`—; al
    pasarle los bloques como cadenas de texto, React lanzó
    `Cannot read properties of undefined` y **la sección 4 del capítulo 12 no renderizó nada**,
    con las catorce reglas en verde. El nombre de la propiedad existía; su forma, no. **Mire la
    firma Y un uso real en un capítulo publicado antes de escribir un componente nuevo.**

    De la misma pasada salieron tres recordatorios más. **`Eq` no admite `inline`**: es un
    `<div>`, y la prosa del curso escribe los símbolos como texto. **`lineaCorrecta` hay que
    leerla en pantalla, no contarla en el archivo** —el R3 de la sección 5 apuntaba a `h = 1e-4`
    en vez de a la vega, en los dos lenguajes—. Y **un ayudante compartido se copia, no se
    reinventa**: `miles` reescrito con `toLocaleString('es-CO')` imprime `1.800` con punto de
    miles donde los capítulos 7 y 11 usan espacio.

⚠️ **Solo hay 17 iconos definidos en TR-CORE, y `SectionHeader` descarta en silencio los que
no existen** (`{Icon && <Icon/>}`). Los válidos son `BookOpen · Binary · Cpu · Calculator ·
Award · HelpCircle · TrendingUp · BarChart · Activity · Layers · Table · Clock · Bug · Scale ·
Sliders · ChevronLeft · ChevronRight`. **El capítulo 11 usa tres que no están —`ArrowDownUp`,
`GitBranch` y `Workflow`— y tiene tres secciones sin icono desde el 2026-08-25.** Está
detectado y sin corregir.

⚠️ **La zona ciega 4 tiene un caso que no se arregla con más decimales: la cancelación.** El R1
del capítulo 12 pedía al principio la probabilidad neutral al riesgo p\*, que es un cociente de
dos diferencias pequeñas; calculada desde los valores redondeados que la tabla muestra se
desvía en el cuarto decimal en cuanto n crece —con n = 200 el estudiante obtiene 0,4996 y la
tabla guarda 0,4995— y **mostrar u con seis decimales no lo salva**. La salida fue trazar solo
magnitudes estables y **mostrar p\* en vez de pedirla**. Regla: antes de esconder una casilla,
compruebe que se recupera desde lo mostrado; si no, muéstrela.

⚠️ **Un capítulo nuevo nace con sus 15 justificaciones**: 4 de los `MCQ` (en la opción
correcta), 1 del `Comparador` (igual, dentro de sus `opciones`) y 10 del `Quiz` (en la
**pregunta**, no en la opción). Las 90 de la unidad 1 ya están escritas. La regla editorial:
la justificación **no repite la opción correcta**, añade la cifra del capítulo, la
consecuencia en pesos y el puente al capítulo que retoma el asunto. Y **nunca nombra una
opción por su posición** («la segunda», «la última»): el barajado las mueve, y en el
capítulo 1 la frase «la última opción se puede desmentir con código» acabó señalando la
respuesta correcta.

⚠️ **`OrdenaPasos` califica UN solo orden**, con `secuencia[pos] === pos`: no hay crédito
parcial por una alternativa defendible. Así que todo par de pasos cuyo orden sea discutible
hay que **anclarlo en el texto del paso**, no confiarlo al enunciado ni a la pista. En el
capítulo 1, «congelar la instantánea» iba antes de «declarar el universo de activos» y lo
razonable es lo contrario —no se baja un panel sin saber qué series—; se ancló escribiendo
«Declarar **sobre esa instantánea** el universo…», y con eso «esa instantánea» se queda sin
referente si el estudiante lo pone primero. La comprobación es resolverlo en pantalla y ver
«¡Secuencia correcta!», no leer el arreglo.

⚠️ **Dos defectos que estaban en TR-CORE y ya no** (2026-08-11, salieron de la misma
auditoría; los dos afectaban a los quince capítulos):

- **`Reto` pintaba el botón «Mostrar solución» aunque `solucion` fuera `undefined`**: se
  pulsaba, el rótulo cambiaba a «Ocultar solución» y no aparecía nada. Los **seis R7** de la
  unidad estaban así. Es el mismo defecto que el `MCQ` ya cerraba con su «Explicación:»
  vacía, sin que nadie lo llevara a `Reto` — zona ciega 7, otra vez.
- **`normalizarCelda` rechazaba el signo menos tipográfico.** Escribir `−0,7937` (U+2212, que
  es el que usa toda la prosa del material) en una celda del R1 salía en rojo, con la tabla
  imprimiendo debajo, en verde, esa misma cadena como respuesta correcta. Eran 14 celdas con
  valor negativo en la unidad, 10 de ellas en el capítulo 6.

## Ciclo de trabajo

```bash
conda activate teoria-riesgo
python3 "Material html/_plantilla/ensamblar.py"                    # fuentes → tr-base.html
python3 "Material html/_plantilla/migrar.py"                       # plantilla → capítulos
python3 "Material html/_plantilla/verificar.py" --con-salidas      # las catorce reglas
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
sin variación en ninguno de los **cuatro precios de los emisores** —no en ningún precio: el
ETF sí cotiza esos días, y solo en 4 de las 101 se quedó quieto él también—, y el par 19–20
de febrero de 2025, que es una cotización defectuosa (los cuatro emisores caen 10–20 % y el
ETF que los replica sube). Están declarados en `datos/MANIFIESTO.md` y la sección 3 del
capítulo 4 los diagnostica con código. Limpiar el panel en silencio rompería las cifras del
capítulo 4 y el argumento del material.

**Los dos defectos no estropean lo mismo, y eso ya está medido.** Excluir el par de febrero
de 2025 mueve el VaR histórico un 1 %, la volatilidad un **5 %**, el VaR de la ventana de
250 ruedas un **10 %** y la beta apenas un 0,5 %. Las ruedas sin variación hacen lo
contrario: dejan el VaR casi igual (+0,5 %), suben la volatilidad un 2,7 % —de 1,5764 % a
1,6197 % diaria, como declara el manifiesto— y en cambio mueven la beta un **8,2 %**, que es
el único de los cuatro estimadores al que le hacen daño de verdad.

⚠️ **Pero el tercio de la beta que falta NO lo explican esas 101 ruedas, y confundirlo ya
costó una justificación mal escrita.** La beta del portafolio contra su propio índice sale
0,6779 en vez de ~1 y sube a **0,9486** midiendo el rendimiento por semanas; excluir las 97
ruedas en que los cuatro emisores se quedaron quietos y el ETF no, en cambio, solo la lleva
a **0,7333** — **un quinto** de esa brecha. El resto lo pone el ajuste rezagado de las ruedas
en que los emisores sí cotizaron, y el mecanismo es por emisor y no por panel: Banco de
Bogotá no cambia de precio el **16,2 %** de las ruedas y Grupo Sura el **15,1 %**, contra el
**4,9 %** del ETF. Lo que se lleva el tercio es la negociación no simultánea entera, y lo
demuestra la agregación temporal, no la exclusión de esas ruedas. Es la sección 5 del
capítulo 3. Quien escriba un capítulo que estime una covarianza con datos diarios tiene que
contarlo.

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
