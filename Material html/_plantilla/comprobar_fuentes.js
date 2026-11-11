#!/usr/bin/env node
/*
 * Comprobaciones 22 y 24 · lo que el capítulo muestra o afirma sin decir de
 * dónde sale. Las dos son AVISOS: señalan dónde mirar, no deciden.
 *
 *   22 · FIGURA SIN FUENTE. Una gráfica, una tabla o un diagrama que no dice
 *        de dónde salen sus datos. Cuenta como figura:
 *          · un `<ChartFrame>`: tiene fuente si trae la propiedad `fuente`;
 *          · un `<table>`, un `<figure>` o un `<svg>` suelto: tiene fuente si
 *            lo que le sigue es un `<Fuente>` —a él o al envoltorio del que es
 *            hijo único, como el `<div className="overflow-x-auto">` de las
 *            tablas—, o si lo lleva dentro (un `<figure>` en su `figcaption`).
 *        Un `<svg>` dentro de un `<figure>` no cuenta aparte: lo cubre el
 *        `<figure>`.
 *
 *   24 · ENTIDAD O NORMA SIN CITA. El texto nombra una entidad (la
 *        Superintendencia Financiera, el Banco de la República, el Comité de
 *        Basilea…) o una norma (una ley, un decreto, una circular, Basilea III)
 *        y ni la cita ni la
 *        declara ilustrativa. Lo que se diga de ellas es justo lo que un
 *        lector puede querer comprobar, y lo que envejece cuando la norma
 *        cambia. Pasa si en el mismo bloque —el párrafo, el ítem de lista, la
 *        celda, el `Box`, la `FichaNorma`— hay un `<Cita>`, un `<Fuente k>` o
 *        una `<FichaNorma k>`, o si el texto está dentro de un `<Ilustrativo>`.
 *
 * El léxico de la 24 es la lista ENTIDADES_Y_NORMAS de más abajo: corta y
 * escrita a mano. No intenta reconocer cualquier institución, solo las que
 * este curso nombra o es fácil que nombre; se amplía ahí cuando haga falta.
 * Quedan fuera a propósito los conceptos (VaR, duración, tasa efectiva) y las
 * personas (Markowitz, Black, Scholes): no son entidades ni normas. Y quedan
 * fuera la Bolsa de Valores de Colombia y el SEN: el material los nombra como
 * origen de sus datos, que se documenta en `datos/MANIFIESTO.md`, no con una
 * cita.
 *
 * Se mira la prosa del capítulo —el texto JSX y las cadenas—, no el código:
 * fuera quedan las plantillas literales, lo que cuelga de `python` o `r`, los
 * `inline-code`, la librería TR-CORE y el `App`. Por eso usa el analizador de
 * Babel: hay que saber qué es texto y qué no, y qué elemento envuelve a cuál.
 * Necesita @babel/core y @babel/preset-react instalados en global, como en el
 * curso hermano; si faltan, `verificar.py` avisa en vez de fallar.
 *
 * Una cadena no puede llevar un `<Cita>` dentro —la opción de una pregunta, el
 * `caption` de una gráfica—, y una tabla puede no necesitar fuente —la de los
 * operadores de un lenguaje—. Lo ya revisado se calla escribiendo `fuente-ok`
 * y el motivo en un comentario, en su línea o en la anterior:
 *
 *     {/* fuente-ok: la tabla resume el bloque de código de arriba *\/}
 *     <table>…
 *
 * Sin esa válvula el aviso saldría siempre, y un aviso que siempre está ahí
 * deja de leerse.
 *
 * Viene de Lógica de Programación Financiera (2026-11-10) y se adaptó a este
 * curso el 2026-11-11; las pruebas están anotadas en `verificar.py`, junto a
 * `fuentes_sin_declarar`. Un JSX que no compila sale con 2 y un mensaje, no
 * con la traza de Babel.
 *
 *   node comprobar_fuentes.js <archivo.html>…
 *
 * Escribe una línea por hallazgo, `archivo:línea:regla:clase:contexto`.
 *   0 = nada que avisar · 1 = hay avisos · 2 = falta Babel o el JSX no compila
 */
'use strict';
const fs = require('fs');
const { execSync } = require('child_process');

