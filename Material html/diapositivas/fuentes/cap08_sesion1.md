---
modulo: ../../08_TDR_Optimizacion_CVaR.html
salida: ../08_TDR_Optimizacion_CVaR_sesion1.html
agenda: si
etiqueta: Sesión 1 de 2 · 90 min
asignatura: Teoría del Riesgo
subtitulo: Del problema al programa — por qué la mínima varianza no protege la cola, y cómo un cuantil se vuelve un programa lineal
objetivo: Al salir, usted sabrá por qué la cartera de mínima varianza no protege la cola de este fondo, por qué el mínimo de la función de Rockafellar-Uryasev es el CVaR y cómo ese mínimo se escribe como un programa lineal que cualquier solucionador resuelve.
---

<!--
  Capítulo 8 · Optimización CVaR · sesión 1 de 2 (90 min).
  Cubre la portada, las secciones 1 y 2 y la primera mitad de la 3 (hasta el
  programa resuelto y el R3 de la cola fijada). La sesión 2 retoma la sección 3
  por la columna exacta y sigue con la 4, la 5 y el taller.
  Estimador: la sección 1 usa el cuantil interpolado (187 y 76 millones al 99 %);
  la 3, el estadístico de orden. No se mezclan.
-->

# Antes de calcular {seccion=portada}

> Este capítulo cambia una sola cosa del anterior: el objetivo. El fondo, el panel y los cuatro emisores son los mismos, y por eso se puede comparar.

???
Arrancar recordando el cierre del capítulo 7: la cartera de mínima varianza, 20,76 · 38,13 · 15,97 · 25,14, con un 23,93 % de volatilidad. Hoy se le hace una pregunta que el capítulo 7 no hizo.

## La mínima varianza pierde más que el comité en el 1 % de los peores días {.idea}

Al 99 %, la cartera del capítulo 7 tiene más CVaR que los pesos puestos a ojo: **187 millones** en la convención w′μ y **76** medidos sobre lo que el fondo cobra. Con las dos varas, el signo es el mismo.

???
Preguntar antes de seguir: ¿cómo puede la cartera de mínimo riesgo perder más? Dejar la pregunta abierta: la sección 1 la responde. No es una paradoja: es lo que pasa cuando se optimiza una medida que trata igual las dos colas. Es el gancho de la portada del material.

## Tres convenciones se declaran antes de calcular

::: tarjetas
### El nivel es el 97,5 %
El de Basilea III y el del capítulo 5. Donde el capítulo compara niveles, lo dice.
### El CVaR es el exacto
No el promedio simple del capítulo 5: la función de Rockafellar-Uryasev **es** el exacto, con su rueda fraccionaria.
### Los escenarios son w′μ
Una cifra suya en millones **no es dinero de nadie**: la cola de la declarada son 37 849 en la convención y **35 982** de verdad.
:::

???
La segunda es la primera excepción declarada a una convención del curso; la brecha es de 30 millones al 97,5 % y de 884 al 99 %, la misma que midió el capítulo 5. La tercera es la séptima convención del curso (capítulo 7): los logarítmicos no agregan entre activos. El capítulo la conserva porque es lo que el programa lineal minimiza, e imprime la columna exacta en la sección 3. La sesión 2 abre con ella.

# Por qué la cola y no la varianza {seccion=sec1}

> Ocho años de panel, 1 916 ruedas, y el CVaR al 99 % lo deciden veinte días.

???
Ocho de esos veinte días son de marzo a junio de 2020 y siete de 2022; de 2018, 2019, 2021 y 2024 no hay ni uno. La gráfica llega en cuatro diapositivas.

## El cuadrado borra el signo: un +5 % pesa lo mismo que un −5 %

$$ \sigma_p^2(w) = \frac{1}{S}\sum_{s=1}^{S} \underbrace{\left(w^\top r_s - \bar{r}_p\right)^{2}}_{\text{el cuadrado borra el signo}} $$

