/* ============================================================================
   CONTENIDO DEL TALLER INTEGRADOR · corte III · «La junta directiva»
   Se ensambla con `armar_taller.py --taller T3`. Las cifras salen de `D`, que el
   constructor genera desde `cifras_t3.json` con su lista blanca: **ninguna se
   escribe aquí a mano**. El bloque 1 viaja como series mensuales y el navegador
   calcula sobre ellas, con las convenciones del curso.

   ⚠️ Los comentarios de este archivo VIAJAN AL HTML que abre el estudiante:
   Babel corre en el navegador y el JSX se embebe como texto. Aquí no se escribe
   nunca qué le sale a un fondo, a un TES o a una ventana. Eso vive en
   `talleres/clave/T3/`.

   ⚠️ Un enunciado o un pie de gráfica solo afirma lo que vale para todas las
   combinaciones: la tabla de hechos de la clave de cifras dice cuáles. Es la
   zona ciega 6 del material.
============================================================================ */

const CONFIG = {
    numero: 'T3',
    titulo: 'La junta directiva',
    subtitulo: 'Taller calificado del corte III · validar con la unidad 1 lo que decidió la unidad 2, y medir el fondo entero',
    unidad: 'Integrador · capítulos 1 a 10',
    horas: 8,
    ra: 'RA1 a RA6',
    docente: 'Javier Mauricio Sierra',
    storageKey: 'tdr_t3_seccion',
};

/* Lo que `Entrega` comprueba. Cada id tiene que existir como componente y tener
   entrada en la clave y en la rúbrica. P7.3 pesa cero: es un requisito. */
const INVENTARIO = [
    { id: 'P0.1', tipo: 'abierta', bloque: 0, peso: 3, minPalabras: 110 },
    { id: 'P0.2', tipo: 'abierta', bloque: 0, peso: 2, minPalabras: 60 },
    { id: 'P1.1', tipo: 'abierta', bloque: 1, peso: 4, minPalabras: 80 },
    { id: 'P1.2', tipo: 'abierta', bloque: 1, peso: 4, minPalabras: 100 },
    { id: 'P1.3', tipo: 'abierta', bloque: 1, peso: 3, minPalabras: 70 },
    { id: 'P1.4', tipo: 'abierta', bloque: 1, peso: 3, minPalabras: 70 },
    { id: 'P2.1', tipo: 'abierta', bloque: 2, peso: 4, minPalabras: 70 },
    { id: 'P2.2', tipo: 'abierta', bloque: 2, peso: 5, minPalabras: 100 },
    { id: 'P2.4', tipo: 'abierta', bloque: 2, peso: 5, minPalabras: 80 },
    { id: 'P3.1', tipo: 'abierta', bloque: 3, peso: 5, minPalabras: 80 },
    { id: 'P3.3', tipo: 'abierta', bloque: 3, peso: 5, minPalabras: 70 },
    { id: 'P4.1', tipo: 'barrido', bloque: 4, peso: 6, campos: 4 },
    { id: 'P4.2', tipo: 'barrido', bloque: 4, peso: 6, campos: 4 },
    { id: 'P5.1', tipo: 'abierta', bloque: 5, peso: 10, minPalabras: 250 },
    { id: 'P5.2', tipo: 'abierta', bloque: 5, peso: 5, minPalabras: 100 },
    { id: 'P6.1', tipo: 'abierta', bloque: 6, peso: 5, minPalabras: 150 },
    { id: 'P6.2', tipo: 'abierta', bloque: 6, peso: 5, minPalabras: 150 },
    { id: 'P6.3', tipo: 'abierta', bloque: 6, peso: 5, minPalabras: 150 },
    { id: 'P6.4', tipo: 'abierta', bloque: 6, peso: 5, minPalabras: 150 },
    { id: 'P7.1', tipo: 'abierta', bloque: 7, peso: 6, minPalabras: 150 },
    { id: 'P7.2', tipo: 'abierta', bloque: 7, peso: 4, minPalabras: 80 },
    { id: 'P7.3', tipo: 'abierta', bloque: 7, peso: 0, minPalabras: 12 },
];

/* ---------------------------------------------------------------- utilidades
   `miles` con espacio, como los capítulos 7 y 11, y el signo menos tipográfico. */
