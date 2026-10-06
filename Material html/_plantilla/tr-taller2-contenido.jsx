/* ============================================================================
   CONTENIDO DEL TALLER DE LA UNIDAD 2 · «El comité de inversiones»
   Se ensambla con `armar_taller.py --taller T2`. Las cifras salen de `D`, que el
   constructor genera desde `cifras_t2.json` con su lista blanca: **ninguna se
   escribe aquí a mano**.

   ⚠️ Los comentarios de este archivo VIAJAN AL HTML que abre el estudiante:
   Babel corre en el navegador y el JSX se embebe como texto. Aquí no se escribe
   nunca qué le sale a un fondo o a un TES. Eso vive en `talleres/clave/T2/`.

   ⚠️ Un enunciado o un pie de gráfica solo afirma lo que vale para los seis
   fondos o los doce TES: la tabla de «hechos que valen en todo el eje» de la
   clave de cifras dice cuáles. Es la zona ciega 6 del material.
============================================================================ */

const CONFIG = {
    numero: 'T2',
    titulo: 'El comité de inversiones',
    subtitulo: 'Taller calificado de la unidad 2 · leer, interpretar y auditar lo que la mesa ya calculó sobre un fondo y un TES',
    unidad: 'U2 · Portafolio y renta fija',
    horas: 5,
    ra: 'RA4 · RA5 · RA6',
    docente: 'Javier Mauricio Sierra',
    storageKey: 'tdr_u2t_seccion',
};

/* Lo que `Entrega` comprueba. Cada id tiene que existir como componente y tener
   entrada en la clave y en la rúbrica. `campos` y `minPalabras` están aquí por la
   misma razón que en el T1: `Entrega` vive en el bloque 7 y tiene que saber si un
   barrido quedó a medias aunque el estudiante no haya abierto nunca el bloque 4.
   El verificador compara esta lista con los componentes, uno a uno.

   P7.3 pesa cero: es un requisito, no una pregunta. Sin ella no se califica. */
const INVENTARIO = [
    { id: 'P0.1', tipo: 'abierta', bloque: 0, peso: 3, minPalabras: 90 },
    { id: 'P0.2', tipo: 'abierta', bloque: 0, peso: 2, minPalabras: 50 },
    { id: 'P1.1', tipo: 'abierta', bloque: 1, peso: 5, minPalabras: 80 },
    { id: 'P1.2', tipo: 'abierta', bloque: 1, peso: 4, minPalabras: 80 },
    { id: 'P1.3', tipo: 'abierta', bloque: 1, peso: 5, minPalabras: 90 },
    { id: 'P1.4', tipo: 'abierta', bloque: 1, peso: 4, minPalabras: 60 },
    { id: 'P2.1', tipo: 'abierta', bloque: 2, peso: 5, minPalabras: 70 },
    { id: 'P2.2', tipo: 'abierta', bloque: 2, peso: 4, minPalabras: 80 },
    { id: 'P2.3', tipo: 'abierta', bloque: 2, peso: 5, minPalabras: 90 },
    { id: 'P2.4', tipo: 'abierta', bloque: 2, peso: 4, minPalabras: 60 },
    { id: 'P3.1', tipo: 'abierta', bloque: 3, peso: 4, minPalabras: 70 },
    { id: 'P3.2', tipo: 'abierta', bloque: 3, peso: 4, minPalabras: 70 },
    { id: 'P3.3', tipo: 'abierta', bloque: 3, peso: 4, minPalabras: 90 },
    { id: 'P4.1', tipo: 'barrido', bloque: 4, peso: 6, campos: 4 },
    { id: 'P4.2', tipo: 'barrido', bloque: 4, peso: 6, campos: 4 },
    { id: 'P5.1', tipo: 'abierta', bloque: 5, peso: 10, minPalabras: 300 },
    { id: 'P5.2', tipo: 'abierta', bloque: 5, peso: 5, minPalabras: 100 },
    { id: 'P6.1', tipo: 'abierta', bloque: 6, peso: 5, minPalabras: 150 },
    { id: 'P6.2', tipo: 'abierta', bloque: 6, peso: 5, minPalabras: 150 },
    { id: 'P6.3', tipo: 'abierta', bloque: 6, peso: 5, minPalabras: 120 },
    { id: 'P7.1', tipo: 'abierta', bloque: 7, peso: 3, minPalabras: 120 },
    { id: 'P7.2', tipo: 'abierta', bloque: 7, peso: 2, minPalabras: 60 },
    { id: 'P7.3', tipo: 'abierta', bloque: 7, peso: 0, minPalabras: 12 },
];

/* ---------------------------------------------------------------- utilidades
   `miles` con espacio, como los capítulos 7 y 11 —no con `toLocaleString`, que
   pone punto (la lección del capítulo 12)—, y el signo menos tipográfico. */
