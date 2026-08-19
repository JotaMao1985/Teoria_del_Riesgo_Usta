/* ============================================================================
   CONTENIDO DEL TALLER DE LA UNIDAD 1
   Se ensambla con `armar_taller.py`. Las cifras salen de `D`, que el
   constructor genera desde el congelador: **ninguna se escribe aquí a mano**.
============================================================================ */

const CONFIG = {
    numero: 'T1',
    titulo: 'La mesa de riesgos',
    subtitulo: 'Taller calificado de la unidad 1 · leer, interpretar y auditar un informe que ya está hecho',
    unidad: 'U1 · Riesgo de mercado',
    horas: 5,
    ra: 'RA1 · RA2 · RA3',
    docente: 'Javier Mauricio Sierra',
    storageKey: 'tdr_u1t_seccion',
};

/* Lo que `Entrega` comprueba. Cada id tiene que existir como componente y tener
   entrada en la clave: es la regla 7 del verificador. */
const INVENTARIO = [
    { id: 'P0.1', tipo: 'abierta', bloque: 0, peso: 3 },
    { id: 'P0.2', tipo: 'abierta', bloque: 0, peso: 2 },
    { id: 'P1.1', tipo: 'abierta', bloque: 1, peso: 4 },
    { id: 'P1.2', tipo: 'abierta', bloque: 1, peso: 4 },
    { id: 'P1.3', tipo: 'abierta', bloque: 1, peso: 4 },
    { id: 'P1.4', tipo: 'abierta', bloque: 1, peso: 4 },
    { id: 'P1.5', tipo: 'abierta', bloque: 1, peso: 3 },
    { id: 'P1.6', tipo: 'abierta', bloque: 1, peso: 3 },
    { id: 'P2.1', tipo: 'abierta', bloque: 2, peso: 5 },
    { id: 'P2.2', tipo: 'abierta', bloque: 2, peso: 5 },
    { id: 'P2.3', tipo: 'abierta', bloque: 2, peso: 3 },
    { id: 'P3.1', tipo: 'barrido', bloque: 3, peso: 5 },
    { id: 'P3.2', tipo: 'barrido', bloque: 3, peso: 4 },
    { id: 'P3.3', tipo: 'barrido', bloque: 3, peso: 4 },
    { id: 'P4.1', tipo: 'abierta', bloque: 4, peso: 9 },
    { id: 'P4.2', tipo: 'abierta', bloque: 4, peso: 3 },
    { id: 'P4.3', tipo: 'abierta', bloque: 4, peso: 3 },
    { id: 'P5.1', tipo: 'abierta', bloque: 5, peso: 7 },
    { id: 'P5.2', tipo: 'abierta', bloque: 5, peso: 7 },
    { id: 'P5.3', tipo: 'abierta', bloque: 5, peso: 6 },
    { id: 'P6.1', tipo: 'abierta', bloque: 6, peso: 6 },
    { id: 'P6.2', tipo: 'abierta', bloque: 6, peso: 2 },
    { id: 'P7.1', tipo: 'abierta', bloque: 7, peso: 4 },
];

/* ---------------------------------------------------------------- utilidades
   `cuantil` es el mismo de los capítulos 4, 5 y 6 —interpolación lineal, el
   tipo 7 de R y el `linear` de numpy—, para que lo que el navegador calcula
   coincida con lo que el congelador declaró. */
const cuantil = (xs, p) => {
    const s = [...xs].sort((a, b) => a - b);
    const h = (s.length - 1) * p;
    const lo = Math.floor(h), hi = Math.ceil(h);
    return s[lo] + (h - lo) * (s[hi] - s[lo]);
};
const media = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const desv = (xs) => {
    const m = media(xs);
    return Math.sqrt(xs.reduce((a, b) => a + (b - m) * (b - m), 0) / (xs.length - 1));
};
const dec = (x, n = 2) => Number(x).toFixed(n).replace('.', ',');
const miles = (x) => Math.round(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const PERDIDAS = D.rp.map(x => -x);          // pérdidas del portafolio, en %

/* Pérdidas del emisor que le tocó al estudiante, en %, con el mismo signo y la
   misma escala que `PERDIDAS`.

   ⚠️ P1.4 y P3.1 corren sobre ESTA serie y no sobre el portafolio, y el motivo
   es de fuga, medido y no supuesto: el laboratorio R9 del capítulo 6 —que está
   publicado— permite mover la ventana de 100 a 500 en pasos de 25 (las tres del
   eje) y el nivel de 0,950 a 0,995 (el rango entero que P3.1 manda barrer), e
   imprime LR_uc, LR_ind y LR_cc con sus p y su veredicto. Su propio enunciado
   llega a narrar el resultado del barrido. Sobre el PORTAFOLIO, las dos
   preguntas se responden sin abrir el taller. Sobre el emisor no hay nada
   publicado, y vuelven a ser del estudiante.

   Y el hallazgo mejora al cambiar de serie: sobre el portafolio la
   independencia se rechaza en los treinta pares de ventana y nivel, o sea que
   la respuesta es la misma para todos; sobre el emisor va de ninguno a los diez
   niveles según a quién le toque. */
const perdidasEmisor = (col) => D.emisor[col].serie.map(x => -x);

const sigmaMovil = (r, V) => r.map((_, i) => (i < V - 1 ? null : desv(r.slice(i - V + 1, i + 1))));

const ewma = (r, lam) => {
    const v = new Array(r.length);
    v[0] = desv(r.slice(0, 250)) ** 2;
    for (let t = 1; t < r.length; t++) v[t] = lam * v[t - 1] + (1 - lam) * r[t - 1] * r[t - 1];
    return v.map(Math.sqrt);
};

const varRodante = (L, V, alfa) => {
    const out = [];
    for (let k = 0; k + V < L.length; k++) out.push(cuantil(L.slice(k, k + V), alfa));
    return out;
};

const PALETA = { primario: '#3D008D', secundario: '#ED1E79', agua: '#0E7490', gris: '#94A3B8' };
const EJES = (extra = {}) => ({
    /* `l: 64` y no 52: con 52 el rótulo del eje vertical se corta —«ensidad»—,
       y no hay ningún error en consola que lo diga. Se vio mirando. */
    margin: { l: 64, r: 16, t: 12, b: 48 },
    paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter, system-ui, sans-serif', size: 11 },
    separators: ',.',
    ...extra,
});

/* ============================================================================
   BLOQUE 0 · La escena y la declaración previa
============================================================================ */
const Bloque0 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    return (
        <div>
            <SectionHeader title="Bloque 0 · Lo que hay sobre su escritorio" />

            <Motivacion icon="fa-briefcase"
                gancho="Nadie le está pidiendo que calcule nada. Le están pidiendo que diga si se firma.">
                Su primer lunes en la vicepresidencia de riesgos. Sobre el escritorio está el
                informe trimestral que la mesa de mercado ya produjo, con sus cifras, sus gráficas
                y su recomendación al comité. La vicepresidenta se lo deja encima y dice una sola
                frase: «dígame si esto se puede firmar». El comité se reúne en una semana.
            </Motivacion>

            <p>
                El fondo tiene <strong>{miles(800000)} millones</strong> repartidos entre cuatro
                emisores de la Bolsa de Valores de Colombia, con los pesos que el curso declaró en
                el capítulo 1: 30 % Ecopetrol, 20 % Banco de Bogotá, 25 % Grupo Sura y 25 % ISA.
                El panel va de {D.panel.desde} a {D.panel.hasta} y trae{' '}
                <strong>{miles(D.panel.sesiones)} ruedas</strong>.
            </p>

            <CalloutPro tema="warn" titulo="Este taller no le pide calcular nada"
                subtitulo="Y eso no lo hace más fácil">
                <p style={{ margin: 0 }}>
                    Todos los números están calculados y todas las gráficas están pintadas. Lo que
                    se califica es lo que usted <strong>dice</strong> sobre ellos: qué muestra una
                    gráfica y qué no, qué procedimiento produjo un resultado, qué decisión cambia
                    con qué cifra y cuánto cuesta en pesos equivocarse. Un modelo de lenguaje
                    escribe código excelente y lee resultados muy mal. Esa es la apuesta del
                    instrumento.
                </p>
            </CalloutPro>

            <h3>Las reglas, y una que conviene leer dos veces</h3>

            <NivelIA nivel={3} nota="Con bitácora obligatoria, salvo los bloques 2, 3 y 4, que son de nivel 1 · No AI." />

            <Accordion items={[
                {
                    titulo: 'Qué puntúa y qué no',
                    contenido: <>
                        Puntúan las <strong>respuestas escritas</strong>. Los ejercicios que se
                        califican solos —los que traen botón de «Comprobar»— <strong>valen
                        cero</strong>: llevan la respuesta dentro del archivo y cualquiera puede
                        verla en el fuente. Están para que compruebe que entendió antes de
                        escribir. <strong>El número de intentos de cada uno queda registrado en su
                        entrega</strong>, y la sustentación lo mira. Se lo decimos ahora, que es
                        cuando corresponde decirlo.
                    </>,
                },
                {
                    titulo: 'Dónde están las respuestas',
                    contenido: <>
                        No en este archivo. Están en los seis capítulos de la unidad, en los
                        laboratorios que hay que mover, y en lo que usted decida. Un modelo al que
                        le pegue este taller le contestará el manual —y el manual, aquí, está mal
                        en por lo menos tres sitios—.
                    </>,
                },
                {
                    titulo: 'Su taller no es el de al lado',
                    contenido: <>
                        De su documento salen la <strong>ventana de estimación</strong> y el{' '}
                        <strong>emisor bajo examen</strong>. Las gráficas y las cifras cambian con
                        ellos. Comparar el procedimiento con un compañero es buena idea; copiar la
                        cifra, no, porque no es la suya.
                    </>,
                },
                {
                    titulo: 'La entrega',
                    contenido: <>
                        El último bloque genera un archivo con todo lo que escribió y un código de
                        verificación. <strong>Descárguelo al terminar cada bloque</strong>, no solo
                        al final. Y la sustentación oral de diez minutos se hace sobre lo que
                        entregó, incluidas las tres preguntas que usted mismo escriba en el bloque 6.
                    </>,
                },
            ]} />

            <h3>Antes de mirar nada</h3>

            <Andamio id="A0" nota="Ancla la convención con la que está construido todo lo demás. No puntúa.">
                <TablaTraza
                    titulo="A0 · De cinco rendimientos a un acumulado"
                    enunciado={<>Estos son los cinco rendimientos logarítmicos de las primeras seis
                        ruedas de Ecopetrol, en porcentaje y tal como el capítulo 1 los publica:{' '}
                        <strong>3.9436 · 0.0000 · 6.1446 · 2.1979 · −0.7937</strong>. Complete las
                        tres casillas <strong>con los valores que ve</strong>, no con el CSV.</>}
                    codigo={{
                        python: `r = [3.9436, 0.0000, 6.1446, 2.1979, -0.7937]   # en %

suma       = sum(r)
acumulado  = (math.exp(suma / 100) - 1) * 100
comprueba  = (1004 / 895 - 1) * 100              # solo el primer y el último precio`,
                        r: `r <- c(3.9436, 0.0000, 6.1446, 2.1979, -0.7937)   # en %

suma      <- sum(r)
acumulado <- (exp(suma / 100) - 1) * 100
comprueba <- (1004 / 895 - 1) * 100              # solo el primer y el último precio`,
                    }}
                    columnas={[
                        { clave: 'paso', titulo: 'Paso' },
                        { clave: 'instruccion', titulo: 'Qué se calcula' },
                        { clave: 'valor', titulo: 'Valor (%)' },
                    ]}
                    filas={[
                        { paso: '1', instruccion: 'suma de los cinco rendimientos', valor: '11.4924' },
                        { paso: '2', instruccion: 'acumulado = (exp(suma/100) − 1) × 100', valor: '12.1788' },
                        { paso: '3', instruccion: 'comprobación: (1004 / 895 − 1) × 100', valor: '12.1788' },
                    ]}
                    ocultas={['valor']}
                    pista="Los pasos 2 y 3 tienen que coincidir, y ahí está el punto: el 3 no usa ningún rendimiento, solo el primer precio y el último. Que coincidan es la propiedad que hace útil el logarítmico, y es la misma que el capítulo 1 mide cuando se pasa de un activo a un portafolio: allí deja de cumplirse."
                />
            </Andamio>

            <RespuestaAbierta id="P0.1" etiqueta="P0.1 · Su declaración previa"
                minPalabras={80} filas={7}
                enunciado={<>
                    <p style={{ marginTop: 0 }}>
                        Antes de ver una sola gráfica de este taller, y con lo que sabe de la unidad,
                        declare por escrito <strong>qué recomendaría usted</strong> si tuviera que
                        decidirlo hoy. Cinco cosas, cada una con una línea de porqué:
                    </p>
                    <ol className="text-[0.92rem] text-gray-700" style={{ paddingLeft: '1.2rem' }}>
                        <li>La medida con la que reportaría el riesgo de mercado del fondo.</li>
                        <li>El nivel de confianza.</li>
                        <li>El método de estimación.</li>
                        <li>La prueba con la que la validaría, y con qué significancia.</li>
                        <li>Qué haría con las dos anomalías declaradas del panel.</li>
                    </ol>
                    <p style={{ marginBottom: 0 }}>
                        <strong>Todo lo que siga se juzga contra esto.</strong> Si al final cambia de
                        opinión, eso no es un problema: es un hallazgo, y se califica mejor que
                        acertar de entrada sin evidencia. Lo que no se acepta es volver aquí a
                        reescribirlo — y el archivo de entrega registra cuándo se escribió cada cosa.
                    </p>
                </>}
                ayuda="Cinco decisiones, cinco porqués. No hace falta que sean largas: hace falta que sean suyas." />

            <RespuestaAbierta id="P0.2" etiqueta="P0.2 · Qué espera ver"
                minPalabras={40} filas={4}
                enunciado={<>
                    En el bloque 1 va a ver el histograma de los rendimientos diarios del portafolio
                    con una normal ajustada encima. <strong>Antes de verlo</strong>, escriba qué
                    espera: ¿dónde se van a separar las dos curvas, en qué dirección, y qué cifra
                    del capítulo 1 sostiene su expectativa? Con la ventana de {ejes.ventana} ruedas
                    y {ejes.emisorRotulo} bajo examen, esta pregunta no depende de ninguno de los
                    dos: depende de lo que usted crea sobre la forma de la distribución.
                </>}
                ayuda="Se califica la predicción, acierte o no. En P1.6 va a tener que volver sobre ella." />
        </div>
    );
};