const rutas = process.argv.slice(2).filter(a => !a.startsWith('--'));
const desconocidas = process.argv.slice(2).filter(a => a.startsWith('--'));
if (desconocidas.length) { console.error(`opción desconocida: ${desconocidas.join(', ')}`); process.exit(2); }
if (!rutas.length) { console.error('uso: comprobar_fuentes.js <archivo.html>…'); process.exit(2); }

let babel, preset;
try {
    const raiz = execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    babel = require(raiz + '/@babel/core');
    preset = raiz + '/@babel/preset-react';
    require.resolve(preset);
} catch (e) {
    console.error('SIN-BABEL: falta @babel/core o @babel/preset-react. Instale con:  npm i -g @babel/core @babel/preset-react');
    process.exit(2);
}

const MARCA_FIN = '/* === TR-CORE FIN === */';
// Las anclas del App, las de `migrar.py`: es plantilla, no contenido.
const ANCLA_APP_INICIO = 'const App = () => {';
const ANCLA_APP_FIN = 'root.render(<App />);';
const INDULTO = 'fuente-ok';
const LENGUAJES = new Set(['python', 'r']);
const ETIQUETAS_CODIGO = new Set(['code', 'pre', 'kbd']);
// Atributos cuyo valor no es prosa.
const ATRIBUTOS_MUDOS = new Set(['className', 'style', 'id', 'key', 'href', 'src', 'icon', 'k', 'loc', 'type',
    'tema', 'tipo', 'lang', 'height', 'viewBox', 'd', 'points', 'transform', 'fill', 'stroke', 'role']);
// El bloque dentro del cual una cita cubre a una mención.
const BLOQUES = new Set(['p', 'li', 'td', 'th', 'dd', 'dt', 'blockquote', 'figcaption', 'summary',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'Box', 'CalloutPro', 'Motivacion', 'Reto', 'Fuente', 'FichaNorma']);

// Entidades y normas. Cada entrada es [clase, expresión]. Las siglas van con
// límites de palabra y en mayúsculas, para que «dian» dentro de «mediante» o
// «iso» dentro de «aviso» no cuenten.
const ENTIDADES_Y_NORMAS = [
    ['entidad', /Superintendencia(?: Financiera)?(?: de Colombia)?|Superfinanciera|\bSFC\b/],
    ['entidad', /Banco de la República|\bBanRep\b/],
    ['entidad', /\bDIAN\b|\bDANE\b|\bFogaf[ií]n\b|\bFogacoop\b|\bAsobancaria\b|\bURF\b/],
    ['entidad', /Ministerio de Hacienda|Congreso de la República|Corte Constitucional/],
    ['entidad', /Banco Mundial|Fondo Monetario Internacional|\bFMI\b|\bBIS\b|Comité de Basilea|\bOCDE\b/],
    ['entidad', /DataCrédito|\bCIFIN\b|TransUnion|\bSWIFT\b|\bOFAC\b|Lista Clinton/],
    ['entidad', /Autorregulador del Mercado de Valores|\bAMV\b|\bIOSCO\b|Reserva Federal/],
    ['norma', /\b(?:Ley|Decreto|Resolución|Acuerdo)\s+(?:\d[\d.  ]*)(?:\s+de\s+\d{4})?/],
    ['norma', /Circular (?:Externa|Básica)[^,.;:)]{0,40}|Estatuto (?:Tributario|Orgánico del Sistema Financiero)|Código de Comercio/],
    ['norma', /\bNIIF\b|\bNIC\s+\d+|\bIFRS\b|Basilea\s+(?:III|II|I)\b|\bSARLAFT\b|\bSARC\b/],
    // Los sistemas de administración de riesgo y el marco que los reemplazó:
    // lo que se diga de ellos es lo que más envejece (ver CLAUDE.md, la CBCF
    // sustituida por la Circular Básica Financiera el 1/6/2026).
    ['norma', /\bSARM\b|\bSARL\b|\bSARO\b|\bSIAR\b|\bFRTB\b|Cap[íi]tulo\s+[XVI]+\b/],
    ['norma', /\bIEEE(?:[\s ]+\d+)?|\bISO(?:\/IEC)?[\s ]+\d+/],
    ['norma', /tasa de usura|interés bancario corriente/i],
];

