#!/usr/bin/env python3
"""
Comprobación 9 — toda salida declarada tiene que haberse ejecutado.

Extrae los bloques de código del capítulo, los ejecuta y compara su salida real
con la que el material declara tras `#>`. Es el único control que caza una
salida falsa: una cifra equivocada no se ve en pantalla, se lee como cualquier
otra, y en un curso donde el número ES el contenido eso es grave — un `#>` con
un ES mal calculado enseña exactamente el error que el capítulo 5 desmonta.

**Aquí se ejecutan los dos lenguajes del curso.** No hay lenguajes omitidos: el
curso del que se bifurcó esta librería tenía cuatro y solo podía correr dos —el
pseudocódigo no es ejecutable y VBA se verifica en Excel—, así que su informe
declaraba la mitad del material como no auditado. Con Python y R, la cobertura
es completa.

Lo que sí queda fuera, y por qué:

  · **Bloques sin ninguna línea `#>`.** No afirman nada, así que no hay nada que
    comprobar. La tentación es correrlos igual «por si acaso», pero muchos
    bloques del material no son programas: los hay con un error deliberado —el
    que audita R3— y los hay que son fragmentos de dos líneas.
  · **Constantes de un solo lenguaje que declaran salida.** `#>` es el prefijo
    de Python y de R a la vez, y una constante suelta no dice cuál es. Se listan
    como aviso en vez de callarlas: convertirlas a `CodeTabs` las vuelve
    auditables, y un hueco que no se nombra se lee como cobertura.

La comparación es **exacta y por lenguaje**, sin normalizar cifras: NumPy imprime
`[ 1.136 -1.915  1.389  1.49 ]` y R imprime `[1]  1.136 -1.915  1.389  1.490`.
Normalizarlas escondería justo el tipo de discrepancia que interesa. (Por eso el
material usa `cat(sprintf(...))` y no `print()` para los escalares: R mostraría
`[1] 1.633`.)

Uso:
    python3 _plantilla/ejecutar_salidas.py                 # todos los capítulos
    python3 _plantilla/ejecutar_salidas.py 04_TDR_*.html   # archivos concretos

    python3 _plantilla/verificar.py --con-salidas          # dentro de la auditoría

Devuelve 0 si todo cuadra, 1 si alguna salida no coincide.
"""

import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
MATERIAL = AQUI.parent

MARCA_FIN = "/* === TR-CORE FIN === */"

PATRON_CAPITULO = "[0-9][0-9]_TDR_*.html"

PREFIJO_SALIDA = {"python": "#>", "r": "#>"}

EJECUTABLES = {
    "python": (lambda: [sys.executable], ".py"),
    "r": (lambda: [shutil.which("Rscript") or "Rscript", "--vanilla"], ".R"),
}

# Los capítulos de las unidades 2 y 3 ajustan modelos y optimizan: veinte
# segundos se quedan cortos para un GARCH o un programa cuadrático.
TIEMPO_LIMITE = 90

ROJO, VERDE, AMAR, GRIS, FIN = "\033[31m", "\033[32m", "\033[33m", "\033[90m", "\033[0m"

BLOQUE = re.compile(r"\n\s+(python|r)\s*:\s*`")
CONST_OBJ = re.compile(r"const\s+([A-Za-z0-9_]+)\s*=\s*\{")
CONST_SUELTA = re.compile(r"const\s+([A-Za-z0-9_]+)\s*=\s*`")


def cuerpo(texto):
    """Todo lo que va DESPUÉS de TR-CORE: el contenido propio del capítulo.

    La librería trae ejemplos en sus comentarios; auditarlos sería auditar la
    plantilla quince veces y confundir el informe.
    """
    j = texto.find(MARCA_FIN)
    return texto[j:] if j != -1 else texto


def desescapar(s):
    """Texto real de una plantilla literal de JavaScript.

    Importa más de lo que parece: en el archivo, el `sprintf` de R se escribe
    `"%.3f %%\\\\n"` para que la cadena de JavaScript entregue a R el `\\n` de dos
    caracteres que necesita. Sin deshacer eso, el bloque no corre.
    """
    fuera = []
    i, n = 0, len(s)
    mapa = {"n": "\n", "t": "\t", "r": "\r", "\\": "\\", "`": "`",
            "$": "$", "'": "'", '"': '"'}
    while i < n:
        c = s[i]
        if c == "\\" and i + 1 < n:
            fuera.append(mapa.get(s[i + 1], s[i + 1]))
            i += 2
            continue
        fuera.append(c)
        i += 1
    return "".join(fuera)


def fin_de_literal(texto, desde):
    """Índice de la comilla invertida que cierra, saltando las escapadas."""
    i, n = desde, len(texto)
    while i < n:
        if texto[i] == "\\":
            i += 2
            continue
        if texto[i] == "`":
            return i
        i += 1
    return -1


def nombre_previo(texto, pos):
    ultimo = None
    for m in CONST_OBJ.finditer(texto, 0, pos):
        ultimo = m.group(1)
    return ultimo or "(sin nombre)"


def bloques_de(texto):
    """(nombre, lenguaje, código) de cada plantilla literal por lenguaje.

    Los arreglos quedan fuera solos: empiezan por `[`, no por comilla invertida.
    Y con razón — `IA_ES_MAL`, el bloque que el estudiante audita en R3, trae un
    error plantado a propósito y no declara ninguna salida, porque afirmar la
    salida de un cálculo roto sería mentir.
    """
    salida = []
    for m in BLOQUE.finditer(texto):
        ini = m.end()
        fin = fin_de_literal(texto, ini)
        if fin == -1:
            continue
        salida.append((nombre_previo(texto, m.start()), m.group(1),
                       desescapar(texto[ini:fin])))
    return salida


