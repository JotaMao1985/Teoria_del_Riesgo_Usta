---
modulo: ../../08_TDR_Optimizacion_CVaR.html
salida: ../08_TDR_Optimizacion_CVaR_sesion2.html
agenda: si
etiqueta: Sesión 2 de 2 · 90 min
asignatura: Teoría del Riesgo
subtitulo: ¿Vale la pena? — cuánto gana optimizar la cola sobre este fondo, por qué casi no cambia nada y sobre cuántos datos se apoya
objetivo: Al salir, usted sabrá cuánto gana de verdad la cartera de mínima CVaR, por qué sobre cuatro acciones casi coincide con la de mínima varianza, cuándo dejaría de coincidir y cuántos escenarios deciden de verdad el número que se lleva al comité.
---

<!--
  Capítulo 8 · Optimización CVaR · sesión 2 de 2 (90 min).
  Retoma la sección 3 por la columna exacta y cubre las secciones 4 y 5, la
  decisión del comité y el taller 8.
  Toda cifra en millones que sale de los escenarios es de la convención w′μ;
  donde el capítulo imprime la exacta, va al lado. Los CVaR de las secciones 3 a 5
  salen del estadístico de orden.
  Las cifras llevan espacio de no separación (U+00A0) antes del % y en los miles.
-->

# Lo que la cartera vale en pesos {seccion=sec3}

> La cartera de mínima CVaR ya está calculada. Hoy la pregunta es otra: cuánto vale lo que gana, y si vale la pena.

???
Abrir preguntando quién movió el laboratorio del nivel α (R9 de la sección 4). Lo que hayan visto se retoma en la sección 4.

## El programa de la sesión 1 devolvió una cartera y un número

$$ \begin{aligned} \min_{w,\,\zeta,\,u} \;\; & \zeta + \frac{1}{(1-\alpha)S}\sum_{s} u_s \\[4pt] \text{sujeto a} \;\; & u_s \geq -w^\top r_s - \zeta, \quad u_s \geq 0, \\ & \mathbf{1}^\top w = 1, \quad w \geq 0 \end{aligned} $$

- Mínima CVaR: **19,36 · 34,61 · 16,43 · 29,60**, con ζ* = 2,7215 %
- CVaR al 97,5 %: **4,5815 %**, contra 4,6067 % de la mínima varianza y 4,7311 % de la declarada

???
Un repaso de tres minutos. Pedir a alguien que explique por qué cambiar el máximo por u es exacto: cada u entra con coeficiente positivo y el problema se minimiza. Si nadie lo recuerda, volver a esa diapositiva de la sesión 1 antes de seguir.

## Cada pieza del programa con lo que hace {.pregunta etiqueta="R6 · Emparejar" columnas=2:3}

1. La variable auxiliar ζ
2. Las variables de exceso u_s
3. El factor 1/((1 − α)S)
4. El par u_s ≥ L_s − ζ y u_s ≥ 0

|||

- **a.** Vuelve la suma de los excesos un promedio de cola
- **b.** Es el corte propuesto; en el óptimo resulta ser el VaR
- **c.** Existen para escribir el máximo sin la palabra máximo
- **d.** Traduce max(0, ·) a lenguaje lineal, porque el objetivo lo empuja hacia abajo

::: respuesta
1-b · 2-c · 3-a · 4-d
:::

???
Es el R6 de la sección 3, con las descripciones recortadas a su núcleo: el material las trae completas; la derecha va en el orden del material, que deja una sola pareja en su fila. Sirve de calentamiento: dos minutos, en parejas.

## Una cifra de los escenarios en millones no es dinero de nadie

| Cartera | Convención w′μ | Lo que el fondo cobra |
|---|---|---|
| Declarada | 37 849 | **35 982** |
| Mínima varianza | 36 854 | **35 016** |
| Mínima CVaR | 36 652 | **34 870** |

CVaR al 97,5 %, en millones sobre los 800 000. Los logarítmicos no agregan entre activos: la columna exacta sale de los retornos simples.

???
Es la séptima convención del curso, declarada en el capítulo 7. El bloque de la sección 3 imprime las dos columnas al lado. El capítulo conserva la convención porque es lo que el programa lineal minimiza, y añade la columna exacta, como hicieron el capítulo 1 y el 7.

