# Teoría del Riesgo — Universidad Santo Tomás, 2026-II

Material de estudio autónomo del espacio académico **Teoría del Riesgo** (Estadística,
periodo 8, 2 créditos). Quince capítulos, cada uno **un archivo HTML autocontenido** que se
abre con doble clic: sin servidor, sin `npm`, sin build.

El plan completo —decisiones de arquitectura, capítulo por capítulo, tareas y puntos de
control— está en [`PLAN_MATERIAL_TEORIA_DEL_RIESGO.md`](PLAN_MATERIAL_TEORIA_DEL_RIESGO.md).

## Estructura

```
Material html/          los capítulos, y en _plantilla/ la librería y sus guiones
datos/                  instantáneas congeladas en CSV + manifiesto con SHA-256
talleres/               cuadernos Quarto, uno por capítulo
entorno/                environment.yml (conda) e instalar.R
index.html              portal; es lo que publica GitHub Pages
```

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
