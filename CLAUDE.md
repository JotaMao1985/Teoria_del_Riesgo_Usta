# Teoría del Riesgo — contexto del proyecto

Material de estudio autónomo del espacio académico **Teoría del Riesgo** (Universidad Santo
Tomás, Estadística, periodo 8, 2 créditos, 2026-II). Quince capítulos, cada uno un archivo
HTML autocontenido que se abre con doble clic.

**El plan es la fuente de verdad:** [`PLAN_MATERIAL_TEORIA_DEL_RIESGO.md`](PLAN_MATERIAL_TEORIA_DEL_RIESGO.md).
Trae las decisiones de arquitectura (D1–D9), el detalle capítulo por capítulo, la lista de
tareas con sus criterios de aceptación y el registro de ejecución. Léalo antes de tocar nada.

Las convenciones de autoría están en [`Material html/README.md`](Material%20html/README.md).

## Estado

| Fase | Estado |
|---|---|
| 0 · Fundación (T1–T5) | ✅ completada 2026-08-07 · punto de control A aprobado |
| 1 · Piloto: capítulo 4 (VaR) — tarea 6 | ⬅️ **siguiente** |
| 2–5 · Los otros catorce capítulos, portal, Quarto | pendientes |

## Ciclo de trabajo

```bash
python3 "Material html/_plantilla/ensamblar.py"                    # fuentes → tr-base.html
python3 "Material html/_plantilla/migrar.py"                       # plantilla → capítulos
python3 "Material html/_plantilla/verificar.py" --con-salidas      # las doce reglas
```

Entorno: `conda activate teoria-riesgo` · `python3 entorno/humo.py` comprueba que esté todo.

Un capítulo nuevo nace copiando `_plantilla/tr-base.html`, cambiando `CONFIG` y
reemplazando las secciones. **El bloque entre `TR-CORE INICIO` y `TR-CORE FIN` no se edita
a mano**: se genera y se estampa. La comprobación 1 existe para cazar exactamente eso.

## Seis reglas que no se negocian

Están todas comprobadas por `verificar.py`, pero conviene saberlas antes de escribir:

1. **Dos lenguajes, siempre.** Todo bloque de código trae Python y R, dentro de un
   `CodeTabs`. Python es la pestaña por defecto.
2. **Toda salida declarada tras `#>` debe haberse ejecutado.** La regla 9 corre el código
   en los dos lenguajes y compara. No escriba una cifra sin haberla producido.
3. **Nada de simular dentro de un bloque cuando las dos pestañas deben coincidir.**
   `np.random.default_rng(2026)` y `set.seed(2026)` **no** dan la misma muestra. Los datos
   van literales o del CSV congelado. Donde el capítulo simule de verdad (Montecarlo en el
   4 y en el 12), hay que decirlo en el texto.
4. **Cada sección abre con `<Motivacion>`**: escena concreta, tensión, gancho. Máximo ~80
   palabras. Nunca «En esta sección estudiaremos…».
5. **Ningún ejercicio pide construir desde cero.** Se traza, se audita, se compara, se
   interpreta y se justifica. Escribir el programa es de los talleres.
6. **Cuota R1–R9 por capítulo**, con R1, R3, R7 y R9 obligatorios. R3 es «Audita a la IA» y
   lleva cuota de dos: es un compromiso explícito del syllabus.

## Datos

`datos/` está versionado **a propósito** (no en `.gitignore`): sin instantáneas congeladas,
la regla 9 no puede existir. `datos/MANIFIESTO.md` guarda fuente, fecha y SHA-256.

⚠️ Volver a ejecutar `datos/descargar.py` produce una instantánea **equivalente pero no
idéntica** —Yahoo reajusta los precios hacia atrás con cada dividendo—. Si lo hace, mire el
`git diff` y vuelva a correr `verificar.py --con-salidas`.

⚠️ **`curva_tes.csv` está pendiente** y bloquea los capítulos 9 y 10. Hay que bajarla a mano
del Banco de la República. Ningún otro capítulo depende de ella.

## Notas de entorno

- Los paquetes no se llaman como parece: `arch-py`, `quantlib-python`, `lpSolve`. El de
  QuantLib es traicionero: con `quantlib` a secas el entorno se crea sin error y falla
  después, en un `import QuantLib`.
- `Laboratorio` solo puede hacer **aritmética**: el cálculo ocurre en el navegador. Ajustar
  un GARCH o resolver un programa cuadrático se precomputa en Python sobre una malla y se
  declara con `modo="malla"`.

## Idioma y estilo

Todo en español. Término técnico en inglés con la traducción entre paréntesis la primera
vez de cada capítulo (*Expected Shortfall* (déficit esperado), *backtesting* (prueba
retrospectiva)); después solo en inglés. Excepción: lo que tiene traducción asentada va en
español a secas —valor en riesgo, volatilidad, duración, convexidad, cópula—.

Coma decimal en la prosa y en las gráficas; punto dentro de los bloques de código, que es
la convención de los dos lenguajes.
