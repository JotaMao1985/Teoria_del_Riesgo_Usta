#!/usr/bin/env python3
"""
Reproduce las instantáneas congeladas de `datos/`.

**No se ejecuta durante el curso.** Los capítulos leen los CSV; este guion solo
existe para poder reponer una instantánea y para dejar por escrito de dónde
salió cada cifra. La decisión D3 del plan explica por qué los datos van
congelados: la comprobación 9 contrasta cada salida declarada tras `#>` con la
que el código produce de verdad, y contra una API en vivo ese número cambia
todos los días — el verificador fallaría siempre y la única salida sería
apagarlo, que es justo lo que la regla existe para impedir.

⚠️ **Este guion NO reproduce el archivo idéntico, y conviene saberlo.** Yahoo
recalcula los precios ajustados hacia atrás cada vez que hay un dividendo, así
que dos descargas del mismo rango difieren. Medido el 2026-08-07: con cuatro
decimales cambiaban 6757 de 9585 celdas entre una ejecución y la siguiente; con
el redondeo a pesos enteros que se usa ahora, 24 —y de un peso cada una—.

De ahí que la instantánea la congele **git, no este guion**. Quien lo vuelva a
ejecutar está creando una instantánea NUEVA, y tiene que:

  1. mirar el `git diff` —que es lo que hace visible el cambio en vez de
     silencioso—, y
  2. volver a correr `verificar.py --con-salidas` y actualizar los `#>` que se
     hayan movido.

Al terminar reescribe `MANIFIESTO.md` con la fuente, la fecha y el SHA-256 de
cada archivo.

Uso:
    python3 datos/descargar.py              # todo lo que se pueda
    python3 datos/descargar.py bvc          # un conjunto concreto
"""

import hashlib
import re
import subprocess
import sys
import warnings
from datetime import date
from pathlib import Path

warnings.filterwarnings("ignore")

AQUI = Path(__file__).resolve().parent
INICIO, FIN = "2018-01-01", "2025-12-31"

# Los símbolos NO se dan por buenos: se comprobaron uno a uno contra Yahoo el
# 2026-08-07 y varios de los evidentes no existen. Queda anotado aquí porque el
# próximo que reponga la instantánea se ahorra el mismo descubrimiento.
#
#   BCOLOMBIA.CL   vacío — Bancolombia no cotiza en Yahoo con ese símbolo,
#                  ni como PFBCOLOM.CL. Se sustituye por Banco de Bogotá, que
#                  cumple el mismo papel: un banco comercial puro.
#   ^COLCAP        no existe como índice. Se usa ICOLCAP.CL, el ETF que lo
#                  replica y que sí cotiza.
TICKERS = {
    "ECOPETROL.CL": "Ecopetrol · petróleo",
    "BOGOTA.CL": "Banco de Bogotá · banca comercial",
    "GRUPOSURA.CL": "Grupo Sura · holding financiero y asegurador",
    "ISA.CL": "ISA · infraestructura regulada",
    "ICOLCAP.CL": "iShares COLCAP · referencia de mercado",
}

HUECO_MAXIMO = 7  # días naturales; una semana bursátil con festivo de por medio


def _yf():
    try:
        import yfinance
        return yfinance
    except ImportError:
        print("ERROR: falta yfinance. `conda env create -f entorno/environment.yml`",
              file=sys.stderr)
        raise SystemExit(1)


def descargar_bvc():
    """Cierres ajustados del portafolio del hilo conductor.

    Se cruzan las series por fecha en vez de rellenar: una serie con huecos
    interpolados fabrica días de volatilidad cero, y eso contamina todo lo que
    estima el capítulo 2. Se prefiere perder filas a inventarlas.
    """
    import pandas as pd
    yf = _yf()

    series = {}
    for t in TICKERS:
        df = yf.download(t, start=INICIO, end=FIN, progress=False,
                         auto_adjust=True, threads=False)
        if df is None or df.empty:
            raise SystemExit(f"ERROR: {t} no devolvió datos. Revise el símbolo.")
        series[t] = df["Close"].squeeze().dropna()

    panel = pd.concat(series, axis=1, join="inner").sort_index()
    panel.columns = list(TICKERS)
    panel.index.name = "fecha"

    huecos = panel.index.to_series().diff().dt.days
    peores = huecos[huecos > HUECO_MAXIMO]
    if len(peores):
        print(f"    aviso: {len(peores)} huecos de más de {HUECO_MAXIMO} días "
              f"(el mayor, {int(peores.max())} días el {peores.idxmax().date()})")

    salida = AQUI / "bvc_diario.csv"
    # Pesos enteros, y no por estética. Los precios ajustados de Yahoo se
    # recalculan hacia atrás con cada dividendo, así que dos descargas del mismo
    # rango difieren en milésimas: con cuatro decimales, 6757 de 9585 celdas
    # cambiaban entre una ejecución y la siguiente. Redondear a la unidad —que
    # es la precisión con la que cotiza la BVC— absorbe ese ruido y hace que
    # reponer la instantánea no invalide en silencio las salidas del material.
    panel.round(0).astype("int64").to_csv(salida)
    return salida, f"{len(panel)} filas · {panel.index.min().date()} → {panel.index.max().date()}"