const dec = (x, n = 2) => {
    const s = Number(x).toFixed(n).replace('.', ',');
    return s.startsWith('-') && Number(s.replace(',', '.')) !== 0 ? '−' + s.slice(1) : s.replace('-', '');
};
const miles = (x) => {
    const n = Math.round(x);
    const s = Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return n < 0 ? '−' + s : s;
};
const firmado = (x) => (Math.round(x) > 0 ? '+' : '') + miles(x);
const fecha = (iso) => {
    const [a, m, d] = iso.split('-');
    return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${a}`;
};
const MESES = ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sep.', 'oct.', 'nov.', 'dic.'];
const mesTexto = (ym) => { const [a, m] = ym.split('-'); return `${MESES[Number(m) - 1]} ${a}`; };
const pb = (x) => (x > 0 ? '+' : x < 0 ? '−' : '') + Math.abs(x);

const FONDO = D.meta.fondo_mm;          // millones
const NOMINAL = D.meta.nominal_mm;      // millones
const TOPE = D.meta.tope;
const NOMBRES = { ECO: 'Ecopetrol', BOG: 'Banco de Bogotá', SUR: 'Grupo Sura', ISA: 'ISA' };
const CORTOS = D.panel.cortos;
const PUB = D.publicado;
const Z99 = 2.3263478740408408;          // cuantil 99 % de la normal estándar
const ESTRATEGIAS = [
    ['mv30', `Mínima varianza con tope del ${Math.round(D.meta.tope * 100)} %`],
    ['cvar30', `Mínima CVaR 97,5 % con tope del ${Math.round(D.meta.tope * 100)} %`],
    ['mv', 'Mínima varianza sin tope'],
    ['cvar', 'Mínima CVaR 97,5 % sin tope (la del capítulo 8)'],
];

const pesosTexto = (p) => CORTOS.map((c, i) => `${NOMBRES[c]} ${dec(p[i], 0)} %`).join(' · ');
const anioTES = (nemo) => '20' + nemo.slice(-2);

/* ---------------------------------------------------------------- estadística
   El cuantil es el de tipo 7, el que usan el capítulo 10 y NumPy por omisión.
   El ES sigue la convención del capítulo 5: promedio simple de las pérdidas que
   exceden el VaR. */
const cuantil = (xs, p) => {
    const s = [...xs].sort((a, b) => a - b);
    const h = (s.length - 1) * p;
    const lo = Math.floor(h);
    const hi = Math.min(lo + 1, s.length - 1);
    return s[lo] + (h - lo) * (s[hi] - s[lo]);
};
const varEs = (perdidas, a) => {
    const v = cuantil(perdidas, a);
    const cola = perdidas.filter(x => x > v);
    return { var: v, es: cola.length ? cola.reduce((s, x) => s + x, 0) / cola.length : NaN, n: cola.length };
};
const media = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
const covar = (a, b) => { const ma = media(a), mb = media(b); return a.reduce((s, x, i) => s + (x - ma) * (b[i] - mb), 0) / (a.length - 1); };
const desv = (a) => Math.sqrt(covar(a, a));
const correl = (a, b) => covar(a, b) / (desv(a) * desv(b));
const icFisher = (r, n) => { const z = Math.atanh(r), e = 1.959963984540054 / Math.sqrt(n - 3); return [Math.tanh(z - e), Math.tanh(z + e)]; };
const suma = (...series) => series[0].map((_, i) => series.reduce((s, x) => s + x[i], 0));

/* ---------------------------------------------------------------- el fondo entero
   Las acciones: los 800 000 millones con los pesos de su fondo, rendimiento
   simple de cierre de mes a cierre de mes (sumar pesos exige simples). El tramo:
   los bonos de dos y cinco años del capítulo 9 y su TES en lugar del de diez,
   revalorados con cada cambio mensual de la curva aplicado a la de hoy (el
   método del capítulo 10), sin carry o con el carry del mes. */
const porEmisor = (pesos) => CORTOS.map((_, i) => D.mensual.emisores.map(r => r[i] * FONDO * pesos[i] / 100));
const bonos = (nemo, carry) => {
    const k = carry ? 'pyg_con' : 'pyg_sin';
    return [D.mensual.estudio.e2[k], D.mensual.estudio.e5[k], D.tes[nemo][k]];
};
const fondoEntero = (fondo, nemo, carry = false) => {
    const pesos = D.fondos[fondo].pesos;
    const em = porEmisor(pesos);
    const bs = bonos(nemo, carry);
    const acc = suma(...em);
    const tes = suma(...bs);
    const tot = suma(acc, tes);
    const valorTes = D.mensual.estudio.e2.valor_mm + D.mensual.estudio.e5.valor_mm + D.tes[nemo].valor_mm;
    return { em, bs, acc, tes, tot, valorTes, valorTot: FONDO + valorTes };
};
const medidas = (F) => {
    const L = { acc: F.acc.map(x => -x), tes: F.tes.map(x => -x), tot: F.tot.map(x => -x) };
    const out = {};
    for (const k of ['acc', 'tes', 'tot']) {
        out[k] = { 95: varEs(L[k], 0.95), 975: varEs(L[k], 0.975), 99: varEs(L[k], 0.99) };
    }
    return out;
};
/* VaR componente normal al 99 % (capítulo 4, sección 5), sobre las siete
   posiciones: cuatro emisores y tres bonos. Suma exactamente el VaR normal. */
const componente = (F) => {
    const X = [...F.em, ...F.bs];
    const cov = X.map(a => X.map(b => covar(a, b)));
    const fila = cov.map(r => r.reduce((s, x) => s + x, 0));
    const sp = Math.sqrt(fila.reduce((s, x) => s + x, 0));
    return { comp: fila.map(x => Z99 * x / sp), total: Z99 * sp };
};

/* ⚠️ `scatter` (SVG) y nunca `scattergl`: sin WebGL, `scattergl` no dibuja nada. */
const PALETA = { primario: '#3D008D', secundario: '#ED1E79', agua: '#0E7490', gris: '#94A3B8', oro: '#B45309', verde: '#15803D' };
const EJES = (extra = {}) => ({
    margin: { l: 64, r: 16, t: 12, b: 48 },
    paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
    font: { family: 'Inter, system-ui, sans-serif', size: 11 },
    separators: ', ',
    ...extra,
});

/* Una ficha de dos o tres columnas: rótulo y valores. */
const Ficha = ({ titulo, filas, nota }) => (
    <div className="my-5 rounded-xl border border-gray-200 overflow-hidden">
        {titulo && <div className="px-4 py-2 text-sm font-bold text-navy" style={{ background: '#F5F3FF' }}>{titulo}</div>}
        <div style={{ overflowX: 'auto' }}>
            <table className="w-full text-[0.88rem] border-collapse">
                <tbody>
                    {filas.map((f, i) => (
                        <tr key={i} className="border-t border-gray-100">
                            <td className="px-4 py-1.5 text-gray-700">{f[0]}</td>
                            {f.slice(1).map((c, j) => {
                                /* Un valor largo envuelve y se alinea a la izquierda: con `nowrap` se salía de la caja
                                   y la ficha mostraba rótulos sin valores (revisión del T3, a 1024 y a 375 px). */
                                const largo = String(c).length > 28;
                                return (
                                    <td key={j} className={`px-4 py-1.5 ${largo ? 'text-left' : 'text-right'} ${j ? 'text-gray-500' : 'font-semibold text-navy'}`}
                                        style={{ fontFamily: largo ? 'inherit' : "'Fira Code', monospace", whiteSpace: largo ? 'normal' : 'nowrap', minWidth: largo ? '12rem' : undefined }}>{c}</td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        {filas.some(f => f.length > 2) && (
            <p className="sm:hidden px-4 pt-1 text-[0.72rem] text-gray-400" style={{ margin: 0 }}>
                Deslice la tabla hacia la izquierda: a la derecha hay más columnas.
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
                        {cabecera.map((c, i) => <th key={i} className={`px-3 py-2 text-navy font-bold ${i ? 'text-right' : 'text-left'}`}
                            style={i ? {} : { position: 'sticky', left: 0, background: '#F5F3FF', minWidth: '9rem', zIndex: 1 }}>{c}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {filas.map((f, i) => (
                        <tr key={i} className="border-t border-gray-100">
                            {/* La primera columna queda fija al deslizar: en un teléfono, sin ella, se perdía de qué
                                fila era cada cifra (revisión del T3). */}
                            {f.map((c, j) => <td key={j} className={`px-3 py-1.5 ${j ? 'text-right' : 'text-left text-gray-700'}`}
                                style={j ? { fontFamily: "'Fira Code', monospace", whiteSpace: 'nowrap' } : { position: 'sticky', left: 0, background: '#FFFFFF', minWidth: '9rem', zIndex: 1 }}>{c}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <p className="sm:hidden text-[0.72rem] text-gray-400" style={{ margin: '0.3rem 0 0' }}>Deslice la tabla hacia la izquierda si no cabe.</p>
        {nota && <p className="text-[0.78rem] text-gray-500 mt-2" style={{ margin: '0.5rem 0 0' }}>{nota}</p>}
    </div>
);

/* ============================================================================
   BLOQUE 0 · El encargo y lo que decide antes de mirar
============================================================================ */
const Bloque0 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const f = D.fondos[ejes.fondo];
    const b = D.tes[ejes.tes];
    const inicio = D.panel.fechas[D.meta.inicio_comun];
    return (
        <div>
            <SectionHeader title="Bloque 0 · El encargo" />

            <Motivacion icon="fa-building-columns"
                gancho="La junta no pregunta si cada número está bien calculado. Pregunta si los números de las dos áreas se pueden poner en la misma frase.">
                Es diciembre de 2025 y la junta directiva del fondo revisa el año. La mesa de riesgos midió
                las acciones con las herramientas de la unidad 1; el comité de inversiones decidió con las de
                la unidad 2 y añadió un tramo de TES. Cada área entregó cifras impecables. Nadie las había
                puesto juntas, y usted es quien lo hace.
            </Motivacion>

            <h3>Su fondo, su TES y su ventana</h3>
            <p>
                El fondo y el TES son los mismos del taller de la unidad 2. <strong>Su fondo</strong> son las
                acciones del fondo <strong>{ejes.fondo}</strong>: {miles(FONDO)} millones en los cuatro emisores
                del curso, con <strong>{pesosTexto(f.pesos)}</strong>, ninguno por encima del{' '}
                {dec(TOPE * 100, 0)} %. <strong>El tramo</strong> son los bonos de dos y cinco años de los
                capítulos 9 y 10 y, en lugar del de diez años, <strong>el TES {b.nemo}</strong>, con cupón del{' '}
                {dec(b.cupon, 2)} %: {miles(NOMINAL)} millones nominales de cada uno. <strong>El fondo
                entero</strong> es su fondo más el tramo. Todo se valora el {fecha(D.meta.fecha_valoracion)}.
            </p>
            <p>
                Lo nuevo es <strong>la ventana del comité: {ejes.ventana} ruedas</strong>. El comité no deja
                quietas sus carteras optimizadas: cada {D.meta.cada} ruedas vuelve a estimar los pesos con las{' '}
                {ejes.ventana} ruedas anteriores. El bloque 2 las valida desde el {fecha(inicio)} hasta el
                final del panel.
            </p>

            <CalloutPro tema="warn" titulo="Las cifras están hechas; juntarlas no"
                subtitulo="Y es más difícil de lo que parece">
                <p style={{ margin: 0 }}>
                    Todas las cifras y las gráficas están calculadas con las convenciones del curso, y
                    ninguna pregunta pide programar. Un modelo de lenguaje <strong>lee bien estas
                    cifras</strong>: se midió con los dos talleres anteriores. Lo que no hace por usted es
                    sostenerlas en voz alta, haber movido los deslizadores que registran su barrido ni ser
                    coherente con lo que decidió antes de ver los resultados. Por eso la sustentación pesa el
                    35 %, lo escrito no puede valer más de un punto por encima de lo que sostenga en ella, y
                    hay cuatro bloques sin IA.
                </p>
            </CalloutPro>

            <h3>Las reglas</h3>

            <NivelIA nivel={1} nota="Este bloque es de nivel 1 · No AI: una decisión y una predicción solo valen si son suyas y anteriores a los datos. Nivel 3, con bitácora, en los bloques 1, 2, 6 y 7; nivel 1 · No AI en el 0, el 3, el 4 y el 5." />

            <Accordion items={[
                {
                    titulo: 'Qué puntúa y qué no',
                    contenido: <>
                        Puntúan las <strong>respuestas escritas</strong> y las casillas de los dos barridos. Los
                        ejercicios que se califican solos —los que traen botón de «Comprobar»—{' '}
                        <strong>valen cero</strong>: llevan la respuesta dentro del archivo. Están para que
                        compruebe que entendió antes de escribir, y <strong>sus intentos quedan registrados en
                        la entrega</strong>.
                    </>,
                },
                {
                    titulo: 'Dónde están las respuestas',
                    contenido: <>
                        No en este archivo. Están en los diez capítulos, en los laboratorios que hay que mover y
                        en lo que usted decida. Un modelo al que le pegue este taller le contestará el manual, y
                        el manual no conoce las convenciones que el curso declaró ni las cifras de su fondo, su
                        TES y su ventana.
                    </>,
                },
                {
                    titulo: 'Su taller no es el de al lado',
                    contenido: <>
                        De su documento salen <strong>el fondo</strong>, <strong>el TES</strong> y{' '}
                        <strong>la ventana del comité</strong>. Las gráficas, las cifras y varias de las
                        conclusiones cambian con ellos. Comparar el procedimiento con un compañero es buena
                        idea; copiar la cifra o la conclusión, no, porque no es la suya.
                    </>,
                },
                {
                    titulo: 'La entrega y la sustentación',
                    contenido: <>
                        El último bloque genera un archivo con todo lo que escribió, las marcas de tiempo y un
                        código de verificación. <strong>Descárguelo al terminar cada bloque</strong> —el botón
                        está en el bloque 7—, no solo al final. La sustentación oral de quince minutos se hace
                        sin IA y sobre lo que entregó: una cifra suya que elige quien califica, un razonamiento
                        rehecho con una variación y una de las tres preguntas que usted escriba en el bloque 7.{' '}
                        <strong>Lo escrito no puede valer más de un punto por encima de lo que sostenga en voz
                        alta</strong>: con 3,0 en la sustentación, el taller cuenta como mucho 4,0. Y{' '}
                        <strong>sin la bitácora de IA del bloque 7 el taller no se califica</strong>.
                    </>,
                },
            ]} />

            <h3>Antes de abrir el bloque 1</h3>

            <RespuestaAbierta id="P0.1" etiqueta="P0.1 · Lo que el curso no decidió por usted"
                minPalabras={110} filas={9}
                enunciado={<>
                    <p style={{ marginTop: 0 }}>
                        Juntar las dos unidades obliga a decidir cosas que ningún capítulo decidió. Antes de abrir
                        el bloque 1, decida cada una y diga <strong>por qué</strong>, con un
                        porqué suyo:
                    </p>
                    <ol className="text-[0.92rem] text-gray-700" style={{ listStyleType: 'lower-alpha', paddingLeft: '1.4rem' }}>
                        <li>¿El tramo de TES se suma a los {miles(FONDO)} millones de acciones o sale de ellos? ¿Qué le cambia eso a un VaR expresado en % del fondo?</li>
                        <li>Las acciones tienen precio diario; la curva del Banco, uno por mes. ¿En qué horizonte las junta, y qué pierde con esa elección?</li>
                        <li>¿El resultado mensual del tramo debe llevar el cupón que el bono causa en el mes, o solo el cambio de precio por la curva? ¿Por qué importa, si las acciones vienen en cierres ajustados por dividendos?</li>
                        <li>El comité reestima sus pesos cada {D.meta.cada} ruedas. En la prueba retrospectiva, ¿con qué pesos calcula el VaR de cada rueda, y con cuáles la pérdida que lo pone a prueba?</li>
                        <li>¿Qué medida y qué nivel le reporta a la junta, y cuántas observaciones hay detrás de esa cifra?</li>
                    </ol>
                    <p style={{ marginBottom: 0 }}>
                        <strong>El bloque 1 empieza con lo que fijó la junta.</strong> Que su decisión no
                        coincida no es un error: es un hallazgo, si lo dice y lo usa. Lo que no vale es volver
                        aquí a reescribirla; el archivo registra cuándo escribió cada cosa.
                    </p>
                </>}
                ayuda="Cinco decisiones, cinco porqués. Se califica que sean suyas, anteriores a los datos, y que después las use." />

            <RespuestaAbierta id="P0.2" etiqueta="P0.2 · Lo que espera ver"
                minPalabras={60} filas={5}
                enunciado={<>
                    <p style={{ marginTop: 0 }}>También antes de mirar, tres predicciones con su porqué:</p>
                    <ol className="text-[0.92rem] text-gray-700" style={{ listStyleType: 'lower-alpha', paddingLeft: '1.4rem' }}>
                        <li>Mes a mes, ¿las acciones de su fondo y su tramo de TES ganan y pierden juntos o al revés? ¿Se podrá distinguir esa relación del azar con ocho años de meses?</li>
                        <li>La mínima CVaR con el tope del {dec(TOPE * 100, 0)} %, reestimada con su ventana de {ejes.ventana} ruedas, ¿pasará la prueba de Kupiec?</li>
                        <li>Sumarle el tramo a las acciones, ¿le sube o le baja al fondo entero el VaR mensual al 95 % en pesos?</li>
                    </ol>
                    <p style={{ marginBottom: 0 }}>
                        Se califica el razonamiento y que sea previo, no el acierto. En los bloques 1 y 6 va a
                        volver sobre esto.
                    </p>
                </>}
                ayuda="Una predicción que acierta sin razón vale menos que una que falla con una razón que después se puede corregir." />
        </div>
    );
};

/* ============================================================================
   BLOQUE 1 · El fondo entero
============================================================================ */
const GraficaNube = ({ fondo, nemo }) => {
    usePlotly('g-nube',
        () => {
            const F = fondoEntero(fondo, nemo);
            const fechas = D.mensual.fechas;
            const orden = F.tot.map((x, i) => i).sort((a, b) => F.tot[a] - F.tot[b]).slice(0, 10);
            return [
                {
                    x: F.acc, y: F.tes, text: fechas.map(mesTexto), type: 'scatter', mode: 'markers',
                    name: 'Cada mes', marker: { color: PALETA.primario, size: 7, opacity: 0.55 },
                    hovertemplate: '%{text}<br>acciones %{x:,.0f}<br>tramo %{y:,.0f}<extra></extra>',
                },
                {
                    x: orden.map(i => F.acc[i]), y: orden.map(i => F.tes[i]), text: orden.map(i => mesTexto(fechas[i])),
                    type: 'scatter', mode: 'markers', name: 'Los diez peores meses del fondo entero',
                    marker: { color: 'rgba(0,0,0,0)', size: 14, line: { color: PALETA.secundario, width: 2 } },
                    hovertemplate: '%{text}<br>acciones %{x:,.0f}<br>tramo %{y:,.0f}<extra></extra>',
                },
            ];
        },
        () => EJES({
            xaxis: { title: 'Acciones, millones al mes', zeroline: true, zerolinecolor: '#64748B', tickformat: ',.0f', automargin: true },
            yaxis: { title: 'Tramo, millones al mes', zeroline: true, zerolinecolor: '#64748B', tickformat: ',.0f', automargin: true },
            legend: { orientation: 'h', y: -0.2 },
            margin: { l: 70, r: 16, t: 12, b: 100 },
        }), [fondo, nemo]);
    return <ChartFrame id="g-nube" height="chart-h-400"
        caption="Cada punto es un mes, de febrero de 2018 a diciembre de 2025: a la derecha ganan las acciones de su fondo y arriba gana su tramo. Los anillos marcan los diez meses en que el fondo entero, las dos partes sumadas, perdió más. El tramo se revalora como en el capítulo 10, sin el cupón que causa en el mes. Pase el cursor para leer el mes y las dos cifras." />;
};

const GraficaPeores = ({ fondo, nemo }) => {
    usePlotly('g-peores',
        () => {
            const F = fondoEntero(fondo, nemo);
            const fechas = D.mensual.fechas;
            const orden = F.tot.map((x, i) => i).sort((a, b) => F.tot[a] - F.tot[b]).slice(0, 10);
            const etiquetas = orden.map(i => mesTexto(fechas[i]));
            /* El tramo va en su propio panel: en el de las acciones sus barras medían uno o dos
               píxeles y P1.1 pide contar los meses en que perdió (revisión del T3). */
            return [
                { x: etiquetas, y: orden.map(i => F.acc[i]), type: 'bar', name: 'Acciones', marker: { color: PALETA.primario },
                  hovertemplate: '%{x}<br>acciones %{y:,.0f}<extra></extra>' },
                { x: etiquetas, y: orden.map(i => F.tot[i]), type: 'scatter', mode: 'markers', name: 'Fondo entero',
                  marker: { color: PALETA.secundario, size: 10, symbol: 'diamond' },
                  hovertemplate: '%{x}<br>fondo entero %{y:,.0f}<extra></extra>' },
                { x: etiquetas, y: orden.map(i => F.tes[i]), type: 'bar', name: 'Tramo de TES (panel de abajo)', xaxis: 'x', yaxis: 'y2',
                  marker: { color: orden.map(i => (F.tes[i] < 0 ? PALETA.agua : '#99D3DE')) },
                  hovertemplate: '%{x}<br>tramo %{y:,.0f}<extra></extra>' },
            ];
        },
        () => EJES({
            xaxis: { type: 'category', anchor: 'y2', automargin: true },
            yaxis: { title: 'Acciones y total', domain: [0.4, 1], zeroline: true, zerolinecolor: '#64748B', tickformat: ',.0f', automargin: true },
            yaxis2: { title: 'Tramo', domain: [0, 0.3], zeroline: true, zerolinecolor: '#64748B', tickformat: ',.0f', automargin: true },
            legend: { orientation: 'h', y: -0.28 },
            margin: { l: 64, r: 16, t: 12, b: 110 },
        }), [fondo, nemo]);
    return <ChartFrame id="g-peores" height="chart-h-360"
        caption="Los diez meses en que el fondo entero perdió más, del peor al menos malo, no por fecha. Arriba, lo que aportaron las acciones y el rombo de la suma; abajo, en su propia escala, lo que aportó el tramo: oscuro cuando perdió, claro cuando ganó. Un mes en que las dos partes van hacia abajo es un mes en que el tramo no compensó nada." />;
};

const GraficaComponente = ({ fondo, nemo }) => {
    usePlotly('g-componente',
        () => {
            const F = fondoEntero(fondo, nemo);
            const c = componente(F);
            const valores = [...D.fondos[fondo].pesos.map(w => w / 100 * FONDO),
                D.mensual.estudio.e2.valor_mm, D.mensual.estudio.e5.valor_mm, D.tes[nemo].valor_mm];
            const tv = valores.reduce((s, x) => s + x, 0);
            /* Rótulos cortos para que quepan en un teléfono; el cursor da el nombre completo. Las tres
               posiciones del tramo van en otro color, para leerlas como un grupo. */
            const rot = [...CORTOS, 'Bono 2a', 'Bono 5a', `TES ${nemo.slice(-2)}`];
            const largo = [...CORTOS.map(k => NOMBRES[k]), 'Bono de 2 años', 'Bono de 5 años', `TES ${anioTES(nemo)}`];
            const esTramo = rot.map((_, i) => i >= CORTOS.length);
            return [
                { x: rot, y: c.comp.map(x => x / c.total * 100), customdata: largo, type: 'bar', name: '% del VaR componente al 99 %',
                  marker: { color: esTramo.map(t => (t ? PALETA.agua : PALETA.secundario)) },
                  hovertemplate: '%{customdata}<br>%{y:.1f} % del riesgo<extra></extra>' },
                { x: rot, y: valores.map(v => v / tv * 100), customdata: largo, type: 'bar', name: '% del valor del fondo entero',
                  marker: { color: esTramo.map(t => (t ? '#99D3DE' : PALETA.gris)) },
                  hovertemplate: '%{customdata}<br>%{y:.1f} % del valor<extra></extra>' },
            ];
        },
        () => EJES({
            barmode: 'group',
            xaxis: { type: 'category', automargin: true },
            yaxis: { title: '% del total', automargin: true },
            legend: { orientation: 'h', y: -0.3 },
            margin: { l: 56, r: 16, t: 12, b: 110 },
        }), [fondo, nemo]);
    return <ChartFrame id="g-componente" height="chart-h-360"
        caption="El VaR componente es el del capítulo 4, sección 5: normal, al 99 %, con la matriz de covarianzas de los 95 meses, y sus siete partes suman el VaR normal del fondo entero. Al lado, la parte del valor de cada posición. Las tres del tramo van en azul verdoso. Pase el cursor para leer las cifras y los nombres." />;
};

const Bloque1 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const F = fondoEntero(ejes.fondo, ejes.tes);
    const Fc = fondoEntero(ejes.fondo, ejes.tes, true);
    const m = medidas(F), mc = medidas(Fc);
    const r = correl(F.acc, F.tes);
    const [lo, hi] = icFisher(r, F.tot.length);
    const ambas = F.acc.filter((x, i) => x < 0 && F.tes[i] < 0).length;
    const fila = (rot, x) => [rot, miles(x[95].var), miles(x[95].es), miles(x[975].es), miles(x[99].var)];
    const tablaDe = (mm) => [
        fila('Acciones', mm.acc), fila('Tramo de TES', mm.tes), fila('Fondo entero', mm.tot),
        ['Acciones + tramo, sumados', miles(mm.acc[95].var + mm.tes[95].var), '—', '—', miles(mm.acc[99].var + mm.tes[99].var)],
    ];
    return (
        <div>
            <SectionHeader title="Bloque 1 · El fondo entero" />

            <Motivacion icon="fa-layer-group"
                gancho="Sumar dos VaR es fácil. Saber si se compensan, cuánto pesa cada uno y con cuántos datos se sabe, no.">
                La mesa midió las acciones en el capítulo 4 y el tramo en el capítulo 10, cada uno en su
                frecuencia y con su método. La junta quiere una sola cifra. Antes de dársela hay que saber si
                las dos partes se mueven juntas, cuánto pesa cada una y cuántos datos hay detrás.
            </Motivacion>

            <NivelIA nivel={3} nota="Con bitácora. Puede pedirle a un modelo que le explique una gráfica; lo que escriba tiene que traer las cifras de la suya." />

            <Ficha titulo="Lo que fijó la junta para este taller"
                filas={[
                    ['El tramo de TES', 'se suma a las acciones'],
                    ['Frecuencia de las dos partes juntas', 'el mes, de cierre a cierre'],
                    ['Meses en común', `${F.tot.length}, ${mesTexto(D.mensual.fechas[0])} a ${mesTexto(D.mensual.fechas[F.tot.length - 1])}`],
                    ['Las acciones, en pesos', 'rendimientos simples, rebalanceo mensual'],
                    ['El tramo', 'cada cambio mensual de la curva, aplicado a la de hoy'],
                    ['El carry (devengo): lo que el tramo gana en un mes con la curva quieta', 'dos tablas, sin él y con él'],
                    ['El cuantil', 'el de tipo 7, como el capítulo 10'],
                    ['El ES', 'la convención del capítulo 5'],
                ]}
                nota="Si en P0.1 decidió otra cosa, no la cambie: dígalo cuando la use. La curva diaria del Banco no está congelada, y por eso lo conjunto es mensual; lo que es solo de acciones —el bloque 2— sigue siendo diario." />

            <Ficha titulo={`El fondo entero · ${ejes.fondo} con el TES ${anioTES(ejes.tes)}`}
                filas={[
                    ['Acciones', `${miles(FONDO)} millones`],
                    ['Tramo de TES, el 30/12/2025', `${miles(F.valorTes)} millones`],
                    ['Fondo entero', `${miles(F.valorTot)} millones`],
                    ['Parte del fondo en TES', `${dec(F.valorTes / F.valorTot * 100, 1)} %`],
                    ['ρ mensual entre los resultados de las acciones y del tramo', dec(r, 3)],
                    ['Intervalo del 95 % para ρ (transformación de Fisher)', `${dec(lo, 3)} a ${dec(hi, 3)}`],
                    ['Meses en que perdieron las dos partes, de los 95', String(ambas)],
                ]} />

            <h3>1 · ¿Se mueven juntas?</h3>
            <GraficaNube fondo={ejes.fondo} nemo={ejes.tes} />
            <GraficaPeores fondo={ejes.fondo} nemo={ejes.tes} />

            <RespuestaAbierta id="P1.1" etiqueta="P1.1 · ¿Diversifica el tramo cuando más falta hace?"
                minPalabras={80} filas={6}
                enunciado={<>
                    Lea las dos gráficas y la ficha del fondo entero. ¿Qué signo tiene ρ y se distingue de
                    cero? ¿En cuántos de los diez peores meses perdieron <strong>las dos</strong> partes, y cómo
                    se compara esa proporción con la de todos los meses? ¿Cuál de los diez le duele más al
                    tramo? Con eso, conteste: ¿el tramo diversifica a las acciones
                    en los meses malos, que es cuando a la junta le importa? Contraste con lo que predijo en
                    P0.2(a).
                </>}
                ayuda="Un coeficiente con su intervalo, dos proporciones y un juicio. El conteo cambia de un fondo a otro." />

            <h3>2 · Una sola cifra para la junta</h3>

            <Tabla cabecera={['Sin carry · millones', 'VaR 95 %', 'ES 95 %', 'ES 97,5 %', 'VaR 99 %']}
                filas={tablaDe(m)}
                nota="Mensual, sobre los 95 meses. El tramo, como en el capítulo 10: sin el cupón que causa en el mes." />
            <Tabla cabecera={['Con carry · millones', 'VaR 95 %', 'ES 95 %', 'ES 97,5 %', 'VaR 99 %']}
                filas={tablaDe(mc)}
                nota="Lo mismo, con el tramo envejecido un mes: el cupón causado y el acercamiento al vencimiento con la curva de hoy. Las acciones no cambian: ya traen el dividendo en el precio ajustado." />

            <RespuestaAbierta id="P1.2" etiqueta="P1.2 · ¿Cuánto riesgo le suma el tramo al fondo?"
                minPalabras={100} filas={7}
                enunciado={<>
                    Con las dos tablas: ¿cuánto le suma el tramo al VaR mensual del fondo entero, al 95 % y al
                    99 %, en pesos, sin carry y con carry? Al 99 % se lo sube en las dos tablas; ¿y al 95 %? ¿El
                    carry cambia esa respuesta en su fondo? Si la cambia, diga por qué al 95 % sí y al 99 % no;
                    si no la cambia, diga qué tendría que pasar para que la cambiara. Termine diciendo cuál de
                    las dos tablas le lleva a la junta, y por qué.
                </>}
                ayuda="Cuatro diferencias en pesos, un porqué y una decisión firmada." />

            <RespuestaAbierta id="P1.3" etiqueta="P1.3 · ¿Cuántos meses hay detrás?"
                minPalabras={70} filas={5}
                enunciado={<>
                    ¿Cuántos meses de cola se esperan detrás del VaR al 95 %, del ES al 97,5 % y del VaR al 99 %
                    de su fondo entero, y cuántos quedan de verdad por encima de cada uno? Con el cuantil del
                    curso, ¿qué meses forman su VaR al 99 % y en qué proporción? ¿Qué puede afirmar la junta con
                    esa cifra y qué no puede? El capítulo 8 dejó una regla sobre esto: dígala con sus palabras y
                    diga qué le pondría al lado a esa cifra para que no engañe.
                </>}
                ayuda="Tres cuentas cortas y un mes leído en la gráfica de los diez peores." />

            <h3>3 · ¿Dónde está el riesgo?</h3>
            <GraficaComponente fondo={ejes.fondo} nemo={ejes.tes} />

            <RespuestaAbierta id="P1.4" etiqueta="P1.4 · El riesgo no se reparte como el dinero"
                minPalabras={70} filas={5}
                enunciado={<>
                    ¿Qué parte del VaR componente carga el tramo, frente a la parte del valor que tiene? ¿Qué
                    posición carga más riesgo por cada peso invertido? Si la junta repartiera su presupuesto de
                    riesgo en proporción al valor, ¿a quién le estaría dando de más? Diga también qué cambia en
                    la lectura por ser este VaR componente el normal y no el histórico.
                </>}
                ayuda="Dos porcentajes leídos en la gráfica, una comparación y una advertencia de método." />
        </div>
    );
};

/* ============================================================================
   BLOQUE 2 · Validar al comité
============================================================================ */
const GraficaExcepciones = ({ fondo, ventana }) => {
    usePlotly('g-excepciones',
        () => {
            const fechas = D.panel.fechas;
            const ini = D.meta.inicio_comun;
            const desde = fechas[ini], hasta = fechas[fechas.length - 1];
            const escalon = (exc, name, color, width, dash) => ({
                x: [desde, ...exc.flatMap(d => [d, d]), hasta],
                y: [0, ...exc.flatMap((d, i) => [i, i + 1]), exc.length],
                type: 'scatter', mode: 'lines', name, line: { color, width, dash },
                hovertemplate: `${name}<br>%{x|%d/%m/%Y}: %{y} excepciones<extra></extra>`,
            });
            const com = D.comite[String(ventana)];
            const colores = { mv30: PALETA.agua, cvar30: PALETA.oro, mv: PALETA.gris, cvar: PALETA.secundario };
            return [
                { x: [desde, hasta], y: [0, (fechas.length - ini) * 0.01], type: 'scatter', mode: 'lines', name: 'Esperadas al 99 %',
                  line: { color: '#64748B', width: 1.2, dash: 'dot' }, hovertemplate: 'esperadas: %{y:.2f}<extra></extra>' },
                escalon(D.fondos[fondo].fijo.comun.exc, `Su fondo ${fondo} (prueba común)`, PALETA.primario, 3.2, 'solid'),
                ...ESTRATEGIAS.map(([k, rot]) => escalon(com[k].exc, rot, colores[k], 1.8, k.endsWith('30') ? 'solid' : 'dash')),
            ];
        },
        () => EJES({
            xaxis: { title: 'Rueda de la prueba', type: 'date' },
            yaxis: { title: 'Excepciones acumuladas' },
            legend: { orientation: 'h', y: -0.25 },
            margin: { l: 56, r: 16, t: 12, b: 130 },
        }), [fondo, ventana]);
    return <ChartFrame id="g-excepciones" height="chart-h-420"
        caption="Cada escalón es una rueda en que la pérdida de la cartera superó su VaR histórico al 99 %, calculado con las 250 ruedas anteriores y los pesos vigentes ese día. La línea punteada es lo que se esperaría si el VaR acertara: una de cada cien ruedas. Las líneas continuas respetan el tope por emisor; las discontinuas no." />;
};

const Bloque2 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const W = String(ejes.ventana);
    const fondo = D.fondos[ejes.fondo];
    const com = D.comite[W];
    const fila = (rot, b) => [rot, `${b.x} (${dec(b.esperadas, 2)})`, dec(b.lr_uc, 2), dec(b.lr_ind, 2), dec(b.lr_cc, 2),
        `${dec(b.var_medio_pct, 3)} %`, String(b.N250), b.zona, dec(b.m, 2), `${dec(b.var60_pct, 3)} %`, miles(b.capital_mm)];
    return (
        <div>
            <SectionHeader title="Bloque 2 · Validar al comité" />

            <Motivacion icon="fa-scale-balanced"
                gancho="El capítulo 8 enseñó a minimizar la cola. El capítulo 6 enseñó a no creerle a un modelo hasta probarlo fuera de la muestra. Nadie había sometido una cartera que se reoptimiza a la prueba rueda a rueda del capítulo 6.">
                El comité de inversiones propone reemplazar las acciones de su fondo por una cartera
                optimizada, y la reestima cada mes. La mesa de riesgos le aplicó a esas carteras la prueba
                retrospectiva del capítulo 6, rueda a rueda y sin mirar el futuro. La junta quiere saber si
                la cartera que mejor controla la cola en la muestra es la que mejor la controla fuera.
            </Motivacion>

            <NivelIA nivel={3} nota="Con bitácora. Las cuentas son cortas; lo que se califica es qué concluye de ellas." />

            <Ficha titulo={`Las carteras del comité · ventana de ${ejes.ventana} ruedas`}
                filas={[
                    ['Pesos de cada cartera', `reestimados cada ${D.meta.cada} ruedas con las ${ejes.ventana} anteriores`],
                    ['VaR de cada rueda', `histórico al 99 %, con las ${D.meta.ventana_var} ruedas anteriores y los pesos vigentes`],
                    ['Rendimientos', 'logarítmicos, como el capítulo 6, para reproducir sus 26 excepciones'],
                    ['Prueba', `${miles(D.panel.sesiones - D.meta.inicio_comun)} ruedas, del ${fecha(D.panel.fechas[D.meta.inicio_comun])} al ${fecha(D.panel.hasta)}`],
                    ['Capital', 'm × VaR medio de las últimas 60 ruedas × √10 × 800 000, con el m de las excepciones de las 250 ruedas finales (capítulo 6)'],
                ]}
                nota={`La prueba empieza en la rueda ${D.meta.inicio_comun} para que las tres ventanas del curso se comparen sobre los mismos días. Su fondo se prueba también como lo hizo el capítulo 6 con la declarada, desde la rueda ${D.meta.ventana_var}: allí la declarada dio ${PUB.bt_x} excepciones en ${miles(PUB.bt_n)} ruedas, zona amarilla y ${miles(PUB.capital_mm)} millones de capital.`} />

            <GraficaExcepciones fondo={ejes.fondo} ventana={ejes.ventana} />

            <Tabla cabecera={['Cartera', 'Excepciones (esperadas)', 'LR_uc', 'LR_ind', 'LR_cc', 'VaR medio de la prueba', 'Exc. en las 250 finales', 'Zona', 'm', 'VaR medio de las 60 finales', 'Capital (millones)']}
                filas={[
                    fila(`Su fondo ${ejes.fondo}, desde la rueda ${D.meta.ventana_var}`, fondo.fijo.cap6),
                    fila(`Su fondo ${ejes.fondo}, prueba común`, fondo.fijo.comun),
                    ...ESTRATEGIAS.map(([k, rot]) => fila(rot, com[k])),
                ]}
                nota="Los valores críticos al 95 % son 3,84 para LR_uc y LR_ind, con un grado de libertad, y 5,99 para LR_cc, con dos. Los VaR medios están en % del valor de las acciones: el de la prueba promedia todas sus ruedas; el de las 60 finales es el que entra en el capital." />

            <RespuestaAbierta id="P2.1" etiqueta="P2.1 · Su fondo, sin tocarlo"
                minPalabras={70} filas={5}
                enunciado={<>
                    Su fondo no se reestima: sus pesos son fijos. ¿Pasa la prueba de Kupiec y la conjunta en las
                    dos filas de su fondo? ¿Qué dice la prueba de independencia que no dice Kupiec? ¿En qué
                    zona queda con las 250 ruedas finales, qué multiplicador le toca y cuánto capital pide,
                    frente a la declarada del capítulo 6?
                </>}
                ayuda="Cuatro lecturas de la tabla y una comparación con el capítulo 6." />

            <RespuestaAbierta id="P2.2" etiqueta="P2.2 · Las carteras del comité contra su fondo"
                minPalabras={100} filas={7}
                enunciado={<>
                    Con su ventana: ¿cuál de las cuatro carteras del comité tiene el menor VaR medio, y cuáles
                    pasan la prueba de Kupiec y la conjunta? ¿Alguna supera a su fondo en las dos cosas a la vez,
                    menos VaR y no más excepciones? ¿Cuál aceptaría la junta? Contéstele a quien diga que «la
                    mínima CVaR es, por construcción, la que mejor controla la cola».
                </>}
                ayuda="Una lectura por cartera, una comparación con su fondo y una respuesta a un argumento." />

            <RespuestaAbierta id="P2.4" etiqueta="P2.4 · El VaR más bajo y el capital más bajo"
                minPalabras={80} filas={6}
                enunciado={<>
                    Con su ventana, ¿la cartera del comité de menor VaR medio de la prueba es también la de
                    menor capital de las cuatro? Lea las dos piezas del capital —el multiplicador y el VaR medio
                    de las 60 ruedas finales— y diga cuál de ellas, o si las dos, ordena el capital. ¿Pide su
                    fondo más o menos capital que las carteras del comité? ¿Qué incentivo le crea esa regla a
                    un comité que optimiza la cola, y qué tendría que mirar la junta además del capital?
                </>}
                ayuda="Una lectura de la tabla, una descomposición del capital, una comparación con su fondo y un incentivo." />
        </div>
    );
};

/* ============================================================================
   BLOQUE 3 · Procedimientos: qué depende de qué
============================================================================ */
/* A2 empareja cada cifra con las observaciones que hay detrás. La derecha trae una
   opción de sobra: con seis filas y seis opciones ningún orden deja los corrimientos en
   una pareja (Hall–Paige). Ninguna estrategia sin leer —su fila, un corrimiento, el
   espejo, ordenar por valor— acierta más de una pareja. */
const OBS_DER = [
    '11,66 excepciones esperadas en 1 166 ruedas',
    '0,95 meses esperados en la cola, de 95',
    '2,375 meses esperados en la cola, de 95',
    '2,75 meses esperados en la cola, de 275',
    '4,75 meses esperados en la cola, de 95',
    '0,475 meses esperados en la cola, de 95',
    '2,5 excepciones esperadas en 250 ruedas',
];
const OBS_SOL = [1, 4, 2, 0, 6, 3];

const Bloque3 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const W = String(ejes.ventana);
    const F = fondoEntero(ejes.fondo, ejes.tes);
    const m = medidas(F);
    /* A3 se calcula desde los valores que se MUESTRAN, redondeando cada paso como
       pide el enunciado (zona ciega 4). */
    const sa = Math.round(desv(F.acc)), sb = Math.round(desv(F.tes));
    const rho = Math.round(correl(F.acc, F.tes) * 100) / 100;
    const z = 2.3263;
    const sp = Math.round(Math.sqrt(sa * sa + sb * sb + 2 * rho * sa * sb));
    const vt = Math.round(z * sp);
    const ct = Math.round(z * (sb * sb + rho * sa * sb) / sp);
    const cuota = Math.round(ct / vt * 1000) / 10;
    const tm = D.toda_muestra, com = D.comite[W];
    return (
        <div>
            <SectionHeader title="Bloque 3 · Procedimientos: qué depende de qué" />

            <Motivacion icon="fa-diagram-project"
                gancho="Un procedimiento que se entiende se puede desordenar a propósito y decir qué se rompe.">
                Antes de firmar, la junta quiere saber si usted entiende lo que la mesa corrió: en qué
                orden se prueba una cartera que cambia de pesos, cuántos datos hay detrás de cada cifra y
                de dónde sale el reparto del riesgo. No le pide el código: le pide saber qué necesita a qué.
            </Motivacion>

            <NivelIA nivel={1}
                nota="Nivel 1 · No AI. De bloques como este sale el razonamiento que la sustentación le pide rehacer con una variación, sin nada delante." />

            <h3>1 · Probar una cartera que se reoptimiza</h3>

            <Andamio id="A1" nota="La prueba retrospectiva del bloque 2, en el orden que exige. No puntúa.">
                <OrdenaPasos
                    titulo="A1 · La prueba retrospectiva de una cartera del comité"
                    enunciado="Ocho pasos. Un solo orden funciona sin mirar el futuro, y cada paso nombra aquello que necesita."
                    pasos={[
                        'Fijar por escrito, antes de mirar resultados, la ventana del comité, la frecuencia de reestimación y el nivel del VaR',
                        'En la rueda de la prueba, estimar los pesos del comité solo con las ruedas de esa ventana anteriores a ella',
                        'Con esos pesos, armar la serie de la cartera en las 250 ruedas anteriores a la misma rueda',
                        'Tomar de esa serie el VaR histórico al nivel fijado',
                        'Comparar ese VaR con la pérdida de la cartera en la rueda, con los mismos pesos',
                        'Pasar a la rueda siguiente y, cada vez que se cumpla la frecuencia fijada, volver a estimar los pesos',
                        'Con todas las excepciones de la prueba, aplicar Kupiec y la prueba conjunta',
                        'Entre esas mismas excepciones, contar las de las 250 ruedas finales y leer la zona y el multiplicador del capital',
                    ]}
                    mezcla={[3, 5, 0, 6, 1, 7, 2, 4]}
                    pista="Dos pares no los resuelve ningún pronombre: el de pasar a la rueda siguiente y el de aplicar las pruebas. Pregúntese qué tiene que estar terminado antes de cada uno."
                />
            </Andamio>

            <Tabla cabecera={['Cartera', 'Pesos de toda la muestra: excepciones', `Reestimada con ${ejes.ventana} ruedas: excepciones`]}
                filas={ESTRATEGIAS.map(([k, rot]) => [rot, String(tm[k].x), String(com[k].x)])}
                nota={`Misma prueba común, mismo VaR. En la columna del medio los pesos se estimaron una sola vez, con las ${miles(D.panel.sesiones)} ruedas del panel, y no cambian.`} />

            <RespuestaAbierta id="P3.1" etiqueta="P3.1 · Dónde se mira el futuro"
                minPalabras={80} filas={6}
                enunciado={<>
                    Diga qué pasos de A1, cambiados de lugar, hacen que la prueba mire el futuro, y qué dato
                    del futuro entra. La tabla corre esa fuga: ¿en cuál de las dos columnas está? Mirar el
                    futuro, ¿baja el conteo de excepciones en las cuatro carteras de su ventana? Si en alguna
                    no lo baja, diga en cuál y por qué puede pasar; si lo baja en todas, diga si eso prueba que
                    mirar el futuro siempre favorece. El taller de la unidad 1 auditó otra fuga parecida; diga
                    en qué se diferencia de esta.
                </>}
                ayuda="Un par de pasos, una columna, una lectura cartera por cartera y una diferencia con la unidad 1." />

            <h3>2 · Cuántos datos hay detrás</h3>

            <Andamio id="A2" nota="Cada cifra con lo que hay detrás de ella. No puntúa.">
                <Emparejamiento
                    titulo="A2 · Cada cifra con sus observaciones"
                    enunciado="Empareje cada cifra con el número de observaciones que la sostienen: meses o ruedas en la cola, o excepciones esperadas."
                    etiquetaIzq="Cifra"
                    etiquetaDer="Lo que hay detrás"
                    izquierda={[
                        `Su VaR mensual al 99 % del fondo entero, ${miles(m.tot[99].var)} millones`,
                        `Su VaR mensual al 95 % del fondo entero, ${miles(m.tot[95].var)} millones`,
                        `Su ES mensual al 97,5 % del fondo entero, ${miles(m.tot[975].es)} millones`,
                        'El conteo de excepciones de una cartera del comité en la prueba común',
                        'El multiplicador del capital de su fondo',
                        `El VaR mensual al 99 % del tramo del capítulo 10 con la historia desde 2003, ${miles(PUB.var_tramo_99)} millones`,
                    ]}
                    derecha={OBS_DER}
                    solucion={OBS_SOL}
                />
            </Andamio>

            <h3>3 · De dónde sale el reparto del riesgo</h3>

            <Andamio id="A3" nota="El VaR componente con dos posiciones, rehecho a mano. No puntúa.">
                <TablaTraza
                    titulo="A3 · El VaR componente del tramo, a mano"
                    enunciado={<>Con su fondo entero en dos posiciones —las acciones y el tramo—, la desviación
                        mensual de las acciones es <strong>{miles(sa)}</strong> millones, la del tramo{' '}
                        <strong>{miles(sb)}</strong> y su correlación <strong>{dec(rho, 2)}</strong>. Con
                        z = 2,3263, complete las cuatro casillas. <strong>Redondee cada paso al entero</strong> —el
                        último, a un decimal— y use ese valor redondeado en el paso siguiente.</>}
                    codigo={{
                        python: `import math
sa, sb, rho, z = ${sa}, ${sb}, ${rho.toFixed(2)}, 2.3263

sp = round(math.sqrt(sa**2 + sb**2 + 2*rho*sa*sb))   # desviación del fondo entero
vt = round(z * sp)                                     # VaR normal al 99 %
ct = round(z * (sb**2 + rho*sa*sb) / sp)               # componente del tramo
cuota = round(ct / vt * 100, 1)                        # % del VaR que carga el tramo`,
                        r: `sa <- ${sa}; sb <- ${sb}; rho <- ${rho.toFixed(2)}; z <- 2.3263

sp <- round(sqrt(sa^2 + sb^2 + 2*rho*sa*sb))   # desviación del fondo entero
vt <- round(z * sp)                            # VaR normal al 99 %
ct <- round(z * (sb^2 + rho*sa*sb) / sp)       # componente del tramo
cuota <- round(ct / vt * 100, 1)               # % del VaR que carga el tramo`,
                    }}
                    columnas={[
                        { clave: 'paso', titulo: 'Paso' },
                        { clave: 'instruccion', titulo: 'Qué se calcula' },
                        { clave: 'valor', titulo: 'Valor' },
                    ]}
                    filas={[
                        { paso: '1', instruccion: 'σ del fondo entero, millones', valor: String(sp) },
                        { paso: '2', instruccion: 'VaR normal al 99 % = z · σ, millones', valor: String(vt) },
                        { paso: '3', instruccion: 'Componente del tramo = z · (σ_b² + ρ σ_a σ_b) / σ, millones', valor: String(ct) },
                        { paso: '4', instruccion: 'Cuota del tramo en el VaR, %', valor: dec(cuota, 1) },
                    ]}
                    ocultas={['valor']}
                    pista="El paso 3 es la covarianza del tramo con el fondo entero, por z y dividida por la σ del fondo: los componentes de las dos posiciones suman el paso 2, salvo uno o dos millones de redondeo."
                />
            </Andamio>

            <RespuestaAbierta id="P3.3" etiqueta="P3.3 · El componente contra el VaR aislado"
                minPalabras={70} filas={5}
                enunciado={<>
                    ¿Su cuota del paso 4 coincide, hasta una décima, con la que leyó en la gráfica del bloque 1,
                    que reparte entre siete posiciones? Diga por qué tiene que coincidir. Después ponga lado a
                    lado tres cifras del tramo: su componente, su VaR aislado (z · σ_b) y lo que le suma al VaR
                    del fondo entero al 99 % sin carry, que midió en P1.2. ¿Cuál sirve para decidir si se vende el tramo entero, y
                    cuál si se vende una parte pequeña? ¿Por qué no son la misma cifra? Hay más de una razón.
                </>}
                ayuda="Una comprobación, tres cifras comparadas y dos usos distintos." />
        </div>
    );
};