::: html
<div class="mt-1 flex flex-wrap items-center justify-center gap-4">
<span tabindex="0" role="button" class="group relative cursor-pointer rounded-xl border-2 border-solid border-primary/20 bg-surface px-5 py-2 text-[26px] text-primary shadow-sm outline-none focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/20">\(\sigma_p^2(w)\)<span class="hidden group-focus-within:block absolute top-full left-0 z-30 mt-3 w-[26rem] rounded-xl border-0 border-l-4 border-solid border-secondary bg-surface px-5 py-4 text-left text-[19px] font-normal leading-snug text-navy shadow-2xl"><strong class="!text-primary">La varianza de la cartera</strong> con los pesos w: el riesgo que minimizó el capítulo 7. Su raíz, anualizada, es la volatilidad: <strong>25,02 %</strong> la declarada y <strong>23,93 %</strong> la de mínima varianza.</span></span>
<span tabindex="0" role="button" class="group relative cursor-pointer rounded-xl border-2 border-solid border-primary/20 bg-surface px-5 py-2 text-[26px] text-primary shadow-sm outline-none focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/20">\(\frac{1}{S}\sum_{s=1}^{S}\)<span class="hidden group-focus-within:block absolute top-full left-1/2 -translate-x-1/2 z-30 mt-3 w-[26rem] rounded-xl border-0 border-l-4 border-solid border-secondary bg-surface px-5 py-4 text-left text-[19px] font-normal leading-snug text-navy shadow-2xl"><strong class="!text-primary">El promedio sobre los escenarios.</strong> Un escenario es una rueda del panel congelado, y todas pesan igual: <strong>S = 1 916</strong> ruedas, de 2018 a 2025.</span></span>
<span tabindex="0" role="button" class="group relative cursor-pointer rounded-xl border-2 border-solid border-primary/20 bg-surface px-5 py-2 text-[26px] text-primary shadow-sm outline-none focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/20">\(w^\top r_s\)<span class="hidden group-focus-within:block absolute top-full left-1/2 -translate-x-1/2 z-30 mt-3 w-[26rem] rounded-xl border-0 border-l-4 border-solid border-secondary bg-surface px-5 py-4 text-left text-[19px] font-normal leading-snug text-navy shadow-2xl"><strong class="!text-primary">El retorno de la cartera en la rueda s:</strong> los cuatro retornos de ese día, ponderados con 30 · 20 · 25 · 25 %. El 16/03/2020, la peor rueda del panel, valió <strong>−17,760 %</strong>. Es la convención w′μ.</span></span>
<span tabindex="0" role="button" class="group relative cursor-pointer rounded-xl border-2 border-solid border-primary/20 bg-surface px-5 py-2 text-[26px] text-primary shadow-sm outline-none focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/20">\(\bar{r}_p\)<span class="hidden group-focus-within:block absolute top-full left-1/2 -translate-x-1/2 z-30 mt-3 w-[26rem] rounded-xl border-0 border-l-4 border-solid border-secondary bg-surface px-5 py-4 text-left text-[19px] font-normal leading-snug text-navy shadow-2xl"><strong class="!text-primary">El retorno medio de la cartera</strong> en las 1 916 ruedas: la referencia contra la que se mide cada día. Anualizado, es el <strong>7,69 %</strong> de la declarada.</span></span>
<span tabindex="0" role="button" class="group relative cursor-pointer rounded-xl border-2 border-solid border-primary/20 bg-surface px-5 py-2 text-[26px] text-primary shadow-sm outline-none focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/20">\((\,\cdot\,)^{2}\)<span class="hidden group-focus-within:block absolute top-full right-0 z-30 mt-3 w-[26rem] rounded-xl border-0 border-l-4 border-solid border-secondary bg-surface px-5 py-4 text-left text-[19px] font-normal leading-snug text-navy shadow-2xl"><strong class="!text-primary">El cuadrado vuelve positiva toda desviación.</strong> Un día 5 puntos por encima del promedio y otro 5 por debajo aportan lo mismo: <strong>25</strong>. Ahí se pierde el signo, y con él la diferencia entre ganar y perder.</span></span>
</div>
<p class="mt-3 mb-1 text-center text-[17px] italic opacity-70">Pulse cada pieza: qué es y cuánto vale en este fondo</p>
:::

- La matriz de covarianzas resume las 1 916 ruedas en **diez números**
- Esa compresión vuelve tratable el problema de Markowitz…
- …y borra lo que le interesa al comité: **cuánto se pierde el día que se pierde**

???
Las cinco piezas bajo la fórmula se abren con un clic, y un clic fuera las cierra. En la vista del presentador y en el PDF no se ven, así que aquí van las mismas explicaciones:

- **σ²ₚ(w)**: la varianza de la cartera, el riesgo que minimizó el capítulo 7. Su raíz anualizada es la volatilidad: 25,02 % la declarada y 23,93 % la de mínima varianza.
- **1/S · Σ**: el promedio sobre las S = 1 916 ruedas, todas con el mismo peso.
- **w⊤rₛ**: el retorno de la cartera en la rueda s, en la convención w′μ. El 16/03/2020 valió −17,760 %.
- **r̄ₚ**: el retorno medio de la cartera, la referencia de cada desviación. Anualizado, 7,69 % la declarada.
- **El cuadrado**: un día 5 puntos arriba del promedio y otro 5 abajo aportan lo mismo, 25.

La fórmula está escrita sobre los escenarios y no sobre Σ a propósito, para compararla de tú a tú con la siguiente. Con una distribución simétrica no importaría, porque las dos colas son la misma; con la curtosis de exceso de 25,77 que midió el capítulo 5, importa bastante.

## El CVaR mira un solo lado, y solo el peor

$$ \mathrm{CVaR}_\alpha(w) = \mathbb{E}\left[\,L(w) \;\middle|\; L(w) \geq \mathrm{VaR}_\alpha(w)\right], \qquad L(w) = -w^\top r $$