def sueltas_con_salida(texto):
    """Constantes de código de un solo lenguaje que declaran salida.

    No se pueden auditar: `#>` es el prefijo de Python y de R a la vez, y una
    constante suelta no dice cuál de los dos es.
    """
    fuera = []
    for m in CONST_SUELTA.finditer(texto):
        fin = fin_de_literal(texto, m.end())
        if fin != -1 and "#>" in texto[m.end():fin]:
            fuera.append(m.group(1))
    return fuera


def separar(codigo, prefijo):
    """Divide el bloque en (código ejecutable, salidas declaradas en orden)."""
    ejecutable, esperado = [], []
    for linea in codigo.split("\n"):
        s = linea.strip()
        if s.startswith(prefijo):
            valor = s[len(prefijo):]
            esperado.append(valor[1:] if valor.startswith(" ") else valor)
        else:
            ejecutable.append(linea)
    return "\n".join(ejecutable), esperado


def ejecutar(lenguaje, codigo, datos):
    """(salida, error) — `error` es None si el bloque corrió.

    Se ejecuta con el directorio de datos como raíz para que un bloque que lea
    `datos/bvc_diario.csv` encuentre el archivo, igual que lo encontraría un
    estudiante que copie el bloque en su propio proyecto.
    """
    orden, sufijo = EJECUTABLES[lenguaje]
    argv = orden()
    if not shutil.which(argv[0]) and not Path(argv[0]).exists():
        return None, f"no se encuentra «{argv[0]}» en el sistema"
    with tempfile.TemporaryDirectory() as tmp:
        f = Path(tmp) / f"bloque{sufijo}"
        f.write_text(codigo, encoding="utf-8")
        try:
            p = subprocess.run(argv + [str(f)], capture_output=True, text=True,
                               timeout=TIEMPO_LIMITE, cwd=datos or tmp)
        except subprocess.TimeoutExpired:
            return None, f"no terminó en {TIEMPO_LIMITE} s"
        if p.returncode != 0:
            detalle = (p.stderr or p.stdout or "").strip().splitlines()
            return None, "terminó con error: " + (detalle[-1] if detalle else f"código {p.returncode}")
        return p.stdout, None


def auditar(ruta):
    """(problemas, avisos, resumen) de un capítulo."""
    texto = cuerpo(ruta.read_text(encoding="utf-8"))
    raiz = MATERIAL.parent
    datos = str(raiz) if (raiz / "datos").is_dir() else None
    problemas, avisos = [], []
    comparados = sin_salida = 0

    for nombre, lenguaje, codigo in bloques_de(texto):
        ejecutable, esperado = separar(codigo, PREFIJO_SALIDA[lenguaje])
        if not esperado:
            sin_salida += 1
            continue
        if not ejecutable.strip():
            problemas.append(f"{nombre} · {lenguaje}: declara salida pero no hay "
                             f"código que la produzca")
            continue

        real, error = ejecutar(lenguaje, ejecutable, datos)
        if error:
            problemas.append(f"{nombre} · {lenguaje}: {error}")
            continue
        comparados += 1

        obtenido = [l.rstrip() for l in real.splitlines()]
        quiere = [l.rstrip() for l in esperado]
        if obtenido != quiere:
            detalle = [f"{nombre} · {lenguaje}: la salida real no coincide con la declarada"]
            for i in range(max(len(quiere), len(obtenido))):
                d = quiere[i] if i < len(quiere) else "(nada)"
                o = obtenido[i] if i < len(obtenido) else "(nada)"
                marca = " " if d == o else "≠"
                detalle.append(f"          {marca} declara «{d}»  ·  produce «{o}»")
            problemas.append("\n".join(detalle))

    for nombre in sueltas_con_salida(texto):
        avisos.append(f"{nombre}: bloque de un solo lenguaje con `#>`; no se puede "
                      f"saber si es Python o R. Conviértalo a CodeTabs y quedará auditado")

    resumen = (f"{comparados} bloques ejecutados y comparados · "
               f"{sin_salida} sin salida declarada, nada que comprobar · "
               f"sin lenguajes omitidos")
    return problemas, avisos, resumen


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]

    if args:
        rutas = []
        for a in args:
            p = Path(a)
            rutas.extend([p] if p.exists() else sorted(MATERIAL.glob(a)))
    else:
        rutas = sorted(MATERIAL.glob(PATRON_CAPITULO))

    if not rutas:
        print(f"{AMAR}Sin capítulos que auditar.{FIN}")
        return 0

    fallos = 0
    for ruta in rutas:
        problemas, avisos, resumen = auditar(ruta)
        estado = f"{ROJO}FALLA{FIN}" if problemas else (f"{AMAR}AVISO{FIN}" if avisos else f"{VERDE}OK   {FIN}")
        print(f"{estado}  {ruta.name}")
        print(f"        {GRIS}{resumen}{FIN}")
        for p in problemas:
            print(f"        {ROJO}✗{FIN} {p}")
        for a in avisos:
            print(f"        {AMAR}!{FIN} {a}")
        if problemas:
            fallos += 1
        print()

    if fallos:
        print(f"{ROJO}{fallos} de {len(rutas)} capítulos con salidas que no cuadran.{FIN}")
        return 1
    print(f"{VERDE}Las salidas declaradas coinciden con las reales.{FIN}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
