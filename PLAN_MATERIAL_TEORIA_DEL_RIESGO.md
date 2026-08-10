# Plan de implementación — Material de estudio
## Teoría del Riesgo · Universidad Santo Tomás · 2026-II

**Fuente del contenido:** `Syllabus Teoria del Riesgo - Modernizado 2026_2.xlsx` (versión 3, 2026-06-24)
**Fuente del formato:** `Logica de programacion/Material html/_plantilla/lp-base.html`
**Espacio académico:** Pregrado profesional, Estadística · Periodo 8 · Obligatorio · Teórico-práctico
**Créditos:** 2 · **Horas:** 64 acompañadas + 32 autónomas = 96
**Fecha del plan:** 2026-08-07 · **Revisión 2** (P1–P5 resueltas)
**Estado:** fases 0, 1 y 2 completadas · **puntos de control B y C aprobados** (B el
2026-08-08, C el 2026-08-10) · D-A, D-B, D-C y **D-D ratificada el 2026-08-10** (tasa libre
de riesgo, 7,00 % E.A.) · los seis capítulos de la unidad 1 pasan las doce reglas con
`--con-salidas` · **lo siguiente es la fase 3**, que empieza por el capítulo 7

---

## 1. Resumen

Quince archivos HTML autocontenidos, uno por capítulo, que cubren las tres unidades del
syllabus modernizado. Cada archivo se abre con doble clic, sin servidor ni build, y trae la
teoría, el código ejecutado en Python y R, las gráficas interactivas y entre doce y
dieciséis ejercicios de interacción real —no de lectura pasiva—. Los acompaña un cuaderno
Quarto por capítulo con el taller ejecutable.

El material hereda la arquitectura del curso de Lógica de Programación Financiera
(librería estampada, motivación obligatoria por sección, salida del código dentro del
bloque, verificador estructural) y adapta lo que no traslada: **dos lenguajes en vez de
cuatro** y una **taxonomía de ejercicios propia del dominio cuantitativo**, con la
auditoría de salidas de IA como tipo de primera clase —porque el syllabus la exige
explícitamente como estrategia didáctica central, no como adorno—.

### Alcance acordado

| Entra | No entra (fase posterior, fuera de este plan) |
|---|---|
| 15 capítulos HTML + portal índice | Banco de preguntas Moodle (R/exams) |
| 15 cuadernos Quarto (talleres ejecutables) | Guía docente y rúbricas de los tres instrumentos |
| Librería `TR-CORE`, verificador, migrador | Videos, podcasts o material audiovisual |
| Datos congelados y entorno reproducible | Montaje en el aula virtual |
| Repositorio git + publicación en GitHub Pages | |

> **Supuesto declarado.** En la consulta inicial se marcaron a la vez «cuadernos Quarto» y
> «solo el material HTML». Lo leo como: el HTML es el núcleo y los cuadernos lo acompañan;
> el banco Moodle y la guía docente quedan aplazados. Si la intención era HTML a secas,
> elimínese la tarea 22 — es separable y no bloquea nada.

---

## 2. Decisiones de arquitectura

### D1 · Bifurcar la librería, no compartirla

`lp-base.html` se copia a `_plantilla/tr-base.html` y los centinelas `LP-CORE` pasan a
`TR-CORE`. Los cuatro scripts (`ensamblar.py`, `migrar.py`, `verificar.py`,
`ejecutar_salidas.py`) se copian y se adaptan; están parametrizados por unas pocas
constantes de cabecera.

**Por qué no compartir la librería entre los dos cursos:** el conjunto de lenguajes difiere
(cuatro contra dos), la taxonomía de ejercicios difiere, y la regla 4 del verificador
—«cada bloque debe traer los cuatro lenguajes»— es directamente incompatible. Compartir
obligaría a parametrizar el verificador por curso y a re-verificar veintitrés capítulos
ante cualquier cambio de componente. El costo de bifurcar es mantener dos copias de unos
componentes ya estables; el costo de compartir es acoplar dos cursos que evolucionan por
separado. Se elige bifurcar.

Lo que **sí** se reutiliza tal cual: `Motivacion`, `Box`, `CalloutPro`, `Eq`, `Termino`,
`Pipeline`, `Timeline`, `Tabs`, `Accordion`, `ChartFrame`/`usePlotly`, `MCQ`, `Quiz`,
`Reto`, `TablaTraza`, `DetectaError`, `Comparador`, `OrdenaPasos`, `Emparejamiento`, y toda
la maquinaria de barra lateral, progreso y reanudación.

### D2 · Dos lenguajes: Python y R

`LANG_META` se reduce a `python` y `r`. Se retiran las gramáticas de Prism de
`visual-basic` y la gramática propia de pseudocódigo.

**Pestaña por defecto: Python.** Los estudiantes llegan del programa de Estadística con R
como lengua materna; el syllabus promete un «puente Python en la semana 1» justamente por
eso. Abrir en Python empuja hacia el lenguaje nuevo con R a un clic de distancia. La
preferencia se recuerda, como en LP.

Consecuencias en el verificador:

- **Regla 4** pasa a exigir `python` y `r` en cada `CodeTabs`.
- **Regla 9** (salidas ejecutadas) gana alcance: en LP se ejecutaban dos de cuatro
  lenguajes; aquí se ejecutan **los dos**, así que el material queda auditado al 100 %.
- **Regla 7** conserva un único prefijo de salida, `#>`, compartido por ambos lenguajes.
  Por eso **todo bloque va dentro de un `CodeTabs`**: un bloque suelto no se puede atribuir
  a un lenguaje y quedaría sin auditar. Los que deban ir solos declaran `lang`.

### D3 · Los datos van congelados en el repositorio

Ningún capítulo descarga datos en tiempo de ejecución. La carpeta `datos/` guarda
instantáneas en CSV, y `datos/descargar.py` documenta cómo se generaron.

**Por qué es una decisión y no un detalle.** La regla 9 compara la salida declarada tras
`#>` con la que el código produce de verdad. Contra una API en vivo, ese número cambia
todos los días: el verificador fallaría siempre y la única salida sería desactivarlo, con
lo cual el material envejecería en silencio —que es exactamente lo que la regla existe para
impedir—. Además `yfinance` se rompe con regularidad, y un estudiante sin conexión debe
poder ejecutar todo.

| Archivo | Contenido | Uso |
|---|---|---|
| `bvc_diario.csv` | Ecopetrol, **Banco de Bogotá**, Grupo Sura e ISA + **ETF ICOLCAP**, cierre diario ajustado en pesos enteros, 2018-01 → 2025-12 (1917 filas) | C1–C8 |
| `sp500_diario.csv` | Índice diario, mismo periodo | Contraste de colas: C1, C15 |
| `curva_tes.csv` | Curva cero cupón TES por plazo, cortes mensuales — **PENDIENTE, bloquea C9 y C10** | C9, C10 |
| `german_credit.csv` | UCI German Credit, 1000 observaciones | C13, C14 |
| `perdidas_operativas.csv` | Incendios daneses (`CASdatasets::danishuni`), 2167 siniestros 1980–1990, en millones de coronas de 1985 | C15 |

**Portafolio del hilo conductor** (aprobado 2026-08-07, ajustado al descargar): cuatro
emisores de la BVC más una referencia de mercado. Ecopetrol y un banco comercial dan
sectores distintos —petróleo y banca—, Grupo Sura aporta una holding e ISA un regulado de
infraestructura: cuatro betas separadas, que es lo que C3 necesita para que la
descomposición sistemático / no sistemático se vea. En C9 se le añade el tramo de TES y en
C11 la opción de cobertura.

⚠️ **Dos sustituciones que impuso la realidad de los datos** (comprobado el 2026-08-07, y
anotado en `datos/descargar.py` para que nadie repita el descubrimiento):

- **Bancolombia no existe en Yahoo**, ni como `BCOLOMBIA.CL` ni como `PFBCOLOM.CL`: las dos
  devuelven vacío. Ocupa su lugar **Banco de Bogotá** (`BOGOTA.CL`), que cumple el mismo
  papel —un banco comercial puro— y sí tiene historia completa desde 2018.
- **El índice COLCAP tampoco existe** como `^COLCAP`. Se usa **`ICOLCAP.CL`**, el ETF que
  lo replica y que sí cotiza. Es el que impone las 1917 filas del panel: tiene menos
  ruedas que las acciones y el cruce se hace por fechas comunes.

⚠️ **La instantánea la congela git, no `descargar.py`.** Yahoo recalcula los precios
ajustados hacia atrás con cada dividendo, así que volver a descargar produce un archivo
*equivalente* pero no *idéntico*. Con cuatro decimales cambiaban **6757 de 9585 celdas**
entre dos ejecuciones seguidas; redondeando a pesos enteros —la precisión con la que cotiza
la BVC— quedan 24, de un peso cada una. Quien reponga datos tiene que mirar el `git diff` y
volver a correr `verificar.py --con-salidas`.

**Serie de cola pesada para EVT** (aprobada 2026-08-07): la de incendios daneses. No hay
serie colombiana de pérdidas operativas pública con el detalle que EVT necesita, y esta es
el conjunto de referencia de la literatura —McNeil la usa en *Quantitative Risk Management*,
que ya está en la bibliografía del syllabus—. C15 declara de entrada que los datos son
daneses y por qué se usan: es preferible una serie real ajena y bien documentada a una
simulada que finja ser local, y la propia declaración es material didáctico sobre de dónde
salen los datos con que se calibra una cola.

Cada archivo lleva su fecha de descarga, su fuente y su SHA-256 en `datos/MANIFIESTO.md`.
El manifiesto es lo que permite reponer una instantánea sin adivinar qué había dentro.

### D4 · Semillas fijas, siempre

Todo lo que simule, remuestree o particione fija semilla: `np.random.default_rng(2026)` y
`set.seed(2026)`. Sin esto la regla 9 no puede existir en un curso donde la mitad de los
capítulos hacen Montecarlo.

### D5 · Entorno reproducible

`environment.yml` de conda-forge. Se usa conda y no pip porque **QuantLib-Python no compila
de forma fiable con pip en Apple Silicon**; conda-forge publica binarios. Para R,
`instalar.R`, que además comprueba que cada paquete **cargue** y no solo que esté instalado.

Tres nombres que hay que acertar y que no son los evidentes (los tres se descubrieron
fallando, el 2026-08-07):

| Se espera | Es | Qué pasa si se pone el evidente |
|---|---|---|
| `arch` | **`arch-py`** | El entorno no resuelve: «PackagesNotFoundError» |
| `quantlib` | **`quantlib-python`** | El entorno se crea **sin error** y falla más tarde, en un `import QuantLib` del capítulo 10: `quantlib` a secas es solo la librería de C++ |
| `Rglpk` | **`lpSolve`** | Rglpk enlaza contra la GLPK del sistema y no compila en un Mac limpio; el error habla de una cabecera, no de lo que falta instalar |

El segundo es el peligroso: no falla al crear el entorno, sino en clase. Por eso existe
`entorno/humo.py`, que importa las doce librerías y contrasta el SHA-256 de cada CSV contra
el manifiesto — fue quien lo cazó.

### D6 · Peso de los archivos

El capítulo 1 de LP pesa 263 KB. Aquí se suman MathJax denso y datos embebidos. Regla: **las
series de las gráficas se embeben decimadas, máximo 1500 puntos por serie**, y un capítulo
que pase de 400 KB se parte. Lo comprueba la regla 12, nueva.

### D7 · Hilo conductor único

LP usa «un crédito de libre inversión de un banco colombiano». Aquí: **el portafolio de un
fondo de pensiones colombiano** —cuatro acciones de la BVC, un tramo de TES y una opción de
cobertura— que atraviesa los quince capítulos. En la unidad 1 se le mide el riesgo de
mercado; en la 2 se optimiza y se le añade la renta fija; en la 3 se cubre con derivados, se
le mide el riesgo de crédito de la contraparte y se le estudia la cola. Un solo conjunto de
datos, un solo relato, cero ejemplos de juguete desconectados entre sí.

### D8 · El nivel de uso de IA va declarado, y va por tipo de ejercicio

El syllabus se compromete con «niveles de uso de IA declarados por instrumento (AI
Assessment Scale)». El material lo hace visible con el componente `NivelIA`.

**Precisión sobre el syllabus:** el material de estudio no es un instrumento calificado, así
que declarar un nivel único por capítulo diría poco. Se declara **por tipo de ejercicio**,
que es donde la distinción tiene consecuencias, y el capítulo muestra además el nivel del
instrumento que prepara.

| Tipo | Nivel AIAS propuesto | Por qué |
|---|---|---|
| R1 Traza de cálculo | **1 · No AI** | Delegar la traza destruye el ejercicio: lo que se entrena es sostener el estado a mano |
| R2 Predice el efecto | **1 · No AI** | Igual: es una autocomprobación del modelo mental |
| R3 Audita a la IA | **1 · No AI** | Pedirle a la IA que audite a la IA es circular. El estudiante audita sin asistencia |
| R4 Comparación de modelos | **2 · AI Planning** | La IA puede ayudar a listar criterios; el veredicto y su defensa son del estudiante |
| R5 Ordena el procedimiento | **1 · No AI** | Las dependencias metodológicas son el contenido |
| R6 Emparejamiento | **1 · No AI** | Reconocimiento de representaciones |
| R7 Interpretación de negocio | **2 · AI Planning** | La IA sirve para explorar consecuencias; la lectura regulatoria se verifica contra la norma |
| R8 Justifica el supuesto | **3 · AI Collaboration** | Es el que más se parece a la práctica profesional, y el syllabus pone los talleres en este nivel — con bitácora de prompts |
| R9 Laboratorio | **1 · No AI** | Es manipulación directa: no hay nada que delegar |
| Talleres Quarto | **3 · AI Collaboration** | Nivel que el syllabus fija para los talleres, con bitácora |
| Quiz integrador | **1 · No AI** | Prepara el examen final presencial No-AI |

Nueve de los once en nivel 1 no es rigidez: es que el material de estudio existe para
construir el criterio que después se usa **con** la IA en los talleres y **sin** ella en la
defensa oral. Si se delega el andamio, no queda nada sobre lo que colaborar.

### D9 · Terminología: término en inglés, traducción la primera vez

*Expected Shortfall* (déficit esperado), *backtesting* (prueba retrospectiva), *scorecard*
(tarjeta de puntaje), *reject inference*. La traducción va entre paréntesis en la primera
aparición de cada capítulo y luego se usa el término en inglés, porque es como aparece en
la regulación (Basilea, FRTB), en la Superfinanciera y en los nombres de función de las
librerías. Un estudiante que lea «déficit esperado» durante todo el curso no reconoce
`expected_shortfall` cuando abra la documentación de `arch`.

Excepción: los términos con traducción asentada y unívoca van en español —valor en riesgo,
volatilidad, duración, convexidad, cópula— sin el inglés al lado.

---

## 3. Estructura de archivos

```
Teoría del riesgo/
├── PLAN_MATERIAL_TEORIA_DEL_RIESGO.md      este documento
├── README.md                                cómo se trabaja el material
├── index.html                               portal (lo publica GitHub Pages)
├── .nojekyll · .gitignore · .github/workflows/pages.yml
│
├── Material html/
│   ├── 01_TDR_Riesgo_y_rendimiento.html
│   ├── 02_TDR_Volatilidad.html
│   ├── 03_TDR_CAPM.html
│   ├── 04_TDR_Valor_en_riesgo.html
│   ├── 05_TDR_Expected_shortfall.html
│   ├── 06_TDR_Backtesting.html
│   ├── 07_TDR_Portafolio.html
│   ├── 08_TDR_Optimizacion_CVaR.html
│   ├── 09_TDR_Bonos_y_curvas.html
│   ├── 10_TDR_Duracion_y_convexidad.html
│   ├── 11_TDR_Derivados_y_binomial.html
│   ├── 12_TDR_Black_Scholes_y_montecarlo.html
│   ├── 13_TDR_Credito_con_ML.html
│   ├── 14_TDR_Validacion_de_modelos.html
│   ├── 15_TDR_Valores_extremos.html
│   ├── README.md                            convenciones de autoría
│   └── _plantilla/
│       ├── tr-base.html                     GENERADA — no se edita a mano
│       ├── tr-core-extra.jsx                componentes (fuente)
│       ├── tr-demo.jsx                      capítulo de demostración + App
│       ├── ensamblar.py                     fuentes → tr-base.html
│       ├── migrar.py                        plantilla → capítulos
│       ├── verificar.py                     comprueba los capítulos
│       └── ejecutar_salidas.py              ejecuta Python y R, contrasta `#>`
│
├── datos/
│   ├── MANIFIESTO.md                        fuente, fecha y SHA-256 de cada archivo
│   ├── descargar.py                         reproduce las instantáneas
│   └── *.csv
│
├── talleres/
│   ├── TDR-01.qmd … TDR-15.qmd              cuadernos Quarto
│   └── _quarto.yml
│
└── entorno/
    ├── environment.yml
    └── instalar.R
