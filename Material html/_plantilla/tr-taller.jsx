/* ============================================================================
   TALLER-CORE · componentes del instrumento calificado de la unidad 1
   T-3 del plan `talleres/clave/PLAN_TDR-U1T.md`

   Va en el HTML del taller, en el MISMO `<script type="text/babel">` que
   TR-CORE pero FUERA de la región estampada, entre las marcas

       /* === TALLER-CORE INICIO === *​/   …   /* === TALLER-CORE FIN === *​/

   ⚠️ **TR-CORE no se toca.** Los seis capítulos publicados comparten ese bloque
   byte a byte y no se vuelven a estampar para construir un instrumento: la
   regla 1 de `verificar_taller.py` comprueba que el sha del bloque del taller
   sea el mismo que el de los capítulos. Todo lo que el taller necesita y la
   librería no tiene vive aquí.

   Cinco piezas, y por qué cada una:

     · `usePersistencia`   TR-CORE guarda una preferencia de interfaz en
                           `localStorage` y nada más. Aquí se guarda el trabajo
                           de un estudiante, que es otra cosa.
     · `Identificacion`    Del documento salen los dos ejes. Sin documento no
                           hay taller: el contenido no se pinta.
     · `RespuestaAbierta`  `Reto` no acepta texto, y con `solucion` la revela —
                           que es justo lo que no puede pasar en un calificado.
     · `Barrido`           `Laboratorio` no guarda nada de lo que ocurrió
                           mientras se movían sus deslizadores.
     · `Entrega`           No existe ningún entregable en todo el material.

   ⚠️ REGLA QUE ORDENA TODO ESTE ARCHIVO: **perder el trabajo del estudiante es
   el peor defecto posible.** `Entrega` funciona aunque `localStorage` esté
   bloqueado; el autoguardado es un servicio adicional, nunca la única copia. Y
   toda lectura de `localStorage` va dentro de un `try`: en una `data:` URL
   lanza `SecurityError`, y una excepción durante el render deja la página en
   blanco — que es la zona ciega 1 del material, con un taller dentro.
============================================================================ */

/* `useState`, `useEffect` y `useRef` ya vienen de TR-CORE. Estos no. */
const { useMemo, useCallback } = React;

/* ============================================================
   BLINDAJE DEL ALMACENAMIENTO — lo primero que corre
   `CodeTabs` y `useLenguajeActivo` de TR-CORE llaman a
   `localStorage.getItem` **durante el render y sin guarda**. Donde
   `localStorage` lanza —una `data:` URL, algunos modos privados, ciertas
   políticas de empresa—, esa excepción sube por el render, React desmonta el
   árbol entero y la página queda EN BLANCO. Ahí está localizado, con nombre y
   línea, el fallo que el material tenía documentado como «el panel sirve los
   capítulos como data: URL y TR-CORE no arranca».

   En un capítulo eso es un fastidio. En un instrumento calificado es el taller
   entero, así que aquí no se puede permitir. Como `OrdenaPasos` y
   `Emparejamiento` pasan por ese camino y el bloque 2 los usa, se sustituye
   `localStorage` por un almacén en memoria antes de que React monte nada.

   El taller sigue avisando de que no está guardando: lo que se sustituye es la
   excepción, no la promesa. `almacenTaller` mira la bandera.
============================================================ */
const blindarAlmacenamiento = () => {
    try {
        const p = '__tdr_prueba__';
        window.localStorage.setItem(p, '1');
        window.localStorage.removeItem(p);
        return false;                       // funciona de verdad
    } catch (e) {
        const memoria = new Map();
        const falso = {
            getItem: (k) => (memoria.has(String(k)) ? memoria.get(String(k)) : null),
            setItem: (k, v) => { memoria.set(String(k), String(v)); },
            removeItem: (k) => { memoria.delete(String(k)); },
            clear: () => memoria.clear(),
            key: (i) => [...memoria.keys()][i] ?? null,
            get length() { return memoria.size; },
        };
        try {
            Object.defineProperty(window, 'localStorage', { configurable: true, get: () => falso });
        } catch (e2) { /* si ni eso se puede, cada acceso sigue en su try */ }
        return true;                        // volátil: no sobrevive a recargar
    }
};
const ALMACEN_VOLATIL = blindarAlmacenamiento();

/* ============================================================
   NÚCLEO DE SEMILLA — copia literal de `talleres/clave/semilla.mjs`
   No se edita aquí: se edita allí y se copia. Su gemelo en Python genera la
   clave de calificación, y si los dos se separan cada estudiante resuelve un
   taller y se le califica otro. La regla 2 del verificador compara las dos
   regiones carácter a carácter.
============================================================ */
/* === NÚCLEO INICIO — copiar literal en TALLER-CORE === */
/* La sal del curso: pública, y elegida por barrido para que los once
   matriculados caigan en once combinaciones distintas. El porqué largo está en
   `semilla.py`. Si cambia la lista, se vuelve a barrer. */
const SAL_CURSO = 135;

const EJE_VENTANA = [125, 200, 500];

const EJE_EMISOR = [
    ['ECOPETROL.CL', 'Ecopetrol'],
    ['BOGOTA.CL', 'Banco de Bogotá'],
    ['GRUPOSURA.CL', 'Grupo Sura'],
    ['ISA.CL', 'ISA'],
];

/* Forma canónica del documento: solo dígitos ASCII y sin ceros a la izquierda.
   `1.020.304.050`, `1020304050` y `01020304050` son la misma persona y tienen
   que caer en la misma combinación. */
const normalizarDocumento = (documento) => {
    const digitos = String(documento === null || documento === undefined ? '' : documento)
        .replace(/[^0-9]/g, '')
        .replace(/^0+/, '');
    return digitos;
};

/* FNV-1a de 32 bits: el mismo `hashTexto` que TR-CORE usa para barajar. */
const hashDocumento = (s) => {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
};

/* Los dos ejes. Devuelve `null` si el documento no deja ningún dígito
   significativo: la pantalla de identificación lo trata como campo sin llenar,
   nunca como una combinación por omisión — un taller por omisión sería el
   mismo para todos los que se equivoquen al teclear. */
