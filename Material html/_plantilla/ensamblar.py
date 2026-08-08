#!/usr/bin/env python3
"""
Ensambla `_plantilla/tr-base.html` — la FUENTE DE VERDAD de la librería de
componentes del curso Teoría del Riesgo.

El archivo resultante es autocontenido (se abre con doble clic, sin servidor ni
build). Este guion existe únicamente para *construir* esa plantilla a partir de
piezas revisables por separado, y para poder regenerarla cuando la librería
cambie.

Composición:
    tr-head.html        <head> completo, estilos y apertura del <script>
    TR-CORE INICIO
      tr-core-base.jsx  helpers de MathJax, Icons, renderIcon, Box … Termino
      tr-core-extra.jsx resaltado, CodeBlock, CodeTabs, Timeline, los
                        componentes de ejercicio R1…R9 y los propios del curso
    TR-CORE FIN
    tr-demo.jsx         capítulo de demostración + App

Diferencia con el guion equivalente de Lógica de Programación: allí el `head` y
la primera mitad de la librería se extraían del capítulo 1 del propio curso, lo
que obligaba a que existiera un capítulo antes de poder generar la plantilla.
Aquí las cuatro piezas son archivos fuente con nombre propio, así que la
plantilla se puede regenerar desde cero sin ningún capítulo escrito.

Uso:
    python3 "Material html/_plantilla/ensamblar.py"
"""

import re
import sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
MATERIAL = AQUI.parent

PIEZAS_CORE = ("tr-core-base.jsx", "tr-core-extra.jsx")
HEAD = AQUI / "tr-head.html"
DEMO = AQUI / "tr-demo.jsx"
SALIDA = AQUI / "tr-base.html"

SENTINELA_INICIO = "        /* === TR-CORE INICIO — no editar a mano: se genera con ensamblar.py === */"
SENTINELA_FIN = "        /* === TR-CORE FIN === */"

FA_MINIMA = (6, 5, 0)


def main():
    fuentes = [HEAD, *(AQUI / p for p in PIEZAS_CORE), DEMO]
    faltan = [f for f in fuentes if not f.exists()]
    if faltan:
        for f in faltan:
            print(f"ERROR: no se encuentra {f}", file=sys.stderr)
        return 1

    head_txt = HEAD.read_text(encoding="utf-8").rstrip("\n")

    # Font Awesome < 6.5 no trae varios iconos del material: salen como huecos
    # en blanco, sin ningún error en consola. Se falla aquí antes que
    # descubrirlo en el aula.
    m = re.search(r"font-awesome/(\d+)\.(\d+)\.(\d+)", head_txt)
    if not m:
        print("ERROR: no se encontró el CDN de Font Awesome en tr-head.html.", file=sys.stderr)
        return 1
    version = tuple(int(x) for x in m.groups())
    if version < FA_MINIMA:
        print(f"ERROR: Font Awesome {'.'.join(map(str, version))} es anterior a "
              f"{'.'.join(map(str, FA_MINIMA))}; varios iconos del material no existen "
              f"en esa versión.\n       Actualice el enlace en {HEAD.name}.", file=sys.stderr)
        return 1

    # Prism debe traer las gramáticas de los dos lenguajes del curso. Sin ellas
    # el código sale sin resaltar, que es un defecto silencioso: se ve feo pero
    # no falla nada, así que puede llegar al aula sin que nadie lo note.
    for gram in ("prism-python", "prism-r"):
        if gram not in head_txt:
            print(f"ERROR: falta la gramática {gram} en {HEAD.name}.", file=sys.stderr)
            return 1

    partes = [
        head_txt,
        "",
        SENTINELA_INICIO,
        *((AQUI / p).read_text(encoding="utf-8").rstrip("\n") for p in PIEZAS_CORE),
        SENTINELA_FIN,
        "",
        DEMO.read_text(encoding="utf-8").rstrip("\n"),
        "    </script>",
        "</body>",
        "",
        "</html>",
        "",
    ]

    SALIDA.write_text("\n".join(partes), encoding="utf-8")

    n_lineas = len(SALIDA.read_text(encoding="utf-8").splitlines())
    kb = SALIDA.stat().st_size / 1024
    print(f"OK  {SALIDA.relative_to(MATERIAL.parent)}")
    print(f"    {n_lineas} líneas · {kb:.0f} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