```

---

## 4. Taxonomía de ejercicios — R1…R9

La taxonomía E1–E8 de LP mide comprensión de **algoritmos**. Aquí el objeto de estudio es el
**modelo**: sus supuestos, su validación y su lectura de negocio. Los componentes se
conservan; lo que cambia es qué se pone dentro de ellos.

| Tipo | Nombre | Qué mide realmente | Componente | Nivel |
|---|---|---|---|---|
| **R1** | **Traza de cálculo** | Sostener la recursión o el cálculo paso a paso, a mano, sin la máquina | `TablaTraza` | Analizar |
| **R2** | **Predice el efecto** | Dirección y magnitud: si α sube de 95 % a 99 %, ¿qué le pasa al ES? Los distractores codifican confusiones conceptuales, no descuidos | `MCQ` | Analizar |
| **R3** | **Audita a la IA** ★ | Se presenta una derivación o un bloque **generado por un modelo de lenguaje** con un error plantado. El estudiante ubica la línea, **clasifica** el error y anticipa su consecuencia en pesos | `DetectaError` | Evaluar |
| **R4** | **Comparación de modelos** | Distinguir el fenómeno de su estimador: VaR histórico contra paramétrico, normal contra t, media-varianza contra CVaR, logística contra boosting | `Comparador` | Evaluar |
| **R5** | **Ordena el procedimiento** | Dependencias metodológicas: no se calibra antes de particionar, no se elige el umbral después de mirar el ajuste | `OrdenaPasos` | Analizar |
| **R6** | **Emparejamiento** | Traducir entre fórmula ↔ gráfica ↔ medida ↔ norma (SARM, SARC, SARO, SARL, FRTB, Basilea III) | `Emparejamiento` | Comprender |
| **R7** | **Interpretación de negocio y regulatoria** | El número salió: ¿cuánto capital exige, qué le dice al comité de riesgos, qué decisión cambia? | `MCQ` + `Reto` | Evaluar |
| **R8** | **Justifica el supuesto** | Criterio profesional: ¿por qué t y no normal? ¿por qué ES 97,5 % y no VaR 99 %? ¿por qué ese umbral? | `Reto` con solución revelable | Crear |
| **R9** | **Laboratorio parametrizado** | Deslizadores que recalculan una gráfica en el navegador. Convierte un supuesto abstracto en una consecuencia visible | `Laboratorio` *(nuevo)* | Analizar |

★ **R3 es el tipo distintivo de este curso.** El syllabus compromete «casos *Audita a la IA*
(detectar, corregir y re-derivar un cálculo de riesgo producido por un modelo de lenguaje)»
como estrategia didáctica. `DetectaError` ya hace exactamente eso —señalar la línea y
clasificar el error— y solo necesita una taxonomía de errores nueva:

| Tipo de error | Ejemplo |
|---|---|
| **Supuesto no verificado** | Escalar con √10 una serie con autocorrelación |
| **Confusión de medida** | Calcular el ES como el cuantil 97,5 % en vez de la media de la cola |
| **Fuga de información** | Ajustar el escalador antes de partir en entrenamiento y prueba |
| **Convención equivocada** | Actual/360 donde la convención del papel es 30/360 |
| **Estimador inconsistente** | Usar la matriz de correlación donde el problema pide la de covarianza |
| **Resultado sin incertidumbre** | Reportar un precio Montecarlo sin su error estándar |
| **Interpretación indebida** | Leer un R² de 0,18 como «el modelo explica bien» |

**Excluido por diseño**, igual que en LP: enunciados del tipo «escriba un programa que
calcule el VaR». La escritura desde cero corresponde a los talleres Quarto y al proyecto
integrador que el syllabus ya define. Aquí se lee, se traza, se diagnostica, se compara, se
interpreta y se justifica.

### Cuota por capítulo

| Tipo | R1 | R2 | R3 | R4 | R5 | R6 | R7 | R8 | R9 | Quiz |
|---|---|---|---|---|---|---|---|---|---|---|
| Cantidad | 1–2 | 2–3 | **2** | 1–2 | 1 | 1 | 2 | 1–2 | 1–2 | 10 preguntas |

Total: **12–16 ejercicios interactivos + 1 cuestionario integrador** por capítulo. Mínimo
obligatorio, que comprueba el verificador: **R1, R3, R7 y R9** en cada capítulo. R3 lleva
cuota de dos porque la auditoría de IA es transversal en el syllabus.

### Mapeo con los mecanismos de evaluación del syllabus

| Instrumento del syllabus | Tipos que lo preparan |
|---|---|
| Foros sobre medición y gobernanza (U1) | R6, R7, R8 |
| Taller VaR→ES con bitácora de IA y backtest obligatorio (U1) | R1, R3, R4, R5 |
| Taller de construcción y optimización de portafolio (U2) | R1, R4, R9 |
| Proyecto integrador con datos reales (U3) | R5, R7, R8 + talleres Quarto |
| Defensa oral individual No-AI (U3) | R8 sobre todo — es el que entrena defender un supuesto |
| Examen final presencial No-AI acumulativo | Quiz integrador de los quince capítulos |

---

## 5. Componentes nuevos

Cinco piezas que LP no tiene y que este curso necesita.

| Componente | Qué hace | Por qué no basta lo que hay |
|---|---|---|
| `Laboratorio` | Panel de deslizadores que recalcula una gráfica Plotly en el navegador | `ChartFrame` pinta una gráfica fija. El valor de que esto sea HTML y no un PDF es justamente que el estudiante mueva α y vea moverse la cola |
| `Derivacion` | Fórmula paso a paso, cada paso plegable con su justificación | `Eq` muestra una fórmula terminada. Riesgo es un curso de derivaciones: de la binomial a Black-Scholes hay ocho pasos y cada uno tiene un porqué |
| `FichaNorma` | Recuadro normativo: qué exige, qué artículo, qué cálculo del capítulo lo satisface | Basilea III, FRTB y los cuatro sistemas de la Superfinanciera aparecen en las tres unidades. Un `Box` genérico no deja ver la trazabilidad norma→cálculo |
| `TablaResultados` | Salida tabular de un modelo con lectura guiada de cada celda | La tabla de coeficientes de un GARCH o las métricas de un scorecard son el objeto de estudio, no decoración |
| `NivelIA` | Insignia AIAS del capítulo o del ejercicio, según D8 | Compromiso explícito del syllabus |

**Restricción técnica de `Laboratorio`:** el cálculo ocurre en el navegador, así que solo
admite aritmética —cuantiles empíricos, recursión EWMA, frontera de dos activos, fórmula de
Black-Scholes—. Lo que exige optimización o estimación (ajustar un GARCH, resolver el
programa cuadrático) se **precomputa en Python** sobre una malla de parámetros y se embebe;
el deslizador interpola. Se documenta en cada uso cuál de los dos modos es.

---

## 6. Motivación de apertura

Se mantiene la regla de LP sin cambios: **toda sección abre con `<Motivacion>`**, y lo
comprueba el verificador. Escena concreta, tensión o costo, gancho. Máximo ~80 palabras.
Antipatrón: «En esta sección estudiaremos…».

Ganchos de portada previstos por capítulo. Sirven de guía al redactar; se afinan al escribir.
Cada **sección** interior lleva además el suyo.

| Cap. | Gancho |
|---|---|
| 1 | El informe decía que la pérdida diaria máxima esperada era 1,8 %. Ayer perdimos 6,3 %. Nadie mintió: el modelo suponía una normal y el mercado no la leyó. |
| 2 | La volatilidad de ayer predice la de hoy mucho mejor que la de hace un año. Todo el capítulo sale de tomarse esa frase en serio. |
| 3 | Dos acciones cayeron lo mismo el mismo día. Una arrastró al mercado entero; la otra tuvo un mal día. Cobrar prima por el segundo riesgo es regalar dinero. |
| 4 | Un número, un porcentaje y un plazo. El VaR cabe en una frase, y por eso lo firma el comité — y por eso también se usa mal. |
| 5 | Dos portafolios con el mismo VaR: uno pierde el máximo un día de cada cien; el otro pierde diez veces eso. La medida no distingue. |
| 6 | El modelo falló nueve veces en un año cuando debía fallar dos y media. ¿Es un mal modelo o fue un mal año? Hay una prueba para eso, y del resultado depende cuánto capital exige el regulador. |
| 7 | Sumar dos activos riesgosos y obtener uno menos riesgoso que cualquiera de los dos no es un truco contable. Es covarianza. |
| 8 | La frontera eficiente es hermosa hasta el día en que la cola importa. Optimizar la varianza protege contra los dos lados; solo uno duele. |
| 9 | El bono paga lo que promete. El problema es que la tasa a la que se descuenta cambió, y con ella el precio que hoy vale en libros. |
| 10 | La duración dijo que el bono caería 4,2 %. Cayó 3,8 %. La diferencia se llama convexidad y en una cartera de un billón son 4 000 millones. |
| 11 | El forward se valora sin saber nada de probabilidades. La opción, no. Esa asimetría es todo el capítulo. |
| 12 | Black-Scholes supone volatilidad constante. El mercado cotiza una volatilidad distinta para cada precio de ejercicio. Ambas cosas son ciertas a la vez. |
| 13 | Cuarenta mil solicitudes al mes. Ninguna persona las lee: las lee un modelo, y alguien tiene que responder por él ante la Superintendencia. |
| 14 | El modelo aprobó créditos con un 0,93 de AUC. La variable que más pesaba se conocía solo después del incumplimiento. |
| 15 | La peor pérdida de la muestra ocurrió una vez. Los métodos de los capítulos anteriores tienen exactamente un dato para estimar lo que hay más allá. |

---

## 7. Plan capítulo por capítulo

Cada capítulo produce **1 archivo HTML** + **1 cuaderno Quarto**.
Los RA se numeran RA1…RA9 según esta correspondencia con el syllabus:

| RA | Enunciado (abreviado) | Competencia |
|---|---|---|
| RA1 | Medir riesgo de mercado: volatilidad (EWMA, ARCH/GARCH), VaR y ES/CVaR | Programación y software |
| RA2 | Validar modelos por backtesting (Kupiec, Christoffersen, Acerbi-Székely) | Programación y software |
| RA3 | Comprender la importancia y la gobernanza del riesgo financiero | Programación y software |
| RA4 | Construir y optimizar un portafolio, incluida la optimización CVaR | Gestión de datos |
| RA5 | Conocer el mercado de bonos y sus medidas (duración, convexidad) | Gestión de datos |
| RA6 | Valorar renta fija con QuantLib verificando código y supuestos de curva | Gestión de datos |
| RA7 | Valorar derivados con Black-Scholes y simulación Montecarlo | Comunicación |
| RA8 | Construir y validar un modelo de riesgo de crédito con ML | Comunicación |
| RA9 | Cuantificar eventos extremos (EVT) y defender los supuestos | Comunicación |

### Cuadre de horas

| Unidad | Capítulos | Horas del plan | Horas del syllabus |
|---|---|---|---|
| U1 · Riesgo de mercado | 1–6 | 4+6+3+5+3+3 = **24** | 24 |
| U2 · Portafolio y renta fija | 7–10 | 5+3+4+4 = **16** | 16 |
| U3 · Derivados, crédito y extremos | 11–15 | 5+5+6+4+4 = **24** | 24 |
| **Total** | **15** | **64** | **64** |

---

## UNIDAD 1 — Riesgo de mercado · 24 h acompañadas / 12 autónomas · RA1–RA3

---

### Capítulo 1 — Riesgo, rendimiento y el entorno reproducible
**Syllabus:** U1 contenido 1 · **4 h** · RA1, RA3 · **Alcance: M**

Secciones: portada · 1. Qué es el riesgo financiero: mercado, crédito, operativo, liquidez ·
2. Gobernanza: quién responde por el número · 3. Rendimientos aritméticos y logarítmicos, y
por qué la agregación decide cuál usar · 4. Momentos, asimetría y curtosis: la normal como
hipótesis, no como hecho · 5. El entorno: `environment.yml`, semillas, datos congelados,
puente R→Python · evaluación.

- **Fórmulas:** \(r_t=\ln(P_t/P_{t-1})\), agregación temporal, momentos muestrales, curtosis de exceso.
- **Código:** carga del CSV congelado, cálculo de rendimientos y estadísticos descriptivos. Es el capítulo donde el puente R→Python se hace explícito: pandas y tidyverse resolviendo lo mismo, línea a línea.
- **Gráficas:** serie de precios del portafolio · histograma de rendimientos con la normal ajustada superpuesta · QQ-plot.
- **Datos:** `bvc_diario.csv`, `sp500_diario.csv`.
- **Ejercicios:** R1 (de precios a rendimientos log y a acumulado, 5 días) · R2 ×2 · R3 ×2 (la IA agrega rendimientos aritméticos sumándolos; la IA anualiza con 252 una serie mensual) · R4 · R6 (tipo de riesgo ↔ sistema de la Superfinanciera) · R7 · R8 · R9 (ventana → curtosis).
- **Depende de:** T1–T5.

---

### Capítulo 2 — Volatilidad: EWMA, ARCH y GARCH
**Syllabus:** U1 contenido 2 · **6 h** · RA1 · **Alcance: L → dos sesiones**

Secciones: 1. La volatilidad no es constante: agrupamiento y su evidencia · 2. Ventana móvil
y su defecto (el efecto fantasma) · 3. EWMA y el λ de RiskMetrics · 4. ARCH(q): la intuición
de Engle · 5. GARCH(1,1): ω, α, β, persistencia y varianza de largo plazo · 6. Ajuste con
`arch` y diagnóstico de residuos estandarizados · 7. Pronóstico a h días.

- **Fórmulas:** \(\sigma_t^2=\lambda\sigma_{t-1}^2+(1-\lambda)r_{t-1}^2\) · \(\sigma_t^2=\omega+\alpha r_{t-1}^2+\beta\sigma_{t-1}^2\) · persistencia \(\alpha+\beta\) · \(\sigma_\infty^2=\omega/(1-\alpha-\beta)\) · pronóstico a h pasos.
- **Código:** `arch_model(..., vol='GARCH', p=1, q=1, dist='t')` en Python; `rugarch` en R. `TablaResultados` con la tabla de coeficientes leída celda a celda.
- **Gráficas:** \(|r_t|\) mostrando el agrupamiento · las tres estimaciones de σ superpuestas · ACF de \(r_t^2\) · pronóstico en abanico.
- **Ejercicios:** R1 (traza de EWMA a cinco pasos, a mano — el ejercicio más valioso del capítulo) · R2 ×3 · R3 ×2 (la IA reporta α+β = 1,004 sin comentarlo; la IA diagnostica sobre residuos crudos en vez de estandarizados) · R4 (ventana vs EWMA vs GARCH) · R5 · R7 · R8 · R9 (λ deslizante → serie de volatilidad).
- **Partición del trabajo:** (a) EWMA y ARCH · (b) GARCH, diagnóstico y pronóstico.
- **Depende de:** C1.

---

### Capítulo 3 — Riesgo sistemático y no sistemático: CAPM
**Syllabus:** U1 contenido 3 · **3 h** · RA1, RA3 · **Alcance: M**

Secciones: 1. Descomposición de la varianza · 2. Beta: estimación por regresión y su error
estándar · 3. CAPM y la línea de mercado de valores · 4. Riesgo diversificable: cuántos
activos hacen falta de verdad · 5. Los límites del CAPM: beta inestable, R² bajo, y qué se
puede afirmar con eso.

- **Fórmulas:** \(\sigma_i^2=\beta_i^2\sigma_M^2+\sigma_{\varepsilon}^2\) · \(\beta=\mathrm{Cov}(r_i,r_M)/\mathrm{Var}(r_M)\) · \(E[R_i]=R_f+\beta_i(E[R_M]-R_f)\).
- **Código:** OLS con `statsmodels` y con `lm`, beta rodante de 250 días.
- **Gráficas:** dispersión con la recta ajustada · beta rodante en el tiempo · riesgo del portafolio frente al número de activos.
- **Ejercicios:** R1 (β con seis observaciones, a mano) · R2 ×2 · R3 ×2 (la IA lee un R² de 0,18 como buen ajuste; la IA estima β con precios en vez de rendimientos) · R4 (β OLS vs β rodante) · R6 · R7 · R8 (justificar la ventana de estimación) · R9 (N → riesgo residual).
- **Depende de:** C1.

---

### Capítulo 4 — Valor en Riesgo (VaR) · 🎯 **capítulo piloto**
**Syllabus:** U1 contenido 4 · **5 h** · RA1 · **Alcance: L → dos sesiones**

Secciones: 1. La pregunta que responde el VaR, y las tres que no · 2. VaR paramétrico:
normal y t-Student · 3. VaR histórico y el peso de la ventana · 4. VaR por simulación
Montecarlo · 5. VaR de portafolio: matriz de covarianzas, VaR marginal, incremental y
componente · 6. Escalamiento temporal: la raíz del tiempo y cuándo falla.

- **Fórmulas:** \(\mathrm{VaR}_\alpha=-(\mu+z_\alpha\sigma)W\) · cuantil empírico · \(\mathrm{VaR}_p=z_\alpha\sqrt{w^\top\Sigma w}\,W\) · VaR componente \(w_i\,\partial\mathrm{VaR}/\partial w_i\).
- **Código:** los tres métodos sobre el mismo portafolio, con tabla comparativa y su lectura.
- **Gráficas:** histograma con el corte del VaR por los tres métodos · VaR componente en barras · VaR frente al horizonte, √t contra simulado.
- **Ejercicios:** R1 ×2 · R2 ×3 · R3 ×2 (la IA escala con √10 una serie autocorrelacionada; la IA suma los VaR individuales para obtener el del portafolio) · R4 (los tres métodos) · R5 · R6 · R7 ×2 · R8 · R9 (α y ventana deslizantes).
- **Partición del trabajo:** (a) métodos univariados · (b) portafolio y escalamiento.
- **Por qué este es el piloto:** es el capítulo **representativo**, no el más fácil. Trae fórmulas, tres implementaciones contrastadas, gráficas interactivas, los nueve tipos de ejercicio y lectura regulatoria. Si la plantilla aguanta el capítulo 4, aguanta los otros catorce; si no aguanta, se descubre en la tarea 6 y no en la 20.
- **Depende de:** Punto de control A.

---

### Capítulo 5 — Expected Shortfall: la medida coherente
**Syllabus:** U1 contenidos 5 y 7 · **3 h** · RA1 · **Alcance: M**

Secciones: 1. Los cuatro axiomas de coherencia · 2. Dónde falla el VaR: el contraejemplo de
subaditividad, construido paso a paso · 3. *Expected Shortfall* (déficit esperado) / CVaR:
definición y estimación por los tres métodos · 4. Basilea III y el paso de VaR 99 % a ES
97,5 % · 5. Horizonte de liquidez y el marco FRTB.

- **Fórmulas:** \(\mathrm{ES}_\alpha=E[L\mid L>\mathrm{VaR}_\alpha]\) · los cuatro axiomas · ES paramétrico normal \(\sigma\,\phi(z_\alpha)/(1-\alpha)\).
- **Código:** ES por método histórico, paramétrico y Montecarlo; contraste con el VaR de C4 sobre el mismo portafolio.
- **Gráficas:** cola con VaR y ES marcados · el contraejemplo de subaditividad con dos bonos · VaR y ES frente a α.
- **Ejercicios:** R1 (ES sobre veinte pérdidas ordenadas, a mano) · R2 ×2 · R3 ×2 (**la IA calcula el ES como el cuantil 97,5 %** — el error más frecuente del dominio; la IA afirma que el ES siempre es subaditivo sin distinguir estimador de medida) · R4 (VaR vs ES) · R5 · R6 (`FichaNorma` de Basilea III y FRTB) · R7 ×2 · R8 (¿ES al 97,5 % o VaR al 99 %?) · R9.
- **Depende de:** C4.

---

### Capítulo 6 — Backtesting y marco regulatorio
**Syllabus:** U1 contenidos 6 y 8 · **3 h** · RA2, RA3 · **Alcance: M**

Secciones: 1. Qué significa validar un modelo de riesgo · 2. *Backtesting* (prueba
retrospectiva) I: Kupiec (POF), cobertura incondicional · 3. Backtesting II: Christoffersen,
independencia y prueba condicional · 4. Backtesting del ES: Acerbi-Székely Z1 y Z2, y por
qué es más difícil que el del VaR · 5. Zona semáforo de Basilea y el multiplicador de
capital · 6. SARM de la Superfinanciera: qué exige y a quién · 7. Qué hacer cuando el
backtest falla.

- **Fórmulas:** \(LR_{uc}\), \(LR_{ind}\), \(LR_{cc}\) y sus distribuciones asintóticas · \(Z_1\), \(Z_2\) de Acerbi-Székely.
- **Código:** funciones de backtest escritas desde los primeros principios —no de librería: el punto es que se vea el estadístico—, tabla de excepciones, semáforo.
- **Gráficas:** serie de pérdidas con las excepciones señaladas · agrupamiento de excepciones (el fallo que Kupiec no ve y Christoffersen sí) · zona semáforo.
- **Ejercicios:** R1 (\(LR_{uc}\) con doce excepciones) · R2 ×2 · R3 ×2 (la IA acepta un modelo con excepciones agrupadas porque el conteo total cuadra; la IA aplica Kupiec al ES) · R4 (Kupiec vs Christoffersen sobre la misma serie) · R5 (orden del procedimiento de backtest) · R6 (`FichaNorma` SARM) · R7 ×2 · R8 · R9.
- **Depende de:** C4, C5.

### ✅ Punto de control C — Unidad 1 completa · **APROBADO 2026-08-10**
- [x] Seis capítulos pasan `verificar.py --con-salidas` — seis OK, sin avisos, TR-CORE
      `1782905c90e0a6b8…` idéntico en los seis; el mayor pesa 340 KB
- [x] Las 24 h del syllabus están cubiertas y suman lo declarado — `CONFIG.horas`
      4+6+3+5+3+3 = **24**, y los ocho contenidos de la U1 tienen sección (C5 absorbe el 5
      y el 7, C6 el 6 y el 8)
- [x] El hilo del fondo de pensiones es continuo entre C1 y C6 — la serie `RP` embebida es
      **byte a byte la misma en los seis** (n = 1 916, sha `ff9adfde…`), los 800 000 millones
      y los cuatro emisores aparecen en los seis, y el VaR de 32 617 millones viaja de C4 a
      C1, C3, C5 y C6. Las 35 secciones abren con `<Motivacion>`
- [x] El taller VaR→ES del syllabus se puede armar con el material existente — y se armó:
      **`talleres/TDR-U1.qmd`**, el instrumento calificado de la unidad, con R1, R3, R4 y R5,
      bitácora en nivel 3 y backtest obligatorio. Sus tres bloques ejecutables corren y dan
      las cifras del material
- [x] Revisión con el usuario — **2026-08-10**, con la tarea 11-bis como condición de cierre

**Lo que la revisión encontró y el verificador no podía ver:** `chart-h-380`, una clase que
no existe, en dos elementos del capítulo 2 —medían 450 px, la altura por omisión de
Plotly—; y **90 preguntas sin explicación** en los seis capítulos, no 30 como se creía. Las
dos cosas quedaron corregidas en la tarea 11-bis antes de aprobar el punto de control.

---

## UNIDAD 2 — Portafolio y renta fija · 16 h acompañadas / 8 autónomas · RA4–RA6

---

### Capítulo 7 — Teoría del portafolio y frontera eficiente
**Syllabus:** U2 contenido 1 · **5 h** · RA4 · **Alcance: M-L → dos sesiones**

Secciones: 1. Diversificación: la covarianza es el motor · 2. Media-varianza como programa
cuadrático · 3. Frontera eficiente y portafolio de mínima varianza · 4. Activo libre de
riesgo, CML y máximo Sharpe · 5. Restricciones realistas: sin cortos, límites por emisor,
régimen de inversión de los fondos de pensiones · 6. La fragilidad de Σ: por qué la frontera
se mueve cuando se cambia la ventana.

- **Código:** `cvxpy` y `scipy.optimize` en Python; `quadprog` en R.
- **Gráficas:** frontera eficiente con los activos individuales · mapa de calor de correlaciones · composición del portafolio frente al retorno objetivo (área apilada).
- **Ejercicios:** R1 · R2 ×2 · R3 ×2 (la IA optimiza con la matriz de correlación en lugar de la de covarianza; la IA reporta pesos negativos donde el régimen no admite cortos) · R4 (con y sin restricción de cortos) · R5 · R6 · R7 · R8 · R9 (correlación deslizante → frontera; es el laboratorio más didáctico del curso).
- **Depende de:** C1, C3.

---

### Capítulo 8 — Optimización CVaR (Rockafellar–Uryasev)
**Syllabus:** U2 contenido 2 · **3 h** · RA4 · **Alcance: M**

Secciones: 1. Por qué optimizar la cola y no la varianza · 2. La formulación lineal de
Rockafellar-Uryasev y por qué es un hallazgo · 3. Implementación por escenarios ·
4. Comparación con media-varianza sobre el mismo portafolio y los mismos datos.

- **Fórmula:** \(F_\alpha(w,\zeta)=\zeta+\frac{1}{(1-\alpha)S}\sum_s \max(0,\,-w^\top r_s-\zeta)\).
- **Código:** programa lineal con `cvxpy` sobre escenarios históricos.
- **Gráficas:** frontera media-CVaR superpuesta a la media-varianza · composición comparada · distribución de pérdidas de ambos portafolios.
- **Ejercicios:** R1 · R2 ×2 · R3 ×2 (la IA minimiza el CVaR sin la variable auxiliar ζ; la IA usa escenarios simulados normales y presenta el resultado como «histórico») · R4 (el núcleo del capítulo) · R5 · R6 · R7 · R8 (¿cuándo compensa la complejidad?) · R9.
- **Depende de:** C5, C7.

---

### Capítulo 9 — Bonos, tasas y curvas de rendimiento
**Syllabus:** U2 contenido 3 · **4 h** · RA5 · **Alcance: M**

Secciones: 1. Flujo de caja de un bono y su precio · 2. TIR, tasa cupón y precio: las tres no
son lo mismo · 3. Tasas spot, forward y la relación de no arbitraje · 4. Construcción de la
curva por bootstrapping · 5. Ajuste paramétrico: Nelson-Siegel · 6. La curva TES en Colombia
y qué la mueve.

- **Código:** bootstrapping a mano —para que se vea— y luego con QuantLib; Nelson-Siegel con `scipy.optimize`.
- **Gráficas:** curva spot y forward superpuestas · evolución de la curva TES en el tiempo · precio frente a TIR.
- **Datos:** `curva_tes.csv`.
- **Ejercicios:** R1 (bootstrapping de tres plazos, a mano) · R2 ×2 · R3 ×2 (la IA confunde tasa nominal con efectiva; la IA descuenta todos los flujos con la spot del plazo final) · R4 (bootstrapping vs Nelson-Siegel) · R5 (orden del bootstrapping — es intrínsecamente secuencial) · R6 · R7 · R8 · R9 (desplazamiento paralelo y cambio de pendiente de la curva).
- **Depende de:** C1.

---

### Capítulo 10 — Duración, convexidad y valoración con QuantLib
**Syllabus:** U2 contenidos 4, 5 y 6 · **4 h** · RA5, RA6 · **Alcance: M-L**

Secciones: 1. Duración de Macaulay y duración modificada · 2. Convexidad y la aproximación
de segundo orden · 3. DV01 y cobertura de una cartera de renta fija · 4. QuantLib: objetos,
calendarios y convenciones de conteo de días · 5. **Verificar el código y los supuestos de
la curva** —el RA6 lo pide literalmente— · 6. Liquidez de financiación: LCR, NSFR y SARL
(lectura autónoma con `FichaNorma`).

- **Fórmulas:** \(D_{mac}\), \(D_{mod}=D_{mac}/(1+y/m)\), \(C\), \(\Delta P/P \approx -D_{mod}\Delta y + \tfrac12 C(\Delta y)^2\), DV01.
- **Código:** duración y convexidad a mano; el mismo bono con QuantLib; **contraste de los dos resultados**, que es el ejercicio de auditoría del capítulo.
- **Gráficas:** precio real, aproximación por duración y aproximación con convexidad, sobre el mismo eje.
- **Ejercicios:** R1 · R2 ×2 · R3 ×2 (**la IA usa Actual/360 donde la convención del papel es 30/360** — el error de convención más caro del mercado local; la IA construye el calendario con festivos de Estados Unidos) · R4 (primer orden vs segundo orden) · R5 · R6 (`FichaNorma` LCR, NSFR, SARL) · R7 ×2 · R8 · R9 (Δy deslizante → error de aproximación).
- **Depende de:** C9.

### ✅ Punto de control D — Unidad 2 completa
- [ ] Los diez capítulos pasan el verificador
- [ ] QuantLib se ejecuta de verdad en la regla 9, no queda declarado como omitido
- [ ] Las 16 h del syllabus están cubiertas

---

## UNIDAD 3 — Derivados, crédito y eventos extremos · 24 h acompañadas / 12 autónomas · RA7–RA9

---

### Capítulo 11 — Derivados: forwards, futuros, opciones y árbol binomial
**Syllabus:** U3 contenido 1 · **5 h** · RA7 · **Alcance: M-L**

Secciones: 1. Forwards y futuros: precio de no arbitraje y cost of carry · 2. Opciones:
perfiles de pago y paridad put-call · 3. Valoración binomial de un período por replicación ·
4. La probabilidad neutral al riesgo: qué es y qué no es · 5. Árbol de n períodos y
convergencia · 6. Opciones americanas y ejercicio anticipado.

- **Fórmulas:** \(F=S e^{(r-q)T}\) · \(C-P=S-Ke^{-rT}\) · \(p=\frac{e^{r\Delta t}-d}{u-d}\) · \(u=e^{\sigma\sqrt{\Delta t}}\).
- **Gráficas:** perfiles de pago de las estrategias · árbol binomial dibujado con los valores en cada nodo · convergencia del precio al aumentar n.
- **Ejercicios:** R1 (traza de un árbol de tres pasos) · R2 ×3 · R3 ×2 (**la IA usa la probabilidad real en vez de la neutral al riesgo** — el error conceptual central del capítulo; la IA aplica paridad put-call a opciones americanas) · R4 (europea vs americana) · R5 · R6 (estrategia ↔ perfil de pago) · R7 · R8 · R9 (n deslizante → convergencia).
- **Depende de:** C1.

---

### Capítulo 12 — Black-Scholes, Montecarlo y griegas
**Syllabus:** U3 contenido 2 · **5 h** · RA7 · **Alcance: L → dos sesiones**

Secciones: 1. De la binomial a Black-Scholes: el paso al límite, con `Derivacion` · 2. La
fórmula y sus supuestos, y cuáles no se cumplen · 3. Volatilidad implícita y la sonrisa ·
4. Montecarlo: GBM, error estándar, reducción de varianza por variables antitéticas ·
5. Griegas: delta, gamma, vega, theta, rho · 6. Cobertura delta y el costo del rebalanceo.

- **Fórmulas:** Black-Scholes cerrado · \(d_1, d_2\) · las cinco griegas · error estándar de Montecarlo \(s/\sqrt{n}\).
- **Código:** fórmula cerrada, Montecarlo con semilla fija, contraste de ambos con su intervalo; griegas analíticas frente a diferencias finitas.
- **Gráficas:** superficie de volatilidad implícita · convergencia de Montecarlo con bandas de ±2 EE · delta y gamma frente al subyacente · P&L de una cobertura delta rebalanceada.
- **Ejercicios:** R1 · R2 ×3 · R3 ×2 (**la IA reporta un precio Montecarlo sin error estándar**; la IA calcula vega derivando respecto a la volatilidad implícita del propio precio) · R4 (cerrado vs Montecarlo) · R5 · R6 · R7 ×2 · R8 (qué supuesto de BS rompe el mercado colombiano) · R9 (vega frente al plazo).
- **Partición del trabajo:** (a) Black-Scholes y volatilidad implícita · (b) Montecarlo, griegas y cobertura.
- **Depende de:** C2, C11.

---

### Capítulo 13 — Riesgo de crédito con ML: PD y scorecards
**Syllabus:** U3 contenido 3 (primera mitad) · **6 h** · RA8 · **Alcance: L → dos sesiones**

Secciones: 1. La PD dentro del marco de pérdida esperada, PD·LGD·EAD · 2. El dataset German
Credit: qué contiene y dónde está la trampa · 3. Partición y el pecado de la fuga de
información · 4. Regresión logística: coeficientes, odds y su lectura de negocio ·
5. Binning WoE e Information Value · 6. Del score a los puntos: el *scorecard* (tarjeta de
puntaje) · 7. Gradient boosting y XGBoost: qué gana y qué pierde frente a la logística.

- **Fórmulas:** \(EL=PD\cdot LGD\cdot EAD\) · logit y odds · WoE e IV · escalamiento de puntos (factor y offset).
- **Código:** `Pipeline` de scikit-learn con el escalador **dentro** del pipeline, binning, XGBoost.
- **Gráficas:** distribución de scores por clase · WoE por bin · importancia de variables.
- **Datos:** `german_credit.csv`.
- **Ejercicios:** R1 (logit → odds → PD → puntos, a mano) · R2 ×3 · R3 ×2 (**la IA ajusta el escalador antes de partir** — fuga de información; la IA interpreta el coeficiente de una categórica sin referirse a su categoría base) · R4 (logística vs boosting) · R5 (orden del pipeline) · R6 · R7 ×2 · R8 (¿interpretable o preciso? el dilema real del área) · R9.
- **Partición del trabajo:** (a) marco, datos, partición y logística · (b) WoE, scorecard y boosting.
- **Depende de:** C1.

---

### Capítulo 14 — Validación e interpretabilidad del modelo de crédito
**Syllabus:** U3 contenido 3 (segunda mitad) y 7 · **4 h** · RA8 · **Alcance: M-L**

Secciones: 1. Discriminación: ROC, AUC, Gini y KS · 2. Calibración: curva de fiabilidad,
Brier, Hosmer-Lemeshow · 3. **Discriminación y calibración no son lo mismo** — un modelo
puede ordenar perfecto y estar mal calibrado · 4. Estabilidad: PSI y el monitoreo en
producción · 5. Interpretabilidad: SHAP, qué significa y qué no · 6. *Reject inference* ·
7. Sesgo y variables prohibidas · 8. SARC de la Superfinanciera.

- **Gráficas:** ROC con el área sombreada · curva KS con su punto máximo · curva de calibración · beeswarm de SHAP · PSI por periodo.
- **Ejercicios:** R1 (matriz de confusión → TPR/FPR → un punto de la ROC) · R2 ×3 · R3 ×2 (**la IA celebra un AUC de 0,93 obtenido con una variable posterior al incumplimiento**; la IA declara estable un modelo con PSI de 0,31) · R4 (discriminación vs calibración sobre dos modelos) · R5 · R6 (métrica ↔ pregunta de negocio) · R7 ×2 · R8 (¿qué se hace con los rechazados?) · R9 (umbral de corte → matriz de confusión y costo).
- **Depende de:** C13.

---

### Capítulo 15 — Eventos extremos: EVT, cópulas y riesgo operativo
**Syllabus:** U3 contenidos 4, 5 y 6 · **4 h** · RA9 · **Alcance: M-L**

Secciones: 1. Por qué las colas necesitan su propia teoría · 2. Máximos por bloques y la
distribución GEV · 3. Picos sobre umbral (POT) y la Pareto generalizada · 4. Elegir el
umbral: mean excess plot y estabilidad de parámetros · 5. VaR y ES por EVT, contrastados con
los de C5 sobre los mismos datos · 6. Dependencia en la cola: cópulas (opcional, plegable) ·
7. Riesgo operativo y SARO (lectura autónoma con `FichaNorma`).

- **Fórmulas:** GEV con \(\xi,\mu,\sigma\) · GPD \(G_{\xi,\beta}\) · VaR y ES bajo POT · función de exceso medio.
- **Código:** `pyextremes` en Python, `extRemes` en R; ajuste GPD y diagnóstico.
- **Gráficas:** mean excess plot · ajuste GPD sobre la cola con los datos empíricos · VaR y ES empírico frente a EVT · dependencia de cola de una cópula gaussiana contra una t.
- **Datos:** `perdidas_operativas.csv`, `sp500_diario.csv`.
- **Ejercicios:** R1 · R2 ×2 · R3 ×2 (**la IA elige el umbral maximizando la bondad de ajuste** — sobreajuste de cola, el error metodológico propio del tema; la IA modela dependencia de cola con correlación de Pearson) · R4 (empírico vs EVT) · R5 · R6 (`FichaNorma` SARO) · R7 · R8 (justificar el umbral — es exactamente lo que pide la defensa oral del syllabus) · R9 (umbral deslizante → ξ y su estabilidad).
- **Depende de:** C5.

### ✅ Punto de control E — Unidad 3 completa
- [ ] Los quince capítulos pasan el verificador
- [ ] Las 64 h acompañadas están cubiertas y cuadran con la tabla de la sección 7
- [ ] Los nueve RA tienen al menos un capítulo que los desarrolla

---

## 8. Lista de tareas

### Fase 0 — Fundación

#### Tarea 1 · Repositorio y estructura
**Descripción:** Inicializar git en la carpeta, crear el árbol de la sección 3, el
`.gitignore`, el `.nojekyll` y el workflow de GitHub Pages, copiados y adaptados de LP.

**Criterios de aceptación:**
- [ ] `git log` muestra el commit inicial y `git status` sale limpio
- [ ] El árbol de carpetas coincide con la sección 3
- [ ] El workflow de Pages publica la carpeta raíz sin error

**Verificación:** `git status` limpio · la acción de Pages termina en verde
**Depende de:** ninguna · **Alcance: S**

#### Tarea 2 · Bifurcar la librería a dos lenguajes
**Descripción:** Copiar `lp-base.html`, `lp-core-extra.jsx`, `lp-demo.jsx` y los cuatro
scripts. Renombrar los centinelas a `TR-CORE`. Reducir `LANG_META` a `python` y `r`, retirar
las gramáticas de Prism sobrantes, poner `python` como pestaña por defecto.

**Criterios de aceptación:**
- [ ] `ensamblar.py` genera `tr-base.html` sin error y con Font Awesome ≥ 6.5
- [ ] `tr-base.html` abre con doble clic y las pestañas alternan Python y R
- [ ] Ningún residuo de `pseudo` ni `vba` en el JSX ni en los scripts

**Verificación:** `python3 ensamblar.py && python3 verificar.py --sin-cuota`
**Depende de:** T1 · **Alcance: M**

#### Tarea 3 · Componentes nuevos
**Descripción:** Implementar `Laboratorio`, `Derivacion`, `FichaNorma`, `TablaResultados` y
`NivelIA` en `tr-core-extra.jsx`, con un ejemplo de cada uno en `tr-demo.jsx`. Ampliar la
taxonomía de errores de `DetectaError` con los siete tipos de la sección 4. Cablear los
niveles AIAS de D8 en `NivelIA`.

**Criterios de aceptación:**
- [ ] Los cinco componentes aparecen en `tr-base.html` con un ejemplo funcional
- [ ] `Laboratorio` recalcula la gráfica al mover un deslizador, sin recargar
- [ ] `DetectaError` ofrece los siete tipos de error del dominio
- [ ] `NivelIA` pinta los once niveles de la tabla de D8

**Verificación:** abrir `tr-base.html`, mover cada deslizador, plegar cada paso de
`Derivacion`, responder el `DetectaError` de ejemplo y ver la retroalimentación
**Depende de:** T2 · **Alcance: M**

#### Tarea 4 · Verificador adaptado
**Descripción:** Adaptar `verificar.py`: regla 4 a dos lenguajes, regla 2 a la cuota R1–R9
con obligatorios R1/R3/R7/R9, regla 9 ejecutando Python y R, y una **regla 12 nueva**:
ningún capítulo pasa de 400 KB.

**Criterios de aceptación:**
- [ ] Las doce reglas corren sobre `tr-base.html` sin falsos positivos
- [ ] Introducir a mano un `CodeTabs` sin R hace fallar la regla 4
- [ ] Retirar una `Motivacion` hace fallar la regla 5 y nombrar la sección

**Verificación:** `python3 verificar.py` devuelve 0 sobre la plantilla; las dos inyecciones
de fallo devuelven ≠ 0
**Depende de:** T3 · **Alcance: M**

#### Tarea 5 · Datos congelados y entorno
**Descripción:** Descargar y congelar los cinco conjuntos de la sección D3, escribir
`descargar.py`, `MANIFIESTO.md` con SHA-256 y fecha, `environment.yml` e `instalar.R`.

**Criterios de aceptación:**
- [ ] Los cinco CSV existen y su SHA-256 coincide con el manifiesto
- [ ] Las cinco series de `bvc_diario.csv` tienen cobertura continua en 2018-01 → 2025-12, sin huecos mayores a una semana bursátil
- [ ] `conda env create -f entorno/environment.yml` termina sin error e importa `arch`, `QuantLib`, `sklearn`, `cvxpy` y `pyextremes`
- [ ] `Rscript entorno/instalar.R` instala y carga `rugarch`, `quadprog` y `extRemes`

**Verificación:** script de humo que importa las nueve librerías y carga los cinco CSV

⚠️ **Los símbolos hay que confirmarlos en la descarga, no darlos por buenos.** Los emisores
de la BVC aparecen en Yahoo con sufijo `.CL` (`ECOPETROL.CL`, `BCOLOMBIA.CL`,
`GRUPOSURA.CL`, `ISA.CL`), pero el historial de las plazas pequeñas suele venir con huecos,
y **el índice COLCAP no siempre está disponible como índice**. Camino alterno documentado:
usar el ETF `ICOLCAP.CL`, que replica el índice y sí cotiza. Si algún emisor no da historia
utilizable desde 2018, se sustituye por otro de sector distinto —Grupo Argos, Cementos Argos
o Celsia— y se anota el cambio en el manifiesto. Lo que **no** se hace es rellenar huecos por
interpolación: en una serie de rendimientos eso fabrica días de volatilidad cero y contamina
todo lo que estima C2.

**Depende de:** T1 · **Alcance: M**

### ✅ Punto de control A — Fundación · **COMPLETADO 2026-08-07**
- [x] `verificar.py` devuelve 0 sobre la plantilla (con `--sin-cuota`: la plantilla es un
      catálogo con uno de cada tipo, no un capítulo)
- [x] Las doce reglas probadas con inyección de fallos, una a una
- [x] El entorno se crea desde cero: 12 librerías de Python y 9 paquetes de R
- [x] `tr-base.html` abre con doble clic, sin errores en consola
- [x] Cuatro de los cinco conjuntos de datos congelados y con manifiesto
- [ ] `curva_tes.csv` — **pendiente**, bloquea C9 y C10
- [ ] Publicación en Pages — **sin verificar**: no hay remoto en GitHub todavía
- [ ] **Revisión con el usuario antes de seguir**

---

### Fase 1 — Piloto vertical

#### Tarea 6 · Capítulo 4 completo (VaR) — rebanada de referencia · **COMPLETADA 2026-08-08**
**Descripción:** Escribir el capítulo 4 entero: seis secciones con motivación, código en
Python y R ejecutado, tres gráficas, catorce ejercicios cubriendo los nueve tipos, quiz de
diez preguntas y el cuaderno Quarto del taller.

**Criterios de aceptación:**
- [x] Las doce reglas del verificador pasan, incluida `--con-salidas`
- [x] Los nueve tipos R1–R9 están presentes y son contables — `R1:2 R2:3 R3:2 R4:1 R5:1
      R6:1 R7:2 R8:1 R9:2`, 15 ejercicios, la cuota exacta
- [x] Todas las salidas `#>` coinciden con la ejecución real — 14 bloques ejecutados y
      comparados en los dos lenguajes, 0 discrepancias

