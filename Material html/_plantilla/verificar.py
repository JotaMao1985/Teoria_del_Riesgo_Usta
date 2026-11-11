#!/usr/bin/env python3
"""
Verificador estructural de los capítulos de Teoría del Riesgo.

Comprueba veintitrés cosas sobre cada archivo HTML de capítulo y dos una sola
vez —la 21 sobre `_fuentes/referencias.json` y la isla de referencias de la
demo sobre `tr-base.html`—:

  1. DERIVA — que el bloque TR-CORE (la librería de componentes) sea byte a
     byte idéntico al de `_plantilla/tr-base.html`.
  2. CUOTA DE EJERCICIOS — que se cumpla la taxonomía R1..R9 acordada, con
     R1, R3, R7 y R9 obligatorios.
  3. COMPONENTES SIN DEFINIR — que todo componente usado en el JSX exista.
  4. CODETABS COMPLETOS — que cada bloque de código traiga los dos lenguajes
     del curso: python y r.
  5. MOTIVACIÓN — que cada sección del `curriculum` abra con <Motivacion>.
  6. EJERCICIOS MULTILINGÜES — que un ejercicio presentado en varios lenguajes
     los traiga los dos, y que `DetectaError` no use una `lineaCorrecta` fija
     cuando sus líneas cambian con el lenguaje.
  7. SALIDA — que vaya dentro del bloque con el prefijo `#>`, que no sobreviva
     ninguna propiedad `salidas={...}` del panel separado, y que no queden
     prefijos ajenos (`//>` de pseudocódigo, `'>` de VBA) copiados del material
     de Lógica de Programación.
  8. TEXTO POR LENGUAJE — que un `DetectaError` cuyas `lineas` cambian con el
     lenguaje no cite «la línea N» en un `enunciado` o una `explicacion` fijos.
     Es la regla 6 aplicada a la prosa: se arregló la clave y se dejó el texto.
  9. SALIDAS EJECUTADAS — que la salida declarada tras `#>` sea la que el código
     produce de verdad. Vive en `ejecutar_salidas.py` porque corre procesos y
     tarda; se pide con `--con-salidas`. A diferencia del curso del que se
     bifurcó esta librería, aquí se ejecutan LOS DOS lenguajes: el material
     queda auditado por completo, sin lenguajes declarados como omitidos.
 10. CONTRASTE — que ningún color de la paleta por debajo de 3,0:1 sobre el
     fondo de la página se use como color de texto sin querer.
 11. ENUNCIADOS — que ningún ejercicio pida escribir un programa desde cero:
     está excluido por diseño de la taxonomía; eso es de los talleres.
 12. PESO — que ningún capítulo pase de 420 KB. Con MathJax denso, gráficas y
     datos embebidos es un límite que se cruza sin darse cuenta, y del otro
     lado el capítulo tarda en abrir en el equipo de un estudiante. Fue de
     400 KB hasta el 2026-11-11, cuando el circuito de citas le sumó ~17 KB a
     TR-CORE (D6 del plan).
 13. LONGITUD DE LAS OPCIONES — que la opción correcta no sea sistemáticamente
     la más larga. `barajarOpciones` cerró la pista de la POSICIÓN y dejó
     abierta la de la LONGITUD, que el barajado no toca: en la primera pasada
     de la unidad 1 la correcta era la más larga en 89 de 90 preguntas, con
     una razón media de 2,1 veces sus distractores. Un estudiante que marque
     la más larga sin leer saca la nota completa. La causa es de redacción —la
     opción correcta arrastra su propia justificación—, y el arreglo es mover
     ese razonamiento a `justificacion`, que es donde la regla editorial ya
     dice que va.
 14. POSICIÓN DE LA CORRECTA — que la letra en la que la opción correcta acaba
     saliendo en pantalla esté repartida. `barajarOpciones` permuta con un hash
     del ENUNCIADO, así que la posición no depende de las opciones: reescribir
     el texto para arreglar la regla 13 no mueve ni una letra. Y como la
     correcta se escribe casi siempre en el índice 0 del arreglo, la letra
     acaba siendo una función del enunciado y solo de él. En el capítulo 2 eso
     dejó la correcta en la (c) nueve veces de quince y en la (a) ninguna: un
     estudiante que descarte la (a) y marque la (c) aprueba sin leer. Se
     arregla moviendo la correcta de índice en el fuente, y esta regla dice a
     cuáles. Solo se aplica a las preguntas cuyo enunciado es una cadena
     literal: si es JSX, la semilla no se puede reconstruir aquí y se omiten.
 15. OPCIONES COMPLETAS — que toda opción declare `correcta`. Una escrita como
     `{ texto: '…' }` a secas no casa con la expresión de las reglas 13, 14 y
     16, y eso la volvía invisible: el capítulo 12 auditaba 10 preguntas de 15
     creyendo que eran todas, y las cinco que se saltaba tenían la correcta
     como la más larga.
 16. MARCAS DE FORMA — que ninguna marca tipográfica señale a la correcta, ni
     al revés. Es la tercera vuelta del mismo defecto: la regla 14 cerró la
     POSICIÓN, la 13 la LONGITUD por arriba y después por abajo, y al alargar
     las correctas para salir de ese suelo se les añadió un segundo tramo
     detrás de DOS PUNTOS —«Que la restricción solo cuesta cuando ata: al
     25,02 %…»— mientras los distractores encadenaban con «porque». En el
     capítulo 7 marcar la única opción con «:» daba 7 de 10 en pantalla, y en
     el 11 la única con cifra decimal daba 8 de 15. Por eso esta regla nace
     sobre una LISTA de marcadores y en los DOS sentidos, que es lo que la 13
     aprendió tarde: vigilar una sola forma en un solo extremo corrige el
     defecto hacia su espejo. El arreglo no es quitarle la marca a la correcta
     sino dársela a uno o dos distractores, que además los mejora.
     La cuarta vuelta la trajo el capítulo 9: quitados los dos puntos, la
     correcta se escribía «afirmación, y consecuencia» y los distractores
     «afirmación, porque razón», y marcar la única opción con «, y» sacaba
     8,83 de 15 sin leer. Desde el 2026-10-01 la lista trae esas dos marcas
     —la coordinación «, y» y el conector causal— y cada marca se mira también
     por su AUSENCIA: un conector que llevan los distractores y no la correcta
     la delata por ser la que desentona.
     La quinta vuelta (2026-10-08) es de CONTENIDO y no de tipografía: la
     negación («no», «ni») y los absolutos («solo», «siempre», «nada»,
     «cualquier», «exactamente»…). Descartar lo que niega o absolutiza sacaba
     6,42 de 15 en el 9, y al medir los doce apareció el espejo: en el 2, el 3
     y el 11 la correcta era la que negaba —«no es X sino Y»— y marcarla sacaba
     5,67 a 6,58. Estas dos marcas se vigilan solo por los criterios que
     SEÑALAN la correcta —la brecha y «la única con la marca, o sin ella, es la
     correcta»—, no por «la única es un distractor»: un absoluto suelto en un
     distractor es prosa legítima donde absolutizar ES el error, y descartarlo
     solo sube el acierto de 1/4 a 1/3 en esa pregunta.
 17. EMPAREJAMIENTO — que la solución de un `Emparejamiento` no siga las
     filas. El componente pinta la columna derecha en el orden del arreglo: a
     diferencia de `MCQ` y `Quiz` no baraja, así que dónde cae cada pareja lo
     decide quien escribe `solucion`. El capítulo 12 la escribió como la
     identidad y su R6 se resolvía emparejando cada fila con la de enfrente.
     Se tolera UNA pareja en su fila, que es lo que deja en promedio una
     permutación al azar; exigir cero volvería «nunca en su fila» la pista.
     De paso exige que `solucion` exista, sea un arreglo literal, no repita
     índices, cubra la izquierda y no se salga de la derecha: sin ella la
     página queda en blanco, y con un índice repetido el ejercicio no llega a
     la nota entera. La derecha puede traer opciones de sobra.

Las reglas 18 a 24 son el circuito de citas, las 26 a 32 de Lógica de
Programación Financiera copiadas y adaptadas el 2026-11-11. Las fuentes viven
en Zotero; `exportar_zotero.py` las deja en `_fuentes/referencias.json` y
`estampar_referencias.py` pone en cada capítulo, después del script Babel y
entre centinelas TR-REFS, la isla de JSON con las entradas formateadas en APA 7
que leen `Cita`, `Referencias`, `Fuente`, `FichaNorma` y `ParaProfundizar`.
La política está en `_fuentes/POLITICA_DE_FUENTES.md`.

 18. CLAVE CITADA EXISTE — que toda clave de `<Cita k>`, `<Fuente k>`,
     `<FichaNorma k>`, `<ChartFrame fuente>` y `<ParaProfundizar k>` esté
     escrita como cadena literal, esté en `_fuentes/referencias.json` y esté
     en la isla TR-REFS del capítulo, en su lista: las citadas en `entradas` y
     las recomendadas en `profundizar`. Y que ninguna esté citada y
     recomendada a la vez. Una clave mal escrita no rompe nada: el componente
     pinta un chip rojo en medio de un párrafo, y eso solo lo ve quien llegue
     a ese párrafo.
 19. REFERENCIAS EXACTAS — que la isla traiga las entradas que el capítulo
     cita, las que recomienda en `<ParaProfundizar>`, y ninguna más; que, si
     hay citas, haya un único `<Referencias />` y esté en la última lección,
     que es adonde llevan las citas; y que `<ParaProfundizar>`, si lo hay, sea
     uno solo y vaya en esa lección, después de `<Referencias />`. Un capítulo
     que no cita ni recomienda nada y no tiene isla pasa.
 20. BLOQUE AL DÍA — que la isla sea la que `estampar_referencias.py`
     escribiría hoy. Sin pandoc: se recalculan la `huella` (lo que entró: las
     entradas citadas, las recomendadas, el estilo y el idioma) y el `sello`
     (lo que salió), y se exige que los centinelas TR-REFS sean únicos y estén
     después del script Babel. Con `--con-pandoc` se vuelve a formatear y se
     compara entero.
 21. ENTRADA VERIFICABLE — que cada entrada de `referencias.json` tenga autor y
     título, y un DOI, un ISBN o una URL; que la que solo tiene URL traiga la
     fecha de consulta; y que ninguna traiga campos fuera de la lista blanca
     (`abstract`, `note`…): el repositorio es público. Se comprueba una sola
     vez y no aborta. Lo de la lista blanca, la clave, el orden y los
     repetidos falla siempre; lo demás falla en una entrada que algún
     capítulo cita o recomienda, y es un AVISO en una que nadie usa todavía.
 22. FIGURA SIN FUENTE — que cada gráfica, tabla o diagrama diga de dónde salen
     sus datos: `fuente` en el `ChartFrame`, o un `<Fuente>` a continuación. Es
     un AVISO. Vive en `comprobar_fuentes.js`, con la 24, y necesita Node con
     @babel/core y @babel/preset-react en global; si faltan, avisa.
 23. AFIRMACIÓN LEÍDA — que cada par clave–localizador que el capítulo cita
     tenga su fila en `_fuentes/afirmaciones/NN.yaml`, con quién leyó el pasaje,
     cuándo y por qué medio; y que el `ancla` de cada fila —un trozo literal del
     texto— siga en el capítulo. La fila es la constancia de que alguien fue a
     mirar el pasaje, y el ancla, de que el texto que se respaldó sigue siendo
     el que se publica. Un `loc` vacío es válido: se cita la obra entera. Que
     el capítulo ya no cite lo que respalda una fila es un AVISO. Una obra de
     `<ParaProfundizar>` no necesita fila: recomendarla no es atribuirle nada.
     El registro lo genera `registrar_afirmaciones.py` desde el vault privado.
 24. ENTIDAD O NORMA SIN CITA — que el texto no nombre una entidad (la
     Superintendencia, el Banco de la República, el Comité de Basilea…) o una
     norma (un decreto, una circular, Basilea III, el SIAR) sin citarla ni
     declararla ilustrativa. Es un AVISO: nombrarla no siempre es afirmar algo
     de ella, y eso no lo decide una regla.

Uso:
    python3 _plantilla/verificar.py                 # todos los capítulos
    python3 _plantilla/verificar.py 04_TDR_*.html   # archivos concretos
    python3 _plantilla/verificar.py --sin-cuota     # omite la regla 2
                                                    # (útil en capítulos a medias)
    python3 _plantilla/verificar.py --con-salidas   # añade la regla 9 (lenta)
    python3 _plantilla/verificar.py --con-pandoc    # la 20 vuelve a formatear
    python3 _plantilla/verificar.py --fuentes DIR   # otra carpeta de fuentes, con
                                                    # su referencias.json (pruebas)

Devuelve 0 si todo pasa, 1 si algo falla y 2 si se le pasó una opción que no
existe: una opción mal escrita no puede darse por atendida.
"""

import hashlib
import re
import subprocess
import sys
from pathlib import Path

try:
    import ejecutar_salidas
    import fuentes
except ImportError:  # se ejecuta desde otro directorio
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import ejecutar_salidas
    import fuentes

AQUI = Path(__file__).resolve().parent
MATERIAL = AQUI.parent
BASE = AQUI / "tr-base.html"

MARCA_INICIO = "/* === TR-CORE INICIO"
MARCA_FIN = "/* === TR-CORE FIN === */"