/* ============================================================================
   BLOQUE 1 · Lectura de gráficas
============================================================================ */
const GraficaHistograma = () => {
    usePlotly('g-hist',
        () => ([
            {
                x: D.rp, type: 'histogram', histnorm: 'probability density',
                name: 'Rendimientos observados', marker: { color: PALETA.primario, opacity: 0.55 },
                xbins: { start: -10, end: 10, size: 0.25 },
            },
            {
                x: D.densidad_normal.x, y: D.densidad_normal.y, type: 'scatter', mode: 'lines',
                name: 'Normal ajustada', line: { color: PALETA.secundario, width: 2 },
            },
        ]),
        () => EJES({
            xaxis: { title: 'Rendimiento diario del portafolio (%)', range: [-8, 8], zeroline: false },
            yaxis: { title: 'Densidad' },
            legend: { orientation: 'h', y: 1.12 },
        }), []);
    return <ChartFrame id="g-hist" height="chart-h-360"
        caption={`${miles(D.panel.sesiones)} ruedas · media ${dec(D.momentos.media, 4)} % y desviación ${dec(D.momentos.sigma, 4)} % · la normal se ajusta con esos dos momentos y nada más`} />;
};

const GraficaQQ = () => {
    usePlotly('g-qq',
        () => {
            const t = D.qq.teorico, m = D.qq.muestral;
            const s = D.momentos.sigma, mu = D.momentos.media;
            return [
                {
                    x: t, y: m, type: 'scattergl', mode: 'markers', name: 'Ruedas',
                    marker: { color: PALETA.primario, size: 4, opacity: 0.6 },
                },
                {
                    x: [-4, 4], y: [mu - 4 * s, mu + 4 * s], type: 'scatter', mode: 'lines',
                    name: 'Si fueran normales', line: { color: PALETA.secundario, width: 2, dash: 'dash' },
                },
            ];
        },
        () => EJES({
            xaxis: { title: 'Cuantil teórico de la normal' },
            yaxis: { title: 'Cuantil observado (%)' },
            legend: { orientation: 'h', y: 1.12 },
        }), []);
    return <ChartFrame id="g-qq" height="chart-h-360"
        caption="Cada punto es una rueda. Si la normal fuera cierta, todos caerían sobre la línea." />;
};

const GraficaVolatilidad = ({ V }) => {
    usePlotly('g-vol',
        () => {
            const r = D.rp;
            const sm = sigmaMovil(r, V);
            const ew = ewma(r, 0.94);
            const x = D.fechas;
            return [
                {
                    x, y: r.map(Math.abs), type: 'scattergl', mode: 'lines', name: '|rendimiento|',
                    line: { color: PALETA.gris, width: 0.7 },
                },
                {
                    x, y: sm, type: 'scatter', mode: 'lines', name: `σ móvil de ${V} ruedas`,
                    line: { color: PALETA.primario, width: 2 },
                },
                {
                    x, y: ew, type: 'scatter', mode: 'lines', name: 'σ EWMA (λ = 0,94)',
                    line: { color: PALETA.secundario, width: 1.6 },
                },
            ];
        },
        () => EJES({
            xaxis: { title: 'Fecha' }, yaxis: { title: 'Porcentaje diario', range: [0, 8] },
            legend: { orientation: 'h', y: 1.12 },
        }), [V]);
    return <ChartFrame id="g-vol" height="chart-h-400"
        caption={`Su ventana es de ${V} ruedas. El EWMA va con el λ de RiskMetrics, 0,94, que es el del capítulo 2.`} />;
};

const GraficaDispersion = ({ emisor }) => {
    const e = D.emisor[emisor];
    usePlotly('g-disp',
        () => {
            const x = D.mercado, y = e.serie;
            const b = e.beta_diaria.beta, a = e.beta_diaria.alfa;
            const xs = [-12, 12];
            return [
                {
                    x, y, type: 'scattergl', mode: 'markers', name: e.rotulo,
                    marker: { color: PALETA.agua, size: 4, opacity: 0.5 },
                },
                {
                    x: xs, y: xs.map(v => a + b * v), type: 'scatter', mode: 'lines',
                    name: `recta ajustada (β = ${dec(b, 4)})`,
                    line: { color: PALETA.secundario, width: 2 },
                },
            ];
        },
        () => EJES({
            xaxis: { title: 'Rendimiento del mercado, ETF ICOLCAP (%)', range: [-9, 9] },
            yaxis: { title: `Rendimiento de ${e.rotulo} (%)`, range: [-14, 14] },
            legend: { orientation: 'h', y: 1.12 },
        }), [emisor]);
    return <ChartFrame id="g-disp" height="chart-h-400"
        caption={`${miles(D.panel.sesiones)} ruedas · β = ${dec(e.beta_diaria.beta, 4)} con error estándar ${dec(e.beta_diaria.ee_beta, 4)} · R² = ${dec(e.beta_diaria.r2, 4)}`} />;
};

const GraficaExcepciones = ({ V, emisor }) => {
    const L = perdidasEmisor(emisor);
    usePlotly('g-exc',
        () => {
            const varr = varRodante(L, V, 0.99);
            const Lt = L.slice(V);
            const x = D.fechas.slice(V);
            const exX = [], exY = [];
            for (let i = 0; i < varr.length; i++) {
                if (Lt[i] > varr[i]) { exX.push(x[i]); exY.push(Lt[i]); }
            }
            return [
                {
                    x, y: Lt, type: 'scattergl', mode: 'lines', name: 'Pérdida del día',
                    line: { color: PALETA.gris, width: 0.8 },
                },
                {
                    x, y: varr, type: 'scatter', mode: 'lines', name: `VaR 99 % con ${V} ruedas`,
                    line: { color: PALETA.primario, width: 2 },
                },
                {
                    x: exX, y: exY, type: 'scatter', mode: 'markers', name: 'Excepciones',
                    marker: { color: PALETA.secundario, size: 7, symbol: 'x' },
                },
            ];
        },
        () => EJES({
            xaxis: { title: 'Fecha' }, yaxis: { title: 'Pérdida diaria (%)' },
            legend: { orientation: 'h', y: 1.12 },
        }), [V, emisor]);
    return <ChartFrame id="g-exc" height="chart-h-400"
        caption={`Pérdidas diarias de ${D.emisor[emisor].rotulo}, no del portafolio. La línea morada es el VaR reestimado rueda a rueda con las ruedas anteriores, nunca con la muestra completa. Las equis son los días en que la pérdida lo superó.`} />;
};

