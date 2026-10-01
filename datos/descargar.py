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
import json
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


# Curva cero cupón de los TES: servicio REST de SUAMECA, el portal de
# estadísticas del Banco de la República. Los catorce identificadores son los del
# plan BETAS_TASAS_TES y se comprobaron uno a uno el 2026-09-29.
SUAMECA = ("https://suameca.banrep.gov.co/estadisticas-economicas-back/rest/"
           "estadisticaEconomicaRestService/consultaInformacionSerie?idSerie=")
SERIES_TES = {
    # vértices publicados, en porcentaje
    15272: "pesos_1a", 15273: "pesos_5a", 15274: "pesos_10a",
    15275: "uvr_1a", 15276: "uvr_5a", 15277: "uvr_10a",
    # parámetros de Nelson-Siegel tal como se publican: los de pesos en fracción
    # (0.13 = 13 %) y los de UVR en porcentaje (6.41 = 6,41 %); τ en años
    15278: "b0_pesos", 15279: "b1_pesos", 15280: "b2_pesos", 15281: "tau_pesos",
    15282: "b0_uvr", 15283: "b1_uvr", 15284: "b2_uvr", 15285: "tau_uvr",
}
INICIO_TES = "2003-01-01"  # primer dato de las catorce series


def _suameca(id_serie):
    """Una serie diaria de SUAMECA, indexada por fecha de Bogotá.

    Va por `curl` y no por `urllib`, y no es capricho: el servidor del Banco
    envía su certificado y la raíz, pero NO el intermedio (GeoTrust EV RSA CA
    G2). `curl` lo completa con el almacén del sistema; Python no, y falla con
    CERTIFICATE_VERIFY_FAILED aunque se le pase `certifi` (comprobado el
    2026-09-29). La salida fácil —apagar la verificación— es la que no se toma.
    """
    import pandas as pd
    p = subprocess.run(["curl", "-sS", "--fail", "--max-time", "120",
                        "-A", "Mozilla/5.0", SUAMECA + str(id_serie)],
                       capture_output=True, text=True)
    if p.returncode != 0:
        raise SystemExit(f"ERROR al bajar la serie {id_serie} de SUAMECA: "
                         f"{p.stderr.strip()[-300:]}")
    datos = json.loads(p.stdout)[0]["data"]
    fechas = (pd.to_datetime([ms for ms, _ in datos], unit="ms", utc=True)
                .tz_convert("America/Bogota").tz_localize(None).normalize())
    s = pd.Series([v for _, v in datos], index=fechas, dtype="float64").dropna()
    if s.index.duplicated().any():
        raise SystemExit(f"ERROR: la serie {id_serie} trae fechas repetidas")
    return s


def descargar_curva_tes():
    """Curva cero cupón de los TES del Banco de la República, un corte por mes.

    El Banco no publica la curva entera: publica tres vértices —1, 5 y 10 años,
    en pesos y en UVR— y los parámetros de Nelson-Siegel con que los calcula.
    El corte de cada mes es la última rueda en que están los tres vértices de la
    moneda, con los parámetros de esa misma rueda. El de UVR lleva su propia
    columna de fecha porque la serie UVR tiene días sin dato y su corte puede
    caer antes que el de pesos: poner las dos monedas en una fila sin decirlo
    fabricaría una curva que no existió ningún día.

    Termina el 2025-12-30, la misma rueda que cierra el panel de acciones, para
    que el tramo de TES del fondo y sus acciones se valoren sobre la misma fecha.
    Igual que Yahoo, el Banco puede revisar su historia —ya lo hizo en 2021—, así
    que volver a descargar puede no dar un archivo idéntico: mire el `git diff`.
    """
    import pandas as pd
    diario = pd.DataFrame({col: _suameca(i) for i, col in SERIES_TES.items()})
    diario = diario.sort_index().loc[INICIO_TES:FIN]

    def cortes(moneda):
        vertices = [f"{moneda}_{m}a" for m in (1, 5, 10)]
        parametros = [f"{b}_{moneda}" for b in ("b0", "b1", "b2", "tau")]
        d = diario[vertices + parametros].dropna(subset=vertices)
        if d[parametros].isna().any().any():
            raise SystemExit(f"ERROR: hay ruedas con vértices {moneda} y sin parámetros")
        d = d.groupby(d.index.to_period("M")).tail(1)
        return d.rename_axis("fecha").reset_index()

    pesos = cortes("pesos")
    uvr = cortes("uvr").rename(columns={"fecha": "fecha_uvr"})
    pesos["mes"] = pesos["fecha"].dt.to_period("M")
    uvr["mes"] = uvr["fecha_uvr"].dt.to_period("M")
    curva = pesos.merge(uvr, on="mes", how="left").drop(columns="mes")
    faltan = curva["fecha_uvr"].isna().sum()
    if faltan:
        raise SystemExit(f"ERROR: {faltan} meses sin ningún corte UVR")

    numericas = curva.columns.drop(["fecha", "fecha_uvr"])
    curva[numericas] = curva[numericas] + 0.0  # sin «-0.00» en el archivo
    salida = AQUI / "curva_tes.csv"
    curva.to_csv(salida, index=False, date_format="%Y-%m-%d", float_format="%.2f")
    desfase = (curva["fecha"] != curva["fecha_uvr"]).sum()
    return salida, (f"{len(curva)} meses · {curva['fecha'].min().date()} → "
                    f"{curva['fecha'].max().date()} · vértices de 1, 5 y 10 años en "
                    f"pesos y en UVR + parámetros de Nelson-Siegel · corte UVR "
                    f"distinto del de pesos en {desfase} meses")


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
    "tes": ("curva_tes.csv", descargar_curva_tes,
            "Banco de la República · SUAMECA, servicio REST · series 15272–15285 "
            "(plan BETAS_TASAS_TES) · SEN y MEC con cálculos del Banco"),
}