PATRON_CAPITULO = "[0-9][0-9]_TDR_*.html"

# Cuota mínima y máxima por tipo de ejercicio (§4 del plan).
CUOTA = {
    "R1": (1, 2),
    "R2": (2, 3),
    "R3": (2, 2),
    "R4": (1, 2),
    "R5": (1, 1),
    "R6": (1, 1),
    "R7": (2, 2),
    "R8": (1, 2),
    "R9": (1, 2),
}
# R3 y R9 son obligatorios además de R1 y R7: la auditoría de salidas de IA es
# transversal en el syllabus, y el laboratorio es lo que justifica que el
# material sea HTML y no un PDF.
OBLIGATORIOS = ("R1", "R3", "R7", "R9")

# Cómo se cuenta cada tipo: componente propio o envoltorio <Ejercicio tipo="...">.
POR_COMPONENTE = {
    "R1": "TablaTraza",
    "R3": "DetectaError",
    "R4": "Comparador",
    "R5": "OrdenaPasos",
    "R6": "Emparejamiento",
    "R9": "Laboratorio",
}
POR_ENVOLTORIO = ("R2", "R7", "R8")

LENGUAJES = ("python", "r")

# Prefijos de salida de OTROS cursos. Python y R comparten `#>`, así que la
# comprobación de «prefijo equivocado» que tenía sentido con cuatro lenguajes
# aquí se convierte en otra cosa: cazar restos de material copiado del curso de
# Lógica de Programación, donde el pseudocódigo usa `//>` y VBA `'>`.
PREFIJOS_AJENOS = {"//>": "pseudocódigo", "'>": "VBA"}
PREFIJO_PROPIO = "#>"

# 400 hasta el 2026-11-11; 420 desde ese día, decisión del docente: el circuito de
# citas sumó ~17 KB a TR-CORE y dejó el capítulo 7 en 408 KB (ver D6 del plan).
PESO_MAXIMO_KB = 420

# Regla 13. La fracción no es cero a propósito: con cuatro opciones, que la
# correcta salga la más larga por azar pasa una vez de cada cuatro, así que
# exigir cero obligaría a redactar contra la casualidad. Un tercio ya no es
# azar. La razón individual tolera un 30 % de holgura sobre la media de los
# distractores, que es lo que cabe sin que la diferencia se vea de un vistazo.
FRACCION_DELATADAS_MAXIMA = 0.34
RAZON_LONGITUD_MAXIMA = 1.30

# …y la misma regla por abajo, que faltaba. La versión de un solo lado dejó en
# verde a los capítulos 7, 8, 11 y 12 con la correcta más corta en 15 de 15 y
# razones de hasta 0,08: marcar la más corta sin leer sacaba la nota completa,
# que es exactamente el defecto que la mitad de arriba existe para impedir.
# Corregir hacia abajo abrió el espejo del defecto de agosto, y por eso el
# umbral es el recíproco del de arriba, redondeado a la baja.
RAZON_LONGITUD_MINIMA = 0.75

# Regla 14. Con cuatro opciones lo esperable es una cuarta parte por letra. Se
# tolera hasta la mitad —redactar contra la casualidad de un hash no es trabajo
# de nadie— y se exige que ninguna letra se quede sin salir, que es la pista
# barata: descartar la que nunca es correcta reduce el problema a tres opciones.
# El mínimo de preguntas evita que un capítulo a medias falle por tener cuatro.
FRACCION_POSICION_MAXIMA = 0.50
MINIMO_PREGUNTAS_POSICION = 8

# Regla 16. La longitud fue la pista de agosto y la posición la de julio; en
# septiembre, al alargar las correctas para salir del suelo de la regla 13, se
# les añadió un segundo tramo detrás de dos puntos —«Que la restricción solo
# cuesta cuando ata: al 25,02 %…»— mientras los distractores encadenaban con
# «porque». La pista cambió de disfraz: en el capítulo 7 marcar la única opción
# con «:» daba 7 de 10 en pantalla, y en el 11 la única con cifra decimal daba
# 8 de 15. Por eso esta regla se escribe DESDE EL PRIMER DÍA sobre una lista de
# marcadores y en los dos sentidos, que es lo que la regla 13 aprendió tarde:
# vigilar un solo extremo de una sola forma corrige el defecto hacia su espejo.
#
# La cuarta vuelta salió del capítulo 9 (2026-09-30): quitados los dos puntos,
# la correcta se escribía «afirmación, y consecuencia» y los distractores
# «afirmación, porque razón». «, y» iba en 12 de 15 correctas y en 11 de 45
# distractores; un conector causal, en 3 de 15 y en 27 de 45, y marcar la única
# opción con «, y» sacaba 8,83 de 15. Ninguna de las cuatro marcas de entonces
# lo veía. La lista de conectores es la que midió su auditoría. El «Porque» con
# que abre la respuesta a un «¿por qué…?» no cuenta: es la forma de la pregunta,
# y lo llevan por igual las correctas y los distractores —19 de 165 y 61 de 495
# en los once capítulos, el 2026-10-01—.
CONECTOR_CAUSAL = re.compile(
    r"\b(?:porque|ya que|así que|de modo que|pues|dado que|puesto que)\b", re.I)
PORQUE_INICIAL = re.compile(r"^\s*porque\s+", re.I)

MARCADORES_FORMA = {
    "dos puntos «:»": lambda t: ":" in t,
    "raya «—»": lambda t: "—" in t,
    "punto y coma «;»": lambda t: ";" in t,
    "cifra decimal": lambda t: re.search(r"\d,\d", t) is not None,
    "coordinación «, y»": lambda t: re.search(r",\s+y\s", t) is not None,
    "conector causal": lambda t: CONECTOR_CAUSAL.search(PORQUE_INICIAL.sub("", t)) is not None,
}

# La medida que vale NO es «cuántas preguntas tienen una sola opción marcada»:
# ese conteo sube por azar en cuanto el marcador es prosa corriente. Lo que
# decide es comparar P(marca | correcta) contra P(marca | distractor), y el
# conteo de «la única marcada es la correcta», que es la regla que un estudiante
# puede aplicar sin leer. Los once capítulos están hoy en brechas de 0,00 a 0,31
# en las seis marcas —el 9, con la corrección de su auditoría—.
BRECHA_MARCADOR_MAXIMA = 0.35

# La quinta vuelta (2026-10-08). La lista de absolutos es la «amplia» de la
# segunda revisión del capítulo 9, la que medía 6,42 de 15 descartando. Medido
# ese día sobre los doce, tras corregir el 1, el 2, el 3, el 10 y el 11: brechas
# de −0,16 a +0,24 y como mucho 3 de 15 preguntas en que la única opción con la
# marca, o sin ella, es la correcta. Descartar las opciones con cualquiera de
# las dos saca 2,25 a 3,92 de 15 donde el azar da 3,75.
NEGACION = re.compile(r"\b(?:no|ni)\b", re.I)
ABSOLUTO = re.compile(
    r"\b(?:siempre|nunca|jamás|basta|da igual|solo|sólo|ningún|ninguna|ninguno|nada|"
    r"cualquier|cualquiera|por definición|exactamente|completo|entero)\b", re.I)

# La brecha no basta para estas dos: en el 2 y el 11, antes del arreglo, iba en
# +0,33 y +0,20, y marcar la opción con negación sacaba 6,58 y 6,00 de 15. Se
# mide además el valor ESPERADO de marcar al azar entre las opciones con la
# marca, y entre las que no la llevan. El techo, 0,38 del total (5,7 de 15),
# deja pasar lo que hoy queda: el máximo es 5,50, marcar un absoluto en el 6 y
# en el 7. Para las seis marcas de forma no se aplica: el «:» saca 6,08 en el 2
# y el 4 y nadie ha medido si eso es pista o prosa.
ACIERTO_CONTENIDO_MAXIMO = 0.38

MARCADORES_CONTENIDO = {
    "negación «no/ni»": lambda t: NEGACION.search(t) is not None,
    "absoluto («solo», «siempre», «nada»…)": lambda t: ABSOLUTO.search(t) is not None,
    "negación o absoluto": lambda t: bool(NEGACION.search(t) or ABSOLUTO.search(t)),
}

# Regla 17. `Emparejamiento` no baraja la columna derecha: la pinta en el orden
# del arreglo, así que dónde cae cada pareja lo decide quien escribe `solucion`.
# El capítulo 12 la escribió como la identidad, [0, 1, 2, 3, 4], y el R6 se
# resolvía sin leer. Una permutación al azar deja UNA pareja en su fila en
# promedio, sea cual sea n, y ninguna solo un 37 % de las veces: por eso se
# tolera una. Exigir cero convertiría «nunca en su fila» en la pista, que es el
# espejo del defecto — lo que la regla 13 aprendió tarde.
PAREJAS_EN_SU_FILA_MAXIMAS = 1

# Etiquetas que no son componentes React definidos por nosotros.
IGNORAR = {"React", "ReactDOM", "Fragment", "Math", "Object", "JSON", "Array",
           "Number", "String", "Boolean", "Promise", "Set", "Map", "Date"}

ROJO, VERDE, AMAR, GRIS, FIN = "\033[31m", "\033[32m", "\033[33m", "\033[90m", "\033[0m"


def bloque_core(texto, ruta):
    i = texto.find(MARCA_INICIO)
    j = texto.find(MARCA_FIN)
    if i == -1 or j == -1:
        return None, f"no se encontraron los centinelas TR-CORE en {ruta.name}"
    return texto[i:j + len(MARCA_FIN)], None


def cuerpo_capitulo(texto):
    """Todo lo que va DESPUÉS de TR-CORE: el contenido propio del capítulo."""
    j = texto.find(MARCA_FIN)
    return texto[j:] if j != -1 else texto


def contar_ejercicios(cuerpo):
    conteo = {}
    for tipo, comp in POR_COMPONENTE.items():
        conteo[tipo] = len(re.findall(r"<" + comp + r"[\s/>]", cuerpo))
    for tipo in POR_ENVOLTORIO:
        conteo[tipo] = len(re.findall(r'<Ejercicio\s+tipo="' + tipo + r'"', cuerpo))
    return conteo


def componentes_sin_definir(texto, cuerpo):
    usados = set(re.findall(r"<([A-Z][A-Za-z0-9_]*)[\s/>]", cuerpo))
    definidos = set(re.findall(r"const\s+([A-Z][A-Za-z0-9_]*)\s*=", texto))
    definidos |= set(re.findall(r"^\s{12}([A-Z][A-Za-z0-9_]*):\s*\(", texto, re.M))  # Icons
    return sorted(usados - definidos - IGNORAR)


def secciones_sin_motivacion(cuerpo):
    """Toda sección debe abrir con <Motivacion>: es la convención del curso.

    Se leen los componentes declarados en `curriculum` y, para cada uno, se
    comprueba que el primer componente de su cuerpo sea Motivacion. El `<div
    className="prose-tr">` envolvente no cuenta: empieza en minúscula.

    Hay que admitir las DOS formas de la función flecha. `() => (` devuelve JSX
    directamente, pero una sección con una gráfica necesita llamar a
    `usePlotly` antes de devolver nada y se escribe `() => {` con un `return`.
    El verificador del que esto se bifurcó solo reconocía la primera, y una
    sección con gráfica —que en este curso son casi todas— se habría reportado
    como «no se encontró su definición».
    """
    m = re.search(r"const\s+curriculum\s*=\s*\[(.*?)\n\s*\];", cuerpo, re.S)
    if not m:
        return ["no se encontró el arreglo `curriculum`"]

    fallos = []
    for comp in re.findall(r"component:\s*([A-Za-z0-9_]+)", m.group(1)):
        d = re.search(r"const\s+" + comp + r"\s*=\s*\(\s*\)\s*=>\s*([({])", cuerpo)
        if not d:
            fallos.append(f"{comp}: no se encontró su definición")
            continue
        # Con cuerpo de bloque, el JSX empieza en el `return (`; con cuerpo de
        # expresión, justo donde termina la flecha.
        desde = d.end()
        if d.group(1) == "{":
            r = re.search(r"\breturn\s*\(", cuerpo[desde:])
            if not r:
                fallos.append(f"{comp}: es una función de bloque y no tiene `return (`")
                continue
            desde += r.end()
        primero = re.search(r"<([A-Z][A-Za-z0-9_]*)", cuerpo[desde:desde + 3000])
        if not primero:
            fallos.append(f"{comp}: no contiene ningún componente")
        elif primero.group(1) != "Motivacion":
            fallos.append(f"{comp}: abre con <{primero.group(1)}> y debería abrir con <Motivacion>")
    return fallos


def bloques_de(cuerpo, componente):
    """Devuelve el texto de cada `<Componente ... />` del cuerpo.

    No se puede usar una expresión regular perezosa hasta `/>`: un fragmento
    JSX (`enunciado={<>...</>}`) termina en `</>`, que contiene `/>`, y el
    bloque se cortaría a los pocos caracteres. Se recorre el texto llevando
    la cuenta de las llaves y se corta en el primer `/>` o `>` que esté
    FUERA de cualquier expresión `{...}`.
    """
    salida = []
    for m in re.finditer("<" + componente + r"[\s/>]", cuerpo):
        i = m.start()
        prof, j, n = 0, i, len(cuerpo)
        while j < n - 1:
            c = cuerpo[j]
            if c == "{":
                prof += 1
            elif c == "}":
                prof -= 1
            elif prof == 0 and c == "/" and cuerpo[j + 1] == ">":
                j += 2
                break
            elif prof == 0 and c == ">" and j > i:
                j += 1
                break
            j += 1
        salida.append(cuerpo[i:j])
    return salida