function nombreDe(el) {
    const n = el && el.openingElement && el.openingElement.name;
    return n && n.type === 'JSXIdentifier' ? n.name : null;
}
function atributo(el, nombre) {
    return el.openingElement.attributes.find(a => a.type === 'JSXAttribute' && a.name && a.name.name === nombre);
}
function esCodigoJSX(el) {
    const nombre = nombreDe(el);
    if (ETIQUETAS_CODIGO.has(nombre)) return true;
    const cls = atributo(el, 'className');
    return !!(cls && cls.value && cls.value.type === 'StringLiteral' && /\binline-code\b/.test(cls.value.value));
}
// Recorre los nodos hijos de `nodo`, sean cuales sean sus propiedades.
function hijosDe(nodo) {
    const fuera = [];
    for (const clave of Object.keys(nodo)) {
        if (clave === 'loc' || /Comments$/.test(clave)) continue;
        const v = nodo[clave];
        if (Array.isArray(v)) v.forEach(h => { if (h && typeof h.type === 'string') fuera.push(h); });
        else if (v && typeof v.type === 'string') fuera.push(v);
    }
    return fuera;
}
function contiene(nodo, prueba) {
    if (prueba(nodo)) return true;
    return hijosDe(nodo).some(h => contiene(h, prueba));
}
const esCita = n => n.type === 'JSXElement' && (nombreDe(n) === 'Cita' ||
    ((nombreDe(n) === 'Fuente' || nombreDe(n) === 'FichaNorma') && !!atributo(n, 'k')));
const esFuente = n => n.type === 'JSXElement' && nombreDe(n) === 'Fuente';
const esElemento = n => n.type === 'JSXElement' || n.type === 'JSXFragment';
const enBlanco = n => n.type === 'JSXText' && !n.value.trim();
// Un comentario JSX, `{/* … */}`, no es un hermano: es un contenedor vacío.
const esComentario = n => n.type === 'JSXExpressionContainer' && n.expression.type === 'JSXEmptyExpression';

// ¿Lo que sigue a `el` es un <Fuente>? Se sube mientras `el` sea el único
// elemento de su padre: la tabla va dentro de un div que solo la envuelve.
function leSigueFuente(el, padres) {
    let nodo = el;
    for (let i = padres.length - 1; i >= 0; i--) {
        const padre = padres[i];
        if (!padre.children) return false;
        const hermanos = padre.children.filter(h => !enBlanco(h) && !esComentario(h));
        const k = hermanos.indexOf(nodo);
        if (k === -1) return false;
        if (hermanos[k + 1] && esFuente(hermanos[k + 1])) return true;
        if (hermanos.length !== 1 || padre.type !== 'JSXElement') return false;
        nodo = padre;
    }
    return false;
}

