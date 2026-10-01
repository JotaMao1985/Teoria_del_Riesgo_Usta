# Material HTML — Teoría del Riesgo

Cada capítulo es **un archivo HTML autocontenido**: se abre con doble clic, sin servidor,
sin `npm`, sin build. El portal que los enlaza es el `index.html` de la **raíz del
repositorio**, y es lo que publica GitHub Pages. React, Tailwind, Plotly, Prism y MathJax
se cargan desde CDN, de modo que **hace falta conexión a internet** la primera vez (después
el navegador los cachea).

## Estructura

```
Material html/
├── 01_TDR_Riesgo_y_rendimiento.html   … 15_TDR_Valores_extremos.html
└── _plantilla/
    ├── tr-base.html          PLANTILLA GENERADA — no se edita a mano
    ├── tr-head.html          <head>, estilos y apertura del <script>   (fuente)
    ├── tr-core-base.jsx      helpers, Icons, Box … Termino             (fuente)
    ├── tr-core-extra.jsx     código, ejercicios R1–R9 y lo propio del curso (fuente)
    ├── tr-demo.jsx           capítulo de demostración + App            (fuente)
    ├── ensamblar.py          fuentes → tr-base.html
    ├── migrar.py             plantilla → capítulos
    ├── verificar.py          comprueba los capítulos (diecisiete reglas)
    └── ejecutar_salidas.py   ejecuta Python y R y contrasta lo declarado
```

## Flujo de trabajo

**Para crear un capítulo:** copiar `_plantilla/tr-base.html`, cambiar el objeto `CONFIG` de
la cabecera del script, y reemplazar las secciones de demostración por el contenido real.
El bloque delimitado por `/* === TR-CORE INICIO === */` … `/* === TR-CORE FIN === */`
**no se toca**.

**Para cambiar un componente compartido:** editar `_plantilla/tr-core-extra.jsx`, regenerar,
y volver a estampar el bloque en los capítulos ya escritos con `migrar.py`. Estampar a mano
es justo lo que la comprobación 1 existe para detectar.

```bash
python3 "Material html/_plantilla/ensamblar.py"     # fuentes   → tr-base.html
python3 "Material html/_plantilla/migrar.py"        # plantilla → capítulos
python3 "Material html/_plantilla/verificar.py"     # comprueba
```

`verificar.py` comprueba diecisiete cosas y devuelve ≠ 0 si algo falla:

| # | Qué comprueba |
|---|---|
| 1 | **Deriva** — el bloque TR-CORE coincide byte a byte con `tr-base.html` (SHA-256) |
| 2 | **Cuota de ejercicios** — la taxonomía R1…R9; R1, R3, R7 y R9 son obligatorios. `--sin-cuota` mientras un capítulo está a medias |
| 3 | **Componentes sin definir** — todo `<Componente>` usado debe existir |
| 4 | **CodeTabs completos** — cada bloque trae `python` y `r`, esté el objeto en una constante o escrito en el sitio |
| 5 | **Motivación** — cada sección del `curriculum` abre con `<Motivacion>` |
| 6 | **Ejercicios multilingües** — si un ejercicio se presenta en los dos lenguajes, los trae los dos, y `DetectaError` no usa una `lineaCorrecta` fija |
| 7 | **Salida** — dentro del bloque, con `#>`; sin propiedades `salidas={...}` ni prefijos de otros cursos |
| 8 | **Texto por lenguaje** — un `DetectaError` multilingüe no cita «la línea N» en un `enunciado` fijo |
| 9 | **Salidas ejecutadas** — lo declarado tras `#>` es lo que el código produce. Se pide con `--con-salidas` |
| 10 | **Contraste** — ningún color por debajo de 3,0:1 sobre el fondo se usa como texto sin confirmar. Sale como **aviso** |
| 11 | **Enunciados** — ningún ejercicio pide construir un programa o un modelo desde cero |
| 12 | **Peso** — ningún capítulo pasa de 400 KB |
| 13 | **Longitud de las opciones** — la correcta no es la más larga en ninguna pregunta ni la más corta en más de un tercio, y mide entre 0,75 y 1,30 veces la media de sus distractores |
| 14 | **Posición de la correcta** — la letra en que sale tras el barajado está repartida: ninguna pasa de la mitad y ninguna falta. Se arregla moviendo la correcta de índice en el fuente |
| 15 | **Opciones completas** — toda opción declara `correcta`; una sin ella no la ven las reglas 13, 14 y 16 |
| 16 | **Marcas de forma** — ninguna marca señala a la correcta ni a un distractor, ni cuando la lleva una sola opción ni cuando le falta a una sola. Ver «Las opciones no se delatan por su forma» |
| 17 | **Emparejamiento** — la solución no se adivina por las filas. Ver «`Emparejamiento` no baraja la columna derecha» |