const dec = (x, n = 2) => {
    const s = Number(x).toFixed(n).replace('.', ',');
    return s.startsWith('-') ? '−' + s.slice(1) : s;
};
const miles = (x) => {
    const n = Math.round(x);
    const s = Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return n < 0 ? '−' + s : s;
};
/* Con signo explícito: «+1 234», «−56», «0». */
const firmado = (x) => (Math.round(x) > 0 ? '+' : '') + miles(x);
const fecha = (iso) => {
    const [a, m, d] = iso.split('-');
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${a}`;
};
/* Puntos básicos con signo tipográfico: «+100», «−50», «0». */
const pb = (x) => (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(x);

const FONDO = D.meta.fondo_mm;          // millones
const NOMINAL = D.meta.nominal_mm;      // millones
const RF = D.meta.rf_log;               // ln(1,07), en %
const TOPE = D.meta.tope;
const NOMBRES = { ECO: 'Ecopetrol', BOG: 'Banco de Bogotá', SUR: 'Grupo Sura', ISA: 'ISA' };
const CORTOS = D.panel.cortos;
const DECLARADA = D.comunes.declarada;
const MINVAR = D.comunes.minvar;
const MINCVAR = D.comunes.mincvar;
const TRAMO = D.tramo_estudio;
const BONO10 = D.bono10;

const pesosTexto = (p) => CORTOS.map((c, i) => `${NOMBRES[c]} ${dec(p[i], Number.isInteger(p[i]) ? 0 : 2)} %`).join(' · ');
const anioTES = (nemo) => '20' + nemo.slice(-2);
const filaSEN = (nemo) => D.sen.find(f => f.nemo === nemo);

/* Precio sucio por cada 100 nominales a una TIR efectiva anual, con los flujos
   y los plazos NL/365 del congelador. Es la misma suma que el capítulo 10
   escribe con QuantLib, sin QuantLib: el navegador solo hace aritmética. */
const precioTIR = (b, tirPct) => b.flujos.reduce((s, f) => s + f.flujo * Math.pow(1 + tirPct / 100, -f.t), 0);

/* ⚠️ `scatter` (SVG) y nunca `scattergl`: sin WebGL, `scattergl` no dibuja nada
   y escribe un aviso en inglés dentro del recuadro (medido en el T1). */
const PALETA = { primario: '#3D008D', secundario: '#ED1E79', agua: '#0E7490', gris: '#94A3B8', oro: '#B45309' };
const EJES = (extra = {}) => ({
    margin: { l: 64, r: 16, t: 12, b: 48 },
    paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter, system-ui, sans-serif', size: 11 },
    separators: ',\u202f',
    ...extra,
});

/* Una ficha de dos columnas: rótulo y valor. */
const Ficha = ({ titulo, filas, nota }) => (
    <div className="my-5 rounded-xl border border-gray-200 overflow-hidden">
        {titulo && <div className="px-4 py-2 text-sm font-bold text-navy" style={{ background: '#F5F3FF' }}>{titulo}</div>}
        <div style={{ overflowX: 'auto' }}>
            <table className="w-full text-[0.88rem] border-collapse">
                <tbody>
                    {filas.map((f, i) => (
                        <tr key={i} className="border-t border-gray-100">
                            <td className="px-4 py-1.5 text-gray-700">{f[0]}</td>
                            <td className="px-4 py-1.5 text-right font-semibold text-navy" style={{ fontFamily: "'Fira Code', monospace", whiteSpace: 'nowrap' }}>{f[1]}</td>
                            {f.length > 2 && <td className="px-4 py-1.5 text-right text-gray-500" style={{ fontFamily: "'Fira Code', monospace", whiteSpace: 'nowrap' }}>{f[2]}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {/* En un teléfono la columna de comparación queda fuera de la caja y nada lo
            avisaba (revisión del 2026-10-03, a 375 px). */}
        {filas.some(f => f.length > 2) && (
            <p className="sm:hidden px-4 pt-1 text-[0.72rem] text-gray-400" style={{ margin: 0 }}>
                Deslice la tabla hacia la izquierda: a la derecha está la columna con que se compara.
            </p>
        )}
        {nota && <p className="px-4 py-2 text-[0.78rem] text-gray-500 border-t border-gray-100" style={{ margin: 0 }}>{nota}</p>}
    </div>
);

/* Una tabla con cabecera. `filas` es una lista de listas. */
const Tabla = ({ cabecera, filas, nota }) => (
    <div className="my-5">
        <div style={{ overflowX: 'auto' }}>
            <table className="w-full text-[0.86rem] border-collapse">
                <thead>
                    <tr style={{ background: '#F5F3FF' }}>
                        {cabecera.map((c, i) => <th key={i} className={`px-3 py-2 text-navy font-bold ${i ? 'text-right' : 'text-left'}`}>{c}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {filas.map((f, i) => (
                        <tr key={i} className="border-t border-gray-100">
                            {f.map((c, j) => <td key={j} className={`px-3 py-1.5 ${j ? 'text-right' : 'text-left text-gray-700'}`}
                                style={j ? { fontFamily: "'Fira Code', monospace", whiteSpace: 'nowrap' } : {}}>{c}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {nota && <p className="text-[0.78rem] text-gray-500 mt-2" style={{ margin: '0.5rem 0 0' }}>{nota}</p>}
    </div>
);

/* ============================================================================
   BLOQUE 0 · El encargo y lo que declara antes de mirar
============================================================================ */
const Bloque0 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const f = D.fondos[ejes.fondo];
    const b = D.tes[ejes.tes];
    const distDeclarada = DECLARADA.vol - D.publicado.frontera_al_retorno;
    return (
        <div>
            <SectionHeader title="Bloque 0 · El encargo" />

            <Motivacion icon="fa-landmark"
                gancho="Nadie le pide que programe. Le piden que diga qué significa cada cifra, qué no muestra y cuánto cuesta en pesos equivocarse.">
                El jueves se reúne el comité de inversiones con dos propuestas, y usted es quien las
                revisa: la mesa de riesgos ya corrió todas las cifras. La primera propone mover el fondo
                hermano que a usted le asignaron —los mismos cuatro emisores, otros pesos— hacia la
                cartera de mínima CVaR del capítulo 8, toda o en parte. La segunda, cambiar el bono de
                diez años del tramo de TES por un TES real que el comité tiene en la mira.
            </Motivacion>

            <h3>Su fondo</h3>
            <p>
                El fondo <strong>{ejes.fondo}</strong> tiene <strong>{miles(FONDO)} millones</strong> en
                los cuatro emisores de la Bolsa de Valores de Colombia que usa el curso, con estos pesos:{' '}
                <strong>{pesosTexto(f.pesos)}</strong>. Ninguno pasa del {dec(TOPE * 100, 0)} % por
                emisor, que es el tope que el curso declaró en el capítulo 7. El panel es el de siempre:
                de {fecha(D.panel.desde)} a {fecha(D.panel.hasta)}, {miles(D.panel.sesiones)} ruedas. La
                cartera declarada del curso, con la que lo va a comparar, pesa{' '}
                {pesosTexto(DECLARADA.pesos)}.
            </p>

            <h3>Su TES</h3>
            <p>
                El comité propone poner <strong>{miles(NOMINAL)} millones nominales del TES tasa fija{' '}
                {b.nemo}</strong> —cupón anual del {dec(b.cupon, 2)} %, vence el {fecha(b.vence)}— en lugar
                del bono de diez años del tramo de los capítulos 9 y 10, que tiene cupón del{' '}
                {dec(BONO10.flujos[0].flujo, 2)} % y los mismos {miles(NOMINAL)} millones nominales. Todo
                se valora el {fecha(D.meta.fecha_valoracion)}, con la curva del Banco de la República de
                ese día.
            </p>

            <CalloutPro tema="warn" titulo="Las cifras están hechas; la lectura no"
                subtitulo="Y eso no lo hace más fácil">
                <p style={{ margin: 0 }}>
                    Todas las cifras y todas las gráficas están calculadas con las convenciones del
                    curso. Algunas preguntas piden cuentas cortas —restar dos cifras, pasar una tasa a
                    pesos, escalar una cobertura—, y ninguna pide programar. Un modelo de lenguaje{' '}
                    <strong>también lee bien estas cifras</strong>: se midió con el taller de la unidad 1.
                    Lo que no hace por usted es sostenerlas diez minutos en voz alta, haber movido el
                    deslizador que registra su barrido, ni ser coherente con lo que declaró antes de ver
                    los resultados. Por eso la sustentación pesa el 35 %, lo escrito no puede valer más de un
                    punto por encima de lo que sostenga en ella, y hay cuatro bloques sin IA.
                </p>
            </CalloutPro>

            <h3>Las reglas</h3>

            <NivelIA nivel={1} nota="Este bloque es de nivel 1 · No AI: una declaración y una predicción solo valen si son suyas y anteriores a los datos. Nivel 3, con bitácora, en los bloques 1, 2, 6 y 7; nivel 1 · No AI en el 0, el 3, el 4 y el 5." />

            <Accordion items={[
                {
                    titulo: 'Qué puntúa y qué no',
                    contenido: <>
                        Puntúan las <strong>respuestas escritas</strong> y las casillas de los dos
                        barridos. Los ejercicios que se califican solos —los que traen botón de
                        «Comprobar»— <strong>valen cero</strong>: llevan la respuesta dentro del archivo.
                        Están para que compruebe que entendió antes de escribir, y{' '}
                        <strong>sus intentos quedan registrados en la entrega</strong>; la sustentación
                        los mira.
                    </>,
                },
                {
                    titulo: 'Dónde están las respuestas',
                    contenido: <>
                        No en este archivo. Están en los capítulos 7 a 10, en los laboratorios que hay que
                        mover y en lo que usted decida. Un modelo al que le pegue este taller le contestará
                        el manual, y el manual no conoce las convenciones que el curso declaró ni las
                        cifras de su fondo y de su TES.
                    </>,
                },
                {
                    titulo: 'Su taller no es el de al lado',
                    contenido: <>
                        De su documento salen <strong>el fondo</strong> y <strong>el TES</strong>. Las
                        gráficas, las cifras y varias de las conclusiones cambian con ellos. Comparar el
                        procedimiento con un compañero es buena idea; copiar la cifra o la conclusión, no,
                        porque no es la suya.
                    </>,
                },
                {
                    titulo: 'La entrega y la sustentación',
                    contenido: <>
                        El último bloque genera un archivo con todo lo que escribió, las marcas de tiempo y
                        un código de verificación. <strong>Descárguelo al terminar cada bloque</strong> —el
                        botón está en el bloque 7—, no solo al final. La sustentación oral de diez minutos se hace sin IA y sobre lo que
                        entregó: una cifra suya que elige quien califica, un razonamiento rehecho con una
                        variación y una de las tres preguntas que usted escriba en el bloque 7.{' '}
                        <strong>Lo escrito no puede valer más de un punto por encima de lo que sostenga en
                        voz alta</strong>: con 3,0 en la sustentación, el taller cuenta como mucho 4,0.
                    </>,
                },
            ]} />

            <h3>Antes de abrir los bloques 1 y 2</h3>

            <RespuestaAbierta id="P0.1" etiqueta="P0.1 · Las convenciones con las que va a leer"
                minPalabras={90} filas={8}
                enunciado={<>
                    <p style={{ marginTop: 0 }}>
                        Antes de ver una sola gráfica de este taller, declare las cuatro convenciones con
                        las que va a leer los bloques 1 y 2. Para cada una, <strong>qué decide usted y
                        por qué</strong>, con un porqué suyo:
                    </p>
                    <ol className="text-[0.92rem] text-gray-700" style={{ listStyleType: 'decimal', paddingLeft: '1.4rem' }}>
                        <li>La ventana de estimación de las medidas del fondo, y la alternativa que reportaría al lado.</li>
                        <li>La tasa libre de riesgo: cuál, en qué capitalización, y cómo la pone en la escala de un rendimiento logarítmico.</li>
                        <li>La capitalización con la que lee la curva del Banco de la República.</li>
                        <li>La base con la que cuenta los días de un TES, y el día en que se liquida la compra.</li>
                    </ol>
                    <p style={{ marginBottom: 0 }}>
                        <strong>Todo lo que siga se juzga contra esto.</strong> Cambiar de opinión después
                        no es un problema: es un hallazgo, si lo dice. Lo que no vale es volver aquí a
                        reescribir la declaración; el archivo registra cuándo escribió cada cosa.
                    </p>
                </>}
                ayuda="Cuatro decisiones, cuatro porqués. Se califica que sean suyas y que después las use." />

            <RespuestaAbierta id="P0.2" etiqueta="P0.2 · Lo que espera ver"
                minPalabras={50} filas={5}
                enunciado={<>
                    <p style={{ marginTop: 0 }}>También antes de mirar, dos predicciones con su porqué:</p>
                    <ol className="text-[0.92rem] text-gray-700" style={{ listStyleType: 'lower-alpha', paddingLeft: '1.4rem' }}>
                        <li>
                            Con los pesos de su fondo, ¿quedará más cerca o más lejos de la frontera
                            sin tope que la cartera declarada, que a igual w′μ está a{' '}
                            {dec(distDeclarada, 2)} pp de volatilidad de esa frontera (capítulo 7)? ¿Qué
                            emisor cree que lo explica?
                        </li>
                        <li>
                            ¿La curva del Banco le pondrá a su TES más precio o menos que el que le puso el
                            mercado ese mismo día? ¿Por qué lo cree?
                        </li>
                    </ol>
                    <p style={{ marginBottom: 0 }}>
                        Se califica el razonamiento y que sea previo, no el acierto. En P6.3 va a volver
                        sobre esto.
                    </p>
                </>}
                ayuda="Una predicción que acierta sin razón vale menos que una que falla con una razón que después se puede corregir." />
        </div>
    );
};

/* ============================================================================
   BLOQUE 1 · Las gráficas de su fondo
============================================================================ */
/* La frontera completa de mínima varianza: la rama baja, de la congelada, y la
   eficiente, ordenadas por w′μ. La rama baja hace falta porque un fondo puede
   rendir menos que la mínima varianza, y entonces su punto «a la misma w′μ» está
   en ella y no en la eficiente. */
const fronteraCompleta = (inferior, eficiente) => {
    const pts = [...inferior, ...eficiente].sort((a, b) => a.ret - b.ret);
    return pts.filter((p, i) => i === 0 || p.ret !== pts[i - 1].ret);
};

const GraficaFrontera = ({ fondo }) => {
    const f = D.fondos[fondo];
    usePlotly('g-frontera',
        () => {
            const sin = fronteraCompleta(D.comunes.frontera_sin_tope_inferior, D.comunes.frontera_sin_tope);
            const con = fronteraCompleta(D.comunes.frontera_con_tope_inferior, D.comunes.frontera_con_tope);
            /* La punta izquierda de la línea con tope es su mínima varianza. */
            const mvc = con.reduce((a, p) => (p.vol < a.vol ? p : a));
            const fr = f.frontera;
            const punto = (x, y, name, color, symbol, size, extra = {}) => ({
                x: [x], y: [y], type: 'scatter', mode: 'markers', name,
                marker: { color, symbol, size, line: { color: '#FFFFFF', width: 1 }, ...extra },
                hovertemplate: `${name}<br>volatilidad %{x:.4f} %<br>w′μ %{y:.4f} %<extra></extra>`,
            });
            return [
                {
                    x: sin.map(p => p.vol), y: sin.map(p => p.ret), type: 'scatter', mode: 'lines',
                    name: 'Frontera sin tope (las dos ramas)', line: { color: PALETA.primario, width: 2 },
                    hovertemplate: 'sin tope<br>volatilidad %{x:.4f} %<br>w′μ %{y:.4f} %<extra></extra>',
                },
                {
                    x: con.map(p => p.vol), y: con.map(p => p.ret), type: 'scatter', mode: 'lines',
                    name: `Frontera con tope del ${dec(TOPE * 100, 0)} % (las dos ramas)`, line: { color: PALETA.secundario, width: 2 },
                    hovertemplate: 'con tope<br>volatilidad %{x:.4f} %<br>w′μ %{y:.4f} %<extra></extra>',
                },
                /* Los emisores quedan fuera del recuadro: sin leyenda, para que no la
                   alarguen en un teléfono; el cursor los nombra. */
                ...CORTOS.map((c, i) => ({ ...punto(D.panel.emisores.sigma[i], D.panel.emisores.mu[i], NOMBRES[c], PALETA.gris, 'circle', 9), showlegend: false })),
                /* Los círculos huecos van ANTES que las carteras con nombre: en algún
                   fondo uno cae sobre el rombo de la mínima CVaR y lo tapaba. */
                {
                    x: [fr.vol_al_retorno_sin_tope, fr.vol_al_retorno_con_tope, f.vol, f.vol],
                    y: [f.wmu, f.wmu, fr.ret_al_riesgo_sin_tope, fr.ret_al_riesgo_con_tope],
                    customdata: ['sin tope, a la misma w′μ', 'con tope, a la misma w′μ',
                        'sin tope, a la misma volatilidad', 'con tope, a la misma volatilidad'],
                    type: 'scatter', mode: 'markers', name: 'Su fondo, llevado a cada frontera',
                    marker: { color: 'rgba(0,0,0,0)', size: 10, line: { color: PALETA.secundario, width: 2 } },
                    hovertemplate: '%{customdata}<br>volatilidad %{x:.4f} %<br>w′μ %{y:.4f} %<extra></extra>',
                },
                punto(DECLARADA.vol, DECLARADA.wmu, 'Declarada', '#64748B', 'square', 10),
                punto(MINVAR.vol, MINVAR.wmu, 'Mínima varianza sin tope', '#64748B', 'triangle-up', 11),
                punto(mvc.vol, mvc.ret, `Mínima varianza con tope del ${dec(TOPE * 100, 0)} %`, PALETA.secundario, 'triangle-up', 11),
                punto(MINCVAR.vol, MINCVAR.wmu, 'Mínima CVaR (97,5 %)', PALETA.agua, 'diamond', 11),
                punto(f.vol, f.wmu, `Su fondo (${fondo})`, PALETA.secundario, 'star', 16),
            ];
        },
        () => EJES({
            xaxis: { title: 'Volatilidad anual (%)', range: [23.5, 26.6] },
            yaxis: { title: 'w′μ anual (%) · la convención', range: [5.8, 9.6] },
            legend: { orientation: 'h', y: -0.22 },
            margin: { l: 64, r: 16, t: 12, b: 120 },
        }), [fondo]);
    return <ChartFrame id="g-frontera" height="chart-h-420"
        caption="Cada línea es la frontera de mínima varianza entera, sin tope y con el tope del 30 % por emisor: su punta izquierda, el triángulo, es la cartera de mínima varianza; de ahí hacia arriba la línea es eficiente, y hacia abajo cada cartera rinde menos que otra de la misma línea con el mismo riesgo. El eje vertical es w′μ, la convención del curso, que no es el rendimiento de ninguna cartera. Los círculos huecos son su fondo llevado a cada línea, a la misma w′μ y a la misma volatilidad: pase el cursor para leerlos. El recuadro está ampliado sobre las carteras; con doble clic se ven también los cuatro emisores." />;
};

const GraficaPerdidas = ({ fondo }) => {
    const f = D.fondos[fondo];
    usePlotly('g-perdidas',
        () => {
            const linea = (x, name, color, dash) => ({
                x: [x, x], y: [0.6, 900], type: 'scatter', mode: 'lines', name,
                line: { color, width: 2, dash },
                hovertemplate: `${name}: %{x:.4f} %<extra></extra>`,
            });
            const c975 = f.cola['0.975'], c99 = f.cola['0.99'];
            return [
                {
                    x: f.perdidas, type: 'histogram', name: `Su fondo (${fondo})`,
                    marker: { color: PALETA.primario, opacity: 0.6 },
                    xbins: { start: -20, end: 20, size: 0.25 },
                },
                {
                    x: MINCVAR.perdidas, type: 'histogram', name: 'Mínima CVaR',
                    marker: { color: 'rgba(0,0,0,0)', line: { color: PALETA.agua, width: 1.2 } },
                    xbins: { start: -20, end: 20, size: 0.25 },
                },
                linea(c975.var, 'VaR 97,5 %', PALETA.oro, 'dot'),
                linea(c975.cvar, 'CVaR 97,5 %', PALETA.oro, 'solid'),
                linea(c99.var, 'VaR 99 %', PALETA.secundario, 'dot'),
                linea(c99.cvar, 'CVaR 99 %', PALETA.secundario, 'solid'),
            ];
        },
        () => EJES({
            barmode: 'overlay',
            xaxis: { title: 'Pérdida diaria (%) · positiva es pérdida', range: [-18, 19.5] },
            yaxis: { title: 'Ruedas (escala logarítmica)', type: 'log', range: [-0.25, 2.7] },
            legend: { orientation: 'h', y: -0.22 },
            margin: { l: 64, r: 16, t: 12, b: 110 },
        }), [fondo]);
    return <ChartFrame id="g-perdidas" height="chart-h-400"
        caption={`Pérdidas diarias de su fondo en las ${miles(D.panel.sesiones)} ruedas, con la convención del curso: w′μ rueda a rueda. El eje vertical es logarítmico para que la cola se vea. El contorno es la mínima CVaR del capítulo 8; las líneas verticales son las medidas de su fondo, no las de ella.`} />;
};

const GraficaFzeta = ({ fondo }) => {
    const f = D.fondos[fondo];
    usePlotly('g-fzeta',
        () => {
            const [z0, , paso] = D.comunes.zeta_rejilla;
            const zs = f.F['0.975'].map((_, i) => +(z0 + i * paso).toFixed(2));
            const traza = (a, color, rotulo) => {
                const c = f.cola[a];
                return [
                    {
                        x: zs, y: f.F[a], type: 'scatter', mode: 'lines', name: `F(ζ) al ${rotulo}`,
                        line: { color, width: 2 },
                        hovertemplate: `α = ${rotulo}<br>ζ = %{x:.2f} %<br>F = %{y:.4f} %<extra></extra>`,
                    },
                    {
                        x: [c.zeta_orden], y: [c.cvar], type: 'scatter', mode: 'markers', name: `Mínimo al ${rotulo}`,
                        marker: { color, symbol: 'diamond', size: 11, line: { color: '#FFFFFF', width: 1 } },
                        hovertemplate: `mínimo al ${rotulo}<br>ζ = %{x:.4f} %<br>F = %{y:.4f} %<extra></extra>`,
                    },
                    {
                        x: [c.var, c.var], y: [3, 12], type: 'scatter', mode: 'lines', name: `VaR interpolado al ${rotulo}`,
                        line: { color, width: 1.2, dash: 'dot' }, hovertemplate: `VaR ${rotulo}: %{x:.4f} %<extra></extra>`,
                    },
                ];
            };
            return [...traza('0.975', PALETA.oro, '97,5 %'), ...traza('0.99', PALETA.secundario, '99 %')];
        },
        () => EJES({
            xaxis: { title: 'ζ (%)', range: [1.5, 6.5] },
            yaxis: { title: 'F(ζ) (%)', range: [3.5, 9.5] },
            legend: { orientation: 'h', y: -0.22 },
            margin: { l: 64, r: 16, t: 12, b: 110 },
        }), [fondo]);
    return <ChartFrame id="g-fzeta" height="chart-h-400"
        caption="F(ζ) = ζ + Σ máx(Lₛ − ζ, 0) / ((1 − α) S), evaluada cada 0,05 pp de ζ. Los rombos marcan su mínimo exacto, que no tiene por qué caer en la rejilla; las líneas punteadas, el VaR interpolado." />;
};

/* Las peores ruedas de su fondo, calculadas aquí desde la serie y las fechas: no
   viajan como lista. Eje de CATEGORÍAS: con fechas, Plotly reparte las barras
   sobre ocho años de calendario y quedan finísimas (zona ciega 12). */
const peoresRuedas = (perdidas, n) => perdidas
    .map((x, i) => ({ x, fecha: D.panel.fechas[i] }))
    .sort((a, b) => b.x - a.x)
    .slice(0, n);

const GraficaPeores = ({ fondo }) => {
    const f = D.fondos[fondo];
    const n975 = f.cola['0.975'].ruedas_cola, n99 = f.cola['0.99'].ruedas_cola;
    usePlotly('g-peores',
        () => {
            const p = peoresRuedas(f.perdidas, n975);
            const color = (r) => (r.fecha.startsWith('2020') ? PALETA.secundario
                : (r.fecha === '2025-02-19' ? PALETA.agua : PALETA.gris));
            return [{
                x: p.map(r => fecha(r.fecha)), y: p.map(r => r.x), type: 'bar', name: 'Pérdida',
                marker: { color: p.map(color) },
                hovertemplate: '%{x}<br>pérdida %{y:.4f} %<extra></extra>',
            }];
        },
        () => EJES({
            xaxis: { title: '', type: 'category', tickangle: -60, tickfont: { size: 9 } },
            yaxis: { title: 'Pérdida del día (%)' },
            showlegend: false,
            margin: { l: 64, r: 16, t: 24, b: 90 },
            shapes: [{
                type: 'line', xref: 'x', yref: 'paper', x0: n99 - 0.5, x1: n99 - 0.5, y0: 0, y1: 1,
                line: { color: PALETA.primario, width: 1.5, dash: 'dash' },
            }],
            annotations: [{
                xref: 'x', yref: 'paper', x: n99 - 0.5, y: 1.04, showarrow: false, xanchor: 'right',
                text: `← cola al 99 % (${n99})`, font: { size: 10, color: PALETA.primario },
            }],
        }), [fondo]);
    return <ChartFrame id="g-peores" height="chart-h-360"
        caption={`Las ${n975} peores ruedas de su fondo, de la peor a la menos mala: son las que deciden el CVaR al 97,5 %, y las ${n99} a la izquierda de la línea, el del 99 %. En rosa las de 2020; en azul verdoso la del 19/02/2025, la primera rueda del par defectuoso que el manifiesto del panel declara. Cada barra es una fecha, no un tramo del calendario.`} />;
};

const Bloque1 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const f = D.fondos[ejes.fondo];
    const c975 = f.cola['0.975'], c99 = f.cola['0.99'];
    /* A1 se calcula desde los valores que se MUESTRAN, con aritmética entera para
       que no haya medio redondeo: pesos enteros en % por μ y σ con cuatro
       decimales dan seis decimales exactos (zona ciega 4). */
    const mu4 = D.panel.emisores.mu, sg4 = D.panel.emisores.sigma;
    const entero = (xs) => f.pesos.reduce((s, w, i) => s + w * Math.round(xs[i] * 1e4), 0);
    const wmuMano = entero(mu4) / 1e6;
    const sumaSigma = entero(sg4) / 1e6;
    const brecha = (Math.round(f.exacto * 1e4) * 100 - entero(mu4)) / 1e6;
    const seis = (x) => x.toFixed(6);
    return (
        <div>
            <SectionHeader title="Bloque 1 · Las gráficas de su fondo" />

            <Motivacion icon="fa-chart-line"
                gancho="Cada pregunta de este bloque se contesta mirando, y cada respuesta tiene que traer una cifra suya.">
                La mesa le dejó una ficha y cuatro gráficas de su fondo. Están bien hechas. Lo malo de
                una gráfica bien hecha es que también muestra lo que no importa y esconde, sin mentir, lo
                que sí.
            </Motivacion>

            <NivelIA nivel={3} nota="Con bitácora. Puede pedirle a un modelo que le explique una gráfica; lo que escriba tiene que traer las cifras de la suya." />

            <Ficha titulo={`Ficha del fondo ${ejes.fondo}`}
                filas={[
                    ['', 'Su fondo', 'Declarada'],
                    ['Pesos ECO · BOG · SUR · ISA (%)', f.pesos.join(' · '), DECLARADA.pesos.join(' · ')],
                    ['Volatilidad anual', `${dec(f.vol, 4)} %`, `${dec(DECLARADA.vol, 4)} %`],
                    ['w′μ anual, la convención', `${dec(f.wmu, 4)} %`, `${dec(DECLARADA.wmu, 4)} %`],
                    ['Rendimiento anual exacto de la cartera', `${dec(f.exacto, 4)} %`, `${dec(DECLARADA.exacto, 4)} %`],
                    [`Razón de Sharpe con la convención, (w′μ − ${dec(RF, 4)} %) / σ`, dec(f.sharpe_conv, 4), dec((DECLARADA.wmu - RF) / DECLARADA.vol, 4)],
                    [`Razón de Sharpe exacta, (exacto − ${dec(RF, 4)} %) / σ`, dec(f.sharpe_exacto, 4), dec((DECLARADA.exacto - RF) / DECLARADA.vol, 4)],
                ]}
                nota={`La tasa libre de riesgo es la del curso, 7,00 % efectivo anual, en logaritmos: ln(1,07) = ${dec(RF, 4)} %. El rendimiento exacto es el logarítmico de la cartera rebalanceada a diario, log(Σ wᵢ e^rᵢ), anualizado por 252.`} />

            <h3>1 · La frontera</h3>
            <GraficaFrontera fondo={ejes.fondo} />

            <RespuestaAbierta id="P1.1" etiqueta="P1.1 · ¿Es eficiente su fondo?"
                minPalabras={80} filas={6}
                enunciado={<>
                    Lea la gráfica. ¿Está su fondo sobre la frontera? Dé su distancia a cada una de las dos
                    fronteras <strong>en volatilidad, a igual w′μ</strong>, y <strong>en w′μ, a igual
                    volatilidad</strong>; si alguna de esas distancias no dice lo que parece, diga por qué.
                    Después separe: ¿qué parte de la distancia a la frontera sin tope
                    es el precio del tope del {dec(TOPE * 100, 0)} %, y qué parte no la explica el tope?
                    Diga qué significa eso para el comité, que no puede quitar el tope.
                </>}
                ayuda="Cuatro distancias y una separación. Las cifras se leen pasando el cursor por los círculos huecos." />

            <h3>2 · La convención y el dinero</h3>

            <Andamio id="A1" nota="La brecha de la ficha, rehecha a mano con los valores que se ven. No puntúa.">
                <TablaTraza
                    titulo="A1 · De dónde sale la brecha de su fondo"
                    enunciado={<>Los cuatro emisores, en el orden Ecopetrol · Banco de Bogotá · Grupo Sura ·
                        ISA, tienen w′μ anual de <strong>{mu4.map(x => x.toFixed(4)).join(' · ')}</strong> % y
                        volatilidad anual de <strong>{sg4.map(x => x.toFixed(4)).join(' · ')}</strong> %. Con
                        los pesos de su fondo y el rendimiento exacto de la ficha, complete las tres casillas{' '}
                        <strong>sin redondear</strong>: con pesos de dos decimales y cifras de cuatro, cada
                        cuenta da seis decimales exactos.</>}
                    codigo={{
                        python: `w     = [${f.pesos.map(x => (x / 100).toFixed(2)).join(', ')}]
mu    = [${mu4.map(x => x.toFixed(4)).join(', ')}]
sigma = [${sg4.map(x => x.toFixed(4)).join(', ')}]

wmu    = sum(wi * mi for wi, mi in zip(w, mu))
suma_s = sum(wi * si for wi, si in zip(w, sigma))
brecha = ${f.exacto.toFixed(4)} - wmu          # el exacto de la ficha`,
                        r: `w     <- c(${f.pesos.map(x => (x / 100).toFixed(2)).join(', ')})
mu    <- c(${mu4.map(x => x.toFixed(4)).join(', ')})
sigma <- c(${sg4.map(x => x.toFixed(4)).join(', ')})

wmu    <- sum(w * mu)
suma_s <- sum(w * sigma)
brecha <- ${f.exacto.toFixed(4)} - wmu          # el exacto de la ficha`,
                    }}
                    columnas={[
                        { clave: 'paso', titulo: 'Paso' },
                        { clave: 'instruccion', titulo: 'Qué se calcula' },
                        { clave: 'valor', titulo: 'Valor (%)' },
                    ]}
                    filas={[
                        { paso: '1', instruccion: 'w′μ = Σ wᵢ μᵢ', valor: seis(wmuMano) },
                        { paso: '2', instruccion: 'Σ wᵢ σᵢ, la volatilidad si todas las correlaciones fueran 1', valor: seis(sumaSigma) },
                        { paso: '3', instruccion: 'exacto de la ficha − w′μ del paso 1', valor: seis(brecha) },
                    ]}
                    ocultas={['valor']}
                    pista="El paso 1 tiene que dar la w′μ de la ficha, salvo el redondeo de los μ en la última cifra. El 2 y el 3 llevan a dos brechas distintas: una está en la volatilidad y la otra en el rendimiento."
                />
            </Andamio>

            <Andamio id="A2" nota="Una sola pregunta, antes de escribir P1.2. No puntúa.">
                <MCQ pregunta="En la ficha de su fondo, ¿qué es w′μ?"
                    opciones={[
                        { texto: 'Un promedio ponderado de los rendimientos logarítmicos de los emisores de su fondo, que no es el de ninguna cartera', correcta: true,
                          justificacion: 'Los logarítmicos no agregan entre activos: el de una cartera es log(Σ wᵢ e^rᵢ), no Σ wᵢ rᵢ. Por eso la ficha trae al lado el rendimiento exacto, y la diferencia entre los dos es el beneficio de diversificación de su fondo medido en el rendimiento, como midió el capítulo 7 sobre la declarada.' },
                        { texto: 'El rendimiento logarítmico anual de su fondo, con los pesos devueltos a su valor al cierre de cada rueda', correcta: false },
                        { texto: 'La tasa compuesta a la que habría crecido cada peso invertido en su fondo durante los ocho años', correcta: false },
                        { texto: 'La media ponderada de los rendimientos simples diarios de sus cuatro emisores, anualizada multiplicando por las ruedas', correcta: false },
                    ]} />
            </Andamio>

            <RespuestaAbierta id="P1.2" etiqueta="P1.2 · ¿Le gana su fondo a la tasa libre de riesgo?"
                minPalabras={80} filas={6}
                enunciado={<>
                    <p style={{ marginTop: 0 }}>
                        Un miembro del comité lee la primera razón de Sharpe de la ficha y dice: «con la
                        convención del curso este fondo apenas le gana a la tasa libre de riesgo, o le
                        pierde; no vale el riesgo». Respóndale con las dos razones de la ficha.
                    </p>
                    <p style={{ marginBottom: 0 }}>
                        Después pase a pesos <strong>lo que su fondo le ganó a esa tasa en un año</strong>, sobre
                        los {miles(FONDO)} millones, con la cifra que de verdad es dinero. Diga qué cifra de la
                        ficha no se puede pasar a pesos y por qué.
                    </p>
                </>}
                ayuda="Una respuesta, una cuenta en pesos y una cifra que se niega a convertir, con su razón." />

            <h3>3 · La cola</h3>

            <GraficaPerdidas fondo={ejes.fondo} />
            <GraficaFzeta fondo={ejes.fondo} />
            <GraficaPeores fondo={ejes.fondo} />

            <Tabla
                cabecera={['', 'al 97,5 %', 'al 99 %']}
                filas={[
                    ['Escenarios que promedia el CVaR, (1 − α) S', dec(c975.escenarios, 2), dec(c99.escenarios, 2)],
                    ['VaR interpolado', `${dec(c975.var, 4)} %`, `${dec(c99.var, 4)} %`],
                    ['ζ* donde F(ζ) es mínima', `${dec(c975.zeta_orden, 4)} %`, `${dec(c99.zeta_orden, 4)} %`],
                    ['CVaR de su fondo, con la convención', `${dec(c975.cvar, 4)} %`, `${dec(c99.cvar, 4)} %`],
                    ['CVaR de su fondo, con rendimientos simples', `${dec(c975.cvar_exacto, 4)} %`, `${dec(c99.cvar_exacto, 4)} %`],
                    ['CVaR de su fondo sin las dos ruedas del par de febrero de 2025', `${dec(c975.cvar_sin_par, 4)} %`, `${dec(c99.cvar_sin_par, 4)} %`],
                    ['CVaR de la mínima CVaR del capítulo 8, con la convención', `${dec(c975.cvar_mincvar, 4)} %`, `${dec(c99.cvar_mincvar, 4)} %`],
                ]}
                nota={`CVaR por estadístico de orden, como la sección 3 del capítulo 8. Los porcentajes son del fondo de ${miles(FONDO)} millones. La mínima CVaR se optimizó al 97,5 % y sin tope: pesa ${pesosTexto(MINCVAR.pesos)}. Una cifra en millones de este taller está en una de dos escalas: la de la convención, w′μ rueda a rueda, que no es dinero de nadie (capítulo 8), o la de los rendimientos simples, que sí lo es. Cada vez que dé millones, diga en cuál.`} />

            <RespuestaAbierta id="P1.3" etiqueta="P1.3 · Qué decide la cola de su fondo"
                minPalabras={90} filas={7}
                enunciado={<>
                    <ol className="text-[0.92rem] text-gray-700" style={{ listStyleType: 'lower-alpha', paddingLeft: '1.4rem', marginTop: 0 }}>
                        <li>¿Dónde cae el VaR de su fondo y dónde el mínimo de F(ζ), a los dos niveles? ¿Qué vale ese mínimo, y por qué?</li>
                        <li>¿Cuántas ruedas deciden el CVaR a cada nivel, y está o no el par de febrero de 2025?</li>
                        <li>
                            Al 97,5 %, que es el nivel que la mínima CVaR optimiza: ¿qué pesa más en la cola de
                            su fondo, <strong>lo que cambia pasando a la mínima CVaR</strong> o{' '}
                            <strong>lo que mueve el par defectuoso</strong>? Dé las dos cifras en millones y diga
                            con qué escala las obtuvo. ¿Y al 99 %?
                        </li>
                    </ol>
                </>}
                ayuda="Las cuentas de (c) son dos restas y el paso a millones. Lo que se califica es qué hace usted con ellas." />

            <RespuestaAbierta id="P1.4" etiqueta="P1.4 · Lo que su frontera no muestra"
                minPalabras={60} filas={5}
                enunciado={<>
                    Tres cosas que la gráfica de la frontera <strong>no muestra</strong> y que el comité
                    podría creer que sí. Que sean de esa figura: no valen «no muestra el futuro» ni «no
                    muestra la liquidez» a secas. Para cada una, diga qué decisión cambiaría si se mostrara.
                </>}
                ayuda="Tres omisiones y tres decisiones. Una buena respuesta se puede comprobar mirando la gráfica." />
        </div>
    );
};