/* ============================================================================
   BLOQUE 4 · Barridos con registro
============================================================================ */
/* L1 lee una malla precomputada: cada punto exige reestimar los pesos del comité
   en toda la prueba, y eso lo hizo el congelador. El navegador solo busca la fila. */
const filaTope = (fila, tope) => fila.reduce((a, f) => (Math.abs(f.tope - tope) < Math.abs(a.tope - tope) ? f : a));

/* L2 revalora el tramo con la curva de Nelson-Siegel de hoy y sus tres factores
   movidos. Todo se ancla en el precio que el NAVEGADOR calcula sin choque, para que
   el resultado valga cero exactamente sin mover nada. */
const cargasNS = (t, tau) => { const x = t / tau; const f1 = (1 - Math.exp(-x)) / x; return [1, f1, f1 - Math.exp(-x)]; };
const spotNS = (beta, t) => { const c = cargasNS(t, D.curva.tau); return beta[0] * c[0] + beta[1] * c[1] + beta[2] * c[2]; };
const precioNS = (b, beta) => b.t.reduce((s, t, i) => s + b.f[i] * Math.pow(1 + spotNS(beta, t) / 100, -t), 0);
const PAR10 = { t: Array.from({ length: 10 }, (_, i) => i + 1), f: Array.from({ length: 10 }, (_, i) => D.curva.par10 + (i === 9 ? 100 : 0)) };
const choqueFondo = (nemo, p) => {
    const b0 = D.curva.beta;
    const b1 = [b0[0] + p.nivel / 100, b0[1] + p.pendiente / 100, b0[2] + p.curvatura / 100];
    const bs = [D.estudio_bonos.e2, D.estudio_bonos.e5, D.tes[nemo]];
    const tramo = bs.reduce((s, b) => s + (precioNS(b, b1) - precioNS(b, b0)) / 100 * NOMINAL, 0);
    const cobertura = p.cubierto ? -D.tes[nemo].n10 * (precioNS(PAR10, b1) - precioNS(PAR10, b0)) / 100 : 0;
    const acciones = p.acciones / 100 * FONDO;
    return { b1, tramo, cobertura, acciones, total: acciones + tramo + cobertura };
};