## Lo que gana optimizar la cola son 201 millones en la convención y 147 de verdad

::: tarjetas
### En la convención
**201 millones** de cola menos que la mínima varianza
### Sobre lo que el fondo cobra
**147 millones**: un 27 % menos
### Lo que pagó
**0,07 pp** de volatilidad: 24,00 % contra 23,93 %
:::

???
Las dos primeras salen del mismo bloque de la sección 3, que imprime «201 millones en la convención, 147 exactos». Pedir que anoten las dos: el R7 y el R8 del final hablan de «201 millones», y se refieren a la convención.

## Decidir con la convención cuesta 49 millones; reportar con ella se equivoca en 1 783 {.idea}

La pérdida exacta también es lineal en w, así que el mismo programa la optimiza: **17,93 · 33,44 · 17,80 · 30,83**. La convención es barata para elegir la cartera y cara para contar lo que se pierde con ella: **36 veces** más.

???
Es el mismo hallazgo del capítulo 1 con su acumulado: lo que sale barato sobre una dispersión puede ser ruinoso sobre un nivel. Preguntar qué cifra llevarían al comité. La respuesta es la exacta para reportar, y cualquiera de las dos para decidir.

# Media-CVaR contra media-varianza {seccion=sec4}

> Las dos fronteras se dibujan en el mismo par de ejes, y hay que mirar dos veces para ver que son dos.

???
El resultado honesto de esta sección es incómodo para el capítulo: sobre este panel, las dos casi no se distinguen.

## Los dos problemas comparten las restricciones; solo cambia el objetivo

$$ \begin{aligned} & \text{media-varianza:} && \min_{w}\; w^\top \Sigma\, w \\[6pt] & \text{media-CVaR:} && \min_{w,\,\zeta,\,u}\; \zeta + \tfrac{1}{(1-\alpha)S}\textstyle\sum_s u_s \\[6pt] & \text{los dos:} && \mu^\top w = \tau, \quad \mathbf{1}^\top w = 1, \quad w \geq 0 \\[6pt] & \text{solo el segundo:} && u_s \geq L_s - \zeta, \quad u_s \geq 0 \end{aligned} $$

Se fija un retorno objetivo τ, se resuelven los dos y se repite con siete valores, de 6,78 % a 12,88 %.

???
τ va en letra griega porque R ya es la matriz de escenarios en todos los bloques. El de arriba es cuadrático y el de abajo lineal: esa es la diferencia de forma. La de fondo es la de la siguiente diapositiva.

## Uno decide con diez números y el otro con 1 916 ruedas

| | Media-varianza | Media-CVaR |
|---|---|---|
| Objetivo | \(w^\top \Sigma\, w\) | \(\zeta + \tfrac{1}{(1-\alpha)S}\sum_s u_s\) |
| Qué usa del panel | las diez cifras de Σ | cada rueda por separado |
| Tamaño | 4 variables | 1 921 variables |
| Dos paneles con la misma Σ | la misma cartera | otra, si sus colas difieren |

???
Es la anatomía de la sección 4. Las dos usan la misma μ y la misma Σ, con la misma ventana declarada: la comparación mide el objetivo, no el estimador.

## Una frontera es una fila más: la del retorno objetivo

```python min_cvar() · sección 4 {resaltar=4-5}
def min_cvar(objetivo=None):
    w, z, u = cp.Variable(4), cp.Variable(), cp.Variable(S)
    restr = [u >= -(R @ w) - z, u >= 0, cp.sum(w) == 1, w >= 0]
    if objetivo is not None:
        restr.append(mu @ w == objetivo)
    cp.Problem(cp.Minimize(z + cp.sum(u) / ((1 - alfa) * S)),
               restr).solve(solver="HIGHS")
    return np.maximum(np.array(w.value).ravel(), 0)
```

`min_var()` es la misma función con `cp.quad_form(w, cp.psd_wrap(Sig))` como objetivo. Las dos carteras se miden después **con la misma vara**: el CVaR al 97,5 %.

???
La llamada a `solve` se partió en dos líneas para que quepa; el bloque entero está en la sección 4. La restricción es una igualdad, `==`, igual que en la fórmula. La cartera media-CVaR gana por construcción: la pregunta es por cuánto.

