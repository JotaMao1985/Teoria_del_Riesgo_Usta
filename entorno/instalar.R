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
