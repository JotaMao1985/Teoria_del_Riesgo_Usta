#!/usr/bin/env python3
"""Arma `Material html/T1_TDR_Taller_unidad_1.html` desde sus cuatro fuentes.

    tr-head.html            cabecera y estilos, como cualquier capítulo
    06_…html                de donde sale el bloque TR-CORE, byte a byte
    tr-taller.jsx           TALLER-CORE: los cinco componentes del instrumento
    tr-taller-contenido.jsx el contenido: CONFIG, secciones y App
    clave/cifras_taller.json las cifras y las series, del congelador

⚠️ **El taller se GENERA; los capítulos no.** Es la única pieza del material que
no es su propia fuente, y hay dos razones que lo obligan:

  1. La regla 2 del verificador del taller dice que ninguna cifra del enunciado
     se escribe a mano. Si el HTML fuera la fuente, escribirlas a mano sería lo
     único posible.
  2. Las series que el taller pinta —los cuatro emisores, el mercado, el
     portafolio— son 10 000 números. Eso no se teclea.

⚠️ **Lista blanca de datos.** `cifras_taller.json` trae también los barridos, que
son **las respuestas** de P3.1, P3.2 y P3.3. Este archivo copia al HTML solo los
campos que están en `CAMPOS_PUBLICOS`, y nada más. Es la regla 3 —anti-fuga— en
el sitio donde de verdad puede fallar: en el constructor.

    python3 armar_taller.py
"""

from __future__ import annotations

import json
import math
from pathlib import Path

AQUI = Path(__file__).resolve().parent
MATERIAL = AQUI.parent
RAIZ = MATERIAL.parent
CIFRAS = RAIZ / "talleres" / "clave" / "cifras_taller.json"
CAPITULO_FUENTE = MATERIAL / "06_TDR_Backtesting.html"
DESTINO = MATERIAL / "T1_TDR_Taller_unidad_1.html"

# Lo único que puede viajar al HTML. Todo lo demás del JSON se queda fuera.
CAMPOS_PUBLICOS = {
    "panel": ["sesiones", "desde", "hasta", "ruedas_sin_variacion"],
    # ⚠️ Sin "975": el taller no lo usa en ninguna parte y llevaba dentro
    # `es_convencion = 4,7275`, que es exactamente la cifra correcta del primer
    # defecto plantado del bloque 4. Un campo embebido que nadie usa no puede
    # hacer más que filtrarse. Regla para `verificar_taller.py`: todo campo de
    # `D` tiene que aparecer citado en el contenido.
    "medidas": ["95", "99", "brecha_es99_millones", "brecha_es975_millones"],
    # De cada nivel viajan los tres VaR y los dos ES; `gl_t` y `curtosis_exceso`
    # no los cita nadie y se podan abajo.
    "medida_campos": ["normal", "t", "hist", "es_convencion", "es_exacto",
                      "ruedas_cola", "ruedas_teoricas"],
    # ⚠️ Sin `lr_ind`, `p_ind`, `lr_cc`, `p_cc` ni `transicion`. Los usaba la
    # versión de P1.4 que corría sobre el PORTAFOLIO; desde que P1.4 y P3.1
    # corren sobre el emisor (2026-08-18) no los cita nadie, y un campo que
    # nadie usa no puede hacer más que filtrarse. Son además los estadísticos
    # de la prueba de independencia: lo último que conviene dejar suelto en un
    # archivo cuya pregunta de 5 % trata de la prueba de independencia.
    "eje_ventana": ["excepciones", "ruedas_prueba", "tasa", "lr_uc", "p_uc"],
    "eje_emisor": ["rotulo", "beta_diaria", "beta_semanal",
                   "ruedas_sin_variacion", "sigma_diaria"],
}
# Prohibido explícitamente: si alguna de estas claves aparece en el HTML, el
# taller lleva dentro la respuesta de una pregunta que vale el 13 %.
CAMPOS_PROHIBIDOS = ["barrido_nivel", "barrido_lambda", "pasa_ind", "pasa_uc",
                     "pasa_cc", "lambda_vida_media", "N_umbral_005",
                     # Del bloque 4: el informe muestra las cifras EQUIVOCADAS.
                     # Las correctas y el costo de cada defecto son la respuesta
                     # de P4.1 y no pueden viajar dentro del archivo.
                     "brecha_es_cuantil_millones", "brecha_escalamiento_millones",
                     "brecha_suma_millones", "var10_medido", "es_975",
                     # Del bloque 5: el cruce entre la normal y el histórico se
                     # LEE en la gráfica. Si viaja como número, P5.1 se responde
                     # con «ver código fuente».
                     "_cruce"]