/* ============================================================================
   BLOQUE 2 · Las gráficas de su TES
============================================================================ */
const GraficaFlujos = ({ nemo }) => {
    const b = D.tes[nemo];
    usePlotly('g-flujos',
        () => {
            const n = b.flujos.length;
            return [
                {
                    x: BONO10.flujos.map(q => q.t), y: BONO10.flujos.map(q => q.vp), type: 'bar',
                    name: 'Bono de diez años del tramo', width: 0.35,
                    marker: { color: 'rgba(0,0,0,0)', line: { color: PALETA.gris, width: 1.5 } },
                    customdata: BONO10.flujos.map(q => q.peso),
                    hovertemplate: 'bono de diez años<br>t = %{x:.2f} años<br>VP %{y:.4f} por cada 100<br>peso %{customdata:.2f} %<extra></extra>',
                },
                {
                    x: b.flujos.map(q => q.t), y: b.flujos.map(q => q.vp), type: 'bar',
                    name: `TES ${anioTES(nemo)}`, width: 0.35,
                    marker: { color: b.flujos.map((_, i) => (i === n - 1 ? PALETA.secundario : PALETA.primario)) },
                    customdata: b.flujos.map(q => [fecha(q.fecha), q.flujo, q.peso]),
                    hovertemplate: '%{customdata[0]} · t = %{x:.4f} años<br>flujo %{customdata[1]:.2f} · VP %{y:.4f}<br>peso %{customdata[2]:.2f} %<extra></extra>',
                },
            ];
        },
        () => EJES({
            barmode: 'overlay',
            xaxis: { title: 'Años desde el 30/12/2025 (NL/365)' },
            yaxis: { title: 'Valor presente por cada 100 nominales' },
            legend: { orientation: 'h', y: -0.22 },
            margin: { l: 64, r: 16, t: 12, b: 96 },
        }), [nemo]);
    return <ChartFrame id="g-flujos" height="chart-h-360"
        caption="Valor presente de cada flujo por cada 100 nominales, descontado a la TIR de cada bono: la altura de una barra, dividida por el precio, es su peso en la duración de Macaulay. En rosa el último flujo de su TES; en contorno gris, el bono de diez años del tramo." />;
};