::: html
<div class="mt-1 flex flex-wrap items-center justify-center gap-4">
<span tabindex="0" role="button" class="group relative cursor-pointer rounded-xl border-2 border-solid border-primary/20 bg-surface px-5 py-2 text-[26px] text-primary shadow-sm outline-none focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/20">\(\mathrm{CVaR}_\alpha(w)\)<span class="hidden group-focus-within:block absolute top-full left-0 z-30 mt-3 w-[26rem] rounded-xl border-0 border-l-4 border-solid border-secondary bg-surface px-5 py-4 text-left text-[19px] font-normal leading-snug text-navy shadow-2xl"><strong class="!text-primary">Lo que el capítulo va a minimizar:</strong> el promedio de las pérdidas de la cola, para los pesos w. Al 97,5 %, la cartera declarada da <strong>4,731 %</strong> y la de mínima varianza <strong>4,607 %</strong>.</span></span>
<span tabindex="0" role="button" class="group relative cursor-pointer rounded-xl border-2 border-solid border-primary/20 bg-surface px-5 py-2 text-[26px] text-primary shadow-sm outline-none focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/20">\(\mathbb{E}\left[\,\cdot\;\middle|\;\cdot\,\right]\)<span class="hidden group-focus-within:block absolute top-full left-1/2 -translate-x-1/2 z-30 mt-3 w-[26rem] rounded-xl border-0 border-l-4 border-solid border-secondary bg-surface px-5 py-4 text-left text-[19px] font-normal leading-snug text-navy shadow-2xl"><strong class="!text-primary">Un promedio condicionado.</strong> La barra se lee «dado que»: se promedian las pérdidas de los días que cumplen la condición de la derecha, y solo esas. El nivel pide <strong>47,9</strong> ruedas y el panel tiene 48: esa décima de rueda vale 30 millones.</span></span>
<span tabindex="0" role="button" class="group relative cursor-pointer rounded-xl border-2 border-solid border-primary/20 bg-surface px-5 py-2 text-[26px] text-primary shadow-sm outline-none focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/20">\(L(w) \geq \mathrm{VaR}_\alpha(w)\)<span class="hidden group-focus-within:block absolute top-full left-1/2 -translate-x-1/2 z-30 mt-3 w-[26rem] rounded-xl border-0 border-l-4 border-solid border-secondary bg-surface px-5 py-4 text-left text-[19px] font-normal leading-snug text-navy shadow-2xl"><strong class="!text-primary">La condición: quién entra en la cola.</strong> Solo los días en que la pérdida llega al corte o lo pasa. En la declarada son <strong>48</strong> de las 1 916 ruedas, el 2,5 %; los días buenos y los malos corrientes no cuentan.</span></span>
<span tabindex="0" role="button" class="group relative cursor-pointer rounded-xl border-2 border-solid border-primary/20 bg-surface px-5 py-2 text-[26px] text-primary shadow-sm outline-none focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/20">\(\mathrm{VaR}_\alpha(w)\)<span class="hidden group-focus-within:block absolute top-full left-1/2 -translate-x-1/2 z-30 mt-3 w-[26rem] rounded-xl border-0 border-l-4 border-solid border-secondary bg-surface px-5 py-4 text-left text-[19px] font-normal leading-snug text-navy shadow-2xl"><strong class="!text-primary">El corte que separa la cola del resto,</strong> al nivel α = 97,5 %. En la declarada vale <strong>2,958 %</strong> y en la de mínima varianza <strong>2,643 %</strong>: depende de w. Anótelo, porque es el problema de la sección 2.</span></span>
<span tabindex="0" role="button" class="group relative cursor-pointer rounded-xl border-2 border-solid border-primary/20 bg-surface px-5 py-2 text-[26px] text-primary shadow-sm outline-none focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/20">\(L(w) = -w^\top r\)<span class="hidden group-focus-within:block absolute top-full right-0 z-30 mt-3 w-[26rem] rounded-xl border-0 border-l-4 border-solid border-secondary bg-surface px-5 py-4 text-left text-[19px] font-normal leading-snug text-navy shadow-2xl"><strong class="!text-primary">La pérdida: el retorno con el signo cambiado.</strong> Así la cola mala queda a la derecha. El 16/03/2020 la cartera rindió −17,760 %, y aquí entra como una pérdida de <strong>17,760 %</strong>, la mayor de las 1 916.</span></span>
</div>
<p class="mt-3 mb-1 text-center text-[17px] italic opacity-70">Pulse cada pieza: qué es y cuánto vale en este fondo</p>
:::

- El VaR responde: ¿hasta cuánto se pierde el 97,5 % de los días?
- El CVaR responde: ¿cuánto se pierde **cuando** se pierde?
- El cambio de signo deja la cola mala **a la derecha**, que es donde la mira todo el capítulo

???
Las cinco piezas bajo la fórmula se abren con un clic, y un clic fuera las cierra. En la vista del presentador y en el PDF no se ven, así que aquí van las mismas explicaciones:

- **CVaR(w)**: lo que el capítulo va a minimizar, el promedio de las pérdidas de la cola. Al 97,5 %, 4,731 % la declarada y 4,607 % la de mínima varianza.
- **𝔼[· | ·]**: un promedio condicionado; la barra se lee «dado que». El nivel pide 47,9 ruedas y el panel tiene 48, y esa décima de rueda vale 30 millones.
- **L(w) ≥ VaR(w)**: la condición, quién entra en la cola. En la declarada, 48 de las 1 916 ruedas.
- **VaR(w)**: el corte al nivel α. Vale 2,958 % en la declarada y 2,643 % en la de mínima varianza.
- **L(w) = −w⊤r**: la pérdida, el retorno con el signo cambiado. El 16/03/2020, que rindió −17,760 %, entra como una pérdida de 17,760 %.

*Conditional Value at Risk* (valor en riesgo condicional): el *Expected Shortfall* del capítulo 5, que aquí se usa por primera vez como función objetivo y no como medida. Para la transición: la fórmula necesita un VaR, y ese VaR depende de w. Pedir que lo anoten, porque es el problema de la sección 2. E insistir en que estas letras —w, rₛ, L, α, VaR— no cambian de significado en ninguna de las cinco secciones.

## Dos promedios de la misma cola: el divisor es 48 o 47,9

**Capítulo 5 · ES simple:** divide entre las ruedas que **hay**.

$$ \mathrm{ES}_\alpha = \frac{1}{|\mathcal{C}|}\sum_{s \in \mathcal{C}} L_s, \qquad \mathcal{C} = \{\,s : L_s > \mathrm{VaR}_\alpha\,\} $$

**Este capítulo · CVaR exacto:** divide entre las que el nivel **pide**, 47,9 o 19,16.

$$ \mathrm{CVaR}_\alpha = \mathrm{VaR}_\alpha + \frac{1}{(1-\alpha)S}\sum_{s=1}^{S}\left(L_s - \mathrm{VaR}_\alpha\right)^{+} $$

La brecha: **30 millones** al 97,5 % y **884** al 99 %.

???
Por qué no se puede usar aquí la convención del capítulo 5: un promedio sobre un conjunto que cambia de tamaño a saltos no es una función continua de los pesos, y un optimizador no sabe qué hacer con eso. Es la primera excepción declarada a una convención del curso.

## El bloque calcula las dos versiones con la misma función {columnas=3:2}

```python medidas() · sección 1 {resaltar=5-7}
def medidas(w, alfa, RR=R):
    L = perdidas(w, RR)
    var  = np.quantile(L, alfa)
    cola = L[L > var]
    simple = cola.mean()
    exacto = (L[L > var].sum() / S
              + var * ((1 - alfa) - len(cola) / S)) / (1 - alfa)
    return var, simple, exacto, len(cola)
```

|||

- `simple`: el promedio de las ruedas que pasan el corte
- `exacto`: le suma la fracción de rueda que falta para llegar a (1 − α)S
- Declarada al 97,5 %: 4,727 % contra **4,731 %**
- Al 99 %: 6,599 % contra **6,710 %**

???
Se quitaron los comentarios y la línea de `exacto` se partió en dos para que quepa: el bloque completo, con las veinte peores ruedas y las dos carteras, está en la sección 1. El VaR sale de `np.quantile`, que interpola; la sección 2 muestra por qué ese detalle cambia el cuarto decimal.

## Veinte días deciden el CVaR al 99 %, y ninguno es de 2018, 2019, 2021 ni 2024

![Las veinte peores ruedas de la cartera declarada, en millones de la convención w′μ. Rojo 2020 (ocho), ámbar 2022 (siete), morado 2025 (cuatro), azul 2023 (una).](recursos/cap08/cap8-cola.json){alto=430}

???
Fijarse en la segunda barra: el 19 de febrero de 2025, la segunda peor rueda del panel. Es la mitad del par de cotizaciones defectuosas que diagnosticó el capítulo 4, que el manifiesto declara y no corrige. La sesión 2 mide cuánto mueve la cola: 3 777 millones al 99 %.

## La mínima varianza protege mejor el hombro y peor el extremo

| Nivel | Declarada | Mínima varianza |
|---|---|---|
| 95 % | 3,625 % | **3,466 %** |
| 97,5 % | 4,731 % | **4,607 %** |
| 99 % | **6,710 %** | 6,733 % |

CVaR exacto de cada cartera. Al 99 % la mínima varianza pierde **187 millones** más en la convención y **76** sobre lo que el fondo cobra.

???
Minimizar la dispersión mejoró el centro y el hombro de la distribución y no hizo nada por el extremo. En el extremo no manda la covarianza: mandan cuatro días de marzo de 2020 en que los cuatro emisores cayeron a la vez, y contra eso no hay diversificación que valga. Las cifras salen del cuantil interpolado de la sección 1.

## ¿Cuánto vale la brecha al 99 %? {.pregunta etiqueta="R1 · Traza de cálculo"}

La cola del 99 % pide **19,16 ruedas**. Las 19 peores suman **1 023 207 millones** y la vigésima vale **32 628**.