**Verificación:** `python3 verificar.py --con-salidas` devuelve 0 · recorrido manual
respondiendo cada ejercicio
**Depende de:** Punto de control A · **Alcance: L (dos sesiones)**

**Entregado:** `Material html/04_TDR_Valor_en_riesgo.html` (299 KB, 8 secciones, 7 bloques
de código, 5 gráficas + 2 laboratorios, 15 ejercicios, cuestionario de 10) y
`talleres/TDR-04.qmd` + `talleres/_quarto.yml`.

### ✅ Punto de control B — Piloto · **APROBADO 2026-08-08**
- [x] El capítulo se lee de principio a fin sin fricción — recorrido en el navegador, las
      ocho secciones renderizan y las siete gráficas traen datos; sin errores de consola
- [x] La densidad de fórmulas es la adecuada: ni un formulario ni prosa sin matemáticas —
      seis `Eq` y una `Derivacion` de cuatro pasos en 8 secciones; toda fórmula va seguida
      de la cifra que produce
- [x] Los ejercicios R3 «Audita a la IA» funcionan como se espera y su taxonomía de errores
      es la correcta — comprobado que `lineaCorrecta` apunta a la línea del fallo en los dos
      lenguajes (Python 8 / R 6 y Python 7 / R 5); tipos `medida` y `supuesto`
