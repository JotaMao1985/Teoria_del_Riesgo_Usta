        const { useState, useEffect, useRef } = React;

        const typesetMath = (retries = 25) => {
            if (window.MathJax && window.MathJax.typesetPromise) {
                try { window.MathJax.typesetClear && window.MathJax.typesetClear(); } catch (e) { }
                window.MathJax.typesetPromise().catch(() => { });
            } else if (retries > 0) {
                setTimeout(() => typesetMath(retries - 1), 200);
            }
        };

        const useTypeset = (ref, deps) => {
            useEffect(() => {
                const t = setTimeout(() => {
                    if (ref.current && window.MathJax && window.MathJax.typesetPromise) {
                        window.MathJax.typesetPromise([ref.current]).catch(() => { });
                    }
                }, 40);
                return () => clearTimeout(t);
            }, deps);
        };

        /* ============================================================
           ICONOS SVG
        ============================================================ */
        const Icons = {
            BookOpen: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
            ),
            Binary: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <rect x="2" y="2" width="20" height="20" rx="2" />
                    <line x1="6" y1="7" x2="10" y2="7" /><line x1="8" y1="5" x2="8" y2="9" />
                    <line x1="14" y1="7" x2="18" y2="7" />
                    <line x1="6" y1="13" x2="10" y2="13" /><line x1="6" y1="17" x2="10" y2="17" /><line x1="14" y1="17" x2="18" y2="17" />
                    <line x1="14" y1="13" x2="18" y2="13" /><line x1="16" y1="11" x2="16" y2="15" />
                </svg>
            ),
            Cpu: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <path d="M9 2v2" /><path d="M15 2v2" /><path d="M9 20v2" /><path d="M15 20v2" />
                    <path d="M2 9h2" /><path d="M2 15h2" /><path d="M20 9h2" /><path d="M20 15h2" />
                </svg>
            ),
            Calculator: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <rect x="4" y="2" width="16" height="20" rx="2" />
                    <line x1="8" y1="6" x2="16" y2="6" /><line x1="8" y1="10" x2="8" y2="14" />
                    <line x1="12" y1="10" x2="12" y2="14" /><line x1="16" y1="10" x2="16" y2="14" />
                    <line x1="8" y1="18" x2="16" y2="18" />
                </svg>
            ),
            Award: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <circle cx="12" cy="8" r="7"></circle>
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                </svg>
            ),
            ChevronLeft: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
            ),
            ChevronRight: ({ size = 24, className = "" }) => (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            ),
        };

        const renderIcon = (iconName, size = 20) => {
            const Icon = Icons[iconName];
            return Icon ? <Icon size={size} /> : null;
        };
        const Box = ({ type = 'info', label, children }) => {
            const styles = {
                info: { border: '#3D008D', bg: '#F5F0FA', label: '#3D008D', icon: 'fa-circle-info' },
                tip: { border: '#15803D', bg: '#F0FDF4', label: '#15803D', icon: 'fa-lightbulb' },
                warn: { border: '#B45309', bg: '#FFFBEB', label: '#B45309', icon: 'fa-triangle-exclamation' },
                danger: { border: '#B91C1C', bg: '#FEF2F2', label: '#B91C1C', icon: 'fa-circle-exclamation' },
            }[type] || { border: '#3D008D', bg: '#F5F0FA', label: '#3D008D', icon: 'fa-circle-info' };
            return (
                <div className="rounded-xl px-5 py-4 my-4 border-l-4" style={{ borderColor: styles.border, background: styles.bg }}>
                    {label && (
                        <span className="inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-wider font-bold rounded mb-2 px-2 py-0.5 text-white" style={{ background: styles.label }}>
                            <i className={`fas ${styles.icon}`}></i>{label}
                        </span>
                    )}
                    <div className="text-gray-700 leading-relaxed text-[0.95rem]">{children}</div>
                </div>
            );
        };

        const CalloutPro = ({ tema = 'info', titulo, subtitulo, icon, children }) => {
            const temas = {
                info: { grad: 'linear-gradient(135deg,#3D008D 0%,#0E7490 100%)', bg: 'rgba(61,0,141,0.05)', border: 'rgba(61,0,141,0.18)', icon: 'fa-circle-info' },
                warn: { grad: 'linear-gradient(135deg,#B45309 0%,#F59E0B 100%)', bg: 'rgba(180,83,9,0.06)', border: 'rgba(180,83,9,0.22)', icon: 'fa-triangle-exclamation' },
                gold: { grad: 'linear-gradient(135deg,#ED1E79 0%,#FF2D8A 100%)', bg: 'rgba(240,165,0,0.06)', border: 'rgba(240,165,0,0.22)', icon: 'fa-coins' },
            };
            const t = temas[tema] || temas.info;
            return (
                <div className="my-6 rounded-2xl overflow-hidden shadow-md border bg-white not-prose" style={{ borderColor: t.border }}>
                    <div className="px-5 py-3 flex items-center gap-3" style={{ background: t.grad }}>
                        <span className="bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36 }}>
                            <i className={`fas ${icon || t.icon} text-white text-lg`}></i>
                        </span>
                        <div>
                            <div className="text-white font-bold text-base leading-tight">{titulo}</div>
                            {subtitulo && <div className="text-white/80 text-xs">{subtitulo}</div>}
                        </div>
                    </div>
                    <div className="px-5 py-4 text-[0.95rem] text-gray-700 leading-relaxed" style={{ background: t.bg }}>
                        {children}
                    </div>
                </div>
            );
        };

        const Eq = ({ children }) => (
            <div className="eq-block my-4 text-center">{children}</div>
        );

        const SectionHeader = ({ title, icon: Icon }) => (
            <div className="flex items-center gap-3 mb-5 border-b border-gray-200 pb-3">
                <div className="tr-gradient p-2.5 rounded-xl shadow-md text-white">
                    {Icon && <Icon size={24} />}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            </div>
        );

        const Pipeline = ({ steps }) => (
            <div className="flex items-stretch flex-wrap gap-2 my-6 justify-between">
                {steps.map((s, i) => (
                    <React.Fragment key={i}>
                        <div className="flex-1 min-w-[140px] bg-white border border-gray-200 rounded-xl px-3 py-3 text-center text-sm shadow-sm" style={{ borderTop: '4px solid #3D008D' }}>
                            <span className="inline-block w-6 h-6 leading-6 rounded-full text-white font-bold text-xs mb-1" style={{ background: '#3D008D' }}>{s.num}</span>
                            <span className="block font-semibold text-navy mb-1">{s.title}</span>
                            <span className="text-gray-600">{s.desc}</span>
                        </div>
                        {i < steps.length - 1 && <div className="self-center text-secondary font-bold text-xl hidden md:block">→</div>}
                    </React.Fragment>
                ))}
            </div>
        );

        const Tabs = ({ tabs }) => {
            const [active, setActive] = useState(0);
            const contentRef = useRef(null);
            useTypeset(contentRef, [active]);
            return (
                <div className="my-5">
                    <div className="flex flex-wrap gap-1 border-b border-gray-200">
                        {tabs.map((t, i) => (
                            <button key={i} onClick={() => setActive(i)}
                                className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-colors ${active === i ? 'text-primary border-b-2 border-secondary bg-white' : 'text-gray-500 hover:text-primary'}`}>
                                {t.label}
                            </button>
                        ))}
                    </div>
                    <div ref={contentRef} className="p-4 bg-white border border-t-0 border-gray-200 rounded-b-lg animate-fade-in text-[0.95rem] text-gray-700">
                        <div key={active}>{tabs[active].content}</div>
                    </div>
                </div>
            );
        };

        const Accordion = ({ items }) => {
            const [open, setOpen] = useState(null);
            const ref = useRef(null);
            useTypeset(ref, [open]);
            return (
                <div ref={ref} className="space-y-2 my-5">
                    {items.map((it, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                            <button onClick={() => setOpen(open === i ? null : i)}
                                className="w-full flex justify-between items-center px-4 py-3 hover:bg-gray-50 text-left font-semibold text-navy transition-colors">
                                <span>{it.titulo}</span>
                                <i className={`fas fa-chevron-down transition-transform duration-300 text-secondary ${open === i ? 'rotate-180' : ''}`}></i>
                            </button>
                            {open === i && (
                                <div className="px-4 py-3 bg-gray-50 text-gray-700 text-[0.92rem] leading-relaxed animate-fade-in border-t border-gray-100">
                                    {it.contenido}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            );
        };

        const Reto = ({ titulo = 'Reto práctico', children, solucion }) => {
            const [show, setShow] = useState(false);
            const ref = useRef(null);
            useTypeset(ref, [show]);
            return (
                <div ref={ref} className="my-5 rounded-xl border-2 border-dashed p-5" style={{ borderColor: '#ED1E79', background: '#FFFDF5' }}>
                    <div className="flex items-center gap-2 font-bold text-navy mb-2">
                        <i className="fas fa-dumbbell text-gold"></i>{titulo}
                    </div>
                    <div className="text-gray-700 text-[0.95rem] mb-3">{children}</div>
                    <button onClick={() => setShow(s => !s)}
                        className="text-xs font-bold px-3 py-1.5 rounded-full text-white tr-gradient hover:opacity-90 transition-opacity">
                        <i className={`fas ${show ? 'fa-eye-slash' : 'fa-key'} mr-1`}></i>
                        {show ? 'Ocultar solución' : 'Mostrar solución'}
                    </button>
                    {show && <div className="mt-3 animate-fade-in">{solucion}</div>}
                </div>
            );
        };

        const MCQ = ({ pregunta, opciones, multiple = false }) => {
            const [sel, setSel] = useState([]);
            const [checked, setChecked] = useState(false);

            const toggle = (i) => {
                if (checked) return;
                if (multiple) setSel(s => s.includes(i) ? s.filter(x => x !== i) : [...s, i]);
                else setSel([i]);
            };

            const correctSet = opciones.map((o, i) => o.correcta ? i : -1).filter(i => i >= 0);
            const acierto = sel.length === correctSet.length && sel.every(i => opciones[i].correcta);
            const ref = useRef(null);
            useTypeset(ref, [checked]);

            return (
                <div ref={ref} className="my-5 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-2 font-semibold text-navy mb-1">
                        <i className="fas fa-circle-question text-secondary mt-1"></i>
                        <span>{pregunta}</span>
                    </div>
                    {multiple && <p className="text-xs text-gray-400 mb-2 ml-6">Selección múltiple</p>}
                    <div className="space-y-2 mt-3">
                        {opciones.map((o, i) => {
                            const isSel = sel.includes(i);
                            let cls = 'border-gray-200 hover:border-primary/50';
                            if (checked) {
                                if (o.correcta) cls = 'border-green-500 bg-green-50';
                                else if (isSel) cls = 'border-red-400 bg-red-50';
                                else cls = 'border-gray-200 opacity-70';
                            } else if (isSel) cls = 'border-secondary bg-amber-50';
                            return (
                                <button key={i} onClick={() => toggle(i)} disabled={checked}
                                    className={`w-full text-left px-4 py-2.5 rounded-lg border text-[0.92rem] flex items-center gap-3 transition-all ${cls}`}>
                                    <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isSel ? 'tr-gradient text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {String.fromCharCode(97 + i)}
                                    </span>
                                    <span className="flex-1 text-gray-700">{o.texto}</span>
                                    {checked && o.correcta && <i className="fas fa-check text-green-600"></i>}
                                    {checked && isSel && !o.correcta && <i className="fas fa-xmark text-red-500"></i>}
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                        {!checked
                            ? <button onClick={() => sel.length && setChecked(true)} disabled={!sel.length}
                                className="text-sm font-bold px-4 py-1.5 rounded-full text-white tr-gradient disabled:opacity-40">Comprobar</button>
                            : <button onClick={() => { setChecked(false); setSel([]); }}
                                className="text-sm font-bold px-4 py-1.5 rounded-full border border-primary text-primary hover:bg-primary/5">Reintentar</button>}
                        {checked && (
                            <span className={`text-sm font-bold ${acierto ? 'text-green-600' : 'text-red-500'}`}>
                                <i className={`fas ${acierto ? 'fa-circle-check' : 'fa-circle-xmark'} mr-1`}></i>
                                {acierto ? '¡Correcto!' : 'Revisa la explicación'}
                            </span>
                        )}
                    </div>
                    {checked && (
                        <div className="mt-3 text-[0.9rem] text-gray-700 bg-bg rounded-lg p-3 border-l-4 animate-fade-in" style={{ borderColor: '#ED1E79' }}>
                            <strong>Explicación: </strong>
                            {opciones.find(o => o.correcta)?.justificacion ||
                                opciones.filter(o => o.correcta).map(o => o.justificacion).filter(Boolean).join(' ')}
                        </div>
                    )}
                </div>
            );
        };

        const Quiz = ({ titulo = 'Mini-cuestionario', preguntas }) => {
            const [resp, setResp] = useState({});
            const [enviado, setEnviado] = useState(false);

            const toggle = (qi, oi, multiple) => {
                if (enviado) return;
                setResp(prev => {
                    const actual = prev[qi] || [];
                    if (multiple) {
                        return { ...prev, [qi]: actual.includes(oi) ? actual.filter(x => x !== oi) : [...actual, oi] };
                    }
                    return { ...prev, [qi]: [oi] };
                });
            };

            const esCorrecta = (qi) => {
                const correctSet = preguntas[qi].opciones.map((o, i) => o.correcta ? i : -1).filter(i => i >= 0);
                const sel = resp[qi] || [];
                return sel.length === correctSet.length && sel.every(i => preguntas[qi].opciones[i].correcta);
            };

            const score = preguntas.reduce((acc, _, qi) => acc + (esCorrecta(qi) ? 1 : 0), 0);
            const total = preguntas.length;
            const pct = Math.round((score / total) * 100);
            const todasResp = preguntas.every((_, qi) => (resp[qi] || []).length > 0);

            const color = pct >= 80 ? '#15803D' : pct >= 50 ? '#B45309' : '#B91C1C';
            const mensaje = pct >= 80 ? '¡Excelente dominio del tema!' : pct >= 50 ? 'Bien, repasa los puntos fallados.' : 'Conviene releer la lección antes de continuar.';
            const ref = useRef(null);
            useTypeset(ref, [enviado]);

            return (
                <div ref={ref} className="my-8 rounded-2xl border border-primary/20 bg-white p-6 shadow-md">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="tr-gradient text-white p-2 rounded-lg"><i className="fas fa-clipboard-question"></i></span>
                        <h3 className="text-lg font-bold text-primary" style={{ margin: 0 }}>{titulo}</h3>
                    </div>

                    {preguntas.map((q, qi) => (
                        <div key={qi} className="mb-5">
                            <div className="font-semibold text-navy text-[0.95rem] mb-2">
                                {qi + 1}. {q.pregunta}
                                {q.multiple && <span className="ml-2 text-xs text-gray-400 font-normal">(selección múltiple)</span>}
                            </div>
                            <div className="space-y-1.5">
                                {q.opciones.map((o, oi) => {
                                    const sel = (resp[qi] || []).includes(oi);
                                    let cls = 'border-gray-200 hover:border-primary/40';
                                    if (enviado) {
                                        if (o.correcta) cls = 'border-green-500 bg-green-50';
                                        else if (sel) cls = 'border-red-400 bg-red-50';
                                        else cls = 'border-gray-200 opacity-70';
                                    } else if (sel) cls = 'border-secondary bg-amber-50';
                                    return (
                                        <button key={oi} onClick={() => toggle(qi, oi, q.multiple)} disabled={enviado}
                                            className={`w-full text-left px-3 py-2 rounded-lg border text-[0.9rem] flex items-center gap-2.5 transition-all ${cls}`}>
                                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[0.7rem] font-bold ${sel ? 'tr-gradient text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                {String.fromCharCode(97 + oi)}
                                            </span>
                                            <span className="flex-1 text-gray-700">{o.texto}</span>
                                            {enviado && o.correcta && <i className="fas fa-check text-green-600 text-xs"></i>}
                                            {enviado && sel && !o.correcta && <i className="fas fa-xmark text-red-500 text-xs"></i>}
                                        </button>
                                    );
                                })}
                            </div>
                            {enviado && q.justificacion && (
                                <p className="text-xs text-gray-600 mt-1.5 ml-1 italic">{q.justificacion}</p>
                            )}
                        </div>
                    ))}

                    {!enviado
                        ? <button onClick={() => todasResp && setEnviado(true)} disabled={!todasResp}
                            className="text-sm font-bold px-5 py-2 rounded-full text-white tr-gradient disabled:opacity-40">
                            <i className="fas fa-flag-checkered mr-2"></i>Calificar ({Object.keys(resp).length}/{total})
                        </button>
                        : (
                            <div className="animate-fade-in">
                                <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#FAFAFA' }}>
                                    <div className="relative w-20 h-20 flex-shrink-0">
                                        <svg viewBox="0 0 36 36" className="w-20 h-20">
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="3" />
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${pct}, 100`} strokeLinecap="round" />
                                        </svg>
                                        <span className="absolute inset-0 flex items-center justify-center font-extrabold text-sm" style={{ color }}>{pct}%</span>
                                    </div>
                                    <div>
                                        <div className="font-bold text-navy">Puntaje: {score} / {total}</div>
                                        <div className="text-sm" style={{ color }}>{mensaje}</div>
                                    </div>
                                </div>
                                <button onClick={() => { setEnviado(false); setResp({}); }}
                                    className="mt-3 text-sm font-bold px-4 py-1.5 rounded-full border border-primary text-primary hover:bg-primary/5">
                                    <i className="fas fa-rotate-right mr-1"></i>Reintentar
                                </button>
                            </div>
                        )}
                </div>
            );
        };

        const usePlotly = (id, dataFn, layoutFn, deps = []) => {
            useEffect(() => {
                const el = document.getElementById(id);
                if (el && window.Plotly) {
                    window.Plotly.newPlot(id, dataFn(), layoutFn(), { responsive: true, displayModeBar: false });
                }
                return () => { if (window.Plotly) { try { window.Plotly.purge(id); } catch (e) { } } };
            }, deps);
        };

        const ChartFrame = ({ id, height = 'chart-h-360', caption }) => (
            <>
                <div className="bg-white border border-gray-200 rounded-xl p-2 shadow-sm my-3">
                    <div id={id} className={height} style={{ width: '100%' }}></div>
                </div>
                {caption && <p className="text-xs text-gray-500 italic text-center mb-4">{caption}</p>}
            </>
        );

        const Termino = ({ children, def }) => {
            const [open, setOpen] = useState(false);
            const [pos, setPos] = useState(null);
            const btnRef = useRef(null);
            const popRef = useRef(null);
            const closeTimer = useRef(null);

            const cancelClose = () => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; } };
            const scheduleClose = () => { cancelClose(); closeTimer.current = setTimeout(() => setOpen(false), 150); };
            const openNow = () => { cancelClose(); setOpen(true); };
            useEffect(() => cancelClose, []);

            const place = () => {
                if (!btnRef.current) return;
                const r = btnRef.current.getBoundingClientRect();
                const margin = 12;
                const w = Math.min(300, window.innerWidth - margin * 2);
                let left = r.left;
                if (left + w > window.innerWidth - margin) left = window.innerWidth - margin - w;
                if (left < margin) left = margin;
                const abreArriba = (window.innerHeight - r.bottom) < 180;
                setPos({
                    left, width: w,
                    top: abreArriba ? null : Math.round(r.bottom + 6),
                    bottom: abreArriba ? Math.round(window.innerHeight - r.top + 6) : null,
                });
            };

            useEffect(() => {
                if (!open) { setPos(null); return; }
                place();
                const reflow = () => place();
                const onDoc = (e) => {
                    if (popRef.current && popRef.current.contains(e.target)) return;
                    if (btnRef.current && btnRef.current.contains(e.target)) return;
                    setOpen(false);
                };
                window.addEventListener('scroll', reflow, true);
                window.addEventListener('resize', reflow);
                document.addEventListener('mousedown', onDoc);
                return () => {
                    window.removeEventListener('scroll', reflow, true);
                    window.removeEventListener('resize', reflow);
                    document.removeEventListener('mousedown', onDoc);
                };
            }, [open]);

            return (
                <span className="inline-block">
                    <button ref={btnRef} type="button" onClick={openNow} onMouseEnter={openNow} onMouseLeave={scheduleClose}
                        className="text-primary font-semibold cursor-help bg-primary/5 hover:bg-primary/10 rounded px-1 transition-colors"
                        style={{ borderBottom: '1px dotted #3D008D' }} title="Ver definición rápida">
                        {children}<i className="fas fa-circle-info text-[0.6em] align-super ml-0.5 text-secondary"></i>
                    </button>
                    {open && pos && ReactDOM.createPortal(
                        <span ref={popRef} role="tooltip"
                            onMouseEnter={cancelClose} onMouseLeave={scheduleClose}
                            className="block rounded-lg bg-white shadow-2xl border border-primary/30 p-3 text-[0.8rem] font-normal text-gray-700 leading-snug animate-fade-in text-left"
                            style={{ position: 'fixed', left: pos.left, top: pos.top == null ? 'auto' : pos.top, bottom: pos.bottom == null ? 'auto' : pos.bottom, width: pos.width, zIndex: 200 }}>
                            <span className="block font-bold text-primary mb-1 text-[0.72rem] uppercase tracking-wide">{children}</span>
                            {def}
                        </span>,
                        document.body
                    )}
                </span>
            );
        };
