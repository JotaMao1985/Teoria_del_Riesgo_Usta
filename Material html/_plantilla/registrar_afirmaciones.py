#!/usr/bin/env python3
"""
Escribe el registro público de afirmaciones citadas de cada capítulo,
`_fuentes/afirmaciones/NN.yaml`, a partir de las notas del vault.

Las notas viven en `Vault/Afirmaciones/*.md`, en la carpeta principal del
repositorio, y son privadas: traen el pasaje de la fuente que respalda cada
afirmación, y ese pasaje no se publica. Aquí se LEEN —nunca se escribe en el
vault— y de cada una sale una fila con lo que sí puede ser público:

    id, seccion, ancla, clave, loc, tema
    leido: {fecha, medio, por}      de leido_fecha, leido_medio y leido_por
    extracto_sha256                 sha256 del texto de «## Extracto de la fuente»

Solo entran las notas del capítulo con `clase: citada` y `estado: verificada` o
`resuelta`: las que ya leyó alguien y aprobó el verificador. `resuelta` es el
estado que sigue a `verificada` en el esquema del vault —el HTML ya quedó como
debe—, y la cita sigue en el capítulo: si esas notas no entraran, el registro
se vaciaría al cerrar cada afirmación (pasó el 2026-11-10, con las seis del
piloto). El extracto no se copia nunca:
el resumen deja comprobar más tarde que la nota sigue diciendo lo mismo sin
decir qué dice.

La regla 23 de `verificar.py` lee el registro: toda cita del capítulo tiene que
tener aquí su fila, y el `ancla` de cada fila tiene que seguir en el HTML.

El vault no está en un worktree: se busca en la carpeta principal, que es la
primera que da `git worktree list --porcelain`.

Uso:
    python3 _plantilla/registrar_afirmaciones.py              # todos los capítulos
    python3 _plantilla/registrar_afirmaciones.py 01           # capítulos concretos
    python3 _plantilla/registrar_afirmaciones.py 01_TDR_*.html
    python3 _plantilla/registrar_afirmaciones.py --dry-run    # muestra y no escribe
    python3 _plantilla/registrar_afirmaciones.py --vault DIR  # otro vault (pruebas)
    python3 _plantilla/registrar_afirmaciones.py --fuentes DIR  # otra carpeta de destino

Devuelve 0 si todo se escribió; 1 si alguna nota citada y verificada está
incompleta (y entonces no escribe ese capítulo); 2 si no alcanza el vault o se
le pasó una opción que no existe (y entonces no escribe nada).
"""

import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

try:
    import fuentes
except ImportError:  # se ejecuta desde otro directorio
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import fuentes

AQUI = Path(__file__).resolve().parent
MATERIAL = AQUI.parent
CARPETA_NOTAS = Path("Vault") / "Afirmaciones"
SECCION_EXTRACTO = "Extracto de la fuente"

ROJO, VERDE, AMAR, GRIS, FIN = "\033[31m", "\033[32m", "\033[33m", "\033[90m", "\033[0m"


class SinVault(Exception):
    """No se pudo llegar a las notas del vault."""


def carpeta_principal():
    """La carpeta principal del repositorio, aunque se ejecute desde un worktree."""
    try:
        r = subprocess.run(["git", "worktree", "list", "--porcelain"], cwd=AQUI,
                           capture_output=True, text=True, timeout=30)
    except (FileNotFoundError, subprocess.TimeoutExpired) as e:
        raise SinVault(f"no se pudo ejecutar git ({e})")
    if r.returncode != 0:
        raise SinVault(f"git worktree list falló: {r.stderr.strip()[:200]}")
    for linea in r.stdout.splitlines():
        if linea.startswith("worktree "):
            return Path(linea[len("worktree "):])
    raise SinVault("git worktree list no dio ninguna carpeta")


def carpeta_de_notas(vault=None):
    carpeta = Path(vault) / "Afirmaciones" if vault else carpeta_principal() / CARPETA_NOTAS
    if not carpeta.is_dir():
        raise SinVault(f"no existe {carpeta}")
    return carpeta