const Bloque1 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const V = ejes.ventana;
    const e = D.emisor[ejes.emisor];
    const bt = D.ventana[String(V)];
    /* El backtest del EMISOR, calculado aquí y no leído de `D`: las cifras por
       emisor son la clave de P1.4 y de P3.1, y por eso no viajan dentro del
       archivo —la lista blanca de `armar_taller.py` las deja fuera—. El
       navegador las produce desde la serie, que sí viaja porque la gráfica la
       necesita. Es la misma función que usa el laboratorio del bloque 3, de
       modo que las dos secciones no pueden discrepar. */
    const btE = pruebasBacktest(perdidasEmisor(ejes.emisor), V, 0.99);

    return (
        <div>
            <SectionHeader title="Bloque 1 · Lo que el informe muestra, y lo que no" />

            <Motivacion icon="fa-chart-line"
                gancho="¿Qué va a creer que dice cada gráfica el director que la mire treinta segundos antes de votar?">
                El informe de la mesa trae cinco gráficas. Están bien hechas: los datos son los del
                panel congelado y los cálculos son correctos. La pregunta de este bloque no es si
                están bien, sino <strong>qué dice cada una</strong> — y qué no dice.
            </Motivacion>

            <h3>1 · La distribución de los rendimientos</h3>

            <GraficaHistograma />

            <Andamio id="A1a" nota="Antes de escribir P1.1, compruebe que no está leyendo la gráfica sobre un concepto equivocado.">
                <MCQ pregunta="¿Qué compara exactamente un QQ-plot?"
                    opciones={[
                        { texto: 'Los cuantiles observados con los que tendría una normal con la misma media y desviación', correcta: true, justificacion: 'Por eso una nube que se curva en los extremos y se pega a la recta en el centro dice que el problema está en las colas y no en el cuerpo — que es justo lo que el histograma no deja ver, porque en la cola hay poquísimas ruedas y la barra es invisible.' },
                        { texto: 'La densidad observada con la densidad normal, punto a punto' },
                        { texto: 'La media y la varianza de la muestra con las de la normal' },
                        { texto: 'La frecuencia de cada intervalo con la que predice el modelo' },
                    ]} />
            </Andamio>

            <GraficaQQ />

            <RespuestaAbierta id="P1.1" etiqueta="P1.1 · Dos gráficas, los mismos datos"
                minPalabras={70}
                enunciado={<>
                    Las dos gráficas de arriba están hechas con las mismas {miles(D.panel.sesiones)}{' '}
                    ruedas y con la misma normal ajustada. <strong>Diga qué muestra el QQ-plot que el
                    histograma no muestra</strong>, y por qué el histograma no puede mostrarlo por
                    mucho que se le mire. Termine con una frase que un miembro del comité, sin
                    estadística, entienda: ¿qué le pasa a este fondo que la normal no ve?
                </>} />

            <h3>2 · La volatilidad, con su ventana</h3>

            <Andamio id="A1b" nota="Un concepto del capítulo 2 que hace falta para la siguiente pregunta.">
                <MCQ pregunta="El «efecto fantasma» de una ventana móvil es…"
                    opciones={[
                        { texto: 'Un salto de la volatilidad estimada el día en que una observación extrema sale de la ventana', correcta: true, justificacion: 'El salto no lo produce nada que pase ese día en el mercado: lo produce el calendario del estimador. Con una ventana de 250 ruedas, un desplome deja su huella durante 250 días y desaparece de golpe al día 251. El EWMA no lo tiene porque no descarta nada: pondera.' },
                        { texto: 'La tendencia de la volatilidad a agruparse en periodos' },
                        { texto: 'El sesgo que aparece al estimar con pocas observaciones' },
                        { texto: 'La diferencia entre la volatilidad implícita y la histórica' },
                    ]} />
            </Andamio>

            <GraficaVolatilidad V={V} />

            <RespuestaAbierta id="P1.2" etiqueta="P1.2 · El escalón que no explica ningún hecho del mercado"
                minPalabras={70}
                enunciado={<>
                    En <strong>su</strong> gráfica —ventana de {V} ruedas— busque un punto en que la
                    línea morada cae de golpe sin que la serie gris de abajo haya cambiado de
                    régimen. <strong>Diga la fecha aproximada</strong>, explique qué lo produce, y
                    diga por qué la línea rosa no lo tiene. Y remate: si el informe reporta la
                    volatilidad de la línea morada el día antes y el día después de ese escalón,
                    ¿qué le está diciendo al comité que no es cierto?
                </>}
                ayuda={`Pista de método: el escalón cae ${V} ruedas después de un episodio, no durante. Con su ventana, mire qué pasó ${V} ruedas antes.`} />

            <h3>3 · Su emisor contra el mercado</h3>

            <GraficaDispersion emisor={ejes.emisor} />

            <RespuestaAbierta id="P1.3" etiqueta="P1.3 · Una beta y un R² que dicen cosas distintas"
                minPalabras={70}
                enunciado={<>
                    La regresión de {e.rotulo} contra el ETF ICOLCAP da β = <strong>{dec(e.beta_diaria.beta, 4)}</strong>{' '}
                    con error estándar {dec(e.beta_diaria.ee_beta, 4)}, y R² = <strong>{dec(e.beta_diaria.r2, 4)}</strong>.
                    Diga <strong>qué mide cada uno de los dos números</strong> y por qué un R² de{' '}
                    {dec(e.beta_diaria.r2, 4)} <em>no</em> significa que el modelo no sirva. Después:
                    con esa β y ese R², ¿qué parte del riesgo de esta posición se puede cubrir
                    vendiendo el índice y qué parte no?
                </>} />

            <h3>4 · El VaR rodante de su emisor, y sus excepciones</h3>

            <GraficaExcepciones V={V} emisor={ejes.emisor} />

            <p>
                Esta gráfica <strong>no es la del portafolio</strong>: es la de {e.rotulo}, su
                emisor. Con su ventana de {V} ruedas, el VaR al 99 % se rompió{' '}
                <strong>{btE.N} veces</strong> en {miles(btE.T)} ruedas de prueba —una tasa del{' '}
                {dec((btE.N / btE.T) * 100, 2)} % donde se esperaba el 1 %—. Las fechas están en
                el eje.
            </p>

            <RespuestaAbierta id="P1.4" etiqueta="P1.4 · Cómo se reparten las excepciones de su emisor"
                minPalabras={70}
                enunciado={<>
                    Mire <strong>cuándo</strong> ocurren las {btE.N} excepciones de {e.rotulo}, no
                    cuántas son. Describa el reparto en el tiempo con lo que ve en la gráfica —si
                    se apiñan en episodios o si están repartidas, y en qué años—. Después diga cuál
                    de las pruebas que conoce ve ese reparto y cuál no lo ve en absoluto, y
                    <strong> por qué la que no lo ve puede dar por bueno un modelo que falla nueve
                    días seguidos</strong>.
                </>}
                ayuda={`Pista de método: cuente las excepciones por año antes de describirlas. «Se agrupan» y «están repartidas» son afirmaciones sobre un reparto, y un reparto se cuenta.`} />

            <RespuestaAbierta id="P1.5" etiqueta="P1.5 · Tres cosas que esta gráfica no muestra"
                minPalabras={60}
                enunciado={<>
                    Un director del comité mira la gráfica de arriba y dice: «entonces ya sabemos
                    cuánto podemos perder». Escriba <strong>tres cosas concretas que la gráfica no
                    muestra</strong> y que él está suponiendo que sí. Para cada una, una línea con la
                    consecuencia de suponerla.
                </>}
                ayuda="No valen respuestas genéricas del tipo «no muestra el futuro». Cada una tiene que ser algo que este gráfico, con estos ejes y estos datos, deja fuera." />

            <RespuestaAbierta id="P1.6" etiqueta="P1.6 · Vuelva a su P0.2"
                minPalabras={50}
                enunciado={<>
                    Relea lo que escribió en P0.2 antes de ver nada. ¿Acertó? Diga qué parte sí y qué
                    parte no, y <strong>cuál es la cifra concreta de este bloque</strong> que le
                    cambió o le confirmó la idea. Si no le cambió nada, dígalo y explique por qué las
                    cuatro gráficas no le añadieron información — es una respuesta válida y hay que
                    poder defenderla.
                </>} />
        </div>
    );
};