def cuerpo_de_constante(texto, nombre):
    """Texto del objeto `const nombre = { … }`, o None si no existe."""
    m = re.search(r"const\s+" + nombre + r"\s*=\s*\{", texto)
    if not m:
        return None
    resto = texto[m.end():]
    cierre = re.search(r"\n\s{0,12}\};", resto)
    return resto[:cierre.start()] if cierre else resto[:8000]


def mapa_de_lenguajes(texto, nombre):
    """¿La constante `nombre` es un objeto {python, r}?

    Devuelve la lista de lenguajes presentes, o None si no es un mapa.
    """
    trozo = cuerpo_de_constante(texto, nombre)
    if trozo is None:
        return None
    presentes = [l for l in LENGUAJES if re.search(r"\n\s+" + l + r":", trozo)]
    return presentes if presentes else None


def lenguajes_en_literal(valor):
    """Lenguajes presentes en un objeto escrito en el sitio, `{python: …, r: …}`.

    Sin esto, un `CodeTabs` o un `Comparador` con el objeto en línea en vez de
    en una constante con nombre se saltaría la comprobación entera: el hueco
    existía en el verificador del que este se bifurcó.
    """
    return [l for l in LENGUAJES if re.search(r"[{,]\s*" + l + r"\s*:", valor)]


def valor_de_prop(bloque, nombre):
    """Texto crudo del valor de `nombre=` dentro de un bloque JSX.

    Devuelve el interior de `{...}` con las llaves equilibradas —hace falta:
    `enunciado={<>…</>}` lleva llaves anidadas— o el interior de las comillas
    si el valor es una cadena. `None` si la propiedad no aparece.
    """
    m = re.search(r"\b" + nombre + r"\s*=\s*", bloque)
    if not m:
        return None
    i = m.end()
    if i >= len(bloque):
        return None
    if bloque[i] in "\"'":
        cierre = bloque.find(bloque[i], i + 1)
        return bloque[i + 1:cierre] if cierre != -1 else bloque[i + 1:]
    if bloque[i] != "{":
        return None
    prof = 0
    for j in range(i, len(bloque)):
        if bloque[j] == "{":
            prof += 1
        elif bloque[j] == "}":
            prof -= 1
            if prof == 0:
                return bloque[i + 1:j]
    return bloque[i + 1:]


def idiomas_de_valor(texto, valor):
    """Lenguajes de una propiedad, venga como constante con nombre o en línea.

    Devuelve None si el valor no es un objeto por lenguaje en ninguna de las
    dos formas —una cadena suelta, por ejemplo—.
    """
    if valor is None:
        return None
    v = valor.strip()
    if re.fullmatch(r"[A-Za-z0-9_]+", v):
        return mapa_de_lenguajes(texto, v)
    presentes = lenguajes_en_literal(v)
    return presentes if presentes else None


def ejercicios_multilingues_mal(texto, cuerpo):
    """Coherencia de los ejercicios que se presentan en varios lenguajes.

    El fallo grave es un `DetectaError` con `lineas` multilingüe y una
    `lineaCorrecta` fija: el mismo error NO está en la misma línea en Python y
    en R —R necesita `library(...)` donde Python usa `import`, y una comprensión
    de lista suele ser un `sapply` de una sola línea—, así que el ejercicio
    calificaría mal al cambiar de pestaña, y sin avisar de nada.
    """
    fallos = []

    for bloque in bloques_de(cuerpo, "DetectaError"):
        idiomas = idiomas_de_valor(texto, valor_de_prop(bloque, "lineas"))
        if not idiomas:
            continue
        faltan = [l for l in LENGUAJES if l not in idiomas]
        if faltan:
            fallos.append(f"DetectaError · `lineas`: faltan {', '.join(faltan)}")

        valor_c = valor_de_prop(bloque, "lineaCorrecta")
        idiomas_c = idiomas_de_valor(texto, valor_c)
        if idiomas_c is None:
            fallos.append(
                "DetectaError · `lineas` es multilingüe pero `lineaCorrecta` no es un "
                "objeto por lenguaje: calificaría mal al cambiar de pestaña")
            continue
        faltan_c = [l for l in idiomas if l not in idiomas_c]
        if faltan_c:
            fallos.append(f"DetectaError · `lineaCorrecta`: faltan {', '.join(faltan_c)}")

    for comp, props in (("TablaTraza", ("codigo",)), ("OrdenaPasos", ("pasos",)),
                        ("Emparejamiento", ("izquierda",)), ("Comparador", ("a", "b"))):
        for bloque in bloques_de(cuerpo, comp):
            for prop in props:
                valor = valor_de_prop(bloque, prop)
                if valor is None:
                    continue
                # `Comparador` recibe objetos {etiqueta, codigo}: se mira dentro.
                if comp == "Comparador":
                    m = re.search(r"codigo\s*:\s*", valor)
                    if not m:
                        continue
                    valor = valor[m.end():]
                idiomas = idiomas_de_valor(texto, valor)
                if idiomas:
                    faltan = [l for l in LENGUAJES if l not in idiomas]
                    if faltan:
                        fallos.append(f"{comp} · `{prop}`: faltan {', '.join(faltan)}")
    return fallos


# `<strong>línea 5</strong>`, «la línea 4», «las líneas 3 y 4»: el número puede
# venir envuelto en etiquetas, así que se quitan antes de buscar.
CITA_LINEA = re.compile(r"l[ií]neas?\s+\d+", re.I)


def cita_numero_de_linea(valor):
    return bool(CITA_LINEA.search(re.sub(r"<[^>]*>", " ", valor)))


def textos_de_detectaerror_mal(texto, cuerpo):
    """El TEXTO de un R3 multilingüe también depende del lenguaje.

    Un `DetectaError` cuyas `lineas` cambian con el lenguaje no puede citar un
    número de línea en un `enunciado` o una `explicacion` fijos: «la línea 7» es
    cierto en Python y falso en R, donde esa línea puede ser justamente la
    respuesta —el enunciado la regala mientras afirma otra cosa—.

    Es el mismo fallo silencioso que motivó la comprobación 6, pero en la prosa
    en vez de en la clave: se arregló `lineaCorrecta` y se dejó el texto fijo.
    Lo más robusto es redactar sin citar números; si hay que citarlos, la
    propiedad va por lenguaje.
    """
    fallos = []
    for bloque in bloques_de(cuerpo, "DetectaError"):
        if not idiomas_de_valor(texto, valor_de_prop(bloque, "lineas")):
            continue
        for prop in ("enunciado", "explicacion"):
            valor = valor_de_prop(bloque, prop)
            if valor is None or idiomas_de_valor(texto, valor):
                continue
            if cita_numero_de_linea(valor):
                fallos.append(
                    f"DetectaError · `{prop}` cita un número de línea y no es un "
                    f"objeto por lenguaje; como `lineas` sí lo es, ese número "
                    f"solo es cierto en uno de los dos")
    return fallos


def salida_mal_puesta(cuerpo):
    """La salida va DENTRO del bloque, con el prefijo `#>`.

    Dos fallos que se cuelan solos:
      · sobrevive la antigua propiedad `salidas={...}` de un panel aparte;
      · queda un prefijo de otro curso. Python y R comparten `#>`, así que
        aquí no hay «prefijo del lenguaje equivocado»; lo que sí aparece al
        adaptar material de Lógica de Programación son `//>` y `'>`, que en
        Python y en R no son comentario y rompen el bloque al copiarlo.
    """
    fallos = []
    if re.search(r"\bsalidas=\{", cuerpo):
        fallos.append("sobrevive una propiedad `salidas={...}`: la salida va dentro del bloque")

    # El `\n` final va en un lookahead: si se consume, el bloque siguiente se
    # queda sin el `\n` que necesita para empezar y solo se ve uno de cada dos.
    for m in re.finditer(r"\n            (python|r): `(.*?)`,(?=\n)", cuerpo, re.S):
        lang, codigo = m.group(1), m.group(2)
        for linea in codigo.split("\n"):
            s = linea.strip()
            for ajeno, curso in PREFIJOS_AJENOS.items():
                if s.startswith(ajeno):
                    fallos.append(
                        f"bloque `{lang}`: la línea «{s[:34]}» usa el prefijo de "
                        f"{curso}; en {lang} la salida se marca con `{PREFIJO_PROPIO}`")
                    break
    return fallos


def codetabs_incompletos(texto, cuerpo):
    """Cada `CodeTabs` trae los dos lenguajes, en constante o en línea."""
    fallos = []
    for bloque in bloques_de(cuerpo, "CodeTabs"):
        valor = valor_de_prop(bloque, "bloques")
        if valor is None:
            fallos.append("un CodeTabs sin propiedad `bloques`")
            continue
        v = valor.strip()
        if re.fullmatch(r"[A-Za-z0-9_]+", v) and cuerpo_de_constante(texto, v) is None:
            fallos.append(f"{v}: no se encontró su definición")
            continue
        idiomas = idiomas_de_valor(texto, valor) or []
        faltan = [l for l in LENGUAJES if l not in idiomas]
        if faltan:
            etiqueta = v if re.fullmatch(r"[A-Za-z0-9_]+", v) else "objeto en línea"
            fallos.append(f"{etiqueta}: faltan {', '.join(faltan)}")
    return fallos


# ---------------------------------------------------------------- 10 · color

MINIMO_WCAG = 3.0          # texto grande; el texto normal exige 4,5:1
FONDO_SUPUESTO = "#F8FAFC"

# Un uso ya revisado se calla escribiendo `contraste-ok` en su línea o en la
# anterior. Sin esa válvula, el aviso del `text-gold` legítimo de la barra
# lateral saldría en cada ejecución para siempre, y un aviso que siempre está
# ahí deja de leerse: la comprobación se volvería decorativa.
INDULTO = "contraste-ok"


def _luminancia(hexa):
    def canal(v):
        v /= 255
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (int(hexa[i:i + 2], 16) for i in (1, 3, 5))
    return 0.2126 * canal(r) + 0.7152 * canal(g) + 0.0722 * canal(b)


def razon_contraste(uno, otro):
    a, b = _luminancia(uno), _luminancia(otro)
    return (max(a, b) + 0.05) / (min(a, b) + 0.05)


def paleta_de(texto):
    """{nombre: '#RRGGBB'} de la configuración de Tailwind del head."""
    m = re.search(r"colors:\s*\{(.*?)\n\s*\}", texto, re.S)
    if not m:
        return {}
    return {n: h.upper() for n, h in re.findall(r"(\w+):\s*'(#[0-9A-Fa-f]{6})'", m.group(1))}


def linea_de(texto, pos):
    return texto.count("\n", 0, pos) + 1


def indultado(texto, pos):
    fin = texto.find("\n", pos)
    ini = texto.rfind("\n", 0, texto.rfind("\n", 0, pos))
    return INDULTO in texto[max(ini, 0):fin if fin != -1 else len(texto)]


def zona_jsx(texto):
    """(fragmento, desplazamiento) del JSX, dejando fuera el CSS del head.

    No vale reutilizar `cuerpo_capitulo` por dos motivos opuestos. Por abajo se
    queda corto: en un capítulo sin centinelas devuelve el archivo entero, y
    entonces se miden los colores de Prism —que van sobre el fondo oscuro de los
    bloques de código— contra el fondo claro de la página; todos incumplirían y
    ninguno sería un defecto. Por arriba se pasa: empieza en `TR-CORE FIN`, así
    que la librería no la auditaría nadie nunca.

    Se empieza, entonces, donde empieza el JSX y no antes.
    """
    i = texto.find('<script type="text/babel">')
    return (texto[i:], i) if i != -1 else (texto, 0)


def es_icono(texto, pos):
    """¿La clase está en un `<i>`? Un icono no es texto y no le aplica la regla.

    La convención del curso lo dice explícitamente: el lugar del gold son la
    barra lateral navy y los iconos. Sin esta excepción avisaría en todos los
    capítulos, y por un uso que está permitido.
    """
    abre = texto.rfind("<", 0, pos)
    return abre != -1 and re.match(r"<i[\s>]", texto[abre:abre + 3]) is not None