def descargar_sp500():
    """El S&P 500 sirve de contraste de colas: un mercado profundo frente a uno
    pequeño. Se usa en el capítulo 1 y en el 15."""
    yf = _yf()
    df = yf.download("^GSPC", start=INICIO, end=FIN, progress=False,
                     auto_adjust=True, threads=False)
    if df is None or df.empty:
        raise SystemExit("ERROR: ^GSPC no devolvió datos.")
    s = df["Close"].squeeze().dropna().round(4)
    s.index.name = "fecha"
    s.name = "GSPC"
    salida = AQUI / "sp500_diario.csv"
    s.to_csv(salida)
    return salida, f"{len(s)} filas · {s.index.min().date()} → {s.index.max().date()}"


def descargar_german_credit():
    """German Credit (UCI), vía OpenML. Mil solicitudes con su desenlace."""
    from sklearn.datasets import fetch_openml
    d = fetch_openml("credit-g", version=1, as_frame=True, parser="auto")
    df = d.frame
    salida = AQUI / "german_credit.csv"
    df.to_csv(salida, index=False)
    reparto = df["class"].value_counts().to_dict()
    return salida, f"{len(df)} filas · {df.shape[1]} columnas · {reparto}"


def descargar_perdidas_operativas():
    """Incendios daneses (`evir::danish`): 2167 siniestros de 1980 a 1990, en
    millones de coronas de 1985.

    Son datos DANESES y el capítulo 15 lo dice de entrada. No hay serie
    colombiana de pérdidas operativas pública con el detalle que EVT necesita, y
    esta es la de referencia de la literatura —McNeil la usa en *Quantitative
    Risk Management*, que ya está en la bibliografía del syllabus—. Es preferible
    una serie real ajena y bien documentada a una simulada que finja ser local.
    """
    salida = AQUI / "perdidas_operativas.csv"
    guion = f"""
    if (!requireNamespace("evir", quietly = TRUE))
        install.packages("evir", repos = "https://cloud.r-project.org", quiet = TRUE)
    data(danish, package = "evir")
    write.csv(data.frame(perdida = as.numeric(danish)),
              "{salida}", row.names = FALSE)
    cat(length(danish), "\\n")
    """
    p = subprocess.run(["Rscript", "-e", guion], capture_output=True, text=True)
    if p.returncode != 0:
        raise SystemExit("ERROR al extraer `danish` de evir:\n" + (p.stderr or "")[-500:])
    return salida, f"{p.stdout.strip().splitlines()[-1]} siniestros · millones de coronas de 1985"


def sha(ruta):
    return hashlib.sha256(ruta.read_bytes()).hexdigest()


FUENTES = {
    "bvc": ("bvc_diario.csv", descargar_bvc,
            "Yahoo Finance vía yfinance · cierre ajustado · "
            + ", ".join(TICKERS)),
    "sp500": ("sp500_diario.csv", descargar_sp500,
              "Yahoo Finance vía yfinance · índice ^GSPC"),
    "credito": ("german_credit.csv", descargar_german_credit,
                "UCI German Credit vía OpenML (credit-g, v1)"),
    "extremos": ("perdidas_operativas.csv", descargar_perdidas_operativas,
                 "evir::danish · incendios daneses 1980–1990"),
}

# `curva_tes.csv` NO está aquí y es deliberado: el Banco de la República publica
# la curva cero cupón de los TES, pero no por un extremo estable que se pueda
# invocar desde un guion. Se descarga a mano y se anota en el manifiesto. Los
# capítulos 9 y 10 dependen de ella; hasta que exista, están bloqueados.


def previo():
    """Lo ya anotado en el manifiesto: {archivo: (fecha, detalle)}.

    Hace falta porque `descargar.py bvc` reescribe el manifiesto entero, y sin
    esto se llevaría por delante las entradas de los otros tres conjuntos —el
    manifiesto quedaría diciendo que solo existe uno—.
    """
    f = AQUI / "MANIFIESTO.md"
    if not f.exists():
        return {}
    t = f.read_text(encoding="utf-8")
    fuera = {}
    for bloque in re.finditer(
            r"## `([^`]+)`\n\n- \*\*Fuente:\*\* (.*?)\n- \*\*Descargado:\*\* (\S+)\n"
            r"- \*\*Contenido:\*\* (.*?)\n", t):
        nombre, fuente, fecha, detalle = bloque.groups()
        fuera[nombre] = (fuente, fecha, detalle)
    return fuera