const GraficaPrecioTIR = ({ nemo }) => {
    const b = D.tes[nemo];
    usePlotly('g-precio',
        () => {
            const y0 = b.tir, p0 = precioTIR(b, y0);
            const ys = Array.from({ length: 81 }, (_, i) => +(y0 - 4 + i * 0.1).toFixed(4));
            const dur = (y) => p0 * (1 - b.dmod * (y - y0) / 100);
            const con = (y) => p0 * (1 - b.dmod * (y - y0) / 100 + 0.5 * b.convexidad * ((y - y0) / 100) ** 2);
            /* Las tres curvas quedan a menos de un píxel a ±100 pb: con el cursor en
               `closest` no se podía leer la revalorada. En `x unified` salen las tres
               a la vez, con el cambio de la TIR en pb (revisión del 2026-10-03). */
            const plantilla = (rot) => `${rot}: %{y:.4f}<extra></extra>`;
            return [
                {
                    x: ys, y: ys.map(y => precioTIR(b, y)), type: 'scatter', mode: 'lines', name: 'Precio revalorado',
                    line: { color: PALETA.primario, width: 2.5 },
                    customdata: ys.map(y => pb(Math.round((y - y0) * 100))),
                    hovertemplate: 'Δy %{customdata} pb · revalorado: %{y:.4f}<extra></extra>',
                },
                {
                    x: ys, y: ys.map(dur), type: 'scatter', mode: 'lines', name: 'Duración modificada',
                    line: { color: PALETA.oro, width: 1.6, dash: 'dash' }, hovertemplate: plantilla('duración'),
                },
                {
                    x: ys, y: ys.map(con), type: 'scatter', mode: 'lines', name: 'Duración con convexidad',
                    line: { color: PALETA.agua, width: 1.6, dash: 'dot' }, hovertemplate: plantilla('con convexidad'),
                },
                {
                    x: [y0], y: [p0], type: 'scatter', mode: 'markers', name: '30/12/2025',
                    marker: { color: PALETA.secundario, size: 10 }, hovertemplate: plantilla('30/12/2025'),
                },
            ];
        },
        () => EJES({
            xaxis: { title: 'TIR efectiva anual (%)', hoverformat: '.4f' },
            yaxis: { title: 'Precio sucio por cada 100 nominales' },
            hovermode: 'x unified',
            legend: { orientation: 'h', y: -0.22 },
            margin: { l: 64, r: 16, t: 12, b: 96 },
        }), [nemo]);
    return <ChartFrame id="g-precio" height="chart-h-400"
        caption="Precio sucio por cada 100 nominales contra la TIR, recalculado con los flujos de su TES, cada 10 pb. La recta es lo que anticipa la duración modificada y la curva punteada, la duración con convexidad, las dos desde el precio del 30/12/2025. El cursor da las tres a la vez, con el cambio de la TIR en pb." />;
};

const GraficaCurvaSEN = ({ nemo }) => {
    usePlotly('g-curva',
        () => {
            const sp = D.curva.spot;
            const suyo = (r) => r.nemo === nemo;
            const otros = D.sen.filter(r => !suyo(r)), el = D.sen.filter(suyo);
            const sen = (rs, name, color, size) => ({
                x: rs.map(r => r.plazo), y: rs.map(r => r.tir_sen), type: 'scatter', mode: 'markers', name,
                marker: { color, size, symbol: 'circle-open', line: { width: 2 } },
                error_y: {
                    type: 'data', symmetric: false, color, thickness: 1.2, width: 3,
                    array: rs.map(r => r.tir_max - r.tir_sen), arrayminus: rs.map(r => r.tir_sen - r.tir_min),
                },
                customdata: rs.map(r => [r.vence, r.operaciones, r.tir_min, r.tir_max]),
                hovertemplate: 'TES %{customdata[0]} · %{customdata[1]} operaciones<br>mediana SEN %{y:.4f} %<br>rango %{customdata[2]:.3f}–%{customdata[3]:.3f} %<extra></extra>',
            });
            const curva = (rs, name, color, size) => ({
                x: rs.map(r => r.plazo), y: rs.map(r => r.tir_curva), type: 'scatter', mode: 'markers', name,
                marker: { color, size, symbol: 'x-thin', line: { width: 2, color } },
                customdata: rs.map(r => r.vence),
                hovertemplate: 'TES %{customdata} · plazo %{x:.2f} años<br>TIR con la curva %{y:.4f} %<extra></extra>',
            });
            return [
                {
                    x: sp.map(p => p.t), y: sp.map(p => p.s), type: 'scatter', mode: 'lines', name: 'Spot del Banco',
                    line: { color: PALETA.primario, width: 2 },
                    hovertemplate: 'spot a %{x:.2f} años: %{y:.4f} %<extra></extra>',
                },
                {
                    x: [1, 5, 10], y: D.curva.vertices, type: 'scatter', mode: 'markers', name: 'Vértices publicados',
                    marker: { color: PALETA.primario, size: 9, symbol: 'square' },
                    hovertemplate: 'vértice de %{x} años: %{y:.2f} %<extra></extra>',
                },
                sen(otros, 'SEN, mediana y rango', PALETA.gris, 7),
                curva(otros, 'TIR con la curva', PALETA.gris, 8),
                sen(el, `SEN · TES ${anioTES(nemo)}`, PALETA.secundario, 11),
                curva(el, `Curva · TES ${anioTES(nemo)}`, PALETA.secundario, 12),
            ];
        },
        () => EJES({
            xaxis: { title: 'Plazo (años, NL/365)' },
            yaxis: { title: 'Tasa efectiva anual (%)', range: [9.4, 13.7] },
            legend: { orientation: 'h', y: -0.2 },
            margin: { l: 64, r: 16, t: 12, b: 110 },
        }), [nemo]);
    return <ChartFrame id="g-curva" height="chart-h-420"
        caption="La línea es la curva spot del Banco del 30/12/2025, leída en efectiva anual, y los cuadrados son los tres vértices que el Banco publica. Las equis son la TIR que esa curva le pone a cada uno de los dieciséis TES tasa fija; los círculos y sus barras, la mediana y el rango de las TIR negociadas ese día en el SEN. Su TES va en rosa." />;
};

