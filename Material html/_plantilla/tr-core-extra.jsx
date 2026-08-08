        /* ============================================================
           ICONOS ADICIONALES (se fusionan con el objeto Icons base)
        ============================================================ */
        Object.assign(Icons, {
            Workflow: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="15" width="6" height="6" rx="1" />
                    <path d="M9 6h3a3 3 0 0 1 3 3v6" /><path d="M6 9v3a3 3 0 0 0 3 3h3" />
                </svg>
            ),
            ArrowDownUp: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M7 3v18" /><polyline points="3 7 7 3 11 7" />
                    <path d="M17 21V3" /><polyline points="13 17 17 21 21 17" />
                </svg>
            ),
            GitBranch: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
                    <path d="M18 9a9 9 0 0 1-9 9" />
                </svg>
            ),
            Repeat: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" />
                    <polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
            ),
            FileCode: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                    <polyline points="10 12 8 14 10 16" /><polyline points="14 12 16 14 14 16" />
                </svg>
            ),
            Grid: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" /><line x1="3" y1="15" x2="21" y2="15" />
                    <line x1="9" y1="3" x2="9" y2="21" /><line x1="15" y1="3" x2="15" y2="21" />
                </svg>
            ),
            FunctionSquare: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M9 17c0-4 1-9 3-9" /><line x1="8" y1="12" x2="14" y2="12" />
                </svg>
            ),
            Bug: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <rect x="8" y="6" width="8" height="14" rx="4" />
                    <path d="M8 12H3" /><path d="M21 12h-5" /><path d="M8 17l-4 3" /><path d="M16 17l4 3" />
                    <path d="M8 8L5 5" /><path d="M16 8l3-3" />
                </svg>
            ),
            Table: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="3" y1="9" x2="21" y2="9" /><line x1="10" y1="9" x2="10" y2="21" />
                </svg>
            ),
            Layers: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
                </svg>
            ),
        });

        /* ============================================================
           RESALTADO DE SINTAXIS — Prism.js 1.29
           Este curso usa dos lenguajes, Python y R, y Prism trae gramática
           oficial de los dos. No se registra ninguna a mano.
        ============================================================ */
        const GRAMATICA = { python: 'python', r: 'r', shell: 'bash', text: null };

        /* Prefijo de SALIDA por lenguaje: el marcador de comentario del propio
           lenguaje más `>`. Así la salida sigue siendo un comentario válido y
           el bloque copiado se puede ejecutar tal cual.

           Python y R comparten el mismo prefijo `#>`, que es lo que obliga a
           que TODO bloque de código viva dentro de un `CodeTabs`: fuera de él
           nada dice de qué lenguaje es una salida, y la comprobación 9 —la que
           ejecuta el código y contrasta lo declarado— no sabría con qué
           intérprete correrlo. */
        const PREFIJO_SALIDA = { python: '#>', r: '#>' };

        const escaparHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        /* Marca las líneas de salida sobre el HTML YA resaltado. Prism las
           tokeniza como comentario, y un comentario nunca cruza el salto de
           línea, así que cada línea queda autocontenida y se puede envolver. */
        const marcarSalida = (html, lang) => {
            const pref = PREFIJO_SALIDA[lang];
            if (!pref) return html;
            return html.split('\n').map(linea => {
                const plano = linea.replace(/<[^>]*>/g, '').trimStart();
                return plano.startsWith(pref) ? `<span class="tr-salida">${linea}</span>` : linea;
            }).join('\n');
        };

        const resaltar = (codigo, lang) => {
            const nombre = GRAMATICA[lang];
            const gram = (nombre && window.Prism) ? Prism.languages[nombre] : null;
            const html = gram ? Prism.highlight(codigo, gram, nombre) : escaparHtml(codigo);
            return marcarSalida(html, lang);
        };

        /* ============================================================
           METADATOS DE LENGUAJE — orden fijo del curso
           Python → R.

           Python va primero y es la pestaña por defecto a propósito: los
           estudiantes llegan del programa de Estadística con R como lengua
           materna, y el syllabus promete un puente hacia Python. Abrir en
           Python empuja al lenguaje nuevo dejando R a un clic.
        ============================================================ */
        const LANG_ORDEN = ['python', 'r'];
        const LANG_DEFECTO = 'python';
        const LANG_META = {
            python: { label: 'Python', corto: 'Python', icon: 'fab fa-python', color: 'text-yellow-400' },
            r: { label: 'R', corto: 'R', icon: 'fas fa-chart-line', color: 'text-cyan-300' },
            shell: { label: 'Terminal', corto: 'Shell', icon: 'fas fa-terminal', color: 'text-green-400' },
            text: { label: 'Salida', corto: 'Salida', icon: 'fas fa-file-alt', color: 'text-gray-300' },
        };

        /* ============================================================
           BLOQUE DE CÓDIGO (un solo lenguaje)
           La salida NO va en un panel aparte: se escribe dentro del código
           con el prefijo del lenguaje, pegada a la instrucción que la produce.
        ============================================================ */
        const CodeBlock = ({ title, code, lang = LANG_DEFECTO, plegable, conPestanas = false }) => {
            const [copiado, setCopiado] = useState(false);
            const meta = LANG_META[lang] || LANG_META.text;

            // Se pliegan los bloques largos de exposición. Dentro de un
            // ejercicio nunca (`plegable={false}`): una traza que hay que
            // desplegar antes de poder trazarla estorba.
            const admitePliegue = plegable === undefined ? code.split('\n').length > 12 : plegable;
            const [plegado, setPlegado] = useState(admitePliegue);

            const copiar = () => {
                // Se copia `code`, la cadena original. El DOM lleva el marcado
                // de Prism y pegar eso daría un archivo que no corre.
                navigator.clipboard.writeText(code).then(() => {
                    setCopiado(true);
                    setTimeout(() => setCopiado(false), 2000);
                }).catch(() => { });
            };

            return (
                <div className={`tr-code-wrapper my-4 ${conPestanas ? 'con-pestanas' : ''}`}>
                    <div className="tr-code-header">
                        <span className="tr-code-title">
                            <i className={`${meta.icon} mr-2`}></i>{title || meta.label}
                        </span>
                        <span className="flex items-center gap-2">
                            <button className={`tr-code-btn ${copiado ? 'copiado' : ''}`} onClick={copiar}
                                title="Copiar código" aria-label="Copiar código">
                                <i className={`fas ${copiado ? 'fa-check' : 'fa-copy'}`}></i>
                                <span>{copiado ? 'Copiado' : 'Copiar'}</span>
                            </button>
                            {admitePliegue && (
                                <button className="tr-code-btn" onClick={() => setPlegado(p => !p)}
                                    aria-expanded={!plegado} title={plegado ? 'Mostrar todo el código' : 'Plegar el código'}>
                                    <span>{plegado ? 'Mostrar' : 'Ocultar'}</span>
                                    <i className={`fas fa-chevron-down transition-transform duration-200 ${plegado ? '' : 'rotate-180'}`}></i>
                                </button>
                            )}
                        </span>
                    </div>
                    <pre className={`tr-code-pre ${plegado ? 'plegado' : ''}`}>
                        <code dangerouslySetInnerHTML={{ __html: resaltar(code, lang) }} />
                    </pre>
                </div>
            );
        };

        /* ============================================================
           LÍNEA DE TIEMPO
        ============================================================ */
        const Timeline = ({ eventos }) => (
            <div className="relative border-l-2 border-primary/30 ml-3 my-6 space-y-5">
                {eventos.map((e, i) => (
                    <div key={i} className="ml-6 relative">
                        <span className="absolute left-[-1.95rem] top-1 w-4 h-4 rounded-full tr-gradient border-2 border-white shadow"></span>
                        <span className="text-sm font-extrabold text-secondary">{e.year}</span>
                        <p className="text-sm text-gray-700 mt-0.5">{e.text}</p>
                    </div>
                ))}
            </div>
        );

        /* ============================================================
           CODETABS — el mismo cálculo en Python y en R
           Cada bloque es INDEPENDIENTE: cambiar su pestaña no mueve
           ninguna otra, de modo que se pueden tener los dos lenguajes en
           pantalla a la vez para compararlos.
           La última elección se guarda en localStorage y es la que
           muestran, al montarse, los bloques que el estudiante aún no ha
           tocado —en esta visita y en las siguientes—. Sin esa memoria,
           quien lea en R tendría que elegirlo en cada uno de los hasta
           15 bloques de un capítulo.
        ============================================================ */
        const CODETABS_KEY = 'tdr_lenguaje_preferido';

        const CodeTabs = ({ bloques, titulo, defecto = LANG_DEFECTO, nota, plegable }) => {
            const disponibles = LANG_ORDEN.filter(l => bloques && bloques[l]);
            const elegirInicial = () => {
                const guardado = localStorage.getItem(CODETABS_KEY);
                if (guardado && bloques[guardado]) return guardado;
                if (bloques[defecto]) return defecto;
                return disponibles[0];
            };
            const [lang, setLang] = useState(elegirInicial);
            const ref = useRef(null);

            // Solo el estado propio. Escribir la preferencia NO avisa a las
            // demás instancias: son independientes a propósito.
            const cambiar = (l) => {
                setLang(l);
                localStorage.setItem(CODETABS_KEY, l);
            };

            if (!disponibles.length) return null;
            const activo = bloques[lang] ? lang : disponibles[0];

            return (
                <div ref={ref} className="my-5">
                    {titulo && (
                        <div className="text-sm font-semibold text-navy mb-2 flex items-center gap-2">
                            <i className="fas fa-code text-secondary"></i>{titulo}
                        </div>
                    )}
                    <div className="flex flex-wrap gap-1 items-end" role="tablist" aria-label="Lenguaje del ejemplo">
                        {disponibles.map(l => {
                            const m = LANG_META[l];
                            const esActivo = activo === l;
                            return (
                                <button key={l} role="tab" aria-selected={esActivo} onClick={() => cambiar(l)}
                                    className={`tr-tab ${esActivo ? 'activa' : ''}`}>
                                    <i className={m.icon}></i>
                                    <span className="hidden sm:inline">{m.label}</span>
                                    <span className="sm:hidden">{m.corto}</span>
                                </button>
                            );
                        })}
                        <span className="ml-auto text-[0.65rem] text-gray-400 pr-2 pb-1.5 hidden md:block">
                            <i className="fas fa-bookmark mr-1"></i>solo este bloque · se recuerda su preferencia
                        </span>
                    </div>
                    <div key={activo} className="animate-fade-in">
                        <CodeBlock code={bloques[activo]} lang={activo} conPestanas plegable={plegable} />
                    </div>
                    {nota && <p className="text-xs text-gray-500 italic -mt-2 mb-4 px-1">{nota}</p>}
                </div>
            );
        };

        /* ============================================================
           LENGUAJE ACTIVO EN LOS EJERCICIOS
           Misma regla que `CodeTabs`: cada ejercicio es independiente, y al
           montarse arranca en la última preferencia guardada. Así, quien lee
           la exposición en R encuentra el ejercicio en R sin tener que volver
           a elegirlo, pero puede cambiarlo sin arrastrar consigo el resto del
           capítulo.

           `porLenguaje` acepta indistintamente un valor único (igual para los
           dos lenguajes) o un objeto {python, r}. Si falta el lenguaje activo,
           cae a Python.
        ============================================================ */
        const esMapaDeLenguajes = (v) =>
            v && typeof v === 'object' && !Array.isArray(v) && !React.isValidElement(v)
            && LANG_ORDEN.some(l => l in v);

        const porLenguaje = (v, lang) =>
            esMapaDeLenguajes(v) ? (v[lang] !== undefined ? v[lang] : (v[LANG_DEFECTO] !== undefined ? v[LANG_DEFECTO] : Object.values(v)[0])) : v;

        const lenguajesDe = (v) => esMapaDeLenguajes(v) ? LANG_ORDEN.filter(l => l in v) : [];

        /* Atajo para las instrucciones cortas de una traza o de un ejercicio:
           `ins('r = np.diff(...)', 'r <- diff(...)')` en vez de escribir el
           objeto entero. El orden de los argumentos es el de las pestañas. */
        const ins = (python, r) => ({ python, r });

        const useLenguajeActivo = (disponibles, defecto = LANG_DEFECTO) => {
            const clave = disponibles.join('|');
            const elegir = () => {
                const g = localStorage.getItem(CODETABS_KEY);
                if (g && disponibles.includes(g)) return g;
                if (disponibles.includes(defecto)) return defecto;
                return disponibles[0];
            };
            const [lang, setLang] = useState(elegir);
            useEffect(() => { setLang(elegir()); }, [clave]);
            // Devuelve un par, no un valor: el componente necesita el
            // cambiador para pasárselo a su <SelectorLenguaje>.
            const cambiar = (l) => {
                setLang(l);
                localStorage.setItem(CODETABS_KEY, l);
            };
            return [lang, cambiar];
        };

        const SelectorLenguaje = ({ disponibles, activo, onCambiar }) => {
            if (!disponibles || disponibles.length < 2) return null;
            const cambiar = (l) => onCambiar && onCambiar(l);
            return (
                <div className="flex flex-wrap gap-1 mb-2" role="tablist" aria-label="Lenguaje del ejercicio">
                    {disponibles.map(l => {
                        const m = LANG_META[l], act = activo === l;
                        return (
                            <button key={l} role="tab" aria-selected={act} onClick={() => cambiar(l)}
                                className={`px-2.5 py-1 text-[0.72rem] font-semibold rounded-full transition-colors flex items-center gap-1.5 border ${act ? 'text-white tr-gradient border-transparent shadow-sm' : 'text-gray-500 border-gray-200 hover:text-primary hover:border-primary/40'}`}>
                                <i className={`${m.icon} text-[0.7rem]`}></i>{m.corto}
                            </button>
                        );
                    })}
                </div>
            );
        };

        /* ============================================================
           MOTIVACIÓN DE APERTURA
           Obligatoria al comienzo de CADA sección. No resume lo que viene:
           da una razón para seguir leyendo.

           Receta (máx. ~80 palabras):
             1. una escena concreta del sector financiero;
             2. la tensión o el costo que esa escena revela;
             3. `gancho`: la pregunta que la sección viene a responder.
        ============================================================ */
        const Motivacion = ({ gancho, icon = 'fa-compass', etiqueta = 'Antes de empezar', children }) => {
            const ref = useRef(null);
            useTypeset(ref, []);
            return (
                <div ref={ref} className="my-5 rounded-2xl overflow-hidden border not-prose"
                    style={{ borderColor: 'rgba(61,0,141,0.15)' }}>
                    <div className="px-5 py-4"
                        style={{ background: 'linear-gradient(135deg, rgba(61,0,141,0.055) 0%, rgba(14,116,144,0.05) 45%, rgba(237,30,121,0.10) 100%)' }}>
                        <div className="flex gap-3.5">
                            <span className="flex-shrink-0 w-9 h-9 rounded-full tr-gradient text-white flex items-center justify-center shadow-sm">
                                <i className={`fas ${icon} text-sm`}></i>
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="text-[0.65rem] uppercase tracking-widest font-bold mb-1.5" style={{ color: 'rgba(61,0,141,0.62)' }}>
                                    {etiqueta}
                                </div>
                                <div className="text-[0.96rem] text-gray-700 leading-relaxed">{children}</div>
                                {gancho && (
                                    <p className="mt-3 text-primary font-semibold text-[1.02rem] leading-snug pl-3"
                                        style={{ margin: '0.75rem 0 0', borderLeft: '3px solid #ED1E79' }}>
                                        {gancho}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        };

        /* ============================================================
           TAXONOMÍA DE EJERCICIOS DEL CURSO — R1…R9
           R1, R3, R4, R5, R6 y R9 tienen componente propio y ya se
           autoetiquetan. R2, R7 y R8 se construyen con MCQ o Reto, así
           que se envuelven en <Ejercicio tipo="R7"> para que el tipo sea
           visible al estudiante y contable por verificar.py.

           No es la taxonomía E1–E8 de Lógica de Programación con otro
           nombre: allí el objeto de estudio es el algoritmo y aquí es el
           modelo —sus supuestos, su validación y su lectura de negocio—.
           Lo que se conserva es el componente; lo que cambia es qué se
           pone dentro.
        ============================================================ */
        const TIPOS_EJERCICIO = {
            R1: { etiqueta: 'R1 · Traza de cálculo', color: '#3D008D' },
            R2: { etiqueta: 'R2 · Predice el efecto', color: '#0E7490' },
            R3: { etiqueta: 'R3 · Audita a la IA', color: '#B91C1C' },
            R4: { etiqueta: 'R4 · Comparación', color: '#0E7490' },
            R5: { etiqueta: 'R5 · Procedimiento', color: '#3D008D' },
            R6: { etiqueta: 'R6 · Emparejar', color: '#3D008D' },
            R7: { etiqueta: 'R7 · Interpretación', color: '#15803D' },
            R8: { etiqueta: 'R8 · Justifica', color: '#B45309' },
            R9: { etiqueta: 'R9 · Laboratorio', color: '#7C3AED' },
        };

        const Ejercicio = ({ tipo, children }) => {
            const t = TIPOS_EJERCICIO[tipo];
            if (!t) return children;
            // La etiqueta se ancla SOBRE el borde superior de la tarjeta, no
            // dentro: si se superpone al contenido, un enunciado de dos líneas
            // le pasa por debajo y queda ilegible.
            return (
                <div className="relative">
                    <span className="absolute z-10 text-[0.65rem] uppercase tracking-wider font-bold text-white rounded px-2 py-0.5 shadow-sm"
                        style={{ background: t.color, top: '0.55rem', right: '1rem' }}>
                        {t.etiqueta}
                    </span>
                    {children}
                </div>
            );
        };

        /* ============================================================
           R1 · TRAZA DE CÁLCULO
           El estudiante completa el estado de las variables paso a paso.
           Comparación tolerante: espacios, mayúsculas, coma/punto decimal
           y marcas de "sin valor" (—, -, vacío) se normalizan.
        ============================================================ */
        const normalizarCelda = (v) => {
            let s = String(v === null || v === undefined ? '' : v).trim().toLowerCase();
            s = s.replace(/\s+/g, '');
            if (s === '' || s === '-' || s === '—' || s === '–' || s === 'vacio' || s === 'vacío' || s === 'nada' || s === 'null') return '∅';
            s = s.replace(/\$/g, '').replace(/\bcop\b/g, '');
            if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
            else s = s.replace(',', '.');
            return s;
        };

        const celdasIguales = (a, b) => {
            const na = normalizarCelda(a), nb = normalizarCelda(b);
            if (na === nb) return true;
            const fa = parseFloat(na), fb = parseFloat(nb);
            if (Number.isFinite(fa) && Number.isFinite(fb)) {
                const tol = Math.max(1e-6, Math.abs(fb) * 1e-6);
                return Math.abs(fa - fb) <= tol;
            }
            return false;
        };

        const TablaTraza = ({ titulo = 'Prueba de escritorio', enunciado, codigo, lang = LANG_DEFECTO, columnas, filas, ocultas = [], pista }) => {
            // `codigo` y la columna `instruccion` de cada fila admiten un objeto
            // {python, r}. Los VALORES de las magnitudes no: una varianza EWMA
            // o un cuantil dan lo mismo en los dos lenguajes, y hacérselo ver
            // al estudiante es justamente el objetivo del ejercicio.
            const idiomas = lenguajesDe(codigo);
            const disponibles = idiomas.length ? idiomas : [lang];
            const [langActivo, cambiarLang] = useLenguajeActivo(disponibles, lang);

            const editables = [];
            filas.forEach((f, i) => columnas.forEach(c => { if (ocultas.includes(c.clave)) editables.push(`${i}|${c.clave}`); }));

            const [valores, setValores] = useState({});
            const [comprobado, setComprobado] = useState(false);
            const [revelado, setRevelado] = useState(false);
            const ref = useRef(null);
            useTypeset(ref, [comprobado, revelado]);

            const escribir = (k, v) => { if (!comprobado) setValores(p => ({ ...p, [k]: v })); };
            const esCorrecta = (i, clave) => celdasIguales(valores[`${i}|${clave}`], filas[i][clave]);
            const aciertos = editables.filter(k => { const [i, c] = k.split('|'); return esCorrecta(Number(i), c); }).length;
            const total = editables.length;
            const pct = total ? Math.round((aciertos / total) * 100) : 0;
            const color = pct >= 80 ? '#15803D' : pct >= 50 ? '#B45309' : '#B91C1C';

            return (
                <div ref={ref} className="my-6 rounded-2xl border-2 border-primary/20 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="tr-gradient text-white p-2 rounded-lg"><i className="fas fa-table-list"></i></span>
                        <h4 className="text-base font-bold text-primary" style={{ margin: 0 }}>{titulo}</h4>
                        <span className="ml-auto text-[0.65rem] uppercase tracking-wider font-bold text-white bg-primary/80 rounded px-2 py-0.5">R1 · Traza de cálculo</span>
                    </div>
                    {enunciado && <div className="text-[0.95rem] text-gray-700 mb-3">{enunciado}</div>}
                    <SelectorLenguaje disponibles={disponibles} activo={langActivo} onCambiar={cambiarLang} />
                    {codigo && <CodeBlock code={porLenguaje(codigo, langActivo)} lang={langActivo} title="Algoritmo a trazar" plegable={false} />}

                    <p className="text-xs text-gray-500 mb-2">
                        <i className="fas fa-keyboard mr-1"></i>
                        Complete las celdas resaltadas. Use <span className="inline-code">—</span> si la variable aún no tiene valor.
                    </p>

                    <div className="overflow-x-auto">
                        <table className="tabla-componente w-full text-sm border-collapse">
                            <thead>
                                <tr>
                                    {columnas.map(c => (
                                        <th key={c.clave} className="bg-primary/10 text-primary text-left px-3 py-2 border border-gray-200 font-semibold whitespace-nowrap">
                                            {c.titulo}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filas.map((f, i) => (
                                    <tr key={i} className={i % 2 ? 'bg-gray-50/60' : ''}>
                                        {columnas.map(c => {
                                            const editable = ocultas.includes(c.clave);
                                            if (!editable) {
                                                return <td key={c.clave} className="px-3 py-1.5 border border-gray-200 text-gray-700 align-top">
                                                    {c.clave === 'instruccion'
                                                        ? <span className="font-mono text-[0.82rem]">{porLenguaje(f[c.clave], langActivo)}</span>
                                                        : f[c.clave]}
                                                </td>;
                                            }
                                            const k = `${i}|${c.clave}`;
                                            const ok = esCorrecta(i, c.clave);
                                            let cls = 'border-gray-300 bg-amber-50/60';
                                            if (comprobado) cls = ok ? 'border-green-500 bg-green-50' : 'border-red-400 bg-red-50';
                                            return (
                                                <td key={c.clave} className="px-1.5 py-1 border border-gray-200">
                                                    <div className="flex items-center gap-1">
                                                        <input type="text" value={valores[k] || ''} onChange={e => escribir(k, e.target.value)}
                                                            disabled={comprobado} aria-label={`${c.titulo}, paso ${i + 1}`}
                                                            className={`w-full min-w-[70px] px-2 py-1 rounded border text-[0.82rem] font-mono outline-none focus:border-secondary ${cls}`} />
                                                        {comprobado && <i className={`fas ${ok ? 'fa-check text-green-600' : 'fa-xmark text-red-500'} text-xs`}></i>}
                                                    </div>
                                                    {comprobado && !ok && (
                                                        <div className="text-[0.7rem] text-green-700 font-mono mt-0.5 pl-1">→ {f[c.clave]}</div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                        {!comprobado
                            ? <button onClick={() => setComprobado(true)}
                                className="text-sm font-bold px-4 py-1.5 rounded-full text-white tr-gradient hover:opacity-90">
                                <i className="fas fa-check-double mr-1"></i>Comprobar traza
                            </button>
                            : <>
                                <button onClick={() => { setComprobado(false); setValores({}); setRevelado(false); }}
                                    className="text-sm font-bold px-4 py-1.5 rounded-full border border-primary text-primary hover:bg-primary/5">
                                    <i className="fas fa-rotate-right mr-1"></i>Reintentar
                                </button>
                                <span className="text-sm font-bold" style={{ color }}>
                                    {aciertos} / {total} celdas correctas ({pct} %)
                                </span>
                            </>}
                        {pista && !revelado && (
                            <button onClick={() => setRevelado(true)} className="text-xs font-semibold text-gray-500 hover:text-primary underline">
                                <i className="fas fa-lightbulb mr-1"></i>Ver pista
                            </button>
                        )}
                    </div>
                    {revelado && pista && (
                        <div className="mt-3 animate-fade-in"><Box type="tip" label="Pista">{pista}</Box></div>
                    )}
                </div>
            );
        };

        /* ============================================================
           R3 · AUDITA A LA IA — detecta, clasifica y cifra el error
           Dos respuestas obligatorias: UBICAR la línea y CLASIFICAR el
           tipo de error. La retroalimentación distingue el caso
           "ubicó bien pero clasificó mal", que es el más informativo.
        ============================================================ */
        const DetectaError = ({ titulo = 'Detecte y diagnostique el error', enunciado, lineas, lang = LANG_DEFECTO, lineaCorrecta, tipos, tipoCorrecto, explicacion, impacto }) => {
            // OJO: `lineaCorrecta` también admite {python, r}. El mismo fallo
            // NO está en la misma línea en los dos lenguajes: R necesita
            // `library(...)` donde Python usa `import`, los argumentos con
            // nombre se escriben distinto y una comprensión de lista de Python
            // suele ser un `sapply` de una línea en R. Darlo por constante
            // haría que el ejercicio calificara mal al cambiar de pestaña, y
            // en silencio.
            //
            // Y con la clave va el TEXTO: `enunciado` y `explicacion` admiten
            // el mismo objeto. Un enunciado que dice «la línea que estandariza
            // los residuos» es cierto en los dos; uno que dice «la línea 7»
            // solo lo es en uno. Lo mejor es redactarlos sin citar ningún
            // número; cuando haga falta citarlo, va por lenguaje. La
            // comprobación 8 de verificar.py vigila las dos propiedades.
            const idiomas = lenguajesDe(lineas);
            const disponibles = idiomas.length ? idiomas : [lang];
            const [langActivo, cambiarLang] = useLenguajeActivo(disponibles, lang);
            const lineasAct = porLenguaje(lineas, langActivo);
            const correctaAct = porLenguaje(lineaCorrecta, langActivo);
            const enunciadoAct = porLenguaje(enunciado, langActivo);
            const explicacionAct = porLenguaje(explicacion, langActivo);

            const [linea, setLinea] = useState(null);
            const [tipo, setTipo] = useState(null);
            const [comprobado, setComprobado] = useState(false);
            const ref = useRef(null);
            useTypeset(ref, [comprobado]);

            // Al cambiar de lenguaje la selección previa deja de tener sentido.
            useEffect(() => { setLinea(null); setComprobado(false); }, [langActivo]);

            const lineaOk = linea === correctaAct;
            const tipoOk = tipo === tipoCorrecto;
            // El botón exige las DOS respuestas. Un botón deshabilitado que no
            // dice por qué se lee como roto: quien completó el Paso 1 pulsa y
            // no pasa nada. Se rotula el progreso —igual que `Emparejamiento`,
            // que muestra «Comprobar (2/4)»— y se nombra el paso que falta.
            const hechos = (linea !== null ? 1 : 0) + (tipo !== null ? 1 : 0);
            const listo = hechos === 2;
            const queFalta = linea === null && tipo === null
                ? 'Señale la línea (Paso 1) y clasifique el error (Paso 2) para poder comprobar.'
                : linea === null ? 'Falta el Paso 1: señale la línea que contiene el error.'
                    : tipo === null ? 'Falta el Paso 2: clasifique el tipo de error.'
                        : null;

            return (
                <div ref={ref} className="my-6 rounded-2xl border-2 p-5 shadow-sm" style={{ borderColor: '#FCA5A5', background: '#FFFBFB' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-white p-2 rounded-lg" style={{ background: 'linear-gradient(135deg,#B91C1C 0%,#F59E0B 100%)' }}><i className="fas fa-bug"></i></span>
                        <h4 className="text-base font-bold text-navy" style={{ margin: 0 }}>{titulo}</h4>
                        <span className="ml-auto text-[0.65rem] uppercase tracking-wider font-bold text-white bg-red-700/80 rounded px-2 py-0.5">R3 · Audita a la IA</span>
                    </div>
                    {enunciadoAct && <div className="text-[0.95rem] text-gray-700 mb-3">{enunciadoAct}</div>}

                    <p className="text-xs font-semibold text-gray-600 mb-1"><span className="text-red-700">Paso 1.</span> Señale la línea que contiene el error:</p>
                    <SelectorLenguaje disponibles={disponibles} activo={langActivo} onCambiar={cambiarLang} />
                    <div className="rounded-xl overflow-hidden border border-gray-700 bg-gray-900 mb-4">
                        {lineasAct.map((l, i) => {
                            const n = i + 1;
                            const sel = linea === n;
                            let cls = 'hover:bg-white/5';
                            if (comprobado) {
                                if (n === correctaAct) cls = 'bg-green-900/50 ring-1 ring-green-500';
                                else if (sel) cls = 'bg-red-900/50 ring-1 ring-red-500';
                            } else if (sel) cls = 'bg-amber-500/20 ring-1 ring-amber-400';
                            return (
                                <button key={i} onClick={() => !comprobado && setLinea(n)} disabled={comprobado}
                                    aria-label={`Línea ${n}`} aria-pressed={sel}
                                    className={`w-full text-left flex items-start gap-3 px-3 py-1 font-mono text-[0.82rem] transition-colors ${cls}`}>
                                    <span className="text-gray-600 select-none w-6 text-right flex-shrink-0">{n}</span>
                                    <span className="text-gray-100 whitespace-pre overflow-x-auto"
                                        dangerouslySetInnerHTML={{ __html: resaltar(l, langActivo) }} />
                                    {comprobado && n === correctaAct && <i className="fas fa-arrow-left text-green-400 ml-auto flex-shrink-0 mt-0.5"></i>}
                                </button>
                            );
                        })}
                    </div>

                    <p className="text-xs font-semibold text-gray-600 mb-1"><span className="text-red-700">Paso 2.</span> Clasifique el tipo de error:</p>
                    <div className="space-y-1.5 mb-3">
                        {tipos.map((t, i) => {
                            const sel = tipo === i;
                            let cls = 'border-gray-200 bg-white hover:border-primary/40';
                            if (comprobado) {
                                if (i === tipoCorrecto) cls = 'border-green-500 bg-green-50';
                                else if (sel) cls = 'border-red-400 bg-red-50';
                                else cls = 'border-gray-200 bg-white opacity-70';
                            } else if (sel) cls = 'border-secondary bg-amber-50';
                            return (
                                <button key={i} onClick={() => !comprobado && setTipo(i)} disabled={comprobado}
                                    className={`w-full text-left px-3 py-2 rounded-lg border text-[0.9rem] flex items-center gap-2.5 transition-all ${cls}`}>
                                    <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[0.7rem] font-bold ${sel ? 'tr-gradient text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {String.fromCharCode(97 + i)}
                                    </span>
                                    <span className="flex-1 text-gray-700">{t}</span>
                                    {comprobado && i === tipoCorrecto && <i className="fas fa-check text-green-600 text-xs"></i>}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        {!comprobado
                            ? <button onClick={() => listo && setComprobado(true)} disabled={!listo}
                                className="text-sm font-bold px-4 py-1.5 rounded-full text-white tr-gradient disabled:opacity-40">
                                <i className="fas fa-magnifying-glass mr-1"></i>Comprobar diagnóstico ({hechos}/2)
                            </button>
                            : <button onClick={() => { setComprobado(false); setLinea(null); setTipo(null); }}
                                className="text-sm font-bold px-4 py-1.5 rounded-full border border-primary text-primary hover:bg-primary/5">
                                <i className="fas fa-rotate-right mr-1"></i>Reintentar
                            </button>}
                        {!comprobado && queFalta && (
                            <span className="text-xs text-gray-600" role="status">
                                <i className="fas fa-circle-info mr-1"></i>{queFalta}
                            </span>
                        )}
                        {comprobado && (
                            <span className={`text-sm font-bold ${lineaOk && tipoOk ? 'text-green-600' : 'text-red-500'}`}>
                                <i className={`fas ${lineaOk && tipoOk ? 'fa-circle-check' : 'fa-circle-xmark'} mr-1`}></i>
                                {lineaOk && tipoOk ? '¡Diagnóstico correcto!'
                                    : lineaOk ? 'Ubicó bien la línea, pero el tipo de error no es ese.'
                                        : tipoOk ? 'Clasificó bien el tipo, pero el error está en otra línea.'
                                            : 'Ni la línea ni el tipo son correctos.'}
                            </span>
                        )}
                    </div>

                    {comprobado && (
                        <div className="mt-4 space-y-3 animate-fade-in">
                            <Box type="info" label="Explicación">{explicacionAct}</Box>
                            {impacto && <Box type="danger" label="Consecuencia financiera">{impacto}</Box>}
                        </div>
                    )}
                </div>
            );
        };

        /* ============================================================
           R4 · COMPARADOR — dos versiones lado a lado + veredicto
        ============================================================ */
        const Comparador = ({ titulo = 'Compare las dos versiones', enunciado, a, b, lang = LANG_DEFECTO, pregunta, opciones, multiple = false }) => {
            const idiomas = lenguajesDe(a.codigo);
            const disponibles = idiomas.length ? idiomas : [lang];
            const [langActivo, cambiarLang] = useLenguajeActivo(disponibles, lang);

            const panel = (v, acento) => (
                <div className="flex-1 min-w-[260px]">
                    <div className="text-xs font-bold uppercase tracking-wider mb-1 px-1" style={{ color: acento }}>
                        <i className="fas fa-code-branch mr-1"></i>{v.etiqueta}
                    </div>
                    <CodeBlock code={porLenguaje(v.codigo, langActivo)} lang={v.lang || langActivo} title={v.etiqueta} plegable={false} />
                    {v.nota && <p className="text-xs text-gray-500 italic -mt-2 px-1">{v.nota}</p>}
                </div>
            );
            return (
                <div className="my-6 rounded-2xl border-2 border-teal/30 bg-white p-5 shadow-sm" style={{ borderColor: 'rgba(14,116,144,0.3)' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-white p-2 rounded-lg" style={{ background: 'linear-gradient(135deg,#0E7490,#3D008D)' }}><i className="fas fa-code-compare"></i></span>
                        <h4 className="text-base font-bold text-primary" style={{ margin: 0 }}>{titulo}</h4>
                        <span className="ml-auto text-[0.65rem] uppercase tracking-wider font-bold text-white rounded px-2 py-0.5" style={{ background: '#0E7490' }}>R4 · Comparación</span>
                    </div>
                    {enunciado && <div className="text-[0.95rem] text-gray-700 mb-3">{enunciado}</div>}
                    <SelectorLenguaje disponibles={disponibles} activo={langActivo} onCambiar={cambiarLang} />
                    <div className="flex flex-wrap gap-4">
                        {panel(a, '#3D008D')}
                        {panel(b, '#ED1E79')}
                    </div>
                    {pregunta && <MCQ pregunta={pregunta} opciones={opciones} multiple={multiple} />}
                </div>
            );
        };

        /* ============================================================
           R5 · ORDENA EL PROCEDIMIENTO
           Interacción por clic (no arrastrar): accesible por teclado y
           funcional en pantallas táctiles.
           El desorden es DETERMINISTA: no puede recalcularse en cada
           render ni cambiar entre visitas.
        ============================================================ */
        const mezclaPorDefecto = (n) => {
            const out = [];
            let i = 0, j = n - 1;
            while (i <= j) { out.push(j); if (i !== j) out.push(i); i++; j--; }
            return out;
        };

        const OrdenaPasos = ({ titulo = 'Ordene los pasos del algoritmo', enunciado, pasos, lang = LANG_DEFECTO, mezcla, pista }) => {
            const idiomas = lenguajesDe(pasos);
            const langs = idiomas.length ? idiomas : [lang];
            const [langActivo, cambiarLang] = useLenguajeActivo(langs, lang);
            const pasosAct = porLenguaje(pasos, langActivo);

            const orden = (mezcla && mezcla.length === pasosAct.length) ? mezcla : mezclaPorDefecto(pasosAct.length);
            const [secuencia, setSecuencia] = useState([]);
            const [comprobado, setComprobado] = useState(false);
            useEffect(() => { setSecuencia([]); setComprobado(false); }, [langActivo]);
            const disponibles = orden.filter(i => !secuencia.includes(i));

            const agregar = (i) => { if (!comprobado) setSecuencia(s => [...s, i]); };
            const quitar = (pos) => { if (!comprobado) setSecuencia(s => s.filter((_, k) => k !== pos)); };
            const completo = secuencia.length === pasosAct.length;
            const posOk = (pos) => secuencia[pos] === pos;
            const aciertos = secuencia.filter((_, pos) => posOk(pos)).length;
            const todoOk = completo && aciertos === pasosAct.length;

            return (
                <div className="my-6 rounded-2xl border-2 border-primary/20 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="tr-gradient text-white p-2 rounded-lg"><i className="fas fa-list-ol"></i></span>
                        <h4 className="text-base font-bold text-primary" style={{ margin: 0 }}>{titulo}</h4>
                        <span className="ml-auto text-[0.65rem] uppercase tracking-wider font-bold text-white bg-primary/80 rounded px-2 py-0.5">R5 · Procedimiento</span>
                    </div>
                    {enunciado && <div className="text-[0.95rem] text-gray-700 mb-3">{enunciado}</div>}

                    <SelectorLenguaje disponibles={langs} activo={langActivo} onCambiar={cambiarLang} />
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                Pasos disponibles ({disponibles.length})
                            </div>
                            <div className="space-y-1.5 min-h-[60px] rounded-xl border-2 border-dashed border-gray-200 p-2">
                                {disponibles.map(i => (
                                    <button key={i} onClick={() => agregar(i)} disabled={comprobado}
                                        className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 hover:border-secondary hover:bg-amber-50 text-[0.88rem] text-gray-700 font-mono transition-all flex items-center gap-2">
                                        <i className="fas fa-plus text-secondary text-xs flex-shrink-0"></i>
                                        <span className="flex-1">{pasosAct[i]}</span>
                                    </button>
                                ))}
                                {!disponibles.length && <p className="text-xs text-gray-400 italic text-center py-3" style={{ margin: 0 }}>Todos los pasos están en la secuencia</p>}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                                Su secuencia ({secuencia.length}/{pasosAct.length})
                            </div>
                            <div className="space-y-1.5 min-h-[60px] rounded-xl border-2 border-dashed p-2" style={{ borderColor: '#ED1E79' }}>
                                {secuencia.map((i, pos) => {
                                    let cls = 'border-gray-200 bg-white';
                                    if (comprobado) cls = posOk(pos) ? 'border-green-500 bg-green-50' : 'border-red-400 bg-red-50';
                                    return (
                                        <button key={pos} onClick={() => quitar(pos)} disabled={comprobado}
                                            className={`w-full text-left px-3 py-2 rounded-lg border text-[0.88rem] text-gray-700 font-mono transition-all flex items-center gap-2 ${cls}`}>
                                            <span className="flex-shrink-0 w-5 h-5 rounded-full tr-gradient text-white flex items-center justify-center text-[0.7rem] font-bold">{pos + 1}</span>
                                            <span className="flex-1">{pasosAct[i]}</span>
                                            {comprobado
                                                ? <i className={`fas ${posOk(pos) ? 'fa-check text-green-600' : 'fa-xmark text-red-500'} text-xs flex-shrink-0`}></i>
                                                : <i className="fas fa-xmark text-gray-300 text-xs flex-shrink-0"></i>}
                                        </button>
                                    );
                                })}
                                {!secuencia.length && <p className="text-xs text-gray-400 italic text-center py-3" style={{ margin: 0 }}>Haga clic en los pasos de la izquierda, en el orden correcto</p>}
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                        {!comprobado
                            ? <button onClick={() => completo && setComprobado(true)} disabled={!completo}
                                className="text-sm font-bold px-4 py-1.5 rounded-full text-white tr-gradient disabled:opacity-40">
                                <i className="fas fa-flag-checkered mr-1"></i>Comprobar orden
                            </button>
                            : <>
                                <button onClick={() => { setComprobado(false); setSecuencia([]); }}
                                    className="text-sm font-bold px-4 py-1.5 rounded-full border border-primary text-primary hover:bg-primary/5">
                                    <i className="fas fa-rotate-right mr-1"></i>Reintentar
                                </button>
                                <span className={`text-sm font-bold ${todoOk ? 'text-green-600' : 'text-red-500'}`}>
                                    <i className={`fas ${todoOk ? 'fa-circle-check' : 'fa-circle-xmark'} mr-1`}></i>
                                    {todoOk ? '¡Secuencia correcta!' : `${aciertos} de ${pasosAct.length} pasos en la posición correcta`}
                                </span>
                            </>}
                    </div>
                    {comprobado && !todoOk && (
                        <div className="mt-3 animate-fade-in">
                            <Box type="tip" label="Orden correcto">
                                <ol className="text-sm" style={{ listStyle: 'decimal', paddingLeft: '1.4rem', margin: 0 }}>
                                    {pasosAct.map((p, i) => <li key={i} className="font-mono text-[0.85rem]">{p}</li>)}
                                </ol>
                            </Box>
                        </div>
                    )}
                    {pista && <p className="text-xs text-gray-500 italic mt-2"><i className="fas fa-lightbulb mr-1 text-secondary"></i>{pista}</p>}
                </div>
            );
        };

        /* ============================================================
           R6 · EMPAREJAMIENTO
           solucion[i] = índice en `derecha` que corresponde a izquierda[i]
        ============================================================ */
        const PALETA_PARES = ['#3D008D', '#ED1E79', '#0E7490', '#B91C1C', '#15803D', '#B45309', '#001A4D', '#7C3AED'];

        const Emparejamiento = ({ titulo = 'Empareje cada elemento con su correspondencia', enunciado, izquierda, derecha, solucion, lang = LANG_DEFECTO, etiquetaIzq = 'Concepto', etiquetaDer = 'Corresponde a' }) => {
            // El lado izquierdo suele ser codigo y por tanto cambia con el
            // lenguaje; el derecho son significados y no cambia.
            const idiomas = lenguajesDe(izquierda);
            const langs = idiomas.length ? idiomas : [lang];
            const [langActivo, cambiarLang] = useLenguajeActivo(langs, lang);
            const izqAct = porLenguaje(izquierda, langActivo);

            const [pares, setPares] = useState({});
            const [selIzq, setSelIzq] = useState(null);
            const [comprobado, setComprobado] = useState(false);
            const ref = useRef(null);
            useTypeset(ref, [comprobado]);
            useEffect(() => { setPares({}); setSelIzq(null); setComprobado(false); }, [langActivo]);

            const derUsada = (j) => Object.values(pares).includes(j);
            const izqDe = (j) => Object.keys(pares).find(i => pares[i] === j);

            const clicIzq = (i) => {
                if (comprobado) return;
                if (pares[i] !== undefined) { setPares(p => { const n = { ...p }; delete n[i]; return n; }); setSelIzq(null); return; }
                setSelIzq(selIzq === i ? null : i);
            };
            const clicDer = (j) => {
                if (comprobado) return;
                if (derUsada(j)) { const i = izqDe(j); setPares(p => { const n = { ...p }; delete n[i]; return n; }); return; }
                if (selIzq === null) return;
                setPares(p => ({ ...p, [selIzq]: j }));
                setSelIzq(null);
            };

            const completo = Object.keys(pares).length === izqAct.length;
            const parOk = (i) => pares[i] === solucion[i];
            const aciertos = izqAct.map((_, i) => parOk(i)).filter(Boolean).length;
            const todoOk = aciertos === izqAct.length;

            return (
                <div ref={ref} className="my-6 rounded-2xl border-2 border-primary/20 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="tr-gradient text-white p-2 rounded-lg"><i className="fas fa-link"></i></span>
                        <h4 className="text-base font-bold text-primary" style={{ margin: 0 }}>{titulo}</h4>
                        <span className="ml-auto text-[0.65rem] uppercase tracking-wider font-bold text-white bg-primary/80 rounded px-2 py-0.5">R6 · Emparejar</span>
                    </div>
                    {enunciado && <div className="text-[0.95rem] text-gray-700 mb-2">{enunciado}</div>}
                    <SelectorLenguaje disponibles={langs} activo={langActivo} onCambiar={cambiarLang} />
                    <p className="text-xs text-gray-500 mb-3">
                        <i className="fas fa-hand-pointer mr-1"></i>
                        Haga clic en un elemento de la izquierda y luego en su pareja de la derecha. Para deshacer, haga clic sobre cualquiera de los dos.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">{etiquetaIzq}</div>
                            <div className="space-y-1.5">
                                {izqAct.map((t, i) => {
                                    const emparejado = pares[i] !== undefined;
                                    const color = emparejado ? PALETA_PARES[pares[i] % PALETA_PARES.length] : null;
                                    let cls = 'border-gray-200 bg-white hover:border-primary/40';
                                    if (comprobado && emparejado) cls = parOk(i) ? 'border-green-500 bg-green-50' : 'border-red-400 bg-red-50';
                                    else if (selIzq === i) cls = 'border-secondary bg-amber-50 ring-2 ring-secondary/30';
                                    return (
                                        <button key={i} onClick={() => clicIzq(i)} disabled={comprobado}
                                            aria-pressed={selIzq === i}
                                            className={`w-full text-left px-3 py-2 rounded-lg border text-[0.88rem] text-gray-700 transition-all flex items-start gap-2 ${cls}`}>
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[0.7rem] font-bold text-white mt-0.5"
                                                style={{ background: color || '#CBD5E1' }}>
                                                {emparejado ? pares[i] + 1 : i + 1}
                                            </span>
                                            <span className="flex-1">{t}</span>
                                            {comprobado && emparejado && <i className={`fas ${parOk(i) ? 'fa-check text-green-600' : 'fa-xmark text-red-500'} text-xs mt-1`}></i>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">{etiquetaDer}</div>
                            <div className="space-y-1.5">
                                {derecha.map((t, j) => {
                                    const usada = derUsada(j);
                                    const color = usada ? PALETA_PARES[j % PALETA_PARES.length] : null;
                                    let cls = 'border-gray-200 bg-white hover:border-primary/40';
                                    if (usada) cls = 'border-gray-300 bg-gray-50';
                                    if (comprobado && usada) {
                                        const i = Number(izqDe(j));
                                        cls = parOk(i) ? 'border-green-500 bg-green-50' : 'border-red-400 bg-red-50';
                                    }
                                    return (
                                        <button key={j} onClick={() => clicDer(j)} disabled={comprobado}
                                            className={`w-full text-left px-3 py-2 rounded-lg border text-[0.88rem] text-gray-700 transition-all flex items-start gap-2 ${cls}`}>
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[0.7rem] font-bold text-white mt-0.5"
                                                style={{ background: color || '#CBD5E1' }}>
                                                {String.fromCharCode(65 + j)}
                                            </span>
                                            <span className="flex-1">{t}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                        {!comprobado
                            ? <button onClick={() => completo && setComprobado(true)} disabled={!completo}
                                className="text-sm font-bold px-4 py-1.5 rounded-full text-white tr-gradient disabled:opacity-40">
                                <i className="fas fa-check-double mr-1"></i>Comprobar ({Object.keys(pares).length}/{izqAct.length})
                            </button>
                            : <>
                                <button onClick={() => { setComprobado(false); setPares({}); setSelIzq(null); }}
                                    className="text-sm font-bold px-4 py-1.5 rounded-full border border-primary text-primary hover:bg-primary/5">
                                    <i className="fas fa-rotate-right mr-1"></i>Reintentar
                                </button>
                                <span className={`text-sm font-bold ${todoOk ? 'text-green-600' : 'text-red-500'}`}>
                                    <i className={`fas ${todoOk ? 'fa-circle-check' : 'fa-circle-xmark'} mr-1`}></i>
                                    {aciertos} de {izqAct.length} correctos
                                </span>
                            </>}
                    </div>
                    {comprobado && !todoOk && (
                        <div className="mt-3 animate-fade-in">
                            <Box type="tip" label="Emparejamiento correcto">
                                <ul className="text-sm" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    {izqAct.map((t, i) => (
                                        <li key={i} className="mb-1">
                                            <strong>{i + 1}</strong> → <strong>{String.fromCharCode(65 + solucion[i])}</strong>
                                            <span className="text-gray-500"> · {derecha[solucion[i]]}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Box>
                        </div>
                    )}
                </div>
            );
        };

        /* ============================================================
           TAXONOMÍA DE ERRORES DEL DOMINIO — la clave de R3
           Se define UNA vez aquí y los capítulos la reutilizan, en vez de
           inventar una lista por ejercicio. Dos motivos: el estudiante
           aprende a clasificar con el mismo vocabulario en los quince
           capítulos, y los distractores dejan de delatar la respuesta —si
           cada ejercicio trae sus propias opciones, la que «suena» al tema
           del capítulo es casi siempre la correcta—.

           Un ejercicio pasa `tipos={TIPOS_ERROR_RIESGO}` y `tipoCorrecto`
           con el índice; usar `IDX_ERROR` en vez del número hace el JSX
           legible y sobrevive a un reordenamiento de la lista.
        ============================================================ */
        const TIPOS_ERROR_RIESGO = [
            'Supuesto no verificado — se aplica una fórmula cuya condición nadie comprobó',
            'Confusión de medida — se calcula una magnitud y se reporta como si fuera otra',
            'Fuga de información — el cálculo usa datos que en el momento de decidir no existían',
            'Convención equivocada — base de conteo, calendario, periodicidad o unidad que no es la del instrumento',
            'Estimador inconsistente — el estadístico no corresponde al parámetro que el modelo necesita',
            'Resultado sin incertidumbre — se reporta un número simulado o estimado sin su error',
            'Interpretación indebida — el número está bien y la conclusión que se saca de él no',
        ];

        const IDX_ERROR = {
            supuesto: 0, medida: 1, fuga: 2, convencion: 3,
            estimador: 4, incertidumbre: 5, interpretacion: 6,
        };

        /* ============================================================
           NIVEL DE USO DE IA (AI Assessment Scale)
           El syllabus se compromete con niveles declarados. El material de
           estudio no es un instrumento calificado, así que el nivel se
           declara por TIPO DE EJERCICIO —donde la distinción tiene
           consecuencias— y el capítulo muestra además el del instrumento
           que prepara.
        ============================================================ */
        const AIAS = {
            1: { nombre: 'No AI', color: '#B91C1C', icon: 'fa-ban', que: 'Se resuelve sin asistencia de IA.' },
            2: { nombre: 'AI Planning', color: '#B45309', icon: 'fa-lightbulb', que: 'La IA ayuda a explorar y planear; el resultado y su defensa son suyos.' },
            3: { nombre: 'AI Collaboration', color: '#0E7490', icon: 'fa-handshake-angle', que: 'La IA participa en el desarrollo y usted la verifica, con bitácora de prompts.' },
            4: { nombre: 'Full AI', color: '#15803D', icon: 'fa-robot', que: 'La IA ejecuta y usted dirige y evalúa el resultado.' },
            5: { nombre: 'AI Exploration', color: '#7C3AED', icon: 'fa-flask', que: 'Uso creativo y exploratorio de la IA como coautora.' },
        };

        const NivelIA = ({ nivel = 1, nota, compacto = false }) => {
            const a = AIAS[nivel] || AIAS[1];
            if (compacto) {
                return (
                    <span className="inline-flex items-center gap-1.5 text-[0.65rem] uppercase tracking-wider font-bold text-white rounded px-2 py-0.5 align-middle"
                        style={{ background: a.color }} title={a.que}>
                        <i className={`fas ${a.icon} text-[0.6rem]`}></i>{`IA ${nivel} · ${a.nombre}`}
                    </span>
                );
            }
            return (
                <div className="my-4 flex items-start gap-3 rounded-xl border p-3 bg-white" style={{ borderColor: a.color + '55' }}>
                    <span className="flex-shrink-0 text-white rounded-lg px-2.5 py-2 text-center" style={{ background: a.color }}>
                        <i className={`fas ${a.icon}`}></i>
                        <span className="block text-[0.6rem] font-bold mt-0.5">{`NIVEL ${nivel}`}</span>
                    </span>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-navy" style={{ margin: 0 }}>
                            {`Uso de IA · ${a.nombre}`}
                            <span className="ml-2 text-[0.65rem] font-semibold text-gray-400 uppercase tracking-wider">AI Assessment Scale</span>
                        </p>
                        <p className="text-[0.85rem] text-gray-600 mt-0.5" style={{ margin: '0.15rem 0 0' }}>{a.que}</p>
                        {nota && <p className="text-xs text-gray-500 italic mt-1" style={{ margin: '0.35rem 0 0' }}>{nota}</p>}
                    </div>
                </div>
            );
        };

        /* ============================================================
           FICHA NORMATIVA
           Basilea III, FRTB y los cuatro sistemas de la Superfinanciera
           aparecen en las tres unidades. Un `Box` genérico no deja ver lo
           que aquí importa: qué exige la norma y QUÉ CÁLCULO DEL CAPÍTULO
           la satisface. Sin esa segunda línea la regulación se lee como
           contexto decorativo, que es justo como se olvida.
        ============================================================ */
        const FichaNorma = ({ norma, emisor, referencia, exige, enElCapitulo, enlace, children }) => (
            <div className="my-5 rounded-2xl border-2 overflow-hidden shadow-sm" style={{ borderColor: '#001A4D22' }}>
                <div className="px-4 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-1" style={{ background: '#001A4D' }}>
                    {/* contraste-ok: el gold va sobre el navy de la cabecera, no sobre el fondo claro */}
                    <i className="fas fa-scale-balanced text-gold"></i>
                    <span className="text-white font-bold text-[0.95rem]">{norma}</span>
                    {emisor && <span className="text-[0.65rem] uppercase tracking-widest text-gray-300 font-semibold">{emisor}</span>}
                    {referencia && <span className="ml-auto text-[0.7rem] text-gray-300 font-mono">{referencia}</span>}
                </div>
                <div className="bg-white px-4 py-3 space-y-2.5">
                    <div>
                        <p className="text-[0.65rem] uppercase tracking-wider font-bold text-gray-400" style={{ margin: 0 }}>Qué exige</p>
                        <p className="text-[0.9rem] text-gray-700" style={{ margin: '0.15rem 0 0' }}>{exige}</p>
                    </div>
                    <div className="rounded-lg px-3 py-2" style={{ background: '#F5F0FB' }}>
                        <p className="text-[0.65rem] uppercase tracking-wider font-bold text-primary" style={{ margin: 0 }}>
                            <i className="fas fa-link mr-1"></i>Qué cálculo de este capítulo la satisface
                        </p>
                        <p className="text-[0.9rem] text-gray-700" style={{ margin: '0.15rem 0 0' }}>{enElCapitulo}</p>
                    </div>
                    {children}
                    {enlace && (
                        <p className="text-xs" style={{ margin: '0.5rem 0 0' }}>
                            <a href={enlace} target="_blank" rel="noopener noreferrer" className="text-teal font-semibold hover:underline">
                                <i className="fas fa-arrow-up-right-from-square mr-1"></i>Texto de la norma
                            </a>
                        </p>
                    )}
                </div>
            </div>
        );

        /* ============================================================
           DERIVACIÓN PASO A PASO
           `Eq` muestra una fórmula terminada. Este curso vive de las
           derivaciones —de la binomial a Black-Scholes hay ocho pasos y
           cada uno tiene un porqué—, y una cadena de fórmulas sin
           justificación se lee como un acto de fe.

           El paso siempre se ve; el porqué se pliega. Así quien ya lo sabe
           recorre la cadena de un vistazo y quien no, la abre.
        ============================================================ */
        const Derivacion = ({ titulo = 'Derivación', pasos, cierre }) => {
            const [abiertos, setAbiertos] = useState(() => new Set());
            const ref = useRef(null);
            useTypeset(ref, [pasos, abiertos]);

            const alternar = (i) => setAbiertos(prev => {
                const s = new Set(prev);
                s.has(i) ? s.delete(i) : s.add(i);
                return s;
            });
            const todos = () => setAbiertos(prev => prev.size === pasos.length ? new Set() : new Set(pasos.map((_, i) => i)));

            return (
                <div ref={ref} className="my-6 rounded-2xl border p-4 bg-white shadow-sm" style={{ borderColor: '#3D008D22' }}>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-white p-2 rounded-lg tr-gradient"><i className="fas fa-square-root-variable"></i></span>
                        <h4 className="text-base font-bold text-navy" style={{ margin: 0 }}>{titulo}</h4>
                        <button onClick={todos}
                            className="ml-auto text-[0.7rem] font-semibold text-primary hover:text-secondary transition-colors">
                            {abiertos.size === pasos.length ? 'Plegar los porqués' : 'Ver todos los porqués'}
                        </button>
                    </div>
                    <ol className="space-y-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {pasos.map((p, i) => {
                            const abierto = abiertos.has(i);
                            return (
                                <li key={i} className="rounded-xl border" style={{ borderColor: abierto ? '#ED1E7955' : '#E5E7EB' }}>
                                    <div className="flex items-start gap-3 px-3 py-2">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[0.7rem] font-bold text-white tr-gradient mt-1">
                                            {i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0 overflow-x-auto">
                                            <div className="text-center py-1">{p.eq}</div>
                                        </div>
                                        <button onClick={() => alternar(i)} aria-expanded={abierto}
                                            className="flex-shrink-0 mt-1 text-[0.7rem] font-semibold px-2 py-1 rounded-lg border border-gray-200 text-gray-500 hover:text-primary hover:border-primary/40 transition-colors">
                                            <i className={`fas fa-chevron-down mr-1 transition-transform duration-200 ${abierto ? 'rotate-180' : ''}`}></i>
                                            porqué
                                        </button>
                                    </div>
                                    {abierto && (
                                        <div className="px-3 pb-3 pl-12 animate-fade-in">
                                            <p className="text-[0.88rem] text-gray-600 border-l-2 pl-3" style={{ borderColor: '#ED1E79', margin: 0 }}>
                                                {p.porque}
                                            </p>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                    {cierre && (
                        <p className="text-[0.88rem] text-gray-700 mt-3 rounded-lg px-3 py-2" style={{ background: '#F5F0FB', margin: '0.75rem 0 0' }}>
                            <i className="fas fa-flag-checkered text-primary mr-2"></i>{cierre}
                        </p>
                    )}
                </div>
            );
        };

        /* ============================================================
           TABLA DE RESULTADOS DE UN MODELO
           La salida de un `arch_model` o las métricas de un scorecard son
           el OBJETO DE ESTUDIO, no decoración. Una celda puede traer su
           lectura: `{ v: '0.089', lee: 'Reacción a la sorpresa de ayer…' }`.
           Las celdas con lectura se subrayan y, al pulsarlas, la muestran
           debajo. Se eligió un panel y no un tooltip porque las lecturas
           son de dos o tres líneas y un tooltip de ese tamaño es
           inutilizable en un teléfono.
        ============================================================ */
        const TablaResultados = ({ titulo, subtitulo, columnas, filas, nota }) => {
            const [activa, setActiva] = useState(null);
            const leeDe = (c) => (c && typeof c === 'object' && !React.isValidElement(c)) ? c : null;
            const valorDe = (c) => { const o = leeDe(c); return o ? o.v : c; };

            const sel = activa && filas[activa[0]] ? leeDe(filas[activa[0]].celdas[activa[1]]) : null;

            return (
                <div className="my-5">
                    {titulo && (
                        <div className="flex items-baseline gap-2 mb-2">
                            <i className="fas fa-table-list text-secondary"></i>
                            <span className="text-sm font-bold text-navy">{titulo}</span>
                            {subtitulo && <span className="text-xs text-gray-500 italic">{subtitulo}</span>}
                        </div>
                    )}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                        <table className="tabla-componente w-full text-sm bg-white" style={{ borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#001A4D' }}>
                                    {columnas.map((c, i) => (
                                        <th key={i} className="text-white text-left px-3 py-2 text-[0.78rem] font-semibold whitespace-nowrap">{c}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filas.map((f, i) => (
                                    <tr key={i} className={i % 2 ? 'bg-gray-50/60' : ''}>
                                        {f.celdas.map((c, j) => {
                                            const o = leeDe(c);
                                            const esta = activa && activa[0] === i && activa[1] === j;
                                            return (
                                                <td key={j} className="px-3 py-1.5 border-t border-gray-100 whitespace-nowrap"
                                                    style={{ fontFamily: j ? "'Fira Code', monospace" : undefined }}>
                                                    {o ? (
                                                        <button onClick={() => setActiva(esta ? null : [i, j])}
                                                            className={`text-left rounded px-1 -mx-1 transition-colors ${esta ? 'tr-gradient text-white' : 'text-primary hover:bg-primary/10'}`}
                                                            style={{ textDecoration: esta ? 'none' : 'underline dotted', textUnderlineOffset: '3px' }}>
                                                            {o.v}
                                                        </button>
                                                    ) : <span className="text-gray-700">{valorDe(c)}</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {sel ? (
                        <div className="mt-2 rounded-xl border-l-4 px-3 py-2 animate-fade-in" style={{ borderColor: '#ED1E79', background: '#FDF2F8' }}>
                            <p className="text-[0.88rem] text-gray-700" style={{ margin: 0 }}>
                                <i className="fas fa-magnifying-glass-chart text-secondary mr-2"></i>{sel.lee}
                            </p>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 italic mt-1.5" style={{ margin: '0.35rem 0 0' }}>
                            <i className="fas fa-hand-pointer mr-1"></i>Las cifras subrayadas explican qué dicen.
                        </p>
                    )}
                    {nota && <p className="text-xs text-gray-500 italic mt-1">{nota}</p>}
                </div>
            );
        };

        /* ============================================================
           R9 · LABORATORIO PARAMETRIZADO
           Deslizadores que recalculan la gráfica en el navegador. Es lo que
           justifica que el material sea HTML y no un PDF: mover α y ver
           moverse la cola enseña en tres segundos lo que un párrafo no.

           RESTRICCIÓN, y hay que respetarla: el cálculo ocurre aquí, en el
           navegador, así que `calcular` solo puede hacer ARITMÉTICA —un
           cuantil empírico, la recursión EWMA, la frontera de dos activos,
           la fórmula de Black-Scholes—. Ajustar un GARCH o resolver un
           programa cuadrático no cabe: eso se precomputa en Python sobre
           una malla de parámetros, se embebe, y el deslizador interpola.
           `modo` declara cuál de los dos es, para que quien lea el código
           del capítulo no tenga que deducirlo.
        ============================================================ */
        const Laboratorio = ({ titulo = 'Laboratorio', enunciado, id, controles, calcular, lectura,
            altura = 'chart-h-360', modo = 'directo', nota, pregunta }) => {
            const inicial = () => Object.fromEntries(controles.map(c => [c.id, c.valor !== undefined ? c.valor : c.min]));
            const [p, setP] = useState(inicial);
            const [movido, setMovido] = useState(false);

            // La dependencia es el ESTADO SERIALIZADO, no `calcular`: el
            // capítulo la escribe como función en línea, así que su
            // identidad cambia en cada render y usarla como dependencia
            // redibujaría la gráfica sin parar.
            const firma = JSON.stringify(p);
            useEffect(() => {
                const el = document.getElementById(id);
                if (!el || !window.Plotly) return;
                const { traces, layout } = calcular(p);
                window.Plotly.react(id, traces, layout, { responsive: true, displayModeBar: false });
            }, [id, firma]);

            useEffect(() => () => {
                if (window.Plotly) { try { window.Plotly.purge(id); } catch (e) { } }
            }, [id]);

            const fijar = (cid, v) => { setMovido(true); setP(prev => ({ ...prev, [cid]: v })); };
            const reiniciar = () => { setMovido(false); setP(inicial()); };

            return (
                <div className="my-6 rounded-2xl border-2 p-5 shadow-sm" style={{ borderColor: '#DDD6FE', background: '#FBFAFF' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-white p-2 rounded-lg" style={{ background: 'linear-gradient(135deg,#7C3AED 0%,#3D008D 100%)' }}>
                            <i className="fas fa-sliders"></i>
                        </span>
                        <h4 className="text-base font-bold text-navy" style={{ margin: 0 }}>{titulo}</h4>
                        <span className="ml-auto text-[0.65rem] uppercase tracking-wider font-bold text-white rounded px-2 py-0.5" style={{ background: '#7C3AED' }}>R9 · Laboratorio</span>
                    </div>
                    {enunciado && <p className="text-[0.9rem] text-gray-700 mb-3" style={{ margin: '0 0 0.75rem' }}>{enunciado}</p>}

                    <div className="grid gap-3 mb-3" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))' }}>
                        {controles.map(c => (
                            <label key={c.id} className="block">
                                <span className="flex items-baseline justify-between text-[0.78rem] font-semibold text-navy mb-1">
                                    <span>{c.etiqueta}</span>
                                    <span className="text-secondary" style={{ fontFamily: "'Fira Code', monospace" }}>
                                        {c.formato ? c.formato(p[c.id]) : p[c.id]}
                                    </span>
                                </span>
                                <input type="range" className="tr-range" min={c.min} max={c.max} step={c.paso}
                                    value={p[c.id]} aria-label={c.etiqueta}
                                    onChange={e => fijar(c.id, parseFloat(e.target.value))} />
                            </label>
                        ))}
                    </div>

                    <ChartFrame id={id} height={altura} />

                    {lectura && (
                        <div className="rounded-xl px-3 py-2 border-l-4" style={{ borderColor: '#7C3AED', background: '#F5F3FF' }}>
                            <p className="text-[0.88rem] text-gray-700" style={{ margin: 0 }}>
                                <i className="fas fa-eye text-purple-600 mr-2"></i>{lectura(p)}
                            </p>
                        </div>
                    )}

                    {pregunta && (
                        <p className="text-[0.88rem] text-gray-700 mt-3 font-medium" style={{ margin: '0.75rem 0 0' }}>
                            <i className="fas fa-circle-question text-secondary mr-2"></i>{pregunta}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                        <button onClick={reiniciar} disabled={!movido}
                            className={`text-[0.72rem] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${movido ? 'text-primary border-primary/40 hover:bg-primary/10' : 'text-gray-300 border-gray-200 cursor-default'}`}>
                            <i className="fas fa-rotate-left mr-1"></i>Valores iniciales
                        </button>
                        <span className="text-[0.68rem] text-gray-400 italic">
                            {modo === 'malla'
                                ? 'Los valores vienen de una malla precomputada en Python; el deslizador interpola.'
                                : 'El cálculo se hace en el navegador con los mismos datos del capítulo.'}
                        </span>
                    </div>
                    {nota && <p className="text-xs text-gray-500 italic mt-2">{nota}</p>}
                </div>
            );
        };