const Bloque4 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const W = String(ejes.ventana);
    const malla = D.malla_tope[W];
    const fijo = D.fondos[ejes.fondo].fijo.comun;
    return (
        <div>
            <SectionHeader title="Bloque 4 · Los barridos: lo que solo se ve moviéndolo" />

            <Motivacion icon="fa-sliders"
                gancho="Las dos preguntas de este bloque son sobre un rango entero. Ninguna se contesta razonando: hay que barrerlo.">
                La mesa probó al comité con un solo tope y cubrió el tramo pensando en un solo tipo de
                movimiento de la curva. La junta va a preguntar qué pasa con otros topes y con otros
                movimientos. Eso no está en ningún capítulo: está en los dos laboratorios de abajo.
            </Motivacion>

            <NivelIA nivel={1}
                nota="Nivel 1 · No AI. Un modelo puede argumentar cualquier tope y cualquier choque; lo que no puede es mover el deslizador. El taller registra qué valores recorrió usted." />

            <h3>1 · El tope, del 25 % al 100 %</h3>
            <p>
                El laboratorio repite la prueba del bloque 2 con su ventana de {ejes.ventana} ruedas para
                topes por emisor del 25 % al 100 %. Con el 25 % y cuatro emisores, la única cartera posible
                es la de pesos iguales; con el 100 %, no hay tope.
            </p>

            <Barrido id="P4.1"
                titulo="P4.1 · Barra el tope de punta a punta"
                enunciado={<>
                    Mueva el tope por <strong>todo</strong> el rango y mire los dos paneles. Después conteste
                    las cuatro casillas; las dos últimas son las que más puntúan.
                </>}
                campos={[
                    { id: 'umbral', etiqueta: '¿Desde qué tope la mínima CVaR deja de pasar la prueba de Kupiec con su ventana?', pista: 'el primer tope del barrido con LR_uc por encima de 3,84, o «nunca»' },
                    { id: 'monotona', etiqueta: 'Por encima de ese tope, ¿vuelve a pasar con alguno? Si lo hay, diga con cuál y qué le enseña eso sobre una prueba con tan pocas excepciones; si no, diga a cuántas excepciones del rechazo queda.', largo: true },
                    { id: 'contra_fondo', etiqueta: '¿Qué tope deja a una de las dos estrategias del laboratorio con menos excepciones, cuántas son frente a las de su fondo, y a qué VaR medio?', largo: true },
                    { id: 'recomienda', etiqueta: '¿Qué tope le recomendaría a la junta para una cartera que se reoptimiza, con qué cifra del laboratorio, y qué no le puede asegurar esta prueba?', largo: true },
                ]}>
                <Laboratorio id="lab-tope" modo="malla"
                    titulo={`El tope por emisor, con la ventana de ${ejes.ventana} ruedas`}
                    enunciado={`Malla precalculada cada 5 puntos porcentuales de tope, sobre la prueba común de ${miles(D.panel.sesiones - D.meta.inicio_comun)} ruedas. Los porcentajes son del valor de las acciones.`}
                    altura="chart-h-420"
                    controles={[{
                        id: 'tope', etiqueta: 'Tope por emisor', min: 0.25, max: 1, paso: 0.05,
                        valor: TOPE, formato: (v) => `${dec(v * 100, 0)} %`,
                    }]}
                    calcular={(p) => {
                        const xs = malla.cvar.map(f => f.tope * 100);
                        const a = filaTope(malla.cvar, p.tope), b = filaTope(malla.mv, p.tope);
                        return {
                            traces: [
                                { x: xs, y: malla.cvar.map(f => f.x), type: 'scatter', mode: 'lines+markers', name: 'Mínima CVaR · excepciones', line: { color: PALETA.oro, width: 2.2 } },
                                { x: xs, y: malla.mv.map(f => f.x), type: 'scatter', mode: 'lines+markers', name: 'Mínima varianza · excepciones', line: { color: PALETA.agua, width: 2 } },
                                { x: [25, 100], y: [fijo.x, fijo.x], type: 'scatter', mode: 'lines', name: `Su fondo ${ejes.fondo}`, line: { color: PALETA.primario, width: 1.6, dash: 'dash' } },
                                { x: [p.tope * 100, p.tope * 100], y: [a.x, b.x], type: 'scatter', mode: 'markers', name: `Tope ${dec(p.tope * 100, 0)} %`, marker: { color: PALETA.secundario, size: 11 } },
                                { x: xs, y: malla.cvar.map(f => f.lr_uc), type: 'scatter', mode: 'lines', xaxis: 'x', yaxis: 'y2', showlegend: false, line: { color: PALETA.oro, width: 1.6 } },
                                { x: xs, y: malla.mv.map(f => f.lr_uc), type: 'scatter', mode: 'lines', xaxis: 'x', yaxis: 'y2', showlegend: false, line: { color: PALETA.agua, width: 1.6 } },
                                { x: [25, 100], y: [3.841, 3.841], type: 'scatter', mode: 'lines', xaxis: 'x', yaxis: 'y2', name: 'LR_uc = 3,84', line: { color: PALETA.secundario, width: 1.2, dash: 'dot' } },
                            ],
                            /* La zona de rechazo, sombreada, y el tope elegido en los dos paneles: 3,92 contra 3,84
                               no se distinguía a ojo (revisión del T3). */
                            layout: EJES({
                                xaxis: { title: 'Tope por emisor (%)', anchor: 'y2', automargin: true },
                                yaxis: { title: 'Excepciones', domain: [0.45, 1], automargin: true },
                                yaxis2: { title: 'LR_uc', domain: [0, 0.33], automargin: true },
                                shapes: [
                                    { type: 'rect', xref: 'x', yref: 'y2', x0: 25, x1: 100, y0: 3.841, y1: Math.max(9, ...malla.cvar.map(f => f.lr_uc), ...malla.mv.map(f => f.lr_uc)), fillcolor: 'rgba(237,30,121,0.08)', line: { width: 0 } },
                                    { type: 'line', xref: 'x', yref: 'paper', x0: p.tope * 100, x1: p.tope * 100, y0: 0, y1: 1, line: { color: PALETA.secundario, width: 1, dash: 'dot' } },
                                ],
                                legend: { orientation: 'h', y: -0.24 },
                                margin: { l: 48, r: 16, t: 12, b: 120 },
                            }),
                        };
                    }}
                    lectura={(p) => {
                        const a = filaTope(malla.cvar, p.tope), b = filaTope(malla.mv, p.tope);
                        return `Tope ${dec(a.tope * 100, 0)} % · mínima CVaR: ${a.x} excepciones, LR_uc ${dec(a.lr_uc, 2)}, LR_cc ${dec(a.lr_cc, 2)}, VaR medio ${dec(a.var_medio_pct, 3)} % · `
                            + `mínima varianza: ${b.x} excepciones, LR_uc ${dec(b.lr_uc, 2)}, LR_cc ${dec(b.lr_cc, 2)}, VaR medio ${dec(b.var_medio_pct, 3)} % · `
                            + `su fondo: ${fijo.x} excepciones, VaR medio ${dec(fijo.var_medio_pct, 3)} %`;
                    }}
                    nota="Arriba, las excepciones de cada cartera del comité con ese tope; la línea discontinua es su fondo, que no se reestima. Abajo, el estadístico de Kupiec: dentro de la franja sombreada, la prueba rechaza. La línea vertical es el tope elegido." />
            </Barrido>

            <h3>2 · Lo que la cobertura por duración no cubre</h3>
            <p>
                El laboratorio mueve los tres factores de la curva de Nelson-Siegel del capítulo 9, cada uno
                con su deslizador —el nivel β₀ mueve todos los plazos por igual; β₁ mueve sobre todo el
                corto, y subirlo aplana la curva; β₂, los plazos medios—, y revalora su tramo con ella. Cien
                puntos en un factor no mueven la curva lo mismo que cien en otro: mírelo en el panel de arriba. Con la cobertura puesta, el tramo lleva
                vendidos {miles(D.tes[ejes.tes].n10)} millones nominales del bono a la par de diez años,
                el tamaño que lo deja con DV01 cero contra la curva. Puede sumarle un choque a las acciones.
            </p>

            <Barrido id="P4.2"
                titulo="P4.2 · Barra los factores de la curva, con y sin cobertura"
                enunciado={<>
                    Mueva cada factor por su rango, con la cobertura y sin ella. Después conteste las cuatro
                    casillas.
                </>}
                campos={[
                    { id: 'pendiente', etiqueta: 'Con el tramo cubierto, ¿cuánto pierde o gana con +100 pb en β₁?', pista: 'millones, con signo' },
                    { id: 'peor', etiqueta: 'De los seis choques de ±100 pb en un solo factor, ¿cuál deja la mayor pérdida con el tramo cubierto, y cuánto?', pista: 'el factor, el signo y los millones' },
                    { id: 'paralelo', etiqueta: 'Con el tramo cubierto, ¿qué pasa con +200 y con −200 pb en el nivel? Diga el signo de cada uno y por qué sale así.', largo: true },
                    { id: 'escenario', etiqueta: 'Arme un escenario malo suyo, con acciones y curva a la vez, y diga cuánto pierde el fondo entero y qué parte de esa pérdida la cobertura no cubre.', largo: true },
                ]}>
                <Laboratorio id="lab-curva"
                    titulo={`El fondo entero con la curva movida · TES ${anioTES(ejes.tes)}`}
                    enunciado={`Revaloración del tramo con sus flujos y la curva de Nelson-Siegel del ${fecha(D.meta.fecha_valoracion)}, con τ = ${dec(D.curva.tau, 1)} fijo. Millones.`}
                    altura="chart-h-420"
                    controles={[
                        { id: 'nivel', etiqueta: 'Δβ₀, nivel (pb)', min: -200, max: 200, paso: 10, valor: 0, formato: (v) => `${pb(v)} pb` },
                        { id: 'pendiente', etiqueta: 'Δβ₁, pendiente (pb; + sube el corto y aplana)', min: -200, max: 200, paso: 10, valor: 0, formato: (v) => `${pb(v)} pb` },
                        { id: 'curvatura', etiqueta: 'Δβ₂, curvatura (pb)', min: -200, max: 200, paso: 10, valor: 0, formato: (v) => `${pb(v)} pb` },
                        { id: 'acciones', etiqueta: 'Choque a las acciones (%)', min: -40, max: 20, paso: 1, valor: 0, formato: (v) => `${v > 0 ? '+' : ''}${dec(v, 0)} %` },
                        { id: 'cubierto', etiqueta: 'Cobertura por duración (0 = sin, 1 = con)', min: 0, max: 1, paso: 1, valor: 0, formato: (v) => (v ? 'con cobertura' : 'sin cobertura') },
                    ]}
                    calcular={(p) => {
                        const c = choqueFondo(ejes.tes, p);
                        const ts = Array.from({ length: 120 }, (_, i) => 0.25 * (i + 1));
                        return {
                            traces: [
                                { x: ts, y: ts.map(t => spotNS(D.curva.beta, t)), type: 'scatter', mode: 'lines', name: 'Curva de hoy', line: { color: PALETA.gris, width: 2 } },
                                { x: ts, y: ts.map(t => spotNS(c.b1, t)), type: 'scatter', mode: 'lines', name: 'Curva movida', line: { color: PALETA.primario, width: 2.2 } },
                                { x: ['Acciones', 'Tramo', 'Cobertura', 'Total'], y: [c.acciones, c.tramo, c.cobertura, c.total], type: 'bar', xaxis: 'x2', yaxis: 'y2', showlegend: false,
                                  marker: { color: [PALETA.primario, PALETA.agua, PALETA.oro, PALETA.secundario] }, hovertemplate: '%{x}: %{y:,.0f} millones<extra></extra>' },
                            ],
                            layout: EJES({
                                grid: { rows: 2, columns: 1, pattern: 'independent' },
                                xaxis: { title: { text: 'Plazo de la curva (años)', standoff: 4 }, domain: [0, 1], automargin: true },
                                yaxis: { title: 'Spot (%)', domain: [0.6, 1], range: [5, 17], automargin: true },
                                xaxis2: { type: 'category', anchor: 'y2', domain: [0, 1], automargin: true },
                                yaxis2: { title: { text: 'Millones', standoff: 8 }, domain: [0, 0.38], zeroline: true, zerolinecolor: '#64748B', tickformat: ',.0f', automargin: true },
                                legend: { orientation: 'h', y: 1.12 },
                                margin: { l: 48, r: 28, t: 40, b: 40 },
                            }),
                        };
                    }}
                    lectura={(p) => {
                        const c = choqueFondo(ejes.tes, p);
                        return `nivel ${pb(p.nivel)} · pendiente ${pb(p.pendiente)} · curvatura ${pb(p.curvatura)} pb · acciones ${p.acciones > 0 ? '+' : ''}${dec(p.acciones, 0)} % · `
                            + `${p.cubierto ? 'con' : 'sin'} cobertura → tramo ${firmado(c.tramo)} · cobertura ${firmado(c.cobertura)} · acciones ${firmado(c.acciones)} · fondo entero ${firmado(c.total)} millones`;
                    }}
                    nota="Arriba, la curva spot de hoy y la movida. Abajo, lo que gana o pierde cada parte del fondo entero con ese escenario." />
            </Barrido>
        </div>
    );
};

