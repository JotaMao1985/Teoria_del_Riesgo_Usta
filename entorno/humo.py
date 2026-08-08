#!/usr/bin/env python3
"""
Prueba de humo del entorno: ¿está todo lo que el material necesita?

Importa las librerías de las tres unidades y carga los datos congelados,
contrastando su SHA-256 con el manifiesto. No calcula nada: solo comprueba que
el capítulo 12 no se va a caer al importar `xgboost` a mitad de una clase.

    python3 entorno/humo.py

Devuelve 0 si todo está, 1 si falta algo.
"""

import hashlib
import importlib
import re
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DATOS = RAIZ / "datos"

# (módulo que se importa, para qué, en qué unidad)
LIBRERIAS = [
    ("numpy", "núcleo numérico", "todas"),
    ("pandas", "series y paneles", "todas"),
    ("scipy", "optimización y distribuciones", "todas"),
    ("matplotlib", "gráficas de los cuadernos", "todas"),
    ("statsmodels", "regresión: CAPM", "U1"),
    ("arch", "EWMA, ARCH y GARCH", "U1"),
    ("cvxpy", "media-varianza y CVaR", "U2"),
    ("QuantLib", "curvas y valoración de renta fija", "U2"),
    ("sklearn", "modelo de PD y su validación", "U3"),
    ("xgboost", "gradient boosting para crédito", "U3"),
    ("shap", "interpretabilidad del scorecard", "U3"),
    ("pyextremes", "GEV y POT", "U3"),
]

ROJO, VERDE, AMAR, GRIS, FIN = "\033[31m", "\033[32m", "\033[33m", "\033[90m", "\033[0m"


def sha(ruta):
    return hashlib.sha256(ruta.read_bytes()).hexdigest()


def manifiesto():
    """{archivo: sha} de lo que `descargar.py` dejó anotado."""
    f = DATOS / "MANIFIESTO.md"
    if not f.exists():
        return {}
    t = f.read_text(encoding="utf-8")
    return dict(re.findall(r"## `([^`]+)`.*?\*\*SHA-256:\*\* `([0-9a-f]{64})`", t, re.S))


def main():
    fallos = 0

    print("Librerías de Python")
    for mod, para, unidad in LIBRERIAS:
        try:
            m = importlib.import_module(mod)
            v = getattr(m, "__version__", "—")
            print(f"  {VERDE}·{FIN} {mod:<13} {v:<10} {GRIS}{unidad} · {para}{FIN}")
        except Exception as e:
            print(f"  {ROJO}✗{FIN} {mod:<13} {'':<10} {ROJO}{type(e).__name__}: {str(e)[:60]}{FIN}")
            fallos += 1

    print("\nDatos congelados")
    esperado = manifiesto()
    if not esperado:
        print(f"  {AMAR}!{FIN} falta datos/MANIFIESTO.md: ejecute datos/descargar.py")
        fallos += 1
    for nombre, h in sorted(esperado.items()):
        ruta = DATOS / nombre
        if not ruta.exists():
            print(f"  {ROJO}✗{FIN} {nombre:<26} no existe")
            fallos += 1
            continue
        real = sha(ruta)
        if real != h:
            print(f"  {ROJO}✗{FIN} {nombre:<26} el SHA-256 no coincide con el manifiesto")
            print(f"      {GRIS}manifiesto {h[:16]}…  ·  archivo {real[:16]}…{FIN}")
            print(f"      {GRIS}el archivo cambió: el material declara salidas que ya no "
                  f"son las suyas{FIN}")
            fallos += 1
        else:
            kb = ruta.stat().st_size / 1024
            print(f"  {VERDE}·{FIN} {nombre:<26} {kb:>7.0f} KB  {GRIS}{real[:16]}…{FIN}")

    pendiente = DATOS / "curva_tes.csv"
    if not pendiente.exists():
        print(f"  {AMAR}!{FIN} curva_tes.csv              {GRIS}pendiente — bloquea los "
              f"capítulos 9 y 10{FIN}")

    print()
    if fallos:
        print(f"{ROJO}{fallos} comprobaciones fallaron.{FIN}")
        return 1
    print(f"{VERDE}El entorno está completo.{FIN}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