const ejesDeDocumento = (documento, sal = SAL_CURSO) => {
    const canonico = normalizarDocumento(documento);
    if (!canonico) return null;

    const semilla = hashDocumento(`${canonico}#${sal}`);
    let s = semilla || 1;
    const siguiente = () => {
        s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
        return s / 4294967296;
    };

    const iv = Math.floor(siguiente() * EJE_VENTANA.length);
    const ie = Math.floor(siguiente() * EJE_EMISOR.length);
    const [columna, rotulo] = EJE_EMISOR[ie];

    return {
        documento: String(documento),
        canonico,
        sal,
        semilla,
        ventana: EJE_VENTANA[iv],
        emisor: columna,
        emisorRotulo: rotulo,
        combinacion: `V${EJE_VENTANA[iv]}-${columna.split('.')[0].slice(0, 3)}`,
    };
};
/* === NÚCLEO FIN === */

/* ============================================================
   EL ALMACÉN
   Un solo objeto observable fuera de React. Se hizo así y no con estado de
   React arriba del todo por una razón medible: el capítulo monta UNA sección a
   la vez —`ActiveComponent` en el `App`—, así que el estado local de un
   `RespuestaAbierta` se destruye al navegar. La fuente de verdad tiene que
   vivir fuera del árbol, y el componente se rehidrata de aquí al montarse.

   Y por otra razón de coste: con el estado arriba, cada tecla en un área de
   texto vuelve a renderizar el capítulo entero. Aquí el texto es local mientras
   se escribe y baja al almacén con retardo.
============================================================ */
const almacenTaller = (() => {
    const PREFIJO = 'tdr_u1t_';
    const CLAVE_ULTIMO = PREFIJO + 'ultimo';
    const VERSION = 1;

    let clave = null;
    let datos = null;
    /* Si el blindaje tuvo que entrar, `localStorage` ya no lanza pero tampoco
       guarda nada que sobreviva a recargar la página. Se declara desde el
       principio: el aviso no puede depender de que falle una escritura que
       ahora siempre funciona. */
    let persistencia = ALMACEN_VOLATIL
        ? { disponible: false, motivo: 'este navegador no permite guardar en local', ultimoGuardado: null }
        : { disponible: true, motivo: '', ultimoGuardado: null };
    const oyentes = new Set();
    const vaciados = new Set();

    /* Todo acceso a `localStorage` pasa por aquí. En `data:` lanza
       `SecurityError`; en navegación privada de algunos navegadores, en cuanto
       se llena la cuota, lanza `QuotaExceededError`. Ninguna de las dos puede
       tumbar el taller. */
    const seguro = (fn, motivo) => {
        try {
            return fn();
        } catch (e) {
            persistencia = {
                disponible: false,
                motivo: motivo + ' (' + (e && e.name ? e.name : 'error') + ')',
                ultimoGuardado: persistencia.ultimoGuardado,
            };
            return null;
        }
    };

    const vacio = (ejes) => ({
        version: VERSION,
        instrumento: 'TDR-U1T',
        nombre: '',
        ejes: ejes || null,
        respuestas: {},   // id → texto
        tiempos: {},      // id → { primero, ultimo, guardados }
        intentos: {},     // id → { n, acierto }
        barridos: {},     // id → { campos:{}, visitados:{} }
        iniciado: new Date().toISOString(),
        actualizado: null,
    });

    const avisar = () => { oyentes.forEach(fn => { try { fn(datos); } catch (e) { } }); };

    const guardar = () => {
        if (!clave || !datos) return;
        datos.actualizado = new Date().toISOString();
        const ok = seguro(() => {
            localStorage.setItem(clave, JSON.stringify(datos));
            localStorage.setItem(CLAVE_ULTIMO, datos.ejes ? datos.ejes.canonico : '');
            return true;
        }, 'no se pudo guardar en este navegador');
        if (ok && !ALMACEN_VOLATIL) {
            persistencia = { disponible: true, motivo: '', ultimoGuardado: datos.actualizado };
        }
        avisar();
    };

    return {
        /* Arranca —o retoma— la sesión de un documento. Cada documento tiene su
           propia entrada: cambiar de documento no borra la del otro. */
        iniciar(ejes) {
            clave = PREFIJO + ejes.canonico;
            const crudo = seguro(() => localStorage.getItem(clave), 'no se pudo leer lo guardado');
            let previo = null;
            if (crudo) {
                try { previo = JSON.parse(crudo); } catch (e) { previo = null; }
            }
            datos = previo && previo.version === VERSION ? previo : vacio(ejes);
            /* Una sesión guardada antes de que existieran los tiempos no los
               trae. Se rellena en vez de subir la VERSION: subirla descartaría
               el trabajo ya escrito, y eso no se hace nunca. */
            if (!datos.tiempos) datos.tiempos = {};
            datos.ejes = ejes;   // la derivación manda siempre sobre lo guardado
            guardar();
            return datos;
        },
        hayEjes() { return !!(datos && datos.ejes); },
        leer() { return datos; },
        estadoPersistencia() { return persistencia; },
        ultimoDocumento() {
            return seguro(() => localStorage.getItem(CLAVE_ULTIMO), 'no se pudo leer lo guardado') || '';
        },
        setNombre(v) { if (datos) { datos.nombre = v; guardar(); } },
        setRespuesta(id, texto) {
            if (!datos) return;
            const habiaAlgo = !!String(datos.respuestas[id] || '').trim();
            datos.respuestas[id] = texto;
            /* Cuándo se escribió cada respuesta POR PRIMERA VEZ.

               Esto existe por el pase B de la calibración adversaria: un modelo
               con todo el material del curso delante resolvió el taller entero,
               y lo único que declaró no poder simular fue **escribir la
               declaración previa antes de haber visto las cifras**. Ese es el
               mecanismo, y el taller ya se lo prometía al estudiante —«el
               archivo de entrega registra cuándo se escribió cada cosa»—
               cuando en realidad solo guardaba tres marcas globales.

               Con esto, `calificar.py` puede comprobar que P0.1 y P0.2 son
               anteriores a las respuestas del bloque 1. Una declaración previa
               escrita después no es una declaración previa. */
            if (String(texto).trim()) {
                const ahora = new Date().toISOString();
                const t = datos.tiempos[id] || { primero: ahora, ultimo: ahora, guardados: 0 };
                if (!habiaAlgo) t.primero = ahora;
                t.ultimo = ahora;
                t.guardados += 1;
                datos.tiempos[id] = t;
            }
            guardar();
        },
        getRespuesta(id) { return (datos && datos.respuestas[id]) || ''; },
        sumarIntento(id, acierto) {
            if (!datos) return;
            const prev = datos.intentos[id] || { n: 0, acierto: false };
            datos.intentos[id] = { n: prev.n + 1, acierto: prev.acierto || !!acierto };
            guardar();
        },
        setBarridoCampo(id, campo, valor) {
            if (!datos) return;
            const prev = datos.barridos[id] || { campos: {}, visitados: {} };
            prev.campos[campo] = valor;
            datos.barridos[id] = prev;
            guardar();
        },
        registrarVisita(id, control, valor) {
            if (!datos) return;
            const prev = datos.barridos[id] || { campos: {}, visitados: {} };
            const v = prev.visitados[control] || { n: 0, min: valor, max: valor, distintos: [] };
            v.n += 1;
            v.min = Math.min(v.min, valor);
            v.max = Math.max(v.max, valor);
            /* Se guardan hasta 40 valores distintos: alcanza de sobra para ver
               si alguien barrió el rango o movió el deslizador una vez, y no
               convierte la entrega en un registro de cada píxel. */
            if (v.distintos.length < 40 && v.distintos.indexOf(valor) === -1) v.distintos.push(valor);
            prev.visitados[control] = v;
            datos.barridos[id] = prev;
            /* Sin `guardar()`: un deslizador dispara decenas de eventos por
               segundo y escribir en `localStorage` en cada uno traba la página.
               Lo baja `Barrido` al soltar. */
            return v;
        },
        forzarGuardado() { guardar(); },
        /* Cada `RespuestaAbierta` montada deja aquí una función que baja al
           almacén lo que tenga escrito sin esperar al autoguardado. `Entrega`
           las llama todas antes de armar el JSON.

           Sin esto, quien escribe y pulsa «Generar» en el mismo gesto entrega
           un archivo SIN esa respuesta. En una interacción real lo salva el
           `blur` del área de texto —que ocurre antes del clic—, pero eso es
           depender de un detalle del navegador para no perder trabajo, y este
           archivo tiene una sola regla que manda sobre las demás. */
        registrarVaciado(fn) { vaciados.add(fn); return () => vaciados.delete(fn); },
        vaciarPendientes() { vaciados.forEach(fn => { try { fn(); } catch (e) { } }); },
        suscribir(fn) { oyentes.add(fn); return () => oyentes.delete(fn); },
    };
})();

