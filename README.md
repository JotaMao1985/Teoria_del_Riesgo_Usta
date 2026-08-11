# Teoría del Riesgo — Universidad Santo Tomás, 2026-II

Material de estudio autónomo del espacio académico **Teoría del Riesgo** (Estadística,
periodo 8, 2 créditos). Quince capítulos, cada uno **un archivo HTML autocontenido** que se
abre con doble clic: sin servidor, sin `npm`, sin build.

El plan completo —decisiones de arquitectura, capítulo por capítulo, tareas y puntos de
control— está en [`PLAN_MATERIAL_TEORIA_DEL_RIESGO.md`](PLAN_MATERIAL_TEORIA_DEL_RIESGO.md).

## Estado

**Unidad 1 completa** — seis de los quince capítulos, con el punto de control C aprobado el
2026-08-10. Las unidades 2 y 3 están planificadas capítulo a capítulo y todavía no escritas.

| Unidad | Capítulos | Estado |
|---|---|---|
| 1 · Riesgo de mercado | 1 Riesgo y rendimiento · 2 Volatilidad · 3 CAPM · 4 VaR · 5 Expected Shortfall · 6 Backtesting | ✅ |
| 2 · Portafolio y renta fija | 7 a 10 | pendiente |
| 3 · Derivados, crédito y extremos | 11 a 15 | pendiente |

## Estructura

```
Material html/          los capítulos, y en _plantilla/ la librería y sus guiones
datos/                  instantáneas congeladas en CSV + manifiesto con SHA-256
talleres/               TDR-01…06, uno por capítulo, y TDR-U1, el taller de unidad
entorno/                environment.yml (conda) e instalar.R
```

Los capítulos se abren con doble clic desde `Material html/`. El portal `index.html`, que es
lo que publicará GitHub Pages, es la tarea 21 del plan y llega con la fase 5.

## Puesta en marcha

```bash
conda env create -f entorno/environment.yml && conda activate teoria-riesgo
```

```bash
Rscript entorno/instalar.R
```

## Ciclo de trabajo

```bash
python3 "Material html/_plantilla/ensamblar.py"    # fuentes   → tr-base.html
python3 "Material html/_plantilla/migrar.py"       # plantilla → capítulos
python3 "Material html/_plantilla/verificar.py"    # comprueba las doce reglas
```

Con `--con-salidas`, la comprobación 9 **ejecuta** cada bloque de código en Python y en R y
compara su resultado con la cifra que el capítulo declara tras `#>`. Es lenta y es la que
justifica que los datos vayan congelados.

Las convenciones de autoría —motivación obligatoria, salida dentro del bloque, los dos
lenguajes, la taxonomía R1–R9— están en [`Material html/README.md`](Material%20html/README.md).

## Dos cosas que conviene saber antes de tocar nada

**El bloque `TR-CORE` no se edita a mano.** Se genera con `ensamblar.py` y se estampa en los
capítulos con `migrar.py`. La comprobación 1 del verificador compara byte a byte y existe
justamente para cazar una edición manual.

**Los datos van congelados y versionados.** `datos/` no está en `.gitignore` a propósito:
toda salida que el material declara tras `#>` se contrasta contra la ejecución real, y eso
solo es posible si los datos no cambian bajo los pies. `datos/descargar.py` documenta cómo
se generaron; `datos/MANIFIESTO.md` guarda fuente, fecha y SHA-256 de cada archivo.

---

Docente y diseño del material: Javier Mauricio Sierra.