## Las dos fronteras van tan juntas que el trazo punteado apenas se separa

![Las dos fronteras, medidas en CVaR al 97,5 %. Rosa, la que optimiza la cola; morada punteada, la que optimiza la varianza. En el extremo derecho coinciden: 100 % en ISA.](recursos/cap08/cap8-fronteras.json){alto=440}

???
En el último retorno objetivo, el 12,88 %, coinciden exactamente porque al pedir el máximo retorno posible solo hay una cartera que lo consigue, y los dos problemas devuelven esa.

## Optimizar la cola gana entre 23 y 219 millones; dos ruedas defectuosas mueven 1 692

![Lo que gana optimizar la cola en vez de la varianza, para cada retorno objetivo, en millones de la convención w′μ.](recursos/cap08/cap8-brecha.json){alto=420}

???
El máximo, 219 millones, cae en el retorno objetivo del 10,85 %: el 0,03 % del fondo. Para calibrar, con la misma vara: quitar el par defectuoso del 19 y el 20 de febrero de 2025, dos ruedas de 1 916, mueve esta cola 1 692 millones al 97,5 %. Un defecto declarado del panel pesa casi ocho veces más que todo lo que gana cambiar de criterio. Aquí conviene abrir el laboratorio del nivel α (R9 de la sección 4): lo que gana optimizar la cola va de 1 millón en el 90,5 % a 3 976 en el 99,5 %, y la mínima varianza deja de proteger mejor que la declarada entre el 98,5 % y el 99 %.

## ¿Qué haría que dejaran de parecerse? {.pregunta etiqueta="R2 · Predice el efecto"}

Sobre este panel, las dos fronteras dan carteras que difieren, como mucho, en 219 millones de cola. ¿Qué cambio en el problema las separaría?

::: respuesta
Meter en la cartera un activo de **pago asimétrico** —una opción vendida, un bono con riesgo de incumplimiento—. Rompe la simetría sobre la que descansa la coincidencia. Subir el nivel o alargar la ventana cambia las cifras, pero no la naturaleza del problema.
:::

???
Los distractores del material: subir α al 99,9 %, alargar la ventana a veinte años o añadir el tope del 30 % por emisor. Dejar que defiendan el del nivel antes de revelar, que es el más tentador: la brecha sí crece con α —hasta 3 976 millones al 99,5 % en el laboratorio—, pero subir el nivel cambia las cifras, no la naturaleza del problema.

## Con retornos elípticos, las dos fronteras serían la misma

- Bajo una normal o una t multivariada, toda medida que dependa solo de la distribución de w′r **se ordena igual que la varianza**
- Este panel no es elíptico: su curtosis de exceso es de **25,77**
- Pero se aparta en la **magnitud** de los extremos, no tanto en **qué activos** caen juntos
- Y los pesos dependen de lo segundo

::: warn Cuándo dejarían de parecerse
Con pagos asimétricos la varianza no describe nada: en los dos bonos del capítulo 5, el VaR de la cartera excede la suma de los VaR en 102 000 millones.
:::

???
Es la caja «Por qué se parecen tanto, y cuándo dejarían de parecerse», de la sección 4. Los capítulos 12 y 13 traen esos activos asimétricos. Con cuatro acciones, la respuesta honesta es la que dice la gráfica.

## Con el mismo retorno, los dos dan casi la misma cartera

```python A · media-varianza (capítulo 7) {resaltar=5-6}
w = cp.Variable(4)
cp.Problem(cp.Minimize(cp.quad_form(w, Sig)),
           [cp.sum(w) == 1, w >= 0,
            mu @ w == 0.067839]).solve()
# ECO 21.50  BOG 34.21  SUR 15.92  ISA 28.37
# CVaR 97,5 % 4.5844 %   volatilidad 23.99 %
```

```python B · media-CVaR (este capítulo) {resaltar=6-7}
w, z, u = cp.Variable(4), cp.Variable(), cp.Variable(S)
cp.Problem(cp.Minimize(z + cp.sum(u)/((1-alfa)*S)),
           [u >= -(R @ w) - z, u >= 0,
            cp.sum(w) == 1, w >= 0,
            mu @ w == 0.067839]).solve()
# ECO 19.36  BOG 34.61  SUR 16.43  ISA 29.60
# CVaR 97,5 % 4.5815 %   volatilidad 24.00 %
```