/* ============================================================================
   BLOQUE 5 · Audite a la mesa: el informe integrado
   El taller declara que hay defectos —es una auditoría, no una trampa— y no dice
   cuántos ni cuáles. Cada cifra del informe sale de `D` o se calcula aquí con las
   series del bloque 1; las correctas y el costo de cada defecto NO viajan.
============================================================================ */
/* ⚠️ `TIPOS_ERROR_RIESGO` viene de TR-CORE: declararlo otra vez es un
   `SyntaxError` que deja el taller en blanco (lo pagó el T1). */
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
    const W = String(ejes.ventana);
    /* Las cifras de las nueve afirmaciones vienen hechas en `informe`, todas juntas y con
       nombres neutros: el borrador las pegó así, y aquí solo se imprimen. */
    const inf = D.fondos[ejes.fondo].informe;
    const [pctTot, pctAcc] = inf.a1[ejes.tes];
    const [sub95, sub99] = inf.a2[ejes.tes];
    const [esTot, varTot, exceso] = inf.a6[ejes.tes];
    const capInf = inf.a8[W];
    return (
        <div>
            <SectionHeader title="Bloque 5 · Audite a la mesa: el informe integrado" />

            <Motivacion icon="fa-magnifying-glass"
                gancho="Tiene defectos, y este bloque es una auditoría, no una trampa. No le decimos cuántos. También tiene afirmaciones que suenan a error y no lo son.">
                La mesa le pidió a un modelo de lenguaje el borrador del informe integrado de riesgos para la
                junta, con las cifras de su fondo entero, y lo pegó tal cual. La junta lo va a leer el
                jueves. Usted lo lee hoy, con lo que trabajó en los bloques 1 a 4.
            </Motivacion>

            <NivelIA nivel={1}
                nota="Nivel 1 · No AI, y aquí la razón es de lógica y no de política: pedirle a un modelo que audite a un modelo es circular. La auditoría la hace usted." />

            <div className="my-5 rounded-2xl border-2 p-5" style={{ borderColor: '#CBD5E1', background: '#F8FAFC' }}>
                <p className="text-[0.7rem] uppercase tracking-wider font-bold text-gray-500" style={{ margin: '0 0 0.8rem' }}>
                    Borrador · Informe integrado de riesgos a la junta · fondo {ejes.fondo}, TES {anioTES(ejes.tes)}, ventana de {ejes.ventana} ruedas
                </p>
                <Afirmacion n="1">
                    El VaR mensual al 99 % del fondo entero es el {dec(pctTot, 2)} % de su valor, contra el{' '}
                    {dec(pctAcc, 2)} % que tenían las acciones solas: sumarle el tramo de TES le bajó el riesgo al
                    fondo en {dec(pctAcc - pctTot, 2)} puntos porcentuales.
                </Afirmacion>
                <Afirmacion n="2">
                    El VaR histórico puede fallar la subaditividad —el capítulo 5 lo mostró—; en este fondo la
                    cumple: al 95 y al 99 %, el VaR del fondo entero queda por debajo de la suma de los de sus dos
                    partes, en{' '}
                    {miles(sub95)} y {miles(sub99)} millones.
                </Afirmacion>
                <Afirmacion n="3">
                    Para el VaR paramétrico mensual de las acciones se usaron las varianzas mensuales de los cuatro
                    emisores y sus correlaciones diarias —{miles(D.panel.sesiones)} ruedas en vez de {D.mensual.fechas.length}{' '}
                    meses—, que por tener más datos son más precisas y por eso sin sesgo: correlación media{' '}
                    {dec(inf.rho_diaria, 3)}. El VaR normal al 99 % de las acciones queda en {miles(inf.var99_param)} millones.
                </Afirmacion>
                <Afirmacion n="4">
                    El GARCH(1,1) con t de Student del capítulo 2, ajustado a las acciones de su fondo, tiene
                    persistencia α + β = {dec(inf.persistencia, 4)}, menor que 1: la volatilidad diaria no se queda
                    donde está hoy, vuelve hacia su nivel de largo plazo, {dec(inf.sigma_lp, 4)} %.
                </Afirmacion>
                <Afirmacion n="5">
                    El VaR mensual al 99 % de las acciones —el diario por √21— se validó contra la pérdida de las 21
                    ruedas siguientes, en ventanas que avanzan de a una rueda: {inf.exc_validacion} excepciones en{' '}
                    {miles(inf.ventanas)} ventanas, LR_uc = {dec(inf.lr_validacion, 2)}. Con tantas ventanas, la prueba
                    tiene la potencia que le falta a la mensual.
                </Afirmacion>
                <Afirmacion n="6">
                    El ES al 97,5 % del fondo entero, {miles(esTot)} millones, supera a su VaR al 99 %,{' '}
                    {miles(varTot)} millones, en un {dec(exceso, 0)} %. Con una normal lo superaría en apenas un
                    0,5 % (1,005 ×): la distancia sugiere una cola más gruesa que la normal, aunque con unos tres
                    meses detrás del ES eso queda por probar.
                </Afirmacion>
                <Afirmacion n="7">
                    La volatilidad diaria de las acciones hoy, con el EWMA de λ = 0,94 del capítulo 2, es de{' '}
                    {dec(inf.sigma_hoy, 4)} %. De ahí sale el VaR de las acciones para el mes que viene, al 99 %:
                    2,3263 × {dec(inf.sigma_hoy, 4)} % × √21 × {miles(FONDO)} = {miles(inf.var99_mes)} millones.
                </Afirmacion>
                <Afirmacion n="8">
                    El capital de la mínima CVaR con tope, reestimada con {ejes.ventana} ruedas, es de{' '}
                    {miles(capInf)} millones: tres veces su VaR al 99 % medio de las últimas 60 ruedas, por √10, sobre
                    los {miles(FONDO)} millones. El multiplicador no depende de la cartera: es el del modelo de VaR
                    histórico, el mismo para todas las que lo usan.
                </Afirmacion>
                <Afirmacion n="9">
                    Con la venta de {miles(D.tes[ejes.tes].n10)} millones nominales del bono a la par de diez años, el
                    DV01 del tramo contra la curva queda en cero: el tramo cubierto ya no tiene riesgo de tasa, y
                    la junta puede dejarlo fuera del VaR al 99 % del fondo entero.
                </Afirmacion>
            </div>

            <Accordion items={[{
                titulo: 'Los siete tipos de defecto del curso',
                contenido: <ul className="text-[0.9rem]" style={{ margin: 0, paddingLeft: '1.2rem' }}>
                    {TIPOS_ERROR_RIESGO.map((t, i) => <li key={i}>{t}</li>)}
                </ul>,
            }]} />

            <RespuestaAbierta id="P5.1" etiqueta="P5.1 · Los defectos del informe"
                minPalabras={250} filas={14}
                enunciado={<>
                    Encuentre los defectos. Para cada uno: el número de la afirmación, <strong>qué está mal</strong>{' '}
                    en una frase, <strong>el tipo</strong> de los siete del curso y <strong>lo que le cuesta a la
                    junta</strong> creérselo: la cifra correcta si la tiene en este taller, o la dirección y el
                    orden de magnitud si no, dicho en pesos. Una afirmación puede tener un defecto aunque cada
                    número que trae esté bien calculado.
                </>}
                ayuda="Se califica cada defecto encontrado con su tipo y su costo. Señalar como defecto una afirmación correcta resta, salvo que lo sostenga una cifra de este taller que de verdad la contradiga." />

            <RespuestaAbierta id="P5.2" etiqueta="P5.2 · Las que suenan a error y no lo son"
                minPalabras={100} filas={7}
                enunciado={<>
                    Escoja dos afirmaciones del informe que un lector apurado tacharía y que están bien. Para cada
                    una, por qué suena a error y por qué no lo es, con la cifra de su fondo que lo prueba. Si una
                    de ellas le sirve para encontrar un defecto de otra afirmación, dígalo.
                </>}
                ayuda="Dos afirmaciones, dos porqués y, si la hay, la relación entre una correcta y una defectuosa." />
        </div>
    );
};