def valor_yaml(texto):
    """El valor de una propiedad escalar del frontmatter de Obsidian."""
    v = texto.strip()
    if v.startswith('"') and v.endswith('"') and len(v) >= 2:
        try:
            return json.loads(v)
        except json.JSONDecodeError:
            return v[1:-1]
    if v.startswith("'") and v.endswith("'") and len(v) >= 2:
        return v[1:-1].replace("''", "'")
    return v


def leer_nota(ruta):
    """(propiedades, extracto) de una nota; el extracto es None si no hay sección."""
    texto = ruta.read_text(encoding="utf-8").replace("\r\n", "\n")
    m = re.match(r"---\n(.*?)\n---\n?", texto, re.S)
    if not m:
        return {}, None
    props = {}
    for linea in m.group(1).split("\n"):
        p = re.match(r"([A-Za-z_][\w-]*):(.*)$", linea)   # las listas (`  - x`) no interesan
        if p:
            props[p.group(1)] = valor_yaml(p.group(2))
    cuerpo = texto[m.end():]
    s = re.search(r"^## " + re.escape(SECCION_EXTRACTO) + r"[ \t]*\n(.*?)(?=^## |\Z)", cuerpo,
                  re.S | re.M)
    return props, (s.group(1).strip() if s else None)


def fila_de(ruta, nn):
    """(fila, problemas) de una nota citada y verificada del capítulo `nn`."""
    props, extracto = leer_nota(ruta)
    problemas = []
    ident = props.get("id", "")
    if not re.fullmatch(r"c" + nn + r"-s\d+-a\d+", ident):
        problemas.append(f"su `id` («{ident}») no es de la forma c{nn}-sN-aNN")
    for campo in ("seccion", "ancla", "clave", "tema", "leido_fecha", "leido_medio", "leido_por"):
        if not str(props.get(campo, "")).strip():
            problemas.append(f"le falta `{campo}`")
    if props.get("clave") and not fuentes.CLAVE.match(props["clave"]):
        problemas.append(f"su `clave` («{props['clave']}») no cumple {fuentes.CLAVE.pattern}")
    if not extracto:
        problemas.append(f"no tiene texto en «## {SECCION_EXTRACTO}»: está verificada sin pasaje")
    if problemas:
        return None, problemas
    return {
        "id": ident, "seccion": props["seccion"], "ancla": props["ancla"],
        "clave": props["clave"], "loc": props.get("loc", ""), "tema": props["tema"],
        "leido": {"fecha": props["leido_fecha"], "medio": props["leido_medio"],
                  "por": props["leido_por"]},
        # Solo el resumen: el pasaje es de una obra ajena y el repositorio es público.
        "extracto_sha256": hashlib.sha256(extracto.encode("utf-8")).hexdigest(),
    }, []


def filas_del_capitulo(carpeta, nn):
    """(filas, problemas) de las notas `clase: citada`, `estado: verificada` o `resuelta`."""
    filas, problemas, vistos = [], [], {}
    for ruta in sorted(carpeta.glob("*.md")):
        props, _ = leer_nota(ruta)
        if props.get("tipo") not in (None, "", "afirmacion"):
            continue
        capitulo = str(props.get("capitulo", "")).strip()
        if not capitulo.isdigit() or f"{int(capitulo):02d}" != nn:
            continue
        if props.get("clase") != "citada" or props.get("estado") not in ("verificada", "resuelta"):
            continue
        fila, mal = fila_de(ruta, nn)
        problemas += [f"{ruta.name}: {p}" for p in mal]
        if fila is None:
            continue
        if fila["id"] in vistos:
            problemas.append(f"{ruta.name}: su `id` «{fila['id']}» ya lo tiene {vistos[fila['id']]}")
            continue
        vistos[fila["id"]] = ruta.name
        filas.append(fila)
    return sorted(filas, key=lambda f: f["id"]), problemas