# `curva_tes.csv` estuvo fuera de esta lista hasta el 2026-09-29 porque se creía
# que el Banco no exponía la curva por un extremo invocable desde un guion. Sí lo
# hace: el servicio REST de SUAMECA, que es el que usa su propio portal.


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
        "---",
        "",
        "## Advertencias de `curva_tes.csv`",
        "",
        "Medidas al congelarla (2026-09-29) sobre los 276 cortes del archivo. Como las",
        "del panel, **no se corrigen**: se declaran, y el capítulo que use la curva las",
        "hereda.",
        "",
        "- **No es una curva entera: son tres vértices.** El Banco publica la tasa cero",
        "  cupón a 1, 5 y 10 años, en pesos y en UVR, y los parámetros de Nelson-Siegel",
        "  con que la calcula. Cualquier otro plazo es una reconstrucción, y hay que",
        "  decir con qué.",
        "- **τ no se estima: está fijo** en 3,7 años para pesos y 2,3 para UVR en los",
        "  276 meses. Con τ fijo, los tres vértices determinan exactamente los tres β",
        "  —el sistema 3×3 tiene número de condición 38,8 en pesos y 27,1 en UVR—, así",
        "  que Nelson-Siegel sobre estos datos es una interpolación y su error de ajuste",
        "  es cero por construcción.",
        "- **Los parámetros de pesos se publican en fracción y con dos decimales**:",
        "  `b0_pesos` = 0.12 es un 12 %, con resolución de un punto porcentual.",
        "  Reconstruir los vértices con ellos se equivoca 0,29 pp en promedio y 0,93 pp",
        "  en el peor corte (5 años, 2018-03-28), y pasa de 0,25 pp en 176 de los 276",
        "  meses. Los de UVR van en porcentaje y reconstruyen sus vértices con 0,004 pp.",
        "  Resolver el sistema 3×3 con τ = 3,7 devuelve los β de pesos que reproducen",
        "  los vértices exactos.",
        "- **Y el redondeo no lo explica todo antes de 2019.** Desde el 4 de marzo de",
        "  2019 los β recuperados y los publicados no se separan más de 0,52 pp, lo que",
        "  cabe en un redondeo a un punto; antes llegan a 0,82 · 0,92 · 1,76 pp en β₀ · β₁",
        "  · β₂, así que en la historia vieja parámetros y vértices no salen del mismo",
        "  cálculo. El archivo no permite saber por qué. Lo mide el bloque de la sección 5",
        "  del capítulo 9.",
        "- **La capitalización no está declarada.** La ficha de SUAMECA dice",
        "  «Porcentaje» y nada más. El documento metodológico de referencia del Banco",
        "  —Arango, Melo y Vásquez (2002), *Borradores de Economía* 196, ec. A.1.2.3—",
        "  descuenta con exp(−s·m/100): capitalización continua. Y los vértices",
        "  publicados salen de evaluar la fórmula de Nelson-Siegel en los parámetros",
        "  publicados (en UVR, a 0,004 pp), así que están en la convención de la",
        "  fórmula. No es un detalle: el 2025-12-30 los 13,13 % a diez años leídos",
        "  como continuos son un 14,03 % efectivo anual, y el precio de un cero a diez",
        "  años pasa de 26,90 a 29,12 por cada 100 según cuál se lea. El capítulo que",
        "  use la curva declara cuál adopta.",
        "- **La serie de pesos cambia de método el 4 de marzo de 2019.** Según nota",
        "  aclaratoria del Banco, un ajuste metodológico de mayo de 2021 recalculó la",
        "  historia de pesos desde esa fecha, y no la anterior. La ventana del curso",
        "  (2018–2025) cruza la ruptura, aunque en los cortes mensuales no se ve un salto.",
        "- **Uso informativo, no de valoración.** Otra nota aclaratoria, vigente desde",
        "  2023: las tasas TES del Banco no están pensadas para valorar portafolios, y",
        "  para eso remite a los proveedores de precios. El curso las usa como curva de",
        "  referencia declarada, no como precio oficial del tramo de TES.",
        "- **El corte UVR lleva su propia fecha** (`fecha_uvr`). La serie UVR tiene 548",
        "  días sin dato, casi todos entre 2006 y 2013, y en 32 meses su último dato cae",
        "  entre 1 y 10 días antes que el de pesos.",
        "- **La serie diaria, que no se congela, tiene un día roto**: el 2009-06-23 el",
        "  vértice de pesos a un año vale 0,51 %, entre 5,74 % y 5,63 %. No toca ningún",
        "  corte mensual; quien congele la diaria tiene que decidir qué hace con él.",
        "",
    ]
    manifiesto.write_text("\n".join(lineas), encoding="utf-8")
    print(f"\nOK  {len(filas)} conjuntos · manifiesto reescrito")
    return 0


if __name__ == "__main__":
    sys.exit(main())