/* Suscripción del árbol al almacén. Devuelve los datos y una versión que
   cambia en cada aviso, para que el componente que la use vuelva a renderizar. */
const usePersistencia = () => {
    const [, forzar] = useState(0);
    useEffect(() => almacenTaller.suscribir(() => forzar(n => n + 1)), []);
    return {
        datos: almacenTaller.leer(),
        persistencia: almacenTaller.estadoPersistencia(),
        almacen: almacenTaller,
    };
};

/* Sello de integridad: FNV-1a del JSON canónico más su longitud.

   ⚠️ Detecta una entrega corrupta, truncada o pegada de otro archivo. **No es
   una firma y no puede serlo**: el código que lo calcula está en esta misma
   página y el estudiante puede leerlo. La defensa contra la manipulación es la
   sustentación oral, no esto. Va dicho también en la pantalla de entrega. */
const canonizarJSON = (v) => {
    if (v === null || typeof v !== 'object') return JSON.stringify(v);
    if (Array.isArray(v)) return '[' + v.map(canonizarJSON).join(',') + ']';
    return '{' + Object.keys(v).sort()
        .map(k => JSON.stringify(k) + ':' + canonizarJSON(v[k])).join(',') + '}';
};

const sellarEntrega = (obj) => {
    /* ⚠️ Aquí estuvo el segundo defecto que encontró el recorrido de T-3:
       `JSON.stringify(obj, Object.keys(obj).sort())` NO ordena las claves —el
       segundo argumento es una lista blanca de NOMBRES, y se aplica en todos
       los niveles—. El sello se calculaba sobre 290 caracteres de los 711 de la
       entrega y **no cubría ni una sola respuesta**: dos entregas con las
       mismas cifras de cabecera y textos distintos sellaban igual, que es
       justamente lo que el sello existe para detectar. Se canoniza a mano. */
    const canonico = canonizarJSON(obj);
    const h = hashDocumento(canonico).toString(16).padStart(8, '0').toUpperCase();
    return `${h}-${String(canonico.length).padStart(5, '0')}`;
};