/* ============================================================================
   BLOQUE 2 · Procedimientos y dependencias
============================================================================ */
const Bloque2 = () => {
    const { datos } = usePersistencia();
    const V = datos.ejes.ventana;
    const bt = D.ventana[String(V)];
    const dm = bt.dentro_de_muestra;

    return (
        <div>
            <SectionHeader title="Bloque 2 · Cómo se produjo ese número" />

            <Motivacion icon="fa-list-ol"
                gancho="Dos analistas con los mismos datos y el mismo modelo pueden entregar veredictos contrarios. La diferencia está en el orden.">
                El anexo metodológico del informe ocupa media página y nadie lo lee. Ahí está,
                sin embargo, todo lo que decide si el número de la portada significa algo: qué se
                fijó antes de calcular, qué se calculó con qué información y qué se decidió después
                de ver los resultados.
            </Motivacion>

            <NivelIA nivel={1}
                nota="Este bloque es de nivel 1 · No AI. Las dependencias metodológicas son el contenido: delegarlas es no responder." />

            <h3>1 · El ciclo completo, en orden</h3>

            <Andamio id="A2" nota="Ordénelo primero aquí. La pregunta que puntúa viene después y se apoya en este orden.">
                <OrdenaPasos
                    titulo="A2 · De un panel de precios a una recomendación firmada"
                    enunciado="Siete pasos del ciclo que produjo el informe. Uno solo de los órdenes posibles es defendible, y cada paso dice de cuál depende."
                    pasos={[
                        'Congelar el panel de precios y declarar por escrito sus defectos —las ruedas sin variación y la cotización defectuosa— antes de calcular ningún rendimiento',
                        'Construir sobre ese panel ya congelado la serie de rendimientos del portafolio con los pesos del fondo',
                        'Fijar por escrito, con la serie ya construida y antes de estimar ningún VaR, la medida, el nivel, la ventana y la significancia con la que se rechazará',
                        'Estimar el VaR de cada rueda usando únicamente las ruedas anteriores a ella, y guardar la serie completa de predicciones',
                        'Marcar las excepciones comparando la pérdida realizada de cada rueda con el VaR que se había predicho para esa misma rueda',
                        'Contrastar el número de excepciones con Kupiec y su reparto en el tiempo con Christoffersen, con la significancia fijada en el paso tercero',
                        'Con el veredicto de las pruebas ya emitido, calcular el multiplicador, el capital exigido y la recomendación al comité',
                    ]}
                    pista="Cada paso nombra aquello de lo que depende: «sobre ese panel ya congelado», «el VaR que se había predicho», «la significancia fijada en el paso tercero», «con el veredicto ya emitido». Si un paso se coloca antes que aquello que nombra, su enunciado se queda sin referente."
                />
            </Andamio>

            <RespuestaAbierta id="P2.1" etiqueta="P2.1 · Las dos actividades que faltan, y el par que da igual"
                minPalabras={80}
                enunciado={<>
                    <p style={{ marginTop: 0 }}>Al ciclo de arriba le faltan dos actividades que el informe sí hizo:</p>
                    <ul className="text-[0.92rem] text-gray-700" style={{ paddingLeft: '1.2rem' }}>
                        <li><strong>(a)</strong> Calcular el <em>Expected Shortfall</em> sobre las ruedas que excedieron el VaR.</li>
                        <li><strong>(b)</strong> Documentar cada excepción con su fecha y su causa, separando el fallo del modelo del dato defectuoso.</li>
                    </ul>
                    <p style={{ marginBottom: 0 }}>
                        Diga <strong>entre qué pasos entra cada una</strong>. Después, señale{' '}
                        <strong>un par de actividades del ciclo completo —los siete pasos más estas
                        dos— que pueda invertirse sin consecuencia alguna</strong>, y explique por
                        qué. Y señale <strong>un par que no pueda</strong>, diciendo con precisión
                        qué se rompe al invertirlo: no basta «se rompe el orden lógico», hay que
                        decir qué afirmación del informe dejaría de sostenerse.
                    </p>
                </>} />

            <h3>2 · El mismo modelo, dos formas de validarlo</h3>

            <p>
                La mesa validó su VaR reestimándolo rueda a rueda con las {V} ruedas anteriores, que
                es la convención del curso. Un analista del área de inversiones rehízo la validación
                de otra manera: estimó <strong>un solo VaR sobre las {miles(D.panel.sesiones)} ruedas
                completas</strong> —le dio {dec(dm.var_unico, 4)} %— y contó con él las excepciones
                sobre las mismas {miles(bt.ruedas_prueba)} ruedas de prueba. Los dos resultados:
            </p>

            <div style={{ overflowX: 'auto' }}>
                <table className="w-full text-[0.88rem] my-4 border-collapse">
                    <thead>
                        <tr style={{ background: '#F5F3FF' }}>
                            <th className="text-left p-2 border-b-2" style={{ borderColor: '#3D008D' }}>Cómo se estimó el VaR</th>
                            <th className="text-right p-2 border-b-2" style={{ borderColor: '#3D008D' }}>Excepciones</th>
                            <th className="text-right p-2 border-b-2" style={{ borderColor: '#3D008D' }}>Tasa</th>
                            <th className="text-right p-2 border-b-2" style={{ borderColor: '#3D008D' }}>LR<sub>uc</sub></th>
                            <th className="text-right p-2 border-b-2" style={{ borderColor: '#3D008D' }}>p</th>
                            <th className="text-left p-2 border-b-2" style={{ borderColor: '#3D008D' }}>Veredicto al 5 %</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-2 border-b">Rueda a rueda, con las {V} anteriores</td>
                            <td className="p-2 border-b text-right">{bt.excepciones}</td>
                            <td className="p-2 border-b text-right">{dec(bt.tasa * 100, 2)} %</td>
                            <td className="p-2 border-b text-right">{dec(bt.lr_uc, 4)}</td>
                            <td className="p-2 border-b text-right">{dec(bt.p_uc, 4)}</td>
                            <td className="p-2 border-b font-semibold" style={{ color: bt.p_uc < 0.05 ? '#B91C1C' : '#15803D' }}>
                                {bt.p_uc < 0.05 ? 'rechaza el modelo' : 'no rechaza'}
                            </td>
                        </tr>
                        <tr>
                            <td className="p-2 border-b">Una sola vez, sobre la muestra completa</td>
                            <td className="p-2 border-b text-right">{dm.excepciones}</td>
                            <td className="p-2 border-b text-right">{dec(dm.tasa * 100, 2)} %</td>
                            <td className="p-2 border-b text-right">{dec(dm.lr_uc, 4)}</td>
                            <td className="p-2 border-b text-right">{dec(dm.p_uc, 4)}</td>
                            <td className="p-2 border-b font-semibold" style={{ color: dm.p_uc < 0.05 ? '#B91C1C' : '#15803D' }}>
                                {dm.p_uc < 0.05 ? 'rechaza el modelo' : 'no rechaza'}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <RespuestaAbierta id="P2.2" etiqueta="P2.2 · Por qué la validación que sale mejor es la que está mal"
                minPalabras={80}
                enunciado={<>
                    Las dos filas usan los mismos datos, el mismo modelo y las mismas{' '}
                    {miles(bt.ruedas_prueba)} ruedas de prueba, y llegan a veredictos contrarios.
                    Diga <strong>qué defecto concreto tiene la segunda</strong> —nómbrelo—, por qué
                    ese defecto <strong>reduce</strong> el número de excepciones en vez de
                    aumentarlo, y por qué el hecho de que la validación mala salga mejor es
                    precisamente la prueba de que está mal. Cierre con la consecuencia: si el
                    informe se hubiera hecho así, ¿qué le habría dicho al comité y qué habría pasado
                    con el capital?
                </>}
                ayuda="Pregúntese qué sabía el estimador de la fila 2 el día de la peor pérdida del panel, y qué sabía el de la fila 1." />

            <h3>3 · Reconocer un procedimiento por su salida</h3>

            <Andamio id="A3" nota="Cuatro medidas que se citan juntas en cualquier informe y responden preguntas distintas.">
                <Emparejamiento
                    titulo="A3 · Cada medida con la pregunta que responde"
                    enunciado="Empareje cada medida con la única pregunta que contesta. Ninguna contesta la del vecino, y ahí está el ejercicio."
                    etiquetaIzq="Medida"
                    etiquetaDer="Pregunta que responde"
                    izquierda={[
                        'VaR al 99 %',
                        'Expected Shortfall al 97,5 %',
                        'Volatilidad anualizada',
                        'Beta contra el índice',
                    ]}
                    derecha={[
                        '¿Qué parte de ese movimiento desaparecería vendiendo el mercado?',
                        '¿Cuál es la pérdida que solo se supera un día de cada cien?',
                        '¿Cuánto se mueve la posición en un año típico, sin decir en qué dirección?',
                        '¿Cuánto se pierde en promedio los días en que se rebasa el umbral?',
                    ]}
                    /* `solucion[i]` es el índice en `derecha` que le toca a `izquierda[i]`.
                       ⚠️ NO es opcional aunque la firma no lo diga: `parOk` hace
                       `solucion[i]` sin comprobar nada, y omitirla lanza durante el
                       render y deja el taller EN BLANCO. Pasó al escribir este bloque. */
                    solucion={[1, 3, 2, 0]}
                />
            </Andamio>

            <p>
                El anexo del informe trae esta tabla <strong>sin los rótulos de las columnas</strong>:
                se perdieron al maquetar. Son los tres métodos de estimación del VaR del portafolio,
                sobre las mismas {miles(D.panel.sesiones)} ruedas.
            </p>

            <div style={{ overflowX: 'auto' }}>
                <table className="w-full text-[0.9rem] my-4 border-collapse">
                    <thead>
                        <tr style={{ background: '#F5F3FF' }}>
                            <th className="text-left p-2 border-b-2" style={{ borderColor: '#3D008D' }}>Nivel</th>
                            <th className="text-right p-2 border-b-2" style={{ borderColor: '#3D008D' }}>Salida A</th>
                            <th className="text-right p-2 border-b-2" style={{ borderColor: '#3D008D' }}>Salida B</th>
                            <th className="text-right p-2 border-b-2" style={{ borderColor: '#3D008D' }}>Salida C</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="p-2 border-b">95 %</td>
                            <td className="p-2 border-b text-right">{dec(D.medidas['95'].normal, 4)} %</td>
                            <td className="p-2 border-b text-right">{dec(D.medidas['95'].t, 4)} %</td>
                            <td className="p-2 border-b text-right">{dec(D.medidas['95'].hist, 4)} %</td>
                        </tr>
                        <tr>
                            <td className="p-2 border-b">99 %</td>
                            <td className="p-2 border-b text-right">{dec(D.medidas['99'].normal, 4)} %</td>
                            <td className="p-2 border-b text-right">{dec(D.medidas['99'].t, 4)} %</td>
                            <td className="p-2 border-b text-right">{dec(D.medidas['99'].hist, 4)} %</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <RespuestaAbierta id="P2.3" etiqueta="P2.3 · Qué produjo cada columna"
                minPalabras={60}
                enunciado={<>
                    Diga <strong>qué método produjo cada una de las tres columnas</strong> y,
                    para cada una, <strong>el rasgo de la salida con el que se reconoce</strong> —no
                    la fórmula: el rasgo—. Fíjese en lo que pasa entre las dos filas: una columna
                    empieza siendo la más alta y termina siendo la más baja, y esa sola inversión
                    identifica dos de las tres.
                </>} />
        </div>
    );
};

/* ============================================================================
   BLOQUE 3 · El barrido
   Las tres respuestas de este bloque no están escritas en ninguna parte: ni en
   los capítulos, ni en el repositorio, ni en un modelo de lenguaje. Solo las
   produce quien mueva los deslizadores. Por eso los laboratorios muestran el
   estado del punto elegido y NUNCA la curva del barrido completo: dibujar
   p contra nivel regalaría la respuesta de P3.1 en una imagen.
============================================================================ */

/* Cola de la ji-cuadrado con 1 grado de libertad, vía erfc de Numerical
   Recipes: P(X > x) = erfc(√(x/2)). Error relativo < 1,2e-7, de sobra para
   comparar contra un 5 %. El laboratorio tiene que devolver el mismo p que el
   congelador declaró al 99 %, y eso se comprueba en pantalla. */
const erfc = (x) => {
    const z = Math.abs(x), t = 2 / (2 + z), ty = 4 * t - 2;
    const cof = [-1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2,
        -9.561514786808631e-3, -9.46595344482036e-4, 3.66839497852761e-4,
        4.2523324806907e-5, -2.0278578112534e-5, -1.624290004647e-6,
        1.303655835580e-6, 1.5626441722e-8, -8.5238095915e-8, 6.529054439e-9,
        5.059343495e-9, -9.91364156e-10, -2.27365122e-10, 9.6467911e-11,
        2.394038e-12, -6.886027e-12, 8.94487e-13, 3.13092e-13, -1.12708e-13,
        3.81e-16, 7.106e-15];
    let d = 0, dd = 0;
    for (let j = cof.length - 1; j > 0; j--) { const tmp = d; d = ty * d - dd + cof[j]; dd = tmp; }
    const ans = t * Math.exp(-z * z + 0.5 * (cof[0] + ty * d) - dd);
    return x >= 0 ? ans : 2 - ans;
};
const pJi1 = (x) => (x <= 0 ? 1 : erfc(Math.sqrt(x / 2)));
const lg = (x) => (x > 0 ? Math.log(x) : 0);

const pruebasBacktest = (L, V, alfa) => {
    const varr = varRodante(L, V, alfa);
    const Lt = L.slice(V);
    const exc = varr.map((v, i) => Lt[i] > v);
    const T = varr.length, N = exc.filter(Boolean).length, p = 1 - alfa, pi = N / T;
    const lrUc = (pi > 0 && pi < 1)
        ? -2 * ((T - N) * Math.log(1 - p) + N * Math.log(p) - (T - N) * Math.log(1 - pi) - N * Math.log(pi))
        : NaN;
    let n00 = 0, n01 = 0, n10 = 0, n11 = 0;
    for (let i = 1; i < T; i++) {
        if (!exc[i - 1] && !exc[i]) n00++;
        else if (!exc[i - 1] && exc[i]) n01++;
        else if (exc[i - 1] && !exc[i]) n10++;
        else n11++;
    }
    const p01 = (n00 + n01) ? n01 / (n00 + n01) : 0;
    const p11 = (n10 + n11) ? n11 / (n10 + n11) : 0;
    const pu = (n01 + n11) / (n00 + n01 + n10 + n11);
    const lrInd = -2 * ((n00 + n10) * lg(1 - pu) + (n01 + n11) * lg(pu)
        - n00 * lg(1 - p01) - n01 * lg(p01) - n10 * lg(1 - p11) - n11 * lg(p11));
    return { varr, Lt, exc, T, N, esperadas: T * p, lrUc, pUc: pJi1(lrUc), lrInd, pInd: pJi1(lrInd) };
};