- [x] El `Laboratorio` aporta y no distrae — el de la sección 3 reproduce exactamente las
      cifras del bloque (4,08 % y 32 617 millones con la muestra completa); el de la 6 va en
      `modo="malla"`
- [x] La convención terminológica de D9 se lee bien en prosa real
- [x] El archivo pesa menos de 400 KB — **299 KB**, de los cuales ~30 KB son datos embebidos
- [x] **Se ajusta la plantilla aquí, antes de escribir catorce capítulos sobre ella** — tres
      defectos corregidos, detallados en el registro de la fase 1

**Revisado y aprobado por el usuario el 2026-08-08**, junto con las tres decisiones de
abajo. La prosa, los ganchos, el criterio de los distractores y la decisión de enseñar las
anomalías del panel en vez de corregirlas quedan como convención de los catorce capítulos
restantes.

### ✅ Tres decisiones resueltas · 2026-08-08

Anotadas y resueltas el mismo día, antes de escribir el capítulo 1. Ninguna de las tres
obligó a recalcular el capítulo 4.

| | Decisión | Resuelta |
|---|---|---|
| **D-A** | Pesos y tamaño del portafolio | **Se mantienen** 30/20/25/25 sobre 800 000 millones. El capítulo 1 los presenta como decisión declarada del curso, con tres criterios explícitos —cuatro sectores separados, tope de concentración del 30 % por emisor, tamaño redondo— y dice que son discutibles y que el capítulo 7 los discute. Cero recálculo |
| **D-B** | `arch` contra `rugarch` | **Opción (a): se declara.** Cada pestaña muestra lo suyo y el capítulo 2 explica que estimar por máxima verosimilitud es un problema numérico. El capítulo 1 ya lo anuncia en la sección 5, junto a la excepción de la simulación |
| **D-C** | Punto de control B | **Aprobado tal cual.** Mismas convenciones para los catorce capítulos restantes |