/* ============================================================
   IDENTIFICACIÓN
   La puerta. Sin documento no se pinta el taller: `hijos` es una función que
   solo se invoca cuando hay ejes.
============================================================ */
const Identificacion = ({ children }) => {
    const { datos, persistencia, almacen } = usePersistencia();
    const [nombre, setNombre] = useState('');
    const [doc, setDoc] = useState(() => almacenTaller.ultimoDocumento());
    const [error, setError] = useState('');
    const [confirmar, setConfirmar] = useState(false);

    const ejes = datos && datos.ejes;
    const previsto = useMemo(() => ejesDeDocumento(doc), [doc]);

    const comenzar = () => {
        const e = ejesDeDocumento(doc);
        if (!e) { setError('Escriba su número de documento: al menos un dígito distinto de cero.'); return; }
        if (!nombre.trim() && !(datos && datos.nombre)) { setError('Escriba su nombre completo.'); return; }
        setError('');
        almacen.iniciar(e);
        if (nombre.trim()) almacen.setNombre(nombre.trim());
    };

    if (ejes && !confirmar) {
        return (
            <div>
                <div className="my-4 rounded-2xl border-2 p-4 flex flex-wrap items-center gap-x-6 gap-y-2"
                    style={{ borderColor: '#3D008D', background: '#F7F5FF' }}>
                    <div>
                        <p className="text-[0.65rem] uppercase tracking-wider font-bold text-gray-500" style={{ margin: 0 }}>Su taller</p>
                        <p className="font-bold text-navy" style={{ margin: 0 }}>
                            {datos.nombre || '(sin nombre)'} · doc. {ejes.canonico}
                        </p>
                    </div>
                    <div>
                        <p className="text-[0.65rem] uppercase tracking-wider font-bold text-gray-500" style={{ margin: 0 }}>Ventana de estimación</p>
                        <p className="font-bold text-secondary" style={{ margin: 0, fontFamily: "'Fira Code', monospace" }}>{ejes.ventana} ruedas</p>
                    </div>
                    <div>
                        <p className="text-[0.65rem] uppercase tracking-wider font-bold text-gray-500" style={{ margin: 0 }}>Emisor bajo examen</p>
                        <p className="font-bold text-secondary" style={{ margin: 0 }}>{ejes.emisorRotulo}</p>
                    </div>
                    <div>
                        <p className="text-[0.65rem] uppercase tracking-wider font-bold text-gray-500" style={{ margin: 0 }}>Combinación</p>
                        <p className="font-bold text-navy" style={{ margin: 0, fontFamily: "'Fira Code', monospace" }}>{ejes.combinacion}</p>
                    </div>
                    <button onClick={() => setConfirmar(true)}
                        className="ml-auto text-xs font-semibold px-3 py-1.5 rounded-full border border-gray-300 text-gray-500 hover:border-primary hover:text-primary">
                        Cambiar documento
                    </button>
                </div>
                <AvisoPersistencia persistencia={persistencia} />
                {children}
            </div>
        );
    }

    return (
        <div className="my-6 rounded-2xl border-2 p-6" style={{ borderColor: '#3D008D', background: '#FBFAFF' }}>
            <div className="flex items-center gap-2 mb-3">
                <span className="text-white p-2 rounded-lg tr-gradient"><i className="fas fa-id-card"></i></span>
                <h3 className="text-lg font-bold text-navy" style={{ margin: 0 }}>Antes de empezar: identifíquese</h3>
            </div>

            <p className="text-[0.92rem] text-gray-700">
                De su número de documento salen <strong>la ventana de estimación</strong> y{' '}
                <strong>el emisor</strong> con los que va a trabajar todo el taller. No es un
                sorteo: es una función del documento, siempre la misma, y por eso puede cerrar
                esta página y volver sin perder nada.
            </p>

            {confirmar && (
                <div className="rounded-xl px-4 py-3 border-l-4 mb-3" style={{ borderColor: '#B45309', background: '#FFFBEB' }}>
                    <p className="text-[0.88rem] text-gray-800" style={{ margin: 0 }}>
                        <i className="fas fa-triangle-exclamation text-amber-600 mr-2"></i>
                        Cambiar el documento le cambia el taller: otras gráficas y otras cifras.
                        Lo que ya escribió <strong>no se borra</strong> —queda guardado bajo el
                        documento anterior—, pero las respuestas dejarán de corresponder a lo que
                        ve. Solo tiene sentido si se equivocó al teclearlo.
                    </p>
                </div>
            )}

            <div className="grid gap-3 my-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
                <label className="block">
                    <span className="block text-[0.78rem] font-semibold text-navy mb-1">Nombre completo</span>
                    <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                        placeholder="Como aparece en la lista del curso"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-[0.92rem]" />
                </label>
                <label className="block">
                    <span className="block text-[0.78rem] font-semibold text-navy mb-1">Número de documento</span>
                    <input type="text" inputMode="numeric" value={doc} onChange={e => setDoc(e.target.value)}
                        placeholder="Solo los dígitos; los puntos dan igual"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-[0.92rem]"
                        style={{ fontFamily: "'Fira Code', monospace" }} />
                </label>
            </div>

            {previsto && (
                <p className="text-[0.85rem] text-gray-600" style={{ margin: '0 0 0.75rem' }}>
                    Con ese documento le corresponde la ventana de <strong>{previsto.ventana} ruedas</strong>{' '}
                    y el emisor <strong>{previsto.emisorRotulo}</strong> — combinación{' '}
                    <code>{previsto.combinacion}</code>.
                </p>
            )}

            {error && (
                <p className="text-[0.88rem] font-semibold text-red-600" style={{ margin: '0 0 0.75rem' }}>
                    <i className="fas fa-circle-xmark mr-1"></i>{error}
                </p>
            )}

            <button onClick={comenzar}
                className="text-sm font-bold px-5 py-2 rounded-full text-white tr-gradient hover:opacity-90">
                <i className="fas fa-play mr-2"></i>{confirmar ? 'Cambiar y continuar' : 'Comenzar el taller'}
            </button>

            <AvisoPersistencia persistencia={almacenTaller.estadoPersistencia()} />
        </div>
    );
};

const AvisoPersistencia = ({ persistencia }) => {
    if (persistencia.disponible) {
        return (
            <p className="text-[0.78rem] text-gray-500 mt-3" style={{ margin: '0.75rem 0 0' }}>
                <i className="fas fa-floppy-disk mr-1"></i>
                Sus respuestas se guardan en este navegador
                {persistencia.ultimoGuardado
                    ? ` — última vez a las ${persistencia.ultimoGuardado.slice(11, 19)}`
                    : ''}
                . Aun así, <strong>descargue la entrega al terminar cada bloque</strong>: el
                guardado es una comodidad, el archivo es lo que se califica.
            </p>
        );
    }
    return (
        <div className="rounded-xl px-4 py-3 border-l-4 mt-3" style={{ borderColor: '#B91C1C', background: '#FEF2F2' }}>
            <p className="text-[0.88rem] text-gray-800" style={{ margin: 0 }}>
                <i className="fas fa-triangle-exclamation text-red-600 mr-2"></i>
                <strong>Este navegador no está guardando nada</strong> ({persistencia.motivo}). El
                taller funciona igual y el botón de entrega también, pero si cierra la pestaña
                pierde lo escrito. <strong>Descargue la entrega al terminar cada bloque</strong>, o
                abra el archivo desde el disco en vez de desde una vista previa.
            </p>
        </div>
    );
};