function analizar(ruta) {
    const texto = fs.readFileSync(ruta, 'utf8');
    const lineas = texto.split('\n');
    const lineaDe = pos => texto.slice(0, pos).split('\n').length;
    const indultado = pos => {
        const n = lineaDe(pos);
        return (lineas[n - 1] || '').includes(INDULTO) || (lineas[n - 2] || '').includes(INDULTO);
    };
    const finCore = texto.indexOf(MARCA_FIN);
    const iApp = texto.indexOf(ANCLA_APP_INICIO);
    const jApp = iApp === -1 ? -1 : texto.indexOf(ANCLA_APP_FIN, iApp);
    const esContenido = pos => pos > finCore && !(jApp !== -1 && pos >= iApp && pos <= jApp);
    const hallazgos = [];
    const re = /<script\b[^>]*type=["']text\/babel["'][^>]*>([\s\S]*?)<\/script>/g;
    let m, bloques = 0;
    while ((m = re.exec(texto)) !== null) {
        bloques++;
        const base = m.index + m[0].indexOf(m[1]);
        const ast = babel.parseSync(m[1], { presets: [preset], babelrc: false, configFile: false, sourceType: 'script' });

        const visitar = (nodo, padres) => {
            if (!nodo || typeof nodo.type !== 'string') return;
            if (nodo.type === 'TemplateLiteral') return;
            if (nodo.type === 'JSXElement' && esCodigoJSX(nodo)) return;
            if (nodo.type === 'JSXAttribute' && ATRIBUTOS_MUDOS.has(nodo.name && nodo.name.name)) return;
            if (nodo.type === 'ObjectProperty' && nodo.key && LENGUAJES.has(nodo.key.name || nodo.key.value) &&
                (nodo.value.type === 'TemplateLiteral' || nodo.value.type === 'ArrayExpression')) return;
            const pos = base + nodo.start;

            // ---- 22 · figura sin fuente
            if (nodo.type === 'JSXElement' && esContenido(pos) && !indultado(pos)) {
                const nombre = nombreDe(nodo);
                const elementos = padres.filter(p => p.type === 'JSXElement');
                if (nombre === 'ChartFrame') {
                    if (!atributo(nodo, 'fuente')) hallazgos.push([pos, 22, 'ChartFrame', 'sin la propiedad fuente']);
                } else if (nombre === 'table' || nombre === 'figure' ||
                    (nombre === 'svg' && !elementos.some(p => nombreDe(p) === 'figure'))) {
                    const dentro = nombre === 'figure' && contiene(nodo, esFuente);
                    if (!dentro && !leSigueFuente(nodo, padres)) {
                        hallazgos.push([pos, 22, nombre, 'no le sigue un <Fuente>']);
                    }
                }
            }

            // ---- 24 · entidad o norma sin cita
            if ((nodo.type === 'JSXText' || nodo.type === 'StringLiteral') && esContenido(pos)) {
                const crudo = nodo.type === 'JSXText' ? nodo.value : nodo.value;
                const plano = crudo.replace(/\s+/g, ' ');
                const elementos = padres.filter(p => p.type === 'JSXElement');
                const ilustrativo = elementos.some(p => nombreDe(p) === 'Ilustrativo');
                // El bloque: el párrafo, el ítem o la caja más cercanos; si el texto
                // no cuelga de ninguno, el elemento que lo contiene.
                let bloque = null;
                for (let i = elementos.length - 1; i >= 0 && !bloque; i--) {
                    if (BLOQUES.has(nombreDe(elementos[i]))) bloque = elementos[i];
                }
                bloque = bloque || elementos[elementos.length - 1] || null;
                // Una cadena que es el `caption` de una gráfica con `fuente` ya está cubierta.
                const padre = padres[padres.length - 1];
                const conFuente = padre && padre.type === 'JSXAttribute' && elementos.length &&
                    !!atributo(elementos[elementos.length - 1], 'fuente');
                const citado = ilustrativo || conFuente || (bloque && contiene(bloque, esCita));
                if (!citado) {
                    for (const [clase, exp] of ENTIDADES_Y_NORMAS) {
                        const g = new RegExp(exp.source, exp.flags.includes('g') ? exp.flags : exp.flags + 'g');
                        let h;
                        while ((h = g.exec(plano)) !== null) {
                            // La posición en el archivo: la del nodo más lo que haya antes en el texto crudo.
                            const antes = crudo.indexOf(h[0].split(' ')[0]);
                            const p = pos + Math.max(0, antes);
                            if (!indultado(p)) hallazgos.push([p, 24, clase, h[0].trim()]);
                        }
                    }
                }
            }
            hijosDe(nodo).forEach(h => visitar(h, padres.concat([nodo])));
        };
        visitar(ast.program, []);
    }
    if (!bloques) throw new Error('no se encontró ningún <script type="text/babel">');
    return hallazgos.sort((a, b) => a[0] - b[0]).map(([pos, regla, clase, detalle]) => [lineaDe(pos), regla, clase, detalle]);
}

let total = 0;
for (const ruta of rutas) {
    let hallazgos;
    try {
        hallazgos = analizar(ruta);
    } catch (e) {
        // Un capítulo que no compila queda en blanco (zona ciega 1 de CLAUDE.md);
        // aquí no se puede mirar nada, y se dice así en vez de soltar la traza de Babel.
        console.error(`NO-ANALIZABLE: ${ruta.split('/').pop()}: ${String(e.message).split('\n')[0]}`);
        process.exit(2);
    }
    const nombre = ruta.split('/').pop();
    for (const [linea, regla, clase, detalle] of hallazgos) {
        total++;
        console.log(`${nombre}:${linea}:${regla}:${clase}:${detalle}`);
    }
}
process.exit(total ? 1 : 0);