const Bloque2 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const b = D.tes[ejes.tes];
    const t = b.tramo;
    const pub = D.publicado;
    return (
        <div>
            <SectionHeader title="Bloque 2 · Las gráficas de su TES" />

            <Motivacion icon="fa-file-invoice-dollar"
                gancho="Un bono real no es uno de estudio: tiene intereses causados, pagos que no caen en aniversarios y un mercado que ese día dijo su propio precio.">
                El comité tiene en la mira el TES {anioTES(ejes.tes)}, con cupón del {dec(b.cupon, 2)} %. Lo
                pondría en lugar del bono de diez años del tramo. La mesa le dejó su ficha y tres
                gráficas; la última pone la curva del Banco contra lo que de verdad se negoció el
                30/12/2025.
            </Motivacion>

            <NivelIA nivel={3} nota="Con bitácora. Las cuentas son cortas; lo que se califica es qué concluye de ellas." />

            <Ficha titulo={`Ficha del TES ${b.nemo}`}
                filas={[
                    ['', `TES ${anioTES(ejes.tes)}`, 'Bono de diez años'],
                    ['Cupón anual', `${dec(b.cupon, 2)} %`, `${dec(BONO10.flujos[0].flujo, 2)} %`],
                    ['Vencimiento · último cupón pagado', `${fecha(b.vence)} · ${fecha(b.ultimo_cupon)}`, '30/12/2035 · —'],
                    ['Plazo, NL/365', `${dec(b.plazo, 4)} años`, `${dec(BONO10.flujos[BONO10.flujos.length - 1].t, 4)} años`],
                    ['Precio sucio con la curva, por cada 100', dec(b.sucio, 4), dec(BONO10.sucio, 4)],
                    ['Intereses causados · precio limpio', `${dec(b.causado, 4)} · ${dec(b.limpio, 4)}`, `${dec(0, 4)} · ${dec(BONO10.sucio, 4)}`],
                    [`Valor de ${miles(NOMINAL)} millones nominales`, `${miles(b.valor_mm)} millones`, `${miles(BONO10.sucio / 100 * NOMINAL)} millones`],
                    ['TIR efectiva anual', `${dec(b.tir, 4)} %`, `${dec(BONO10.tir, 4)} %`],
                    ['Duración de Macaulay · modificada', `${dec(b.dmac, 4)} · ${dec(b.dmod, 4)}`, `${dec(BONO10.dmac, 4)} · ${dec(BONO10.dmod, 4)}`],
                    ['Convexidad', dec(b.convexidad, 4), dec(BONO10.convexidad, 4)],
                    ['DV01 contra la TIR, millones por pb', dec(b.dv01, 2), dec(BONO10.dv01, 2)],
                    ['DV01 contra la curva, millones por pb', dec(b.dv01_curva, 2), '—'],
                    ['Con +100 pb en la TIR, revalorado', '— lea la gráfica —', `${miles(BONO10.mas100_mm)} millones`],
                ]}
                nota="Valorado el 30/12/2025 con la curva del Banco leída en efectiva anual, días en NL/365 sin ajustar las fechas y liquidación T+0: las convenciones octava y novena del curso." />

            <h3>1 · Los flujos</h3>
            <GraficaFlujos nemo={ejes.tes} />

            <RespuestaAbierta id="P2.1" etiqueta="P2.1 · De dónde sale la duración de su TES"
                minPalabras={70} filas={6}
                enunciado={<>
                    Lea la gráfica. ¿Qué fracción del precio de su TES paga su último flujo, y qué fracción
                    del suyo paga el último flujo del bono de diez años? Con eso, explique por qué la
                    duración de su TES es la que es frente a la del bono de diez años: ¿qué pone el plazo y
                    qué pone el cupón? Y una pregunta de razonamiento, sin cuentas: si su TES conservara su
                    vencimiento pero pagara el cupón del bono de diez años, {dec(BONO10.flujos[0].flujo, 2)} %,
                    ¿duraría más, menos o lo mismo, y por qué?
                </>}
                ayuda="Dos fracciones leídas en la gráfica y un razonamiento. El sentido de la última respuesta depende de su TES." />

            <h3>2 · Precio y TIR</h3>
            <GraficaPrecioTIR nemo={ejes.tes} />

            <RespuestaAbierta id="P2.2" etiqueta="P2.2 · Lo que anticipa la duración"
                minPalabras={80} filas={6}
                enunciado={<>
                    Con <strong>+100 pb</strong> en la TIR de su TES: ¿cuánto anticipa la duración, cuánto
                    la duración con convexidad y cuánto da la revaloración, en millones sobre los{' '}
                    {miles(NOMINAL)} nominales? Sin hacer la cuenta: con −100 pb, ¿la duración se
                    equivocaría por más, por menos o por lo mismo que con +100, y hacia qué lado? ¿Por
                    qué? Después compárelo con el bono de diez años, que con +100 pb pierde{' '}
                    {miles(-BONO10.mas100_mm)} millones y tiene duración modificada {dec(BONO10.dmod, 4)}:
                    ¿su TES pierde más o menos pesos que él, y su duración lo anunciaba?
                </>}
                ayuda="Tres cifras leídas en la gráfica, una asimetría razonada y una comparación que no siempre sale como se espera." />

            <h3>3 · La curva contra el mercado</h3>
            <GraficaCurvaSEN nemo={ejes.tes} />

            <RespuestaAbierta id="P2.3" etiqueta="P2.3 · ¿Acierta la curva con su TES?"
                minPalabras={90} filas={7}
                enunciado={<>
                    <ol className="text-[0.92rem] text-gray-700" style={{ listStyleType: 'lower-alpha', paddingLeft: '1.4rem', marginTop: 0 }}>
                        <li>¿La curva le pone a su TES más precio o menos que el mercado el 30/12/2025? ¿Cuántos pb de TIR y cuántos millones sobre los {miles(NOMINAL)} nominales?</li>
                        <li>¿Es eso un error de la curva, o cae dentro de lo que el mercado negoció ese día? ¿Con cuántas operaciones se mide ese mercado?</li>
                        <li>¿Su TES vence dentro o fuera de los tres vértices que el Banco publica? ¿Esperaría por eso que la curva se equivocara más o menos con él? Contrástelo con cuatro TES de la gráfica que usted elija, dos dentro y dos fuera de los vértices, y diga si cuatro le alcanzan.</li>
                        <li>
                            El capítulo 10 midió, sobre el TES de 2034, que la curva se equivocaba en{' '}
                            {firmado(pub.sen_2034[0])} pb ({firmado(pub.sen_2034[1])} millones). ¿La curva sirve
                            mejor o peor a su TES, en pb y en millones?
                        </li>
                    </ol>
                </>}
                ayuda="Para pasar pb a millones hay dos caminos, uno exacto y uno aproximado. Diga cuál usó." />

            <h3>4 · El tramo con su TES</h3>

            <Ficha titulo="El tramo de los capítulos 9 y 10, con su TES y con el bono de diez años"
                filas={[
                    ['', 'Con su TES', 'Del capítulo'],
                    ['Valor del tramo', `${miles(t.valor_mm)} millones`, `${miles(TRAMO.valor_mm)} millones`],
                    ['Duración modificada del tramo', dec(t.dmod, 4), dec(TRAMO.dmod, 4)],
                    ['DV01 contra la TIR · contra la curva, millones por pb', `${dec(t.dv01_tir, 2)} · ${dec(t.dv01_curva, 2)}`, `${dec(TRAMO.dv01_tir, 2)} · ${dec(TRAMO.dv01_curva, 2)}`],
                    ['Sensibilidad a los vértices de 1 · 5 · 10 años, millones por pb', t.vertices.map(v => dec(v, 2)).join(' · '), TRAMO.vertices.map(v => dec(v, 2)).join(' · ')],
                    ['Varianza mensual que quita una cobertura con el bono a la par de diez años, dimensionada para ese tramo · 2003–2025 y 2018–2025',
                        `${dec(t.varianza_quitada['2003'] * 100, 1)} % · ${dec(t.varianza_quitada['2018'] * 100, 1)} %`,
                        `${dec(TRAMO.varianza_quitada['2003'] * 100, 1)} % · ${dec(TRAMO.varianza_quitada['2018'] * 100, 1)} %`],
                ]}
                nota={`El capítulo 10 cubre el tramo del curso vendiendo ${miles(TRAMO.n10)} millones nominales del bono a la par de diez años, cuyo cupón es la tasa par de la curva, ${dec(D.curva.par10, 4)} %. Una sensibilidad negativa es una pérdida cuando el vértice sube un punto básico.`} />

            <RespuestaAbierta id="P2.4" etiqueta="P2.4 · ¿Le sirve la cobertura del capítulo?"
                minPalabras={60} filas={5}
                enunciado={<>
                    Con su TES en lugar del bono de diez años: ¿cuánto cambia el DV01 del tramo contra la
                    curva? La cobertura del capítulo 10, {miles(TRAMO.n10)} millones nominales, ¿se queda
                    corta o sobra, y en cuántos millones nominales? ¿Qué vértice carga ahora el riesgo del tramo,
                    y con qué signo cada uno?
                </>}
                ayuda="La cobertura es proporcional al DV01 contra la curva. Diga cuánto le sobra o le falta en nominales." />
        </div>
    );
};

/* ============================================================================
   BLOQUE 3 · Procedimientos: qué depende de qué
============================================================================ */
/* Las dos columnas de A3b son fijas y NINGUNA puede ir ordenada por el valor de
   sus respuestas: la primera versión ponía la izquierda en un orden que, en tres
   de los doce TES, coincidía con el de los costos de menor a mayor, y ordenar la
   derecha y repartirla por filas acertaba 5 de 5 (revisión del 2026-10-03). Con
   este orden —solución [4, 1, 3, 0, 2]— queda una pareja en su fila, ninguna
   estrategia de orden por valor, con o sin las parejas que se adivinan por su
   tamaño, pasa del azar en más de un cuarto de pareja en los doce TES, y ningún
   corrimiento ni espejo acierta más de una. La regla 19 del verificador lo vigila. */
const CONV_IZQ = [
    ['30/360', '30/360 en lugar de NL/365'],
    ['cupón semestral', 'Cupón semestral en lugar de anual'],
    ['Actual/360', 'Actual/360 en lugar de NL/365'],
    ['liquidación T+1', 'Liquidación T+1 en lugar de T+0'],
    ['pagos al día hábil', 'Pagos movidos al día hábil siguiente'],
];
const CONV_DER = ['liquidación T+1', 'cupón semestral', 'pagos al día hábil', 'Actual/360', '30/360'];