```bash
python3 "Material html/_plantilla/verificar.py" --con-salidas
```

La 9 ejecuta **los dos lenguajes del curso**, así que la cobertura es completa: no hay
lenguajes declarados como omitidos. Solo se saltan los bloques que no **declaran** salida
—uno sin `#>` no afirma nada— y las constantes de un solo lenguaje, que se listan como
aviso porque `#>` es el prefijo de Python y de R a la vez y nada dice cuál es.

`ensamblar.py` falla si Font Awesome es anterior a 6.5 o si falta alguna de las dos
gramáticas de Prism: son dos defectos silenciosos —iconos en blanco, código sin resaltar—
que no producen ningún error en consola y llegan al aula sin que nadie los note.

**Para ver un capítulo**, basta abrirlo con doble clic. Para servirlo (útil al depurar):

```bash
python3 -m http.server 8777 --directory "Material html"
```

---

## Convenciones de autoría

### Toda sección abre con una motivación

Es obligatorio y lo comprueba `verificar.py`. La motivación **no resume lo que viene**: da
una razón para seguir leyendo. Receta, en un máximo de ~80 palabras:

1. una **escena concreta** del sector financiero (personas, cifras, un plazo);
2. la **tensión o el costo** que esa escena revela;
3. el **`gancho`**: la pregunta que la sección viene a responder.

Lo que hay que evitar: abrir con «En esta sección estudiaremos…». Eso es un índice, no una
motivación, y el estudiante ya lo tiene en la barra lateral.

### Los datos van literales o del CSV congelado, nunca simulados en el bloque

Es la convención que más fácil se rompe y la que peor falla.
`np.random.default_rng(2026)` y `set.seed(2026)` **no producen la misma muestra**: son
generadores distintos. Un bloque que simule muestra una cifra en la pestaña de Python y
otra en la de R para el mismo cálculo, y el material afirma dos cosas a la vez sin que
nada avise.

Donde el capítulo simule de verdad —Montecarlo en el 4 y en el 12— hay que **decirlo en
el texto** y no presentar las dos cifras como si debieran coincidir.

### La salida va DENTRO del bloque

Nada de paneles «Salida» aparte: se escribe como comentario, pegada a la instrucción que
la produce. Así se lee sin saltar la vista y **copiar el bloque entrega un guion
ejecutable**. Python y R comparten el prefijo `#>`.

```python
print(f"VaR : {var:.3f} %")
#> VaR : 4.886 %
```

⚠️ **Toda salida declarada debe haberse ejecutado**, y de eso se encarga la comprobación 9.
Es la única defensa contra una cifra que envejece mal: un número equivocado no se ve en
pantalla, se lee como cualquier otro. En un curso donde el número **es** el contenido, un
`#>` con un ES mal calculado enseña exactamente el error que el capítulo 5 desmonta.

Como `#>` es el prefijo de los dos lenguajes, **todo bloque va dentro de un `CodeTabs`**:
fuera de él nada dice con qué intérprete ejecutarlo.