const Bloque3 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const V = ejes.ventana;
    const e = D.emisor[ejes.emisor];
    const rho = D.diversificacion.rho_media;
    /* La mitad de la ventana se escribe con coma: con V = 125 sale 62,5 y
       `{V / 2}` lo imprimía como «62.5», con punto, contra la convención del
       material. Con 250 y 500 el punto no aparecía y por eso no se veía. */
    const medioV = Number.isInteger(V / 2) ? String(V / 2) : dec(V / 2, 1);
    /* La ρ que el deslizador puede alcanzar, no la del panel: el paso es de
       0,01 y la media es 0,2268. Preguntar por el suelo «con ρ = 0,2268»
       pediría una cifra que el laboratorio no puede producir, y el estudiante
       escribiría la que ve. Se pregunta por la que se ve. */
    const rhoLab = Math.round(rho * 100) / 100;
    /* Las pérdidas del emisor, que es la serie sobre la que corre P3.1. Se
       calcula una vez por render y no dentro del `calcular` del laboratorio,
       que se vuelve a llamar con cada paso del deslizador. */
    const LE = perdidasEmisor(ejes.emisor);

    return (
        <div>
            <SectionHeader title="Bloque 3 · Lo que solo se ve moviéndolo" />

            <Motivacion icon="fa-sliders"
                gancho="El informe afirma tres cosas sobre rangos enteros de parámetros. Ninguna se puede comprobar razonando: hay que barrerlas.">
                En la última página del informe hay tres frases que empiezan por «en todos los
                casos», «equivale a» y «a partir de». Son afirmaciones sobre lo que pasaría con
                otros parámetros, no sobre los que se usaron. La mesa no las comprobó: las dedujo.
            </Motivacion>

            <NivelIA nivel={1}
                nota="Nivel 1 · No AI. Un modelo de lenguaje puede argumentar cualquiera de estas tres afirmaciones en las dos direcciones; lo que no puede es mover el deslizador y mirar. El taller registra qué valores recorrió usted." />

            <h3>1 · «Ningún nivel de confianza arregla la independencia»</h3>

            <p>
                El informe lo dice así: <em>«se ensayaron otros niveles de confianza y en todos los
                casos las pruebas siguen rechazando el modelo, de modo que el nivel no es el
                problema»</em>. La mesa lo comprobó <strong>sobre el portafolio</strong>. Usted lo
                va a comprobar sobre <strong>{e.rotulo}</strong>, con su ventana de {V} ruedas — y
                no tienen por qué darle lo mismo.
            </p>

            <Barrido id="P3.1"
                titulo="P3.1 · Barra el nivel de confianza de su emisor, de 95 % a 99,5 %"
                enunciado={<>
                    Mueva el nivel por <strong>todo</strong> el rango y anote qué pasa con las dos
                    pruebas. Después conteste las cuatro casillas. Las dos últimas son las que
                    puntúan de verdad.
                </>}
                campos={[
                    /* La pista dice «o ninguno» porque con una de las doce
                       combinaciones —V = 500 y Grupo Sura— Kupiec rechaza en los
                       diez niveles, y una pista que solo enseña un número obliga
                       a inventarse uno. Y dice «barra entero» porque con otra
                       —V = 125 e ISA— la prueba NO es monótona: rechaza en
                       0,975 y vuelve a pasar en 0,980. Quien pare en el primer
                       rechazo contesta 0,970, que es la respuesta del barrido a
                       medias. */
                    { id: 'nivel_kupiec', etiqueta: 'Nivel más alto en que Kupiec NO rechaza', pista: 'p. ej. 0,970 — o «ninguno». Barra el rango entero antes de contestar: la prueba no tiene por qué empeorar de forma continua' },
                    { id: 'p_kupiec', etiqueta: 'Su p en ese nivel', pista: 'cuatro decimales' },
                    /* ⚠️ NO presuponer el resultado. La redacción anterior decía
                       «por qué mover el nivel arregla una prueba y NUNCA la
                       otra», que es lo que pasa sobre el portafolio y lo que el
                       capítulo 6 enseña. Sobre el emisor es falso en 7 de las 12
                       combinaciones: con Bogotá la independencia pasa en los diez
                       niveles con V = 125 y V = 200, y con ISA en diez y en ocho.
                       Esa redacción le habría dado por errónea la respuesta
                       correcta a siete estudiantes de doce. Se pregunta por lo
                       que encuentre, y lo que puntúa es la razón. */
                    { id: 'independencia', etiqueta: '¿Qué le pasa a la prueba de independencia a lo largo de todo el barrido: hay niveles que la pasan, o no la pasa ninguno? Diga cuáles, si los hay. Y después lo que puntúa: ¿por qué mover el nivel puede arreglar el conteo de Kupiec con mucha más facilidad que el agrupamiento?', largo: true },
                    { id: 'conciliacion', etiqueta: 'El capítulo 6 del curso barrió esto mismo sobre el PORTAFOLIO, con 17 ventanas y 10 niveles, y publicó el resultado: de las 170 combinaciones, 127 pasan Kupiec, 5 pasan independencia y exactamente 1 pasa la conjunta. Concilie ese resultado con el suyo: ¿le sale más permisivo o más exigente que el portafolio, y qué propiedad de su emisor lo explica? Si le sale muy distinto, la pregunta no es cuál está mal.', largo: true },
                ]}>
                <Laboratorio id="lab-nivel" titulo={`El backtest de ${e.rotulo} con su ventana`}
                    enunciado={`Pérdidas de ${e.rotulo}, no del portafolio. Ventana fija en ${V} ruedas —la suya—. Lo único que se mueve es el nivel.`}
                    altura="chart-h-400"
                    controles={[{
                        id: 'alfa', etiqueta: 'Nivel de confianza', min: 0.95, max: 0.995, paso: 0.005,
                        valor: 0.99, formato: (v) => `${dec(v * 100, 1)} %`,
                    }]}
                    calcular={(p) => {
                        const r = pruebasBacktest(LE, V, p.alfa);
                        const x = D.fechas.slice(V);
                        const exX = [], exY = [];
                        for (let i = 0; i < r.T; i++) if (r.exc[i]) { exX.push(x[i]); exY.push(r.Lt[i]); }
                        return {
                            traces: [
                                { x, y: r.Lt, type: 'scattergl', mode: 'lines', name: 'Pérdida del día', line: { color: PALETA.gris, width: 0.8 } },
                                { x, y: r.varr, type: 'scatter', mode: 'lines', name: 'VaR estimado', line: { color: PALETA.primario, width: 2 } },
                                { x: exX, y: exY, type: 'scatter', mode: 'markers', name: 'Excepciones', marker: { color: PALETA.secundario, size: 7, symbol: 'x' } },
                            ],
                            layout: EJES({
                                xaxis: { title: 'Fecha' }, yaxis: { title: 'Pérdida diaria (%)' },
                                legend: { orientation: 'h', y: 1.12 },
                            }),
                        };
                    }}
                    lectura={(p) => {
                        const r = pruebasBacktest(LE, V, p.alfa);
                        return `Con α = ${dec(p.alfa * 100, 1)} %: ${r.N} excepciones donde se esperaban `
                            + `${dec(r.esperadas, 1)} · Kupiec LR = ${dec(r.lrUc, 4)}, p = ${dec(r.pUc, 4)} `
                            + `(${r.pUc < 0.05 ? 'rechaza' : 'no rechaza'}) · independencia LR = ${dec(r.lrInd, 4)}, `
                            + `p = ${dec(r.pInd, 4)} (${r.pInd < 0.05 ? 'rechaza' : 'no rechaza'})`;
                    }}
                    nota={`Al 99 % esta lectura tiene que devolver exactamente el conteo de excepciones que el bloque 1 declaró para ${e.rotulo} con su ventana. Es la misma serie y la misma función. Si no coinciden, deténgase y avísele al docente.`} />
            </Barrido>

            <h3>2 · «El EWMA con λ = 0,94 equivale a su ventana»</h3>

            <p>
                Segunda frase del informe: <em>«el EWMA con el λ de RiskMetrics equivale a la
                ventana móvil que usamos»</em>. La equivalencia se define por la{' '}
                <strong>vida media</strong>: las ruedas que hacen falta para que el peso caiga a la
                mitad. Una ventana de {V} ruedas reparte peso uniforme, así que su vida media es{' '}
                {medioV}.
            </p>

            <Barrido id="P3.2"
                titulo="P3.2 · Encuentre el λ que de verdad equivale a su ventana"
                enunciado={<>
                    Mueva λ hasta que la vida media que muestra la lectura sea lo más cercana posible a{' '}
                    <strong>{medioV} ruedas</strong> — el deslizador va de 0,0005 en 0,0005, así que
                    la coincidencia exacta no existe y no se pide. Anote ese λ y compárelo con el 0,94 del informe.
                </>}
                campos={[
                    { id: 'lambda', etiqueta: `λ cuya vida media MÁS SE ACERCA a ${medioV} ruedas`, pista: 'tres o cuatro decimales' },
                    { id: 'vida_094', etiqueta: 'Vida media que tiene el λ = 0,94 del informe', pista: 'en ruedas' },
                    { id: 'donde_falla', etiqueta: '¿En qué deja de valer la equivalencia? Use lo que vio en P1.2 y diga qué hace la ventana que el EWMA no hace nunca.', largo: true },
                ]}>
                <Laboratorio id="lab-lambda" titulo="EWMA contra su ventana móvil"
                    enunciado={`La línea morada es la σ móvil de ${V} ruedas y no se mueve. La rosa es el EWMA con el λ que usted elija.`}
                    altura="chart-h-400"
                    controles={[{
                        id: 'lam', etiqueta: 'λ del EWMA', min: 0.90, max: 0.999, paso: 0.0005,
                        valor: 0.94, formato: (v) => dec(v, 4),
                    }]}
                    calcular={(p) => {
                        const x = D.fechas;
                        return {
                            traces: [
                                { x, y: D.rp.map(Math.abs), type: 'scattergl', mode: 'lines', name: '|rendimiento|', line: { color: PALETA.gris, width: 0.6 } },
                                { x, y: sigmaMovil(D.rp, V), type: 'scatter', mode: 'lines', name: `σ móvil de ${V}`, line: { color: PALETA.primario, width: 2 } },
                                { x, y: ewma(D.rp, p.lam), type: 'scatter', mode: 'lines', name: 'σ EWMA', line: { color: PALETA.secundario, width: 1.6 } },
                            ],
                            layout: EJES({
                                xaxis: { title: 'Fecha' }, yaxis: { title: 'Porcentaje diario', range: [0, 8] },
                                legend: { orientation: 'h', y: 1.12 },
                            }),
                        };
                    }}
                    lectura={(p) => {
                        const vm = Math.log(0.5) / Math.log(p.lam);
                        const sm = sigmaMovil(D.rp, V), ew = ewma(D.rp, p.lam);
                        let s = 0, n = 0;
                        for (let i = 0; i < sm.length; i++) if (sm[i] !== null) { s += (ew[i] - sm[i]) ** 2; n++; }
                        return `λ = ${dec(p.lam, 4)} → vida media de ${dec(vm, 1)} ruedas · `
                            + `distancia cuadrática media a la σ móvil de ${V}: ${dec(s / n, 4)}`;
                    }} />
            </Barrido>

            <h3>3 · «A partir de siete u ocho emisores ya no se gana nada»</h3>

            <p>
                Tercera frase: <em>«a partir de siete u ocho emisores la diversificación deja de
                aportar»</em>. El laboratorio reparte por partes iguales N activos con la
                volatilidad de <strong>{e.rotulo}</strong> —{dec(e.sigma_diaria, 4)} % diario, la
                suya— y la correlación media del panel, {dec(rho, 4)}.
            </p>

            <Barrido id="P3.3"
                titulo="P3.3 · Hasta dónde llega la diversificación"
                enunciado={<>
                    Barra N y anote dónde deja de valer la pena añadir uno más. Después baje y suba
                    la correlación y mire qué le pasa al suelo de la curva.
                </>}
                campos={[
                    { id: 'n_umbral', etiqueta: 'N desde el cual añadir un activo baja el riesgo menos de 0,05 pp', pista: 'un número entero' },
                    { id: 'suelo', etiqueta: 'Suelo al que tiende la curva con su σ y la ρ del deslizador (' + dec(rhoLab, 2) + ')', pista: 'en % diario' },
                    { id: 'supuesto', etiqueta: '¿Qué supuesto de este laboratorio NO cumple el fondo real, y en qué dirección le mueve la conclusión?', largo: true },
                ]}>
                <Laboratorio id="lab-div" titulo="Riesgo contra número de activos"
                    enunciado={`Todos los activos con σ = ${dec(e.sigma_diaria, 4)} % y la misma correlación entre ellos.`}
                    altura="chart-h-360"
                    controles={[
                        { id: 'n', etiqueta: 'Número de activos', min: 1, max: 30, paso: 1, valor: 4, formato: (v) => `${v}` },
                        { id: 'rho', etiqueta: 'Correlación media', min: 0, max: 0.6, paso: 0.01, valor: rhoLab, formato: (v) => dec(v, 2) },
                    ]}
                    calcular={(p) => {
                        const s = e.sigma_diaria;
                        const xs = Array.from({ length: 30 }, (_, i) => i + 1);
                        const ys = xs.map(n => s * Math.sqrt((1 - p.rho) / n + p.rho));
                        const suelo = s * Math.sqrt(p.rho);
                        return {
                            traces: [
                                { x: xs, y: ys, type: 'scatter', mode: 'lines+markers', name: 'σ del portafolio', line: { color: PALETA.primario, width: 2 } },
                                { x: [1, 30], y: [suelo, suelo], type: 'scatter', mode: 'lines', name: 'Riesgo no diversificable', line: { color: PALETA.secundario, width: 2, dash: 'dash' } },
                                { x: [p.n], y: [s * Math.sqrt((1 - p.rho) / p.n + p.rho)], type: 'scatter', mode: 'markers', name: `N = ${p.n}`, marker: { color: PALETA.agua, size: 12 } },
                            ],
                            layout: EJES({
                                xaxis: { title: 'Número de activos en la cartera' },
                                yaxis: { title: 'σ diaria del portafolio (%)', rangemode: 'tozero' },
                                legend: { orientation: 'h', y: 1.12 },
                            }),
                        };
                    }}
                    lectura={(p) => {
                        const s = e.sigma_diaria;
                        const f = (n) => s * Math.sqrt((1 - p.rho) / n + p.rho);
                        const baja = p.n > 1 ? f(p.n - 1) - f(p.n) : NaN;
                        return `Con ${p.n} activos y ρ = ${dec(p.rho, 2)}: σ = ${dec(f(p.n), 4)} % · `
                            + `pasar de ${p.n - 1} a ${p.n} la bajó ${p.n > 1 ? dec(baja, 4) : '—'} pp · `
                            + `suelo con infinitos activos: ${dec(s * Math.sqrt(p.rho), 4)} %`;
                    }} />
            </Barrido>
        </div>
    );
};