#### D-A · Los pesos del portafolio son una invención de la fase 1

El plan fija los cuatro emisores (D3) pero **no los pesos ni el tamaño del portafolio**. Al
escribir el capítulo 4 se adoptaron **Ecopetrol 30 %, Banco de Bogotá 20 %, Grupo Sura 25 %,
ISA 25 %, sobre 800 000 millones de pesos**, y con eso quedaron calculadas todas sus cifras.

El capítulo 1 es donde esos números se presentan y se justifican ante el estudiante, así que
conviene que salgan de algo —el régimen de inversión de los fondos de pensiones, un fondo
real, o una decisión declarada del docente— y no de la fase 1. **Si cambian, hay que
recalcular el capítulo 4 completo**: es mecánico —los siete bloques se vuelven a ejecutar y
se copian las salidas— pero son las cifras de la prosa, las gráficas, los ejercicios y el
cuestionario, así que hay que hacerlo antes de escribir nada nuevo encima.

#### D-B · `arch` y `rugarch` no dan el mismo GARCH, y el capítulo 2 tiene que contarlo

Medido el 2026-08-08 sobre las 1 916 sesiones del portafolio, GARCH(1,1) con innovaciones t:

| | `arch` (Python) | `rugarch` (R) |
|---|---|---|
| α | 0,114614 | 0,112637 |
| β | 0,810171 | 0,813622 |
| **α + β** | **0,9248** | **0,9263** |
| ν | 3,9768 | 3,9747 |
| log-verosimilitud | −3150,7748 | −3150,4906 |

No es un defecto: son dos optimizadores que paran en puntos distintos de la misma superficie
de verosimilitud, y el de R encuentra un máximo marginalmente mejor. El problema es de
presentación: **la persistencia —el número que más se cita de un GARCH— redondea a 0,92 en
una pestaña y a 0,93 en la otra**. A dos decimales α y β sí coinciden; a tres no coincide
nada. El ajuste tarda 0,0 s en Python y 0,1 s en R, muy por debajo del límite de 90 s de la
regla 9, así que el tiempo no es el problema.

| Opción | Qué implica |
|---|---|
| **(a) Declararlo**, como la sección 4 del capítulo 4 | Cada pestaña muestra lo suyo y el texto explica que estimar por máxima verosimilitud es un problema numérico y no una lectura de tabla. Es la verdad, y da material para un R3 y para el RA de defender supuestos. **Recomendada.** |
| (b) Reportar a dos decimales | Funciona si se evita imprimir α+β con esa precisión. Esconde algo real. |
| (c) Ajustar en Python y que R lea los coeficientes | Rompe la regla de los dos lenguajes. Descartada. |

Con (a) el material tendría **dos** excepciones declaradas a «las dos pestañas coinciden», y
las dos donde corresponde: simulación (C4 §4) y estimación numérica (C2).

#### D-C · Lo que se cambie del capítulo 4 se repite catorce veces

El punto de control B sigue formalmente abierto. El tono de las motivaciones, la dureza de
los distractores y —sobre todo— la decisión de **enseñar los defectos del panel en vez de
corregirlos** afectan directamente al capítulo 1, que es donde los datos se presentan por
primera vez, y al capítulo 2, que es el más sensible a ellos: excluir el par de febrero de
2025 baja la volatilidad un 5 % y mueve todo el capítulo de volatilidad.

Cambiarlo ahora cuesta una sesión; cambiarlo en el capítulo 8 cuesta cuatro.

#### Nota de mecánica: el HTML de cada capítulo es su propia fuente

Los capítulos 4, 1 y 2 se ensamblaron con guiones de un solo uso a partir de piezas JSX
temporales que **no están en el repositorio**, y no hacen falta: la convención del curso es
que un capítulo se edita directamente en su HTML, y `migrar.py` mantiene al día la librería
y el `App`. Quien busque un `04-cuerpo.jsx` o un `02-cuerpo.jsx` no los va a encontrar, y no
es que se hayan perdido.

Lo que sí conviene repetir de esos guiones es **el método**, que es lo que ha hecho que los
tres capítulos pasen `--con-salidas` a la primera: los bloques de código se escriben y se
ejecutan **fuera** del capítulo, comparando Python contra R línea a línea, y solo entonces
se pegan en el HTML con su `#>`. Escribir primero y verificar después significa un ciclo de
corrección de cifras por bloque.

---

### Fase 2 — Unidad 1 · RA1–RA3

| Tarea | Capítulo | Alcance | Sesiones | Estado |
|---|---|---|---|---|
| 7 | C1 Riesgo, rendimiento y entorno | M | 1 | ✅ **2026-08-08** |
| 8 | C2 Volatilidad (a: EWMA/ARCH · b: GARCH) | L | 2 | ✅ **2026-08-09** |
| 9 | C3 CAPM | M | 1 | ✅ **2026-08-09** |
| 10 | C5 Expected Shortfall | M | 1 | ✅ **2026-08-09** |
| **10-bis** | **Saneamiento de los capítulos 1–5** (4 defectos que el verificador no ve, y un quinto que apareció al hacerlo) | S | 1 | ✅ **completada 2026-08-10** |
| 11 | C6 Backtesting y marco regulatorio | M | 1 | ✅ **2026-08-10** |
| **11-bis** | **Cierre del punto de control C**: `chart-h-380`, las 90 justificaciones y el taller de unidad | M | 1 | ✅ **completada 2026-08-10** |

#### Tarea 7 · Capítulo 1 completo — **COMPLETADA 2026-08-08**

**Criterios de aceptación:**
- [x] Las doce reglas del verificador pasan, incluida `--con-salidas`
- [x] La cuota es exacta — `R1:2 R2:3 R3:2 R4:1 R5:1 R6:1 R7:2 R8:1 R9:2`, 15 ejercicios
- [x] Las salidas `#>` coinciden con la ejecución real — 7 bloques en los dos lenguajes,
      0 discrepancias
- [x] Recorrido en el navegador: siete secciones, tres gráficas, dos laboratorios y el
      cuestionario, sin errores de consola

**Entregado:** `Material html/01_TDR_Riesgo_y_rendimiento.html` (311 KB) y
`talleres/TDR-01.qmd`.

#### Tarea 8 · Capítulo 2 completo (volatilidad) — **COMPLETADA 2026-08-09**

**Criterios de aceptación:**
- [x] Las doce reglas del verificador pasan, incluida `--con-salidas`
- [x] La cuota es exacta — `R1:2 R2:3 R3:2 R4:1 R5:1 R6:1 R7:2 R8:1 R9:2`, 15 ejercicios
- [x] Las salidas `#>` coinciden con la ejecución real — 7 bloques en los dos lenguajes.
      **Tres de ellos declaran cifras distintas en cada pestaña a propósito** (D-B), y la
      regla 9 los admite porque compara cada lenguaje contra su propia salida
- [x] Recorrido en el navegador: nueve secciones, cuatro gráficas, dos laboratorios y el
      cuestionario, sin errores de consola
- [x] Los dos laboratorios reproducen las cifras de los bloques de su sección

**Entregado:** `Material html/02_TDR_Volatilidad.html` (315 KB) y `talleres/TDR-02.qmd`.

#### Tarea 9 · Capítulo 3 completo (CAPM) — **COMPLETADA 2026-08-09**

**Criterios de aceptación:**
- [x] Las doce reglas del verificador pasan, incluida `--con-salidas`
- [x] La cuota es exacta — `R1:2 R2:3 R3:2 R4:1 R5:1 R6:1 R7:2 R8:1 R9:2`, 15 ejercicios
- [x] Las salidas `#>` coinciden con la ejecución real — 7 bloques en los dos lenguajes,
      14 ejecutados y comparados, 0 discrepancias. Aquí **las dos pestañas coinciden en
      todo**: OLS es un cálculo cerrado y no aparece la discrepancia entre paquetes que el
      capítulo 2 tuvo que declarar
- [x] Recorrido en el navegador: siete secciones, tres gráficas, dos laboratorios y el
      cuestionario, sin errores de consola
- [x] Los dos laboratorios reproducen las cifras de los bloques de su sección

**Entregado:** `Material html/03_TDR_CAPM.html` (331 KB) y `talleres/TDR-03.qmd`.

#### Tarea 10 · Capítulo 5 completo (Expected Shortfall) — **COMPLETADA 2026-08-09**

**Criterios de aceptación:**
- [x] Las doce reglas del verificador pasan, incluida `--con-salidas`
- [x] La cuota es exacta — `R1:2 R2:3 R3:2 R4:1 R5:1 R6:1 R7:2 R8:1 R9:2`, 15 ejercicios
- [x] Las salidas `#>` coinciden con la ejecución real — **ocho** bloques en los dos
      lenguajes, 16 ejecutados y comparados. Siete coinciden dígito a dígito; el de
      Montecarlo declara cifras distintas por pestaña a propósito, como el del
      capítulo 4
- [x] Recorrido en el navegador: siete secciones, tres gráficas, dos laboratorios y
      el cuestionario, sin errores de consola
- [x] Los dos laboratorios reproducen las cifras de los bloques de su sección
- [x] Los dos R3 respondidos en pantalla **en los dos lenguajes**, y las dos
      `TablaTraza` completadas: 8/8 celdas cada una

**Entregado:** `Material html/05_TDR_Expected_shortfall.html` (301 KB) y
`talleres/TDR-05.qmd`.

#### Tarea 10-bis · Saneamiento de los capítulos 1–5 — **COMPLETADA 2026-08-10**

Cuatro defectos que la tarea 10 destapó al recorrer el capítulo 5 en el navegador y
que **ninguna de las doce reglas puede ver**. Los cuatro están en material ya dado
por terminado, así que se arreglan aparte y antes de escribir el capítulo 6: si se
dejan para después, cada capítulo nuevo los hereda.

**Decidido el 2026-08-09:** los cuatro entran, y el barajado se arregla **en el
componente**, no repartiendo las opciones a mano en cada capítulo. Cuesta una
re-estampada y una re-verificación de los cinco, y a cambio deja el problema
cerrado para los diez capítulos que faltan.

**1 · `MCQ` y `Quiz` no barajan las opciones.** En los cinco capítulos la respuesta
correcta se declaró siempre en primer lugar —15 de 15 en cada uno—, de modo que se
saca 10 sobre 10 sin leer el enunciado. El capítulo 5 ya reparte las suyas entre las
cuatro posiciones, pero eso es una precaución del autor y no una garantía.

- Se toca **`MCQ`** (`tr-core-base.jsx`, cerca de la línea 294) y **`Quiz`** (misma
  fuente, cerca de la 362). `Comparador` delega en `MCQ` y no hay que tocarlo.
- La permutación tiene que ser **estable**: derivada de un hash del texto de la
  pregunta, no de `Math.random()`. Con azar por carga, el orden salta al recargar y
  el docente no puede decir «la opción b» en clase; con el hash, cada pregunta tiene
  su orden fijo y distinto.
- `correcta` va en el objeto de la opción, así que barajar el arreglo no rompe la
  calificación. Ojo con `justificacion`, que también viaja en el objeto.

**2 · `Accordion` recibe `titulo` y `contenido`.** El capítulo 4 le pasa `title` y
`content` en su sección 1: las tres filas de «las tres preguntas que el VaR no
responde» están **vacías**. React no avisa de una propiedad que no existe.

**3 · `chart-h-400` no está definida en ninguna parte** y se usa **13 veces**
(C1 ×4, C2 ×3, C3 ×2, C4 ×4). Plotly cae en su altura por omisión y la gráfica sale
más alta de lo que el autor escribió. La clase va en el `<style>` de la cabecera,
que **`migrar.py` no estampa**: hay que añadirla en `_plantilla/tr-head.html` (junto
a `.chart-h-420`, línea 173) **y a mano en los cinco capítulos**, que la tienen en la
misma línea 173. El capítulo 5 no la usa, pero conviene que su cabecera quede igual.

**4 · Los `<title>` estáticos están mal en dos capítulos.** El del 3 es el del 1
—se copió el archivo y no se cambió— y el del 4 sigue diciendo «Plantilla base». El
`App` los deriva de `CONFIG` al abrir, así que en pantalla no se nota; lo que ve mal
es un rastreador, un marcador del navegador o una página guardada. Lo mismo con la
`<meta name="description">`.

**5 · Ningún `MCQ` de los cinco capítulos define `justificacion`** —el defecto
apareció al recorrer el capítulo 5 después de arreglar los cuatro anteriores—, y
el componente pintaba el recuadro igual: rótulo «**Explicación:**» en negrita y
nada detrás. Son 25 sitios (cuatro `MCQ` sueltos y el del `Comparador`, por cinco
capítulos). El `Quiz` ya guardaba su equivalente con `q.justificacion &&`; el
`MCQ` no. Entra en la tarea porque es exactamente el mismo tipo de defecto: se ve
abriendo el capítulo y ninguna regla lo mira.

**Criterios de aceptación:**
- [x] `ensamblar.py` → `migrar.py` → `verificar.py --con-salidas` en verde sobre los
      **cinco** capítulos, con el SHA de TR-CORE nuevo y el mismo en los cinco —
      `1782905c90e0a6b8…`
- [x] En un capítulo cualquiera, responder el cuestionario eligiendo siempre la
      primera opción da **menos de 10 sobre 10** — comprobado en los cinco:
      C1 **1/10**, C2 **0/10**, C3 **0/10**, C4 **1/10**, C5 **2/10**
- [x] El orden de las opciones **no cambia** al recargar la página ni al navegar
      entre secciones y volver
- [x] El acordeón de la sección 1 del capítulo 4 muestra sus tres títulos — y el
      **capítulo 1 tenía el mismo defecto**, en las tres filas de su sección 5
- [x] Las trece gráficas con `chart-h-400` miden 400 px de alto en el navegador —
      13/13, con el SVG de Plotly siguiendo a 400
- [x] Los cinco `<title>` y las cinco descripciones corresponden a su capítulo
- [x] Ningún `MCQ` muestra el rótulo «Explicación:» vacío

⚠️ **La regla 1 compara el SHA-256 de TR-CORE contra la plantilla.** Tocar
`tr-core-base.jsx` obliga a regenerar y re-estampar; un capítulo sin re-estampar
falla la comprobación 1, que es exactamente para lo que existe.

⚠️ **Consecuencia para los diez capítulos que faltan:** al escribir un `MCQ` hay
que darle `justificacion` a la opción correcta. Los cinco primeros no la tienen y
ahora, con la guarda, simplemente no muestran explicación; era eso o un recuadro
vacío. Rellenarlas en los cinco es trabajo de autoría, no de saneamiento, y queda
como pendiente separado.

#### Tarea 11 · Capítulo 6 completo (backtesting) — **COMPLETADA 2026-08-10**

**Criterios de aceptación:**
- [x] Las doce reglas del verificador pasan, incluida `--con-salidas`
- [x] La cuota es exacta — `R1:2 R2:3 R3:2 R4:1 R5:1 R6:1 R7:2 R8:1 R9:2`, 15 ejercicios
- [x] Las salidas `#>` coinciden con la ejecución real — **seis** bloques en los
      dos lenguajes, 12 ejecutados y comparados, los doce dígito a dígito. No hay
      ninguna excepción de dos pestañas: los valores críticos de Acerbi-Székely,
      que exigen simulación, van literales y declarados
- [x] Recorrido en el navegador: nueve secciones, tres gráficas, dos laboratorios
      y el cuestionario, sin errores de consola
- [x] Los dos laboratorios reproducen las cifras de los bloques de su sección —
      el del backtest da 26 excepciones, LR_uc 4,5175, LR_ind 17,6911 y LR_cc
      22,2086, que es exactamente lo que declara el bloque
