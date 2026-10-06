#!/usr/bin/env python3
"""Arma los dos talleres calificados desde sus fuentes.

    python3 armar_taller.py                # el T1, como siempre
    python3 armar_taller.py --taller T2    # el T2

Fuentes de los dos:

    tr-head.html              cabecera y estilos, como cualquier capítulo
    06_…html                  de donde sale el bloque TR-CORE, byte a byte
    tr-taller.jsx             TALLER-CORE: los cinco componentes del instrumento

y las propias de cada uno:

    T1 · tr-taller-contenido.jsx    + clave/cifras_taller.json
    T2 · tr-taller2-contenido.jsx   + clave/T2/cifras_t2.json + clave/T2/semilla_t2.mjs

⚠️ **El taller se GENERA; los capítulos no.** Es la única pieza del material que
no es su propia fuente, y hay dos razones que lo obligan:

  1. La regla 2 del verificador del taller dice que ninguna cifra del enunciado
     se escribe a mano. Si el HTML fuera la fuente, escribirlas a mano sería lo
     único posible.
  2. Las series que el taller pinta son decenas de miles de números. Eso no se
     teclea.

⚠️ **Lista blanca de datos.** El congelador trae también las respuestas. Este
archivo copia al HTML solo los campos de la lista blanca de cada taller, y nada
más. Es la regla de anti-fuga en el sitio donde de verdad puede fallar: en el
constructor.

⚠️ **El T1 no cambia un byte por existir el T2** (T2-7, comprobado con su SHA-256).
Su camino —`podar`, `CAMPOS_PUBLICOS`, `CAMPOS_PROHIBIDOS`, `main_t1`— es el de
antes, línea por línea. El T2 reutiliza TALLER-CORE **sin editarlo**: lo toma del
T1, le pone el núcleo de `semilla_t2.mjs` en lugar del suyo y le aplica las
sustituciones de `PARCHES_T2`, cada una comprobada para que case exactamente las
veces que dice. Si TALLER-CORE cambia y una deja de casar, el armado se detiene.
"""

from __future__ import annotations

import argparse
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


def main_t1() -> int:
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


# ============================================================================
# T2 · el taller de la unidad 2 (corte II)
# ============================================================================

CIFRAS_T2 = RAIZ / "talleres" / "clave" / "T2" / "cifras_t2.json"
SEMILLA_T2 = RAIZ / "talleres" / "clave" / "T2" / "semilla_t2.mjs"
CONTENIDO_T2 = AQUI / "tr-taller2-contenido.jsx"
DESTINO_T2 = MATERIAL / "T2_TDR_Taller_unidad_2.html"

NUCLEO_INI = "/* === NÚCLEO INICIO — copiar literal en TALLER-CORE === */"
NUCLEO_FIN = "/* === NÚCLEO FIN === */"

# Lo único del congelador del T2 que puede viajar: una lista blanca, más estrecha que
# la parte `muestra` de `cifras_t2.json`. Qué se deja fuera y por qué está en
# `talleres/clave/T2/prohibidos_t2.json`, que es privado a propósito: este archivo se
# publica, y no puede explicar qué respuesta es cada exclusión. Las cifras que imprime el
# informe del bloque 5 viajan todas juntas en `informe`, las de sus nueve afirmaciones,
# para que estar ahí no distinga a ninguna.
CAMPOS_PUBLICOS_T2 = {
    "meta": ["fecha_valoracion", "fondo_mm", "nominal_mm", "rf_log", "tope"],
    "fondo": ["pesos", "vol", "wmu", "exacto", "sharpe_conv", "sharpe_exacto", "F", "malla", "perdidas"],
    "frontera": ["vol_al_retorno_sin_tope", "vol_al_retorno_con_tope",
                 "ret_al_riesgo_sin_tope", "ret_al_riesgo_con_tope"],
    "cola": ["escenarios", "ruedas_cola", "var", "zeta_orden", "cvar", "cvar_exacto",
             "cvar_sin_par", "cvar_mincvar"],
    "informe_fondo": ["cvar975"],
    "informe_tes": ["sucio", "dv01", "dv01_tramo", "cobertura"],
    "tes": ["nemo", "vence", "cupon", "plazo", "ultimo_cupon", "flujos", "sucio", "causado",
            "limpio", "valor_mm", "tir", "dmac", "dmod", "convexidad", "dv01", "dv01_curva",
            "forward1", "costos_convencion_mm"],
    "tramo": ["valor_mm", "dmod", "dv01_tir", "dv01_curva", "vertices"],
    "sen": ["nemo", "vence", "plazo", "operaciones", "tir_sen", "tir_min", "tir_max", "tir_curva"],
    "tramo_estudio": ["valor_mm", "dmod", "dv01_tir", "dv01_curva", "vertices", "n10"],
    "bono10": ["sucio", "tir", "dmac", "dmod", "convexidad", "dv01", "mas100_mm", "flujos"],
}
COSTOS_T2 = ["cupón semestral", "Actual/360", "30/360", "pagos al día hábil",
             "liquidación T+1", "Actual/365"]