### Los dos lenguajes van en paralelo

Python es la pestaña por defecto y R la segunda. No es arbitrario: los estudiantes llegan
del programa de Estadística con R como lengua materna y el syllabus promete un puente hacia
Python, así que la pestaña inicial empuja al lenguaje nuevo dejando R a un clic. La
preferencia se recuerda entre bloques y entre visitas.

Toda propiedad que contenga **código** admite un objeto `{python, r}`:

| Componente | Propiedades por lenguaje |
|---|---|
| `TablaTraza` | `codigo` · y la columna `instruccion` de cada fila |
| `DetectaError` | `lineas`, **`lineaCorrecta`** y, si citan números de línea, `enunciado` y `explicacion` |
| `Comparador` | `a.codigo` y `b.codigo` |
| `OrdenaPasos` | `pasos` |
| `Emparejamiento` | `izquierda` |

Lo que **no** va por lenguaje son los **valores de las magnitudes** en una traza: una
varianza EWMA o un cuantil dan lo mismo en los dos, y hacérselo ver al estudiante es el
objetivo del ejercicio.

⚠️ **`lineaCorrecta` debe ser un objeto por lenguaje.** El mismo fallo no está en la misma
línea: R necesita `library(...)` donde Python usa `import`, y una comprensión de lista
suele ser un `sapply` de una sola línea. Fijar un número único hace que el ejercicio
califique mal al cambiar de pestaña, **y en silencio**. La comprobación 6 existe por eso.

Ayudante: `ins(python, r)` para las instrucciones cortas.

### Paleta institucional USTA

**No se inventan colores de marca.**

| Rol | Hex | Uso |
|---|---|---|
| `primary` | `#3D008D` | Color de marca, degradados, texto destacado |
| `secondary` | `#ED1E79` | Títulos `h3`, foco, acentos |
| `navy` | `#001A4D` | Cabecera lateral, títulos `h4`, cuerpo oscuro |
| `gold` | `#FDB913` | **Solo acento sobre fondo oscuro** |
| `teal` | `#0E7490` | Acento secundario |

⚠️ **El gold nunca va como texto sobre fondo claro:** da 1,66:1 de contraste, muy por
debajo del mínimo WCAG AA (3,0:1 para texto grande). Su lugar es la barra lateral navy y
los iconos. Un uso ya revisado se calla escribiendo `contraste-ok` en su línea o en la
anterior, con el motivo.

### El estilo de prosa se aplica solo, y las tablas de los componentes quedan fuera

`.prose-tr` va en el `App`, no sección por sección: así ninguna sección puede olvidarlo.
Sus reglas de tabla están acotadas con `:not(.tabla-componente)` — sin eso pintaban de lila
la cabecera navy de `TablaResultados`, cuyo texto es blanco, y el resultado era blanco
sobre casi blanco sin ningún error visible.

Si escribe un componente nuevo con tabla, márquela con `tabla-componente`.

### Los ejercicios no piden construir desde cero

Aquí se traza, se audita, se compara, se interpreta y se justifica. Escribir el programa o
ajustar el modelo es de los talleres Quarto y del proyecto integrador. Lo comprueba la
regla 11, que mira **solo los enunciados** —`enunciado`, `pregunta`, `titulo` y el cuerpo
de `<Reto>`— y no la prosa de la exposición: ahí la frase es legítima («en el taller se le
pedirá ajustar un GARCH a…») y marcarla haría que el verificador mintiera.

### Las opciones no se delatan por su forma

Quien no lee busca la opción que desentona, y la **regla 16** vigila seis formas de desentonar:
dos puntos, raya, punto y coma, cifra decimal, la coordinación «, y» y un conector causal
—porque, ya que, así que, de modo que, pues, dado que, puesto que—. El «Porque» con que abre la
respuesta a un «¿por qué…?» no cuenta. Cada marca se mira por los dos lados: falla si en más de
un tercio de las preguntas la única opción **con** la marca es la correcta, o es un distractor,
o si la única **sin** ella es la correcta, o es un distractor; y también si la marca es más
frecuente en las correctas que en los distractores, o al revés, por más de 0,35.