def contraste_dudoso(texto):
    """Colores demasiado tenues para ir como texto sobre el fondo de la página.

    Sale como AVISO y no como falla a propósito: `text-gold` es correcto dentro
    de la barra lateral navy e incorrecto sobre `#F8FAFC`. Distinguirlos exige
    saber qué elemento envuelve a cuál, y eso el análisis estático no lo resuelve
    de forma fiable. Un veredicto automático daría confianza falsa; una lista
    corta de sitios a confirmar, no.
    """
    cuerpo, desplazamiento = zona_jsx(texto)
    paleta = paleta_de(texto)
    if not paleta:
        return ["no se encontró la paleta del head: no se pudo medir nada"]
    fondo = paleta.get("bg", FONDO_SUPUESTO)

    avisos = []
    for nombre, hexa in sorted(paleta.items()):
        if nombre in ("bg", "surface"):
            continue
        razon = razon_contraste(hexa, fondo)
        if razon >= MINIMO_WCAG:
            continue
        lineas = [linea_de(texto, desplazamiento + m.start())
                  for m in re.finditer(r"\btext-" + nombre + r"\b", cuerpo)
                  if not indultado(cuerpo, m.start()) and not es_icono(cuerpo, m.start())]
        if lineas:
            avisos.append(
                f"`{nombre}` ({hexa}) da {razon:.2f}:1 sobre {fondo}, por debajo de "
                f"{MINIMO_WCAG}:1. Se usa como texto en la línea "
                f"{', '.join(map(str, lineas))} — confirme que va sobre fondo oscuro "
                f"y marque la línea con «{INDULTO}»")

    # Colores escritos a mano, fuera de la paleta, que sí son inequívocamente
    # texto: `text-[#RRGGBB]` de Tailwind y `color:` de un estilo en línea.
    for m in re.finditer(r"text-\[(#[0-9A-Fa-f]{6})\]|color:\s*'?(#[0-9A-Fa-f]{6})", cuerpo):
        hexa = (m.group(1) or m.group(2)).upper()
        razon = razon_contraste(hexa, fondo)
        if razon < MINIMO_WCAG and not indultado(cuerpo, m.start()):
            avisos.append(
                f"{hexa} da {razon:.2f}:1 sobre {fondo} y se usa como color de texto "
                f"en la línea {linea_de(texto, desplazamiento + m.start())}")
    return avisos


# ----------------------------------------------------------- 11 · enunciados

PIDE_PROGRAMA = re.compile(
    r"\b(?:escrib\w+|redact\w+|cree|creen|implement\w+|desarroll\w+|codifiqu\w+"
    r"|construy\w+|elabor\w+|program(?:e|en)|ajust\w+|estim\w+)"
    r"\s+(?:un|una|el|la|los|las|su|sus)?\s*"
    r"(?:programas?|funci[oó]n|funciones|algoritmos?|scripts?|cuadernos?"
    r"|procedimientos?|subrutinas?|modelos?)\b",
    re.I)

PROPS_ENUNCIADO = ("enunciado", "pregunta", "titulo")


def valores_de(cuerpo, nombre):
    """(posición, valor) de cada `nombre=` del cuerpo, con llaves equilibradas."""
    for m in re.finditer(r"\b" + nombre + r"\s*=\s*", cuerpo):
        i = m.end()
        if i >= len(cuerpo):
            continue
        if cuerpo[i] in "\"'":
            cierre = cuerpo.find(cuerpo[i], i + 1)
            yield i, cuerpo[i + 1:cierre if cierre != -1 else len(cuerpo)]
            continue
        if cuerpo[i] != "{":
            continue
        prof = 0
        for j in range(i, len(cuerpo)):
            if cuerpo[j] == "{":
                prof += 1
            elif cuerpo[j] == "}":
                prof -= 1
                if prof == 0:
                    yield i, cuerpo[i + 1:j]
                    break


def cuerpos_de_reto(cuerpo):
    """El enunciado de un R8 va en los hijos de `<Reto>`, no en una propiedad."""
    for m in re.finditer(r"<Reto\b", cuerpo):
        abre = cuerpo.find(">", m.end())
        fin = cuerpo.find("</Reto>", abre)
        if abre != -1 and fin != -1:
            yield abre, cuerpo[abre + 1:fin]


def pide_escribir_programa(texto, cuerpo, desplazamiento):
    """Ningún ejercicio pide escribir un programa ni ajustar un modelo desde cero.

    Está excluido por diseño de la taxonomía: aquí se traza, se audita, se
    compara, se interpreta y se justifica. Construir el modelo es de los
    talleres Quarto y del proyecto integrador.

    Se busca SOLO en enunciados —las propiedades y el cuerpo de `<Reto>`— y no
    en la prosa de la exposición. Ahí la frase es legítima («en el taller se le
    pedirá ajustar un GARCH a…») y marcarla como falla haría que el verificador
    mintiera, que es peor que no comprobar.
    """
    fallos = []
    trozos = [(p, v) for prop in PROPS_ENUNCIADO for p, v in valores_de(cuerpo, prop)]
    trozos += list(cuerpos_de_reto(cuerpo))
    for pos, valor in trozos:
        m = PIDE_PROGRAMA.search(re.sub(r"<[^>]*>", " ", valor))
        if m:
            fallos.append(
                f"línea {linea_de(texto, desplazamiento + pos)}: «{m.group(0)}» pide "
                f"construir desde cero, y la taxonomía lo excluye")
    return fallos


RE_OPCION = re.compile(r"\{\s*texto:\s*'((?:[^'\\]|\\.)*)'\s*,\s*correcta:\s*(true|false)")

# El enunciado se escribe de tres formas: atributo JSX (`pregunta="…"`), llave
# con cadena (`pregunta={'…'}`) y propiedad de objeto en el Quiz
# (`pregunta: '…'`). La cuarta —`pregunta={<>…</>}`— es JSX y no da cadena; la
# regla 14 la omite en vez de adivinar la semilla.
RE_PREGUNTA = re.compile(
    r"\bpregunta\s*(?:=\"([^\"]*)\"|=\{'((?:[^'\\]|\\.)*)'\}|:\s*'((?:[^'\\]|\\.)*)')")


def _sin_escapes(s):
    return s.replace("\\'", "'").replace('\\"', '"').replace("\\\\", "\\")


def enunciado_antes_de(cuerpo, tope):
    """El último `pregunta` literal que hay antes de `tope`, o None si es JSX."""
    ultimo = None
    for m in RE_PREGUNTA.finditer(cuerpo, 0, tope):
        ultimo = m
    if not ultimo:
        return None
    return _sin_escapes(next(g for g in ultimo.groups() if g is not None))


def grupos_de_opciones(cuerpo):
    """Las opciones del cuerpo, agrupadas por pregunta.

    Se barre por la PROPIEDAD y no por el nombre del componente: el
    `Comparador` monta un `MCQ` por dentro, así que un grep de `<MCQ` deja
    fuera una de las quince preguntas de cada capítulo.

    El corte entre preguntas sale del arreglo `opciones` —`={[…]}` en el JSX de
    un MCQ, `: […]` dentro de una pregunta del Quiz— y NO de dónde caiga la
    opción correcta. Inferirlo de `correcta: true` parece funcionar y falla en
    silencio en cuanto una pregunta no trae la correcta de primera: en el
    capítulo 5 fundía dos preguntas en una de ocho opciones y contaba catorce.
    """
    for m in re.finditer(r"\bopciones\s*(?:=\{\[|:\s*\[)", cuerpo):
        i = cuerpo.rfind("[", m.start(), m.end())
        prof = 0
        for j in range(i, len(cuerpo)):
            if cuerpo[j] == "[":
                prof += 1
            elif cuerpo[j] == "]":
                prof -= 1
                if prof == 0:
                    grupo = [(o.group(1), o.group(2) == "true", i + o.start())
                             for o in RE_OPCION.finditer(cuerpo[i:j])]
                    if grupo:
                        yield grupo, enunciado_antes_de(cuerpo, i)
                    break


# Una opción que no declara `correcta` no casa con RE_OPCION, y hasta hoy eso
# la hacía invisible: el capítulo 12 escribía sus distractores como
# `{ texto: '…' }` a secas y las reglas 13 y 14 auditaban 10 preguntas de 15
# creyendo que eran todas. Las cinco que se saltaban llevaban desde agosto con
# la correcta como la MÁS LARGA —el defecto que la regla 13 existe para cazar—.
RE_TEXTO_OPCION = re.compile(r"\{\s*texto:\s*'(?:[^'\\]|\\.)*'")


def opciones_incompletas(texto, cuerpo, desplazamiento):
    """Toda opción tiene que declarar `correcta`, o la regla no la ve."""
    fallos = []
    for m in re.finditer(r"\bopciones\s*(?:=\{\[|:\s*\[)", cuerpo):
        i = cuerpo.rfind("[", m.start(), m.end())
        prof = 0
        for j in range(i, len(cuerpo)):
            if cuerpo[j] == "[":
                prof += 1
            elif cuerpo[j] == "]":
                prof -= 1
                if prof == 0:
                    trozo = cuerpo[i:j]
                    declaradas = len(RE_OPCION.findall(trozo))
                    escritas = len(RE_TEXTO_OPCION.findall(trozo))
                    if escritas > declaradas:
                        fallos.append(
                            f"línea {linea_de(texto, desplazamiento + i)}: "
                            f"{escritas - declaradas} de {escritas} opciones no declaran "
                            f"`correcta`, así que las reglas 13 y 14 no las auditan")
                    break
    return fallos


def opciones_delatadas(texto, cuerpo, desplazamiento):
    """La correcta no se delata por su longitud, ni por arriba ni por abajo."""
    fallos, delatadas, cortas, total = [], 0, 0, 0
    for grupo, _ in grupos_de_opciones(cuerpo):
        correctas = [t for t, c, _ in grupo if c]
        otras = [t for t, c, _ in grupo if not c]
        if len(correctas) != 1 or not otras:
            continue
        total += 1
        larga = len(correctas[0])
        media = sum(len(o) for o in otras) / len(otras)
        pos = next(p for _, c, p in grupo if c)
        if larga > max(len(o) for o in otras):
            delatadas += 1
            fallos.append(
                f"línea {linea_de(texto, desplazamiento + pos)}: la opción correcta es la más "
                f"larga ({larga} caracteres contra {media:.0f} de media). Mueva su razonamiento "
                f"a `justificacion`")
        elif larga / media > RAZON_LONGITUD_MAXIMA:
            fallos.append(
                f"línea {linea_de(texto, desplazamiento + pos)}: la opción correcta mide "
                f"{larga / media:.1f} veces la media de sus distractores")
        elif larga / media < RAZON_LONGITUD_MINIMA:
            fallos.append(
                f"línea {linea_de(texto, desplazamiento + pos)}: la opción correcta mide "
                f"{larga / media:.2f} veces la media de sus distractores ({larga} caracteres "
                f"contra {media:.0f}). Complete el enunciado de la opción o recorte los "
                f"distractores: una correcta llamativamente corta delata igual que una larga")
        if larga < min(len(o) for o in otras):
            cortas += 1
    if total and delatadas / total > FRACCION_DELATADAS_MAXIMA:
        fallos.insert(0, f"la correcta es la más larga en {delatadas} de {total} preguntas — "
                         f"marcar la más larga sin leer basta para aprobar")
    if total and cortas / total > FRACCION_DELATADAS_MAXIMA:
        fallos.insert(0, f"la correcta es la más corta en {cortas} de {total} preguntas — "
                         f"marcar la más corta sin leer basta para aprobar")
    return fallos


def _fnv1a(cadena):
    """El hash de `hashTexto` en TR-CORE, byte a byte.

    `charCodeAt` de JavaScript devuelve unidades UTF-16. Para todo lo que el
    material escribe —α, σ, ², «», el menos tipográfico— coincide con `ord`;
    solo se separarían fuera del plano básico, y ahí no hay nada.
    """
    h = 0x811C9DC5
    for ch in cadena:
        h = ((h ^ (ord(ch) & 0xFFFFFFFF)) * 0x01000193) & 0xFFFFFFFF
    return h


def permutacion(n, semilla):
    """`barajarOpciones`: devuelve, por posición en pantalla, el índice fuente."""
    s = _fnv1a(semilla) or 1

    def siguiente():
        nonlocal s
        s = (s * 1664525 + 1013904223) & 0xFFFFFFFF
        return s / 4294967296

    out = list(range(n))
    for i in range(n - 1, 0, -1):
        j = int(siguiente() * (i + 1))
        out[i], out[j] = out[j], out[i]
    return out


def posiciones_delatadas(texto, cuerpo, desplazamiento):
    """La letra en la que sale la correcta no puede concentrarse ni faltar."""
    letras, detalle, omitidas = [], [], 0
    for grupo, enunciado in grupos_de_opciones(cuerpo):
        correctas = [p for _, c, p in grupo if c]
        if len(correctas) != 1 or len(grupo) < 2:
            continue
        if not enunciado:
            omitidas += 1
            continue
        orden = permutacion(len(grupo), enunciado)
        fuente = next(i for i, (_, c, _) in enumerate(grupo) if c)
        letra = chr(97 + orden.index(fuente))
        letras.append(letra)
        detalle.append((linea_de(texto, desplazamiento + correctas[0]), letra, orden))

    fallos = []
    if len(letras) < MINIMO_PREGUNTAS_POSICION:
        return fallos
    n, alfabeto = len(letras), sorted({chr(97 + i) for d in detalle for i in range(len(d[2]))})
    cuenta = {l: letras.count(l) for l in alfabeto}
    reparto = " · ".join(f"{l}:{cuenta[l]}" for l in alfabeto)

    vacias = [l for l in alfabeto if cuenta[l] == 0]
    if vacias:
        fallos.append(f"la correcta nunca sale en la ({'), la ('.join(vacias)}) — reparto "
                      f"{reparto} en {n} preguntas. Descartar esa opción sin leerla no cuesta nada")
    for l in alfabeto:
        if cuenta[l] / n > FRACCION_POSICION_MAXIMA:
            fallos.append(f"la correcta sale en la ({l}) {cuenta[l]} de {n} veces — reparto "
                          f"{reparto}")
    if fallos:
        fallos.append("la permutación sale del hash del ENUNCIADO, así que reescribir las "
                      "opciones no la mueve: hay que cambiar de índice la correcta en el "
                      "fuente. Destinos por pregunta:")
        for linea, letra, orden in detalle:
            mapa = " ".join(f"idx{i}→{chr(97 + orden.index(i))}" for i in range(len(orden)))
            fallos.append(f"  línea {linea}: hoy ({letra}) · {mapa}")
    if omitidas:
        fallos.append(f"{omitidas} pregunta(s) omitidas: su `pregunta` es JSX y la semilla "
                      f"no se puede reconstruir desde aquí")
    return fallos


