#!/usr/bin/env python3
"""
Exporta una colección de Zotero a `_fuentes/referencias.json`.

Lee la API local de Zotero —solo lectura, en este mismo computador, sin
plugins— y deja las entradas en CSL-JSON, ordenadas por clave y con los campos
de la lista blanca de `fuentes.py`. Los resúmenes, las notas y las rutas de los
adjuntos no salen: el repositorio es público.

La clave de cada entrada es el campo nativo «Clave de cita» de Zotero
(`data.citationKey`). Si está vacío, se toma de una línea `Citation Key: clave`
del campo Extra: es donde queda la clave de una referencia importada de un
archivo RIS, porque el traductor RIS de Zotero ignora la etiqueta `ID`. Es la
clave que después va en `<Cita k="…"/>`.

La colección se busca por nombre a cualquier profundidad —la del curso cuelga
de «Docencia»— y se exportan sus ítems y los de TODAS sus subcolecciones
(`1 Básica`, `2 Complementaria`…). Un ítem que está en varias sale una vez.

Uso:
    python3 _plantilla/exportar_zotero.py --coleccion "TDR Teoría del Riesgo"
    python3 _plantilla/exportar_zotero.py --coleccion "TDR Teoría del Riesgo" --dry-run
    python3 _plantilla/exportar_zotero.py --coleccion NOMBRE --salida DIR
                                          # escribe DIR/referencias.json
    python3 _plantilla/exportar_zotero.py --coleccion NOMBRE --api URL
                                          # otra dirección de la API (pruebas)

Devuelve 0 si exportó; 1 si la colección no existe, si hay dos con ese nombre,
o si hay ítems sin clave, con la clave repetida o con una clave que no cumple
`^[a-z][a-z0-9_-]*$` (y entonces no escribe nada); 2 si Zotero no responde o se
le pasó una opción que no existe.
"""

import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

try:
    import fuentes
except ImportError:  # se ejecuta desde otro directorio
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import fuentes

API = "http://127.0.0.1:23119/api/users/0"
PAGINA = 100
# Lo que cuelga de un ítem y no es una fuente.
NO_SON_FUENTES = {"attachment", "note", "annotation"}

# La línea del campo Extra que lleva la clave. Es la misma expresión con la que
# el traductor «CSL JSON» de Zotero la reconoce al exportar: la línea entera, sin
# distinguir mayúsculas. Así «Citation Key: x» dentro de una frase no cuenta.
CLAVE_EN_EXTRA = re.compile(r"(?:^|\n)citation key\s*:\s*([^\s]+)(?:\n|$)", re.I)

ROJO, VERDE, AMAR, GRIS, FIN = "\033[31m", "\033[32m", "\033[33m", "\033[90m", "\033[0m"


class SinZotero(Exception):
    """La API local no contestó."""


def pedir(api, ruta):
    """(cabeceras, JSON) de una petición a la API local."""
    try:
        with urllib.request.urlopen(api + ruta, timeout=15) as r:
            return r.headers, json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        raise SinZotero(f"la API local respondió {e.code} a {ruta}")
    except (urllib.error.URLError, TimeoutError, ConnectionError, OSError) as e:
        raise SinZotero(str(getattr(e, "reason", e)))
    except json.JSONDecodeError:
        raise SinZotero(f"la respuesta a {ruta} no es JSON: ¿es de verdad la API de Zotero?")


def todo(api, ruta):
    """Todas las páginas de una lista. La API entrega 100 como mucho por petición."""
    separador = "&" if "?" in ruta else "?"
    salida, inicio = [], 0
    while True:
        cabeceras, pagina = pedir(api, f"{ruta}{separador}limit={PAGINA}&start={inicio}")
        if not isinstance(pagina, list):
            raise SinZotero(f"la respuesta a {ruta} no es una lista")
        salida.extend(pagina)
        inicio += len(pagina)
        total = cabeceras.get("Total-Results")
        if not pagina or (total is not None and inicio >= int(total)):
            return salida


def csl_de(item):
    """El CSL de un ítem como diccionario.

    Con `include=csljson`, la API local lo entrega como una CADENA con JSON
    dentro, y ese JSON es una lista de un elemento. Se aceptan las tres formas
    para que un cambio de Zotero no rompa el guion en silencio.
    """
    csl = item.get("csljson")
    if isinstance(csl, str):
        csl = json.loads(csl)
    if isinstance(csl, list):
        csl = csl[0] if len(csl) == 1 else None
    return csl if isinstance(csl, dict) else None