const Bloque3 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const b = D.tes[ejes.tes];
    const costos = b.costos_convencion_mm;
    /* Las fechas ISO son año-mes-día; `ql.Date` las pide día, mes, año. */
    const [aa, am, ad] = b.ultimo_cupon.split('-').map(Number);
    const [va, vm, vd] = b.vence.split('-').map(Number);
    const cup = (b.cupon / 100).toFixed(4), tir = (b.tir / 100).toFixed(6);
    /* La fórmula de la sección 2 se tipografía al montar el bloque: si el taller se
       abre directamente aquí, la identificación lo pinta sin cambio de sección y el
       `typesetMath` del `App` no corre. */
    useEffect(() => { typesetMath(); }, []);
    return (
        <div>
            <SectionHeader title="Bloque 3 · Procedimientos: qué depende de qué" />

            <Motivacion icon="fa-diagram-project"
                gancho="Un procedimiento que se entiende se puede desordenar a propósito y decir qué se rompe.">
                Antes de firmar, el comité quiere saber si usted entiende lo que la mesa corrió. No le
                pide el código: le pide saber qué paso necesita a cuál, dónde una librería decide por
                usted si no se lo impide, y cuándo un truco de modelación deja de ser exacto.
            </Motivacion>

            <NivelIA nivel={1}
                nota="Nivel 1 · No AI. De bloques como este sale el razonamiento que la sustentación le pide rehacer con una variación, sin nada delante." />

            <h3>1 · La curva, desde los bonos</h3>

            <Andamio id="A3a" nota="El bootstrapping (construir la curva cero desde los precios de los bonos) del capítulo 9, en el orden que exige. No puntúa.">
                <OrdenaPasos
                    titulo="A3a · Del precio de unos bonos a la curva cero"
                    enunciado="Siete pasos del bootstrapping. Un solo orden funciona, y cada paso nombra aquello que necesita."
                    pasos={[
                        'Ordenar los bonos del más corto al más largo, con sus precios sucios del mismo día',
                        'Con el más corto de esa lista, que ya solo paga un flujo, despejar el factor de descuento de su plazo',
                        'Con el bono que sigue, descontar sus cupones intermedios con los factores ya despejados',
                        'Restarle al precio de ese bono esos cupones descontados y despejar el factor de su último flujo',
                        'Repetir los dos pasos anteriores con cada bono que sigue, usando todos los factores despejados hasta él',
                        'Con todos los factores ya despejados, pasar cada uno a tasa spot efectiva anual',
                        'Leer la forward entre cada par de plazos consecutivos a partir de esas spot',
                    ]}
                    mezcla={[4, 6, 0, 5, 1, 3, 2]}
                    pista="Si un paso queda antes de aquello que nombra, su enunciado se queda sin referente."
                />
            </Andamio>

            <RespuestaAbierta id="P3.1" etiqueta="P3.1 · Por qué el bootstrapping es secuencial"
                minPalabras={70} filas={6}
                enunciado={<>
                    Nombre un paso que no pueda ir antes que otro y diga con precisión qué dato le faltaría.
                    Después: si el precio del tercer bono llega 0,50 por debajo de su valor, ¿qué les pasa
                    a los factores ya despejados, al del tercer plazo y a los siguientes? ¿Y a las dos
                    forwards que se apoyan en él? Diga qué esperaría ver en una gráfica de la forward y por
                    qué esa gráfica delata el precio malo antes que la de la spot.
                </>}
                ayuda="El capítulo 9 lo midió. Aquí se pide el mecanismo, no la cifra." />

            <h3>2 · La cola como programa lineal</h3>

            <p>
                El capítulo 8 minimiza F(ζ) cambiando el máximo por variables auxiliares, una por
                escenario:
            </p>
            <Eq>{'$$\\begin{gathered} \\min_{w,\\,\\zeta,\\,u}\\;\\; \\zeta + \\frac{1}{(1-\\alpha)\\,S}\\sum_{s=1}^{S} u_s \\\\[4pt] u_s \\,\\ge\\, L_s(w) - \\zeta, \\qquad u_s \\,\\ge\\, 0 \\end{gathered}$$'}</Eq>

            <RespuestaAbierta id="P3.2" etiqueta="P3.2 · Cuándo el truco es exacto"
                minPalabras={70} filas={6}
                enunciado={<>
                    <p style={{ marginTop: 0 }}>
                        ¿Por qué ese cambio es <strong>exacto</strong> y no una relajación? Diga qué haría el
                        solucionador con un uₛ más grande de lo necesario. Después diga en cuál de estos tres
                        problemas, que usan el mismo truco, <strong>deja de ser exacto</strong>, y por qué:
                    </p>
                    <ol className="text-[0.92rem] text-gray-700" style={{ listStyleType: 'lower-roman', paddingLeft: '1.4rem', marginBottom: 0 }}>
                        <li>Minimizar el CVaR al 97,5 % de su fondo añadiendo el tope del {dec(TOPE * 100, 0)} % por emisor.</li>
                        <li>Maximizar w′μ con la condición de que el CVaR al 99 % no pase de un límite, escrito con las mismas uₛ en esa restricción.</li>
                        <li>Minimizar un índice que propone un miembro del comité: el CVaR al 97,5 % menos la mitad del CVaR al 99 %, cada uno escrito con sus propias uₛ.</li>
                    </ol>
                </>}
                ayuda="Pregúntese, en cada problema, qué gana el solucionador si infla una uₛ." />

            <h3>3 · Su TES en QuantLib</h3>

            <Andamio id="A3b" nota="Cada convención mal puesta, con lo que le cuesta a su TES. No puntúa.">
                <Emparejamiento
                    titulo="A3b · Cada convención con lo que cuesta en su TES"
                    enunciado={`Cada convención se cambia sola y se revalora su TES a la TIR del SEN del 30/12/2025, sobre ${miles(NOMINAL)} millones nominales: lo que el precio sube (+) o baja (−) frente a las convenciones del curso. Es el método de la sección 5 del capítulo 10.`}
                    etiquetaIzq="Convención"
                    etiquetaDer="Lo que cuesta en su TES"
                    izquierda={CONV_IZQ.map(c => c[1])}
                    derecha={CONV_DER.map(k => `${firmado(costos[k])} millones`)}
                    solucion={CONV_IZQ.map(c => CONV_DER.indexOf(c[0]))}
                />
            </Andamio>

            <Andamio id="A4" nota="Un código que valora su TES con una sola línea mal. No puntúa.">
                <DetectaError
                    titulo="A4 · Su TES en QuantLib, con una línea defectuosa"
                    enunciado={`Un modelo de lenguaje escribió esto para valorar su TES a la TIR que le pone la curva. Todo lo demás está bien. Señale la línea defectuosa y clasifique el defecto.`}
                    lineas={{
                        python: [
                            'import QuantLib as ql',
                            'hoy = ql.Date(30, 12, 2025)',
                            'ql.Settings.instance().evaluationDate = hoy',
                            'conteo = ql.Actual365Fixed()',
                            `desde, hasta = ql.Date(${ad}, ${am}, ${aa}), ql.Date(${vd}, ${vm}, ${va})`,
                            'pagos = ql.Schedule(desde, hasta, ql.Period(ql.Annual), ql.WeekendsOnly(),',
                            '                    ql.Unadjusted, ql.Unadjusted, ql.DateGeneration.Backward, False)',
                            `bono = ql.FixedRateBond(0, 100.0, pagos, [${cup}], conteo, ql.Unadjusted)`,
                            `y = ql.InterestRate(${tir}, conteo, ql.Compounded, ql.Annual)`,
                            'print(round(ql.BondFunctions.cleanPrice(bono, y) + bono.accruedAmount(), 4))',
                        ],
                        r: [
                            'library(RQuantLib)',
                            'hoy <- as.Date("2025-12-30")',
                            'invisible(setEvaluationDate(hoy))',
                            'conteo <- "ActualFixed"',
                            `desde <- as.Date("${b.ultimo_cupon}"); hasta <- as.Date("${b.vence}")`,
                            'r <- FixedRateBond(',
                            '  bond = list(settlementDays = 0, issueDate = desde, dayCounter = conteo,',
                            '              paymentConvention = "Unadjusted"),',
                            `  rates = ${cup},`,
                            '  schedule = list(effectiveDate = desde, maturityDate = hasta, period = "Annual",',
                            '                  calendar = "WeekendsOnly", businessDayConvention = "Unadjusted",',
                            '                  terminationDateConvention = "Unadjusted"),',
                            '  calc = list(dayCounter = conteo, compounding = "Compounded", freq = "Annual",',
                            '              durationType = "Modified"),',
                            `  yield = ${tir})`,
                            'round(r$dirtyPrice, 4)',
                        ],
                    }}
                    lineaCorrecta={{ python: 4, r: 4 }}
                    tipos={TIPOS_ERROR_RIESGO}
                    tipoCorrecto={IDX_ERROR.convencion}
                    explicacion="La base de conteo es Actual/365 —ql.Actual365Fixed() en Python, «ActualFixed» en R—, que cuenta el 29 de febrero de los años bisiestos. Los TES cuentan en NL/365, que lo salta: es lo que explicaron las 6 199 operaciones de contado de diciembre de 2025 en el capítulo 10. En Python se escribe ql.Actual365Fixed(ql.Actual365Fixed.NoLeap); en R, «Actual365NoLeap»."
                    impacto={Math.round(costos['Actual/365']) === 0
                        ? `Medido como en A3b, a la TIR del SEN: en su TES no mueve el precio, porque ningún periodo que el bono cuenta de aquí a su vencimiento contiene un 29 de febrero. En un TES más largo sí lo movería, y por eso el defecto pasa: solo se nota cuando un 29 de febrero cae entre dos fechas que el bono cuenta.`
                        : `Medido como en A3b, a la TIR del SEN: en su TES, cambiar NL/365 por Actual/365 mueve el precio ${firmado(costos['Actual/365'])} millones sobre los ${miles(NOMINAL)} nominales. Es poco, y por eso pasa: el defecto solo se nota cuando un 29 de febrero cae entre dos fechas que el bono cuenta.`}
                />
            </Andamio>

            <RespuestaAbierta id="P3.3" etiqueta="P3.3 · Valorar su TES sin que la librería decida"
                minPalabras={90} filas={7}
                enunciado={<>
                    Valorar su TES con QuantLib según las convenciones del curso obliga a fijar siete cosas:
                    la capitalización con que se lee la curva, la base de conteo, la frecuencia del cupón,
                    el ajuste de las fechas de pago, el día de liquidación, el calendario y el tipo de
                    duración que se pide. Dé al menos dos pares en que fijar mal la primera vuelve inútil
                    fijar bien la segunda, y diga por qué. Después, para tres de ellas, diga qué pone
                    RQuantLib si no se fija —o <code>ZeroCurve</code>, en el caso de la curva— y{' '}
                    <strong>en qué dirección movería el precio de su TES</strong>. Puede usar los andamios
                    de arriba, pero no repita sus cifras: explique de dónde sale el signo.
                </>}
                ayuda="Dos pares con su porqué, y tres trampas con su signo explicado." />
        </div>
    );
};

/* ============================================================================
   BLOQUE 4 · Barridos con registro
============================================================================ */
/* L1 lee una malla precomputada: el CVaR de cada mezcla exige reordenar 1 916
   escenarios, y eso lo hizo el congelador con el estimador de orden del
   capítulo 8, cada 0,01 de θ. El navegador solo busca la fila. */
const filaTheta = (f, theta) => f.malla[Math.max(0, Math.min(f.malla.length - 1, Math.round(theta * 100)))];
const pesosMezcla = (f, theta) => f.pesos.map((w, i) => (1 - theta) * w + theta * MINCVAR.pesos[i]);

/* L2 revalora con los flujos. Todo se ancla en el precio que el NAVEGADOR calcula
   a la TIR del día, para que la revaloración valga cero exactamente en Δy = 0. */
const choqueTES = (b, dy) => {
    const p0 = precioTIR(b, b.tir);
    const d = dy / 1e4;
    const escala = p0 / 100 * NOMINAL;
    const dv01 = b.dmod * escala * 1e-4;
    const rev = (precioTIR(b, b.tir + dy / 100) - p0) / 100 * NOMINAL;
    const dur = -b.dmod * d * escala;
    const con = (-b.dmod * d + 0.5 * b.convexidad * d * d) * escala;
    return { rev, dur, con, dv01, eDur: Math.abs(rev - dur) / dv01, eCon: Math.abs(rev - con) / dv01 };
};