- [x] Los dos R3 respondidos en pantalla **en los dos lenguajes**, y las dos
      `TablaTraza` completadas: 8/8 celdas cada una, calculadas desde los valores
      redondeados que se muestran
- [x] El R6 resuelto en pantalla: 4 de 4

**Entregado:** `Material html/06_TDR_Backtesting.html` (324 KB) y
`talleres/TDR-06.qmd`.

#### Tarea 11-bis · Cierre del punto de control C — **COMPLETADA 2026-08-10**

**Criterios de aceptación:**
- [x] Ninguna clase `chart-h-*` sin definir — barrido de los seis capítulos contra las
      cuatro que el CSS declara; `chart-h-380` corregida y medida en el navegador: los dos
      elementos del capítulo 2 pasan de 450 px a 400
- [x] Ninguna pregunta sin explicación — **90 justificaciones** escritas: 4 `MCQ` + 1
      `Comparador` + 10 `Quiz` por capítulo, las quince en cada uno
- [x] Comprobado en el navegador: los seis capítulos renderizan, el cuestionario integrador
      califica 10/10 y muestra sus diez explicaciones en los seis, y los `MCQ` muestran la
      suya. Sin errores de consola
- [x] Las doce reglas siguen en verde con `--con-salidas` después de los tres cambios
- [x] `talleres/TDR-U1.qmd` escrito y con sus bloques ejecutables corridos con `Rscript`:
      1 916 sesiones, σ 1,5764 %, VaR 99 % 4,077 %, 26 excepciones, LR~uc~ 4,5175, p 0,0336
- [x] D-D ratificada

**Entregado:** los seis capítulos actualizados y `talleres/TDR-U1.qmd`.

→ **Punto de control C aprobado** (criterios y evidencia en la sección 7)

---

### Fase 3 — Unidad 2 · RA4–RA6

| Tarea | Capítulo | Alcance | Sesiones |
|---|---|---|---|
| 12 | C7 Portafolio y frontera eficiente | M-L | 2 |
| 13 | C8 Optimización CVaR | M | 1 |
| 14 | C9 Bonos, tasas y curvas | M | 1 |
| 15 | C10 Duración, convexidad y QuantLib | M-L | 1 |

→ **Punto de control D** (definido en la sección 7)

---

### Fase 4 — Unidad 3 · RA7–RA9

| Tarea | Capítulo | Alcance | Sesiones |
|---|---|---|---|
| 16 | C11 Derivados y binomial | M-L | 1 |
| 17 | C12 Black-Scholes y Montecarlo (a · b) | L | 2 |
| 18 | C13 Crédito con ML (a · b) | L | 2 |
| 19 | C14 Validación e interpretabilidad | M-L | 1 |
| 20 | C15 EVT, cópulas y riesgo operativo | M-L | 1 |

→ **Punto de control E** (definido en la sección 7)

---

### Fase 5 — Integración

#### Tarea 21 · Portal índice y navegación
Portal `index.html` con las tres unidades, los quince capítulos, sus horas, sus RA y su nivel
AIAS. Enlaces entre capítulos consecutivos. · **Alcance: S**

#### Tarea 22 · Cuadernos Quarto
Los quince `.qmd` con el taller ejecutable de cada capítulo, **más los tres talleres de
unidad** —`TDR-U1.qmd` ya escrito, y sus equivalentes de la U2 y la U3, que son los
instrumentos calificados del syllabus—, `_quarto.yml`, y una pasada de `quarto render` que
no falle. · **Alcance: M**

⚠️ **Quarto no está instalado** y ningún `.qmd` se ha renderizado nunca. `brew install
--cask quarto` exige `sudo` con terminal. Hasta entonces, los bloques ejecutables se
comprueban a mano con `Rscript` desde `talleres/`.

#### Tarea 23 · Pase final
`verificar.py --con-salidas` sobre los quince, auditoría de contraste resuelta o justificada
con `contraste-ok`, `README.md` de autoría escrito, publicación en Pages. · **Alcance: S**

### ✅ Punto de control final
- [ ] Las doce reglas pasan sobre los quince capítulos
- [ ] Ningún aviso de contraste sin justificar
- [ ] El sitio publicado abre y navega
- [ ] Cada contenido del syllabus tiene su sección, y cada sección su contenido del syllabus

---

## 9. Riesgos y mitigaciones

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Los datos de mercado cambian y las salidas `#>` envejecen | **Alto** | D3: instantáneas congeladas con SHA-256. Es la razón de ser de esa decisión |
| Los símbolos de la BVC no dan historia utilizable desde 2018 | Medio | Aviso de la tarea 5: emisor sustituto de sector distinto, ETF `ICOLCAP.CL` para el índice, y prohibición explícita de interpolar huecos |
| QuantLib no instala en la máquina del estudiante | **Alto** | conda-forge en vez de pip (D5); C10 trae además la implementación a mano, que no depende de QuantLib |
| Un capítulo pasa de 400 KB y el navegador se arrastra | Medio | Regla 12; series decimadas a 1500 puntos. C2 y C13 son los candidatos, por número de gráficas |
| `Laboratorio` intenta ajustar modelos en el navegador | Medio | Restricción declarada en la sección 5: solo aritmética; lo demás se precomputa sobre una malla |
| Los R3 se vuelven adivinanzas de errata en vez de auditorías | **Alto** | Cada R3 exige **clasificar** el error con la taxonomía de siete tipos, no solo señalarlo; y la explicación cifra la consecuencia en pesos |
| La densidad de fórmulas ahoga la lectura | Medio | `Derivacion` con pasos plegables; el punto de control B es donde se calibra |
| XGBoost y SHAP pesan y complican el entorno | Bajo | `HistGradientBoostingClassifier` de scikit-learn como camino alterno documentado en C13 |
| Quince capítulos son mucho trabajo y se abandona a mitad | **Alto** | El orden de fases entrega valor por unidad: al terminar la fase 2 hay un curso utilizable para la unidad 1 completa |
| La regla 9 tarda demasiado sobre quince capítulos en dos lenguajes | Medio | Se corre por capítulo durante el desarrollo y completa solo en los puntos de control |

---

## 10. Supuestos declarados

1. **El syllabus es la fuente de verdad del contenido.** Ningún capítulo introduce tema que
   el syllabus no liste, y ningún contenido listado queda sin capítulo. La sección 7 trae la
   trazabilidad contenido a contenido.
2. **Las horas por capítulo suman las del syllabus** dentro de cada unidad: 24, 16 y 24. La
   tabla de cuadre de la sección 7 lo hace explícito.
3. **El material es de estudio autónomo**, no la clase. Prepara los foros, los talleres y el
   proyecto; no los sustituye.
4. **El estudiante llega con Probabilidad, Inferencia y Cálculo Numérico**, como declara el
   syllabus, y con R como lengua materna.
5. **Cópulas es opcional**, tal como lo marca el syllabus, y va como sección plegable dentro
   de C15: si no se alcanza, no rompe la secuencia.
6. **Riesgo operativo, SARL y LCR/NSFR son lectura autónoma**, según el syllabus, y van como
   `FichaNorma` dentro de C10 y C15, no como capítulos propios.
7. **Sin banco Moodle ni guía docente** en este plan (ver sección 1).

---

## 11. Decisiones tomadas

Las cinco preguntas abiertas de la revisión 1, resueltas el 2026-08-07.

| # | Pregunta | Decisión |
|---|---|---|
| **P1** | Portafolio del hilo conductor | ✅ Ecopetrol, Bancolombia, Grupo Sura e ISA + COLCAP. Detalle en **D3** |
| **P2** | Serie de cola pesada para EVT | ✅ Incendios daneses (`CASdatasets::danishuni`), con su origen declarado en C15. Detalle en **D3** |
| **P3** | Fusionar o partir ES y backtesting | ✅ **Partir.** El curso pasa de 14 a 15 capítulos: C5 *Expected Shortfall* (3 h) y C6 *Backtesting* (3 h). Renumeración del 6 en adelante ya aplicada en todo el documento |
| **P4** | Niveles AIAS | ✅ Declarados **por tipo de ejercicio**, no por capítulo. Tabla en **D8** |
| **P5** | Idioma de los términos técnicos | ✅ Término en inglés con traducción entre paréntesis la primera vez de cada capítulo. Excepciones en **D9** |

**Qué ganó el curso al partir el capítulo 5.** Eran once secciones y 6 h en un archivo, el
candidato más claro a incumplir la regla de peso y a agotar al lector. Partido, cada mitad
tiene una tesis propia: C5 sostiene que **el VaR no es una medida coherente y el ES sí**, y
C6 que **una medida sin validación no es una medida**. Además deja el backtesting como
capítulo con entidad propia, que es lo que corresponde a un resultado de aprendizaje entero
del syllabus —el RA2— y a un instrumento de evaluación que lo exige explícitamente.

---

## 12. Resumen de esfuerzo

| Fase | Tareas | Sesiones |
|---|---|---|
| 0 · Fundación | 1–5 | 5 |
| 1 · Piloto (C4) | 6 | 2 |
| 2 · Unidad 1 | 7–11 | 6 |
| 3 · Unidad 2 | 12–15 | 5 |
| 4 · Unidad 3 | 16–20 | 7 |
| 5 · Integración | 21–23 | 3 |
| **Total** | **23 tareas** | **~28 sesiones** |

Una «sesión» es un bloque de trabajo enfocado que termina con el verificador en verde. Los
capítulos marcados **L** llevan dos.

---

## 13. Registro de ejecución

### Fase 0 — Fundación · 2026-08-07

Las cinco tareas completadas. Lo que se descubrió por el camino y no estaba previsto:

**T2 · La plantilla ya no depende de un capítulo.** El `ensamblar.py` de Lógica de
Programación extraía el `head` y media librería del capítulo 1 de su propio curso, así que
no se podía generar la plantilla sin tener antes un capítulo escrito. Aquí las cuatro
piezas son archivos fuente con nombre propio y la plantilla se regenera desde cero.

**T3 · Dos defectos heredados, corregidos.**

- `.prose-lp` no se aplicaba en ninguna parte: los `h3` y `h4` de los capítulos salían sin
  estilo y nadie lo había notado. Ahora se llama `.prose-tr` y se aplica **una vez en el
  `App`**, para que ninguna sección pueda olvidarlo. Sus reglas de tabla se acotaron con
  `:not(.tabla-componente)` — sin eso pintaban de lila la cabecera navy de
  `TablaResultados`, cuyo texto es blanco: blanco sobre casi blanco, y sin ningún error.
- **`np.random.default_rng(2026)` y `set.seed(2026)` no dan la misma muestra.** Un bloque
  que simule muestra una cifra en la pestaña de Python y otra en la de R para el mismo
  cálculo. Queda como convención del curso: los datos van literales o del CSV congelado, y
  donde el capítulo simule de verdad —Montecarlo en el 4 y en el 12— hay que decirlo.

**T4 · Dos huecos del verificador heredado.** La regla de CodeTabs solo miraba constantes
con nombre, así que un objeto escrito en el sitio se saltaba la comprobación entera. Y la
regla de la motivación solo reconocía `() => (`; una sección con gráfica necesita `() => {`
para llamar a `usePlotly` antes del `return`, es decir, casi todas las de este curso se
habrían reportado como «no se encontró su definición».

**T5 · Los datos obligaron a tres cambios.** Bancolombia y el índice COLCAP no existen en
Yahoo; `arch`, `quantlib` y `Rglpk` no son los nombres de los paquetes; y la instantánea de
precios no es byte-estable entre descargas. Todo detallado en D3 y D5.

**Lo que queda bloqueado:** `curva_tes.csv`. El Banco de la República publica la curva cero
cupón de los TES pero no por un extremo que un guion pueda invocar. Hay que bajarla a mano.
Los capítulos 9 y 10 dependen de ella; los otros trece, no.

---

### Fase 1 — Piloto: capítulo 4 (VaR) · 2026-08-08

Tarea 6 completada. Doce reglas en verde a la primera pasada de `--con-salidas`, que era la
apuesta del método: **los siete bloques se escribieron y se ejecutaron fuera del capítulo
antes de entrar en él**, comparando la salida de Python con la de R línea a línea. Escribir
primero y verificar después habría significado catorce ciclos de corrección de cifras.

**Los datos tienen dos defectos, y no se corrigen: se enseñan.** Al construir la sección 3
apareció que `bvc_diario.csv` trae 101 ruedas de 1 916 en las que ninguno de los cuatro
precios se mueve, y un par de ruedas —19 y 20 de febrero de 2025— en las que los cuatro
emisores caen entre 10 % y 20 % y recuperan lo mismo al día siguiente **mientras el ETF que
los replica sube**. Lo segundo es una cotización defectuosa de la fuente, y el propio
contraste con el índice es el diagnóstico que lo demuestra.

La decisión fue conservar el panel y declararlo, por dos razones. La primera es que limpiar
en silencio enseña que los datos llegan limpios, que es la creencia que más dinero cuesta en
riesgo. La segunda es que el episodio resultó ser el mejor material del capítulo: el mismo
dato malo mueve el VaR histórico de la muestra completa cuatro centésimas de punto, la
volatilidad un 5 % y el VaR de la ventana de 250 ruedas un 10 %. Tres estimadores, tres
sensibilidades, un solo defecto. Queda anotado en `datos/MANIFIESTO.md` y en la plantilla de
`datos/descargar.py`, para que sobreviva a la próxima descarga.

**Tres defectos de la plantilla, corregidos aquí y no en el capítulo 15.**

- **Faltaban diez de los iconos de la barra lateral.** `tr-demo.jsx` ya usaba `Layers`,
  `Bug` y `Table`, que no existían en `Icons`. No fallaba nada: `renderIcon` devuelve `null`
  y `SectionHeader` lo tolera, así que el icono simplemente no se dibujaba. Añadidos diez
  que cubren los quince capítulos.
- **El `<head>` no lo estampa `migrar.py`.** Un capítulo nacido de copiar `tr-base.html`
  arrastraba su `<title>` y su descripción: la pestaña del navegador decía «Plantilla base»
  y eso es lo que habría indexado GitHub Pages. Ahora el `App` los deriva de `CONFIG`, que
  sí es lo primero que cambia cada capítulo, así que ninguno puede olvidarlo.
- **Las gráficas se desbordaban por la derecha.** Plotly fija el ancho al crear la figura y
  su `responsive: true` solo escucha el `resize` de la ventana. Dentro de la tarjeta de un
  `Laboratorio` la figura salía 44 px más ancha que su contenedor, sin ningún error.
  `ChartFrame` observa ahora su contenedor con un `ResizeObserver`.

**Lo que la sección 4 hace a propósito y hay que saber antes de copiarla.** Es el único
bloque del material cuyas dos pestañas declaran cifras distintas —3,626 % en Python y
3,642 % en R— porque simula de verdad y los generadores no son el mismo. La regla 9 lo
admite sin problema, porque compara cada lenguaje contra su propia salida; lo que no admite
el material es que eso ocurra sin decirlo. Aquí la distancia entre las dos pestañas **es** el
contenido: mide el error de Montecarlo y justifica el tipo de error «resultado sin
incertidumbre» de la taxonomía R3.

**Lo que no se pudo verificar:** `quarto render` sobre `talleres/TDR-04.qmd`. Quarto no está
instalado en esta máquina. Los dos bloques que el cuaderno ejecuta sí se corrieron a mano con
`Rscript` desde `talleres/` y dan las cifras del capítulo; el resto son andamios con
`#| eval: false`. La pasada de `quarto render` sigue siendo criterio de aceptación de la
tarea 22.

---

### Fase 2 — Tarea 7: capítulo 1 · 2026-08-08

Doce reglas en verde a la primera pasada de `--con-salidas`, con el mismo método de la
fase 1: los siete bloques se escribieron y se ejecutaron fuera del capítulo antes de entrar
en él, comparando Python contra R línea a línea. Las tres decisiones se resolvieron antes
de escribir nada, así que el capítulo 4 no hubo que tocarlo.