/* ============================================================
   RESPUESTA ABIERTA
   Lo único que puntúa en este taller. No tiene solución, no tiene veredicto y
   no revela nada: si llevara la respuesta dentro, estaría en el fuente del
   archivo que el estudiante tiene abierto.
============================================================ */
const RespuestaAbierta = ({ id, etiqueta, enunciado, minPalabras = 40, maxPalabras, filas = 5, ayuda, children }) => {
    const [texto, setTexto] = useState(() => almacenTaller.getRespuesta(id));
    const [guardado, setGuardado] = useState(true);
    const temporizador = useRef(null);
    /* El último texto tecleado, fuera del cierre de los efectos. Ver el aviso
       de más abajo: es lo que hace que la limpieza al desmontar baje lo que el
       estudiante escribió y no lo que había cuando el componente se montó. */
    const ultimo = useRef(texto);

    /* Rehidratación: el capítulo monta una sección a la vez, así que este
       componente se destruye y se reconstruye cada vez que se navega. Sin esto,
       volver a un bloque lo mostraría en blanco con el texto a salvo en el
       almacén, que es la peor combinación posible: parece que se perdió. */
    useEffect(() => {
        const v = almacenTaller.getRespuesta(id);
        setTexto(v);
        ultimo.current = v;
    }, [id]);

    const bajar = useCallback((v) => {
        ultimo.current = v;
        almacenTaller.setRespuesta(id, v);
        setGuardado(true);
    }, [id]);

    const alEscribir = (v) => {
        setTexto(v);
        ultimo.current = v;
        setGuardado(false);
        if (temporizador.current) clearTimeout(temporizador.current);
        temporizador.current = setTimeout(() => bajar(v), 800);
    };

    /* Al desmontarse —navegar a otra sección— se baja lo que quede pendiente.
       Sin esto, escribir y navegar antes de 800 ms pierde la última frase.

       ⚠️ Las dependencias `[id]` NO son opcionales, y esto costó el primer
       recorrido en pantalla de T-3. Sin ellas el efecto se vuelve a montar en
       cada render, y su limpieza corre ANTES de cada render siguiente: cada
       tecla cancelaba el temporizador de la anterior —así que el autoguardado
       no llegaba a dispararse nunca— y encima escribía en el almacén el `texto`
       del render anterior. El contador decía «15 palabras» y `localStorage`
       guardaba la cadena vacía. Ninguna regla estática puede ver eso: solo
       escribir en el área de texto y mirar lo que quedó guardado.

       Y por eso el valor que se baja sale de una referencia y no del cierre:
       con `[id]`, la función de limpieza captura el `texto` del montaje —el
       vacío— y volvería a borrarlo todo, que es el mismo defecto por el otro
       extremo. */
    useEffect(() => {
        return () => {
            if (temporizador.current) clearTimeout(temporizador.current);
            almacenTaller.setRespuesta(id, ultimo.current);
        };
    }, [id]);

    /* Se registra para que `Entrega` pueda vaciarla antes de armar el archivo. */
    useEffect(() => almacenTaller.registrarVaciado(() => {
        if (temporizador.current) clearTimeout(temporizador.current);
        almacenTaller.setRespuesta(id, ultimo.current);
    }), [id]);

    const palabras = texto.trim() ? texto.trim().split(/\s+/).length : 0;
    const corta = palabras > 0 && palabras < minPalabras;
    /* El tope no bloquea: avisa. Cortar el texto de alguien que está
       escribiendo es la clase de ayuda que hace perder trabajo. */
    const larga = !!maxPalabras && palabras > maxPalabras;

    return (
        <div className="my-5 rounded-xl border-2 p-5" style={{ borderColor: '#3D008D', background: '#FFFFFF' }}>
            <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[0.65rem] uppercase tracking-wider font-bold text-white rounded px-2 py-0.5 tr-gradient">
                    {id}
                </span>
                <h4 className="text-base font-bold text-navy" style={{ margin: 0 }}>{etiqueta}</h4>
            </div>

            {enunciado && <div className="text-[0.93rem] text-gray-700 mb-3">{enunciado}</div>}
            {children}

            <textarea value={texto} onChange={e => alEscribir(e.target.value)}
                onBlur={() => bajar(texto)} rows={filas}
                aria-label={`Respuesta de ${id}`}
                placeholder="Escriba aquí su respuesta."
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-[0.92rem] leading-relaxed"
                style={{ resize: 'vertical' }} />

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[0.78rem]">
                <span className={corta || larga ? 'text-amber-600 font-semibold' : 'text-gray-500'}>
                    {palabras} {palabras === 1 ? 'palabra' : 'palabras'}
                    {corta ? ` · se esperan al menos ${minPalabras}` : ''}
                    {larga ? ` · se pidió como mucho ${maxPalabras}, y la extensión se califica` : ''}
                    {!corta && !larga && maxPalabras ? ` · de ${minPalabras} a ${maxPalabras}` : ''}
                </span>
                <span className={guardado ? 'text-gray-400' : 'text-secondary font-semibold'}>
                    <i className={`fas ${guardado ? 'fa-check' : 'fa-pen'} mr-1`}></i>
                    {guardado ? 'guardado' : 'escribiendo…'}
                </span>
                {ayuda && <span className="text-gray-500 basis-full">{ayuda}</span>}
            </div>
        </div>
    );
};

/* ============================================================
   ANDAMIO
   Envuelve un ejercicio autocalificado de TR-CORE —`MCQ`, `OrdenaPasos`,
   `Emparejamiento`, `DetectaError`, `TablaTraza`—, que **vale cero** porque
   lleva su respuesta dentro del archivo, y cuenta los intentos.

   La cuenta es por observación del DOM y no por integración con el componente,
   porque integrarla exigiría tocar TR-CORE. Es aproximada a propósito y no
   puntúa: informa la sustentación. El taller lo dice en la primera pantalla.
============================================================ */
const ROTULOS_COMPROBAR = ['comprobar', 'verificar', 'calificar', 'revisar'];