const Bloque4 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const f = D.fondos[ejes.fondo];
    const b = D.tes[ejes.tes];
    const base = filaTheta(f, 0);
    return (
        <div>
            <SectionHeader title="Bloque 4 · Los barridos: lo que solo se ve moviéndolo" />

            <Motivacion icon="fa-sliders"
                gancho="Las dos preguntas de este bloque son sobre un rango entero. Ninguna se contesta razonando: hay que barrerlo.">
                La mesa resolvió cada propuesta en un punto: su fondo contra la mínima CVaR, y su TES con
                un choque de 100 pb. El comité va a preguntar qué pasa entre medias y más allá. Eso no
                está en ningún informe ni en ningún capítulo: está en los dos deslizadores de abajo.
            </Motivacion>

            <NivelIA nivel={1}
                nota="Nivel 1 · No AI. Un modelo puede argumentar cualquier θ y cualquier umbral; lo que no puede es mover el deslizador. El taller registra qué valores recorrió usted." />

            <h3>1 · De su fondo a la mínima CVaR</h3>
            <p>
                El laboratorio mezcla su fondo con la mínima CVaR del capítulo 8: con θ = 0 es su fondo, con
                θ = 1 es la mínima CVaR, y en medio cada peso es (1 − θ) por el de su fondo más θ por el de
                ella. Para cada θ muestra la volatilidad y el CVaR a los dos niveles.
            </p>

            <Barrido id="P4.1"
                titulo="P4.1 · Barra θ de 0 a 1"
                enunciado={<>
                    Mueva θ por <strong>todo</strong> el rango y mire los dos paneles a la vez. Después
                    conteste las cuatro casillas; las dos últimas son las que más puntúan.
                </>}
                campos={[
                    { id: 'theta_menor', etiqueta: 'θ con el menor CVaR al 99 % con la convención (la línea rosa continua)', pista: 'dos decimales; si varios dan casi lo mismo, dé el tramo' },
                    { id: 'mejora_hasta', etiqueta: '¿Hasta qué θ el CVaR al 99 % con la convención sigue por debajo del de su fondo?', pista: 'dos decimales, o «nunca baja»' },
                    { id: 'a_la_par', etiqueta: '¿Mejoran a la par la volatilidad y el CVaR al 99 % en todo el recorrido? Diga en qué tramo de θ van en contra, si lo hay, y por qué puede pasar.', largo: true },
                    { id: 'recomienda', etiqueta: '¿Qué θ le recomendaría al comité? Use una cifra en millones del laboratorio y diga en qué escala está: la de la convención o la de los rendimientos simples. La recomendación tiene que poder firmarse con las reglas del fondo.', largo: true },
                ]}>
                <Laboratorio id="lab-theta" modo="malla"
                    titulo={`Su fondo ${ejes.fondo} y la mínima CVaR, mezclados`}
                    enunciado="Malla precalculada cada 0,01 de θ con el CVaR por estadístico de orden del capítulo 8. Los porcentajes son del fondo."
                    altura="chart-h-420"
                    controles={[{
                        id: 'theta', etiqueta: 'θ, la fracción que pasa a la mínima CVaR', min: 0, max: 1, paso: 0.01,
                        valor: 0, formato: (v) => dec(v, 2),
                    }]}
                    calcular={(p) => {
                        /* Dos paneles con θ común (revisión del 2026-10-03). Con un solo panel
                           y la volatilidad en un eje derecho, cada serie llenaba su eje: la
                           volatilidad, que se mueve unas décimas, ocupaba toda la altura, y el
                           CVaR al 99 % parecía plano. Arriba va el CAMBIO de cada CVaR frente
                           a su fondo, en millones, para que las tres partan de cero; abajo, la
                           volatilidad. */
                        const th = f.malla.map(m => m.theta);
                        const actual = filaTheta(f, p.theta);
                        const mm = (k) => f.malla.map(m => (m[k] - base[k]) / 100 * FONDO);
                        return {
                            traces: [
                                { x: th, y: mm('cvar99'), type: 'scatter', mode: 'lines', name: 'CVaR 99 %, convención', line: { color: PALETA.secundario, width: 2.2 } },
                                { x: th, y: mm('cvar99_exacto'), type: 'scatter', mode: 'lines', name: 'CVaR 99 %, simples', line: { color: PALETA.secundario, width: 1.4, dash: 'dot' } },
                                { x: th, y: mm('cvar975'), type: 'scatter', mode: 'lines', name: 'CVaR 97,5 %, convención', line: { color: PALETA.oro, width: 2 } },
                                { x: [actual.theta], y: [(actual.cvar99 - base.cvar99) / 100 * FONDO], type: 'scatter', mode: 'markers', name: `θ = ${dec(actual.theta, 2)}`, marker: { color: PALETA.secundario, size: 11 } },
                                { x: th, y: f.malla.map(m => m.vol), type: 'scatter', mode: 'lines', name: 'Volatilidad anual (%)', xaxis: 'x', yaxis: 'y2', line: { color: PALETA.primario, width: 1.8 } },
                                { x: [actual.theta], y: [actual.vol], type: 'scatter', mode: 'markers', xaxis: 'x', yaxis: 'y2', showlegend: false, marker: { color: PALETA.primario, size: 9 } },
                            ],
                            layout: EJES({
                                xaxis: { title: 'θ', anchor: 'y2' },
                                yaxis: { title: 'ΔCVaR (millones)', domain: [0.42, 1], zeroline: true, zerolinecolor: '#64748B' },
                                yaxis2: { title: 'Volatilidad (%)', domain: [0, 0.3] },
                                legend: { orientation: 'h', y: -0.24 },
                                margin: { l: 64, r: 16, t: 12, b: 110 },
                            }),
                        };
                    }}
                    lectura={(p) => {
                        const m = filaTheta(f, p.theta);
                        const w = pesosMezcla(f, m.theta);
                        const d99 = (m.cvar99 - base.cvar99) / 100 * FONDO;
                        const d99x = (m.cvar99_exacto - base.cvar99_exacto) / 100 * FONDO;
                        return `θ = ${dec(m.theta, 2)} · pesos ${CORTOS.map((c, i) => `${c} ${dec(w[i], 2)}`).join(' · ')} · `
                            + `volatilidad ${dec(m.vol, 4)} % · CVaR 97,5 % ${dec(m.cvar975, 4)} % · CVaR 99 % ${dec(m.cvar99, 4)} % `
                            + `(${firmado(d99)} millones frente a su fondo con la convención; ${firmado(d99x)} con rendimientos simples) · `
                            + `w′μ ${dec(m.wmu, 4)} % · exacto ${dec(m.exacto, 4)} %`;
                    }}
                    nota="Arriba, el cambio de cada CVaR frente a su fondo (θ = 0), en millones: positivo es cola que se añade; negativo, cola que se quita. Abajo, la volatilidad anual de la mezcla." />
            </Barrido>

            <h3>2 · Hasta dónde le sirve la duración</h3>
            <p>
                El laboratorio revalora su TES con sus flujos para cada cambio de la TIR y lo compara con lo
                que anticipan la duración modificada y la duración con convexidad. El error se mide{' '}
                <strong>en DV01</strong>: un error de 10 DV01 es lo que un movimiento de 10 pb le haría al
                precio de su TES.
            </p>

            <Barrido id="P4.2"
                titulo="P4.2 · Barra la TIR de −400 a +400 pb"
                enunciado={<>
                    Mueva Δy por <strong>todo</strong> el rango, de los dos lados. Busque el primer punto
                    básico en que la duración sola se equivoca en 10 DV01 o más. Después conteste; las dos
                    últimas casillas son las que más puntúan.
                </>}
                campos={[
                    { id: 'umbral_sube', etiqueta: 'Δy en que la duración ya se equivoca en 10 DV01, con las tasas subiendo', pista: 'en pb, entero' },
                    { id: 'umbral_baja', etiqueta: 'Δy en que pasa lo mismo con las tasas bajando', pista: 'en pb, entero, con su signo' },
                    { id: 'asimetria', etiqueta: '¿Por qué no es simétrico? ¿Qué lado llega antes, y qué propiedad del precio lo explica?', largo: true },
                    { id: 'convexidad', etiqueta: '¿Qué arregla la convexidad y qué no? Mire su error en los dos extremos y diga si, con el mismo umbral de 10 DV01, la duración con convexidad le basta al comité para un choque de ±400 pb en su TES.', largo: true },
                ]}>
                <Laboratorio id="lab-dy"
                    titulo={`El TES ${anioTES(ejes.tes)} con la TIR movida`}
                    enunciado={`Revaloración con los flujos de su TES, sobre ${miles(NOMINAL)} millones nominales, desde su TIR del 30/12/2025.`}
                    altura="chart-h-400"
                    controles={[{
                        id: 'dy', etiqueta: 'Δy, cambio de la TIR en pb', min: -400, max: 400, paso: 1,
                        valor: 0, formato: (v) => `${v > 0 ? '+' : ''}${dec(v, 0)} pb`,
                    }]}
                    calcular={(p) => {
                        const xs = Array.from({ length: 161 }, (_, i) => -400 + 5 * i);
                        const cs = xs.map(x => choqueTES(b, x));
                        const a = choqueTES(b, p.dy);
                        /* En los TES largos el error a ±400 pb pasa de 160 DV01 y aplastaba
                           la línea de 10 contra el suelo: el eje se corta en 40. */
                        const tope = Math.min(40, 1.05 * Math.max(...cs.map(c => Math.max(c.eDur, c.eCon))));
                        return {
                            traces: [
                                { x: xs, y: cs.map(c => c.eDur), type: 'scatter', mode: 'lines', name: 'Error de la duración', line: { color: PALETA.oro, width: 2.2 } },
                                { x: xs, y: cs.map(c => c.eCon), type: 'scatter', mode: 'lines', name: 'Error con convexidad', line: { color: PALETA.agua, width: 2 } },
                                { x: [-400, 400], y: [10, 10], type: 'scatter', mode: 'lines', name: '10 DV01', line: { color: PALETA.secundario, width: 1.4, dash: 'dash' } },
                                { x: [p.dy, p.dy], y: [a.eDur, a.eCon], type: 'scatter', mode: 'markers', name: `Δy = ${pb(p.dy)} pb`, marker: { color: PALETA.primario, size: 10 } },
                            ],
                            layout: EJES({
                                xaxis: { title: 'Δy (pb)' },
                                yaxis: { title: 'Error frente a la revaloración (DV01)', range: [0, tope] },
                                legend: { orientation: 'h', y: -0.22 },
                                margin: { l: 64, r: 16, t: 12, b: 110 },
                            }),
                        };
                    }}
                    lectura={(p) => {
                        const c = choqueTES(b, p.dy);
                        return `Δy = ${pb(p.dy)} pb · revalorado ${firmado(c.rev)} millones · `
                            + `duración ${firmado(c.dur)} (error ${dec(c.eDur, 3)} DV01) · `
                            + `con convexidad ${firmado(c.con)} (error ${dec(c.eCon, 3)} DV01) · DV01 ${dec(c.dv01, 2)} millones`;
                    }}
                    nota="El DV01 es el de la duración modificada al precio del 30/12/2025: millones por punto básico sobre los nominales de su TES. Si el error pasa de 40 DV01, el eje se corta ahí; la lectura da siempre el valor." />
            </Barrido>
        </div>
    );
};

/* ============================================================================
   BLOQUE 5 · Audite a la IA: el informe de la mesa
   El taller declara que hay defectos —es una auditoría, no una trampa— y no dice
   cuántos ni cuáles. Cada cifra del informe sale de `D`; las correctas y el costo
   de cada defecto NO viajan: son la respuesta.
============================================================================ */
/* ⚠️ `TIPOS_ERROR_RIESGO` e `IDX_ERROR` vienen de TR-CORE: declararlos otra vez
   es un `SyntaxError` que deja el taller en blanco (lo pagó el T1). */
const Afirmacion = ({ n, children }) => (
    <p className="text-[0.92rem] text-gray-800 flex gap-3" style={{ margin: '0 0 0.7rem' }}>
        <span className="flex-shrink-0 font-bold text-white rounded px-1.5 h-fit text-[0.7rem] py-0.5"
            style={{ background: '#64748B' }}>{n}</span>
        <span>{children}</span>
    </p>
);

const Bloque5 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const f = D.fondos[ejes.fondo];
    const b = D.tes[ejes.tes];
    // Todas las cifras que imprime el borrador vienen de `informe`, como las pegó la mesa.
    const inf = f.informe;
    const infT = b.informe;
    const gana = inf.wmu >= RF;
    const fwd = infT.forward;
    const sumaSigma = inf.sigma_ponderada;
    return (
        <div>
            <SectionHeader title="Bloque 5 · Audite a la mesa: el informe que escribió una IA" />

            <Motivacion icon="fa-magnifying-glass"
                gancho="Tiene defectos, y este bloque es una auditoría, no una trampa. No le decimos cuántos. También tiene afirmaciones que suenan a error y no lo son.">
                La mesa le pidió a un modelo de lenguaje el borrador del informe para el comité, con las
                cifras de su fondo y de su TES, y lo pegó tal cual. El comité lo va a leer el jueves.
                Usted lo lee hoy.
            </Motivacion>

            <NivelIA nivel={1}
                nota="Nivel 1 · No AI, y aquí la razón es de lógica y no de política: pedirle a un modelo que audite a un modelo es circular. La auditoría la hace usted." />

            <div className="my-5 rounded-2xl border-2 p-5" style={{ borderColor: '#CBD5E1', background: '#F8FAFC' }}>
                <p className="text-[0.7rem] uppercase tracking-wider font-bold text-gray-500" style={{ margin: '0 0 0.8rem' }}>
                    Borrador · Informe al comité de inversiones · fondo {ejes.fondo} y TES {anioTES(ejes.tes)}
                </p>
                <Afirmacion n="1">
                    La rentabilidad anual del fondo en el periodo fue del {dec(inf.wmu, 2)} %,{' '}
                    {gana ? 'por encima' : 'por debajo'} del {dec(RF, 4)} % de la tasa libre de riesgo del curso: {gana ? 'le ganó' : 'le quedó debiendo'}{' '}
                    {dec(Math.abs(inf.wmu - RF), 2)} pp al año, que sobre los {miles(FONDO)} millones son{' '}
                    {miles(Math.abs(inf.wmu - RF) / 100 * FONDO)} millones.
                </Afirmacion>
                <Afirmacion n="2">
                    La volatilidad anual del fondo, {dec(inf.vol, 2)} % ({miles(inf.vol / 100 * FONDO)} millones), es
                    menor que el promedio ponderado de las de sus cuatro emisores, {dec(sumaSigma, 2)} %. La
                    diferencia es lo que diversificar le quita al riesgo, sin que ninguna correlación tenga
                    que ser negativa.
                </Afirmacion>
                <Afirmacion n="3">
                    Con el método histórico, sobre las {miles(D.panel.sesiones)} ruedas del panel y sin suponer
                    ninguna distribución, el CVaR al 97,5 % del fondo es del {dec(inf.cvar975, 2)} %: en un
                    día de cola, el fondo pierde en promedio {miles(inf.cvar975 / 100 * FONDO)} millones.
                </Afirmacion>
                <Afirmacion n="4">
                    El CVaR sale de minimizar F(ζ) sobre ζ con <code>cvxpy</code> o <code>lpSolve</code>. El mínimo
                    cae en una pérdida de la muestra, la que la tabla de la cola llama ζ*. Lo que vale F ahí
                    es el CVaR: el mismo programa da las dos cifras.
                </Afirmacion>
                <Afirmacion n="5">
                    Con la curva del Banco del 30/12/2025, el TES {anioTES(ejes.tes)} vale{' '}
                    {dec(infT.sucio, 4)} por cada 100 nominales, precio sucio. La curva se cargó en
                    QuantLib con <code>ql.ZeroCurve(fechas, tasas, conteo)</code>, con el conteo NL/365 del curso,
                    que es el del SEN.
                </Afirmacion>
                <Afirmacion n="6">
                    El DV01 del TES es de {dec(infT.dv01, 2)} millones por punto básico, con la duración
                    que devuelve <code>FixedRateBond</code> cuando se le pasa <code>calc</code> con el conteo y la
                    capitalización del curso. El del tramo con el TES es de {dec(infT.dv01_tramo, 2)}, y
                    para cubrirlo hay que vender {miles(infT.cobertura)} millones nominales del bono a la
                    par de diez años.
                </Afirmacion>
                <Afirmacion n="7">
                    La TIR del TES, {dec(infT.tir, 4)} %, queda por debajo de la tasa spot de la curva a su
                    vencimiento: la TIR es casi un promedio de las spot de todos sus flujos, y la del
                    último queda por encima de ese promedio.
                </Afirmacion>
                <Afirmacion n="8">
                    {b.forward1.length === 1
                        ? <>El cupón del TES se reinvertirá a la forward a un año que la curva del Banco marca para
                            su fecha de pago, {dec(fwd, 2)} %, y esa es la tasa que el mercado espera que rija entonces.</>
                        : <>Los cupones del TES se reinvertirán a la forward a un año que la curva del Banco marca
                            para cada fecha de pago, en promedio {dec(fwd, 2)} %, y esa es la tasa que el mercado
                            espera que rija en cada una.</>}
                </Afirmacion>
                <Afirmacion n="9">
                    Con tres bonos a la par, de uno, cinco y diez años, la cobertura del tramo de{' '}
                    {miles(TRAMO.valor_mm)} millones del capítulo 10 quitaría el 100 % de la varianza mensual,
                    y con uno solo el {dec(TRAMO.varianza_quitada['2003'] * 100, 1)} %. La diferencia es del
                    modelo, de tres grados de libertad, no del mercado.
                </Afirmacion>
            </div>

            <h3>El catálogo con el que se clasifica</h3>
            <ol className="text-[0.88rem] text-gray-700" style={{ listStyleType: 'decimal', paddingLeft: '1.4rem' }}>
                {TIPOS_ERROR_RIESGO.map((x, i) => <li key={i}>{x}</li>)}
            </ol>

            <RespuestaAbierta id="P5.1" etiqueta="P5.1 · Los defectos del informe"
                minPalabras={300} filas={12}
                enunciado={<>
                    Para cada defecto: <strong>localícelo</strong> por su número, <strong>clasifíquelo</strong>{' '}
                    con el catálogo, <strong>mídalo en pesos</strong> con las cifras de su fondo y de su TES
                    que traen los bloques 1 y 2, y <strong>corríjalo</strong>: qué debió decir el informe.
                    Un defecto que mueve una cifra en pesos y se señala sin ese costo vale la mitad; si no
                    mueve ninguna, diga qué decisión del comité cambiaría. Si una afirmación tiene dos
                    defectos, cuéntelos por separado.
                </>}
                ayuda="Número, tipo, costo en pesos y corrección, para cada uno." />

            <RespuestaAbierta id="P5.2" etiqueta="P5.2 · Lo que está bien"
                minPalabras={100} filas={7}
                enunciado={<>
                    Para cada afirmación que usted <strong>no</strong> señaló en P5.1, diga en una o dos
                    líneas por qué está bien, con una cifra suya que lo sostenga. Señalar como defecto lo que
                    no lo es cuesta lo mismo que dejar pasar uno.
                </>}
                ayuda="Una razón y una cifra por afirmación. «Es lo que dice el capítulo» no es una razón." />
        </div>
    );
};

