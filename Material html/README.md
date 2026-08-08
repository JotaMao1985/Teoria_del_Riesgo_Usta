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
    ├── verificar.py          comprueba los capítulos (doce reglas)
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

`verificar.py` comprueba doce cosas y devuelve ≠ 0 si algo falla:

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

---

## Catálogo de componentes

| Componente | Uso |
|---|---|
| `Motivacion` | **Apertura obligatoria de cada sección** (escena + gancho) |
| `CodeBlock` · `CodeTabs` | Bloque de un lenguaje · los dos con pestaña propia y preferencia recordada |
| `Box` · `CalloutPro` | Avisos (`info`, `tip`, `warn`, `danger`) y destacados |
| `Eq` · `Termino` | Fórmula destacada · término con definición emergente |
| `Derivacion` | **Propio del curso.** Fórmula paso a paso, cada paso con su porqué plegable |
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

`TIPOS_ERROR_RIESGO` es la taxonomía de siete errores que usa R3. Se define **una vez** en
la librería y los capítulos la reutilizan con `IDX_ERROR`: si cada ejercicio trajera sus
propias opciones, la que «suena» al tema del capítulo sería casi siempre la correcta y el
ejercicio se resolvería sin auditar nada.

**`Laboratorio` solo puede hacer aritmética** —el cálculo ocurre en el navegador—. Ajustar
un GARCH o resolver un programa cuadrático se precomputa en Python sobre una malla de
parámetros y se declara con `modo="malla"`.