1. El ES simple: el promedio de las 20
2. El CVaR exacto: las 19 enteras más el trozo de la vigésima, entre 19,16
3. La brecha entre los dos

::: respuesta
Simple: 1 055 835 ÷ 20 = **52 792**. Exacto: (1 023 207 + 0,16 × 32 628) ÷ 19,16 = 1 028 427 ÷ 19,16 = **53 676**. La brecha: **884 millones**, la que declara el capítulo 5.
:::

???
Dar tres minutos con calculadora. Fijarse en el signo: el exacto es MAYOR, porque las 19 ruedas que entran enteras son peores que la vigésima, y promediarlas entre 20 las diluye. Al 97,5 % la misma cuenta da 30 millones. En el material es el R1 de la sección 1, una tabla para completar.

## ¿Por qué cambia el signo al 99 %? {.pregunta etiqueta="R2 · Predice el efecto"}

La mínima varianza tiene menos CVaR que la declarada al 95 % y al 97,5 %, y más al 99 %. ¿Qué explica el cambio?

::: respuesta
En el extremo mandan unos pocos días en que los cuatro emisores cayeron juntos —ocho de las veinte peores son de 2020, cuando la correlación media subió de 0,227 a 0,513—, y sobre ese puñado de ruedas la covarianza media de ocho años no informa de nada.
:::

???
Los distractores del material: «tiene menos retorno esperado», «con 19,16 ruedas el orden es un empate estadístico» y «es un sesgo de la convención del capítulo 5». El segundo es el más tentador, y el material lo da por falso: la pregunta es por el mecanismo, y la fragilidad del estimador se discute en la sección 5, que se ve en la sesión 2.

# La formulación de Rockafellar-Uryasev {seccion=sec2}

> El CVaR esconde un cuantil, y un cuantil es una función de los pesos llena de quiebres. En 2000, dos autores lo volvieron convexo añadiendo una sola variable.

???
Un cuantil no es convexo ni derivable en w: optimizarlo directamente es un problema combinatorio.

## Para saber qué hay en la cola hace falta el VaR, y el VaR depende de los pesos {.idea}

Es circular. Rockafellar y Uryasev lo rompen tratando el corte como **una variable más** y dejando que el optimizador lo encuentre.

???
Antes de pasar, pedir ideas: ¿cómo romperían el círculo? Alguien suele proponer fijar la cola con la cartera actual; guardar esa propuesta, porque es el R3 del final de la sesión.

## F suma lo que cada escenario se pasa de un corte que uno propone

$$ F_\alpha(w,\zeta) = \zeta + \frac{1}{(1-\alpha)S}\sum_{s=1}^{S}\max\left(0,\, -w^\top r_s - \zeta\right) $$

- **ζ** es un corte propuesto; el segundo término suma los excesos sobre él y los reparte entre las (1 − α)S ruedas que pide el nivel
- Si ζ se queda corto, los excesos se disparan; si se pasa, el primer término crece sin que el segundo lo compense
- En medio hay un mínimo: cae **exactamente** en el VaR y vale **exactamente** el CVaR

???
Rockafellar y Uryasev, «Optimization of conditional value-at-risk», Journal of Risk, 2000. Lo que hizo época no fue la medida, que ya existía, sino esta función auxiliar, que la volvió optimizable.

## Cada término de F hace un trabajo distinto

| Pieza | Qué hace | Aquí |
|---|---|---|
| \(\zeta\) | el corte; entra con coeficiente 1, así que proponerlo alto cuesta | ζ* = 2,9601 % |
| \((L_s - \zeta)^{+}\) | cuánto se pasa la rueda s, y cero si no se pasa | 47 ruedas aportan |
| \((1-\alpha)S\) | cuántas ruedas **pide** el nivel, no cuántas hay sobre el corte | 47,9 ruedas |
| \(\min_\zeta F\) | el valor en el mínimo: no una aproximación al CVaR, sino el CVaR | 4,7311 % |

α y S no son variables: son la declaración. Lo que mueve el optimizador son **w** y **ζ**.

???
En el mínimo aportan 47 y no 48: el escenario 48 ES el corte, y se pasa de sí mismo en cero. Que el divisor esté fijo es lo que conserva la convexidad: si fuera «las que hay sobre el corte», cambiaría con ζ.

## F cae rápido, sube despacio, y su mínimo es el CVaR

![F(ζ) sobre la cartera declarada al 97,5 %. El mínimo, en rosa, cae en el escenario 48 de la cola: ζ = 2,9601 % y F = 4,7311 %.](recursos/cap08/cap8-fzeta.json){alto=440}

???
4,7311 % son 37 849 millones en la convención. El cuantil interpolado, 2,9577 %, está tan cerca que en esta escala los dos puntos se tocan. Preguntar por qué la curva es asimétrica: por la izquierda, un corte demasiado bajo deja demasiados excesos que promediar.

## La derivada se anula donde quedan (1 − α)S ruedas por encima del corte