La pista cambia de disfraz cada vez que se cierra una: la correcta arrastró primero su
justificación (más larga), después un segundo tramo tras dos puntos y, en el capítulo 9, la
forma «afirmación, y consecuencia» frente a «afirmación, porque razón» en los distractores. El
arreglo **no es quitarle la marca a la correcta** sino repartirla: dársela a uno o dos
distractores y, si son los distractores los que la llevan —el conector—, dársela también a
alguna correcta. Sin forzar la gramática y sin tocar el enunciado, que es la semilla del
barajado de la regla 14. Después se mide el valor esperado exacto de cada estrategia de quien
no lee: por pregunta, la fracción de las opciones marcadas —o de las sin marcar— que es la
correcta, o 1/4 si no queda ninguna.

---

## Catálogo de componentes

| Componente | Uso |
|---|---|
| `Motivacion` | **Apertura obligatoria de cada sección** (escena + gancho) |
| `CodeBlock` · `CodeTabs` | Bloque de un lenguaje · los dos con pestaña propia y preferencia recordada |
| `Box` · `CalloutPro` | Avisos (`info`, `tip`, `warn`, `danger`) y destacados |
| `Eq` · `Termino` | Fórmula destacada, que se encoge sola si no cabe · término con definición emergente |
| `Derivacion` | **Propio del curso.** Fórmula paso a paso, cada paso con su porqué plegable |
| `Anatomia` | **Propio del curso.** Qué es cada pieza de una fórmula y cuánto vale en el capítulo |
| `FichaNorma` | **Propio del curso.** Qué exige la norma y qué cálculo del capítulo la satisface |
| `TablaResultados` | **Propio del curso.** Salida de un modelo con lectura por celda |
| `NivelIA` | **Propio del curso.** Insignia AIAS, por capítulo o por ejercicio |
| `Pipeline` · `Timeline` · `Tabs` · `Accordion` | Estructuras de contenido |
| `ChartFrame` + `usePlotly` | Gráficas interactivas |
| `TablaTraza` | **R1** traza de cálculo |
| `DetectaError` | **R3** audita a la IA: ubicar la línea + clasificar el error |
| `Comparador` | **R4** dos versiones lado a lado + veredicto |
| `OrdenaPasos` | **R5** reconstruir el procedimiento |
| `Emparejamiento` | **R6** relacionar medida y norma |
| `Laboratorio` | **R9** deslizadores que recalculan una gráfica |
| `MCQ` · `Quiz` · `Reto` | **R2/R7/R8** y cuestionario integrador |

### Los iconos del `curriculum` son una lista cerrada

Cada entrada del `curriculum` lleva un `icon:`, y ese nombre tiene que estar en el objeto
`Icons` de la librería. Si no está **no falla nada**: `renderIcon` devuelve `null` y
`SectionHeader` lo tolera, así que el icono no se dibuja y queda un hueco que solo se ve
mirando. Los disponibles son:

`BookOpen` · `Binary` · `Cpu` · `Calculator` · `Award` · `HelpCircle` · `TrendingUp` ·
`BarChart` · `Activity` · `Layers` · `Table` · `Clock` · `Bug` · `Scale` · `Sliders` ·
`ChevronLeft` · `ChevronRight`

Para añadir uno, se edita `tr-core-base.jsx`, se regenera y se estampa. Dentro del contenido
—no en el `curriculum`— los iconos son de Font Awesome (`icon="fa-clock"` en `Motivacion`,
por ejemplo) y ahí la lista es la de la librería completa.

### `Emparejamiento` no baraja la columna derecha