???
Es el `Comparador` del R4 de la sección 4, con el retorno objetivo de la cartera de mínima CVaR, 6,7839 %. Uno tiene cuatro variables y una matriz de 4 × 4; el otro, 1 921 variables y una fila por rueda. Pedir que lean los pesos en voz alta y digan dónde está la diferencia: 2,14 pp en Ecopetrol.

## ¿Qué conclusión se sostiene? {.pregunta etiqueta="R4 · Comparación"}

Las dos carteras difieren en **2,14 pp** en Ecopetrol, y su CVaR, en **0,0029 pp**: unos 23 millones.

::: respuesta
Que sobre este panel las dos formulaciones dan prácticamente la misma cartera, y que eso es un resultado **del panel**, no de las medidas. «No hace falta aquí» no es lo mismo que «no hace falta».
:::

???
Los distractores del material: «miden lo mismo y la diferencia es ruido numérico», «Rockafellar-Uryasev no aporta nada en la práctica» y «23 millones es despreciable, la elección es estética». Saberlo tiene valor: en este fondo, el programa de 1 921 variables se puede sustituir por el de cuatro sin perder casi nada. Lo que no se sostiene es generalizarlo.

# Cuántos escenarios mandan {seccion=sec5}

> La matriz de covarianzas usa las 1 916 ruedas para estimar diez números; la cola usa las 48 peores para estimar uno. El objetivo es mejor y el estimador, más pobre.

???
Esa es la asimetría que el capítulo declara antes de recomendar nada.

## Con 250 ruedas al 99 %, dos ruedas y media deciden la cartera del fondo {.idea}

Un fondo de 800 000 millones. Y un promedio de dos ruedas y media no es un estadístico: es una anécdota con decimales.

???
Es lo que produce un optimizador CVaR alimentado con la ventana regulatoria de 250 ruedas del capítulo 6. Dejar la frase en el aire unos segundos.

## La cola tiene cuarenta veces menos datos que la covarianza

$$ n_{\text{cola}} = (1-\alpha)\,S \qquad\text{frente a}\qquad n_{\Sigma} = S \qquad\Longrightarrow\qquad \frac{n_{\Sigma}}{n_{\text{cola}}} = \frac{1}{1-\alpha} $$

- No depende del panel, solo del nivel: **40** veces al 97,5 % y **100** al 99 %
- La medida que el capítulo defiende se estima con muchos menos datos que la que critica
- Las dos cosas son ciertas a la vez, y por eso el capítulo **no** termina con «adopte el CVaR»

???
Subir el nivel por prudencia reduce la fracción de la cola: la prudencia del nivel se paga en precisión del estimador. Y aumentar S con escenarios simulados de un modelo ajustado a los mismos datos agranda el panel sin añadir evidencia.

## Cuántos escenarios deciden el número, según la ventana y el nivel

| Ventana | 95 % | 97,5 % | 99 % |
|---|---|---|---|
| 250 ruedas | 12,5 | **6,3** | **2,5** |
| 500 | 25,0 | 12,5 | 5,0 |
| 1 000 | 50,0 | 25,0 | 10,0 |
| 1 916, el panel | 95,8 | **47,9** | 19,2 |

Es el conteo que el curso exige reportar junto a toda cifra estimada sobre una cola.

???
Es la primera tabla del bloque de la sección 5. Con la ventana de 250 ruedas al 97,5 %, la cola son 6,3 escenarios: el panel entero da 47,9, que ya es poco al lado de las 1 916 que alimentan una matriz de covarianzas.

## Año por año, las dos carteras se separan hasta 23 pp con seis ruedas en la cola

![Barras: distancia máxima entre la cartera de mínima CVaR y la de mínima varianza, por año. Línea: ruedas que caen en la cola de ese año, unas seis.](recursos/cap08/cap8-anos.json){alto=430}

???
Van de 5,14 pp en 2021 a 23,26 pp en 2025. Con seis observaciones en la cola, esa separación no informa sobre la cola: es lo que hacen seis observaciones. La mínima varianza también se mueve entre años, pero su insumo son unas 240 ruedas enteras y no seis.