def norm_inv(p: float) -> float:
    """Cuantil de la normal estándar, Acklam. Para el QQ-plot precalculado."""
    a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
         1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00]
    b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
         6.680131188771972e+01, -1.328068155288572e+01]
    c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
         -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00]
    d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00,
         3.754408661907416e+00]
    pl, ph = 0.02425, 1 - 0.02425
    if p < pl:
        q = math.sqrt(-2 * math.log(p))
        return (((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)
    if p > ph:
        q = math.sqrt(-2 * math.log(1 - p))
        return -(((((c[0]*q+c[1])*q+c[2])*q+c[3])*q+c[4])*q+c[5]) / ((((d[0]*q+d[1])*q+d[2])*q+d[3])*q+1)
    q = p - 0.5
    r = q * q
    return (((((a[0]*r+a[1])*r+a[2])*r+a[3])*r+a[4])*r+a[5])*q / (((((b[0]*r+b[1])*r+b[2])*r+b[3])*r+b[4])*r+1)


def podar(cifras: dict) -> dict:
    """Se queda con la lista blanca y comprueba que no se cuele lo prohibido."""
    d = {
        "panel": {k: cifras["panel"][k] for k in CAMPOS_PUBLICOS["panel"]},
        "medidas": {k: ({c: v[c] for c in CAMPOS_PUBLICOS["medida_campos"]}
                        if isinstance(v := cifras["medidas"][k], dict) else v)
                    for k in CAMPOS_PUBLICOS["medidas"]},
        "ventana": {}, "emisor": {},
        "diversificacion": {"rho_media": cifras["diversificacion"]["rho_media"]},
    }
    for V, v in cifras["eje_ventana"].items():
        b = v["backtest"]
        d["ventana"][V] = {k: b[k] for k in CAMPOS_PUBLICOS["eje_ventana"]}
        # Del semáforo solo lo que el contenido cita. `var_ultimo`,
        # `var_medio_60` y `capital_por_ultimo` no los usa nadie: el taller
        # reporta el capital por el VaR medio de 60 ruedas, que es la
        # convención del capítulo 6, y dejar la otra vía dentro del archivo
        # regala la comparación entre las dos.
        d["ventana"][V]["semaforo"] = {k: v["semaforo"][k] for k in
                                       ("excepciones_250", "zona", "multiplicador",
                                        "capital_por_medio60")}
        d["ventana"][V]["dentro_de_muestra"] = v["dentro_de_muestra"]
        # `fechas_excepcion` ya NO viaja: la gráfica de excepciones las calcula
        # desde la serie, y desde que P1.4 es del emisor nadie las cita.
    for col, e in cifras["eje_emisor"].items():
        d["emisor"][col] = {k: e[k] for k in CAMPOS_PUBLICOS["eje_emisor"]}
        d["emisor"][col]["serie"] = e["nube"]["y"]
    # Del informe solo viajan las cifras que la mesa REPORTA, que son las
    # equivocadas. Lo correcto ya está en `medidas` o vive en los capítulos.
    inf = cifras["informe"]
    d["informe"] = {
        "cuantil_975": inf["cuantil_975"],
        "var10_raiz": inf["var10_raiz"],
        "var_suma_ponderada": inf["var_suma_ponderada"],
    }
    # La curva de C-1, sin el cruce: ese se lee en la gráfica.
    d["curva_var"] = {k: v for k, v in cifras["curva_var"].items() if not k.startswith("_")}
    d["mercado"] = cifras["eje_emisor"]["ECOPETROL.CL"]["nube"]["x"]
    d["rp"] = cifras["rp"]
    d["fechas"] = cifras["fechas"]

    # Series derivadas para las gráficas del bloque 1, calculadas aquí y no en
    # el navegador: son estáticas y no dependen de ningún eje.
    rp = sorted(cifras["rp"])
    n = len(rp)
    d["qq"] = {
        "teorico": [round(norm_inv((i + 0.5) / n), 4) for i in range(n)],
        "muestral": [round(x, 4) for x in rp],
    }
    mu = sum(cifras["rp"]) / n
    sd = math.sqrt(sum((x - mu) ** 2 for x in cifras["rp"]) / (n - 1))
    xs = [round(-10 + 0.05 * i, 2) for i in range(401)]
    d["densidad_normal"] = {
        "x": xs,
        "y": [round(math.exp(-((x - mu) ** 2) / (2 * sd * sd)) / (sd * math.sqrt(2 * math.pi)), 6)
              for x in xs],
    }
    d["momentos"] = {"media": round(mu, 4), "sigma": round(sd, 4)}

    crudo = json.dumps(d, ensure_ascii=False)
    for prohibido in CAMPOS_PROHIBIDOS:
        if prohibido in crudo:
            raise SystemExit(f"✗ FUGA: «{prohibido}» iba a quedar dentro del HTML")
    return d


def main() -> int:
    if not CIFRAS.exists():
        raise SystemExit(f"✗ falta {CIFRAS}. Corra antes `congelador.py --json`.")

    cifras = json.loads(CIFRAS.read_text(encoding="utf-8"))
    datos = podar(cifras)

    head = (AQUI / "tr-head.html").read_text(encoding="utf-8")
    head = head.replace(
        "<title>Teoría del Riesgo — Plantilla base</title>",
        "<title>Taller de la unidad 1 · La mesa de riesgos — Teoría del Riesgo</title>")
    head = head.replace(
        "Plantilla base y catálogo de componentes del material de Teoría del Riesgo. "
        "Universidad Santo Tomás.",
        "Instrumento calificado de la unidad 1: leer, interpretar y auditar el informe "
        "de riesgo de mercado de un fondo de pensiones. Universidad Santo Tomás.")

    cap = CAPITULO_FUENTE.read_text(encoding="utf-8")
    i = cap.index("/* === TR-CORE INICIO")
    f = cap.index("/* === TR-CORE FIN ===") + len("/* === TR-CORE FIN === */")
    tr_core = cap[i:f]

    taller = (AQUI / "tr-taller.jsx").read_text(encoding="utf-8")
    contenido = (AQUI / "tr-taller-contenido.jsx").read_text(encoding="utf-8")

    bloque_datos = (
        "\n        /* === DATOS INICIO — los genera armar_taller.py desde el "
        "congelador. No se editan a mano === */\n"
        "        const D = " + json.dumps(datos, ensure_ascii=False, separators=(",", ":")) + ";\n"
        "        /* === DATOS FIN === */\n"
    )

    DESTINO.write_text(
        head + "\n" + tr_core + "\n" + bloque_datos + "\n" + taller + "\n" + contenido,
        encoding="utf-8")
    print(f"✓ {DESTINO.name} · {DESTINO.stat().st_size // 1024} KB")
    print(f"  series embebidas: rp {len(datos['rp'])} · mercado {len(datos['mercado'])} · "
          f"{len(datos['emisor'])} emisores · qq {len(datos['qq']['muestral'])}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