def describir(item):
    datos = item.get("data", {})
    titulo = (datos.get("title") or "(sin título)").strip()
    return f"{titulo[:70]} [{item.get('key')}]"


def clave_de(datos):
    """(clave, origen) de un ítem: el campo «Clave de cita» y, si no, el Extra."""
    clave = (datos.get("citationKey") or "").strip()
    if clave:
        return clave, "campo"
    m = CLAVE_EN_EXTRA.search(datos.get("extra") or "")
    return (m.group(1), "Extra") if m else ("", None)


def arbol_de(colecciones):
    """({clave: colección}, {clave del padre: [hijas]}, función ruta)."""
    por_clave = {c["key"]: c for c in colecciones}
    hijas = {}
    for c in colecciones:
        # En las de arriba, `parentCollection` es `false`, no una cadena vacía.
        padre = c.get("data", {}).get("parentCollection") or None
        hijas.setdefault(padre, []).append(c)

    def ruta(c):
        nombres, vistas = [], set()
        while c is not None and c["key"] not in vistas:
            vistas.add(c["key"])
            nombres.append(c.get("data", {}).get("name", "?"))
            c = por_clave.get(c.get("data", {}).get("parentCollection") or "")
        return " › ".join(reversed(nombres))

    return por_clave, hijas, ruta


def con_descendientes(coleccion, hijas):
    """La colección y todas las que cuelgan de ella, a cualquier profundidad."""
    salida, pendientes, vistas = [], [coleccion], set()
    while pendientes:
        c = pendientes.pop(0)
        if c["key"] in vistas:
            continue
        vistas.add(c["key"])
        salida.append(c)
        pendientes.extend(sorted(hijas.get(c["key"], []),
                                 key=lambda h: h.get("data", {}).get("name", "")))
    return salida


def exportar(api, coleccion):
    """(entradas, problemas, resumen) de `coleccion` y de sus subcolecciones.

    `resumen` es una lista de (ruta de la colección, ítems que aportó): dice de
    dónde salió cada cosa, y deja ver una subcolección que se quedó vacía.
    """
    colecciones = todo(api, "/collections?format=json")
    _por_clave, hijas, ruta = arbol_de(colecciones)
    con_ese_nombre = [c for c in colecciones if c.get("data", {}).get("name") == coleccion]
    if not con_ese_nombre:
        rutas = sorted(ruta(c) for c in colecciones)
        return [], [f"no hay ninguna colección llamada «{coleccion}». Las que hay: "
                    + ("; ".join(f"«{r}»" for r in rutas) or "ninguna")], ([], [])
    if len(con_ese_nombre) > 1:
        rutas = sorted(ruta(c) for c in con_ese_nombre)
        return [], [f"hay {len(con_ese_nombre)} colecciones llamadas «{coleccion}»: "
                    + "; ".join(f"«{r}»" for r in rutas)
                    + ". Renombre una para que no haya duda de cuál se exporta"], ([], [])

    # Un ítem puede estar en varias subcolecciones: se queda con la primera vez
    # que aparece. Se reconoce por su `key` de Zotero, no por su clave de cita:
    # dos ítems DISTINTOS con la misma clave siguen siendo un error.
    items, resumen, ya = [], [], set()
    for c in con_descendientes(con_ese_nombre[0], hijas):
        nuevos = 0
        for item in todo(api, f"/collections/{c['key']}/items/top?include=csljson,data"):
            if item.get("data", {}).get("itemType") in NO_SON_FUENTES or item.get("key") in ya:
                continue
            ya.add(item.get("key"))
            items.append(item)
            nuevos += 1
        resumen.append((ruta(c), nuevos))

    entradas, problemas, vistas, en_extra = [], [], {}, []
    for item in items:
        datos = item.get("data", {})
        clave, origen = clave_de(datos)
        if not clave:
            problemas.append(f"sin clave de cita: {describir(item)}")
            continue
        if not fuentes.CLAVE.match(clave):
            problemas.append(f"la clave «{clave}» no cumple {fuentes.CLAVE.pattern}: {describir(item)}")
            continue
        if clave in vistas:
            problemas.append(f"la clave «{clave}» está repetida: {describir(item)} y {vistas[clave]}")
            continue
        vistas[clave] = describir(item)
        csl = csl_de(item)
        if csl is None:
            problemas.append(f"Zotero no entregó el CSL de {describir(item)}")
            continue
        csl = dict(csl, id=clave)
        # `filtrar_entrada` deja fuera `note`, que es donde Zotero pone el
        # Extra en el CSL: la línea «Citation Key: …» no se publica.
        entradas.append(fuentes.filtrar_entrada(csl))
        if origen == "Extra":
            en_extra.append(clave)
    return sorted(entradas, key=lambda e: e["id"]), problemas, (resumen, en_extra)