def main():
    pedidos = [a for a in sys.argv[1:] if not a.startswith("-")] or list(FUENTES)
    hoy = date.today().isoformat()
    anterior = previo()
    registro = {}

    for clave in pedidos:
        if clave not in FUENTES:
            print(f"ERROR: «{clave}» no es un conjunto conocido: {', '.join(FUENTES)}",
                  file=sys.stderr)
            return 1
        nombre, fn, fuente = FUENTES[clave]
        print(f"·  {nombre}")
        ruta, detalle = fn()
        print(f"    {detalle}")
        registro[nombre] = (fuente, hoy, detalle)

    # Los conjuntos que no se refrescaron esta vez conservan su fecha y su
    # descripción; el SHA-256 se recalcula del archivo en disco, que es lo que
    # delata si alguien lo tocó por fuera.
    for clave, (nombre, _, _) in FUENTES.items():
        if nombre not in registro and nombre in anterior:
            registro[nombre] = anterior[nombre]

    filas = []
    for nombre, (fuente, fecha, detalle) in registro.items():
        ruta = AQUI / nombre
        if not ruta.exists():
            continue
        filas.append((nombre, fuente, fecha, detalle, sha(ruta),
                      ruta.stat().st_size / 1024))
    filas.sort()

    manifiesto = AQUI / "MANIFIESTO.md"
    lineas = [
        "# Manifiesto de los datos congelados",
        "",
        "Generado por `datos/descargar.py`. **No edite este archivo a mano**: se",
        "reescribe entero en cada descarga.",
        "",
        "El SHA-256 es lo que permite reponer una instantánea sin adivinar qué había",
        "dentro, y lo que delata que un archivo cambió bajo los pies del material.",
        "",
        "> ⚠️ **La instantánea la congela git, no el guion.** Yahoo recalcula los precios",
        "> ajustados hacia atrás con cada dividendo, así que volver a descargar produce",
        "> una instantánea *equivalente*, no *idéntica* — se midieron 24 celdas distintas",
        "> de 9585, de un peso cada una. Después de reponer datos hay que correr",
        "> `verificar.py --con-salidas` y actualizar los `#>` que se hayan movido.",
        "",
    ]
    for nombre, fuente, fecha, detalle, h, kb in filas:
        lineas += [
            f"## `{nombre}`",
            "",
            f"- **Fuente:** {fuente}",
            f"- **Descargado:** {fecha}",
            f"- **Contenido:** {detalle}",
            f"- **Tamaño:** {kb:.0f} KB",
            f"- **SHA-256:** `{h}`",
            "",
        ]
    lineas += [
        "## `curva_tes.csv` — PENDIENTE",
        "",
        "Curva cero cupón de los TES, cortes mensuales. Bloquea los capítulos 9 y 10.",
        "",
        "No se descarga desde aquí porque el Banco de la República no expone la serie",
        "por un extremo estable que un guion pueda invocar. Hay que bajarla a mano de",
        "las estadísticas del emisor y anotar en este archivo la fecha, la ruta exacta",
        "y el SHA-256 resultante.",
        "",
        "---",
        "",
        "## Anomalías conocidas de `bvc_diario.csv`",
        "",
        "Encontradas al escribir el capítulo 4 (2026-08-08). **No se corrigen en el",
        "archivo**: se declaran aquí y el capítulo 4 las convierte en material —la",
        "sección 3 las diagnostica con código y un ejercicio pide decidir qué hacer con",
        "ellas—. Limpiar el panel en silencio enseñaría que los datos llegan limpios.",
        "",
        "- **101 ruedas de 1 916 (5,3 %) sin variación en ninguno de los cuatro",
        "  precios.** El panel se cruza por fechas comunes con el ETF `ICOLCAP.CL`, que",
        "  cotiza días en que las acciones no registran negociación efectiva y Yahoo",
        "  arrastra el cierre anterior. Se concentran en 2018-2019 y 2022. Diluyen la",
        "  volatilidad estimada: excluirlas la sube de 1,5764 % a 1,6197 % diaria.",
        "- **19 y 20 de febrero de 2025: cotización defectuosa.** Los cuatro emisores",
        "  caen entre 10 % y 20 % el 19 y recuperan lo mismo el 20, mientras el ETF que",
        "  los replica sube 1,5 % y 2,0 %. Un desplome real habría arrastrado al ETF.",
        "  Excluir el par mueve la volatilidad de 1,5764 % a 1,4963 %, el VaR histórico",
        "  al 99 % de la muestra completa de 4,077 % a 4,037 %, y el de la ventana de",
        "  250 ruedas de 4,294 % a 3,858 %.",
        "",
        "El diagnóstico que las delata —comparar el rendimiento del portafolio con el",
        "del índice que lo replica— está implementado en la sección 3 del capítulo 4.",
        "",
    ]
    manifiesto.write_text("\n".join(lineas), encoding="utf-8")
    print(f"\nOK  {len(filas)} conjuntos · manifiesto reescrito")
    return 0


if __name__ == "__main__":
    sys.exit(main())