def marcadores_delatados(texto, cuerpo, desplazamiento):
    """Ninguna marca de forma puede señalar a la correcta, ni al revés.

    Cada marca se mira por los dos lados: la opción que la lleva sola y la que
    se queda sola SIN ella. El segundo es como delata un conector que llevan
    los distractores y la correcta no —el «porque» del capítulo 9—: quien no
    lee marca la que desentona, lleve o no la marca.
    """
    grupos = [(g, e) for g, e in grupos_de_opciones(cuerpo)
              if sum(1 for _, c, _ in g if c) == 1 and len(g) > 1]
    fallos = []
    if len(grupos) < MINIMO_PREGUNTAS_POSICION:
        return fallos
    marcas = [(n, m, True) for n, m in MARCADORES_FORMA.items()]
    marcas += [(n, m, False) for n, m in MARCADORES_CONTENIDO.items()]
    for nombre, marca, mira_distractor in marcas:
        nc = nd = cc = cd = 0
        unica_corr = unica_dist = 0
        sola_corr = sola_dist = 0
        ev_con = ev_sin = 0.0
        for grupo, _ in grupos:
            marcadas = [i for i, (x, _, _) in enumerate(grupo) if marca(x)]
            sin_marca = [i for i in range(len(grupo)) if i not in marcadas]
            for lado in (marcadas, sin_marca):
                acierto = (sum(grupo[i][1] for i in lado) / len(lado) if lado
                           else 1 / len(grupo))
                if lado is marcadas:
                    ev_con += acierto
                else:
                    ev_sin += acierto
            for x, c, _ in grupo:
                if c:
                    nc += 1
                    cc += marca(x)
                else:
                    nd += 1
                    cd += marca(x)
            if len(marcadas) == 1:
                if grupo[marcadas[0]][1]:
                    unica_corr += 1
                else:
                    unica_dist += 1
            if len(sin_marca) == 1:
                if grupo[sin_marca[0]][1]:
                    sola_corr += 1
                else:
                    sola_dist += 1
        n = len(grupos)
        pc, pd = cc / nc, cd / nd
        if unica_corr / n > FRACCION_DELATADAS_MAXIMA:
            fallos.append(
                f"{nombre}: es la única opción marcada y es la correcta en {unica_corr} de "
                f"{n} preguntas — marcarla sin leer basta para aprobar")
        if mira_distractor and unica_dist / n > FRACCION_DELATADAS_MAXIMA:
            fallos.append(
                f"{nombre}: es la única opción marcada y NO es la correcta en {unica_dist} "
                f"de {n} preguntas — descartarla sin leer regala un distractor")
        if sola_corr / n > FRACCION_DELATADAS_MAXIMA:
            fallos.append(
                f"{nombre}: la única opción que NO la lleva es la correcta en {sola_corr} de "
                f"{n} preguntas — marcar la que desentona basta para aprobar")
        if mira_distractor and sola_dist / n > FRACCION_DELATADAS_MAXIMA:
            fallos.append(
                f"{nombre}: la única opción que NO la lleva es un distractor en {sola_dist} "
                f"de {n} preguntas — descartarla sin leer regala un distractor")
        if not mira_distractor:
            for lado, ev in (("con", ev_con), ("sin", ev_sin)):
                if ev / n > ACIERTO_CONTENIDO_MAXIMO:
                    fallos.append(
                        f"{nombre}: marcar al azar entre las opciones {lado} ella acierta "
                        f"{ev:.2f} de {n} donde el azar da {n / 4:.2f}".replace(".", ","))
        if abs(pc - pd) > BRECHA_MARCADOR_MAXIMA:
            arreglo = ("Dé la misma forma a uno o dos distractores por pregunta, o quítesela "
                       "a algunas de las correctas" if pc > pd else
                       "Désela a algunas correctas, o quítesela a uno o dos distractores por "
                       "pregunta")
            fallos.append(
                f"{nombre}: aparece en el {pc:.0%} de las correctas y en el {pd:.0%} de los "
                f"distractores. {arreglo}")
    return fallos


RE_CADENA = re.compile(r"'(?:[^'\\]|\\.)*'")


def largo_de_arreglo(valor):
    """Cuántas cadenas trae un arreglo literal `['…', '…']`, o None si no lo es."""
    v = (valor or "").strip()
    if not (v.startswith("[") and v.endswith("]")):
        return None
    interior = v[1:-1]
    if re.fullmatch(r"[\s,]*", RE_CADENA.sub("", interior)) is None:
        return None
    return len(RE_CADENA.findall(interior))


def emparejamientos_delatados(texto, cuerpo, desplazamiento):
    """La columna derecha no se baraja: la solución no puede seguir las filas."""
    fallos = []
    for m, bloque in zip(re.finditer(r"<Emparejamiento[\s/>]", cuerpo),
                         bloques_de(cuerpo, "Emparejamiento")):
        donde = f"línea {linea_de(texto, desplazamiento + m.start())}"
        crudo = valor_de_prop(bloque, "solucion")
        if crudo is None:
            fallos.append(f"{donde}: falta `solucion`. El componente la lee sin comprobarla y "
                          f"la página queda en blanco")
            continue
        lectura = re.fullmatch(r"\s*\[([\d\s,]*)\]\s*", crudo)
        if not lectura:
            fallos.append(f"{donde}: `solucion` no es un arreglo literal de índices y esta "
                          f"regla no la puede auditar. Escríbala en el sitio")
            continue
        sol = [int(x) for x in re.findall(r"\d+", lectura.group(1))]
        n = len(sol)
        # La derecha puede traer opciones de sobra —el componente solo exige
        # emparejar toda la izquierda—, así que `solucion` no tiene por qué ser
        # una permutación de la derecha: basta con que no repita y no se salga.
        n_izq = largo_de_arreglo(valor_de_prop(bloque, "izquierda"))
        n_der = largo_de_arreglo(valor_de_prop(bloque, "derecha"))
        rotas = []
        if not sol:
            rotas.append("está vacía")
        if len(set(sol)) != n:
            rotas.append("repite un índice, y dos filas no pueden tener la misma pareja")
        if n_izq is not None and n_izq != n:
            rotas.append(f"trae {n} índices para {n_izq} filas de la izquierda")
        if n_der is not None and sol and max(sol) >= n_der:
            rotas.append(f"apunta al índice {max(sol)} y `derecha` llega al {n_der - 1}")
        if rotas:
            fallos.append(f"{donde}: `solucion` = {sol} {'; '.join(rotas)}. El ejercicio no "
                          f"llega a la nota entera")
            continue
        fijas = [i for i in range(n) if sol[i] == i]
        if len(fijas) > PAREJAS_EN_SU_FILA_MAXIMAS:
            cuales = ", ".join(f"{i + 1}→{chr(65 + i)}" for i in fijas)
            que = ("es la identidad" if len(fijas) == n
                   else f"deja {len(fijas)} de {n} parejas en su fila ({cuales})")
            fallos.append(
                f"{donde}: `solucion` = {sol} {que}. El componente no baraja la columna "
                f"derecha, así que emparejar cada fila con la de enfrente acierta "
                f"{len(fijas)} de {n} sin leer, donde el azar acierta una. Reordene "
                f"`derecha` y reescriba `solucion`: solucion[i] es el índice en `derecha` "
                f"de la pareja de izquierda[i]")
    return fallos


# ------------------------------------------------ 18 a 21 · fuentes y referencias
# Hasta el 2026-11-11 ningún capítulo tenía bibliografía y ninguna regla miraba
# fuentes. Las reglas 18 a 24 son las 26 a 32 de Lógica de Programación
# Financiera (LPF), copiadas y adaptadas ese día: el mismo código, los mismos
# mensajes, otra numeración. Las notas «En LPF, negativas del 2026-11-10» son las
# pruebas que se hicieron allá, con las claves de aquel curso; las de este, que
# se pueden volver a correr, están en `pruebas_fuentes/negativas.py`.
#
# Las citas son `<Cita k>`, `<Fuente k>`, `<FichaNorma k>` y `<ChartFrame fuente>`; las
# entradas salen de Zotero a `_fuentes/referencias.json` y `estampar_referencias.py`
# las deja formateadas en una isla de JSON entre centinelas TR-REFS, después del
# script Babel. Todo lo que es leer —claves citadas, isla, huella, sello— vive en
# `fuentes.py`, que comparten el estampador y estas reglas: si cada uno leyera
# las citas a su manera, estamparían una cosa y verificarían otra.
#
# Los capítulos reales no citan todavía: sin una copia que cite, estas reglas
# pasarían sin haber mirado nada. `negativas.py` arma esa copia —el capítulo 1
# con citas a las obras ficticias de `pruebas_fuentes/`— y le cambia una cosa
# cada vez.

class Fuentes:
    """`referencias.json` y el estilo, leídos una vez para todos los capítulos."""

    def __init__(self, directorio=None):
        self.directorio = Path(directorio) if directorio else fuentes.DIR_FUENTES
        self.error = None
        self.entradas, self.indice, self.sha_csl = [], {}, None
        try:
            self.entradas = fuentes.leer_referencias(self.directorio)
            self.indice = fuentes.por_clave(self.entradas)
            self.sha_csl = fuentes.sha_csl(self.directorio)
        except fuentes.ErrorFuentes as e:
            self.error = str(e)


def _citas_del_capitulo(texto):
    """(claves en orden, {clave: línea de su primera cita}, problemas de lectura)."""
    citas, problemas = fuentes.citas_de(texto)
    lineas = {}
    for pos, _componente, claves, _loc in citas:
        for c in claves:
            lineas.setdefault(c, linea_de(texto, pos))
    return list(lineas), lineas, [f"línea {linea_de(texto, pos)}: {msg}" for pos, msg in problemas]


def _recomendadas_del_capitulo(texto):
    """(claves en orden, {clave: línea}, problemas de lectura, [posición de cada lista])."""
    listas, problemas = fuentes.recomendadas_de(texto)
    lineas = {}
    for pos, claves in listas:
        for c in claves:
            lineas.setdefault(c, linea_de(texto, pos))
    return (list(lineas), lineas, [f"línea {linea_de(texto, pos)}: {msg}" for pos, msg in problemas],
            [pos for pos, _ in listas])


def _isla_del_capitulo(texto):
    """(bloque o None, error o None). El error es de forma: lo informa la 20."""
    try:
        return fuentes.leer_isla(texto), None
    except fuentes.ErrorFuentes as e:
        return None, str(e)


# ------------------------------------------------------ 18 · clave citada existe
# En LPF, negativas del 2026-11-10: «ficticio_autor2019» escrito «ficticio_autor2091»
# falla dos veces (no está en referencias.json ni en la isla); `k={clave}` falla
# por no ser literal; una segunda cita, a una clave que sí está en
# referencias.json, falla hasta que se vuelve a estampar; `k="a; b"` con `loc`
# falla por no decir de cuál de las dos es la página; `fuente={miFuente}` en un
# `ChartFrame` falla por lo mismo que `k={clave}`; y «Ficticio_Ley2009», con
# mayúsculas, falla por no ser una clave. Con los centinelas duplicados no dice
# nada de la isla: eso lo dice la 20, una sola vez.
#
# Desde `<ParaProfundizar>` la regla mira también las claves recomendadas, con
# las mismas tres exigencias y una más: que no estén citadas. Negativas del
# 2026-11-10, sobre una copia del capítulo 1 con sus dieciséis fuentes citadas
# y sus cinco recomendadas: «goldberg1991» escrito «goldberg1919» falla dos
# veces (no está en referencias.json ni entre las lecturas de la isla);
# `k={lecturas}` falla por no ser literal; una sexta clave, que sí está en
# referencias.json, falla hasta que se vuelve a estampar; añadir a `k` una
# clave que el capítulo cita falla por estar en las dos listas; `titulo="…"`
# falla, porque el título es fijo; una clave repetida dentro de `k` falla; y
# `<ParaProfundizar />` sin `k`, también.
def clave_citada_inexistente(texto, fnt):
    claves, lineas, problemas = _citas_del_capitulo(texto)
    recomendadas, lineas_rec, problemas_rec, _ = _recomendadas_del_capitulo(texto)
    problemas += problemas_rec
    isla, isla_ilegible = _isla_del_capitulo(texto)
    en_isla = isla["entradas"] if isla else {}
    _, lecturas_en_isla = fuentes.profundizar_de(isla)
    for c in claves:
        if c not in fnt.indice:
            problemas.append(f"línea {lineas[c]}: se cita «{c}», que no está en "
                             f"{fuentes.ARCHIVO_REFERENCIAS}; ¿falta en la colección de Zotero, "
                             f"o exportar con exportar_zotero.py?")
        # Una isla que no se pudo leer la denuncia la 20, una vez; decir además
        # de cada cita que «no está en la isla» taparía ese único mensaje.
        if c not in en_isla and not isla_ilegible:
            problemas.append(f"línea {lineas[c]}: se cita «{c}», que no está en la isla de "
                             f"referencias del capítulo; ejecute estampar_referencias.py")
    for c in recomendadas:
        if c in lineas:
            # No se sigue con la isla: el estampador se niega a escribirla así,
            # y decir además «no está entre las lecturas» manda a estampar algo
            # que no se puede estampar.
            problemas.append(f"línea {lineas_rec[c]}: <ParaProfundizar> recomienda «{c}», que el "
                             f"capítulo cita en la línea {lineas[c]}. Lo citado ya está en "
                             f"«Referencias»: quítela de `k`")
            continue
        if c not in fnt.indice:
            problemas.append(f"línea {lineas_rec[c]}: <ParaProfundizar> recomienda «{c}», que no "
                             f"está en {fuentes.ARCHIVO_REFERENCIAS}; ¿falta en la colección de "
                             f"Zotero, o exportar con exportar_zotero.py?")
        if c not in lecturas_en_isla and not isla_ilegible:
            problemas.append(f"línea {lineas_rec[c]}: <ParaProfundizar> recomienda «{c}», que no "
                             f"está entre las lecturas de la isla de referencias del capítulo; "
                             f"ejecute estampar_referencias.py")
    return problemas