## Dos ruedas de 1 916 mueven el CVaR al 99 % en 3 777 millones

| Nivel | Con el par | Sin el par | Brecha (millones) |
|---|---|---|---|
| 95 % | 3,6254 % | 3,5122 % | 905 |
| 97,5 % | 4,7311 % | 4,5196 % | 1 692 |
| 99 % | 6,7095 % | 6,2373 % | **3 777** |

El mismo par movió la volatilidad 1,27 pp sobre 25,02 (capítulo 7). El 19 de febrero de 2025 es la **segunda peor rueda** del panel.

???
Es el par de cotizaciones defectuosas del 19 y el 20 de febrero de 2025, declarado en el manifiesto y no corregido. Cartera declarada; millones de la convención w′μ. En una cola de 19,2 ruedas, cada una pesa una veinteava parte; en una varianza sobre las 1 916, una dosmilésima: cien veces menos.

## Un optimizador de cola hereda los defectos del panel, concentrados

::: danger La consecuencia para quien tenga que firmar
Las ruedas anómalas son, casi por definición, ruedas extremas, y en una cola solo hay ruedas extremas.
:::

- La regla del capítulo 4 —diagnosticar el panel y declarar qué se hace con cada anomalía— deja de ser higiene y pasa a ser **parte del cálculo**
- La del capítulo 7 —declarar la ventana antes de estimar— se endurece: aquí se declaran la ventana **y el nivel**

???
Los dos juntos deciden cuántos datos hay de verdad detrás del número. Es la caja de la sección 5.

## ¿Qué dos pasos, hechos tarde, arruinan una optimización de cola? {.pregunta etiqueta="R5 · Procedimiento"}

Un área de riesgo arma una cartera de mínima CVaR en nueve pasos: declarar, diagnosticar, construir los escenarios, contar la cola, resolver, verificar, comparar, repetir y llevarla al comité.

::: respuesta
**Contar la cola**: hacerlo al final es descubrir que se estimó un promedio con seis observaciones después de presentarlo. **Verificar la solución**: el óptimo del programa tiene que coincidir con el CVaR recalculado sobre los pesos; si no, se optimizó otra cosa, como en el R3 de la cola fijada.
:::

???
Es el R5 de la sección 3, convertido en pregunta abierta; el ordenamiento completo de los nueve pasos se hace en el material. Contar antes puede llevar a bajar el nivel o a alargar la ventana, y esa es una decisión metodológica, no un ajuste.

## ¿Qué hace mal este código? {.pregunta etiqueta="R3 · Audita a la IA"}

Se le pidió a un modelo una optimización CVaR **histórica** del fondo. Monta el programa de la sección 3 tal cual. ¿Qué línea falla, y qué error es?

```python Lo que devolvió el modelo
r = np.log(precios[acciones]).diff().dropna()
rng = np.random.default_rng(2026)
R = rng.multivariate_normal(r.mean(), r.cov(), 100_000) * 100

w = min_cvar(R, alfa)        # el programa lineal de la seccion 3
print("Optimizacion CVaR historica al 97,5 %:", (w * 100).round(2))
```

::: respuesta
La de `R`: los escenarios salen de una normal, y nadie comprobó ese supuesto contra una curtosis de 25,77. **Supuesto no verificado.** Peor: bajo una normal, minimizar el CVaR **es** minimizar la varianza. Reporta 3,5142 % donde la historia da **4,6012 %**.
:::

???
Se quitaron los `import` y las líneas que leen el panel y fijan `alfa`; en el material la línea defectuosa es la 10. Devuelve 21,08 · 37,57 · 15,98 · 25,36, a 0,56 pp de la mínima varianza, y esa distancia es error de simulación. Son 8 696 millones de cola sin reportar: el informe diría 28 114 donde los datos dicen 36 810. Y en R ni siquiera arranca: el andamio de `lpSolve` es denso, y con cien mil escenarios la matriz pide del orden de 80 GB. Los R3 son de nivel 1, sin IA.

## ¿Debe el fondo adoptar la optimización CVaR? {.pregunta etiqueta="R7 · Interpretación"}