/* ============================================================================
   BLOQUE 4 · Audite a la mesa
   El informe lleva cinco defectos plantados y una afirmación que parece un
   defecto y no lo es. El taller declara que hay defectos —es un ejercicio de
   auditoría, no una trampa— y no dice cuántos ni cuáles.
============================================================================ */
/* ⚠️ `TIPOS_ERROR_RIESGO` e `IDX_ERROR` NO se declaran aquí: ya vienen dentro
   de TR-CORE, y declararlos otra vez es un `SyntaxError` de Babel que deja el
   taller EN BLANCO —«Identifier has already been declared»—. Pasó al escribir
   este bloque. Antes de declarar cualquier constante en el contenido, hay que
   comprobar que la librería no la traiga ya. */

const Afirmacion = ({ n, children }) => (
    <p className="text-[0.92rem] text-gray-800 flex gap-3" style={{ margin: '0 0 0.7rem' }}>
        <span className="flex-shrink-0 font-bold text-white rounded px-1.5 h-fit text-[0.7rem] py-0.5"
            style={{ background: '#64748B' }}>{n}</span>
        <span>{children}</span>
    </p>
);

const Bloque4 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const V = ejes.ventana;
    const e = D.emisor[ejes.emisor];
    const bt = D.ventana[String(V)];
    const dm = bt.dentro_de_muestra;
    const sem = bt.semaforo;
    const inf = D.informe;
    const M = (pct) => miles(pct / 100 * 800000);   // de % del fondo a millones

    return (
        <div>
            <SectionHeader title="Bloque 4 · Audite a la mesa" />

            <Motivacion icon="fa-magnifying-glass"
                gancho="El informe lo redactó un modelo de lenguaje. Está bien escrito, es coherente y suena a experto. Ninguna de las tres cosas es lo mismo que estar bien.">
                La mesa de mercado tiene dos analistas y un trimestre corto, así que el informe lo
                redactó un modelo de lenguaje a partir de las salidas del panel. El texto que sigue
                es ese informe, con sus cifras. Su trabajo es el que nadie hizo antes de mandarlo.
            </Motivacion>

            <NivelIA nivel={1}
                nota="Nivel 1 · No AI, y aquí la razón es de lógica y no de política: pedirle a un modelo que audite a un modelo es circular. La auditoría la hace usted." />

            <Andamio id="A4" nota="Un defecto de calentamiento, del mismo tipo que alguno de los que va a buscar. Cuatro afirmaciones, una está mal.">
                <DetectaError
                    titulo="A4 · Cuatro frases del anexo, una defectuosa"
                    enunciado="Del anexo estadístico del mismo informe. Señale la afirmación defectuosa y clasifique el defecto."
                    lineas={[
                        'La volatilidad diaria del portafolio sobre las 1 916 ruedas es del 1,55 %.',
                        'Anualizamos esa cifra multiplicándola por las 252 ruedas del año: 390,6 % anual.',
                        'La curtosis de exceso de la serie es 25,77, muy por encima del 0 de una normal.',
                        'Por eso el ajuste paramétrico se hizo con una t de Student y no con una normal.',
                    ]}
                    /* 1-based: `DetectaError` pinta `n = i + 1` y compara contra eso.
                       Con `1` señalaba la PRIMERA frase, que es la correcta. La
                       defectuosa es la segunda. Solo se ve respondiéndolo en pantalla. */
                    lineaCorrecta={2}
                    tipos={TIPOS_ERROR_RIESGO}
                    tipoCorrecto={IDX_ERROR.convencion}
                    explicacion="La volatilidad no escala con el tiempo: escala con su raíz. Anualizar una desviación diaria es multiplicarla por √252 ≈ 15,87, no por 252. La cifra correcta es 24,6 % anual, no 390,6 %."
                    impacto="Un 390 % de volatilidad anual en un fondo de pensiones no es un error de coma: es una cifra que ningún comité aprobaría y que ninguna mesa reportaría dos veces. El problema es que en un informe largo nadie la mira."
                />
            </Andamio>

            <h3>El informe</h3>

            <div className="my-5 rounded-xl border-2 p-5" style={{ borderColor: '#64748B', background: '#F8FAFC' }}>
                <p className="text-[0.7rem] uppercase tracking-widest font-bold text-gray-500" style={{ margin: '0 0 0.2rem' }}>
                    Fondo de pensiones · mesa de mercado
                </p>
                <p className="font-bold text-navy text-[1.05rem]" style={{ margin: '0 0 1rem' }}>
                    Informe trimestral de riesgo de mercado · anexo de medición y validación
                </p>

                <Afirmacion n="1">
                    El portafolio, valorado en <strong>{miles(800000)} millones</strong>, se compone
                    de cuatro emisores de la Bolsa de Valores de Colombia con pesos de 30 %, 20 %,
                    25 % y 25 %. El panel abarca {miles(D.panel.sesiones)} ruedas, de {D.panel.desde} a{' '}
                    {D.panel.hasta}.
                </Afirmacion>

                <Afirmacion n="2">
                    El <strong>valor en riesgo histórico al 99 % a un día</strong> es del{' '}
                    <strong>{dec(D.medidas['99'].hist, 4)} %</strong>, esto es{' '}
                    {M(D.medidas['99'].hist)} millones.
                </Afirmacion>

                <Afirmacion n="3">
                    El <em>Expected Shortfall</em> al 97,5 %, que es la medida a la que migra
                    Basilea III, corresponde al percentil 97,5 de la distribución de pérdidas:{' '}
                    <strong>{dec(inf.cuantil_975, 4)} %</strong>, o {M(inf.cuantil_975)} millones.
                    Al ser inferior al VaR al 99 %, la migración de medida <strong>liberaría
                    capital</strong>.
                </Afirmacion>

                <Afirmacion n="4">
                    Para el requerimiento a diez días escalamos con la raíz del tiempo:{' '}
                    {dec(D.medidas['99'].hist, 4)} × √10 = <strong>{dec(inf.var10_raiz, 4)} %</strong>,
                    {' '}{M(inf.var10_raiz)} millones.
                </Afirmacion>

                <Afirmacion n="5">
                    Como comprobación del agregado, sumamos los VaR al 99 % de las cuatro posiciones
                    ponderados por su peso y obtuvimos <strong>{dec(inf.var_suma_ponderada, 4)} %</strong>{' '}
                    ({M(inf.var_suma_ponderada)} millones), <strong>coherente</strong> con la cifra
                    de la afirmación 2.
                </Afirmacion>

                <Afirmacion n="6">
                    El <em>Expected Shortfall</em> al 99 % lo calculamos como el promedio simple de
                    las ruedas que exceden el VaR — <strong>{dec(D.medidas['99'].es_convencion, 4)} %</strong> —,
                    que es la convención declarada del curso. El ES exacto de la muestra sería{' '}
                    {dec(D.medidas['99'].es_exacto, 4)} %, es decir{' '}
                    {miles(D.medidas.brecha_es99_millones)} millones más. Reportamos el primero y
                    dejamos constancia de la diferencia.
                </Afirmacion>

                <Afirmacion n="7">
                    En cuanto al riesgo sistemático, la beta de <strong>{e.rotulo}</strong> contra el
                    ETF ICOLCAP es <strong>{dec(e.beta_diaria.beta, 4)}</strong> con un R² de{' '}
                    <strong>{dec(e.beta_diaria.r2, 4)}</strong>. El modelo de mercado{' '}
                    <strong>explica bien</strong> el comportamiento del emisor, de modo que la
                    posición puede cubrirse vendiendo índice.
                </Afirmacion>

                <Afirmacion n="8">
                    <strong>Validación.</strong> Estimamos el VaR al 99 % sobre las{' '}
                    {miles(D.panel.sesiones)} ruedas del panel y contamos las excepciones sobre las{' '}
                    {miles(dm.ruedas_prueba)} ruedas de prueba: <strong>{dm.excepciones}</strong>,
                    frente a las {dec(dm.ruedas_prueba * 0.01, 1)} esperadas. La prueba de Kupiec da
                    LR = {dec(dm.lr_uc, 4)} y p = <strong>{dec(dm.p_uc, 4)}</strong>, de modo que{' '}
                    <strong>no se rechaza</strong> el modelo.
                </Afirmacion>

                <Afirmacion n="9">
                    En la ventana regulatoria de las últimas 250 ruedas hay{' '}
                    <strong>{sem.excepciones_250} excepciones</strong>, lo que sitúa al modelo en
                    zona <strong>{sem.zona}</strong> con un multiplicador de {dec(sem.multiplicador, 2)}{' '}
                    y un capital exigido de <strong>{miles(sem.capital_por_medio60)} millones</strong>.
                </Afirmacion>

                <Afirmacion n="10">
                    <strong>Conclusión.</strong> El modelo de VaR histórico es adecuado para el
                    reporte regulatorio del próximo trimestre y no requiere recalibración.
                </Afirmacion>
            </div>

            <CalloutPro tema="warn" titulo="Lo que este informe tiene, y lo que usted tiene que hacer con ello"
                subtitulo="Redactado con un modelo de lenguaje sobre las salidas del panel">
                <p style={{ margin: 0 }}>
                    El informe <strong>contiene defectos plantados</strong> —no se le dice cuántos ni
                    dónde— y también afirmaciones correctas que parecen sospechosas. Las cifras que
                    reporta son las que el modelo produjo: <strong>no están alteradas</strong>. Lo
                    que puede estar mal es qué se calculó, con qué información y qué se concluyó.
                </p>
            </CalloutPro>

            <RespuestaAbierta id="P4.1" etiqueta="P4.1 · La auditoría"
                minPalabras={200} filas={12}
                enunciado={<>
                    <p style={{ marginTop: 0 }}>
                        Por <strong>cada</strong> defecto que encuentre, escriba las cuatro cosas, en
                        este orden y numerando la afirmación:
                    </p>
                    <ol className="text-[0.92rem] text-gray-700" style={{ paddingLeft: '1.2rem' }}>
                        <li><strong>Dónde</strong> — el número de la afirmación.</li>
                        <li><strong>Qué tipo</strong> — uno de los siete del ejercicio de arriba.</li>
                        <li><strong>Cuánto cuesta</strong> — la cifra correcta y la diferencia en
                            millones sobre los {miles(800000)} del fondo, con el signo: ¿sobreestima
                            o subestima el riesgo?</li>
                        <li><strong>Cómo se arregla</strong> — qué habría que haber hecho.</li>
                    </ol>
                    <p style={{ marginBottom: 0 }}>
                        Las cifras correctas no están en este taller: están en los capítulos de la
                        unidad. Un defecto señalado sin su costo vale la mitad; un costo sin
                        dirección —sobreestima o subestima— no vale nada, porque es lo único que le
                        importa al comité.
                    </p>
                </>}
                ayuda="Ojo con inventar defectos: señalar como error algo que está bien descuenta lo mismo que no ver uno que está mal." />

            <RespuestaAbierta id="P4.2" etiqueta="P4.2 · La que parece un error y no lo es"
                minPalabras={70}
                enunciado={<>
                    Al menos una afirmación del informe <strong>parece</strong> un defecto —reporta
                    un número que no es el que un manual daría— y sin embargo está bien.
                    Identifíquela, y <strong>demuestre</strong> que está bien: diga qué convención
                    aplica, dónde se declaró y por qué reportar el otro número sería, en este curso,
                    el error. Afirmarlo con evidencia vale lo mismo que encontrar un fallo.
                </>} />

            <RespuestaAbierta id="P4.3" etiqueta="P4.3 · Cuál cambia la decisión"
                minPalabras={80}
                enunciado={<>
                    De todos los defectos que encontró, <strong>¿cuáles cambian la decisión del
                    comité y cuáles solo cambian un número?</strong> Ordénelos por esa distinción,
                    no por tamaño, y dé el criterio que usó para separarlos. Después conteste lo que
                    de verdad le van a preguntar: con lo que usted ha visto,{' '}
                    <strong>¿se puede firmar la afirmación 10?</strong>
                </>} />
        </div>
    );
};