# ------------------------------------------------------ 19 · referencias exactas
# La lista tiene que ser exactamente lo citado. Una entrada de más es una obra
# que el capítulo dice haber usado y no usa; y la lista en otra lección que la
# última es una cita que lleva a una página donde no está su entrada, porque
# `Cita` manda siempre a `'ultima'`. En LPF, negativas del 2026-11-10: sin
# `<Referencias />` falla; con dos falla; con el único en la primera lección
# falla; al quitar una de las dos citas sin volver a estampar falla, por la
# entrada que sobra; y una isla en un capítulo que no cita nada, también. Los
# cinco capítulos reales de LPF, sin citas y sin isla, pasan.
#
# Con `<ParaProfundizar>` la isla trae dos listas y cada una tiene que ser
# exacta. En LPF, negativas del 2026-11-10, sobre la misma copia del capítulo 1: quitar
# una clave de `k` sin volver a estampar falla, por la lectura que sobra en la
# isla; quitar el componente entero falla por las cinco; dos
# `<ParaProfundizar>` fallan; el único, puesto antes de `<Referencias />`,
# falla; puesto en la primera lección, falla; y borrar a mano una clave del
# `orden` de `profundizar` falla aquí —`orden` y `entradas` ya no traen lo
# mismo— además de romper el sello en la 20. En una copia del capítulo 2, que
# no cita nada, un `<ParaProfundizar>` solo en su última lección, estampado,
# pasa: recomendar no obliga a citar ni a tener `<Referencias />`.
def _ultima_leccion(limpio):
    """(nombre, inicio, fin) del componente de la última lección, o None."""
    m = re.search(r"const\s+curriculum\s*=\s*\[(.*?)\n\s*\];", limpio, re.S)
    if not m:
        return None
    componentes = re.findall(r"component:\s*([A-Za-z0-9_]+)", m.group(1))
    if not componentes:
        return None
    d = re.search(r"\n {8}const\s+" + componentes[-1] + r"\s*=", limpio)
    if not d:
        return None
    # Hasta la siguiente declaración con la sangría de las del capítulo.
    fin = re.compile(r"\n {8}(?:const|let|var|function)\s").search(limpio, d.end())
    return componentes[-1], d.start(), fin.start() if fin else len(limpio)


def referencias_inexactas(texto):
    claves, _lineas, _ = _citas_del_capitulo(texto)
    isla, _ = _isla_del_capitulo(texto)
    zona, base = fuentes.zona_de_contenido(texto)
    limpio = fuentes.sin_comentarios(zona)
    listas = [m.start() for m in re.finditer(r"<Referencias(?=[\s/>])", limpio)]
    recomendadas, _lineas_rec, _, _ = _recomendadas_del_capitulo(texto)
    # Las posiciones se toman del texto y no de `recomendadas_de`: un
    # `<ParaProfundizar />` sin claves no da ninguna lista, y sigue estando ahí.
    lecturas = [m.start() for m in re.finditer(r"<ParaProfundizar(?=[\s/>])", limpio)]
    problemas = []

    if isla is not None:
        en_isla = list(isla["entradas"])
        sobran = sorted(set(en_isla) - set(claves))
        if sobran:
            problemas.append(f"la isla de referencias trae {len(sobran)} entradas que el capítulo "
                             f"no cita: {', '.join(sobran)}; ejecute estampar_referencias.py")
        if sorted(isla["orden"]) != sorted(en_isla):
            problemas.append("en la isla de referencias, `orden` y `entradas` no traen las "
                             "mismas claves; ejecute estampar_referencias.py")
        orden_rec, lecturas_en_isla = fuentes.profundizar_de(isla)
        sobran = sorted(set(lecturas_en_isla) - set(recomendadas))
        if sobran:
            problemas.append(f"la isla de referencias trae {len(sobran)} lecturas que "
                             f"<ParaProfundizar> no recomienda: {', '.join(sobran)}; ejecute "
                             f"estampar_referencias.py")
        if sorted(map(str, orden_rec)) != sorted(lecturas_en_isla):
            problemas.append("en la isla de referencias, el `orden` y las `entradas` de "
                             "`profundizar` no traen las mismas claves; ejecute "
                             "estampar_referencias.py")

    ultima = _ultima_leccion(limpio)
    problemas += _lista_de_lecturas_mal_puesta(texto, base, lecturas, listas, ultima)

    if not claves:
        for pos in listas:
            problemas.append(f"línea {linea_de(texto, base + pos)}: hay un <Referencias /> y el "
                             f"capítulo no cita nada; la lista saldría vacía")
        return problemas

    if not listas:
        problemas.append(f"el capítulo cita {len(claves)} fuentes y no tiene <Referencias />: "
                         f"las citas no llevan a ninguna parte")
        return problemas
    if len(listas) > 1:
        donde = ", ".join(str(linea_de(texto, base + pos)) for pos in listas)
        problemas.append(f"hay {len(listas)} <Referencias /> (líneas {donde}) y debe haber uno: "
                         f"dos listas son dos elementos con el mismo id=\"ref-…\"")
        return problemas
    if ultima is None:
        problemas.append("no se encontró el componente de la última lección del `curriculum`: "
                         "no se pudo comprobar dónde está <Referencias />")
    elif not ultima[1] <= listas[0] < ultima[2]:
        problemas.append(f"línea {linea_de(texto, base + listas[0])}: <Referencias /> no está en "
                         f"`{ultima[0]}`, la última lección; las citas llevan a la última, y "
                         f"ahí no encontrarían su entrada")
    return problemas


def _lista_de_lecturas_mal_puesta(texto, base, lecturas, listas, ultima):
    """Lo que la 19 exige de `<ParaProfundizar>`: uno, al final, tras `<Referencias />`.

    Va donde un lector busca la bibliografía y debajo de ella, para que se lea
    en ese orden: primero de dónde salió lo que el capítulo afirma, después qué
    más se puede leer.
    """
    if not lecturas:
        return []
    if len(lecturas) > 1:
        donde = ", ".join(str(linea_de(texto, base + pos)) for pos in lecturas)
        return [f"hay {len(lecturas)} <ParaProfundizar> (líneas {donde}) y debe haber uno: la "
                f"lista de lecturas del capítulo es una sola"]
    pos = lecturas[0]
    linea = linea_de(texto, base + pos)
    problemas = []
    if ultima is None:
        if not listas:          # con <Referencias /> ya lo dice la propia 19, más abajo
            problemas.append("no se encontró el componente de la última lección del `curriculum`: "
                             "no se pudo comprobar dónde está <ParaProfundizar>")
    elif not ultima[1] <= pos < ultima[2]:
        problemas.append(f"línea {linea}: <ParaProfundizar> no está en `{ultima[0]}`, la última "
                         f"lección, que es donde el lector busca la bibliografía")
    if len(listas) == 1 and pos < listas[0]:
        problemas.append(f"línea {linea}: <ParaProfundizar> está antes de <Referencias /> (línea "
                         f"{linea_de(texto, base + listas[0])}) y va después: primero lo que el "
                         f"capítulo cita, luego lo que recomienda")
    return problemas


# ------------------------------------------------------------ 20 · bloque al día
# La isla es una copia: de `referencias.json`, pasada por pandoc. Como toda
# copia, envejece sin avisar —se corrige un año en Zotero, se exporta, y el
# capítulo sigue mostrando el anterior— y se puede retocar a mano. La `huella`
# resume lo que entró y el `sello` lo que salió, y los dos se recalculan aquí
# sin pandoc. En LPF, negativas del 2026-11-10: cambiar una palabra de una entrada de
# la isla rompe el sello; cambiar el año de esa obra en una copia de
# `referencias.json`, o un byte de una copia de `apa-es.csl`, rompe la huella;
# duplicar el centinela TR-REFS INICIO falla; y mover la isla dentro del script
# Babel, también. Lo que la huella y el sello no ven —una isla retocada a mano
# con el sello vuelto a calcular— lo ve `--con-pandoc`, que la formatea otra vez:
# un «2.ª ed.» cambiado por «3.ª ed.» y sellado de nuevo pasa sin la opción y
# falla con ella. Y un `<em>` escrito sin escapar, con el JSON intacto, falla
# por no estar escrita como la escribe el estampador.
#
# La versión 2 del formato añade `profundizar`, y la huella y el sello lo
# cubren. En LPF, negativas del 2026-11-10, sobre la copia del capítulo 1 con sus cinco
# lecturas: cambiar una palabra de una lectura en la isla rompe el sello;
# cambiar el año de `goldberg1991` en una copia de `referencias.json` rompe la
# huella, aunque el capítulo no la cite; pasar una clave de `k` a una `<Cita>`
# —sin tocar referencias.json— la rompe también, porque entran los dos
# conjuntos por separado; quitar `profundizar` de la isla y volver a sellarla
# falla por no traerlo; poner `"v": 1` falla por la versión; una lectura con
# `autor` y `anio` de más falla; y, con `--con-pandoc`, «(3.ª ed.)» cambiado
# por «(4.ª ed.)» en una lectura y sellado de nuevo falla diciendo cuál.
def bloque_desactualizado(ruta, texto, fnt, con_pandoc=False):
    """(problemas, avisos) de la isla de referencias del capítulo."""
    isla, error = _isla_del_capitulo(texto)
    if error:
        return [error], []
    if isla is None:
        return [], []
    problemas, avisos = [], []

    mal_puesta = fuentes.isla_bien_puesta(texto)
    if mal_puesta:
        problemas.append(mal_puesta)
    if isla.get("v") != fuentes.VERSION:
        problemas.append(f"la isla de referencias es de la versión {isla.get('v')} del formato "
                         f"y este verificador lee la {fuentes.VERSION}; ejecute estampar_referencias.py")
        return problemas, avisos
    for clave, entrada in isla["entradas"].items():
        campos = entrada if isinstance(entrada, dict) else {}
        if not all(isinstance(campos.get(c), str) and campos.get(c)
                   for c in ("autor", "anio", "html", "plano")):
            problemas.append(f"la entrada «{clave}» de la isla no trae autor, anio, html y plano")
        elif not all(fuentes.solo_etiquetas_permitidas(campos[c]) for c in ("autor", "anio", "html")):
            problemas.append(f"la entrada «{clave}» de la isla trae etiquetas distintas de "
                             f"em, i, sup, sub y a[href]")
    lecturas = isla.get("profundizar")
    if not (isinstance(lecturas, dict) and set(lecturas) == {"orden", "entradas"}
            and isinstance(lecturas["orden"], list) and isinstance(lecturas["entradas"], dict)):
        problemas.append("la isla de referencias no trae `profundizar` con su `orden` y sus "
                         "`entradas` (y nada más); ejecute estampar_referencias.py")
    else:
        for clave, entrada in lecturas["entradas"].items():
            campos = entrada if isinstance(entrada, dict) else {}
            if set(campos) != {"html", "plano"} or not all(isinstance(v, str) and v for v in campos.values()):
                problemas.append(f"la lectura «{clave}» de la isla no trae exactamente html y plano")
            elif not fuentes.solo_etiquetas_permitidas(campos["html"]):
                problemas.append(f"la lectura «{clave}» de la isla trae etiquetas distintas de "
                                 f"em, i, sup, sub y a[href]")
    if fuentes.sello(isla) != isla.get("sello"):
        problemas.append("la isla de referencias se editó a mano: su sello no corresponde a su "
                         "contenido. Las entradas se corrigen en Zotero; después, "
                         "exportar_zotero.py y estampar_referencias.py")
    tramo = fuentes.tramo_isla(texto)
    if texto[tramo[0]:tramo[1]] != fuentes.texto_de_isla(isla):
        problemas.append("la isla de referencias no está escrita como la escribe "
                         "estampar_referencias.py (sangría, orden de los campos o un `<` sin "
                         "escapar); vuelva a estamparla")

    claves, _lineas, ilegibles = _citas_del_capitulo(texto)
    recomendadas, _lineas_rec, ilegibles_rec, _ = _recomendadas_del_capitulo(texto)
    faltan = [c for c in claves + recomendadas if c not in fnt.indice]
    en_las_dos = [c for c in recomendadas if c in claves]
    if fnt.error:
        avisos.append(f"referencias — {fnt.error}: no se pudo recalcular la huella de la isla")
    elif faltan or ilegibles or ilegibles_rec or en_las_dos:
        pass                    # ya lo dice la regla 18; sin esas entradas no hay huella que comparar
    elif fuentes.huella([fnt.indice[c] for c in claves], fnt.sha_csl,
                        entradas_recomendadas=[fnt.indice[c] for c in recomendadas]) != isla.get("huella"):
        problemas.append(f"la isla de referencias está desactualizada: cambió alguna fuente "
                         f"citada o recomendada en {fuentes.ARCHIVO_REFERENCIAS}, el estilo "
                         f"{fuentes.ARCHIVO_CSL}, el conjunto de citas o el de "
                         f"<ParaProfundizar>. Ejecute estampar_referencias.py")
    elif con_pandoc:
        import estampar_referencias
        try:
            esperado = estampar_referencias.bloque_para(texto, fnt.entradas, fnt.directorio)[0]
        except estampar_referencias.SinPandoc as e:
            avisos.append(f"referencias — {e}: no se pudo volver a formatear la isla")
        except (estampar_referencias.Fallo, fuentes.ErrorFuentes) as e:
            problemas.append(f"al volver a formatear la isla con pandoc: {e}")
        else:
            if esperado != isla:
                lecturas_hoy, lecturas_isla = fuentes.profundizar_de(esperado)[1], fuentes.profundizar_de(isla)[1]
                distintas = sorted([c for c in esperado["entradas"]
                                    if esperado["entradas"][c] != isla["entradas"].get(c)]
                                   + [c for c in lecturas_hoy if lecturas_hoy[c] != lecturas_isla.get(c)])
                problemas.append("la isla de referencias no es la que pandoc produce hoy"
                                 + (f" (difieren: {', '.join(distintas)})" if distintas else
                                    " (difiere el orden)")
                                 + "; ejecute estampar_referencias.py")
    return problemas, avisos