/* Señales de acierto por SUBCADENA. Valen porque el rótulo solo se pinta
   cuando se acertó: si está, hubo acierto. */
const SENALES_ACIERTO = ['fa-circle-check', '¡correcto!', 'secuencia correcta', '¡bien!'];

/* ⚠️ Y las que hay que LEER, porque el rótulo sale igual acertando y fallando.
   `TablaTraza` —el único andamio del bloque 0— remata con «3 / 3 celdas
   correctas (100 %)», y ese texto aparece idéntico con «0 / 3». No emitía
   ninguna de las señales de arriba, así que A0 resuelto al 100 % quedaba
   registrado como FALLO por muy bien que lo hiciera el estudiante; y añadir
   «celdas correctas» a la lista de arriba habría sido peor, porque registraría
   acierto por haber pulsado el botón.

   La lectura vive aquí y no en el componente porque **TR-CORE no se toca**: la
   cuenta del andamio es por observación del DOM, como dice la cabecera.
   Devuelven `true`, `false`, o `null` si el patrón no aparece. */
const LECTORES_ACIERTO = [
    (texto) => {
        const m = texto.match(/(\d+)\s*\/\s*(\d+)\s+celdas correctas/);
        if (!m) return null;
        return Number(m[2]) > 0 && m[1] === m[2];
    },
];

const Andamio = ({ id, nota, children }) => {
    const caja = useRef(null);

    useEffect(() => {
        const el = caja.current;
        if (!el) return;
        const alPulsar = (ev) => {
            const btn = ev.target.closest('button');
            if (!btn) return;
            const t = (btn.textContent || '').trim().toLowerCase();
            if (!ROTULOS_COMPROBAR.some(r => t.indexOf(r) === 0)) return;
            /* El veredicto se pinta en el render siguiente, así que se lee
               después de que React lo haya aplicado. */
            setTimeout(() => {
                const html = (el.innerHTML || '').toLowerCase();
                const texto = (el.textContent || '').toLowerCase();
                /* El lector manda sobre las subcadenas: si el componente pinta
                   un veredicto que hay que leer, leerlo es la respuesta, y no
                   que además aparezca o no un icono por otro motivo. */
                const leido = LECTORES_ACIERTO
                    .map(f => f(texto))
                    .find(v => v !== null && v !== undefined);
                const acierto = leido !== undefined
                    ? leido
                    : SENALES_ACIERTO.some(s => html.indexOf(s) >= 0 || texto.indexOf(s) >= 0);
                almacenTaller.sumarIntento(id, acierto);
            }, 60);
        };
        el.addEventListener('click', alPulsar, true);
        return () => el.removeEventListener('click', alPulsar, true);
    }, [id]);

    return (
        <div ref={caja} className="relative">
            <div className="flex items-center gap-2 text-[0.72rem] font-semibold text-gray-500 mb-1">
                <span className="uppercase tracking-wider rounded px-2 py-0.5 border border-gray-300">{id} · no puntúa</span>
                <span>{nota || 'Compruebe que entendió antes de escribir. Sus intentos quedan registrados en la entrega.'}</span>
            </div>
            {children}
        </div>
    );
};

