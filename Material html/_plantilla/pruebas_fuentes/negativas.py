#!/usr/bin/env python3
"""
Pruebas negativas de las reglas 18 a 24 de `verificar.py`: el circuito de citas.

Los capítulos del curso no citan nada todavía, así que sobre ellos las siete
reglas pasan sin haber mirado nada. Este guion arma, en una carpeta temporal,
una COPIA del capítulo 1 que cita las obras ficticias de `pruebas_fuentes/`
—un `<Cita>` con localizador, una `<FichaNorma k loc>`, `<Referencias />` y
`<ParaProfundizar>` en la última lección—, le estampa la isla con
`estampar_referencias.py`, le escribe su registro de afirmaciones y comprueba:

  1. que esa copia pasa las reglas 18 a 21 y 23 sin un solo problema;
  2. que cada caso de abajo, que rompe UNA cosa, hace fallar la regla que le
     toca con el mensaje que le toca (o, en la 22 y la 24, que son avisos,
     que el aviso aparece y desaparece).

No toca ningún archivo del repositorio. Necesita pandoc (para estampar) y,
para la 22 y la 24, Node con @babel/core y @babel/preset-react en global.

Uso:
    python3 "Material html/_plantilla/pruebas_fuentes/negativas.py"
    python3 "Material html/_plantilla/pruebas_fuentes/negativas.py" -v   # muestra cada salida

Devuelve 0 si todos los casos se comportan como se espera y 1 si no.
"""

import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

AQUI = Path(__file__).resolve().parent
PLANTILLA = AQUI.parent
MATERIAL = PLANTILLA.parent
sys.path.insert(0, str(PLANTILLA))
import fuentes  # noqa: E402

CAPITULO = MATERIAL / "01_TDR_Riesgo_y_rendimiento.html"
VERBOSO = "-v" in sys.argv[1:]
ROJO, VERDE, GRIS, FIN = "\033[31m", "\033[32m", "\033[90m", "\033[0m"

ANCLA = "el VaR no es subaditivo"
PARRAFO = (f"                <p>Párrafo de prueba del circuito de citas: {ANCLA} "
           f'<Cita k="ficticio_autor2019" loc="p. 112" />.</p>\n')
FICHA = ('                <FichaNorma norma="Circular de prueba 000" emisor="Superintendencia Ficticia"\n'
         '                    exige="Reportar el ES." enElCapitulo="La sección 4."\n'
         '                    k="ficticio_norma2026" loc="num. 2.1" />\n')
LISTAS = ('                <Referencias />\n'
          '                <ParaProfundizar k="ficticio_lectura2021" />\n')


def correr(args, **kw):
    return subprocess.run([sys.executable, *map(str, args)], capture_output=True, text=True, **kw)


def armar_copia(destino):
    """El capítulo 1 con las citas metidas al final de su última lección."""
    texto = CAPITULO.read_text(encoding="utf-8")
    m = re.search(r"const\s+curriculum\s*=\s*\[(.*?)\n\s*\];", texto, re.S)
    ultima = re.findall(r"component:\s*([A-Za-z0-9_]+)", m.group(1))[-1]
    d = re.search(r"\n {8}const\s+" + ultima + r"\s*=", texto)
    fin = re.compile(r"\n {8}(?:const|let|var|function)\s|\n {8}/\* =").search(texto, d.end())
    cierre = texto.rfind("            </>", d.end(), fin.start())
    assert cierre != -1, "no se encontró el cierre del fragmento de la última lección"
    texto = texto[:cierre] + PARRAFO + FICHA + LISTAS + texto[cierre:]
    destino.write_text(texto, encoding="utf-8")


def estampar(copia, dir_fuentes):
    r = correr([PLANTILLA / "estampar_referencias.py", "--fuentes", dir_fuentes, "--sin-copia", copia])
    if r.returncode != 0:
        sys.exit(f"{ROJO}no se pudo estampar la copia:{FIN}\n{r.stdout}{r.stderr}")


def escribir_registro(dir_fuentes, filas):
    ruta = fuentes.ruta_registro("01", dir_fuentes)
    ruta.parent.mkdir(parents=True, exist_ok=True)
    ruta.write_text(fuentes.texto_de_registro("01", filas), encoding="utf-8")


def fila(ident, ancla, clave, loc):
    return {"id": ident, "seccion": "eval", "ancla": ancla, "clave": clave, "loc": loc,
            "tema": "prueba", "leido": {"fecha": "2026-11-11", "medio": "PDF", "por": "prueba"},
            "extracto_sha256": "0" * 64}


FILAS = [fila("c01-s6-a01", ANCLA, "ficticio_autor2019", "p. 112"),
         fila("c01-s6-a02", "Reportar el ES.", "ficticio_norma2026", "num. 2.1")]