A diferencia de `MCQ` y `Quiz`, `Emparejamiento` pinta `derecha` en el orden del arreglo, así
que dónde cae cada pareja lo decide quien escribe `solucion`: `solucion[i]` es el índice en
`derecha` de la pareja de `izquierda[i]`. Escribir las dos columnas en el mismo orden deja la
identidad, y el ejercicio se resuelve emparejando por filas sin leer —le pasó al R6 del
capítulo 12—. La **regla 17** falla si `solucion` deja más de una pareja en su fila; una se
tolera, que es lo que deja el azar. Al elegir el orden, mire también que correr las parejas
una o dos filas no acierte casi todas.

Barajar la derecha no basta si la columna que hay que entender —preguntas, definiciones—
sigue el orden en que el capítulo presenta los nombres de la otra: recordar ese orden resuelve
el ejercicio sin leer, y la regla 17 no lo ve. Le pasó al mismo R6 del 12, cuyas preguntas
iban en el orden de la anatomía de las griegas. **Si la otra columna son cifras, su orden es
la magnitud**: unas respuestas que bajan o suben fila a fila se emparejan ordenando números,
sin leer. Le pasó al R6 del 9, cuyas respuestas iban de mayor a menor de la segunda fila a la
sexta, y le volvió a pasar cuando el capítulo cambió de convención y la forward pasó de menor a
mayor: si cambian las cifras, el orden se vuelve a medir. Y antes de barajar, mire si una fila remite a otra —«rehacer **esa compra**» en el 12,
«**Esa misma tasa**» en el 9—: la referida tiene que quedar encima.

`solucion` es **obligatoria** aunque la firma no lo diga —sin ella el render lanza y la página
queda en blanco—, va como arreglo literal y no repite índices. La derecha sí puede traer
opciones de sobra: el componente solo exige emparejar la izquierda entera.

### `OrdenaPasos` muestra la pista antes de intentar, y `Motivacion` el cuerpo antes del gancho

Dos órdenes de pintado que no se ven en la firma. **La `pista` de `OrdenaPasos` está siempre a la
vista**, no detrás de un botón: una pista que enuncie el orden resuelve el ejercicio sin leer los
pasos. Escríbala para señalar qué par se invierte con prisa, no cómo va. Y **`Motivacion` pinta
`children` primero y el `gancho` después**, así que el cuerpo no puede remitir al gancho —«Ese
número es…»— porque el lector todavía no lo ha leído. Le pasó al capítulo 10 en las dos cosas.

### Una gráfica de barras horizontales tiene que caber en un teléfono

Con etiquetas largas, `automargin` les da a los nombres casi todo el ancho de 360 px y las barras
quedan en un centenar de píxeles; un valor negativo escrito «fuera» de su barra se monta sobre la
etiqueta. El capítulo 10 usa nombres cortos y pone la cifra dentro de la etiqueta
(`'Actual/360 · −482'`), sin `text` sobre la barra y con el título del eje en una o dos palabras.

### Las fórmulas se ajustan solas al ancho, y lo que no cabe se marca

MathJax 3 con salida SVG no parte una ecuación en varias líneas, así que una fórmula más
ancha que su caja se quedaba detrás de una barra de desplazamiento que nadie ve. Desde el
2026-09-28 lo resuelve la librería, en tres piezas:

- **`Eq` lleva dos clases además de `eq-block`**: `eq-fit`, que marca la caja que se mide, y
  `eq-scroll`, que le dibuja la sombra. Van juntas siempre.
- **`ajustarFormulas`** corre después de cada `typesetPromise` y en cada `resize`. Baja el
  `font-size` del `mjx-container` justo lo necesario para que quepa, con un **suelo de 0,68**;
  como el SVG se dimensiona en `ex`, la fórmula se reescala sin perder nitidez. Mide el
  `scrollWidth` de la caja y no el ancho del `<svg>`, porque entre los dos hay relleno que no
  escala.