$$ \frac{\partial F}{\partial \zeta} = 1 - \frac{\#\{s: L_s > \zeta\}}{(1-\alpha)S} = 0 \quad\Longleftrightarrow\quad \#\{s: L_s > \zeta\} = (1-\alpha)S $$

- F es convexa y lineal a trozos: el máximo de funciones convexas es convexo
- Cada rueda sobre el corte aporta −1/((1 − α)S); las de abajo no aportan nada
- Dejar (1 − α)S ruedas por encima **es la definición del VaR**

???
Son los pasos 1 a 3 de la derivación de la sección 2. La convexidad también es conjunta en w y ζ, y eso es lo que permite optimizar las dos cosas a la vez. Con datos, la derivada salta de negativa a positiva sin pasar por cero, porque 47,9 no es entero: el mínimo cae en un escenario concreto.

## Al sustituir el VaR, F devuelve el promedio de la cola

$$ F_\alpha(w,\zeta^*) = \mathrm{VaR}_\alpha + \frac{1}{(1-\alpha)S}\sum_{L_s > \mathrm{VaR}}\left(L_s - \mathrm{VaR}_\alpha\right) = \mathrm{CVaR}_\alpha $$

El VaR más el promedio de los excesos sobre el VaR es el promedio de las pérdidas de la cola, **con la rueda fraccionaria incluida**: el CVaR exacto, no el simple.

::: tip Lo que no pide
Ni normalidad, ni simetría, ni una fórmula cerrada. Solo escenarios equiprobables, que pueden venir de la historia, de una simulación o de un panel de estrés.
:::

???
Es el paso 4 de la derivación, y con él se cierra el círculo: el corte deja de estimarse antes y pasa a resolverse dentro. Guardar «de una simulación» para la sesión 2: el R3 de la sección 5 muestra qué pasa cuando la simulación sale de una normal.

## Con datos, el mínimo cae en un escenario: 2,9601 % y no 2,9577 % {columnas=3:2}

```python F evaluada a mano · sección 2 {resaltar=7-8}
def F(z):
    return z + np.maximum(L - z, 0).sum() / ((1 - alfa) * S)

var = np.quantile(L, alfa)
z48 = np.sort(L)[::-1][47]
#>   2.7500 %   4.7502 %      56
#>   2.9577 %   4.7312 %      48
#>   2.9601 %   4.7311 %      47
#>   3.0000 %   4.7326 %      45
```

|||

- `np.quantile` interpola entre el 49 y el 48: **2,9577 %**, donde F todavía baja
- El mínimo es el escenario 48: **2,9601 %**, con F = **4,7311 %**
- La diferencia es de cinco millonésimas de punto, y lo que no admite descuento es la palabra *exactamente*

???
Se quitaron los comentarios y se dejaron solo cuatro de los trece cortes que imprime el bloque, los que rodean el mínimo; la tabla completa está en la sección 2. La columna de la derecha cuenta los escenarios que superan el corte: el mínimo cae donde esa cuenta cruza las 47,9. Es el patrón de siempre en el curso: la convención se queda y al lado se imprime lo que cuesta.

## El mínimo es plano: equivocarse en el VaR sale barato

- Entre ζ = 2,75 % y ζ = 3,00 %, F va de **4,7502 %** a **4,7326 %**: menos de dos centésimas en un cuarto de punto
- El optimizador puede **errar el corte y acertar el promedio**
- Por eso el ζ del programa lineal, **2,7215 %**, no es el VaR de la declarada: son carteras distintas, y lo que se compara es F, no ζ

???
Es la caja «Una consecuencia práctica de que el mínimo sea tan plano», de la sección 2. Adelanta la cifra de la sección 3 para que no sorprenda cuando aparezca.

## ¿Qué corte gana? {.pregunta etiqueta="R1 · Traza de cálculo"}

Diez pérdidas equiprobables, en millones: **−20 000, −12 000, −5 000, 0, 3 000, 8 000, 15 000, 26 000, 48 000 y 90 000**. Con α = 80 %, la cola pide **2** escenarios.

Evalúe F en ζ = **15 000, 26 000, 48 000 y 60 000**.

::: respuesta
74 500 · **69 000** · **69 000** · 75 000. Empatan porque F es lineal a trozos y su mínimo ocupa **todo** el tramo de 26 000 —el VaR— a 48 000. El valor, 69 000, es el promedio de las dos peores: (48 000 + 90 000) ÷ 2.
:::

???
Dar tres o cuatro minutos. Con 1 916 escenarios el tramo se estrecha hasta casi un punto, pero el fenómeno es el mismo. Es el R1 de la sección 2, que en el material es una tabla para completar.

# Implementación por escenarios {seccion=sec3}

> Cuatro pesos, un corte y 1 916 variables de exceso: el programa que resuelve la cola del fondo tiene 1 921 incógnitas y tarda menos de un segundo.

???
Lo difícil no es escribirlo, sino darse cuenta de que se podía escribir así.

## Un máximo es el mínimo de un conjunto {.idea}

$$ \max(0,\,x) = \min\,\{\,u \;:\; u \geq x,\;\; u \geq 0\,\} $$

Es una identidad exacta, no una aproximación. Mirarla en esa dirección es todo el truco del capítulo.

???
F tiene 1 916 máximos dentro, y un máximo no es lineal; el programa de abajo no tiene ninguno. Preguntar: ¿cuál es el menor número que es a la vez mayor o igual que x y mayor o igual que cero? Es el paso 1 de la derivación de la sección 3.

## Se sustituye cada máximo y se aplanan las dos minimizaciones en una

$$ F_\alpha(w,\zeta) = \min_{u}\; \zeta + \tfrac{1}{(1-\alpha)S}\textstyle\sum_s u_s \quad \text{sujeto a}\;\; u_s \geq L_s - \zeta,\;\; u_s \geq 0 $$

$$ \min_{w,\,\zeta}\;\min_{u}\;(\cdot) = \min_{w,\,\zeta,\,u}\;(\cdot) $$

- Cada máximo se cambia por su mínimo, uno por escenario
- Minimizar por partes o todo a la vez da el mismo valor, porque el conjunto es el mismo
- Y una sola minimización es lo único que aceptan `cvxpy` y `lpSolve`

???
Son los pasos 2 y 3 de la derivación. Ningún solucionador acepta un mínimo dentro del objetivo; aplanar es lo que lo vuelve un problema estándar.

## El cambio es exacto porque cada u entra con coeficiente positivo y se minimiza

$$ \frac{\partial}{\partial u_s}\left[\tfrac{1}{(1-\alpha)S}\textstyle\sum_s u_s\right] = \frac{1}{(1-\alpha)S} > 0 \quad\Longrightarrow\quad u_s^{*} = \max(0,\,L_s - \zeta) $$

- El óptimo empuja cada u contra su cota inferior, **y ni un poco más arriba**
- Con coeficiente negativo, o maximizando, u quedaría suelta y el programa devolvería otra cosa

::: warn
Es la comprobación que hay que hacer siempre que se linealiza un máximo, y la que casi nunca se escribe.
:::

???
Es el paso 4. La maniobra se llama reformulación epigráfica, y el mismo paso convierte en programa lineal la regresión en valor absoluto y la minimización del error máximo. Lo que aportaron Rockafellar y Uryasev fue darse cuenta de que el CVaR admite una F a la que se le puede aplicar.

## El programa entero no tiene un solo término cuadrático

$$ \begin{aligned} \min_{w,\,\zeta,\,u} \;\; & \zeta + \frac{1}{(1-\alpha)S}\sum_{s} u_s \\[4pt] \text{sujeto a} \;\; & u_s \geq -w^\top r_s - \zeta, \quad u_s \geq 0, \\ & \mathbf{1}^\top w = 1, \quad w \geq 0 \end{aligned} $$

El objetivo, las restricciones y las cotas son lineales. Un programa lineal escala a **decenas de miles** de escenarios, y el tope del 30 % por emisor sería una fila más.

???
Esto lo separa del capítulo 7 en algo más que la forma. Fijarse en lo que falta: no hay restricción de retorno. Este programa busca la cola más pequeña sin preguntar cuánto rinde la cartera; la restricción de retorno llega en la sección 4.

## Tiene 1 921 variables, y 1 916 son andamio

| Pieza | Qué hace | Cuántas |
|---|---|---|
| \(w,\ \zeta,\ u\) | las incógnitas: cuatro pesos, un corte y un exceso por rueda | 1 921 variables |
| \(u_s \geq -w^\top r_s - \zeta\) | ata cada exceso a su escenario; es la única que mezcla pesos y datos | 1 916 filas |
| \(u_s \geq 0\) | la otra mitad del máximo | 1 916 cotas |
| \(\mathbf{1}^\top w = 1\) | el fondo, invertido del todo | 1 fila |
| \(w \geq 0\) | sin cortos: una decisión del curso, no del método | 4 cotas |

???
Las 1 916 u son el 99,7 % del problema y no le interesan a nadie. Sin u ≥ 0, un escenario bueno restaría de la cola y el problema no tendría mínimo. Es la anatomía del programa de la sección 3.

## En cvxpy, el programa se escribe casi como la fórmula

```python cvxpy · sección 3
w = cp.Variable(4)
zeta = cp.Variable()
u = cp.Variable(S)
objetivo = zeta + cp.sum(u) / ((1 - alfa) * S)
cp.Problem(cp.Minimize(objetivo),
           [u >= -(R @ w) - zeta,
            u >= 0,
            cp.sum(w) == 1, w >= 0]).solve(solver="HIGHS")
```

Una restricción por línea de la fórmula: `u >= -(R @ w) - zeta` y `u >= 0` son, juntas, el máximo.

???
Se quitaron los dos comentarios de las restricciones; el bloque entero, con la tabla de las tres carteras y la columna exacta, está en la sección 3. HiGHS es el solucionador lineal que trae cvxpy. Resuelve las 1 921 variables en menos de un segundo.

## lpSolve no admite variables libres, así que ζ se parte en dos

```r lpSolve · sección 3 {resaltar=1,6}
obj <- c(rep(0, 4), 1, -1, rep(1 / ((1 - alfa) * S), S))
A   <- rbind(cbind(R, 1, -1, diag(S)),
             c(rep(1, 4), rep(0, 2 + S)))
sol <- lp("min", obj, A, c(rep(">=", S), "="), c(rep(0, S), 1))
wc   <- sol$solution[1:4]
zeta <- sol$solution[5] - sol$solution[6]
```

$$ \zeta = \zeta^{+} - \zeta^{-}, \qquad \zeta^{+} \geq 0, \quad \zeta^{-} \geq 0 $$

???
Esta es la única diapositiva de la sesión con R, y está por una razón: el `1, -1` de la primera línea y la resta de la última son el truco estándar para meter una variable libre en un solucionador que solo admite variables no negativas. Aquí no cambia nada, porque el corte sale positivo y ζ⁻ se queda en cero. Se quitaron los comentarios; el bloque entero está en la sección 3. Dos solucionadores que no comparten una línea de código devuelven los mismos pesos con dos decimales.

## La mínima CVaR se parece más a la mínima varianza que a la declarada {columnas=3:2}

![Pesos de las tres carteras (%).](recursos/cap08/cap8-pesos.json){alto=420}

|||

| Cartera | CVaR 97,5 % | Volatilidad |
|---|---|---|
| Declarada | 4,7311 % | 25,02 % |
| Mínima varianza | 4,6067 % | 23,93 % |
| **Mínima CVaR** | **4,5815 %** | 24,00 % |

Con ζ* = 2,7215 %.

???
Los pesos son 19,36 · 34,61 · 16,43 · 29,60: baja el Banco de Bogotá del 38,13 % al 34,61 % y sube ISA del 25,14 % al 29,60 %. Ganó cola y pagó 0,07 pp de volatilidad. Lo que vale esa mejora en pesos se deja para la sesión 2, con su columna exacta. Estos CVaR salen del estadístico de orden de la sección 3; a cuatro decimales, el de la declarada coincide con el de la sección 1.

## ¿Qué hace mal este código? {.pregunta etiqueta="R3 · Audita a la IA"}

Un modelo propuso esta cartera de mínimo CVaR al 97,5 %. Corre y los pesos suman uno. ¿Qué línea falla, y qué error es?

```python Lo que devolvió el modelo
R = np.log(precios[acciones]).diff().dropna().values * 100
L = -(R @ w0)
cola = R[L > np.quantile(L, alfa)]        # los 48 escenarios peores
w = cp.Variable(4)
cp.Problem(cp.Minimize(cp.sum(-(cola @ w)) / len(cola)),
           [cp.sum(w) == 1, w >= 0]).solve()
```

::: respuesta
La de `cola`: congela los días peores **de la cartera actual**, y la cola cambia con los pesos. **Confusión de medida.** Devuelve **100 % Banco de Bogotá** —CVaR real de **6,8601 %** contra 4,5815 %— e imprime **3,6982 %**: parece mejor que la mejor.
:::

???
Se quitaron los `import`, el `print` final y las líneas que leen el panel y fijan `w0` y `alfa` al 97,5 %; en el material la línea defectuosa es la 12. Ojo con clasificarlo como «supuesto no verificado»: no se aplicó ninguna fórmula fuera de su condición, se calculó una magnitud y se reportó como si fuera otra. Es justo el círculo que ζ rompe. La brecha son 2,2786 pp, más de 18 200 millones en la convención, y ninguna comprobación de forma la habría detectado. Los R3 son de nivel 1: sin IA.

## ¿Qué le pasa al programa con diez mil escenarios más? {.pregunta etiqueta="R2 · Predice el efecto"}

Hoy tiene 1 921 variables: cuatro pesos, un corte y 1 916 excesos.

::: respuesta
Crece en diez mil variables, diez mil filas y diez mil cotas, y **sigue siendo lineal**: crece el tamaño, no la naturaleza. Lo que no crece, si los escenarios salen de un modelo ajustado a los mismos datos, es la **información**.
:::

???
Si el tiempo no alcanza, esta se salta. Sirve de puente a la sesión 2: el R3 de la sección 5 hace exactamente eso, con cien mil escenarios de una normal.

## Lo que se llevan hoy {.cierre}

- La varianza borra el signo: la mínima varianza protege el hombro de la distribución y **no** el extremo
- El CVaR exacto divide entre las ruedas que el nivel **pide**, 47,9, no entre las que hay
- ζ rompe el círculo: el mínimo de F cae en el VaR y **vale** el CVaR
- Un máximo es el mínimo de un conjunto, y el cambio es exacto porque se minimiza con coeficiente positivo
- El programa tiene 1 921 variables lineales y devuelve 19,36 · 34,61 · 16,43 · 29,60

???
Para la próxima sesión: leer las secciones 4 y 5 del material y mover el laboratorio del nivel α, el R9 de la sección 4. La sesión 2 abre con lo que vale en pesos esta cartera, y con una advertencia sobre esa cifra.