def main():
    conocidas = {"--coleccion": True, "--salida": True, "--api": True, "--dry-run": False}
    opciones, sueltos, argv = {}, [], sys.argv[1:]
    i = 0
    while i < len(argv):
        a = argv[i]
        nombre, _, pegado = a.partition("=")
        if a.startswith("--"):
            if nombre not in conocidas:
                sueltos.append(a)
            elif not conocidas[nombre]:
                opciones[nombre] = True
            elif pegado:
                opciones[nombre] = pegado
            elif i + 1 < len(argv) and not argv[i + 1].startswith("--"):
                opciones[nombre] = argv[i + 1]
                i += 1
            else:
                sueltos.append(f"{a} (le falta su valor)")
        else:
            sueltos.append(a)
        i += 1
    if sueltos or "--coleccion" not in opciones:
        print(__doc__.strip().split("Uso:")[1].split("Solo entran")[0].rstrip(), file=sys.stderr)
        motivo = (f"no se entiende {', '.join(sueltos)}" if sueltos
                  else "falta --coleccion NOMBRE")
        print(f"\n{ROJO}ERROR{FIN}: {motivo}; no se escribió nada.", file=sys.stderr)
        return 2

    api = opciones.get("--api", API).rstrip("/")
    destino = fuentes.ruta_referencias(opciones.get("--salida"))
    dry_run = "--dry-run" in opciones

    try:
        entradas, problemas, (resumen, en_extra) = exportar(api, opciones["--coleccion"])
    except SinZotero as e:
        print(f"{ROJO}ERROR{FIN}: Zotero no responde en {api} ({e}).\n"
              f"       Abra Zotero y active, en Ajustes › Avanzadas, «Permitir que otras "
              f"aplicaciones\n       de este equipo se comuniquen con Zotero». No se escribió nada.",
              file=sys.stderr)
        return 2

    if problemas:
        print(f"{ROJO}FALLA{FIN} colección «{opciones['--coleccion']}»")
        for p in problemas:
            print(f"        {ROJO}✗{FIN} {p}")
        print(f"\n{ROJO}No se escribió nada.{FIN}"
              + (" La clave se pone en Zotero, en el campo «Clave de cita» del ítem, o en "
                 "Extra\ncomo una línea «Citation Key: clave»."
                 if any("clave" in p and "colecci" not in p for p in problemas) else ""))
        return 1

    texto = fuentes.serializar_referencias(entradas)
    # Lo que se exporta tiene que pasar ya la regla 21: avisar aquí ahorra
    # descubrirlo al verificar.
    avisos = fuentes.problemas_del_archivo(entradas)
    igual = destino.exists() and destino.read_text(encoding="utf-8") == texto
    print(f"{VERDE}OK   {FIN} colección «{opciones['--coleccion']}»: {len(entradas)} entradas")
    for ruta, n in resumen:
        print(f"        {GRIS}{ruta}: {n}{FIN}")
    for e in entradas:
        print(f"        {GRIS}·{FIN} {e['id']}  {GRIS}{e.get('type', '?')} · "
              f"{str(e.get('title', ''))[:60]}"
              f"{' · clave tomada de Extra' if e['id'] in en_extra else ''}{FIN}")
    for clave, p, _clase in avisos:
        print(f"        {AMAR}!{FIN} {clave}: {p}")
    if dry_run:
        print(f"{AMAR}--dry-run: no se escribió {destino}.{FIN}")
    elif igual:
        print(f"{GRIS}{destino.name} ya estaba al día — no hubo cambios.{FIN}")
    else:
        destino.parent.mkdir(parents=True, exist_ok=True)
        destino.write_text(texto, encoding="utf-8")
        print(f"{VERDE}Escrito {destino}{FIN}")
        print(f"{GRIS}Siguiente: estampar_referencias.py{FIN}")
    if avisos:
        print(f"{AMAR}{len(avisos)} avisos de la regla 21 de verificar.py: es un aviso mientras "
              f"ningún capítulo cite\nesa entrada, y una falla en cuanto se cite. Se completan en "
              f"Zotero y se vuelve a exportar.{FIN}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