def verificar(copia, dir_fuentes):
    """(líneas ✗ de las reglas de fuentes, líneas !, salida entera)."""
    r = correr([PLANTILLA / "verificar.py", "--sin-cuota", "--fuentes", dir_fuentes, copia])
    salida = re.sub(r"\033\[[0-9;]*m", "", r.stdout + r.stderr)
    malas = [l.strip() for l in salida.splitlines() if l.strip().startswith("✗")]
    avisos = [l.strip() for l in salida.splitlines() if l.strip().startswith("!")]
    return malas, avisos, salida


def menciones_en(copia):
    """Las líneas de la regla 24 que da `comprobar_fuentes.js` sobre la copia."""
    r = subprocess.run(["node", str(PLANTILLA / "comprobar_fuentes.js"), str(copia)],
                       capture_output=True, text=True)
    return [l for l in r.stdout.splitlines() if l.split(":")[2:3] == ["24"]]


def main():
    if shutil.which("pandoc") is None:
        print("falta pandoc: no se pueden estampar las copias", file=sys.stderr)
        return 1
    fallos = 0
    with tempfile.TemporaryDirectory(prefix="tdr-negativas-") as tmp:
        tmp = Path(tmp)
        base_fuentes = tmp / "fuentes_base"
        shutil.copytree(AQUI, base_fuentes, ignore=shutil.ignore_patterns("*.py", "__pycache__"))
        base = tmp / "base" / CAPITULO.name
        base.parent.mkdir()
        armar_copia(base)
        estampar(base, base_fuentes)
        escribir_registro(base_fuentes, FILAS)

        malas, _, salida = verificar(base, base_fuentes)
        if malas:
            print(f"{ROJO}✗ la copia sin romper ya falla:{FIN}\n" + "\n".join(malas))
            return 1
        print(f"{VERDE}✓{FIN} la copia del capítulo 1 con 3 citas, 1 lectura y su registro pasa "
              f"las reglas 18 a 21 y 23")

        def caso(regla, nombre, esperado, cambiar_texto=None, cambiar_fuentes=None,
                 registro=None, aviso=False):
            nonlocal fallos
            d = tmp / f"c{regla}_{abs(hash(nombre))}"
            d.mkdir()
            copia, dir_f = d / CAPITULO.name, d / "fuentes"
            shutil.copytree(base_fuentes, dir_f)
            texto = base.read_text(encoding="utf-8")
            if cambiar_texto:
                texto = cambiar_texto(texto)
            copia.write_text(texto, encoding="utf-8")
            if cambiar_fuentes:
                cambiar_fuentes(dir_f)
            if registro is not None:
                escribir_registro(dir_f, registro)
            malas, avisos, salida = verificar(copia, dir_f)
            lineas = avisos if aviso else malas
            ok = any(esperado in l for l in lineas)
            fallos += not ok
            marca = f"{VERDE}✓{FIN}" if ok else f"{ROJO}✗{FIN}"
            print(f"{marca} regla {regla} · {nombre}")
            if not ok or VERBOSO:
                print(f"    {GRIS}se esperaba «{esperado}» en {'un aviso' if aviso else 'una falla'}{FIN}")
                for l in lineas:
                    print(f"    {GRIS}{l[:220]}{FIN}")

        def editar_json(nombre, fn):
            def hacer(dir_f):
                ruta = dir_f / nombre
                datos = json.loads(ruta.read_text(encoding="utf-8"))
                fn(datos)
                ruta.write_text(json.dumps(datos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            return hacer

        def entrada(clave, fn):
            return editar_json("referencias.json", lambda ds: fn(next(e for e in ds if e["id"] == clave)))

        # ---- 18 · clave citada existe
        caso(18, "clave inexistente en <Cita>", "que no está en referencias.json",
             lambda t: t.replace('k="ficticio_autor2019" loc', 'k="ficticio_autor2091" loc'))
        caso(18, "clave inexistente en <FichaNorma k>", "«ficticio_norma2062», que no está en referencias.json",
             lambda t: t.replace('k="ficticio_norma2026"', 'k="ficticio_norma2062"'))
        caso(18, "clave que sale de una variable", "no escribe su clave como cadena literal",
             lambda t: t.replace('k="ficticio_autor2019" loc', 'k={clave} loc'))
        caso(18, "clave citada y recomendada a la vez", "Lo citado ya está en «Referencias»",
             lambda t: t.replace('<ParaProfundizar k="ficticio_lectura2021" />',
                                 '<ParaProfundizar k="ficticio_lectura2021; ficticio_autor2019" />'))
        # ---- 19 · referencias exactas
        caso(19, "sin <Referencias />", "no tiene <Referencias />",
             lambda t: t.replace("                <Referencias />\n", ""))
        caso(19, "dos <Referencias />", "debe haber uno",
             lambda t: t.replace("<Referencias />", "<Referencias />\n                <Referencias />"))
        caso(19, "<ParaProfundizar> antes de <Referencias />", "está antes de <Referencias />",
             lambda t: t.replace(LISTAS, '                <ParaProfundizar k="ficticio_lectura2021" />\n'
                                         '                <Referencias />\n'))
        caso(19, "una cita quitada sin volver a estampar", "entradas que el capítulo no cita",
             lambda t: t.replace(' <Cita k="ficticio_autor2019" loc="p. 112" />', ""))
        # ---- 20 · bloque al día
        caso(20, "isla editada a mano", "se editó a mano",
             lambda t: t.replace("Medición del riesgo de mercado de prueba", "Medición del riesgo de prueba", 1))
        caso(20, "fuente citada cambiada en referencias.json", "está desactualizada",
             cambiar_fuentes=entrada("ficticio_autor2019", lambda e: e.update(issued={"date-parts": [[2020]]})))
        caso(20, "centinela TR-REFS duplicado", "debe haber uno de cada uno",
             lambda t: t.replace("<!-- === TR-REFS FIN === -->", "<!-- === TR-REFS FIN === -->\n    <!-- === TR-REFS FIN === -->"))
        # ---- 21 · entrada verificable
        caso(21, "entrada citada sin autor", "sin autor",
             cambiar_fuentes=entrada("ficticio_autor2019", lambda e: e.pop("author")))
        caso(21, "campo privado (abstract)", "fuera de la lista blanca",
             cambiar_fuentes=entrada("ficticio_lectura2021", lambda e: e.update(abstract="mis notas")))
        caso(21, "página web citada sin fecha de consulta", "fecha de consulta",
             cambiar_fuentes=entrada("ficticio_norma2026", lambda e: e.pop("accessed")))
        # ---- 22 · figura sin fuente (aviso)
        n_fig = int(re.search(r"figura sin fuente — (\d+)", salida).group(1))
        caso(22, f"base con {n_fig} gráficas sin fuente: con una declarada quedan {n_fig - 1}",
             f"figura sin fuente — {n_fig - 1} ",
             lambda t: t[:t.index(fuentes.MARCA_FIN_CORE)] + t[t.index(fuentes.MARCA_FIN_CORE):].replace(
                 "<ChartFrame ", "<ChartFrame fuente={{ propia: true }} ", 1), aviso=True)
        # ---- 23 · afirmación leída
        caso(23, "fila del registro ausente", "ninguna fila leída",
             registro=FILAS[1:])
        caso(23, "registro inexistente", "no existe afirmaciones/01.yaml",
             cambiar_fuentes=lambda d: (d / "afirmaciones" / "01.yaml").unlink())
        caso(23, "ancla cambiada en el texto", "ya no está en el capítulo",
             lambda t: t.replace(ANCLA, "el VaR casi nunca es subaditivo"))
        caso(23, "localizador que nadie leyó", "«ficticio_autor2019, p. 113»",
             lambda t: t.replace('loc="p. 112"', 'loc="p. 113"'))
        caso(23, "la fila trae el extracto", "trae campos que el registro no lleva",
             cambiar_fuentes=lambda d: (d / "afirmaciones" / "01.yaml").write_text(
                 (d / "afirmaciones" / "01.yaml").read_text(encoding="utf-8").replace(
                     '  extracto_sha256:', '  extracto: "el pasaje de la obra"\n  extracto_sha256:', 1),
                 encoding="utf-8"))

        # ---- 24 · entidad o norma sin cita (aviso, por línea)
        parrafo = "                <p>Prueba: el Comité de Basilea revisó el FRTB.</p>\n"
        con_cita = '                <p>Prueba: el Comité de Basilea revisó el FRTB <Cita k="ficticio_autor2019" />.</p>\n'
        for nombre, insertado, debe in (("mención sin cita avisa", parrafo, True),
                                        ("con <Cita> en el párrafo no avisa", con_cita, False)):
            copia = tmp / f"c24_{debe}" / CAPITULO.name
            copia.parent.mkdir()
            texto = base.read_text(encoding="utf-8").replace(PARRAFO, PARRAFO + insertado)
            copia.write_text(texto, encoding="utf-8")
            linea = texto[:texto.index(insertado)].count("\n") + 1
            hay = any(f":{linea}:24:" in l for l in menciones_en(copia))
            ok = hay == debe
            fallos += not ok
            print(f"{VERDE if ok else ROJO}{'✓' if ok else '✗'}{FIN} regla 24 · {nombre}")

    print()
    if fallos:
        print(f"{ROJO}{fallos} casos no se comportaron como se esperaba.{FIN}")
        return 1
    print(f"{VERDE}Todas las reglas de la 18 a la 24 fallan —o avisan— donde deben.{FIN}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
