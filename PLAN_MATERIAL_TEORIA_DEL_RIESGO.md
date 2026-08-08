# Plan de implementación — Material de estudio
## Teoría del Riesgo · Universidad Santo Tomás · 2026-II

**Fuente del contenido:** `Syllabus Teoria del Riesgo - Modernizado 2026_2.xlsx` (versión 3, 2026-06-24)
**Fuente del formato:** `Logica de programacion/Material html/_plantilla/lp-base.html`
**Espacio académico:** Pregrado profesional, Estadística · Periodo 8 · Obligatorio · Teórico-práctico
**Créditos:** 2 · **Horas:** 64 acompañadas + 32 autónomas = 96
**Fecha del plan:** 2026-08-07 · **Revisión 2** (P1–P5 resueltas)
**Estado:** aprobado en estructura — listo para ejecutar la fase 0

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

### ✅ Punto de control C — Unidad 1 completa
- [ ] Seis capítulos pasan `verificar.py --con-salidas`
- [ ] Las 24 h del syllabus están cubiertas y suman lo declarado
- [ ] El hilo del fondo de pensiones es continuo entre C1 y C6
- [ ] El taller VaR→ES del syllabus se puede armar con el material existente
- [ ] Revisión con el usuario

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

#### Tarea 6 · Capítulo 4 completo (VaR) — rebanada de referencia
**Descripción:** Escribir el capítulo 4 entero: seis secciones con motivación, código en
Python y R ejecutado, tres gráficas, catorce ejercicios cubriendo los nueve tipos, quiz de
diez preguntas y el cuaderno Quarto del taller.

**Criterios de aceptación:**
- [ ] Las doce reglas del verificador pasan, incluida `--con-salidas`
- [ ] Los nueve tipos R1–R9 están presentes y son contables
- [ ] Todas las salidas `#>` coinciden con la ejecución real

**Verificación:** `python3 verificar.py --con-salidas` devuelve 0 · recorrido manual
respondiendo cada ejercicio
**Depende de:** Punto de control A · **Alcance: L (dos sesiones)**

### ✅ Punto de control B — Piloto · **revisión obligatoria con el usuario**
- [ ] El capítulo se lee de principio a fin sin fricción
- [ ] La densidad de fórmulas es la adecuada: ni un formulario ni prosa sin matemáticas
- [ ] Los ejercicios R3 «Audita a la IA» funcionan como se espera y su taxonomía de errores es la correcta
- [ ] El `Laboratorio` aporta y no distrae
- [ ] La convención terminológica de D9 se lee bien en prosa real
- [ ] El archivo pesa menos de 400 KB
- [ ] **Se ajusta la plantilla aquí, antes de escribir catorce capítulos sobre ella**

---

### Fase 2 — Unidad 1 · RA1–RA3

| Tarea | Capítulo | Alcance | Sesiones |
|---|---|---|---|
| 7 | C1 Riesgo, rendimiento y entorno | M | 1 |
| 8 | C2 Volatilidad (a: EWMA/ARCH · b: GARCH) | L | 2 |
| 9 | C3 CAPM | M | 1 |
| 10 | C5 Expected Shortfall | M | 1 |
| 11 | C6 Backtesting y marco regulatorio | M | 1 |

→ **Punto de control C** (definido en la sección 7)

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
Los quince `.qmd` con el taller ejecutable de cada capítulo, `_quarto.yml`, y una pasada de
`quarto render` que no falle. · **Alcance: M**

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

### Revisión 2 del plan · 2026-08-07
- P1–P5 resueltas. El curso pasa de 14 a 15 capítulos por la partición de ES y backtesting.
- Se añaden las decisiones **D8** (niveles AIAS por tipo de ejercicio) y **D9** (terminología).
- Renumeración completa de capítulos, archivos, tareas y dependencias.
- Horas recuadradas: 24 + 16 + 24 = 64.

*(Las fases se registran aquí a medida que se completan, como en el plan de LP.)*