- **Lo que no cabe ni en el suelo** conserva su barra, pero con sombra por el lado que esconde
  fórmula —CSS puro, desaparece al llegar al extremo— y con `data-desborda` en la caja.

Dos reglas para quien escriba:

1. **En `Derivacion`, el campo `eq` recibe un `<Eq>`** (o una cadena, que se envuelve sola).
   No lo meta en otra caja con desbordamiento: el contenedor de fuera tapa al de dentro,
   medirlo devuelve siempre «cabe» y la sombra se pinta dos veces. Pasó al escribir el arreglo.
2. **La fórmula que lleve `data-desborda` a 360 px se parte en el fuente.** El 2026-09-28 se
   partieron las 63 que quedaban —56 a 375 px y 7 más que solo se salían a 360— y hoy ninguna de
   las 121 lo lleva ni a 375, ni a 360, ni a 1024 px. Para listarlas en un capítulo, con el panel a
   360 px, recorra las secciones con los porqués abiertos y ejecute en la consola:
   `[...document.querySelectorAll('[data-desborda]')].length`.

Cómo se partieron, para que el capítulo siguiente no invente otra forma:

| La fórmula es… | Se parte con | Ejemplo |
|---|---|---|
| una cadena de igualdades | `aligned`, una igualdad por fila, alineada en `&=` | la β de cartera, capítulo 3 |
| una implicación | `gathered`: la premisa arriba y `\\Longrightarrow\\quad` abriendo la conclusión | el ES de la normal, capítulo 5 |
| dos o más implicaciones seguidas | `aligned` con las flechas colgando a la izquierda (`\\Longrightarrow\\quad &`) | ρᵢⱼ = 1, capítulo 7 |
| un problema de optimización | `aligned` con `\\min` y `\\text{sujeto a}` en la columna izquierda | la mínima varianza, capítulo 7 |
| una fórmula con un comentario en texto | el texto en su propia fila de `gathered` | «si los r_t son independientes», capítulo 1 |

El presupuesto, medido a 360 px con el suelo de 0,68: una fórmula de sección cabe si su ancho
natural no pasa de unos **400 px**, y la de un paso de `Derivacion` de unos **310**, porque la
tarjeta y el paso se comen 60 px de relleno. Una fórmula partida ocupa dos filas **también en
escritorio**; donde bastaba con quitar espacios de sobra —`\\;=\\;` por `=`— se prefirió eso y la
fórmula siguió en una línea (la F de la sección 2 del capítulo 8). Ojo con `\\iff`: ya trae `\\;` a
cada lado, así que cambiarlo por `\\;\\Longleftrightarrow\\;` no ahorra nada.

Y **pruebe la versión partida antes de estamparla**: tipografíela en una caja insertada junto a
un `<Eq>` real del capítulo abierto a 360 px y mida su `scrollWidth` con el `font-size` al 68 %. Es
lo mismo que se pide para un arreglo de TR-CORE —una tabla de casos antes que once archivos— y
aquí evitó estampar seis versiones que a 375 cabían y a 360 no.

⚠️ **La regla `.eq-scroll` vive en `tr-head.html`, que `migrar.py` no estampa.** Se añadió a mano
a los diez capítulos; uno nuevo la hereda al nacer de `tr-base.html`, pero si se toca, hay que
copiarla otra vez a los diez.

---

`TIPOS_ERROR_RIESGO` es la taxonomía de siete errores que usa R3. Se define **una vez** en
la librería y los capítulos la reutilizan con `IDX_ERROR`: si cada ejercicio trajera sus
propias opciones, la que «suena» al tema del capítulo sería casi siempre la correcta y el
ejercicio se resolvería sin auditar nada.

**`Laboratorio` solo puede hacer aritmética** —el cálculo ocurre en el navegador—. Ajustar
un GARCH o resolver un programa cuadrático se precomputa en Python sobre una malla de
parámetros y se declara con `modo="malla"`.