**El hallazgo del capítulo: los pesos suman aritméticos y el tiempo suma logarítmicos.**
El capítulo 1 es el de la agregación, así que no podía esconder que el resto del curso
construye el rendimiento del portafolio como `w'r_log`, que **no** es el rendimiento
logarítmico del portafolio —ese es `ln(1 + w'R_arit)`—. Las dos propiedades no caben en la
misma magnitud: la aditividad temporal es de los logarítmicos y la linealidad en los pesos
es de los aritméticos. Se midió el costo de la convención sobre el panel y se declaró en
una `TablaResultados`: brecha media −1,643 pb, brecha máxima de una rueda 103,95 pb,
volatilidad 1,5739 % contra 1,5764 %, y **cuantil al 1 % de −3,9553 % contra −4,0771 %**.
Esa última línea es el 4,077 % con el que abre el capítulo 4: ahora se sabe de dónde sale
y qué contiene. La convención se conserva porque yerra por el lado conservador y porque
sin ella no hay escalamiento temporal, pero queda cuantificada en vez de tácita.

**Un defecto que el verificador no puede ver, y que dejó el capítulo en blanco.** La
librería nueva del capítulo traía `Math.exp(-((x - mu) / sd) ** 2 / 2)`, que es un error de
sintaxis de JavaScript —`-a ** 2` es ilegal, hay que parentizar—. Babel abortó el script
entero, la página quedó en blanco y **`verificar.py` devolvió OK**: las doce reglas son
análisis estático de texto, no un parser de JSX. Se cazó al abrir el capítulo en el
navegador, que por eso es parte del ciclo y no un extra. Conviene decidir si la regla 13
—pasar el JSX por un parser— compensa la dependencia de Node que exige; entretanto, **el
paso por el navegador es obligatorio antes de dar un capítulo por terminado**.

**Una corrección que solo se ve mirando la gráfica.** El pie del histograma decía que la
normal es más alta en el centro. Es al revés: las barras observadas llegan a 208 y la
normal a 80. El patrón completo son tres cosas a la vez —pico, hombros delgados (74 ruedas
por encima de 2σ donde se esperaban 87) y colas gruesas—, y así quedó redactado.

**Dos laboratorios, los dos sin una sola cifra precomputada.** El de la sección 3 dibuja
la nube de ventanas de h ruedas —acumulado real contra suma de aritméticos— y el de la 4,
la curtosis rodante. Los dos calculan en el navegador sobre la misma serie `RP` que embebe
el capítulo 4, y sus lecturas se contrastaron contra Python: −47,58 % / −61,04 % / 13,45 pp
a h = 20, y mínimo −0,08 / máximo 48,33 / último 39,64 con ventana de 250. Coinciden.

**Una dependencia nueva, declarada:** `digest`, para que el bloque de la sección 5 compruebe
el SHA-256 de las instantáneas contra el manifiesto. R base no trae SHA-256. Añadida a
`entorno/instalar.R` con su motivo.

**Lo que no se pudo verificar:** `quarto render` sobre `talleres/TDR-01.qmd`. Quarto sigue
sin estar instalado en esta máquina. El bloque ejecutable de la parte 1 se corrió a mano
con `Rscript` desde `talleres/` y da las cifras del capítulo; el resto son andamios con
`#| eval: false`.

---

### Fase 2 — Tarea 8: capítulo 2 · 2026-08-09

Nueve secciones, siete bloques ejecutados en los dos lenguajes, cuatro gráficas y dos
laboratorios. Doce reglas en verde a la primera pasada de `--con-salidas`.

**D-B aplicada, y midió más de lo que el plan anotaba.** La discrepancia entre `arch` y
`rugarch` se reprodujo exacta —α 0,114614 contra 0,112637, persistencia 0,9248 contra
0,9263, log-verosimilitud −3150,7748 contra −3150,4906— y al escribir la sección aparecieron
**dos fuentes distintas de diferencia, no una**:

- **El optimizador.** Sobre la serie de σ condicional, la diferencia media es de 0,0035
  puntos porcentuales, la correlación es 0,9998 y en la última rueda —la que se reporta— una
  dice 1,2922 % y la otra 1,2923 %. Los parámetros difieren en la tercera cifra; lo que se
  decide con el modelo, no.
- **La inicialización, que el plan no tenía anotada y es mucho mayor.** En la primera rueda
  las dos σ difieren un 21 % —1,3048 % contra 1,5761 %— porque los dos paquetes arrancan la
  recursión con convenciones distintas. La diferencia se apaga en unas veinte ruedas. Quien
  compare paquetes sobre una muestra corta que empiece ahí estará midiendo sobre todo eso.

Las dos cosas están en el capítulo, y el R8 de la sección 7 pide separarlas: la pregunta
«¿qué persistencia lleva a la ficha?» está mal planteada a propósito, y darse cuenta es
media respuesta.

**Los dos laboratorios se cazaron mutuamente con los bloques, y uno estaba mal.** El de la
sección 7 arrancaba la recursión del pronóstico en la σ condicional de la última rueda
(1,2922 %) en vez de en el pronóstico a un día (1,3751 %), que es el que usa el rendimiento
observado. Devolvía 1,4057 % a diez ruedas donde el bloque declara 1,4370 %, y su propia
`nota` afirmaba que coincidían. Corregido: ahora devuelve 1,4369 %, a una diezmilésima, y la
nota explica que el resto es el redondeo del deslizador.

**Un desempate de redondeo, declarado en vez de escondido.** El laboratorio de EWMA muestra
1,3326 % donde el bloque declara 1,3325 %. Los dos calculan 1,33255: la serie embebida está
redondeada a cuatro decimales y el quinto decide hacia qué lado cae. Queda dicho en la nota
del laboratorio, porque perseguir esa discrepancia cuesta una tarde.

**Lo que el navegador volvió a cazar y el verificador no.** Nada de sintaxis esta vez —la
lección del capítulo 1 sirvió— pero sí el laboratorio del pronóstico, que pasaba las doce
reglas con una cifra que contradecía a su propio bloque. **La regla 9 audita los bloques de
código, no los laboratorios**, y esa es una segunda zona ciega del verificador que conviene
tener presente: lo que calcula el navegador solo lo comprueba quien lo abra.

**Una decisión de peso que valió la pena.** EWMA y ventana móvil son aritmética, así que no
se precomputan: los laboratorios las rehacen en el navegador desde `RP`. Solo la σ del GARCH
llega precomputada, y decimada de dos en dos. El capítulo pesa 315 KB con cuatro gráficas y
dos laboratorios, cómodamente por debajo del límite de 400 KB.

**Lo que no se pudo verificar:** `quarto render` sobre `talleres/TDR-02.qmd`. Quarto sigue
sin estar instalado. El bloque ejecutable de la parte 1 se corrió a mano con `Rscript` y da
las cifras del capítulo.

---

### Fase 2 — Tarea 9: capítulo 3 · 2026-08-09

Siete secciones, siete bloques ejecutados en los dos lenguajes, tres gráficas y dos
laboratorios. Doce reglas en verde, y `--con-salidas` con cero discrepancias: los catorce
bloques —siete por lenguaje— se escribieron y se ejecutaron fuera del capítulo antes de
entrar en él, con el mismo método de las tres tareas anteriores.

**El hallazgo del capítulo: la beta del portafolio contra su propio índice es 0,68, y no
puede ser.** Los cuatro emisores del fondo están dentro del ETF ICOLCAP, así que la beta
tenía que salir cerca de uno; la regresión da 0,6779 con un error estándar de 0,0228, es
decir el uno a catorce errores estándar. La explicación no es teórica sino de
microestructura, y el panel la trae medida: Banco de Bogotá no cambia de precio el 16,2 %
de las ruedas y Grupo Sura el 15,1 %, mientras el ETF solo el 4,9 %. Cuando el mercado se
mueve y la acción no se negocia, el movimiento aparece al día siguiente y la covarianza
contemporánea lo pierde. Medida cada dos ruedas la beta sube a 0,8368; cada semana, a
0,9486; cada mes, a 0,9984. Es el sesgo de negociación no simultánea que Dimson formalizó
en 1979, y en este mercado se lleva un tercio de la exposición.

**Es la tercera consecuencia de un defecto que el capítulo 4 ya había declarado.** Las
ruedas sin variación estaban anotadas desde la fase 1 como una anomalía del panel; hasta
ahora no se había medido qué estropean. Con esto el cuadro queda completo, y ninguna
limpieza lo habría resuelto: excluir el par defectuoso de febrero de 2025 mueve el VaR
histórico un 1 %, la volatilidad un 5 %, el VaR de la ventana corta un 10 % y la beta un
0,5 % — pero el otro defecto, el de las ruedas quietas, no toca a los tres primeros y sí
se lleva un tercio de la cuarta. No hay un dato limpio: hay estimadores sensibles a cosas
distintas.

**Un segundo contraste que el capítulo aprovecha: la beta se estima bien y la prima no.**
Con los mismos 1 916 datos, el intervalo de confianza de la beta del portafolio mide 0,09
de ancho y el de la prima de mercado, 29,5 puntos porcentuales — la prima estimada es
1,34 % anual con un error estándar de 7,53. Harían falta **431 años** para conocerla con un
error de un punto. La beta es un cociente de segundos momentos y la prima un primer
momento, y esa diferencia explica por qué el CAPM se usa a diario para medir riesgo y casi
nunca para predecir rendimientos.

#### D-D · La tasa libre de riesgo del curso es 7,00 % E.A. · **RATIFICADA 2026-08-10**

**Ratificada tal cual en el punto de control C**, sin recálculo. El 7,00 % efectivo anual
queda como decisión declarada del curso para C3 y para todo lo que venga: **C7** (CML y
máximo Sharpe), **C11** y **C12** (descuento y valoración de derivados). La convención va
con ella: el 7,00 % es efectivo, el curso anualiza logarítmicos por 252 y la misma tasa vale
**6,7667 %** en esa convención; los capítulos que la usen declaran cuál de las dos aplican.
Cuando exista `curva_tes.csv` se sustituye por el TES del plazo que corresponda, y esa
sustitución es una revisión de D-D, no un cambio silencioso.

*(Lo de abajo es la declaración original del 2026-08-09, que se conserva por el razonamiento
y por la trampa de convención que documenta.)*

Decisión nueva, del mismo tipo que D-A y tomada con el mismo criterio: el CAPM la necesita,
`curva_tes.csv` sigue pendiente, y no había ninguna en el plan. Se declara **7,00 % efectivo
anual** —del orden de la tasa de política del Banco de la República promediada sobre
2018–2025— presentada en la portada como decisión del curso y no como estimación. Es
revisable a coste bajo: la usan dos bloques y una gráfica, y el propio capítulo demuestra
que la conclusión no depende de ella, porque moverla dos puntos desplaza la prima mucho
menos de lo que su error estándar la mueve por azar. Cuando exista `curva_tes.csv` se
sustituye por el TES del plazo que corresponda. **Afecta a C7 (Sharpe) y a C11–C12
(descuento), así que conviene ratificarla o cambiarla antes de la fase 3.**

**Una trampa de convención que costó cuadrar dos veces.** El 7,00 % es *efectivo*, y el
curso anualiza rendimientos logarítmicos multiplicando por 252, con lo que la misma tasa
vale 6,7667 %. Mezclarlas movía el rendimiento exigido de ISA de 7,59 % a 7,68 %. Todas las
cifras de la sección 3 van en la convención logarítmica, la conversión está explicada en una
`Box` y el R1 de esa sección la usa como parte del ejercicio — es la brecha entre
aritméticos y logarítmicos del capítulo 1, aplicada ahora a una tasa.

**Lo que el navegador volvió a cazar y el verificador no.** Cuatro cosas, y ninguna era
sintaxis:

- **El R3 de la sección 5 apuntaba a la línea equivocada en Python.** El comentario que
  contiene la conclusión falsa ocupaba tres líneas y `lineaCorrecta` señalaba la primera,
  que es cierta. En R la equivalencia caía bien por casualidad. Los dos casos R3 se
  reescribieron con **una sola línea de conclusión**, inequívoca en los dos lenguajes, y se
  comprobaron respondiéndolos en pantalla. La regla 6 exige que `lineaCorrecta` sea un
  objeto por lenguaje, pero no puede saber si apunta al sitio correcto.
- **El R1 de la beta a mano no era reproducible a mano.** Los productos declarados salían
  del cálculo exacto mientras que los factores mostrados iban redondeados a cuatro
  decimales, así que un estudiante que multiplicara lo que ve obtenía 0,0730 donde la tabla
  esperaba 0,0729 — en cuatro de las seis filas. Rehecha entera desde los valores
  redondeados: ahora cada casilla es exactamente el producto de los dos números que tiene al
  lado y la beta final es 4,3091.
- **La curva de la beta rodante no llegaba al final de la muestra.** Al dibujar de cuatro en
  cuatro ruedas hacia adelante, el último punto era el de la rueda 1 914 y mostraba 1,0923
  para Ecopetrol donde el bloque declara 0,9718. Se recorre ahora desde el final hacia atrás.
  Por lo mismo, la `lectura` del laboratorio recorre **todas** las ventanas y no una de cada
  cuatro: con el muestreo del trazo declaraba un mínimo de 0,4058 contra el 0,3977 del
  bloque.
- **Dos cifras de gráfica que contradecían a su bloque por diezmilésimas**: la varianza
  residual, que se derivaba de σ² − sistemática con la σ ya redondeada, y la SML, que no
  pasaba exactamente por el punto del mercado. Las dos van ahora escritas con la cifra del
  bloque.

Ninguna de las cuatro habría fallado ninguna de las doce reglas. **La zona ciega del
verificador no es solo el JavaScript: es todo lo que el navegador calcula.**

**Y una de tipografía, que solo se ve mirando.** `σ̄` y `ρ̄` escritos con macrón combinante
se renderizan mal fuera de MathJax —en pantalla se leían como «ō» y «p̄»—. Fuera de las
fórmulas se dice «volatilidad media» y «correlación media» con todas las letras.

**Lo que no se pudo verificar:** `quarto render` sobre `talleres/TDR-03.qmd`. Quarto sigue
sin estar instalado. El bloque ejecutable de la parte 1 se corrió a mano con `Rscript` desde
`talleres/` y da las cifras del capítulo: 1 916 sesiones, beta 0,6779, R² 0,3167.

---

### Fase 2 — Tarea 10: capítulo 5 · 2026-08-09

Siete secciones, **ocho** bloques ejecutados en los dos lenguajes, tres gráficas y
dos laboratorios. Doce reglas en verde, y `--con-salidas` con cero discrepancias:
los dieciséis bloques se escribieron y se ejecutaron fuera del capítulo antes de
entrar en él, con el mismo método de las cuatro tareas anteriores.

**El hallazgo del capítulo: la calibración del 97,5 % es exacta, y por eso mide.**
El Comité de Basilea eligió ese nivel para que el ES coincidiera con el VaR al
99 % **bajo normalidad**, de modo que cambiar de medida no fuera de paso una
subida encubierta de capital. Sobre este portafolio la coincidencia se reproduce
con una precisión que no se esperaba: 3,655 % contra 3,637 %, medio punto de
diferencia relativa. La consecuencia es que **toda la distancia entre las dos
medidas sobre una cartera real es exactamente la parte de la cola que la normal no
ve**: con una t de 4,23 grados de libertad el cambio cuesta un 6,1 % y con la
distribución empírica un 16,0 %, 5 203 millones. El cambio de medida funciona como
un detector de colas pesadas incorporado a la norma, y esa lectura —que no estaba
en el plan— es la tesis de la sección 4.

**Un segundo contraste que el capítulo aprovecha: el ES delata la curtosis siete
puntos antes que el VaR.** Dibujadas las cuatro curvas frente a α, el ES histórico
supera al normal desde el **91 %** y el VaR histórico no lo hace hasta el **98 %**.
Promediar la cola acumula el exceso de masa; leer su borde tiene que esperar a que
el borde entre en la zona gruesa. Es la misma diferencia que explica por qué el
ES/VaR de este panel es 1,60 y el de una normal, 1,15.

