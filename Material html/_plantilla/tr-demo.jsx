        /* ============================================================
           CONFIGURACIÓN DEL CAPÍTULO
           Al crear un capítulo nuevo, esto es lo único que cambia aquí
           arriba; el contenido va en las secciones de más abajo.
        ============================================================ */
        const CONFIG = {
            numero: '00',
            titulo: 'Plantilla base',
            subtitulo: 'Catálogo de componentes y guía de autoría del material',
            unidad: 'Referencia técnica',
            horas: 0,
            ra: 'RA— (plantilla)',
            contenidoSyllabus: 'No aplica — archivo de referencia técnica',
            temas: ['Componentes', 'Ejercicios R1–R9', 'Guía de autoría'],
            nivelIA: 1,
            storageKey: 'tdr_cap00_plantilla',
            docente: 'Javier Mauricio Sierra',
        };

        /* ============================================================
           DATOS DEL HILO CONDUCTOR
           Todo el material gira alrededor del mismo portafolio: un fondo
           de pensiones colombiano. Aquí van literales para que la
           plantilla no dependa de `datos/`; en los capítulos reales
           salen del CSV congelado.

           ⚠️ Los datos van LITERALES o del CSV, nunca simulados dentro
           del bloque cuando las dos pestañas deben coincidir:
           `np.random.default_rng(2026)` y `set.seed(2026)` NO producen la
           misma muestra, así que un bloque que simula muestra dos cifras
           distintas para el mismo cálculo y el material afirma dos cosas
           a la vez. Donde el capítulo simule de verdad —Montecarlo en el
           4 y en el 12— hay que decirlo en el texto.
        ============================================================ */
        const PERDIDAS = [1.42, 1.51, 1.63, 1.70, 1.88, 1.94, 2.05, 2.19, 2.31, 2.47,
            2.55, 2.68, 2.83, 3.04, 3.29, 3.61, 4.02, 4.77, 5.93, 8.14];

        /* Cuantil de tipo 7 — el mismo que usan `np.quantile` y `quantile()`
           de R por omisión. Se escribe aquí porque el `Laboratorio` calcula
           en el navegador y una discrepancia con el bloque de código sería
           justo el defecto que el material enseña a cazar. */
        const cuantil = (xs, p) => {
            const s = [...xs].sort((a, b) => a - b);
            const h = (s.length - 1) * p;
            const lo = Math.floor(h), hi = Math.ceil(h);
            return s[lo] + (h - lo) * (s[hi] - s[lo]);
        };

        /* Coma decimal. `toFixed` produce punto, que es la convención de los
           dos lenguajes y por eso está bien DENTRO de un bloque de código;
           en la prosa y en las gráficas la convención es la del español, y
           mezclarlas en la misma pantalla se lee como un descuido. */
        const dec = (x, n = 2) => x.toFixed(n).replace('.', ',');

        /* ============================================================
           BLOQUES DE CÓDIGO
           Toda salida declarada tras `#>` está ejecutada: la comprobación
           9 de verificar.py corre estos bloques y compara.
        ============================================================ */
        const EJ_RENDIMIENTOS = {
            python: `import numpy as np

precios = np.array([2450, 2478, 2431, 2465, 2502])   # cierre diario, COP
r = np.diff(np.log(precios))                          # rendimiento logarítmico

print(np.round(r * 100, 3))
#> [ 1.136 -1.915  1.389  1.49 ]
print(f"Volatilidad diaria: {r.std(ddof=1) * 100:.3f} %")
#> Volatilidad diaria: 1.633 %
print(f"Anualizada (252 d):  {r.std(ddof=1) * np.sqrt(252) * 100:.2f} %")
#> Anualizada (252 d):  25.93 %`,
            r: `precios <- c(2450, 2478, 2431, 2465, 2502)   # cierre diario, COP
r       <- diff(log(precios))                # rendimiento logarítmico

print(round(r * 100, 3))
#> [1]  1.136 -1.915  1.389  1.490
cat(sprintf("Volatilidad diaria: %.3f %%\\n", sd(r) * 100))
#> Volatilidad diaria: 1.633 %
cat(sprintf("Anualizada (252 d):  %.2f %%\\n", sd(r) * sqrt(252) * 100))
#> Anualizada (252 d):  25.93 %`,
        };

        const EJ_VAR_ES = {
            python: `import numpy as np

# Veinte pérdidas diarias del portafolio, en %, ya ordenadas.
perdidas = np.array([1.42, 1.51, 1.63, 1.70, 1.88, 1.94, 2.05, 2.19, 2.31, 2.47,
                     2.55, 2.68, 2.83, 3.04, 3.29, 3.61, 4.02, 4.77, 5.93, 8.14])

var = np.quantile(perdidas, 0.90)          # el corte que deja fuera el 10 % peor
es = perdidas[perdidas > var].mean()       # la MEDIA de lo que hay más allá

print(f"VaR : {var:.3f} %")
#> VaR : 4.886 %
print(f"ES  : {es:.3f} %")
#> ES  : 7.035 %
print(f"El ES supera al VaR en {es - var:.3f} puntos porcentuales")
#> El ES supera al VaR en 2.149 puntos porcentuales`,
            r: `# Veinte pérdidas diarias del portafolio, en %, ya ordenadas.
perdidas <- c(1.42, 1.51, 1.63, 1.70, 1.88, 1.94, 2.05, 2.19, 2.31, 2.47,
              2.55, 2.68, 2.83, 3.04, 3.29, 3.61, 4.02, 4.77, 5.93, 8.14)

var <- quantile(perdidas, 0.90, names = FALSE)   # el corte que deja fuera el 10 % peor
es  <- mean(perdidas[perdidas > var])            # la MEDIA de lo que hay más allá

cat(sprintf("VaR : %.3f %%\\n", var))
#> VaR : 4.886 %
cat(sprintf("ES  : %.3f %%\\n", es))
#> ES  : 7.035 %
cat(sprintf("El ES supera al VaR en %.3f puntos porcentuales\\n", es - var))
#> El ES supera al VaR en 2.149 puntos porcentuales`,
        };

        const EJ_EWMA = {
            python: `lam = 0.94                    # lambda de RiskMetrics para datos diarios
var_t = 0.000260              # varianza del día anterior

for r in [-0.0191, 0.0139, 0.0149]:
    var_t = lam * var_t + (1 - lam) * r ** 2
    print(f"sigma = {100 * var_t ** 0.5:.4f} %")
#> sigma = 1.6318 %
#> sigma = 1.6183 %
#> sigma = 1.6109 %`,
            r: `lam   <- 0.94        # lambda de RiskMetrics para datos diarios
var_t <- 0.000260    # varianza del día anterior

for (r in c(-0.0191, 0.0139, 0.0149)) {
  var_t <- lam * var_t + (1 - lam) * r^2
  cat(sprintf("sigma = %.4f %%\\n", 100 * sqrt(var_t)))
}
#> sigma = 1.6318 %
#> sigma = 1.6183 %
#> sigma = 1.6109 %`,
        };

        /* El bloque que audita el ejercicio R3: lo «escribió» un modelo de
           lenguaje y trae un error plantado. No lleva salida `#>` a
           propósito —afirmar una salida de código roto sería mentir— y la
           comprobación 9 lo deja fuera por eso mismo. */
        const IA_ES_MAL = {
            python: [
                'import numpy as np',
                '',
                'perdidas = np.loadtxt("perdidas.csv")',
                'alfa = 0.975',
                '',
                'var = np.quantile(perdidas, alfa)',
                'es  = np.quantile(perdidas, alfa)',
                '',
                'print(f"VaR {var:.2f} %  ·  ES {es:.2f} %")',
            ],
            r: [
                'perdidas <- scan("perdidas.csv")',
                'alfa     <- 0.975',
                '',
                'var <- quantile(perdidas, alfa, names = FALSE)',
                'es  <- quantile(perdidas, alfa, names = FALSE)',
                '',
                'cat(sprintf("VaR %.2f %%  ·  ES %.2f %%\\n", var, es))',
            ],
        };

        /* ============================================================
           PORTADA
        ============================================================ */
        const PortadaSection = () => (
            <>
                <Motivacion icon="fa-money-bill-trend-up"
                    gancho="Este archivo no se estudia: se copia. Es el molde de los quince capítulos, y lo que aquí quede mal se repite quince veces.">
                    El informe decía que la pérdida diaria máxima esperada era 1,8 %. Ayer el
                    portafolio perdió 6,3 %. Nadie mintió y nadie se equivocó al sumar: el modelo
                    suponía una distribución normal y el mercado no la leyó. Todo el curso trata
                    de esa distancia —entre lo que un modelo afirma y lo que el mundo hace— y de
                    cómo medirla, validarla y defenderla ante un comité.
                </Motivacion>

                <NivelIA nivel={CONFIG.nivelIA}
                    nota="El nivel se declara por capítulo y, dentro de él, por tipo de ejercicio. Esta plantilla lo muestra en el nivel 1 porque su contenido es de referencia." />

                <CalloutPro tema="tip" titulo="Cómo se usa esta plantilla"
                    subtitulo="Copiar, cambiar CONFIG, reemplazar las secciones">
                    <p>
                        Un capítulo nuevo nace copiando <span className="inline-code">tr-base.html</span>,
                        cambiando el objeto <span className="inline-code">CONFIG</span> de arriba y
                        reemplazando estas secciones por el contenido real. El bloque delimitado por
                        <span className="inline-code">/* === TR-CORE INICIO === */</span> …
                        <span className="inline-code">/* === TR-CORE FIN === */</span> <strong>no se
                        toca</strong>: se genera con <span className="inline-code">ensamblar.py</span> y
                        se estampa con <span className="inline-code">migrar.py</span>. La comprobación 1
                        del verificador compara ese bloque byte a byte y existe justamente para cazar
                        una edición manual.
                    </p>
                </CalloutPro>

                <Box type="warn" label="Los dos lenguajes van en paralelo, siempre">
                    Cada bloque de código trae Python y R. No es adorno: los estudiantes llegan del
                    programa de Estadística con R como lengua materna y el syllabus promete un puente
                    hacia Python. La pestaña abre en Python para empujar al lenguaje nuevo, y R queda
                    a un clic. La comprobación 4 falla si un bloque trae uno solo.
                </Box>

                <Timeline eventos={[
                    { year: '1994', text: 'J. P. Morgan publica RiskMetrics y el VaR se vuelve el lenguaje común del riesgo de mercado.' },
                    { year: '1999', text: 'Artzner y coautores formalizan las medidas coherentes. El VaR no cumple: no es subaditivo.' },
                    { year: '2016', text: 'Basilea publica el FRTB y sustituye el VaR al 99 % por el Expected Shortfall al 97,5 %.' },
                    { year: '2026', text: 'La cuestión ya no es solo calcular: es auditar lo que calcula un modelo de lenguaje.' },
                ]} />
            </>
        );

        /* ============================================================
           SECCIÓN 1 — COMPONENTES DE CONTENIDO
        ============================================================ */
        const Seccion1 = () => {
            usePlotly('demo-cola',
                () => {
                    const orden = [...PERDIDAS].sort((a, b) => a - b);
                    const v = cuantil(orden, 0.90);
                    return [{
                        x: orden, y: orden.map(() => 1), type: 'bar',
                        marker: { color: orden.map(p => p > v ? '#B91C1C' : '#3D008D') },
                        width: 0.12, hoverinfo: 'x', name: 'Pérdida diaria',
                    }];
                },
                () => ({
                    margin: { t: 30, r: 20, b: 45, l: 30 },
                    xaxis: { title: 'Pérdida diaria (%)', zeroline: false },
                    yaxis: { visible: false },
                    showlegend: false,
                    shapes: [
                        { type: 'line', x0: 4.886, x1: 4.886, y0: 0, y1: 1.15, line: { color: '#ED1E79', width: 2, dash: 'dash' } },
                        { type: 'line', x0: 7.035, x1: 7.035, y0: 0, y1: 1.15, line: { color: '#B91C1C', width: 2 } },
                    ],
                    annotations: [
                        { x: 4.886, y: 1.22, text: 'VaR 4,89 %', showarrow: false, font: { size: 11, color: '#ED1E79' } },
                        { x: 7.035, y: 1.22, text: 'ES 7,04 %', showarrow: false, font: { size: 11, color: '#B91C1C' } },
                    ],
                }), []);

            return (
                <>
                    <Motivacion icon="fa-layer-group"
                        gancho="Un componente mal elegido no rompe nada: solo hace que el estudiante lea peor, y eso no sale en ningún error de consola.">
                        Dos capítulos explican lo mismo. En uno, la fórmula del Expected Shortfall
                        aparece suelta en medio de un párrafo; en el otro, destacada, con su término
                        definido al pasar el cursor y su derivación plegable al lado. El contenido es
                        idéntico. La diferencia la nota el estudiante a las once de la noche, cuando
                        ya no tiene a quién preguntarle.
                    </Motivacion>

                    <h3>Fórmulas y términos</h3>
                    <p>
                        El <Termino def="Media de las pérdidas que superan el VaR. A diferencia del VaR, sí es una medida coherente: dice cuánto se pierde cuando se pierde, no solo con qué frecuencia.">Expected Shortfall</Termino> (déficit
                        esperado) responde la pregunta que el VaR deja abierta:
                    </p>
                    <Eq>{'$$\\mathrm{ES}_\\alpha = \\mathbb{E}\\left[L \\mid L > \\mathrm{VaR}_\\alpha\\right]$$'}</Eq>
                    <p>
                        Nótese la convención terminológica del curso: el término va en inglés con la
                        traducción entre paréntesis <strong>la primera vez de cada capítulo</strong>, y
                        después solo en inglés. Es como aparece en Basilea, en la Superfinanciera y en
                        el nombre de las funciones de las librerías; quien lea «déficit esperado»
                        durante quince capítulos no reconoce <span className="inline-code">expected_shortfall</span> al
                        abrir la documentación.
                    </p>

                    <h3>Código en Python y en R</h3>
                    <p>
                        La salida no va en un panel aparte: se escribe <strong>dentro</strong> del
                        bloque, con el prefijo <span className="inline-code">#&gt;</span>, pegada a la
                        instrucción que la produce. Así se lee sin saltar la vista y copiar el bloque
                        entrega un guion ejecutable.
                    </p>
                    <CodeTabs titulo="De precios a rendimientos y volatilidad" bloques={EJ_RENDIMIENTOS}
                        nota="Los dos lenguajes dan la misma cifra porque los datos son literales. Un bloque que simule no puede prometer eso." />

                    <Box type="danger" label="Toda salida declarada debe haberse ejecutado">
                        La comprobación 9 extrae estos bloques, los corre en Python y en R, y compara
                        su salida real con la declarada. Es la única defensa contra una cifra que
                        envejece mal: un número equivocado no se ve en pantalla, se lee como cualquier
                        otro. Aquí se ejecutan <strong>los dos</strong> lenguajes del curso, así que el
                        material queda auditado por completo.
                    </Box>

                    <h3>Gráficas</h3>
                    <p>
                        Las series se embeben decimadas —máximo 1500 puntos— y un capítulo que pase de
                        400 KB se parte. Lo comprueba la regla 12. Una gráfica y el bloque que la
                        produce van juntos y con las <strong>mismas cifras</strong>: si la línea del
                        VaR de la figura no coincide con el número que imprime el código, el material
                        contiene el error que enseña a cazar.
                    </p>
                    <CodeTabs titulo="El VaR y el ES de la muestra" bloques={EJ_VAR_ES}
                        nota="Son las cifras que marcan las dos líneas verticales de la figura de abajo." />
                    <ChartFrame id="demo-cola" height="chart-h-320"
                        caption="Las veinte pérdidas de la muestra. En rojo, las que superan el VaR: el ES es su promedio." />

                    <h3>Estructuras de contenido</h3>
                    <Pipeline steps={[
                        { title: 'Datos', desc: 'Precios congelados del CSV' },
                        { title: 'Rendimientos', desc: 'Logarítmicos, para poder agregar' },
                        { title: 'Volatilidad', desc: 'EWMA o GARCH' },
                        { title: 'VaR y ES', desc: 'Con su supuesto de cola declarado' },
                        { title: 'Backtesting', desc: 'Kupiec, Christoffersen, Acerbi-Székely' },
                    ]} />

                    <Accordion items={[
                        {
                            title: '¿Por qué rendimientos logarítmicos y no aritméticos?',
                            content: 'Porque se suman en el tiempo: el rendimiento de cinco días es la suma de los cinco diarios. Los aritméticos no lo hacen, y esa es la razón de que agregarlos sumándolos sea uno de los errores que el material planta a propósito.',
                        },
                        {
                            title: '¿Por qué 252 días para anualizar?',
                            content: 'Es el número aproximado de ruedas bursátiles al año. Anualizar con 365 mezcla días en que el mercado no se movió porque estaba cerrado con días en que no se movió porque nadie operó, y solo lo segundo es información.',
                        },
                    ]} />
                </>
            );
        };

        /* ============================================================
           SECCIÓN 2 — LOS NUEVE TIPOS DE EJERCICIO
        ============================================================ */
        const Seccion2 = () => (
            <>
                <Motivacion icon="fa-clipboard-question"
                    gancho="Un ejercicio que se puede resolver leyendo la sección anterior en diagonal no mide nada: mide que el estudiante sabe buscar.">
                    En la evaluación de 2025, el 80 % de los estudiantes calculó bien el VaR y el 30 %
                    supo decir qué significaba para el capital del banco. El cálculo no era el
                    problema. Por eso aquí no se pide escribir programas —eso es de los talleres—:
                    se traza, se audita, se compara y se justifica.
                </Motivacion>

                <TablaTraza
                    titulo="R1 · Traza la recursión EWMA a mano"
                    enunciado={<>Complete la varianza y la volatilidad de cada día. La recursión es <span className="inline-code">σ²ₜ = λ·σ²ₜ₋₁ + (1−λ)·r²ₜ₋₁</span> con λ = 0,94. Los valores son los mismos en los dos lenguajes: esa es justamente la idea.</>}
                    codigo={EJ_EWMA}
                    columnas={[
                        { clave: 'paso', titulo: 'Día' },
                        { clave: 'instruccion', titulo: 'Instrucción' },
                        { clave: 'r', titulo: 'rₜ' },
                        { clave: 'var', titulo: 'σ²ₜ × 10⁴' },
                        { clave: 'sigma', titulo: 'σₜ (%)' },
                    ]}
                    filas={[
                        { paso: '0', instruccion: ins('var_t = 0.000260', 'var_t <- 0.000260'), r: '—', var: '2.600', sigma: '1.6125' },
                        { paso: '1', instruccion: ins('var_t = lam*var_t + (1-lam)*r**2', 'var_t <- lam*var_t + (1-lam)*r^2'), r: '−0.0191', var: '2.663', sigma: '1.6318' },
                        { paso: '2', instruccion: ins('var_t = lam*var_t + (1-lam)*r**2', 'var_t <- lam*var_t + (1-lam)*r^2'), r: '0.0139', var: '2.619', sigma: '1.6183' },
                        { paso: '3', instruccion: ins('var_t = lam*var_t + (1-lam)*r**2', 'var_t <- lam*var_t + (1-lam)*r^2'), r: '0.0149', var: '2.595', sigma: '1.6109' },
                    ]}
                    ocultas={['var', 'sigma']}
                    pista="Eleve el rendimiento al cuadrado ANTES de multiplicar por (1−λ). Y recuerde que la tabla pide σ² multiplicada por diez mil."
                />

                <Ejercicio tipo="R2">
                    <MCQ
                        pregunta="Si el nivel de confianza pasa del 95 % al 99 % sobre la misma muestra, ¿qué le ocurre a la diferencia entre el ES y el VaR?"
                        opciones={[
                            { texto: 'Tiende a reducirse: quedan menos observaciones en la cola sobre las que promediar, y el promedio se acerca al propio corte.', correcta: true },
                            { texto: 'Crece siempre, porque el ES crece más rápido que el VaR.', correcta: false },
                            { texto: 'No cambia: la diferencia depende de la muestra, no del nivel.', correcta: false },
                            { texto: 'Se vuelve negativa a partir del 99 %.', correcta: false },
                        ]}
                    />
                </Ejercicio>

                <DetectaError
                    titulo="R3 · Audita a la IA"
                    enunciado="Se le pidió a un modelo de lenguaje que calculara el VaR y el Expected Shortfall al 97,5 % de una serie de pérdidas. El código corre y no lanza ningún error. Señale la línea defectuosa y clasifique el error."
                    lineas={IA_ES_MAL}
                    lineaCorrecta={{ python: 7, r: 5 }}
                    tipos={TIPOS_ERROR_RIESGO}
                    tipoCorrecto={IDX_ERROR.medida}
                    explicacion="El ES no es un cuantil: es la MEDIA de las pérdidas que superan el cuantil. Calculado así, el ES sale idéntico al VaR y el informe declara que la pérdida esperada en la cola es la misma que el corte de la cola, que es precisamente lo que el ES vino a corregir. Lo correcto es promediar las observaciones que exceden el VaR."
                    impacto="Con la muestra del capítulo, el ES verdadero supera al VaR en 2,15 puntos porcentuales. Sobre un portafolio de 800 000 millones de pesos, el código de la IA subestima la pérdida esperada en la cola en unos 17 200 millones — y el requerimiento de capital que se deriva de ella."
                />

                <Comparador
                    titulo="R4 · Dos formas de estimar la misma cola"
                    enunciado={<>Ambas versiones estiman el riesgo de la cola sobre la misma muestra de pérdidas. Una supone una forma para la distribución; la otra no.</>}
                    a={{
                        etiqueta: 'A · Paramétrico normal',
                        codigo: {
                            python: `mu, sd = perdidas.mean(), perdidas.std(ddof=1)
var = mu + 1.6449 * sd`,
                            r: `mu <- mean(perdidas); sd <- sd(perdidas)
var <- mu + 1.6449 * sd`,
                        },
                        nota: 'Usa toda la muestra, incluso el centro.',
                    }}
                    b={{
                        etiqueta: 'B · Histórico',
                        codigo: {
                            python: `var = np.quantile(perdidas, 0.95)`,
                            r: `var <- quantile(perdidas, 0.95, names = FALSE)`,
                        },
                        nota: 'Usa solo el orden de los datos.',
                    }}
                    pregunta="Con una muestra de colas pesadas como la de este capítulo, ¿cuál es la afirmación correcta?"
                    opciones={[
                        { texto: 'La versión A subestima el riesgo, porque la normal asigna a la cola menos probabilidad de la que los datos muestran.', correcta: true },
                        { texto: 'Las dos coinciden, porque estiman el mismo cuantil.', correcta: false },
                        { texto: 'La versión B es siempre preferible, sin condiciones.', correcta: false },
                    ]}
                />

                <OrdenaPasos
                    titulo="R5 · Ordene el procedimiento de backtesting"
                    enunciado="Reconstruya el orden en que se valida un modelo de VaR. El orden importa: hay pasos que no se pueden hacer antes que otros sin invalidar la prueba."
                    pasos={[
                        'Fijar el nivel α y el horizonte ANTES de mirar los datos de prueba',
                        'Estimar el modelo solo con la ventana de entrenamiento',
                        'Pronosticar el VaR de cada día del periodo de prueba',
                        'Marcar las excepciones: los días en que la pérdida superó su VaR',
                        'Contrastar el número de excepciones con Kupiec (cobertura incondicional)',
                        'Contrastar su independencia con Christoffersen (¿vienen agrupadas?)',
                        'Ubicar el resultado en la zona semáforo y derivar el multiplicador de capital',
                    ]}
                    pista="Todo lo que se decida después de ver el resultado deja de ser una prueba y pasa a ser una justificación."
                />

                <Emparejamiento
                    titulo="R6 · Cada medida con la norma que la exige"
                    enunciado="Relacione cada medida o práctica con el marco normativo que la impone."
                    etiquetaIzq="Medida o práctica"
                    etiquetaDer="Marco que la exige"
                    izquierda={[
                        'Expected Shortfall al 97,5 %',
                        'Horizonte de liquidez por clase de riesgo',
                        'Sistema de administración de riesgo de mercado',
                        'Colchón de activos líquidos a 30 días',
                    ]}
                    derecha={[
                        'FRTB · Basilea (revisión del libro de negociación)',
                        'FRTB · horizontes diferenciados de liquidación',
                        'SARM · Superintendencia Financiera de Colombia',
                        'LCR · Liquidity Coverage Ratio, Basilea III',
                    ]}
                    solucion={[0, 1, 2, 3]}
                />

                <Ejercicio tipo="R7">
                    <Reto titulo="R7 · Qué significa este número para el comité">
                        <p>
                            El ES al 97,5 % a diez días del portafolio del fondo es de 4,2 %. El
                            portafolio vale 800 000 millones de pesos. En el comité de riesgos alguien
                            pregunta: «¿entonces cuánto podemos perder?».
                        </p>
                        <p>
                            Redacte la respuesta en dos frases, sin fórmulas, de modo que sea
                            <strong> correcta</strong> y no invite a leer el número como un máximo.
                        </p>
                    </Reto>
                </Ejercicio>

                <Ejercicio tipo="R8">
                    <Reto titulo="R8 · Justifique el supuesto"
                        solucion={<>
                            <p>
                                Porque son medidas distintas y el cambio no fue de nivel sino de
                                <strong> objeto</strong>. El VaR al 99 % dice con qué frecuencia se
                                rompe el umbral y nada sobre cuánto se pierde al romperlo; el ES al
                                97,5 % promedia la cola entera. Basilea eligió 97,5 % y no 99 % para
                                que el requerimiento de capital resultante fuera comparable en
                                magnitud al del régimen anterior bajo una normal, de modo que el
                                cambio corrigiera la medida sin producir un salto de capital que
                                ninguna entidad podía absorber de golpe.
                            </p>
                            <p>
                                Una respuesta que diga «porque el 97,5 % es más conservador» está mal:
                                un nivel más bajo, por sí solo, es menos exigente. Lo que compensa es
                                promediar la cola.
                            </p>
                        </>}>
                        <p>
                            El FRTB sustituyó el VaR al 99 % por el ES al 97,5 %. Un colega observa que
                            97,5 % es <em>menos</em> exigente que 99 % y concluye que Basilea relajó el
                            requerimiento. ¿Tiene razón? Justifique.
                        </p>
                    </Reto>
                </Ejercicio>

                <Laboratorio
                    titulo="R9 · Mueva el nivel de confianza y mire la cola"
                    id="demo-lab"
                    enunciado="Las veinte pérdidas de la muestra, ordenadas. La línea rosada es el VaR y la roja el ES. Mueva α y observe qué le pasa a la distancia entre las dos."
                    controles={[
                        { id: 'alfa', etiqueta: 'Nivel de confianza α', min: 0.50, max: 0.95, paso: 0.05, valor: 0.90, formato: v => `${(v * 100).toFixed(0)} %` },
                    ]}
                    calcular={(p) => {
                        const orden = [...PERDIDAS].sort((a, b) => a - b);
                        const v = cuantil(orden, p.alfa);
                        const cola = orden.filter(x => x > v);
                        const es = cola.length ? cola.reduce((a, b) => a + b, 0) / cola.length : v;
                        return {
                            traces: [{
                                x: orden, y: orden.map(() => 1), type: 'bar', width: 0.12,
                                marker: { color: orden.map(x => x > v ? '#B91C1C' : '#3D008D') },
                                hoverinfo: 'x', name: 'Pérdida',
                            }],
                            layout: {
                                margin: { t: 34, r: 20, b: 45, l: 30 },
                                xaxis: { title: 'Pérdida diaria (%)', range: [0.8, 8.8], zeroline: false },
                                yaxis: { visible: false, range: [0, 1.35] },
                                showlegend: false,
                                shapes: [
                                    { type: 'line', x0: v, x1: v, y0: 0, y1: 1.15, line: { color: '#ED1E79', width: 2, dash: 'dash' } },
                                    { type: 'line', x0: es, x1: es, y0: 0, y1: 1.15, line: { color: '#B91C1C', width: 2 } },
                                ],
                                annotations: [
                                    { x: v, y: 1.26, text: `VaR ${dec(v)} %`, showarrow: false, font: { size: 11, color: '#ED1E79' } },
                                    { x: es, y: 1.26, text: `ES ${dec(es)} %`, showarrow: false, font: { size: 11, color: '#B91C1C' } },
                                ],
                            },
                        };
                    }}
                    lectura={(p) => {
                        const orden = [...PERDIDAS].sort((a, b) => a - b);
                        const v = cuantil(orden, p.alfa);
                        const cola = orden.filter(x => x > v);
                        const es = cola.length ? cola.reduce((a, b) => a + b, 0) / cola.length : v;
                        const n = cola.length;
                        return `Al ${(p.alfa * 100).toFixed(0)} %, el VaR es ${dec(v)} % y el ES ${dec(es)} %: `
                            + `una diferencia de ${dec(es - v)} puntos, promediando `
                            + `${n} ${n === 1 ? 'observación' : 'observaciones'} de la cola.`;
                    }}
                    pregunta="Al llegar a α = 0,95 solo queda una observación en la cola. ¿Qué le pasa a la fiabilidad del ES estimado cuando el promedio se calcula sobre un solo dato?"
                    nota="El cuantil se calcula aquí con el mismo método (tipo 7) que np.quantile y quantile() de R: si difiriera, la gráfica contradiría al bloque de código."
                />
            </>
        );

        /* ============================================================
           SECCIÓN 3 — COMPONENTES PROPIOS DEL CURSO
        ============================================================ */
        const Seccion3 = () => (
            <>
                <Motivacion icon="fa-scale-balanced"
                    gancho="Una norma citada sin decir qué cálculo la satisface se lee como contexto decorativo, y así es como se olvida.">
                    Un analista sabe calcular el Expected Shortfall y sabe que existe el FRTB. Lo que
                    no sabe —y lo que le preguntan en la entrevista— es cuál de los dos números que
                    produjo es el que el supervisor va a pedirle, y por qué. Estos cuatro componentes
                    existen para que esa unión no quede a cargo de la memoria del estudiante.
                </Motivacion>

                <h3>Derivación paso a paso</h3>
                <Derivacion
                    titulo="Del VaR al ES bajo normalidad"
                    pasos={[
                        {
                            eq: <Eq>{'$$\\mathrm{VaR}_\\alpha = \\mu + z_\\alpha\\,\\sigma$$'}</Eq>,
                            porque: 'Bajo normalidad el cuantil de la pérdida es una transformación afín del cuantil estándar. Todo lo que sigue hereda este supuesto, que es exactamente el que el capítulo 5 se dedica a poner en duda.',
                        },
                        {
                            eq: <Eq>{'$$\\mathrm{ES}_\\alpha = \\mathbb{E}\\left[L \\mid L > \\mathrm{VaR}_\\alpha\\right]$$'}</Eq>,
                            porque: 'La definición: no es un cuantil más alto, es la media condicional de la cola. Confundir las dos cosas es el error más frecuente del dominio y el que audita el ejercicio R3 de la sección anterior.',
                        },
                        {
                            eq: <Eq>{'$$\\mathrm{ES}_\\alpha = \\mu + \\sigma\\,\\frac{\\phi(z_\\alpha)}{1-\\alpha}$$'}</Eq>,
                            porque: 'Al integrar la densidad normal por encima del cuantil aparece φ(z), la densidad evaluada en el corte, dividida por la masa que queda en la cola. El cociente φ(z)/(1−α) es siempre mayor que z, y de ahí que el ES supere siempre al VaR.',
                        },
                    ]}
                    cierre="Toda la cadena depende del primer paso. Si la distribución no es normal —y en el capítulo 1 se muestra que no lo es— la última fórmula sigue siendo aritmética correcta sobre un supuesto falso, que es la forma más difícil de detectar un error."
                />

                <h3>Fichas normativas</h3>
                <FichaNorma
                    norma="Basilea III · FRTB"
                    emisor="Comité de Supervisión Bancaria de Basilea"
                    referencia="BCBS d457 (2019)"
                    exige="Sustituir el VaR al 99 % por el Expected Shortfall al 97,5 % como medida de riesgo de mercado, calculado con horizontes de liquidez diferenciados por clase de factor de riesgo."
                    enElCapitulo="El ES estimado por los tres métodos en el capítulo 5, y su escalamiento por horizonte de liquidez de la sección 5 de ese mismo capítulo."
                    enlace="https://www.bis.org/bcbs/publ/d457.htm"
                />

                <h3>Tablas de resultados de un modelo</h3>
                <p>
                    La salida de un <span className="inline-code">arch_model</span> no es decoración:
                    es el objeto de estudio. Las cifras subrayadas traen su lectura.
                </p>
                <TablaResultados
                    titulo="GARCH(1,1) con innovaciones t de Student"
                    subtitulo="Rendimientos diarios del portafolio, 2018–2025"
                    columnas={['Parámetro', 'Estimación', 'Error estándar', 'Estadístico t']}
                    filas={[
                        { celdas: ['ω (constante)', { v: '0.0000041', lee: 'La constante fija el nivel de largo plazo. Dividida por (1 − α − β) da la varianza incondicional: es a lo que el pronóstico converge cuando el horizonte crece.' }, '0.0000012', '3.42'] },
                        { celdas: ['α (reacción)', { v: '0.089', lee: 'Cuánto pesa la sorpresa de ayer. Un α alto produce una volatilidad nerviosa, que salta con cada movimiento fuerte.' }, '0.021', '4.24'] },
                        { celdas: ['β (persistencia)', { v: '0.897', lee: 'Cuánto pesa la volatilidad de ayer. Un β alto produce memoria larga: el susto tarda semanas en disiparse.' }, '0.024', '37.4'] },
                        { celdas: ['α + β', { v: '0.986', lee: 'La persistencia total. Muy cerca de 1 significa que los choques casi no se olvidan; por encima de 1 el modelo carece de varianza de largo plazo y NO debe reportarse sin comentarlo. Ese es uno de los errores que audita el capítulo 2.' }, '—', '—'] },
                        { celdas: ['ν (grados de libertad)', { v: '5.8', lee: 'Una t con menos de 30 grados de libertad tiene colas visiblemente más pesadas que la normal. Con 5,8 el supuesto de normalidad queda descartado por los propios datos.' }, '0.9', '—'] },
                    ]}
                    nota="Los valores son ilustrativos: la plantilla no depende de datos/."
                />

                <h3>Nivel de uso de IA</h3>
                <p>
                    El syllabus se compromete con niveles declarados por instrumento. Como el material
                    de estudio no es un instrumento calificado, el nivel se declara por
                    <strong> tipo de ejercicio</strong>, que es donde la distinción tiene consecuencias:
                </p>
                <div className="grid gap-2 my-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))' }}>
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                        <NivelIA nivel={1} compacto /> <span className="text-[0.82rem] text-gray-600 ml-1">R1, R2, R3, R5, R6, R9 y el cuestionario</span>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                        <NivelIA nivel={2} compacto /> <span className="text-[0.82rem] text-gray-600 ml-1">R4 y R7</span>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white p-3">
                        <NivelIA nivel={3} compacto /> <span className="text-[0.82rem] text-gray-600 ml-1">R8 y los talleres Quarto</span>
                    </div>
                </div>
                <Box type="info" label="Por qué casi todo está en nivel 1">
                    No es rigidez. El material de estudio existe para construir el criterio que después
                    se usa <strong>con</strong> la IA en los talleres y <strong>sin</strong> ella en la
                    defensa oral. Si se delega el andamio, no queda nada sobre lo que colaborar. El caso
                    extremo es R3: pedirle a la IA que audite a la IA es circular.
                </Box>
            </>
        );

        /* ============================================================
           EVALUACIÓN Y GUÍA DE AUTORÍA
        ============================================================ */
        const EvaluacionSection = () => (
            <>
                <Motivacion icon="fa-award"
                    gancho="Si el capítulo se escribió bien, el cuestionario no enseña nada nuevo: solo confirma.">
                    El cuestionario final no es un examen. Es el punto en que el estudiante descubre,
                    a solas y sin costo, cuál de las cosas que creía entendidas no lo estaba. Cuanto
                    antes ocurra ese descubrimiento, más barato sale.
                </Motivacion>

                <Quiz titulo="Cuestionario integrador de la plantilla" preguntas={[
                    {
                        pregunta: '¿Cuál es el bloque que NUNCA se edita a mano en un capítulo?',
                        opciones: [
                            { texto: 'El delimitado por TR-CORE INICIO y TR-CORE FIN', correcta: true },
                            { texto: 'El objeto CONFIG', correcta: false },
                            { texto: 'El arreglo curriculum', correcta: false },
                        ],
                    },
                    {
                        pregunta: '¿Por qué todo bloque de código debe ir dentro de un CodeTabs?',
                        opciones: [
                            { texto: 'Porque Python y R comparten el prefijo #>, y fuera del CodeTabs nada dice con qué intérprete ejecutar la salida declarada', correcta: true },
                            { texto: 'Por consistencia visual, únicamente', correcta: false },
                            { texto: 'Porque Prism no resalta bloques sueltos', correcta: false },
                        ],
                    },
                    {
                        pregunta: '¿Qué NO se puede calcular dentro de un componente Laboratorio?',
                        opciones: [
                            { texto: 'Un GARCH ajustado por máxima verosimilitud', correcta: true },
                            { texto: 'Un cuantil empírico', correcta: false },
                            { texto: 'La recursión EWMA', correcta: false },
                            { texto: 'La fórmula cerrada de Black-Scholes', correcta: false },
                        ],
                    },
                    {
                        pregunta: 'Un bloque simula con semilla 2026 en Python y en R. ¿Qué ocurre?',
                        opciones: [
                            { texto: 'Las dos pestañas muestran cifras distintas: son generadores diferentes, y el material afirmaría dos cosas a la vez', correcta: true },
                            { texto: 'Coinciden, porque la semilla es la misma', correcta: false },
                            { texto: 'Coinciden si además se fija el número de decimales', correcta: false },
                        ],
                    },
                ]} />

                <h3>Las reglas que comprueba el verificador</h3>
                <Tabs tabs={[
                    {
                        label: 'Estructura',
                        content: (
                            <ul>
                                <li><strong>1 · Deriva.</strong> El bloque TR-CORE coincide byte a byte con la plantilla.</li>
                                <li><strong>3 · Componentes.</strong> Todo componente usado existe.</li>
                                <li><strong>5 · Motivación.</strong> Cada sección del curriculum abre con <span className="inline-code">&lt;Motivacion&gt;</span>.</li>
                                <li><strong>12 · Peso.</strong> Ningún capítulo pasa de 400 KB.</li>
                            </ul>
                        ),
                    },
                    {
                        label: 'Código',
                        content: (
                            <ul>
                                <li><strong>4 · CodeTabs.</strong> Cada bloque trae Python y R.</li>
                                <li><strong>7 · Salida.</strong> Dentro del bloque, con el prefijo <span className="inline-code">#&gt;</span>.</li>
                                <li><strong>9 · Salidas ejecutadas.</strong> Lo declarado es lo que el código produce.</li>
                            </ul>
                        ),
                    },
                    {
                        label: 'Ejercicios',
                        content: (
                            <ul>
                                <li><strong>2 · Cuota.</strong> La taxonomía R1–R9; R1, R3, R7 y R9 son obligatorios.</li>
                                <li><strong>6 · Multilingües.</strong> Si un ejercicio se presenta en varios lenguajes, los trae los dos, y <span className="inline-code">lineaCorrecta</span> va por lenguaje.</li>
                                <li><strong>8 · Texto por lenguaje.</strong> Un enunciado fijo no puede citar «la línea N».</li>
                                <li><strong>11 · Enunciados.</strong> Ningún ejercicio pide escribir un programa desde cero.</li>
                            </ul>
                        ),
                    },
                ]} />

                <CalloutPro tema="warn" titulo="El gold nunca va como texto sobre fondo claro"
                    subtitulo="1,66:1 de contraste, muy por debajo del mínimo WCAG AA">
                    <p>
                        Su lugar es la barra lateral navy y los iconos. La comprobación 10 avisa de cada
                        uso por debajo de 3,0:1 y sale como <strong>aviso</strong>, no como falla: el
                        mismo color puede ser correcto o incorrecto según lo que lo envuelva, y un
                        veredicto automático daría confianza falsa. Un uso ya revisado se calla
                        escribiendo <span className="inline-code">contraste-ok</span> con el motivo.
                    </p>
                </CalloutPro>
            </>
        );

        /* ============================================================
           CURRÍCULO
        ============================================================ */
        const curriculum = [
            { id: 'portada', title: 'Portada y objetivos', icon: 'BookOpen', component: PortadaSection },
            { id: 'sec1', title: '1. Componentes de contenido', icon: 'Layers', component: Seccion1 },
            { id: 'sec2', title: '2. Los nueve tipos de ejercicio', icon: 'Bug', component: Seccion2 },
            { id: 'sec3', title: '3. Componentes propios del curso', icon: 'Table', component: Seccion3 },
            { id: 'eval', title: 'Evaluación y guía de autoría', icon: 'Award', component: EvaluacionSection },
        ];

        /* ============================================================
           APP — barra lateral, progreso, navegación y reanudación
        ============================================================ */
        const App = () => {
            const [activeLessonIndex, setActiveLessonIndex] = useState(() => {
                const saved = parseInt(localStorage.getItem(CONFIG.storageKey), 10);
                return Number.isInteger(saved) && saved >= 0 ? saved : 0;
            });
            // La barra es hermana flex del contenido: no lo superpone, lo
            // COMPRIME. Abierta ocupa 18 rem, así que en un viewport de 375 px
            // dejaría el texto en 79 px, ilegible. Arranca abierta solo desde
            // el punto de corte `lg` de Tailwind, que es el que usa `irA` para
            // cerrarla al navegar.
            const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);

            const safeIndex = Math.min(activeLessonIndex, curriculum.length - 1);
            const activeLesson = curriculum[safeIndex];
            const ActiveComponent = activeLesson.component;
            const progreso = Math.round(((safeIndex + 1) / curriculum.length) * 100);

            useEffect(() => {
                localStorage.setItem(CONFIG.storageKey, String(safeIndex));
                typesetMath();
                const cont = document.getElementById('contenido-scroll');
                if (cont) cont.scrollTo({ top: 0, behavior: 'smooth' });
            }, [safeIndex]);

            // El `<head>` NO lo estampa `migrar.py`, así que un capítulo nacido
            // de copiar `tr-base.html` arrastra su título y su descripción sin
            // que nada avise: la pestaña del navegador dice «Plantilla base» y
            // eso es lo que ve quien tiene quince capítulos abiertos, y lo que
            // indexa GitHub Pages. Se derivan de `CONFIG`, que sí es lo primero
            // que cambia todo capítulo, para que ninguno pueda olvidarlo.
            useEffect(() => {
                document.title = `Cap. ${CONFIG.numero} · ${CONFIG.titulo} — Teoría del Riesgo`;
                const meta = document.querySelector('meta[name="description"]');
                if (meta) meta.setAttribute('content',
                    `${CONFIG.titulo}. ${CONFIG.subtitulo} · ${CONFIG.unidad} · `
                    + `Teoría del Riesgo, Universidad Santo Tomás.`);
            }, []);

            const irA = (idx) => {
                setActiveLessonIndex(idx);
                if (window.innerWidth < 1024) setSidebarOpen(false);
            };

            return (
                <div className="flex h-screen overflow-hidden relative">
                    <button onClick={() => setSidebarOpen(p => !p)}
                        className="fixed top-4 left-4 z-50 p-2.5 rounded-full shadow-lg text-white transition-all hover:scale-110 tr-gradient"
                        title={sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'} aria-label={sidebarOpen ? 'Ocultar menú' : 'Mostrar menú'}>
                        <i className={`fas ${sidebarOpen ? 'fa-times' : 'fa-bars'} text-sm`}></i>
                    </button>

                    {sidebarOpen && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

                    <aside className="flex-shrink-0 overflow-y-auto z-40 flex flex-col tr-header"
                        style={{
                            width: sidebarOpen ? '18rem' : '0', minWidth: sidebarOpen ? '18rem' : '0',
                            opacity: sidebarOpen ? 1 : 0, transition: 'width 0.3s ease, min-width 0.3s ease, opacity 0.25s ease',
                            overflow: sidebarOpen ? 'visible auto' : 'hidden'
                        }}>
                        <div className="p-6 pt-16 border-b border-white/10">
                            {/* contraste-ok: el gold va sobre el navy de `tr-header`, no sobre el fondo claro */}
                            <p className="text-[0.65rem] uppercase tracking-widest text-gold font-bold">Universidad Santo Tomás</p>
                            <h1 className="text-white font-bold text-lg tracking-tight mt-1">
                                Teoría del Riesgo
                            </h1>
                            <p className="text-xs text-white/60 mt-1">
                                Capítulo {CONFIG.numero} · <span className="text-secondary font-semibold">{CONFIG.titulo}</span>
                            </p>
                        </div>

                        <nav className="p-4 space-y-2 flex-1">
                            {curriculum.map((lesson, idx) => (
                                <button key={lesson.id} onClick={() => irA(idx)}
                                    className={`w-full flex items-start gap-3 px-3 py-3 text-sm rounded-lg transition-all text-left ${safeIndex === idx ? 'text-white shadow-lg tr-gradient' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
                                    <span className="flex-shrink-0 mt-0.5" style={{ width: 18, height: 18 }}>{renderIcon(lesson.icon, 18)}</span>
                                    <span className="font-medium leading-tight break-words">{lesson.title}</span>
                                </button>
                            ))}
                        </nav>

                        <div className="p-4 text-[10px] text-white/40 border-t border-white/10">
                            <p>{CONFIG.unidad}</p>
                            <p>{CONFIG.ra} · {CONFIG.horas} horas</p>
                            <p>Python · R</p>
                        </div>
                    </aside>

                    <main className="flex-1 flex flex-col overflow-hidden bg-bg">
                        <div className="h-1.5 bg-gray-200 flex-shrink-0">
                            <div className="h-full tr-gradient transition-all duration-500" style={{ width: `${progreso}%` }}></div>
                        </div>

                        <div id="contenido-scroll" className="flex-1 overflow-y-auto p-6 lg:p-12">
                            <div className="max-w-4xl mx-auto w-full">
                                <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                                    <span className="text-xs font-bold tracking-wider text-secondary uppercase">
                                        Lección {safeIndex + 1} de {curriculum.length} · {progreso} %
                                    </span>
                                    <div className="flex gap-2">
                                        <button disabled={safeIndex === 0} onClick={() => setActiveLessonIndex(c => c - 1)}
                                            className="flex items-center gap-1 px-3 py-2 rounded-full hover:bg-gray-100 disabled:opacity-30 transition-colors text-sm font-medium text-navy">
                                            {renderIcon('ChevronLeft', 18)} Anterior
                                        </button>
                                        <button disabled={safeIndex === curriculum.length - 1} onClick={() => setActiveLessonIndex(c => c + 1)}
                                            className="flex items-center gap-1 px-3 py-2 rounded-full text-white tr-gradient disabled:opacity-30 transition-colors text-sm font-medium">
                                            Siguiente {renderIcon('ChevronRight', 18)}
                                        </button>
                                    </div>
                                </div>

                                <SectionHeader title={activeLesson.title} icon={Icons[activeLesson.icon]} />

                                {safeIndex === 0 && (
                                    <div className="mb-8 text-center bg-white p-7 rounded-2xl shadow-sm border border-gray-100">
                                        <p className="text-xs uppercase tracking-widest text-secondary font-bold mb-2">
                                            Capítulo {CONFIG.numero} · {CONFIG.horas} horas · {CONFIG.ra}
                                        </p>
                                        <h1 className="text-2xl font-bold text-primary mb-2">{CONFIG.titulo}</h1>
                                        <p className="text-gray-600 font-light">{CONFIG.subtitulo}</p>
                                        <div className="flex justify-center flex-wrap gap-2 mt-4 text-xs">
                                            {CONFIG.temas.map(t => (
                                                <span key={t} className="px-3 py-1 rounded-full bg-primary/10 text-primary">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="prose-tr animate-fade-in" key={activeLesson.id}>
                                    <ActiveComponent />
                                </div>

                                <div className="mt-12 flex items-center justify-between gap-3">
                                    <button disabled={safeIndex === 0} onClick={() => setActiveLessonIndex(c => c - 1)}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-30 text-sm font-medium text-navy">
                                        {renderIcon('ChevronLeft', 18)}
                                        <span className="hidden sm:inline">{safeIndex > 0 ? curriculum[safeIndex - 1].title : 'Inicio'}</span>
                                        <span className="sm:hidden">Anterior</span>
                                    </button>
                                    <button disabled={safeIndex === curriculum.length - 1} onClick={() => setActiveLessonIndex(c => c + 1)}
                                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white tr-gradient hover:opacity-90 disabled:opacity-30 text-sm font-medium">
                                        <span className="hidden sm:inline">{safeIndex < curriculum.length - 1 ? curriculum[safeIndex + 1].title : 'Fin'}</span>
                                        <span className="sm:hidden">Siguiente</span>
                                        {renderIcon('ChevronRight', 18)}
                                    </button>
                                </div>

                                <footer className="mt-16 pt-8 border-t border-gray-200">
                                    <div className="tr-header rounded-xl p-6 text-center">
                                        <p className="text-white font-medium text-sm">
                                            <strong>Capítulo {CONFIG.numero} · {CONFIG.titulo}</strong>
                                        </p>
                                        <p className="text-xs mt-1 text-white/80 italic">
                                            Medir es fácil; defender el supuesto es el oficio.
                                        </p>
                                        <p className="text-xs mt-2 text-white/70">
                                            Universidad Santo Tomás · Teoría del Riesgo
                                        </p>
                                        <p className="text-xs text-white/70">
                                            Docente y diseño del material: {CONFIG.docente}
                                        </p>
                                        <p className="text-[10px] mt-2 text-white/50">
                                            Material de aprendizaje autónomo. Casos contextualizados al mercado financiero colombiano.
                                        </p>
                                    </div>
                                </footer>
                            </div>
                        </div>
                    </main>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
