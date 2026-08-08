#!/usr/bin/env python3
"""
Verificador estructural de los capítulos de Teoría del Riesgo.

Comprueba doce cosas sobre cada archivo HTML de capítulo:

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
 12. PESO — que ningún capítulo pase de 400 KB. Con MathJax denso, gráficas y
     datos embebidos es un límite que se cruza sin darse cuenta, y del otro
     lado el capítulo tarda en abrir en el equipo de un estudiante.

Uso:
    python3 _plantilla/verificar.py                 # todos los capítulos
    python3 _plantilla/verificar.py 04_TDR_*.html   # archivos concretos
    python3 _plantilla/verificar.py --sin-cuota     # omite la regla 2
                                                    # (útil en capítulos a medias)
    python3 _plantilla/verificar.py --con-salidas   # añade la regla 9 (lenta)

Devuelve 0 si todo pasa, 1 si algo falla.
"""

import hashlib
import re
import sys
from pathlib import Path

try:
    import ejecutar_salidas
except ImportError:  # se ejecuta desde otro directorio
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import ejecutar_salidas

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

PESO_MAXIMO_KB = 400

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


def verificar(ruta, hash_base, revisar_cuota=True, con_salidas=False):
    texto = ruta.read_text(encoding="utf-8")
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

    total = sum(conteo.values())
    resumen = " ".join(f"{t}:{conteo[t]}" for t in sorted(conteo))
    return problemas, avisos, total, resumen, kb


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    revisar_cuota = "--sin-cuota" not in sys.argv
    con_salidas = "--con-salidas" in sys.argv

    if not BASE.exists():
        print(f"{ROJO}ERROR{FIN}: falta {BASE}. Ejecute antes ensamblar.py.", file=sys.stderr)
        return 1

    core_base, err = bloque_core(BASE.read_text(encoding="utf-8"), BASE)
    if err:
        print(f"{ROJO}ERROR{FIN}: {err}", file=sys.stderr)
        return 1
    hash_base = hashlib.sha256(core_base.encode("utf-8")).hexdigest()

    if args:
        rutas = []
        for a in args:
            p = Path(a)
            rutas.extend(sorted(MATERIAL.glob(a)) if not p.exists() else [p])
    else:
        rutas = sorted(MATERIAL.glob(PATRON_CAPITULO))

    if not rutas:
        print(f"{AMAR}Sin capítulos que verificar todavía.{FIN}")
        print(f"{GRIS}TR-CORE de referencia: {hash_base[:16]}…{FIN}")
        return 0

    print(f"{GRIS}TR-CORE de referencia: {hash_base[:16]}…{FIN}")
    if not con_salidas:
        print(f"{GRIS}Comprobación 9 omitida — añada --con-salidas para ejecutar el código{FIN}")
    print()
    fallos = 0
    for ruta in rutas:
        problemas, avisos, total, resumen, kb = verificar(
            ruta, hash_base, revisar_cuota, con_salidas)
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
    print(f"{VERDE}Los {len(rutas)} capítulos pasan la verificación.{FIN}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