/* ============================================================================
   BLOQUE 6 · La conciliación: cuatro contradicciones entre las unidades
============================================================================ */
const Bloque6 = () => {
    const { datos } = usePersistencia();
    const ejes = datos.ejes;
    const W = String(ejes.ventana);
    const fondo = D.fondos[ejes.fondo];
    const com = D.comite[W];
    const b = D.tes[ejes.tes];
    const F = fondoEntero(ejes.fondo, ejes.tes);
    const r = correl(F.acc, F.tes);
    const pot = D.potencia;
    const k = (a) => `${a.rechaza_bajo === null ? '' : `${a.rechaza_bajo} o menos, o `}${a.rechaza_alto} o más`;
    const pc = (x) => `${dec(x * 100, 1)} %`;
    return (
        <div>
            <SectionHeader title="Bloque 6 · La conciliación" />

            <Motivacion icon="fa-code-merge"
                gancho="Cada pregunta de este bloque junta una cifra de la unidad 1 con una de la unidad 2 que no se pueden firmar a la vez sin decir algo más.">
                Las dos áreas del fondo tienen razón con sus propias reglas. El problema es la junta, que tiene
                que firmar las dos cosas a la vez. Aquí cada contradicción pide una cifra suya, una decisión y
                lo que esa decisión cuesta en pesos. «Depende» no es una respuesta si no dice de qué.
            </Motivacion>

            <NivelIA nivel={3} nota="Con bitácora. Un modelo le ayudará a ordenar argumentos; la cifra, la decisión y el costo tienen que ser los de su fondo." />

            <h3>C1 · La cartera que minimiza la cola</h3>
            <Ficha titulo={`Con su ventana de ${ejes.ventana} ruedas · prueba común`}
                filas={[
                    ['', 'Excepciones', 'VaR medio'],
                    [`Su fondo ${ejes.fondo}`, `${fondo.fijo.comun.x} · LR_uc ${dec(fondo.fijo.comun.lr_uc, 2)}`, `${dec(fondo.fijo.comun.var_medio_pct, 3)} %`],
                    ...ESTRATEGIAS.map(([kk, rot]) => [rot, `${com[kk].x} · LR_uc ${dec(com[kk].lr_uc, 2)}`, `${dec(com[kk].var_medio_pct, 3)} %`]),
                ]} />

            <RespuestaAbierta id="P6.1" etiqueta="P6.1 · ¿Se valida la cartera que minimiza la cola?"
                minPalabras={150} filas={9}
                enunciado={<>
                    El capítulo 8 dice que la mínima CVaR es la cartera con menos cola en la muestra. El
                    capítulo 6 dice que un VaR se juzga fuera de ella. Con sus bloques 2 y 4: ¿qué le pasa a la
                    mínima CVaR fuera de la muestra, sin tope y con tope, en su ventana? ¿Por qué un optimizador
                    que minimiza la cola estimada puede producir la cartera que peor se valida? ¿Qué papel juega
                    el tope, y cuánto cuesta en VaR medio sobre los {miles(FONDO)} millones? Decida qué cartera le propone a la junta —la suya, una del comité, otra— y diga lo
                    que cuesta esa decisión en VaR medio, en excepciones y en capital. Contraste con P0.2(b).
                </>}
                ayuda="Una cifra suya por cada afirmación, un mecanismo y una decisión con su costo. El veredicto puede depender de una o dos excepciones: si es su caso, dígalo." />

            <h3>C2 · El TES sin riesgo de la recta</h3>
            <Ficha titulo="El TES de la línea del mercado de capitales y su tramo"
                filas={[
                    ['', 'En la recta del capítulo 7', 'Su tramo'],
                    ['Rendimiento', '7,00 % efectivo anual (ln 1,07 = 6,7659 % en logaritmos)', `TIR de ${dec(b.c2.tir_ponderada_pct, 2)} % efectiva anual`],
                    ['Volatilidad', '0', `${dec(b.c2.vol_anual_pct, 2)} % al año · ${miles(b.c2.sd_mes_mm)} millones al mes`],
                    ['Correlación con las acciones', '0', `${dec(r, 3)} mensual`],
                    ['Carry: lo que gana en un mes con la curva quieta', '—', `${miles(b.c2.carry_mes_mm)} millones`],
                    ['Valor el 30/12/2025', '—', `${miles(b.c2.valor_mm)} millones`],
                ]}
                nota="La volatilidad del tramo es la de los 95 meses comunes, sin carry. Su TIR es el promedio de la de cada bono, pesada por su valor. La recta del capítulo 7 usa la tasa del curso en logaritmos porque ese capítulo trabaja en logaritmos; para compararla con una TIR, póngalas en la misma convención." />

            <RespuestaAbierta id="P6.2" etiqueta="P6.2 · ¿Cuánto riesgo y cuánto rendimiento trae de verdad el TES?"
                minPalabras={150} filas={9}
                enunciado={<>
                    La línea del mercado de capitales (CML) del capítulo 7 trata al TES como un activo que rinde la
                    tasa del curso y no se mueve. Su tramo se mueve, se correlaciona con las acciones —aunque
                    quizá no se distinga de cero— y devenga cada mes. ¿Cuánto riesgo le añade de verdad al fondo
                    entero? Use la cifra de P1.2, no la rehaga. ¿Y cuánto rendimiento? Separe qué parte de la
                    distancia entre su TIR y el 7,00 % es la decisión del curso sobre la tasa libre de riesgo y
                    no algo del TES. Una TIR no es un rendimiento esperado: diga cuándo coincide con él. ¿Qué
                    sobrevive de la conclusión del capítulo 7 —mezclar acciones y TES reduce el riesgo en
                    proporción—, y qué no? Contraste con P0.2(c).
                </>}
                ayuda="Dos cifras en pesos, la diferencia entre una TIR y un rendimiento esperado, y un juicio sobre el capítulo 7." />

            <h3>C3 · ¿Se puede validar el VaR del fondo entero?</h3>
            <Tabla cabecera={['Acciones de su fondo · millones', 'VaR diario', `× √${dec(fondo.ruedas_mes, 1)}`, 'VaR mensual medido']}
                filas={['95', '99'].map(a => [`Al ${a} %`, miles(fondo.raiz[a].diario_mm), miles(fondo.raiz[a].escalado_mm), miles(fondo.raiz[a].mensual_mm)])}
                nota={`Rendimientos simples, para que todo quede en pesos. ${dec(fondo.ruedas_mes, 1)} es el promedio de ruedas por mes en el panel.`} />
            <Tabla cabecera={['La prueba de Kupiec al 5 %', 'Rechaza con estas excepciones', 'Rechaza un VaR correcto', 'Si la probabilidad real de excepción fuera el doble', 'Si fuera el triple']}
                filas={[
                    ['95 meses, VaR al 99 %', k(pot['95_0.01']), pc(pot['95_0.01'].tamano), pc(pot['95_0.01'].potencia_2a), pc(pot['95_0.01'].potencia_3a)],
                    ['95 meses, VaR al 95 %', k(pot['95_0.05']), pc(pot['95_0.05'].tamano), pc(pot['95_0.05'].potencia_2a), pc(pot['95_0.05'].potencia_3a)],
                    ['250 ruedas, VaR al 99 %', k(pot['250_0.01']), pc(pot['250_0.01'].tamano), pc(pot['250_0.01'].potencia_2a), pc(pot['250_0.01'].potencia_3a)],
                    ['1 666 ruedas, VaR al 99 %', k(pot['1666_0.01']), pc(pot['1666_0.01'].tamano), pc(pot['1666_0.01'].potencia_2a), pc(pot['1666_0.01'].potencia_3a)],
                ]}
                nota="Probabilidades exactas con la binomial: la de rechazar cuando el VaR acierta, y cuando la probabilidad real de excepción es dos o tres veces la del nivel." />

            <RespuestaAbierta id="P6.3" etiqueta="P6.3 · Una cifra que nadie puede validar"
                minPalabras={150} filas={9}
                enunciado={<>
                    La regla del capítulo 6 valida un VaR diario con 250 ruedas. El VaR del fondo entero es
                    mensual, porque la curva lo es. ¿Puede la junta escalar el VaR diario de las acciones por la
                    raíz del tiempo y ahorrarse el problema? Diga qué muestra la primera tabla en su fondo y si, con
                    95 meses, esa diferencia se distingue del ruido; compárelo con lo que dice la afirmación 5 del
                    informe. Con la segunda tabla: si la probabilidad real de excepción de su VaR mensual al 99 %
                    fuera el doble de la nominal, ¿con qué probabilidad lo detectaría Kupiec con estos 95 meses?
                    Proponga a la junta qué hacer con esa cifra, y diga lo que cuesta.
                </>}
                ayuda="Una lectura de cada tabla, una probabilidad y una propuesta con su costo." />

            <h3>C4 · Dos coberturas para el mismo tramo</h3>
            <Ficha titulo={`Cubrir el tramo (con su TES ${anioTES(ejes.tes)}) vendiendo el bono a la par de diez años`}
                filas={[
                    ['', 'Millones nominales a vender', 'R²'],
                    ['Por duración: DV01 cero contra la curva (capítulo 10)', miles(b.n10), '—'],
                    ['Por regresión mensual, 2003–2025 (capítulo 3)', `${miles(b.c4.beta_2003)} ± ${miles(b.c4.se_2003)}`, dec(b.c4.r2_2003, 3)],
                    ['Por regresión mensual, 2003–2017', `${miles(b.c4.beta_is)} ± ${miles(b.c4.se_is)}`, dec(b.c4.r2_is, 3)],
                    ['Por regresión mensual, 2018–2025', `${miles(b.c4.beta_2018)} ± ${miles(b.c4.se_2018)}`, '—'],
                    ['Varianza que quita en 2018–2025 la cobertura por duración', `${dec(b.c4.quita_dur_pct, 2)} %`, ''],
                    ['Varianza que quita en 2018–2025 la regresión estimada en 2003–2017', `${dec(b.c4.quita_beta_pct, 2)} %`, ''],
                    ['Intervalo del 95 % de la diferencia (duración − regresión), en puntos porcentuales', `${dec(b.c4.ic_dif_pp[0], 2)} a ${dec(b.c4.ic_dif_pp[1], 2)}`, ''],
                ]}
                nota={`La regresión es la del capítulo 3: el resultado mensual del tramo contra el del bono a la par, y la pendiente es la cobertura; después del ± va su error estándar. El remuestreo (bootstrap) toma con reposición los ${b.c4.boot.meses_prueba} meses de prueba ${miles(b.c4.boot.replicas)} veces con la semilla ${b.c4.boot.semilla}: es una simulación y reporta su aproximación, como pide la sexta convención del curso.`} />

            <RespuestaAbierta id="P6.4" etiqueta="P6.4 · ¿Cuál de las dos le vende a la junta?"
                minPalabras={150} filas={9}
                enunciado={<>
                    Con la regresión estimada en 2003–2017, que es la que se prueba en 2018–2025: ¿por cuántos
                    errores estándar difiere de la cobertura por duración? ¿Y cuánto difieren en varianza quitada
                    fuera de la muestra? Explique por qué pueden quitar casi la misma varianza: cómo crece la
                    varianza que queda cuando la cobertura se aleja de la óptima, y de qué lado de la regresión de
                    2018–2025 queda cada una. ¿Se distingue la diferencia del ruido en su TES? Si no, ¿qué decide
                    entre las dos? Diga cuál lleva a la junta y lo que cuesta.
                </>}
                ayuda="Una distancia en errores estándar, un mecanismo, una lectura del intervalo y una decisión con su razón." />
        </div>
    );
};