El comité pregunta si conviene fijar los pesos con este criterio. Con todo lo medido, ¿qué respuesta se sostiene?

::: respuesta
Sobre estos cuatro activos gana **201 millones** en la convención —el 0,03 % del fondo, y 147 sobre lo que cobra— y añade fragilidad: 47,9 ruedas contra 1 916. La decisión no se toma con esa cifra, sino con lo que el fondo vaya a comprar mañana: si entran pagos asimétricos, cambia.
:::

???
Los distractores del material: «sí, sin reservas: el CVaR es coherente», «no, porque 201 millones no pagan el rebalanceo» y «posponerla hasta tener más eventos extremos». El segundo esconde una trampa: una reducción de una medida de riesgo y un gasto recurrente no se restan, y el capítulo no midió ese costo. Y hay un uso del CVaR que no depende de nada de esto: medirlo, sin optimizar.

## ¿Compensa la complejidad? Hay tres preguntas que se confunden {.pregunta etiqueta="R8 · Justifica"}

El área de inversiones propone adoptar la optimización CVaR como criterio permanente. Antes de responder, separe tres preguntas:

::: tarjetas {.paso}
### ¿Medir la cola?
Sí, sin discusión: el capítulo 5 lo justifica por coherencia y Basilea III lo exige. Cuesta lo que cuesta ordenar una serie.
### ¿Optimizarla con estas cuatro acciones?
No compensa: 201 millones al 97,5 % en la convención, 0,07 pp más de volatilidad y un estimador de 47,9 ruedas.
### ¿Tener el programa escrito?
Sí, y es la que importa: el día que entre una opción vendida, la varianza no describirá esos pagos.
:::

???
Las tarjetas salen de una en una: pedir la respuesta a cada pregunta antes de revelarla. Lo que no es defendible: presentar los 201 millones sin decir sobre cuántas ruedas se calcularon, o descartar el método por su resultado en un panel de cuatro acciones. La solución del material cita además 1 724 millones al 99 %, también de la convención. El R8 admite IA con bitácora.

## El criterio no se adopta por lo que gana hoy, sino por lo que hace posible mañana {.idea}

Montar el programa una vez cuesta un par de horas. No tenerlo, el día que la cartera traiga pagos asimétricos, deja al fondo sin forma de optimizar nada.

???
Es el cierre de la solución del R8. Los capítulos 12 y 13 traen exactamente esos activos.

# Cierre y taller {seccion=eval}

## Lo que se llevan hoy {.cierre}

- Una cifra de los escenarios no es dinero: decidir con la convención cuesta 49 millones, y reportar con ella se equivoca en 1 783
- Sobre cuatro acciones las dos fronteras casi coinciden: «no hace falta aquí» no es «no hace falta»
- Dejan de coincidir con pagos asimétricos: opciones vendidas, bonos con riesgo de incumplimiento
- Toda cifra de cola va con su conteo: 47,9 ruedas, o 2,5 con 250 ruedas al 99 %
- Un optimizador de cola hereda los defectos del panel, concentrados

???
El cuestionario integrador de diez preguntas y el R7 «La nota que acompaña a la cartera» están en la sección de evaluación del material: dejarlos para antes del taller.

## El taller 8 pide reproducir, auditar y recomendar {columnas=3:2}

1. **Reproducir el capítulo**, tras declarar nivel, ventana y restricciones
2. **Su propio nivel y su propia ventana**, con el conteo de la cola
3. **Los dos errores** que el capítulo audita
4. **Lo que ninguna formulación promete**
5. **Auditar a la IA**
6. **La bitácora** de prompts
7. **La recomendación** y el acta

|||

::: info Nivel de IA 3, con bitácora
Puede usar IA para explorar, depurar y redactar si registra cada intercambio. La **parte 5** es de nivel 1: auditar a la IA no se le pide a la IA.
:::

???
Se entrega el HTML renderizado desde el `.qmd`, con todos los bloques ejecutados; se califica igual en R, con `lpSolve`, que en Python, con `cvxpy`. Un taller sin bitácora se califica sobre cero. Para la transición al capítulo 9: se acaban las acciones y empiezan los flujos con fecha; un bono no tiene precio hasta que alguien descuenta sus flujos con una curva.