/* ============================================================
   BARRIDO
   Envuelve un `Laboratorio` y registra lo que ocurrió mientras se movía. Es la
   única pieza del taller cuya respuesta no está escrita en ninguna parte: ni en
   los capítulos, ni en el repositorio, ni en un modelo de lenguaje. Solo la
   produce quien barra el rango.

   No toca `Laboratorio`: escucha los eventos de sus `input[type=range]` desde
   el contenedor, y los identifica por el `aria-label` que el propio componente
   les pone —que es la etiqueta del control—.
============================================================ */
const Barrido = ({ id, titulo, enunciado, campos, children }) => {
    const caja = useRef(null);
    const [visitados, setVisitados] = useState(() => {
        const d = almacenTaller.leer();
        return (d && d.barridos[id] && d.barridos[id].visitados) || {};
    });
    const [valores, setValores] = useState(() => {
        const d = almacenTaller.leer();
        return (d && d.barridos[id] && d.barridos[id].campos) || {};
    });

    useEffect(() => {
        const el = caja.current;
        if (!el) return;
        const alMover = (ev) => {
            const t = ev.target;
            if (!t || t.type !== 'range') return;
            const control = t.getAttribute('aria-label') || 'control';
            const v = parseFloat(t.value);
            if (!Number.isFinite(v)) return;
            almacenTaller.registrarVisita(id, control, v);
        };
        /* `input` mientras se arrastra —para ver el rango recorrido— y
           `change` al soltar, que es cuando se baja al almacén. Escribir en
           `localStorage` en cada `input` traba el deslizador. */
        const alSoltar = () => {
            almacenTaller.forzarGuardado();
            const d = almacenTaller.leer();
            setVisitados({ ...((d && d.barridos[id] && d.barridos[id].visitados) || {}) });
        };
        el.addEventListener('input', alMover, true);
        el.addEventListener('change', alSoltar, true);
        return () => {
            el.removeEventListener('input', alMover, true);
            el.removeEventListener('change', alSoltar, true);
        };
    }, [id]);

    const fijarCampo = (cid, v) => {
        setValores(prev => ({ ...prev, [cid]: v }));
        almacenTaller.setBarridoCampo(id, cid, v);
    };

    const controles = Object.keys(visitados);

    return (
        <div ref={caja} className="my-6 rounded-2xl border-2 p-5" style={{ borderColor: '#7C3AED', background: '#FFFFFF' }}>
            <div className="flex items-baseline gap-2 mb-2">
                <span className="text-[0.65rem] uppercase tracking-wider font-bold text-white rounded px-2 py-0.5" style={{ background: '#7C3AED' }}>
                    {id} · barrido
                </span>
                <h4 className="text-base font-bold text-navy" style={{ margin: 0 }}>{titulo}</h4>
            </div>

            {enunciado && <div className="text-[0.93rem] text-gray-700 mb-3">{enunciado}</div>}

            {children}

            <div className="grid gap-3 mt-4" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>
                {campos.map(c => (
                    <label key={c.id} className="block">
                        <span className="block text-[0.78rem] font-semibold text-navy mb-1">{c.etiqueta}</span>
                        {c.largo
                            ? <textarea value={valores[c.id] || ''} onChange={e => fijarCampo(c.id, e.target.value)}
                                rows={3} aria-label={`${id} · ${c.etiqueta}`} placeholder={c.pista || ''}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-[0.9rem]" style={{ resize: 'vertical' }} />
                            : <input type="text" value={valores[c.id] || ''} onChange={e => fijarCampo(c.id, e.target.value)}
                                aria-label={`${id} · ${c.etiqueta}`} placeholder={c.pista || ''}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-[0.9rem]" />}
                    </label>
                ))}
            </div>

            <div className="rounded-xl px-3 py-2 border-l-4 mt-3" style={{ borderColor: '#7C3AED', background: '#F5F3FF' }}>
                <p className="text-[0.8rem] text-gray-600" style={{ margin: 0 }}>
                    <i className="fas fa-route text-purple-600 mr-2"></i>
                    {controles.length === 0
                        ? 'Todavía no ha movido ningún deslizador. El recorrido queda registrado en la entrega: se ve si barrió el rango o si probó un solo valor.'
                        : controles.map(k => {
                            const v = visitados[k];
                            return `${k}: ${v.distintos.length} valores entre ${v.min} y ${v.max}`;
                        }).join(' · ')}
                </p>
            </div>
        </div>
    );
};

/* ============================================================
   ENTREGA
   Arma el JSON, lo descarga y lo muestra para copiar. El área de texto no es
   un adorno: es la ruta que funciona cuando la descarga no —Safari con el
   archivo abierto desde el disco, un navegador en modo restringido, una
   tableta—, y es la que sirve para pegar en el aula virtual.
============================================================ */
const Entrega = ({ inventario }) => {
    const { datos, persistencia } = usePersistencia();
    const [generado, setGenerado] = useState(null);
    const [copiado, setCopiado] = useState(false);

    if (!datos || !datos.ejes) return null;

    /* ⚠️ Se calcula LEYENDO EL ALMACÉN, no el `datos` del render, y se vuelve a
       calcular dentro de `generar()`. El motivo salió del recorrido completo:
       el estudiante escribe la bitácora y pulsa «Generar» enseguida; el
       autoguardado tarda 800 ms y React no ha vuelto a renderizar, así que el
       botón corría con el `faltan` del render anterior y el archivo se declaraba
       a sí mismo incompleto **teniendo la respuesta dentro**. Una entrega buena
       rechazada por su propia lista de pendientes es de los peores defectos
       posibles, y no lo ve ninguna regla estática. */
    /* ⚠️ Y se comprueba campo a campo, no «alguno». La versión anterior daba por
       respondido un `Barrido` con UN campo lleno de cuatro —`…length === 0`— y
       una `RespuestaAbierta` con cualquier texto, sin mirar `minPalabras`. Con
       eso, escribir «no» en las veinte abiertas y rellenar solo el primer campo
       de P3.1, P3.2 y P3.3 anunciaba **«23 de 23 respondidas»** y sacaba el
       archivo con `faltan: []`, dejando vacías siete de las diez casillas de
       barrido — entre ellas las cuatro `largo: true`, que son las que puntúan, y
       la de conciliación con el capítulo 6.

       La forma de cada pregunta —cuántos campos, cuántas palabras— sale del
       INVENTARIO y no del componente, porque `Entrega` vive en el bloque 7 y
       tiene que saberlo aunque el estudiante no haya abierto nunca el bloque 3. */
    const cuentaPalabras = (s) => String(s || '').trim().split(/\s+/).filter(Boolean).length;

    const revisar = () => {
        const d = almacenTaller.leer() || datos;
        return inventario.map(q => {
            if (q.tipo === 'barrido') {
                const b = d.barridos[q.id];
                const llenos = b ? Object.keys(b.campos)
                    .filter(k => String(b.campos[k]).trim()).length : 0;
                const total = q.campos || 0;
                if (llenos === 0) return { q, motivo: 'vacía' };
                if (llenos < total) return { q, motivo: 'incompleta', llenos, total };
                return null;
            }
            const texto = String(d.respuestas[q.id] || '').trim();
            if (!texto) return { q, motivo: 'vacía' };
            const n = cuentaPalabras(texto);
            if (q.minPalabras && n < q.minPalabras) {
                return { q, motivo: 'corta', palabras: n, pide: q.minPalabras };
            }
            return null;
        }).filter(Boolean);
    };

    /* `faltan` es lo que hay que ir a rellenar: vacías y barridos a medias. Las
       «cortas» se avisan aparte y NO bloquean nada —una respuesta breve puede
       ser buena y el recuento de palabras no califica—, pero viajan en el
       archivo para que quien califique no tenga que contarlas a mano. */
    const pendientesDe = (r) => r.filter(x => x.motivo !== 'corta');
    const cortasDe = (r) => r.filter(x => x.motivo === 'corta');

    const revision = revisar();
    const faltan = pendientesDe(revision);
    const cortas = cortasDe(revision);

    const generar = () => {
        almacenTaller.vaciarPendientes();     // lo escrito hace un segundo también cuenta
        const ahora = revisar();
        const pendientes = pendientesDe(ahora);
        const cuerpo = {
            instrumento: 'TDR-U1T',
            version: datos.version,
            nombre: datos.nombre,
            documento: datos.ejes.canonico,
            combinacion: datos.ejes.combinacion,
            ventana: datos.ejes.ventana,
            emisor: datos.ejes.emisor,
            iniciado: datos.iniciado,
            entregado: new Date().toISOString(),
            respuestas: datos.respuestas,
            tiempos: datos.tiempos,
            barridos: datos.barridos,
            intentos: datos.intentos,
            faltan: pendientes.map(x => x.q.id),
            /* Las cortas viajan con su recuento: `calificar.py` promete en su
               docstring decir «cuántas palabras trae cada respuesta» y hasta
               hoy lo calculaba sin imprimirlo nunca. */
            cortas: cortasDe(ahora).map(x => ({ id: x.q.id, palabras: x.palabras, pide: x.pide })),
        };
        const sello = sellarEntrega(cuerpo);
        const texto = JSON.stringify({ ...cuerpo, sello }, null, 1);
        setGenerado({ texto, sello, nombre: `TDR-U1T_${datos.ejes.canonico}_${datos.ejes.combinacion}.json` });
        setCopiado(false);

        /* La descarga es el camino cómodo y puede fallar sin avisar en algunos
           navegadores. Por eso se intenta, no se exige: el área de texto de
           abajo aparece siempre y con eso basta para entregar. */
        try {
            const blob = new Blob([texto], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `TDR-U1T_${datos.ejes.canonico}_${datos.ejes.combinacion}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 2000);
        } catch (e) { /* queda el área de texto */ }
    };

    const copiar = () => {
        if (!generado) return;
        try {
            navigator.clipboard.writeText(generado.texto);
            setCopiado(true);
        } catch (e) { setCopiado(false); }
    };

    const respondidas = inventario.length - faltan.length;
    const sinBitacora = !String(datos.respuestas['P7.1'] || '').trim();

    return (
        <div className="my-6 rounded-2xl border-2 p-5" style={{ borderColor: '#3D008D', background: '#FBFAFF' }}>
            <div className="flex items-center gap-2 mb-3">
                <span className="text-white p-2 rounded-lg tr-gradient"><i className="fas fa-paper-plane"></i></span>
                <h3 className="text-lg font-bold text-navy" style={{ margin: 0 }}>Entrega</h3>
                <span className="ml-auto text-[0.8rem] font-semibold text-gray-600">
                    {respondidas} de {inventario.length} respondidas
                </span>
            </div>

            {faltan.length > 0 && (
                <div className="rounded-xl px-4 py-3 border-l-4 mb-3" style={{ borderColor: '#B45309', background: '#FFFBEB' }}>
                    <p className="text-[0.88rem] text-gray-800" style={{ margin: 0 }}>
                        <i className="fas fa-triangle-exclamation text-amber-600 mr-2"></i>
                        Le faltan <strong>{faltan.length}</strong>:{' '}
                        {faltan.map(x => x.motivo === 'incompleta'
                            ? `${x.q.id} (${x.llenos} de ${x.total} casillas)`
                            : x.q.id).join(', ')}.
                        Puede entregar así —el archivo lo registra—, pero cada una sin responder
                        vale cero. <strong>Un barrido con casillas vacías cuenta como
                        incompleto</strong>: las dos últimas de cada uno son las que puntúan.
                    </p>
                </div>
            )}

            {cortas.length > 0 && (
                <div className="rounded-xl px-4 py-3 border-l-4 mb-3" style={{ borderColor: '#0369A1', background: '#F0F9FF' }}>
                    <p className="text-[0.88rem] text-gray-800" style={{ margin: 0 }}>
                        <i className="fas fa-circle-info text-sky-700 mr-2"></i>
                        <strong>{cortas.length}</strong>{' '}
                        {cortas.length === 1 ? 'respuesta se queda' : 'respuestas se quedan'} por
                        debajo de la extensión que pide el enunciado:{' '}
                        {cortas.map(x => `${x.q.id} (${x.palabras} de ${x.pide})`).join(', ')}.
                        <strong> No bloquea la entrega</strong> —una respuesta breve puede ser
                        buena y el recuento no califica—, pero a esa distancia suele faltar la
                        cifra, el costo en pesos o la decisión firmada, que sí califican.
                    </p>
                </div>
            )}

            {sinBitacora && (
                <div className="rounded-xl px-4 py-3 border-l-4 mb-3" style={{ borderColor: '#B91C1C', background: '#FEF2F2' }}>
                    <p className="text-[0.88rem] text-gray-800" style={{ margin: 0 }}>
                        <i className="fas fa-circle-exclamation text-red-600 mr-2"></i>
                        <strong>La bitácora (P7.1) está vacía.</strong> No es una pregunta más: un
                        taller sin bitácora <strong>no se califica</strong>, y no por sospecha —es
                        uno de los productos evaluados—. Si no usó IA en absoluto, escríbalo allí y
                        firme esa afirmación: eso también es una bitácora.
                    </p>
                </div>
            )}

            <button onClick={generar}
                className="text-sm font-bold px-5 py-2 rounded-full text-white tr-gradient hover:opacity-90">
                <i className="fas fa-file-arrow-down mr-2"></i>Generar la entrega
            </button>

            {generado && (
                <div className="mt-4 animate-fade-in">
                    <p className="text-[0.9rem] text-gray-700" style={{ margin: '0 0 0.5rem' }}>
                        Archivo <code>{generado.nombre}</code> · código de verificación{' '}
                        <strong style={{ fontFamily: "'Fira Code', monospace" }}>{generado.sello}</strong>
                    </p>
                    <p className="text-[0.82rem] text-gray-600" style={{ margin: '0 0 0.5rem' }}>
                        Si no se descargó solo, copie todo el texto de abajo y péguelo en la
                        entrega del aula virtual. El código de verificación detecta un archivo
                        truncado o corrupto; <strong>no es una firma</strong> y no pretende serlo.
                    </p>
                    <textarea readOnly value={generado.texto} rows={8}
                        aria-label="Contenido de la entrega"
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 text-[0.72rem]"
                        style={{ fontFamily: "'Fira Code', monospace", resize: 'vertical' }} />
                    <button onClick={copiar}
                        className="mt-2 text-xs font-bold px-3 py-1.5 rounded-full border border-primary text-primary hover:bg-primary/5">
                        <i className={`fas ${copiado ? 'fa-check' : 'fa-copy'} mr-1`}></i>
                        {copiado ? 'Copiado' : 'Copiar al portapapeles'}
                    </button>
                </div>
            )}

            <AvisoPersistencia persistencia={persistencia} />
        </div>
    );
};
/* ============================================================================
   FIN DE TALLER-CORE
============================================================================ */