# Segunda red: ninguna de las claves de `prohibidos_t2.json` —privado— puede aparecer en
# el JSON de `D`. Se le suman en tiempo de armado TODAS las claves de las partes `clave`
# del congelador.
PROHIBIDOS_T2 = RAIZ / "talleres" / "clave" / "T2" / "prohibidos_t2.json"

# TALLER-CORE del T1 → el del T2. (viejo, nuevo, veces que tiene que casar).
PARCHES_T2 = [
    ("   TALLER-CORE · componentes del instrumento calificado de la unidad 1\n",
     "   TALLER-CORE · componentes del instrumento calificado de la unidad 1\n"
     "   ⚠️ ESTA COPIA ES LA DEL TALLER DE LA UNIDAD 2: `armar_taller.py --taller T2`\n"
     "   la arma desde la del T1 con el núcleo de su propia semilla y las\n"
     "   sustituciones de `PARCHES_T2`. No se edita aquí.\n", 1),
    ("const PREFIJO = 'tdr_u1t_';", "const PREFIJO = 'tdr_u2t_';", 1),
    ("instrumento: 'TDR-U1T',", "instrumento: 'TDR-U2T',", 2),
    (">Ventana de estimación</p>", ">Su fondo</p>", 1),
    ("{ejes.ventana} ruedas</p>", "{ejes.fondo} · {ejes.pesos.join(' / ')}</p>", 1),
    (">Emisor bajo examen</p>", ">Su TES</p>", 1),
    ("style={{ margin: 0 }}>{ejes.emisorRotulo}</p>", "style={{ margin: 0 }}>{ejes.tesRotulo}</p>", 1),
    ("salen <strong>la ventana de estimación</strong> y{' '}\n"
     "                <strong>el emisor</strong> con los que",
     "salen <strong>el fondo</strong> y{' '}\n"
     "                <strong>el TES</strong> con los que", 1),
    ("le corresponde la ventana de <strong>{previsto.ventana} ruedas</strong>{' '}\n"
     "                    y el emisor <strong>{previsto.emisorRotulo}</strong>",
     "le corresponde el fondo <strong>{previsto.fondo}</strong>{' '}\n"
     "                    y el <strong>{previsto.tesRotulo}</strong>", 1),
    ("el\n                laboratorio del bloque 3 <strong>sigue calculando sus cifras</strong>",
     "los\n                laboratorios del bloque 4 <strong>siguen calculando sus cifras</strong>", 1),
    ("Pero el bloque 1 se responde mirando gráficas,{' '}\n"
     "                <strong>no lo conteste a ciegas</strong>",
     "Pero los bloques 1, 2 y 6 se responden mirando gráficas,{' '}\n"
     "                <strong>no los conteste a ciegas</strong>", 1),
    ("            ventana: datos.ejes.ventana,\n            emisor: datos.ejes.emisor,",
     "            fondo: datos.ejes.fondo,\n            tes: datos.ejes.tes,", 1),
    ("`TDR-U1T_${datos.ejes.canonico}", "`TDR-U2T_${datos.ejes.canonico}", 2),
    ("datos.respuestas['P7.1']", "datos.respuestas['P7.3']", 1),
    ("La bitácora (P7.1) está vacía.", "La bitácora (P7.3) está vacía.", 1),
    # Revisión del 2026-10-03. El registro del barrido imprimía «0.87» y «-400»: con
    # coma decimal y signo tipográfico, como el resto del taller. Y guarda como mucho
    # 40 valores distintos, así que quien barrió los 101 θ leía «40 valores».
    ("return `${k}: ${v.distintos.length} valores entre ${v.min} y ${v.max}`;",
     "const n = (x) => String(x).replace('-', '−').replace('.', ',');\n"
     "                            return `${k}: ${v.distintos.length >= 40 ? '40 o más' : v.distintos.length} "
     "valores entre ${n(v.min)} y ${n(v.max)}`;", 1),
    ("las dos últimas de cada uno son las que puntúan.",
     "las dos últimas de cada uno son las que más puntúan.", 1),
]


def region(texto: str, ini: str, fin: str) -> tuple[int, int]:
    i, f = texto.find(ini), texto.find(fin)
    if i < 0 or f < 0 or f < i:
        raise SystemExit(f"✗ no se encontró la región {ini[:30]}…")
    return i, f + len(fin)