/* ============================================================================
   BLOQUE 7 · La nota a la junta y la entrega
============================================================================ */
const BloqueEntrega = () => (
    <div>
        <SectionHeader title="Bloque 7 · La nota a la junta y la entrega" />

        <Motivacion icon="fa-paper-plane"
            gancho="Si el navegador pierde lo guardado —pasa—, el archivo que ya descargó sigue valiendo. La pestaña abierta, no.">
            La junta lee una página. Después viene la sustentación, que se hace sobre lo que usted entregue.
            Lo que se califica es el archivo de entrega, no lo que quedó en el navegador.
        </Motivacion>

        <NivelIA nivel={3} nota="Con bitácora. La nota y las tres preguntas son suyas; la bitácora es la condición para que se califique todo lo demás." />

        <RespuestaAbierta id="P7.1" etiqueta="P7.1 · La nota a la junta"
            minPalabras={150} maxPalabras={300} filas={10}
            enunciado={<>
                Una nota para personas que no leen estadística, de 150 a 300 palabras: cuánto puede perder el
                fondo entero en un mes malo y con cuántos datos se sabe; qué hacer con la propuesta del comité;
                y qué cubre y qué no la cobertura del tramo. Cada decisión con lo que cuesta en pesos. Sin σ,
                ζ, β ni «cuantil». Si una cifra no cabe en una frase que entienda un miembro de la junta, no va.
            </>}
            ayuda="Tres asuntos, una decisión y un costo por cada uno, en lenguaje de junta." />

        <RespuestaAbierta id="P7.2" etiqueta="P7.2 · Las tres preguntas que no quiere que le hagan"
            minPalabras={80} filas={6}
            enunciado={<>
                Escriba las tres preguntas que menos le gustaría recibir en la sustentación sobre su fondo, su
                TES y su ventana, y diga por qué cada una. Una de ellas se la van a hacer.
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
                    Las decisiones previas 5 % · el fondo entero 14 % · validar al comité 14 % · los
                    procedimientos 10 % · los barridos 12 % · la auditoría del informe 15 % · la conciliación
                    20 % · la nota y las tres preguntas 10 %. Eso reparte el <strong>taller escrito</strong>, que
                    pesa el <strong>65 % de la nota</strong>; el <strong>35 % restante</strong> es la{' '}
                    <strong>sustentación oral de quince minutos</strong>, sin IA y sobre lo que entregue. El taller
                    escrito <strong>no puede valer más de un punto por encima</strong> de la sustentación: si lo
                    escrito no se sostiene en voz alta, vale lo de voz alta.
                </>,
            },
            {
                titulo: 'Qué NO se califica',
                contenido: <>
                    Los ejercicios con botón de «Comprobar» valen cero: llevan la respuesta dentro del archivo. Sus
                    intentos quedan registrados y se miran en la sustentación, pero no suman ni restan.
                </>,
            },
            {
                titulo: 'Qué lleva el archivo',
                contenido: <>
                    Su nombre y documento, su combinación, todas sus respuestas con la hora en que escribió cada
                    una por primera vez, los valores que recorrió en los dos laboratorios, los intentos de cada
                    andamio y un código de verificación. <strong>Ese código detecta un archivo corrupto o
                    truncado; no es una firma</strong>: el código que lo calcula está en esta misma página.
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
    { id: 'b1', title: 'Bloque 1 · El fondo entero', icon: 'BarChart', component: Bloque1 },
    { id: 'b2', title: 'Bloque 2 · Validar al comité', icon: 'Activity', component: Bloque2 },
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
        document.title = `Taller integrador · ${CONFIG.titulo} — Teoría del Riesgo`;
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