**Una convención de estimación, declarada y cifrada — del mismo tipo que la de
agregación del capítulo 1.** El curso usa el promedio simple de las ruedas que
exceden el VaR, que es lo que se escribe en la industria. No es el ES exacto de la
muestra: la cola pedida mide n(1−α) y casi nunca es entera. La brecha está medida
en el propio bloque —**30 millones al 97,5 % y 884 al 99 %**— y crece con el nivel
porque cada rueda de la cola pesa más. Es una razón, independiente de Basilea, para
preferir el 97,5 %: allí el estimador se apoya en 48 observaciones y no en 20.

**El horizonte de liquidez conecta con el capítulo 3, y no por analogía.** El FRTB
asigna horizontes por una tabla de categorías; el capítulo los ordena por **cuántas
ruedas no cambió el precio de cada emisor** —Ecopetrol 9,86 %, ISA 11,48 %, Grupo
Sura 15,14 %, Banco de Bogotá 16,23 %—, que es la medida de iliquidez que la
sección 5 del capítulo 3 ya había contado y que allí se llevaba un tercio de la
beta. El mismo defecto del panel que sesga una covarianza decide aquí un horizonte.
Agregado con la fórmula del marco, el ES sube de 14,9495 % a 23,1126 %: **65 305
millones, un 54,6 %**, sin que cambie ningún precio.

**Lo que el navegador volvió a cazar y el verificador no.** Tres cosas, y ninguna
era sintaxis:

- **`Accordion` recibía `title` y `content` y sus propiedades son `titulo` y
  `contenido`.** Los cuatro axiomas de coherencia salían como cuatro filas
  plegables **vacías**, sin una letra. React no se queja de una propiedad que no
  existe y el verificador no valida nombres de propiedad. ⚠️ **El capítulo 4 tiene
  el mismo defecto sin corregir**, en el `Accordion` de «las tres preguntas que el
  VaR no responde» de su sección 1.
- **Un eje logarítmico rotulaba «5» y «2» donde quería decir 0,5 y 0,2.** Son las
  marcas menores que Plotly pone por omisión, y en una gráfica de probabilidades se
  leen como valores del eje. Se tabularon las cuatro décadas en porcentaje.
- **Dos cifras de prosa mal contadas**: un factor a 120 días aporta en los **cinco**
  sumandos del FRTB, no en cuatro; y el VaR al 99 % lo fijan la 20.ª y la 21.ª
  peores ruedas interpoladas, no «la posición 19,15».

**Y un defecto del curso entero, que este capítulo destapó al responder su propio
cuestionario.** Ni `MCQ` ni `Quiz` barajan las opciones, y en los cinco capítulos
escritos **la respuesta correcta era siempre la primera**: 15 de 15 en cada uno.
Un estudiante que lo note saca 10 sobre 10 sin leer. En el capítulo 5 se repartió
la posición correcta entre las cuatro (3 · 4 · 4 · 4), pero **los capítulos 1 a 4
siguen con la correcta en primer lugar**: o se barajan al escribirlos, o se baraja
en el componente —que es una línea en `tr-core-base.jsx`, con la salvedad de que
tocar TR-CORE obliga a re-estampar y re-verificar los cinco—.

**Lo que no se pudo verificar:** `quarto render` sobre `talleres/TDR-05.qmd`.
Quarto sigue sin estar instalado. El bloque ejecutable de la parte 1 se corrió a
mano con `Rscript` desde `talleres/` y da las cifras del capítulo: VaR 2,958 % y
ES 4,727 % al 97,5 %, con una cola de 48 ruedas.

---

### Fase 2 — Tarea 10-bis: saneamiento de los capítulos 1–5 · 2026-08-10

Los cuatro defectos del encargo, más un quinto que apareció al comprobar los
cuatro. TR-CORE pasó de `8baa48efee845d09…` a **`1782905c90e0a6b8…`**, estampado
en los cinco, y las doce reglas con `--con-salidas` siguen en verde.

**El barajado se resolvió en el componente, y la medida del defecto es la que
justifica el gasto.** `MCQ` y `Quiz` permutan ahora las opciones con una
permutación derivada de un **FNV-1a de 32 bits del enunciado**, no de
`Math.random()`: el orden es propio de cada pregunta y siempre el mismo, que es
lo que permite decir «la opción b» en clase. Respondiendo siempre la primera
opción, los cuestionarios pasan de **10 sobre 10 en los cuatro primeros
capítulos** a 1, 0, 0, 1 y 2 sobre 10. Se comprobó además que el generador no
tiene sesgo de posición —24,96 / 24,88 / 25,10 / 25,07 % sobre 200 000 semillas
sintéticas—: la escasez de correctas en primera posición que se observa en los
cinco capítulos es ruido de cuarenta tiradas.

`correcta` y `justificacion` viajan dentro del objeto de la opción, de modo que
permutar el arreglo no toca la calificación. Queda un escape, `barajar={false}`
en el `MCQ` y `barajar: false` en una pregunta del `Quiz`, para las opciones con
orden propio —una escala creciente, una cronología—; ninguno de los cinco
capítulos lo necesita.

**El `Accordion` roto estaba en dos capítulos, no en uno.** El plan señalaba la
sección 1 del capítulo 4; el **capítulo 1 tenía el mismo defecto** en las tres
filas de «los dos defectos del panel» de su sección 5, y salían igual de vacías.
Seis propiedades renombradas en cada uno. La lección se repite: `grep` por
`title:`/`content:` encuentra en dos minutos lo que el verificador no ve nunca,
y hay que hacerlo en todos los capítulos, no solo en el que se acaba de escribir.

**`chart-h-400` ya existe**, en `_plantilla/tr-head.html` y a mano en los cinco
capítulos —la cabecera no la estampa `migrar.py`—. Las trece gráficas miden 400 px
medidos en el navegador, y el SVG de Plotly las sigue: antes caía en su altura por
omisión, 450.

**Los cinco `<title>` y las cinco descripciones** corresponden a su capítulo. El
del 3 era el del 1 y el del 4 seguía diciendo «Plantilla base».

**El quinto defecto, que solo se ve después de arreglar los otros cuatro.**
Ningún `MCQ` de los cinco capítulos define `justificacion`, y el componente
pintaba de todos modos el recuadro de explicación con el rótulo en negrita y nada
detrás — 25 sitios. El `Quiz` ya guardaba su equivalente. Se añadió la guarda en
el `MCQ`. **Consecuencia para lo que falta: un `MCQ` nuevo lleva `justificacion`
en su opción correcta**; rellenar las de los cinco primeros es autoría y queda
como pendiente separado.

**Lo que esta tarea deja como método.** Los cinco defectos comparten forma: son
propiedades o clases que no existen, y ni React ni el verificador se quejan de lo
que no existe. Antes de dar un capítulo por terminado conviene, además del
recorrido: `grep` de los nombres de propiedad contra la firma del componente en
`_plantilla/tr-core-*.jsx`, y `grep` de las clases `chart-h-*` contra las cuatro
que el CSS define.

---

### Fase 2 — Tarea 11: capítulo 6 · 2026-08-10

Nueve secciones, **seis** bloques ejecutados en los dos lenguajes, tres gráficas
y dos laboratorios. Doce reglas en verde y `--con-salidas` con cero
discrepancias: los doce bloques se escribieron y se ejecutaron fuera del
capítulo antes de entrar en él. **Ninguna excepción de dos pestañas** — la
primera de las tareas de capítulo que no necesita ninguna—: los valores críticos
de Acerbi-Székely, que solo se obtienen simulando, se calcularon fuera y entran
como constantes declaradas.

**El hallazgo del capítulo: contar excepciones no distingue modelos, y medirlas
sí.** El VaR histórico y el paramétrico normal fallan **26 veces** los dos, con
la misma tasa, el mismo LR_uc de 4,5175 y la **misma matriz de transición**
(1618, 21, 21, 5). Kupiec y Christoffersen dan veredictos idénticos. Y sin
embargo no son los mismos días: coinciden en 23 y cada uno tiene tres propios.
Lo que los separa es Z₁ de Acerbi-Székely, +0,2487 contra +0,6107 — el normal se
queda **2,5 veces más corto** en la cola—. La coincidencia de los cuatro
estadísticos sobre dos conjuntos distintos de días no estaba prevista y es la
tesis de las secciones 2 y 4.

**El segundo hallazgo es el que cuesta dinero: el marco premia lo que no mide.**
Sobre la ventana regulatoria, el histórico cae en amarilla con 7 excepciones —m
= 3,65, capital 371 675 millones— y el normal en verde con 4 —m = 3,00, capital
309 852—. El fondo pagaría **61 823 millones menos** por usar el modelo con el
peor Z₁ de los cuatro. El semáforo cuenta y no mide, y la brecha va en las dos
direcciones: empieza a cobrar recargo en la quinta excepción, donde Kupiec da p
= 0,1619 y no rechaza nada, y absuelve el conteo cero, que Kupiec **sí** rechaza
con LR_uc = 5,025.

**El modelo que pasa Kupiec es el que peor agrupa, y ese es el primer R3.** La t
de 4,23 gl es la única de las cuatro que Kupiec no rechaza (p = 0,3044) y la que
peor pasa la independencia (LR_ind = 22,2724): tras una excepción, la siguiente
es **24,5 veces** más probable. Adoptarla por su buen conteo bajaría el
multiplicador de 3,65 a 3,00 y liberaría 18 617 millones — cambiar a un modelo
peor y cobrar por ello.

**Ninguno de los cinco modelos ensayados pasa la prueba conjunta**, y eso se
declara como resultado en la sección 7 en vez de esconderse: el panel contiene
marzo de 2020 y ninguna familia calibrada sobre las 250 ruedas anteriores
anticipa cuatro pérdidas de dos dígitos en diez ruedas. El remedio del capítulo
—EWMA con innovaciones t, que junta el ingrediente que le faltaba a cada uno—
mejora las cuatro columnas a la vez y pasa una: su Z₁ baja de +0,3377 a +0,0974
y sigue al doble del crítico.

**Lo que el navegador cazó y el verificador no.** Una afirmación mía que era
falsa. El laboratorio del backtest decía que «no hay ninguna combinación de
ventana y nivel en toda la malla que pase la independencia». Al comprobarlo
sobre las 170 combinaciones de los dos deslizadores resultó que **cinco** pasan
la independencia y **una** pasa la conjunta: ventana de 175 ruedas al 99,5 %,
con 14 excepciones. El hallazgo real es mejor que el que estaba escrito, y ahora
es el R9 y el tercer ítem del acordeón de la sección 7: encontrar esa casilla
buscando entre 170 no es calibrar, es elegir el resultado, y por eso el segundo
paso del R5 fija las pruebas por escrito antes de correr nada. **Moraleja para
lo que queda: toda afirmación de la forma «no existe ninguno» hay que barrerla,
no razonarla.**

**Y un desfase de un índice que solo apareció por escribir los dos lenguajes.**
La recursión del EWMA en R usaba `L[VENT + k - 2]` donde Python usa
`L[VENT + k - 1]`. El primer bloque —el de Kupiec— **no lo vio**: las dos
versiones daban 32 excepciones, por casualidad. Lo destapó el segundo, cuando la
matriz de transición salió (1606, 27, 27, 5) en R y (1604, 29, 29, 3) en Python.
Es exactamente la tesis del capítulo aplicada al capítulo: el conteo coincidía y
los días no.

**Lo que no se pudo verificar:** `quarto render` sobre `talleres/TDR-06.qmd`.
Quarto sigue sin estar instalado. El bloque ejecutable de la parte 1 se corrió a
mano con `Rscript` desde `talleres/` y da las cifras del capítulo: 26
excepciones, tasa 1,56 %, LR_uc 4,5175 y p 0,0336.

---

### Fase 2 — Punto de control C y tarea 11-bis · 2026-08-10

Los cuatro criterios técnicos del punto de control se comprobaron con evidencia y no con
lectura, y **dos de los cuatro destaparon trabajo**. Las cifras están en la sección 7.

**El hilo conductor se puede demostrar, no solo afirmar.** La serie `RP` que embeben los
seis capítulos es byte a byte idéntica —1 916 valores, sha `ff9adfde…`—, y el VaR de 32 617
millones aparece en cinco de los seis. Es la prueba de que D7 se cumplió y el método para
comprobarlo en las unidades 2 y 3: comparar el hash de la serie embebida, no leer la prosa.

**El taller de unidad no existía, y era un entregable del syllabus.** El instrumento
calificado de la U1 es *uno*: «Taller VaR→ES con bitácora de IA y backtest obligatorio». Lo
que había eran seis talleres de capítulo, cada uno dentro del suyo. `talleres/TDR-U1.qmd`
lo arma en ocho partes alrededor de una sola decisión —con qué medida reporta el fondo a
partir del próximo trimestre— y trae los cuatro tipos que el syllabus le asigna: R5 en la
declaración previa, R1 en la traza del ES a mano, R4 en la comparación de métodos y en la
migración, R3 en la auditoría. Los seis talleres de capítulo se quedan como práctica.

**Lo que costó dinero de verdad: `chart-h-380`.** La tarea 10-bis dio por cerrado el asunto
de las clases de altura añadiendo `chart-h-400`, pero **no barrió los valores ya escritos**.
El capítulo 2 usaba `chart-h-380` en dos sitios —una `ChartFrame` y un `Laboratorio`— y esa
clase no la define nadie: medidos en el navegador, los dos elementos daban **450 px**, que es
la altura por omisión de Plotly. Es exactamente el defecto que 10-bis creía haber eliminado,
sobreviviendo por un valor distinto. **Moraleja: cerrar una familia de defectos exige barrer
el rango de valores, no corregir los casos conocidos.**

**Y el hallazgo de tamaño: no eran 30 preguntas sin explicación, eran 90.** El plan hablaba
de «los `MCQ` de los cinco primeros capítulos». Al abrir el capítulo 1 y responder todo lo
que tiene botón de comprobar aparecieron tres familias, no una:

| Componente | Por capítulo | En la U1 | Dónde vive `justificacion` |
|---|---:|---:|---|
| `MCQ` sueltos | 4 | 24 | en la opción correcta |
| `Comparador` (R4) | 1 | 6 | monta un `MCQ` por dentro, con sus mismas `opciones` |
| `Quiz` integrador | 10 | 60 | en la **pregunta**, no en la opción |
| | | **90** | |

Las 90 escritas. La regla editorial que se siguió: la justificación **no repite la opción
correcta** —que en este material ya viene razonada—, sino que añade la cifra del capítulo, la
consecuencia en pesos y el puente al capítulo que retoma el asunto. El `Quiz` es el que más
lo agradece, porque es el que prepara el examen final presencial No-AI.

**Lo que esto deja como método**, y vale para los nueve capítulos que faltan:

1. **Un componente que envuelve a otro hereda sus zonas ciegas.** `grep` de `<MCQ` no
   encuentra los `MCQ` que monta el `Comparador`. Barra por **propiedad** —`opciones={`,
   `preguntas={`— y no por nombre de componente.
2. **Contar en el navegador, no en el archivo.** El recuento correcto salió de hacer clic en
   todo lo que tiene botón «Comprobar», no de un `grep`.
3. **Un capítulo nuevo nace con sus 15 justificaciones**: 4 + 1 + 10. Ya no es deuda que se
   arrastre.

**Lo que sigue sin poder verificarse:** `quarto render`, sobre los seis talleres y sobre
`TDR-U1.qmd`. `brew install --cask quarto` exige `sudo` con terminal, así que la instalación
queda del lado del usuario. Los bloques ejecutables de `TDR-U1.qmd` se corrieron a mano con
`Rscript` y dan las cifras del material.

---

### Revisión 2 del plan · 2026-08-07
- P1–P5 resueltas. El curso pasa de 14 a 15 capítulos por la partición de ES y backtesting.
- Se añaden las decisiones **D8** (niveles AIAS por tipo de ejercicio) y **D9** (terminología).
- Renumeración completa de capítulos, archivos, tareas y dependencias.
- Horas recuadradas: 24 + 16 + 24 = 64.

*(Las fases se registran aquí a medida que se completan, como en el plan de LP.)*