def parchear_core_t2(taller: str) -> str:
    """TALLER-CORE del T1 → el del T2, sin tocar el archivo fuente."""
    mjs = SEMILLA_T2.read_text(encoding="utf-8")
    i, f = region(mjs, NUCLEO_INI, NUCLEO_FIN)
    nucleo = mjs[i:f]
    i, f = region(taller, NUCLEO_INI, NUCLEO_FIN)
    taller = taller[:i] + nucleo + taller[f:]
    for viejo, nuevo, n in PARCHES_T2:
        k = taller.count(viejo)
        if k != n:
            raise SystemExit(f"✗ el parche «{viejo[:50]}…» casa {k} veces y se esperaban {n}. "
                             f"TALLER-CORE cambió: revise `PARCHES_T2`")
        taller = taller.replace(viejo, nuevo)
    return taller


def _sub(d: dict, campos: list) -> dict:
    falta = [k for k in campos if k not in d]
    if falta:
        raise SystemExit(f"✗ el congelador no trae {falta}")
    return {k: d[k] for k in campos}


def podar_t2(c: dict) -> dict:
    P = CAMPOS_PUBLICOS_T2
    fechas = c["panel"]["fechas"]
    com = c["comunes"]
    te = c["tramo_estudio"]
    d = {
        "meta": _sub(c["meta"], P["meta"]),
        "panel": {"sesiones": c["panel"]["sesiones"], "desde": fechas[0], "hasta": fechas[-1],
                  "fechas": fechas, "cortos": c["panel"]["cortos"],
                  "emisores": _sub(c["panel"]["emisores"], ["mu", "sigma"])},
        "comunes": {
            "declarada": com["declarada"],
            "minvar": com["minvar"],
            "mincvar": _sub(com["mincvar"], ["pesos", "cvar975", "vol", "wmu", "perdidas"]),
            "frontera_sin_tope": com["frontera_sin_tope"],
            "frontera_con_tope": com["frontera_con_tope"],
            "frontera_sin_tope_inferior": com["frontera_sin_tope_inferior"],
            "frontera_con_tope_inferior": com["frontera_con_tope_inferior"],
            "rf_6m_efectiva": com["rf_6m_efectiva"], "rf_6m_log": com["rf_6m_log"],
            "zeta_rejilla": com["zeta_rejilla"],
        },
        "curva": _sub(c["curva"], ["vertices", "spot", "par10"]),
        "sen": [_sub(f, P["sen"]) for f in c["sen"]],
        "sen_ruedas": c["sen_ruedas"],
        "tramo_estudio": {**_sub(te, P["tramo_estudio"]),
                          "varianza_quitada": {k: te["historia"][k]["varianza_quitada"]
                                               for k in ("2003", "2018")}},
        "bono10": _sub(c["bono10"], P["bono10"]),
        "fondos": {}, "tes": {},
        # Cifras publicadas que el contenido cita, tal como el congelador las
        # reprodujo en su contraste: ninguna se escribe a mano en el JSX.
        # Sin `conv_2034`: desde la revisión del 2026-10-03, P2.3(d) solo compara con
        # el error de la curva, y la comparación con el código quedó en P6.3(b).
        "publicado": _sub(c["publicado"], ["frontera_al_retorno", "sen_2034"]),
    }
    for nombre, v in c["fondos"].items():
        m = v["muestra"]
        f = _sub(m, P["fondo"])
        f["frontera"] = _sub(m["frontera"], P["frontera"])
        f["cola"] = {a: _sub(m["cola"][a], P["cola"]) for a in ("0.975", "0.99")}
        sigma = c["panel"]["emisores"]["sigma"]
        f["informe"] = {**_sub(m["informe"], P["informe_fondo"]), "wmu": m["wmu"], "vol": m["vol"],
                        "sigma_ponderada": round(sum(w * s for w, s in zip(m["pesos"], sigma)) / 100, 4)}
        # Fuera de muestra viajan las dos colas de cada partición, que el bloque 6 muestra.
        f["fuera"] = [{"particion": k.split(" · ")[0], "alfa": k.split(" · ")[1],
                       "fondo": x["fondo"], "mincvar": x["mincvar"]}
                      for k, x in v["clave"]["fuera_de_muestra"].items()]
        d["fondos"][nombre] = f
    for nemo, v in c["tes"].items():
        m = v["muestra"]
        b = _sub(m, P["tes"])
        # De los costos de convención, los seis que el bloque 3 usa (A3b y A4).
        b["costos_convencion_mm"] = _sub(m["costos_convencion_mm"], COSTOS_T2)
        b["informe"] = {**_sub(m["informe"], P["informe_tes"]), "tir": m["tir"],
                        "forward": round(sum(m["forward1"]) / len(m["forward1"]), 6)}
        b["tramo"] = _sub(m["tramo"], P["tramo"])
        b["tramo"]["varianza_quitada"] = {k: m["tramo"]["historia"][k]["varianza_quitada"]
                                          for k in ("2003", "2018")}
        b["por_rueda_mm"] = m["liquidez"]["por_rueda_mm"]
        d["tes"][nemo] = b

    # Segunda red. Se busca la clave ENTRE COMILLAS Y CON DOS PUNTOS: una subcadena
    # suelta casaría dentro de otra clave legítima (`n10` dentro de `n10_tir`).
    crudo = json.dumps(d, ensure_ascii=False)
    if not PROHIBIDOS_T2.exists():
        raise SystemExit(f"✗ falta {PROHIBIDOS_T2}: sin la segunda red no se arma")
    prohibidas = set(json.loads(PROHIBIDOS_T2.read_text(encoding="utf-8"))["campos"])
    for grupo in ("fondos", "tes"):
        for v in c[grupo].values():
            prohibidas |= set(v["clave"])
    for k in sorted(prohibidas):
        if f'"{k}":' in crudo:
            raise SystemExit(f"✗ FUGA: «{k}» iba a quedar dentro del HTML")
    # `n10` y `n10_tir` viajan en el tramo del capítulo y no en el tramo con el TES
    # propio: la red de arriba no distingue los dos sitios, esta sí.
    for nemo, b in d["tes"].items():
        for k in ("n10", "n10_tir"):
            if k in b["tramo"]:
                raise SystemExit(f"✗ FUGA: la cobertura «{k}» del tramo con {nemo} iba a viajar")
    return d


