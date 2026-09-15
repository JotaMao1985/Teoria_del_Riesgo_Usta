#!/usr/bin/env Rscript
# Paquetes de R del curso Teoría del Riesgo · Universidad Santo Tomás 2026-II
#
#   Rscript entorno/instalar.R
#
# R es la lengua materna de los estudiantes que llegan del programa de
# Estadística: en el material es la segunda pestaña de cada bloque, no un
# apéndice. Todo lo que el curso calcula en Python se calcula también aquí.

espejo <- "https://cloud.r-project.org"

paquetes <- c(
  # Núcleo
  "tidyverse",   # manipulación y gráficas; el puente desde pandas
  "zoo",         # series con índice de fecha
  # El capítulo 1 comprueba la huella SHA-256 de cada instantánea contra
  # `datos/MANIFIESTO.md`, y R base no trae SHA-256 —`tools::md5sum` es lo único
  # que hay—. Suele venir instalado como dependencia de tidyverse, pero se
  # declara explícito: un paquete del que depende un bloque del material no
  # puede estar ahí por accidente.
  "digest",      # SHA-256 de los archivos congelados

  # Unidad 1 — volatilidad, VaR, ES y backtesting
  "rugarch",     # GARCH y familia; el equivalente de `arch`
  "PerformanceAnalytics",

  # Unidad 2 — optimización de portafolio y renta fija
  "quadprog",    # programación cuadrática: media-varianza
  # `lpSolve` y no `Rglpk` para la optimización CVaR: Rglpk enlaza contra la
  # librería GLPK del sistema y no compila sin ella —falla en un Mac limpio, y
  # el mensaje habla de un archivo de cabecera, no de lo que hay que instalar—.
  # lpSolve trae su propio solucionador en el paquete y basta para un programa
  # lineal como el de Rockafellar-Uryasev.
  "lpSolve",

  # Unidad 3 — derivados, crédito y valores extremos
  "pROC",        # ROC, AUC y Gini
  # El capítulo 13 pone gradient boosting frente a la logística, y la regla 1
  # del curso exige las dos pestañas: sin este paquete la sección 7 se queda
  # sin su lado en R. Se compila desde fuente —este R es el de Homebrew y su
  # `pkgType` es "source"—, tarda unos minutos y no necesita cmake; `Matrix`,
  # `data.table` y `jsonlite` vienen con tidyverse. Y no da igual cómo se
  # invoque: el paquete de R va por detrás del de Python en versión menor
  # (3.2.1.1 contra 3.3.0), así que las dos pestañas solo coinciden con todo
  # sorteo apagado —`subsample=1`, `colsample_bytree=1`, `tree_method="exact"`
  # y sobre todo `nthread=1`, porque el reparto entre hilos cambia el orden de
  # acumulación—. Comprobado así: mismo AUC y mismas PD a la sexta cifra.
  "xgboost",
  "extRemes",    # GEV y POT; el equivalente de `pyextremes`
  "evir"         # trae `danish`, la serie de cola pesada del capítulo 15
)

faltan <- paquetes[!vapply(paquetes, requireNamespace, logical(1), quietly = TRUE)]

if (length(faltan) == 0L) {
  cat("Todos los paquetes ya estaban instalados.\n")
} else {
  cat("Instalando:", paste(faltan, collapse = ", "), "\n")
  install.packages(faltan, repos = espejo)
}

# Se comprueba que CARGUEN, no solo que estén: un paquete instalado a medias
# —lo normal cuando falta una librería del sistema— aparece como presente y
# revienta la primera vez que alguien lo usa, en clase.
malos <- character(0)
for (p in paquetes) {
  ok <- tryCatch({ suppressPackageStartupMessages(library(p, character.only = TRUE)); TRUE },
                 error = function(e) FALSE)
  if (!ok) malos <- c(malos, p)
}

if (length(malos)) {
  cat("\nNO CARGAN:", paste(malos, collapse = ", "), "\n")
  quit(status = 1)
}
cat("\nLos", length(paquetes), "paquetes cargan correctamente.\n")