/* ============================================================================
   BLOQUE 6 · La conciliación: dos decisiones y su costo
============================================================================ */
const GraficaLiquidez = ({ nemo }) => {
    const b = D.tes[nemo];
    usePlotly('g-liquidez',
        () => [{
            x: D.sen_ruedas.map(fecha), y: b.por_rueda_mm, type: 'bar', name: 'Nominal negociado',
            marker: { color: PALETA.primario },
            customdata: b.por_rueda_mm.reduce((acc, v) => [...acc, (acc.length ? acc[acc.length - 1] : 0) + v], []),
            hovertemplate: '%{x}<br>%{y:,.0f} millones<br>acumulado del mes: %{customdata:,.0f}<extra></extra>',
        }],
        () => EJES({
            xaxis: { title: '', type: 'category', tickangle: -60, tickfont: { size: 9 } },
            yaxis: { title: 'Millones nominales', tickformat: ',.0f' },
            showlegend: false,
            margin: { l: 72, r: 16, t: 12, b: 80 },
        }), [nemo]);
    return <ChartFrame id="g-liquidez" height="chart-h-320"
        caption={`Nominal de su TES negociado en cada una de las ${D.sen_ruedas.length} ruedas de diciembre de 2025 en el SEN, en millones. Una rueda sin barra es una rueda en que su TES no se negoció. El cursor da también lo negociado en el mes hasta esa rueda, contando desde la primera.`} />;
};

/* Las particiones, por sus años: «mitades» no decía cuáles. Las primeras 958
   ruedas son exactamente 2018–2021 (CLAUDE.md, taller 8). */
const PARTICION = {
    'mitades': '2018–21 → 2022–25',
    'mitades al revés': '2022–25 → 2018–21',
    'pares → impares': 'años pares → impares',
    'impares → pares': 'años impares → pares',
};

const Bloque6 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const f = D.fondos[ejes.fondo];
    const c6 = D.comunes;
    return (
        <div>
            <SectionHeader title="Bloque 6 · La conciliación: dos decisiones y su costo" />

            <Motivacion icon="fa-scale-balanced"
                gancho="Una decisión sin su costo en pesos no es una decisión: es una opinión.">
                El comité no quiere un resumen. Quiere dos firmas: si el fondo se mueve, y si el TES entra
                al tramo. Cada una con lo que cuesta si se equivoca, y con lo que usted no sabe. Lo que
                decida aquí tiene que cuadrar con lo que leyó en los bloques 1 y 2 y con lo que declaró
                en el 0.
            </Motivacion>

            <NivelIA nivel={3} nota="Con bitácora. Un modelo le puede ordenar los argumentos; la decisión y su costo son suyos." />

            <h3>1 · ¿Se mueve el fondo?</h3>
            <p>
                Antes de decidir, mire lo que la mínima CVaR hace <strong>fuera de la muestra</strong> con
                que se estimó. Se partió el panel en entrenamiento y prueba de cuatro maneras —las dos
                mitades en los dos sentidos y los años pares contra los impares en los dos—; en cada una se
                estimó la mínima CVaR al 97,5 % con la parte de entrenamiento y se midió la cola de las dos
                carteras en la de prueba, a los dos niveles.
            </p>
            <Tabla
                cabecera={['Partición · nivel', `CVaR de ${ejes.fondo} en prueba`, 'CVaR de la mínima CVaR en prueba']}
                filas={f.fuera.map(r => [`${PARTICION[r.particion] || r.particion} · ${dec(Number(r.alfa) * 100, 1)} %`, `${dec(r.fondo, 4)} %`, `${dec(r.mincvar, 4)} %`])}
                nota="Entrenamiento → prueba. Con la convención del curso y el estimador de orden del capítulo 8. En prueba no se reoptimiza nada: se evalúan las dos carteras tal como salieron del entrenamiento." />

            <RespuestaAbierta id="P6.1" etiqueta="P6.1 · ¿Pasa su fondo hacia la mínima CVaR, y hasta dónde?"
                minPalabras={150} filas={9}
                enunciado={<>
                    Use lo que encontró en P4.1, lo que mueve el par de febrero en P1.3 y lo que dice la tabla
                    de arriba. <strong>Decida</strong> —quedarse, moverse y hasta qué θ—, <strong>firme</strong>{' '}
                    y diga <strong>cuánto cuesta en millones si se equivoca</strong>, en la escala que
                    corresponda. Diga también qué dato le haría cambiar de decisión.
                </>}
                ayuda="Una decisión, su costo, y lo que la tumbaría." />

            <h3>2 · ¿Entra el TES al tramo?</h3>
            <GraficaLiquidez nemo={ejes.tes} />

            <RespuestaAbierta id="P6.2" etiqueta="P6.2 · ¿Sustituye el bono de diez años por su TES?"
                minPalabras={150} filas={9}
                enunciado={<>
                    Con la duración y el DV01 de P2.1 y P2.2, la cobertura de P2.4, el error de la curva de
                    P2.3 y la liquidez de la gráfica de arriba: con la liquidez de diciembre de 2025, si el
                    fondo tuviera que vender los {miles(NOMINAL)} millones nominales sin pasar del 20 % de lo
                    negociado en cada rueda, contando en orden desde la primera rueda del mes, ¿podría, y en
                    cuántas ruedas? <strong>Decida, firme</strong>, diga cuánto cuesta equivocarse, en
                    millones, y qué no sabe.
                </>}
                ayuda="El 20 % de cada rueda, acumulado desde la primera, es el 20 % del acumulado del mes, que el cursor de la gráfica da." />

            <h3>3 · Lo que no cuadra</h3>

            <RespuestaAbierta id="P6.3" etiqueta="P6.3 · Concilie"
                minPalabras={120} filas={8}
                enunciado={<>
                    <ol className="text-[0.92rem] text-gray-700" style={{ listStyleType: 'lower-alpha', paddingLeft: '1.4rem', marginTop: 0 }}>
                        <li>Su predicción de P0.2 contra lo que salió: qué acertó, qué no y por qué.</li>
                        <li>
                            Una tensión entre bloques, a elegir. O bien: ¿la curva se equivoca con su TES más o
                            menos que las convenciones que vio en el bloque 3 y en el informe? ¿Qué es más caro
                            en su TES, el código o la curva? O bien: el Sharpe del bloque 1 usa la tasa del
                            curso; la curva del 30/12/2025 marca a seis meses {dec(c6.rf_6m_efectiva, 4)} %
                            efectivo, {dec(c6.rf_6m_log, 4)} % en logaritmos. Con esa tasa, ¿cambia lo que
                            respondió en P1.2? ¿Cuál de las dos tasas usaría ante el comité, y por qué?
                        </li>
                    </ol>
                </>}
                ayuda="Una predicción revisada y una tensión resuelta con cifras suyas." />
        </div>
    );
};

/* ============================================================================
   BLOQUE 7 · La nota al comité, sus tres preguntas y la bitácora
============================================================================ */
const BloqueEntrega = () => (
    <div>
        <SectionHeader title="Bloque 7 · La nota al comité y la entrega" />

        <Motivacion icon="fa-paper-plane"
            gancho="Si el navegador pierde lo guardado —pasa—, el archivo que ya descargó sigue valiendo. La pestaña abierta, no.">
            El comité lee una página. Después viene la sustentación, que se hace sobre lo que usted
            entregue. Lo que se califica es el archivo de entrega, no lo que quedó en el navegador.
        </Motivacion>

        <NivelIA nivel={3} nota="Con bitácora. La nota y las tres preguntas son suyas; la bitácora es la condición para que se califique todo lo demás." />

        <RespuestaAbierta id="P7.1" etiqueta="P7.1 · La nota al comité"
            minPalabras={120} maxPalabras={250} filas={9}
            enunciado={<>
                Una nota para personas que no leen estadística, de 120 a 250 palabras. Empiece por las dos
                decisiones del bloque 6; después, lo que cuesta cada una en pesos y lo que no se sabe. Sin
                σ, ζ, «cuantil» ni «convexidad», y el CVaR y el DV01 dichos en pesos. Si una cifra no cabe
                en una frase que entienda un miembro del comité, no va.
            </>}
            ayuda="Dos decisiones, dos costos y una incertidumbre, en lenguaje de comité." />

        <RespuestaAbierta id="P7.2" etiqueta="P7.2 · Las tres preguntas que no quiere que le hagan"
            minPalabras={60} filas={6}
            enunciado={<>
                Escriba las tres preguntas que menos le gustaría recibir en la sustentación sobre su fondo y
                su TES, y diga por qué cada una. Una de ellas se la van a hacer.
            </>}
            ayuda="Una buena pregunta incómoda apunta a una cifra suya o a una decisión que usted firmó." />

        <RespuestaAbierta id="P7.3" etiqueta="P7.3 · Bitácora de IA"
            minPalabras={12} filas={12}
            enunciado={<>
                <p style={{ marginTop: 0 }}>
                    Una entrada por intercambio con un modelo de lenguaje, en orden, con estas cuatro cosas:
                </p>
                <ol className="text-[0.92rem] text-gray-700" style={{ listStyleType: 'decimal', paddingLeft: '1.4rem' }}>
                    <li><strong>En qué pregunta</strong> estaba trabajando.</li>
                    <li><strong>Qué le pidió</strong>: el prompt, resumido pero reconocible.</li>
                    <li><strong>Qué le devolvió</strong>, y si era correcto.</li>
                    <li><strong>Qué hizo usted con eso</strong>: lo usó, lo corrigió o lo descartó, y por qué.</li>
                </ol>
                <p style={{ margin: '0 0 0.5rem' }}>
                    Los bloques 0, 3, 4 y 5 son de nivel 1 · No AI. Si usó IA en ellos, dígalo aquí:{' '}
                    <strong>declararlo cuesta mucho menos que no declararlo</strong>.
                </p>
                <p style={{ margin: 0 }}>
                    <strong>Si no usó IA en absoluto</strong>, escríbalo aquí con esas palabras y firme la
                    afirmación con su nombre. Eso también es una bitácora.
                </p>
            </>}
            ayuda="Sin bitácora el taller no se califica. No es una sanción por sospecha: es uno de los productos evaluados, y está declarado desde la primera pantalla." />

        <h3>Antes de entregar</h3>

        <Accordion items={[
            {
                titulo: 'Qué se califica, y con qué peso',
                contenido: <>
                    La declaración previa 5 % · las gráficas de su fondo 18 % · las de su TES 18 % · los
                    procedimientos 12 % · los barridos 12 % · la auditoría del informe 15 % · la conciliación
                    15 % · la nota y las tres preguntas 5 %. Eso reparte el <strong>taller escrito</strong>,
                    que pesa el <strong>65 % de la nota</strong>; el <strong>35 % restante</strong> es la{' '}
                    <strong>sustentación oral de diez minutos</strong>, sin IA y sobre lo que entregue. El
                    taller escrito <strong>no puede valer más de un punto por encima</strong> de la
                    sustentación: si lo escrito no se sostiene en voz alta, vale lo de voz alta.
                </>,
            },
            {
                titulo: 'Qué NO se califica',
                contenido: <>
                    Los ejercicios con botón de «Comprobar» valen cero: llevan la respuesta dentro del archivo.
                    Sus intentos quedan registrados y se miran en la sustentación, pero no suman ni restan.
                </>,
            },
            {
                titulo: 'Qué lleva el archivo',
                contenido: <>
                    Su nombre y documento, su combinación, todas sus respuestas con la hora en que escribió
                    cada una por primera vez, los valores que recorrió en los dos laboratorios, los intentos
                    de cada andamio y un código de verificación. <strong>Ese código detecta un archivo
                    corrupto o truncado; no es una firma</strong>: el código que lo calcula está en esta
                    misma página.
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
    { id: 'b0', title: 'Bloque 0 · El encargo', icon: 'BookOpen', component: Bloque0 },
    { id: 'b1', title: 'Bloque 1 · Su fondo', icon: 'BarChart', component: Bloque1 },
    { id: 'b2', title: 'Bloque 2 · Su TES', icon: 'TrendingUp', component: Bloque2 },
    { id: 'b3', title: 'Bloque 3 · Procedimientos', icon: 'Layers', component: Bloque3 },
    { id: 'b4', title: 'Bloque 4 · Los barridos', icon: 'Sliders', component: Bloque4 },
    { id: 'b5', title: 'Bloque 5 · Audite a la mesa', icon: 'Bug', component: Bloque5 },
    { id: 'b6', title: 'Bloque 6 · La conciliación', icon: 'Scale', component: Bloque6 },
    { id: 'entrega', title: 'Bloque 7 · Nota y entrega', icon: 'Award', component: BloqueEntrega },
];

const App = () => {
    /* ⚠️ Con `localStorage` bloqueado, `getItem` LANZA: aquí va dentro de un
       `try`, como en el T1. Una pantalla en blanco sería el taller entero. */
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
        document.title = `Taller U2 · ${CONFIG.titulo} — Teoría del Riesgo`;
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