def main_t2() -> int:
    for ruta in (CIFRAS_T2, SEMILLA_T2, CONTENIDO_T2):
        if not ruta.exists():
            raise SystemExit(f"✗ falta {ruta}")
    cifras = json.loads(CIFRAS_T2.read_text(encoding="utf-8"))
    if not cifras["meta"].get("contraste_ok"):
        raise SystemExit("✗ el congelador no reprodujo lo publicado: no se arma sobre él")
    datos = podar_t2(cifras)

    head = (AQUI / "tr-head.html").read_text(encoding="utf-8")
    for viejo, nuevo in (
            ("<title>Teoría del Riesgo — Plantilla base</title>",
             "<title>Taller de la unidad 2 · El comité de inversiones — Teoría del Riesgo</title>"),
            ("Plantilla base y catálogo de componentes del material de Teoría del Riesgo. "
             "Universidad Santo Tomás.",
             "Instrumento calificado de la unidad 2: leer, interpretar y auditar las gráficas, "
             "los procedimientos y el informe de un fondo y de un TES. Universidad Santo Tomás.")):
        if head.count(viejo) != 1:
            raise SystemExit(f"✗ la cabecera cambió: no casa «{viejo[:40]}…»")
        head = head.replace(viejo, nuevo)

    cap = CAPITULO_FUENTE.read_text(encoding="utf-8")
    i = cap.index("/* === TR-CORE INICIO")
    f = cap.index("/* === TR-CORE FIN ===") + len("/* === TR-CORE FIN === */")
    tr_core = cap[i:f]

    taller = parchear_core_t2((AQUI / "tr-taller.jsx").read_text(encoding="utf-8"))
    contenido = CONTENIDO_T2.read_text(encoding="utf-8")

    bloque_datos = (
        "\n        /* === DATOS INICIO — los genera armar_taller.py desde el "
        "congelador. No se editan a mano === */\n"
        "        const D = " + json.dumps(datos, ensure_ascii=False, separators=(",", ":")) + ";\n"
        "        /* === DATOS FIN === */\n"
    )

    DESTINO_T2.write_text(
        head + "\n" + tr_core + "\n" + bloque_datos + "\n" + taller + "\n" + contenido,
        encoding="utf-8")
    print(f"✓ {DESTINO_T2.name} · {DESTINO_T2.stat().st_size // 1024} KB")
    print(f"  {len(datos['fondos'])} fondos · {len(datos['tes'])} TES · {len(PARCHES_T2)} parches a "
          f"TALLER-CORE · D pesa {len(json.dumps(datos, separators=(',', ':'))) // 1024} KB")
    return 0


def main() -> int:
    ap = argparse.ArgumentParser(description="Arma un taller calificado.")
    ap.add_argument("--taller", choices=("T1", "T2"), default="T1")
    a = ap.parse_args()
    return main_t2() if a.taller == "T2" else main_t1()


if __name__ == "__main__":
    raise SystemExit(main())