# ----------------------------------------------------------- 21 · entrada verificable
# Corre una vez, sobre `referencias.json`, como la isla de la demo. Una
# entrada sin autor o sin título no se puede citar; una sin DOI, ISBN ni URL no
# se puede ir a buscar; y una página web sin fecha de consulta no dice qué
# versión se leyó. La lista blanca es lo único que impide que un resumen o una
# nota de lectura del docente acabe en un repositorio público. Negativas del
# 2026-11-10, sobre copias de `pruebas_fuentes/`: quitar `author` falla; quitar
# el ISBN del libro falla; quitar `accessed` de la página web falla (y no de la
# que tiene DOI); añadir `abstract` falla; repetir una clave falla; desordenar
# las entradas falla; y sin `referencias.json` en la carpeta, también. La isla
# de la demo se probó igual: cambiar un año del accesorio sin volver a ejecutar
# `estampar_referencias.py --demo` falla aquí, antes de mirar ningún capítulo.
#
# Desde ese mismo día, con la bibliografía del curso ya exportada, lo que falta
# para verificar una entrada —autor, título, identificador, fecha de consulta—
# solo falla si algún capítulo la cita. `becerra1996` es un libro impreso sin
# ISBN que está en el syllabus y que nadie cita: bloquear por él era obligar a
# sacarlo de la bibliografía o a inventarle un identificador. Lo que se publica
# tal cual —la clave, la lista blanca, el orden, los repetidos— falla siempre.
# En LPF, negativas del 2026-11-10: `becerra1996` sin citar avisa y no falla; citado en
# una copia del capítulo 1, falla; un `abstract` en esa misma entrada, sin
# citarla, falla igual; `psf2026flotante`, que sí se cita, falla al quitarle el
# autor; y una página web que nadie cita avisa al quitarle la fecha de consulta.
#
# Recomendar una obra en «Para profundizar» cuenta como citarla para esta
# regla: es mandar al lector a buscarla, y sin DOI, ISBN ni URL no tiene por
# dónde. En LPF, negativas del 2026-11-10: `becerra1996` añadida al `k` del capítulo 1
# falla diciendo que se recomienda; `joyanes2003`, que está en ese `k`, falla
# al quitarle el ISBN en una copia de referencias.json, y con el ISBN puesto
# pasa.
def claves_usadas_en_el_material(rutas):
    """(citadas, recomendadas) en algún capítulo: los del material y los que se verifican."""
    citadas, recomendadas = set(), set()
    for ruta in set(MATERIAL.glob(PATRON_CAPITULO)) | set(rutas):
        try:
            texto = Path(ruta).read_text(encoding="utf-8")
        except OSError:
            continue
        citadas.update(fuentes.claves_citadas(texto))
        recomendadas.update(fuentes.claves_recomendadas(texto))
    return citadas, recomendadas


def entradas_no_verificables(fnt, citadas=frozenset(), recomendadas=frozenset()):
    """(problemas, avisos) de `referencias.json`."""
    if fnt.error:
        return [fnt.error], []
    problemas, avisos = [], []
    for clave, problema, clase in fuentes.problemas_del_archivo(fnt.entradas):
        if clase == "forma":
            problemas.append(f"{clave}: {problema}")
        elif clave in citadas:
            problemas.append(f"{clave}: {problema} — y se cita")
        elif clave in recomendadas:
            problemas.append(f"{clave}: {problema} — y se recomienda en «Para profundizar»")
        else:
            avisos.append(f"{clave}: {problema} (nadie la cita todavía)")
    return problemas, avisos


# ------------------------------------------------------------ 23 · afirmación leída
# La isla dice cómo se escribe una referencia; no dice que alguien haya leído lo
# que se le atribuye. Eso está en el vault, que es privado: una nota por
# afirmación, con el pasaje de la fuente. `registrar_afirmaciones.py` saca de
# ahí lo que puede publicarse —qué pasaje del capítulo, qué fuente, qué lugar
# de ella, quién lo leyó y cuándo, y el sha256 del extracto— a
# `_fuentes/afirmaciones/NN.yaml`, y esta regla lo cruza con el capítulo.
#
# En LPF, negativas del 2026-11-10, sobre una copia del capítulo 1 con sus seis citas,
# la isla y una copia del registro: cambiar `loc="cap. 15"` por `loc="cap. 14"`
# falla, porque nadie leyó ese capítulo; una séptima cita, a una fuente que
# está en referencias.json y estampada, falla por no tener fila; cambiar en el
# texto «tiene 53 bits de precisión» por «tiene 52…» falla, porque el ancla ya
# no está; vaciar `leido.fecha` de una fila falla; borrar el registro falla;
# añadirle a una fila un campo `extracto` falla, y con razón: es lo único que
# no puede publicarse. Quitar una cita y dejar su fila avisa y no falla. Y
# `loc` con espacio duro pasa contra el «cap. 15» del registro. Un registro
# retocado a mano —un valor sin comillas— falla diciendo en qué línea; y un
# ancla que solo queda dentro de un comentario del capítulo no cuenta.
#
# La regla nació fallando: al escribir el piloto, un salto de renglón quedó en
# medio de «guarda los importes como enteros con escala» y el ancla dejó de
# encontrarse, con el texto intacto. Por eso los saltos se igualan a un espacio
# antes de buscar, y un ancla partida entre dos renglones pasa.
#
# Las obras de `<ParaProfundizar>` no entran: la regla parte de `citas_de`, y
# recomendar no es citar. En LPF, negativas del 2026-11-10: el capítulo 1 pasa con sus
# cinco lecturas sin ninguna fila; una fila escrita para una de ellas avisa
# —«que el capítulo ya no cita»— y no falla; y esa misma obra, sacada de `k` y
# puesta en una `<Cita>`, falla como cualquier cita sin fila.
def afirmaciones_sin_registro(ruta, texto, fnt):
    """(problemas, avisos) del cruce entre las citas del capítulo y su registro."""
    citas, ilegibles = fuentes.citas_de(texto)
    pares = {}
    for pos, _componente, claves, loc in citas:
        for c in claves:
            pares.setdefault((c, fuentes.sin_espacio_duro(loc)), linea_de(texto, pos))
    nn = fuentes.numero_de_capitulo(ruta.name)
    if nn is None:
        return [], ([f"afirmaciones — «{ruta.name}» no empieza por el número del capítulo: no "
                     f"se sabe qué registro le corresponde y no se comprobó"] if pares else [])
    try:
        filas = fuentes.leer_registro(nn, fnt.directorio)
    except fuentes.ErrorFuentes as e:
        return [str(e)], []
    nombre = f"{fuentes.DIR_AFIRMACIONES}/{nn}.yaml"
    if filas is None:
        if not pares:
            return [], []
        return [f"el capítulo cita {len(pares)} pasajes y no existe {nombre}: no hay constancia "
                f"de que nadie los haya leído. Ejecute registrar_afirmaciones.py"], []

    problemas, avisos = [], []
    zona, _ = fuentes.zona_de_contenido(texto)
    # El ancla es texto literal del capítulo, salvo por dónde se parte el
    # renglón: eso no lo ve quien lee (ver `sin_saltos`).
    limpio = fuentes.sin_saltos(fuentes.sin_comentarios(zona))
    permitidos = set(fuentes.CAMPOS_FILA) | {"leido", "extracto_sha256"}
    respaldados, vistos = set(), set()
    for f in filas:
        ident = f.get("id") or "(sin id)"
        if ident in vistos:
            problemas.append(f"{nombre}: el id «{ident}» está repetido")
        vistos.add(ident)
        de_mas = sorted(set(f) - permitidos)
        if de_mas:
            problemas.append(f"{nombre}, fila {ident}: trae campos que el registro no lleva "
                             f"({', '.join(de_mas)}). El extracto de la fuente no se publica: "
                             f"vuelva a generarlo con registrar_afirmaciones.py")
        if not re.fullmatch(r"[0-9a-f]{64}", str(f.get("extracto_sha256", ""))):
            problemas.append(f"{nombre}, fila {ident}: `extracto_sha256` no es un sha256")
        leido = f.get("leido") if isinstance(f.get("leido"), dict) else {}
        leida = all(str(leido.get(c, "")).strip() for c in fuentes.CAMPOS_LEIDO)
        if not leida:
            problemas.append(f"{nombre}, fila {ident}: no dice quién leyó el pasaje, cuándo y "
                             f"por qué medio (`leido`)")
        ancla = str(f.get("ancla", ""))
        if not ancla.strip():
            problemas.append(f"{nombre}, fila {ident}: no tiene `ancla`")
        elif fuentes.sin_saltos(ancla) not in limpio:
            problemas.append(f"{nombre}, fila {ident}: su ancla «{ancla}» ya no está en el "
                             f"capítulo. El texto que se respaldó con «{f.get('clave')}» cambió: "
                             f"hay que volver a leerlo contra la fuente y actualizar la nota")
        par = (f.get("clave"), fuentes.sin_espacio_duro(f.get("loc", "")))
        if par in pares:
            if leida:
                respaldados.add(par)
        else:
            avisos.append(f"afirmaciones — {nombre}, fila {ident}: respalda «{par[0]}"
                          f"{', ' + par[1] if par[1] else ''}», que el capítulo ya no cita")
    for (clave, loc), linea in sorted(pares.items(), key=lambda x: x[1]):
        if (clave, loc) not in respaldados:
            problemas.append(f"línea {linea}: se cita «{clave}{', ' + loc if loc else ''}» y ninguna "
                             f"fila leída de {nombre} lo respalda: no hay constancia de que "
                             f"alguien haya ido a ese pasaje")
    return problemas, avisos


# ----------------------------------- 22 y 24 · figuras y menciones sin fuente
# Las dos viven en `comprobar_fuentes.js`: hay que saber qué es texto y qué es
# código, y qué elemento envuelve a cuál, y eso lo sabe el analizador de Babel
# —necesita Node con @babel/core y @babel/preset-react en global; si faltan,
# avisa en vez de fallar—. Y las dos son avisos resumidos en una línea por
# capítulo: el día que se escribieron, en LPF, había 67 figuras sin fuente y 8
# menciones en los cinco capítulos, y ochenta líneas de aviso son ochenta líneas
# que nadie lee. En este curso, el día que llegaron, ningún capítulo declaraba
# la fuente de ninguna figura. Lo revisado se calla con
# `fuente-ok` y el motivo, en su línea o en la anterior.
#
# En LPF, negativas del 2026-11-10, sobre una copia del capítulo 1: su `ChartFrame` sin
# `fuente` avisa y con `fuente={{ propia: true }}` deja de avisar; una tabla
# avisa y con un `<Fuente propia />` detrás de su envoltorio deja de avisar;
# «La Superintendencia Financiera certifica la tasa de usura» en un párrafo
# avisa dos veces, con un `<Cita>` en el mismo párrafo no avisa, dentro de un
# `<Ilustrativo>` tampoco, y con `fuente-ok` en la línea anterior tampoco;
# «mediante» y «aviso» no cuentan como DIAN ni ISO.
NOMBRES_DE_FIGURA = {"ChartFrame": "gráficas", "table": "tablas", "figure": "figuras", "svg": "diagramas"}