/* ============================================================================
   BLOQUE 5 · La conciliación
   Tres pares de cifras que no encajan y las seis están bien calculadas. Es el
   corazón del instrumento: aquí no hay nada que detectar, hay que DECIDIR.
============================================================================ */
const GraficaCruce = () => {
    usePlotly('g-cruce',
        () => ([
            { x: D.curva_var.alfas, y: D.curva_var.hist, type: 'scatter', mode: 'lines',
              name: 'Histórico', line: { color: PALETA.primario, width: 2.5 } },
            { x: D.curva_var.alfas, y: D.curva_var.normal, type: 'scatter', mode: 'lines',
              name: 'Paramétrico normal', line: { color: PALETA.secundario, width: 2.5 } },
            { x: D.curva_var.alfas, y: D.curva_var.t, type: 'scatter', mode: 'lines',
              name: 'Paramétrico t', line: { color: PALETA.agua, width: 2, dash: 'dot' } },
        ]),
        () => EJES({
            xaxis: { title: 'Nivel de confianza', tickformat: '.1%' },
            yaxis: { title: 'VaR a un día (%)' },
            legend: { orientation: 'h', y: 1.12 },
        }), []);
    return <ChartFrame id="g-cruce" height="chart-h-400"
        caption="Los tres métodos sobre las mismas ruedas. El orden entre ellos NO se conserva a lo largo del eje: hay más de un cruce, y el que importa para la pregunta es el de la normal con el histórico." />;
};

const Bloque5 = () => {
    const { datos } = usePersistencia();
    const e = D.emisor[datos.ejes.emisor];
    const m95 = D.medidas['95'], m99 = D.medidas['99'];
    const M = (pct) => miles(pct / 100 * 800000);
    const dif = (a, b) => miles(Math.abs(a - b) / 100 * 800000);

    return (
        <div>
            <SectionHeader title="Bloque 5 · La conciliación" />

            <Motivacion icon="fa-scale-balanced"
                gancho="Ninguna de las seis cifras está mal calculada. Por eso no hay nada que corregir: hay que elegir, y decir cuánto cuesta elegir mal.">
                Los bloques anteriores buscaban defectos. Este no. Aquí hay tres pares de
                números que se contradicen entre sí y que están, los seis, bien calculados
                sobre los mismos datos. El comité no puede llevarse los dos de cada par.
            </Motivacion>

            <NivelIA nivel={3}
                nota="Nivel 3 con bitácora. Aquí la IA sirve para explorar consecuencias; la decisión y su costo son suyos, y en la sustentación se le pregunta por ellos." />

            <h3>C-1 · La normal no falla en una dirección: falla en las dos</h3>

            <GraficaCruce />

            <p>
                Al <strong>95 %</strong> la normal da {dec(m95.normal, 4)} % contra{' '}
                {dec(m95.hist, 4)} % del histórico —<strong>{dif(m95.normal, m95.hist)} millones
                de más</strong>—. Al <strong>99 %</strong> da {dec(m99.normal, 4)} % contra{' '}
                {dec(m99.hist, 4)} % —<strong>{dif(m99.normal, m99.hist)} millones de menos</strong>—.
                La misma distribución, los mismos datos, y el signo del error cambia.
            </p>

            <RespuestaAbierta id="P5.1" etiqueta="P5.1 · Dónde se cruzan, y qué firma usted"
                minPalabras={110}
                enunciado={<>
                    <strong>(a)</strong> Lea en la gráfica <strong>el nivel aproximado en que la
                    normal y el histórico se cruzan</strong> y diga qué significa que exista ese
                    cruce. <strong>(b)</strong> Nombre la propiedad de estos datos que lo produce y
                    cite <strong>la cifra del capítulo 1 que la mide</strong>. <strong>(c)</strong>{' '}
                    El fondo tiene que reportar a un solo nivel con un solo método: diga cuál firma
                    usted, con su costo en millones frente a la alternativa, y qué le responde al
                    director que diga «pero al 95 % la normal es más conservadora, luego es más
                    prudente».
                </>}
                ayuda="La respuesta a (b) no está en este taller. Está en la sección 4 del capítulo 1 y tiene nombre propio." />

            <h3>C-2 · El ES que reporta el curso no es el ES exacto</h3>

            <Andamio id="A5" nota="Un paso previo a C-2. Si esto no cuadra, la contradicción de abajo no se entiende.">
                <MCQ pregunta={`El ES al 99 % del curso promedia las ${m99.ruedas_cola} ruedas que superan el VaR. ¿Sobre cuántas ruedas se define el ES exacto de una muestra de ${miles(D.panel.sesiones)}?`}
                    opciones={[
                        { texto: `Sobre n(1−α) = ${dec(m99.ruedas_teoricas, 2)} ruedas`, correcta: true, justificacion: `Y como ${dec(m99.ruedas_teoricas, 2)} no es entero, el ES exacto pondera parcialmente la última. El promedio simple mete una rueda entera de más —la menos extrema de la cola—, y eso lo empuja hacia abajo.` },
                        { texto: 'Sobre todas las ruedas de la muestra completa', correcta: false },
                        { texto: 'Sobre las que superan la media más dos desviaciones', correcta: false },
                        { texto: 'Sobre el mismo número, porque ambos coinciden', correcta: false },
                    ]} />
            </Andamio>

            <p>
                Al <strong>99 %</strong> la convención del curso da {dec(m99.es_convencion, 4)} %
                contra {dec(m99.es_exacto, 4)} % del exacto:{' '}
                <strong>{miles(D.medidas.brecha_es99_millones)} millones</strong>. Al{' '}
                <strong>97,5 %</strong>, sobre los mismos datos y con la misma convención, la
                brecha cae a <strong>{miles(D.medidas.brecha_es975_millones)} millones</strong> —
                treinta veces menos.
            </p>

            <RespuestaAbierta id="P5.2" etiqueta="P5.2 · La convención, su dirección y su precio"
                minPalabras={110}
                enunciado={<>
                    <strong>(a)</strong> Diga <strong>en qué dirección yerra</strong> el promedio
                    simple: ¿sobreestima o subestima el riesgo? <strong>(b)</strong> Explique por
                    qué la brecha es treinta veces mayor al 99 % que al 97,5 %, usando lo que acaba
                    de responder en A5. <strong>(c)</strong> Decida: ¿es aceptable reportarle esa
                    convención a la Superfinanciera? Si dice que sí, diga qué tendría que
                    acompañarla en el informe para que lo sea; si dice que no, diga qué cambia y a
                    quién le explica el cambio de cifra.
                </>}
                ayuda="Ojo con (a): la respuesta se deduce de qué rueda entra de más y de dónde está esa rueda en la cola." />

            <h3>C-3 · La beta de {e.rotulo} vale dos cosas distintas</h3>

            <p>
                Con rendimientos <strong>diarios</strong>, la beta de {e.rotulo} contra el ICOLCAP
                es <strong>{dec(e.beta_diaria.beta, 4)}</strong> (R² = {dec(e.beta_diaria.r2, 4)}).
                Con rendimientos <strong>semanales</strong>, sobre exactamente el mismo periodo y el
                mismo índice, es <strong>{dec(e.beta_semanal.beta, 4)}</strong>. El emisor no se
                negoció en <strong>{e.ruedas_sin_variacion} ruedas</strong> de las{' '}
                {miles(D.panel.sesiones)} del panel.
            </p>

            <RespuestaAbierta id="P5.3" etiqueta="P5.3 · Cuál de las dos betas va al comité"
                minPalabras={110}
                enunciado={<>
                    <strong>(a)</strong> Diga <strong>qué mide cada una</strong> y por qué la diaria
                    sale más baja — el fenómeno tiene nombre y está en el capítulo 3.{' '}
                    <strong>(b)</strong> Elija la que va al comité y <strong>sostenga la elección</strong>:
                    ¿para qué se va a usar esa beta? La respuesta depende de eso y hay que decirlo.{' '}
                    <strong>(c)</strong> El informe de la mesa dice, con la beta diaria, que «la
                    posición puede cubrirse vendiendo índice». <strong>Reescriba esa frase</strong>{' '}
                    como usted la firmaría, con la beta que eligió y con lo que el R² permite
                    afirmar y lo que no.
                </>} />

            <CalloutPro tema="info" titulo="Lo que se califica aquí"
                subtitulo="Y lo que no">
                <p style={{ margin: 0 }}>
                    No se califica que acierte «la» respuesta: las tres admiten dos salidas
                    defendibles. Se califica que <strong>decida</strong>, que ponga la cifra en
                    pesos y que asuma el costo de lo que descarta. Una respuesta que diga «depende»
                    y se quede ahí, o que recomiende las dos cosas a la vez, vale cero — y es
                    exactamente la respuesta que da un modelo de lenguaje al que se le pregunta sin
                    obligarlo a firmar.
                </p>
            </CalloutPro>
        </div>
    );
};