def main():
    con_valor = {"--vault", "--fuentes"}
    opciones, args, malas = {}, [], []
    argv = sys.argv[1:]
    i = 0
    while i < len(argv):
        a = argv[i]
        nombre, _, pegado = a.partition("=")
        if not a.startswith("--"):
            args.append(a)
        elif a == "--dry-run":
            opciones[a] = True
        elif nombre in con_valor and pegado:
            opciones[nombre] = pegado
        elif a in con_valor and i + 1 < len(argv) and not argv[i + 1].startswith("--"):
            opciones[a] = argv[i + 1]
            i += 1
        else:
            malas.append(a)
        i += 1
    if malas:
        print(__doc__.strip().split("Uso:")[1].split("Devuelve")[0].rstrip(), file=sys.stderr)
        print(f"\n{ROJO}ERROR{FIN}: opción desconocida o sin valor {', '.join(malas)}; "
              f"no se escribió nada.", file=sys.stderr)
        return 2

    if args:
        numeros = []
        for a in args:
            nn = fuentes.numero_de_capitulo(a)
            if nn is None:
                print(f"{ROJO}ERROR{FIN}: «{a}» no es un capítulo (01, 1 o 01_TDR_….html); "
                      f"no se escribió nada.", file=sys.stderr)
                return 2
            numeros.append(nn)
    else:
        numeros = [fuentes.numero_de_capitulo(p.name)
                   for p in sorted(MATERIAL.glob("[0-9][0-9]_TDR_*.html"))]
    numeros = sorted(set(numeros))

    try:
        carpeta = carpeta_de_notas(opciones.get("--vault"))
    except SinVault as e:
        print(f"{ROJO}ERROR{FIN}: no se alcanza el vault: {e}.\n"
              f"       Las notas están en Vault/Afirmaciones/, en la carpeta principal del "
              f"repositorio;\n       con otro vault, use --vault DIR. No se escribió nada.",
              file=sys.stderr)
        return 2

    dry_run = "--dry-run" in opciones
    destino = opciones.get("--fuentes")
    print(f"{GRIS}Notas: {carpeta} · {len(list(carpeta.glob('*.md')))} archivos · solo lectura{FIN}")
    if dry_run:
        print(f"{AMAR}--dry-run: no se escribe nada.{FIN}")
    print()

    fallos = 0
    for nn in numeros:
        filas, problemas = filas_del_capitulo(carpeta, nn)
        ruta = fuentes.ruta_registro(nn, destino)
        if problemas:
            print(f"{ROJO}FALLA{FIN} capítulo {nn}")
            for p in problemas:
                print(f"        {ROJO}✗{FIN} {p}")
            print(f"        {GRIS}no se escribió {ruta.name}{FIN}\n")
            fallos += 1
            continue
        if not filas:
            # Sin notas no se escribe un archivo vacío; y uno que ya estaba se deja
            # y se dice: borrarlo aquí escondería que las notas desaparecieron.
            sobra = f" — {AMAR}queda un {ruta.name} sin notas que lo respalden{FIN}" if ruta.exists() else ""
            print(f"{GRIS}=    {FIN} capítulo {nn}: ninguna nota citada y verificada{sobra}\n")
            fallos += 1 if ruta.exists() else 0
            continue
        texto = fuentes.texto_de_registro(nn, filas)
        igual = ruta.exists() and ruta.read_text(encoding="utf-8") == texto
        print(f"{GRIS if igual else VERDE}{'=    ' if igual else 'OK   '}{FIN} capítulo {nn}: "
              f"{len(filas)} afirmaciones → {ruta.parent.name}/{ruta.name}"
              f"{' (sin cambios)' if igual else ''}")
        for f in filas:
            loc = f", {f['loc']}" if f["loc"] else ""
            print(f"        {GRIS}·{FIN} {f['id']}  {f['clave']}{loc}  {GRIS}«{f['ancla']}»{FIN}")
        if not igual and not dry_run:
            ruta.parent.mkdir(parents=True, exist_ok=True)
            ruta.write_text(texto, encoding="utf-8")
        print()

    if fallos:
        print(f"{ROJO}{fallos} de {len(numeros)} capítulos con problemas.{FIN}")
        return 1
    print(f"{VERDE}Registro al día.{FIN}" + ("" if dry_run else f" {GRIS}Siguiente: verificar.py{FIN}"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