def fuentes_sin_declarar(ruta):
    """Los avisos de las reglas 22 y 24, una línea por regla."""
    guion = Path(__file__).resolve().parent / "comprobar_fuentes.js"
    if not guion.exists():
        return ["fuentes — falta _plantilla/comprobar_fuentes.js, no se comprobaron las reglas 22 y 24"]
    try:
        r = subprocess.run(["node", str(guion), str(ruta)], capture_output=True, text=True, timeout=180)
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return ["fuentes — no se pudo ejecutar Node, no se comprobaron las reglas 22 y 24"]
    if r.returncode == 0:
        return []
    if r.returncode == 2:
        return [f"fuentes — no se pudieron comprobar las reglas 22 y 24: {(r.stderr or r.stdout).strip()[:200]}"]
    figuras, menciones = [], []
    for linea in r.stdout.splitlines():
        partes = linea.split(":", 4)
        if len(partes) == 5 and partes[2] == "22":
            figuras.append((partes[1], partes[3]))
        elif len(partes) == 5 and partes[2] == "24":
            menciones.append((partes[1], partes[4]))
    avisos = []
    if figuras:
        por_clase = {}
        for _linea, clase in figuras:
            por_clase[clase] = por_clase.get(clase, 0) + 1
        desglose = ", ".join(f"{n} {NOMBRES_DE_FIGURA.get(c, c)}" for c, n in sorted(por_clase.items()))
        lineas = ", ".join(l for l, _ in figuras[:12]) + (f" y {len(figuras) - 12} más" if len(figuras) > 12 else "")
        avisos.append(f"figura sin fuente — {len(figuras)} no dicen de dónde salen sus datos "
                      f"({desglose}), en las líneas {lineas}. Va `fuente` en el ChartFrame o un "
                      f"<Fuente> a continuación; lo revisado se calla con «fuente-ok»")
    if menciones:
        lista = "; ".join(f"línea {l}, «{t}»" for l, t in menciones[:8]) \
            + (f"; y {len(menciones) - 8} más" if len(menciones) > 8 else "")
        avisos.append(f"entidad o norma sin cita — {len(menciones)} menciones sin <Cita> en su "
                      f"párrafo ni <Ilustrativo>: {lista}")
    return avisos


def isla_de_la_demo():
    """Las reglas 18 a 20 sobre `tr-base.html`, con las fuentes de `pruebas_fuentes/`.

    La isla de la plantilla la genera `estampar_referencias.py --demo` y
    `ensamblar.py` solo la copia. Este curso no tiene la regla de LPF que
    compara `tr-base.html` con lo que `ensamblar.py` produciría, así que esto
    lee la isla donde de verdad está, en `tr-base.html`: si no se volvió a
    ensamblar, o a estampar la demo, la huella no cuadra con `tr-demo.jsx`, el
    accesorio y el estilo.
    """
    fnt = Fuentes(fuentes.DIR_PRUEBAS)
    if fnt.error:
        return [fnt.error]
    texto = BASE.read_text(encoding="utf-8")
    problemas = clave_citada_inexistente(texto, fnt) + referencias_inexactas(texto)
    p20, a20 = bloque_desactualizado(BASE, texto, fnt)
    return problemas + p20 + a20


def verificar(ruta, hash_base, revisar_cuota=True, con_salidas=False, fnt=None, con_pandoc=False):
    texto = ruta.read_text(encoding="utf-8")
    fnt = fnt or Fuentes()
    cuerpo = cuerpo_capitulo(texto)
    desplazamiento = max(texto.find(MARCA_FIN), 0)
    problemas, avisos = [], []

    # 1 · deriva
    core, err = bloque_core(texto, ruta)
    if err:
        problemas.append(err)
    else:
        h = hashlib.sha256(core.encode("utf-8")).hexdigest()
        if h != hash_base:
            problemas.append(
                f"el bloque TR-CORE difiere de tr-base.html\n"
                f"        capítulo {h[:12]}…  base {hash_base[:12]}…\n"
                f"        corrija tr-core-extra.jsx y regenere, no edite el capítulo a mano"
            )

    # 2 · cuota de ejercicios
    conteo = contar_ejercicios(cuerpo)
    if revisar_cuota:
        for tipo, (lo, hi) in CUOTA.items():
            n = conteo[tipo]
            if n < lo:
                destino = problemas if tipo in OBLIGATORIOS else avisos
                destino.append(f"{tipo}: hay {n}, se esperan al menos {lo}")
            elif n > hi:
                avisos.append(f"{tipo}: hay {n}, la cuota sugiere máximo {hi}")

    # 3 · componentes sin definir
    faltantes = componentes_sin_definir(texto, cuerpo)
    if faltantes:
        problemas.append(f"componentes usados pero no definidos: {', '.join(faltantes)}")

    # 4 · CodeTabs completos
    for f in codetabs_incompletos(texto, cuerpo):
        problemas.append(f"CodeTabs incompleto — {f}")

    # 5 · motivación de apertura en cada sección
    for f in secciones_sin_motivacion(cuerpo):
        problemas.append(f"sección sin motivación — {f}")

    # 6 · coherencia de los ejercicios multilingües
    for f in ejercicios_multilingues_mal(texto, cuerpo):
        problemas.append(f"ejercicio multilingüe — {f}")

    # 7 · la salida va dentro del bloque, con el prefijo del curso
    for f in salida_mal_puesta(cuerpo):
        problemas.append(f"salida — {f}")

    # 8 · el texto del R3 no cita líneas que solo valen en un lenguaje
    for f in textos_de_detectaerror_mal(texto, cuerpo):
        problemas.append(f"texto por lenguaje — {f}")

    # 9 · la salida declarada es la que el código produce (lenta: opt-in)
    if con_salidas:
        p9, a9, _ = ejecutar_salidas.auditar(ruta)
        problemas += [f"salida ejecutada — {f}" for f in p9]
        avisos += [f"salida ejecutada — {f}" for f in a9]

    # 10 · ningún color tenue usado como texto sin confirmar
    for f in contraste_dudoso(texto):
        avisos.append(f"contraste — {f}")

    # 11 · ningún enunciado pide escribir un programa desde cero
    for f in pide_escribir_programa(texto, cuerpo, desplazamiento):
        problemas.append(f"enunciado — {f}")

    # 12 · peso del archivo
    kb = ruta.stat().st_size / 1024
    if kb > PESO_MAXIMO_KB:
        problemas.append(
            f"peso — el capítulo ocupa {kb:.0f} KB y el máximo es {PESO_MAXIMO_KB} KB. "
            f"Reduzca las series de las gráficas a 1500 puntos o parta el capítulo")

    # 15 · toda opción declara `correcta`, o las reglas 13, 14 y 16 no la ven
    for f in opciones_incompletas(texto, cuerpo, desplazamiento):
        problemas.append(f"opciones — {f}")

    # 13 · la opción correcta no se delata por su longitud, ni larga ni corta
    for f in opciones_delatadas(texto, cuerpo, desplazamiento):
        problemas.append(f"opciones — {f}")

    # 14 · ni por la letra en la que acaba saliendo
    for f in posiciones_delatadas(texto, cuerpo, desplazamiento):
        problemas.append(f"posición — {f}")

    # 16 · ni por una marca tipográfica que la señale (o que señale al resto)
    for f in marcadores_delatados(texto, cuerpo, desplazamiento):
        problemas.append(f"forma — {f}")

    # 17 · ni un emparejamiento cuya solución siga las filas
    for f in emparejamientos_delatados(texto, cuerpo, desplazamiento):
        problemas.append(f"emparejamiento — {f}")

    # 18 · toda clave citada o recomendada es literal, está en referencias.json y en la isla
    for f in clave_citada_inexistente(texto, fnt):
        problemas.append(f"cita — {f}")

    # 19 · la isla trae lo citado y lo recomendado, y nada más; un único <Referencias /> al final
    for f in referencias_inexactas(texto):
        problemas.append(f"referencias — {f}")

    # 20 · la isla es la que el estampador escribiría hoy
    p20, a20 = bloque_desactualizado(ruta, texto, fnt, con_pandoc)
    problemas += [f"referencias — {f}" for f in p20]
    avisos += a20

    # 23 · cada pasaje citado tiene constancia de lectura, y su ancla sigue ahí
    p23, a23 = afirmaciones_sin_registro(ruta, texto, fnt)
    problemas += [f"afirmaciones — {f}" for f in p23]
    avisos += a23

    # 22 y 24 · figuras sin fuente, y entidades o normas sin cita (avisos)
    avisos += fuentes_sin_declarar(ruta)

    total = sum(conteo.values())
    resumen = " ".join(f"{t}:{conteo[t]}" for t in sorted(conteo))
    return problemas, avisos, total, resumen, kb


def main():
    # Una opción que no se conoce no se ignora (como en LPF): `--con-salida`, sin
    # la ese, daba verde sin haber ejecutado nada, y un `--fuente DIR` mal
    # escrito tomaría DIR por un capítulo y verificaría contra las fuentes de
    # verdad.
    banderas = {"--sin-cuota", "--con-salidas", "--con-pandoc"}
    args, opciones, malas = [], {}, []
    argv = sys.argv[1:]
    i = 0
    while i < len(argv):
        a = argv[i]
        nombre, _, pegado = a.partition("=")
        if not a.startswith("--"):
            args.append(a)
        elif a in banderas:
            opciones[a] = True
        elif nombre == "--fuentes" and pegado:
            opciones[nombre] = pegado
        elif a == "--fuentes" and i + 1 < len(argv) and not argv[i + 1].startswith("--"):
            opciones[a] = argv[i + 1]
            i += 1
        else:
            malas.append(a)
        i += 1
    if malas:
        print(__doc__.strip().split("Uso:")[1].split("Devuelve")[0].rstrip(), file=sys.stderr)
        print(f"\n{ROJO}ERROR{FIN}: opción desconocida o sin valor {', '.join(malas)}; "
              f"no se verificó nada.", file=sys.stderr)
        return 2
    revisar_cuota = "--sin-cuota" not in opciones
    con_salidas = "--con-salidas" in opciones
    con_pandoc = "--con-pandoc" in opciones
    fnt = Fuentes(opciones.get("--fuentes"))

    if not BASE.exists():
        print(f"{ROJO}ERROR{FIN}: falta {BASE}. Ejecute antes ensamblar.py.", file=sys.stderr)
        return 1

    core_base, err = bloque_core(BASE.read_text(encoding="utf-8"), BASE)
    if err:
        print(f"{ROJO}ERROR{FIN}: {err}", file=sys.stderr)
        return 1
    hash_base = hashlib.sha256(core_base.encode("utf-8")).hexdigest()

    # La isla de la demo, con su accesorio. Es de la plantilla y no de ningún
    # capítulo: se comprueba una vez y se informa sin abortar.
    fallos_previos = 0
    demo = isla_de_la_demo()
    if demo:
        print(f"{ROJO}FALLA{FIN} _plantilla/tr-base.html (isla de referencias de la demo)")
        for p in demo:
            print(f"        {ROJO}✗{FIN} {p}")
        print(f"        {GRIS}ejecute: python3 _plantilla/estampar_referencias.py --demo "
              f"&& python3 _plantilla/ensamblar.py{FIN}\n")
        fallos_previos += 1

    if args:
        rutas = []
        for a in args:
            p = Path(a)
            rutas.extend(sorted(MATERIAL.glob(a)) if not p.exists() else [p])
    else:
        rutas = sorted(MATERIAL.glob(PATRON_CAPITULO))

    # 21 · las entradas de referencias.json se pueden verificar. Una vez.
    no_verificables, sin_citar = entradas_no_verificables(fnt, *claves_usadas_en_el_material(rutas))
    if no_verificables or sin_citar:
        estado = f"{ROJO}FALLA{FIN}" if no_verificables else f"{AMAR}AVISO{FIN}"
        print(f"{estado} {fnt.directorio.name}/{fuentes.ARCHIVO_REFERENCIAS}")
        for p in no_verificables:
            print(f"        {ROJO}✗{FIN} {p}")
        for a in sin_citar:
            print(f"        {AMAR}!{FIN} {a}")
        print()
        fallos_previos += 1 if no_verificables else 0

    if not rutas:
        print(f"{AMAR}Sin capítulos que verificar todavía.{FIN}")
        print(f"{GRIS}TR-CORE de referencia: {hash_base[:16]}…{FIN}")
        return 0

    print(f"{GRIS}TR-CORE de referencia: {hash_base[:16]}…{FIN}")
    print(f"{GRIS}Fuentes: {fnt.directorio} · {len(fnt.entradas)} entradas{FIN}")
    if not con_salidas:
        print(f"{GRIS}Comprobación 9 omitida — añada --con-salidas para ejecutar el código{FIN}")
    print()
    fallos = 0
    for ruta in rutas:
        problemas, avisos, total, resumen, kb = verificar(
            ruta, hash_base, revisar_cuota, con_salidas, fnt, con_pandoc)
        estado = f"{ROJO}FALLA{FIN}" if problemas else (f"{AMAR}AVISO{FIN}" if avisos else f"{VERDE}OK   {FIN}")
        print(f"{estado}  {ruta.name}")
        print(f"        {GRIS}{total} ejercicios · {resumen} · {kb:.0f} KB{FIN}")
        for p in problemas:
            print(f"        {ROJO}✗{FIN} {p}")
        for a in avisos:
            print(f"        {AMAR}!{FIN} {a}")
        if problemas:
            fallos += 1
        print()

    if fallos:
        print(f"{ROJO}{fallos} de {len(rutas)} capítulos con problemas.{FIN}")
        return 1
    if fallos_previos:
        print(f"{ROJO}Los {len(rutas)} capítulos pasan, pero falla lo que se comprueba una "
              f"sola vez (arriba).{FIN}")
        return 1
    print(f"{VERDE}Los {len(rutas)} capítulos pasan la verificación.{FIN}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