/* ============================================================================
   BLOQUE 6 · La nota al comité
   Cierra la escena del bloque 0: la vicepresidenta preguntó si esto se firma.
============================================================================ */
const Bloque6 = () => {
    const { datos } = usePersistencia();
    const V = datos.ejes.ventana;
    const sem = D.ventana[String(V)].semaforo;

    return (
        <div>
            <SectionHeader title="Bloque 6 · La nota al comité" />

            <Motivacion icon="fa-file-signature"
                gancho="Si la nota necesita la palabra «cuantil» para entenderse, todavía no está terminada.">
                Vuelve el lunes de la primera pantalla. La vicepresidenta no quiere el anexo
                técnico ni las pruebas: quiere una página que pueda repartir en el comité, donde
                se sientan un abogado, un actuario y dos miembros externos que no han visto un
                histograma en su vida. Y quiere saber si firma.
            </Motivacion>

            <NivelIA nivel={3}
                nota="Nivel 3 con bitácora. Redactar con ayuda está permitido y es lo que hará en su trabajo; lo que se califica es que la nota diga lo que USTED decidió en los bloques 4 y 5, y no lo que un modelo escribiría sin haberlos resuelto." />

            <RespuestaAbierta id="P6.1" etiqueta="P6.1 · La nota, una página"
                minPalabras={320} maxPalabras={520} filas={16}
                enunciado={<>
                    <p style={{ marginTop: 0 }}>
                        <strong>Sin fórmulas y sin código.</strong> Cinco cosas, en este orden:
                    </p>
                    <ol className="text-[0.92rem] text-gray-700" style={{ paddingLeft: '1.2rem' }}>
                        <li><strong>La respuesta, en la primera frase</strong>: ¿el informe de la
                            mesa se puede firmar tal como está, se firma con salvedades o no se
                            firma? Sin rodeos y sin dejarlo para el final.</li>
                        <li><strong>La evidencia</strong>, en <strong>cuatro cifras como máximo</strong>,
                            cada una con su unidad y con lo que significa. Si necesita cinco, sobra una.</li>
                        <li><strong>Qué cambia en pesos</strong> si el comité le hace caso, y qué
                            cambia si no.</li>
                        <li><strong>Qué dice la validación</strong> del modelo que usted respalda —
                            incluido si lo rechaza—, y qué hace el fondo con eso mientras tanto.</li>
                        <li><strong>Un compromiso con fecha</strong>: qué se revisa, cuándo, y con
                            qué criterio de reprobación fijado <em>de antemano</em>.</li>
                    </ol>
                    <p style={{ marginBottom: 0 }}>
                        Su modelo está hoy en zona <strong>{sem.zona}</strong> con un multiplicador
                        de {dec(sem.multiplicador, 2)} y un capital de{' '}
                        <strong>{miles(sem.capital_por_medio60)} millones</strong>. Eso ya lo sabe el
                        comité. Lo que no sabe es qué hacer con ello.
                    </p>
                </>}
                ayuda="Prohibidas: «cuantil», «heterocedasticidad», «verosimilitud» y cualquier símbolo griego. No es un capricho de estilo: si la idea no sobrevive a la traducción, es que no está clara." />

            <RespuestaAbierta id="P6.2" etiqueta="P6.2 · Las tres preguntas que menos quiere que le hagan"
                minPalabras={90} filas={7}
                enunciado={<>
                    Escriba <strong>las tres preguntas</strong> que menos le gustaría que le
                    hicieran sobre lo que acaba de firmar — las de verdad, no las fáciles — y{' '}
                    <strong>respóndalas</strong>. Una respuesta honesta puede ser «no lo sé, y esto
                    es lo que haría para saberlo».
                    <br /><br />
                    <strong>Estas tres preguntas son las que se le van a hacer en la
                    sustentación</strong>, junto con las que salgan de su entrega. No es una amenaza:
                    es el mismo trato que tiene un analista cuando lleva un número a un comité, y
                    escribirlas ahora es la única forma de llegar preparado.
                </>} />
        </div>
    );
};

/* ============================================================================
   BLOQUE 7 · Bitácora y entrega
============================================================================ */
const BloqueEntrega = () => (
    <div>
        <SectionHeader title="Bloque 7 · Bitácora y entrega" />

        <Motivacion icon="fa-paper-plane"
            gancho="Si el navegador pierde lo guardado —pasa—, el archivo que ya descargó sigue valiendo. La pestaña abierta, no.">
            Lo que se califica es el archivo de entrega, no lo que quedó en la pestaña del
            navegador. Genérelo al terminar cada bloque y no solo al final.
        </Motivacion>

        <RespuestaAbierta id="P7.1" etiqueta="P7.1 · Bitácora de prompts"
            minPalabras={60} filas={12}
            enunciado={<>
                <p style={{ marginTop: 0 }}>
                    Una entrada por intercambio con un modelo de lenguaje, en orden cronológico y
                    con estas cuatro cosas cada una:
                </p>
                <ol className="text-[0.92rem] text-gray-700" style={{ paddingLeft: '1.2rem' }}>
                    <li><strong>En qué pregunta</strong> estaba trabajando.</li>
                    <li><strong>Qué le pidió</strong> — el prompt, resumido pero reconocible.</li>
                    <li><strong>Qué le devolvió</strong>, y si era correcto.</li>
                    <li><strong>Qué hizo usted con eso</strong>: lo usó tal cual, lo corrigió, lo
                        descartó. Si lo corrigió, qué corrigió.</li>
                </ol>
                <p style={{ margin: '0 0 0.5rem' }}>
                    Los bloques 2, 3 y 4 son de nivel 1 · No AI. Si usó IA en ellos, dígalo aquí:
                    <strong> declararlo cuesta mucho menos que no declararlo</strong>, y la
                    incoherencia entre lo que se declara y lo que se entrega es de las pocas cosas
                    que un calificador detecta sin esfuerzo.
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Si no usó IA en absoluto</strong>, escríbalo aquí con esas palabras y
                    firme la afirmación con su nombre. Eso también es una bitácora, y vale lo mismo.
                </p>
            </>}
            ayuda="Sin bitácora el taller no se califica. No es una sanción por sospecha: es uno de los productos evaluados, y está declarado desde la primera pantalla." />

        <h3>Antes de entregar</h3>

        <Accordion items={[
            {
                titulo: 'Qué se califica, y con qué peso',
                contenido: <>
                    Lectura de gráficas 22 % · procedimientos 13 % · el barrido 13 % · la auditoría
                    15 % · la conciliación 20 % · la nota al comité 8 % · la declaración previa 5 % ·
                    la bitácora 4 %. Eso es el 80 % de la nota; el 20 % restante es la{' '}
                    <strong>sustentación oral de diez minutos</strong>, que se hace sobre lo que
                    usted entregue.
                </>,
            },
            {
                titulo: 'Qué NO se califica',
                contenido: <>
                    Los ejercicios con botón de «Comprobar» valen cero: llevan la respuesta dentro
                    del archivo. Sus intentos quedan registrados en la entrega y se miran en la
                    sustentación, pero no suman ni restan puntos.
                </>,
            },
            {
                titulo: 'Qué lleva el archivo',
                contenido: <>
                    Su nombre y documento, su combinación, todas sus respuestas, los valores que
                    recorrió en los tres laboratorios, los intentos de cada andamio, las marcas de
                    tiempo y un código de verificación. <strong>Ese código detecta un archivo
                    corrupto o truncado; no es una firma</strong> y no pretende serlo — el código
                    que lo calcula está en esta misma página y usted puede leerlo.
                </>,
            },
        ]} />

        <Entrega inventario={INVENTARIO} />
    </div>
);

/* ============================================================================
   APP
============================================================================ */
const curriculum = [
    { id: 'b0', title: 'Bloque 0 · Su escritorio', icon: 'BookOpen', component: Bloque0 },
    { id: 'b1', title: 'Bloque 1 · Leer las gráficas', icon: 'BarChart', component: Bloque1 },
    { id: 'b2', title: 'Bloque 2 · Procedimientos', icon: 'Layers', component: Bloque2 },
    { id: 'b3', title: 'Bloque 3 · El barrido', icon: 'Sliders', component: Bloque3 },
    { id: 'b4', title: 'Bloque 4 · Audite a la mesa', icon: 'Bug', component: Bloque4 },
    { id: 'b5', title: 'Bloque 5 · La conciliación', icon: 'Scale', component: Bloque5 },
    { id: 'b6', title: 'Bloque 6 · La nota al comité', icon: 'BookOpen', component: Bloque6 },
    { id: 'entrega', title: 'Bloque 7 · Bitácora y entrega', icon: 'Award', component: BloqueEntrega },
];

const App = () => {
    /* ⚠️ Con `localStorage` bloqueado, `getItem` LANZA. El `App` de los
       capítulos lo lee sin guarda dentro del inicializador de `useState`, y por
       eso una `data:` URL deja la página en blanco. Aquí no puede pasar: es un
       instrumento calificado y la pantalla en blanco sería el taller entero. */
    const leerSeccion = () => {
        try {
            const g = parseInt(localStorage.getItem(CONFIG.storageKey), 10);
            return Number.isInteger(g) && g >= 0 ? g : 0;
        } catch (e) { return 0; }
    };
    const [idx, setIdx] = useState(leerSeccion);
    const [menu, setMenu] = useState(() => window.innerWidth >= 1024);
    const { datos } = usePersistencia();
    const listo = !!(datos && datos.ejes);

    const seguro = Math.min(idx, curriculum.length - 1);
    const Activa = curriculum[seguro].component;

    useEffect(() => {
        try { localStorage.setItem(CONFIG.storageKey, String(seguro)); } catch (e) { }
        typesetMath();
        const c = document.getElementById('contenido-scroll');
        if (c) c.scrollTo({ top: 0, behavior: 'smooth' });
    }, [seguro]);

    useEffect(() => {
        document.title = `Taller U1 · ${CONFIG.titulo} — Teoría del Riesgo`;
    }, []);

    const irA = (i) => { setIdx(i); if (window.innerWidth < 1024) setMenu(false); };

    return (
        <div className="flex h-screen overflow-hidden relative">
            {listo && (
                <button onClick={() => setMenu(p => !p)}
                    className="fixed top-4 left-4 z-50 p-2.5 rounded-full shadow-lg text-white transition-all hover:scale-110 tr-gradient"
                    title={menu ? 'Ocultar menú' : 'Mostrar menú'} aria-label={menu ? 'Ocultar menú' : 'Mostrar menú'}>
                    <i className={`fas ${menu ? 'fa-times' : 'fa-bars'} text-sm`}></i>
                </button>
            )}

            {listo && menu && <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={() => setMenu(false)} />}

            {listo && (
                <aside className="flex-shrink-0 overflow-y-auto z-40 flex flex-col tr-header"
                    style={{
                        width: menu ? '18rem' : '0', minWidth: menu ? '18rem' : '0',
                        opacity: menu ? 1 : 0, transition: 'width 0.3s ease, min-width 0.3s ease, opacity 0.25s ease',
                        overflow: menu ? 'visible auto' : 'hidden',
                    }}>
                    <div className="p-6 pt-16 border-b border-white/10">
                        <p className="text-[0.65rem] uppercase tracking-widest text-gold font-bold">Universidad Santo Tomás</p>
                        <h1 className="text-white font-bold text-lg tracking-tight mt-1">Teoría del Riesgo</h1>
                        <p className="text-xs text-white/60 mt-1">
                            Taller calificado · <span className="text-secondary font-semibold">{CONFIG.titulo}</span>
                        </p>
                    </div>
                    <nav className="p-4 space-y-2 flex-1">
                        {curriculum.map((s, i) => (
                            <button key={s.id} onClick={() => irA(i)}
                                className={`w-full flex items-start gap-3 px-3 py-3 text-sm rounded-lg transition-all text-left ${seguro === i ? 'text-white shadow-lg tr-gradient' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
                                <span className="flex-shrink-0 mt-0.5" style={{ width: 18, height: 18 }}>{renderIcon(s.icon, 18)}</span>
                                <span className="font-medium leading-tight break-words">{s.title}</span>
                            </button>
                        ))}
                    </nav>
                    <div className="p-4 text-[10px] text-white/40 border-t border-white/10">
                        <p>{CONFIG.unidad}</p>
                        <p>{CONFIG.ra} · {CONFIG.horas} horas</p>
                    </div>
                </aside>
            )}

            <main id="contenido-scroll" className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto px-6 py-10">
                    <Identificacion>
                        <Activa />
                    </Identificacion>
                </div>
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
    </script>
</body>

</html>
