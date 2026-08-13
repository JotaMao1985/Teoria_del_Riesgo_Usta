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
| 3–5 · Unidad 2, unidad 3, portal y Quarto | pendientes |

⚠️ **Lo siguiente es la fase 3, que empieza por el capítulo 7.** El punto de control C
quedó aprobado el 2026-08-10 con las cuatro comprobaciones hechas con evidencia, y
**D-D quedó ratificada**: la tasa libre de riesgo del curso es **7,00 % E.A.**, y la usan
C3, C7, C11 y C12. Ojo con la convención — el 7,00 % es efectivo y el curso anualiza
logarítmicos por 252, con lo que la misma tasa vale **6,7667 %**; el capítulo que la use
declara cuál aplica.

El instrumento calificado de la unidad 1 es **`talleres/TDR-U1.qmd`**, el taller VaR→ES con
bitácora y backtest obligatorio. Los seis talleres de capítulo son práctica. Las unidades 2
y 3 necesitan el suyo, y va en la tarea 22.

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

⚠️ **Solo el capítulo 6 FALLA hoy la regla 13, a propósito.** Los capítulos 1 a 5 quedaron
corregidos —el 2 el 2026-08-11, en la fase B de su auditoría; el 3, el 4 y el 5 el mismo
día, con la receta de abajo— y son la rebanada de referencia también para esto; el 6 quedó
medido y en cola, con la línea exacta de cada pregunta en la salida del verificador. Son
**15 preguntas**, 15 de 15. Hasta que se reescriban, `verificar.py` sin argumentos
devuelve 1.

⚠️ **Ojo con la regla 14 al terminar el 6.** Los repartos de letras que dejaron las
correcciones son **c3 a:1 · b:6 · c:4 · d:4**, **c4 a:1 · b:6 · c:3 · d:5** y **c5 a:3 ·
b:3 · c:2 · d:7**. Los tres pasan, pero el del 5 es el margen más estrecho de la unidad
—7 de 15 es el 46,7 % contra un techo del 50 %— y los del 3 y el 4 dejan la (a) con una
sola aparición. Reescribir las opciones no mueve ninguna letra, pero **tocar un enunciado
sí**: si el 6 necesita reformular alguno, hay que volver a mirar el reparto.

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
