        /* ============================================================
           CONFIGURACIÓN DEL CAPÍTULO
           Al crear un capítulo nuevo, esto es lo único que cambia aquí
           arriba; el contenido va en las secciones de más abajo.
        ============================================================ */
        const CONFIG = {
            numero: '00',
            titulo: 'Plantilla base',
            subtitulo: 'Catálogo de componentes y guía de autoría del material',
            horas: 0,
            ra: 'RA— (plantilla)',
            contenidoSyllabus: 'No aplica — archivo de referencia técnica',
            temas: ['Componentes', 'Ejercicios E1–E8', 'Guía de autoría'],
            storageKey: 'tdr_cap00_plantilla',
            docente: 'Javier Mauricio Sierra',
        };

        /* ============================================================
           EJEMPLOS DE CÓDIGO — hilo financiero del curso:
           crédito de libre inversión de un banco colombiano
        ============================================================ */
        const EJ_INTERES = {
            pseudo: `Inicio
    // Interés simple de un crédito de libre inversión
    Leer capital, tasa, plazo

    interes <- capital * tasa * plazo
    total   <- capital + interes

    Escribir "Interes: ", interes
    //> Interes: 2160000
    Escribir "Total a pagar: ", total
    //> Total a pagar: 12160000
Fin`,
            python: `# Interés simple de un crédito de libre inversión
capital = 10_000_000      # COP
tasa    = 0.018           # 1,8 % mensual
plazo   = 12              # meses

interes = capital * tasa * plazo
total   = capital + interes

print(f"Interes: {interes:,.0f}")
#> Interes: 2,160,000
print(f"Total a pagar: {total:,.0f}")
#> Total a pagar: 12,160,000`,
            r: `# Interés simple de un crédito de libre inversión
capital <- 10000000    # COP
tasa    <- 0.018       # 1,8 % mensual
plazo   <- 12          # meses

interes <- capital * tasa * plazo
total   <- capital + interes

cat(sprintf("Interes: %.0f\\n", interes))
#> Interes: 2160000
cat(sprintf("Total a pagar: %.0f\\n", total))
#> Total a pagar: 12160000`,
            vba: `Option Explicit

Sub InteresSimple()
    ' Interés simple de un crédito de libre inversión
    Dim capital As Currency, tasa As Double, plazo As Integer
    Dim interes As Currency, total As Currency

    capital = 10000000      ' COP
    tasa = 0.018            ' 1,8 % mensual
    plazo = 12              ' meses

    interes = capital * tasa * plazo
    total = capital + interes

    Debug.Print "Interes: " & interes
    '> Interes: 2160000
    Debug.Print "Total a pagar: " & total
    '> Total a pagar: 12160000
End Sub`,
        };


        const EJ_ACUMULADOR = {
            pseudo: `// Ahorro programado: 200.000 al mes durante 3 meses
saldo <- 0

Para mes <- 1 Hasta 3 Hacer
    saldo <- saldo + 200000
FinPara

Escribir saldo
//> 600000`,
            python: `# Ahorro programado: 200.000 al mes durante 3 meses
saldo = 0

for mes in range(1, 4):
    saldo += 200_000

print(saldo)
#> 600000`,
            r: `# Ahorro programado: 200.000 al mes durante 3 meses
saldo <- 0

for (mes in 1:3) {
  saldo <- saldo + 200000
}

# print(saldo) mostraria 6e+05: R usa notacion cientifica por defecto.
cat(sprintf("%.0f\\n", saldo))
#> 600000`,
            vba: `Sub AhorroProgramado()
    ' Ahorro programado: 200.000 al mes durante 3 meses
    Dim saldo As Currency, mes As Integer
    saldo = 0

    For mes = 1 To 3
        saldo = saldo + 200000
    Next mes

    Debug.Print saldo
    '> 600000
End Sub`,
        };


        /* ============================================================
           PORTADA
        ============================================================ */
        const PortadaSection = () => (
            <div className="prose-lp">
                <Motivacion icon="fa-money-bill-trend-up"
                    gancho="La diferencia entre las dos personas no es saber más Excel: es saber descomponer el problema en pasos. Eso es lo que se aprende aquí.">
                    Son las 8 de la mañana y a dos analistas les entregan el mismo archivo: 40 000 desembolsos
                    y una pregunta —cuánta cartera está vencida— para antes del mediodía. Uno abre la hoja y
                    empieza a filtrar y contar a mano. El otro escribe veinte líneas que responden en segundos
                    y que el próximo mes volverán a servir sin tocar nada.
                </Motivacion>

                <Box type="tip" label="Cómo estudiar este material">
                    Este material es <strong>autónomo</strong>: permite avanzar a ritmo propio con los botones <em>Anterior / Siguiente</em>.
                    Cada capítulo combina teoría breve, casos del sector financiero, diagramas, código en cuatro lenguajes y ejercicios
                    de interpretación. El navegador <strong>recuerda la última lección</strong>, de modo que es posible pausar y retomar.
                    Conviene intentar cada ejercicio <em>antes</em> de ver la retroalimentación.
                </Box>

                <h3>Identificación</h3>
                <div className="overflow-x-auto">
                    <table>
                        <tbody>
                            <tr><th>Asignatura</th><td>Lógica de Programación Financiera</td></tr>
                            <tr><th>Capítulo</th><td>{CONFIG.numero} — {CONFIG.titulo}</td></tr>
                            <tr><th>Contenido del syllabus</th><td>{CONFIG.contenidoSyllabus}</td></tr>
                            <tr><th>Resultado de aprendizaje</th><td>{CONFIG.ra}</td></tr>
                            <tr><th>Tiempo estimado</th><td>{CONFIG.horas} horas</td></tr>
                            <tr><th>Naturaleza</th><td>Teórico-práctico</td></tr>
                        </tbody>
                    </table>
                </div>

                <h3>Los cuatro lenguajes del curso</h3>
                <p>
                    Todo algoritmo del material se presenta en cuatro versiones. Cada bloque
                    <strong> tiene su propia pestaña</strong>, de modo que es posible dejar dos lenguajes
                    abiertos a la vez y compararlos. El material <strong>recuerda la última elección</strong>
                    —también entre visitas— y con ella abre los bloques que todavía no se han tocado.
                </p>
                <div className="grid md:grid-cols-2 gap-3 not-prose">
                    {[
                        { l: 'Pseudocódigo', d: 'Lenguaje normativo del curso. Es lo que se evalúa: expresa la lógica sin atarla a ninguna herramienta.', i: 'fas fa-project-diagram', c: '#3D008D' },
                        { l: 'Python', d: 'Lectura moderna y compacta. Sirve para comprobar rápidamente que el algoritmo hace lo que se espera.', i: 'fab fa-python', c: '#0E7490' },
                        { l: 'R', d: 'El lenguaje del análisis cuantitativo y estadístico, cercano al perfil del programa.', i: 'fas fa-chart-line', c: '#001A4D' },
                        { l: 'VBA (Excel)', d: 'El lenguaje que efectivamente se usa en las áreas financieras. Es el objetivo de los capítulos 6 a 8.', i: 'fas fa-file-excel', c: '#ED1E79' },
                    ].map((x, i) => (
                        <div key={i} className="tr-card p-4 flex gap-3">
                            <span className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ background: x.c }}>
                                <i className={x.i}></i>
                            </span>
                            <span><strong className="text-navy block text-sm">{x.l}</strong><span className="text-sm text-gray-600">{x.d}</span></span>
                        </div>
                    ))}
                </div>

                <h3>Ruta del capítulo</h3>
                <Pipeline steps={[
                    { num: 1, title: 'Contenido', desc: 'Callouts, código, tablas y diagramas' },
                    { num: 2, title: 'Ejercicios', desc: 'Los ocho tipos: E1 a E8' },
                    { num: 3, title: 'Datos', desc: 'Gráficas, fórmulas y glosario' },
                ]} />

                <CalloutPro tema="info" titulo="Sobre los ejercicios de este material" subtitulo="Interpretar, analizar y apropiar — no transcribir" icon="fa-brain">
                    Los ejercicios <strong>no piden escribir programas desde cero</strong>: eso corresponde a los talleres evaluables.
                    Aquí se ejercita otra cosa, más difícil y más útil: <strong>leer</strong> un algoritmo ajeno, <strong>trazarlo</strong> a mano,
                    <strong> diagnosticar</strong> por qué falla, <strong>comparar</strong> dos soluciones e <strong>interpretar</strong> qué
                    significa el resultado para el negocio.
                </CalloutPro>
            </div>
        );

        /* ============================================================
           SECCIÓN 1 — COMPONENTES DE CONTENIDO
        ============================================================ */
        const Seccion1 = () => (
            <div className="prose-lp">
                <Motivacion icon="fa-layer-group"
                    gancho="La pregunta no es qué componentes hay, sino cuál merece cada momento del texto.">
                    Un capítulo mal construido se reconoce en diez segundos: párrafos que no terminan, código
                    sin decir de dónde sale, y todo resaltado en amarillo. El estudiante lo abandona en la
                    tercera pantalla, y no porque el tema fuera difícil.
                </Motivacion>

                <p>
                    Esta sección muestra los componentes disponibles para exponer contenido. Un <Termino def="Bloque de texto destacado que interrumpe la lectura para advertir, sugerir o contextualizar. Se usa con moderación: si todo está destacado, nada lo está.">callout</Termino> bien puesto vale más que tres párrafos.
                </p>

                <h3>Avisos y destacados</h3>
                <Box type="info" label="Información">Contexto adicional que ayuda pero no es indispensable.</Box>
                <Box type="tip" label="Recomendación">Una buena práctica o un atajo que conviene adoptar.</Box>
                <Box type="warn" label="Atención">Un punto donde suele cometerse un error.</Box>
                <Box type="danger" label="Riesgo financiero">Una equivocación con consecuencias monetarias reales.</Box>

                <CalloutPro tema="warn" titulo="Callout destacado" subtitulo="Para ideas que estructuran el capítulo" icon="fa-triangle-exclamation">
                    Se reserva para dos o tres ideas por capítulo, aquellas que el estudiante debe recordar aunque olvide el resto.
                </CalloutPro>

                <h3>Código en cuatro lenguajes</h3>
                <p>Este es el componente central del material. Cada bloque cambia de lenguaje <strong>por separado</strong>: la pestaña que se elija aquí no mueve la de los demás.</p>
                <CodeTabs
                    titulo="Interés simple sobre un crédito de libre inversión"
                    bloques={EJ_INTERES}
                    nota={<>Las líneas resaltadas que empiezan por <span className="inline-code">#&gt;</span> son la <strong>salida</strong>, no comentarios del autor. Las de Python y R están verificadas por ejecución; las de VBA, pendientes de correr en Excel.</>}
                />

                <p>
                    Este segundo bloque existe para hacer visible la independencia: al cambiar la pestaña en
                    cualquiera de los dos, <strong>el otro se queda como está</strong>. Es lo que permite leer el
                    pseudocódigo arriba y su traducción a VBA abajo, en la misma pantalla. Como un capítulo real
                    tiene hasta diez de estos bloques y cinco ejercicios, la última pestaña elegida queda
                    guardada y es con la que abren los bloques que aún no se han tocado: se elige el lenguaje
                    una vez, no quince.
                </p>
                <CodeTabs
                    titulo="Acumulador: ahorro programado de tres meses"
                    bloques={EJ_ACUMULADOR}
                />

                <h3>Bloque de un solo lenguaje</h3>
                <p>Cuando el ejemplo solo tiene sentido en un lenguaje (por ejemplo, algo propio del entorno de Excel):</p>
                <CodeBlock lang="vba" title="Propio del entorno de Excel" code={`Sub LeerCelda()
    ' Lo que sigue no tiene equivalente en pseudocódigo:
    ' depende del modelo de objetos de Excel.
    Dim saldo As Currency
    saldo = ThisWorkbook.Worksheets("Cartera").Range("B2").Value
    Debug.Print saldo
    '> 1250000
End Sub`} />

                <h3>Pestañas, acordeón y línea de tiempo</h3>
                <Tabs tabs={[
                    { label: 'Definición', content: <p style={{ margin: 0 }}>Un <strong>algoritmo</strong> es una secuencia finita, precisa y ordenada de pasos que resuelve un problema.</p> },
                    { label: 'Propiedades', content: <ul style={{ margin: 0 }}><li>Precisión</li><li>Finitud</li><li>Definición</li><li>Entrada y salida</li></ul> },
                    { label: 'En finanzas', content: <p style={{ margin: 0 }}>La liquidación de una cuota, la clasificación de un deudor o el cierre contable diario son algoritmos ejecutados millones de veces.</p> },
                ]} />

                <Accordion items={[
                    { titulo: '¿Cuándo usar un acordeón?', contenido: <p style={{ margin: 0 }}>Para contenido de consulta que no todos los estudiantes necesitan: profundizaciones, bibliografía, notas históricas.</p> },
                    { titulo: '¿Y cuándo NO?', contenido: <p style={{ margin: 0 }}>Cuando el contenido es indispensable. Si es necesario para entender lo que sigue, no debe estar escondido.</p> },
                ]} />

                <Timeline eventos={[
                    { year: '1936', text: 'Alan Turing formaliza la noción de cómputo mecánico.' },
                    { year: '1945', text: 'Von Neumann describe la arquitectura de programa almacenado que aún usan los computadores.' },
                    { year: '1993', text: 'Microsoft incorpora VBA a Excel: el cálculo financiero se vuelve programable por el propio analista.' },
                ]} />
            </div>
        );

        /* ============================================================
           SECCIÓN 2 — LOS OCHO TIPOS DE EJERCICIO

           Los ejercicios siguen la MISMA pestaña que la exposición. Cada
           propiedad que contenga código admite un objeto {pseudo, python,
           r, vba}; las que no dependen del lenguaje —los valores de las
           variables, los significados a emparejar— se dejan como valor único.
        ============================================================ */

        // --- E1: el algoritmo a trazar, en los cuatro lenguajes -----------
        const TRAZA_CODIGO = {
            pseudo: `1  capital <- 1000000
2  tasa    <- 0.02
3  interes <- capital * tasa
4  total   <- capital + interes
5  Escribir total`,
            python: `1  capital = 1000000
2  tasa    = 0.02
3  interes = capital * tasa
4  total   = capital + interes
5  print(total)`,
            r: `1  capital <- 1000000
2  tasa    <- 0.02
3  interes <- capital * tasa
4  total   <- capital + interes
5  cat(total)`,
            vba: `1  capital = 1000000
2  tasa = 0.02
3  interes = capital * tasa
4  total = capital + interes
5  Debug.Print total`,
        };

        const ins = (pseudo, python, r, vba) => ({ pseudo, python, r, vba });

        // --- E3: el mismo fallo, y OJO: en distinta línea en cada lenguaje --
        const ERROR_LINEAS = {
            pseudo: [
                'Inicio',
                '    // Interes mensual de un credito',
                '    Leer capital',
                '    tasa <- 18                  // tasa en PORCENTAJE',
                '    interes <- capital * tasa',
                '    Escribir "Interes: ", interes',
                'Fin',
            ],
            python: [
                '# Interes mensual de un credito',
                'capital = float(input("Capital: "))',
                'tasa = 18                  # tasa en PORCENTAJE',
                'interes = capital * tasa',
                'print("Interes:", interes)',
            ],
            r: [
                '# Interes mensual de un credito',
                'capital <- as.numeric(readline("Capital: "))',
                'tasa <- 18                 # tasa en PORCENTAJE',
                'interes <- capital * tasa',
                'cat("Interes:", interes)',
            ],
            vba: [
                'Sub InteresMensual()',
                "    ' Interes mensual de un credito",
                '    Dim capital As Currency, tasa As Double',
                '    Dim interes As Currency',
                '    capital = Range("B2").Value',
                "    tasa = 18                   ' tasa en PORCENTAJE",
                '    interes = capital * tasa',
                '    MsgBox "Interes: " & interes',
                'End Sub',
            ],
        };
        // El fallo está en la línea 5, 4, 4 y 7 respectivamente: por eso
        // `lineaCorrecta` NO puede ser un número único.
        const ERROR_LINEA_OK = { pseudo: 5, python: 4, r: 4, vba: 7 };

        // ...y por la misma razón la EXPLICACIÓN tampoco: cita el número de
        // línea y escribe la corrección, y la asignación no se escribe igual
        // en los cuatro (`<-` en pseudocódigo y R, `=` en Python y VBA).
        // El ENUNCIADO, en cambio, se redacta sin citar ninguna línea: así no
        // envejece si mañana se retoca el código. Comprobación 8 de
        // verificar.py.
        const ERROR_EXPLICACION = {
            pseudo: <>La <strong>línea 4</strong> es correcta: guarda lo que el usuario digitó, y el comentario advierte que está en porcentaje. El error está en la <strong>línea 5</strong>, que multiplica por <span className="inline-code">18</span> en lugar de por <span className="inline-code">0.18</span>. Debe ser <span className="inline-code">interes &lt;- capital * (tasa / 100)</span>.</>,
            python: <>La <strong>línea 3</strong> es correcta: guarda lo que el usuario digitó, y el comentario advierte que está en porcentaje. El error está en la <strong>línea 4</strong>, que multiplica por <span className="inline-code">18</span> en lugar de por <span className="inline-code">0.18</span>. Debe ser <span className="inline-code">interes = capital * (tasa / 100)</span>.</>,
            r: <>La <strong>línea 3</strong> es correcta: guarda lo que el usuario digitó, y el comentario advierte que está en porcentaje. El error está en la <strong>línea 4</strong>, que multiplica por <span className="inline-code">18</span> en lugar de por <span className="inline-code">0.18</span>. Debe ser <span className="inline-code">interes &lt;- capital * (tasa / 100)</span>.</>,
            vba: <>La <strong>línea 6</strong> es correcta: guarda lo que el usuario digitó, y el comentario advierte que está en porcentaje. El error está en la <strong>línea 7</strong>, que multiplica por <span className="inline-code">18</span> en lugar de por <span className="inline-code">0.18</span>. Debe ser <span className="inline-code">interes = capital * (tasa / 100)</span>.</>,
        };

        // --- E4: acumulador con contador definido vs. condición ------------
        const CMP_PARA = {
            pseudo: `saldo <- 0
Para mes <- 1 Hasta 12 Hacer
    saldo <- saldo + 200000
FinPara
Escribir saldo`,
            python: `saldo = 0
for mes in range(1, 13):
    saldo += 200_000
print(saldo)`,
            r: `saldo <- 0
for (mes in 1:12) {
  saldo <- saldo + 200000
}
cat(saldo)`,
            vba: `saldo = 0
For mes = 1 To 12
    saldo = saldo + 200000
Next mes
Debug.Print saldo`,
        };
        const CMP_MIENTRAS = {
            pseudo: `saldo <- 0
mes <- 1
Mientras mes <= 12 Hacer
    saldo <- saldo + 200000
    mes <- mes + 1
FinMientras
Escribir saldo`,
            python: `saldo = 0
mes = 1
while mes <= 12:
    saldo += 200_000
    mes += 1
print(saldo)`,
            r: `saldo <- 0
mes <- 1
while (mes <= 12) {
  saldo <- saldo + 200000
  mes <- mes + 1
}
cat(saldo)`,
            vba: `saldo = 0
mes = 1
Do While mes <= 12
    saldo = saldo + 200000
    mes = mes + 1
Loop
Debug.Print saldo`,
        };

        // --- E5 y E6 -------------------------------------------------------
        const ORDENA_PASOS = {
            pseudo: ['Inicio', 'Leer capital, tasa, plazo', 'interes <- capital * tasa * plazo',
                'total <- capital + interes', 'Escribir total', 'Fin'],
            python: ['capital = float(input("Capital: "))', 'tasa = float(input("Tasa: "))',
                'plazo = int(input("Plazo: "))', 'interes = capital * tasa * plazo',
                'total = capital + interes', 'print(total)'],
            r: ['capital <- as.numeric(readline("Capital: "))', 'tasa <- as.numeric(readline("Tasa: "))',
                'plazo <- as.integer(readline("Plazo: "))', 'interes <- capital * tasa * plazo',
                'total <- capital + interes', 'cat(total)'],
            vba: ['Sub Liquidar()', 'Dim interes As Currency, total As Currency',
                'interes = capital * tasa * plazo', 'total = capital + interes',
                'MsgBox total', 'End Sub'],
        };

        const EMPAREJA_IZQ = {
            pseudo: ['Leer capital', 'saldo <- saldo + cuota', 'Si mora > 90 Entonces', 'Mientras saldo > 0 Hacer'],
            python: ['capital = float(input())', 'saldo += cuota', 'if mora > 90:', 'while saldo > 0:'],
            r: ['capital <- as.numeric(readline())', 'saldo <- saldo + cuota', 'if (mora > 90) {', 'while (saldo > 0) {'],
            vba: ['capital = Range("B2").Value', 'saldo = saldo + cuota', 'If mora > 90 Then', 'Do While saldo > 0'],
        };


        const Seccion2 = () => (
            <div className="prose-lp">
                <Motivacion icon="fa-magnifying-glass-chart"
                    gancho="¿Cómo se entrena esa segunda habilidad, si escribir código desde cero no la desarrolla?">
                    Copiar un algoritmo de un libro y hacerlo correr está al alcance de cualquiera. Mirar el
                    código que escribió otro, decir qué va a hacer <em>antes</em> de ejecutarlo y explicar por
                    qué la cuota salió mal, no. En una entidad financiera lo primero se automatiza; lo segundo
                    es lo que se paga.
                </Motivacion>

                <p>
                    La taxonomía del curso tiene ocho tipos. Cada capítulo debe incluir al menos un <strong>E1</strong>,
                    un <strong>E3</strong> y un <strong>E7</strong>: son los que más empujan hacia la interpretación y la apropiación.
                </p>

                <h3>E1 · Prueba de escritorio</h3>
                <TablaTraza
                    titulo="Traza del interés simple"
                    enunciado={<>Complete el estado de las variables después de ejecutar cada instrucción. Escriba <span className="inline-code">—</span> donde la variable todavía no tenga valor.</>}
                    codigo={TRAZA_CODIGO}
                    columnas={[
                        { clave: 'paso', titulo: 'Paso' },
                        { clave: 'instruccion', titulo: 'Instrucción' },
                        { clave: 'capital', titulo: 'capital' },
                        { clave: 'tasa', titulo: 'tasa' },
                        { clave: 'interes', titulo: 'interes' },
                        { clave: 'total', titulo: 'total' },
                        { clave: 'salida', titulo: 'Salida' },
                    ]}
                    ocultas={['interes', 'total', 'salida']}
                    filas={[
                        { paso: 1, instruccion: ins('capital <- 1000000', 'capital = 1000000', 'capital <- 1000000', 'capital = 1000000'), capital: '1000000', tasa: '—', interes: '—', total: '—', salida: '—' },
                        { paso: 2, instruccion: ins('tasa <- 0.02', 'tasa = 0.02', 'tasa <- 0.02', 'tasa = 0.02'), capital: '1000000', tasa: '0.02', interes: '—', total: '—', salida: '—' },
                        { paso: 3, instruccion: ins('interes <- capital * tasa', 'interes = capital * tasa', 'interes <- capital * tasa', 'interes = capital * tasa'), capital: '1000000', tasa: '0.02', interes: '20000', total: '—', salida: '—' },
                        { paso: 4, instruccion: ins('total <- capital + interes', 'total = capital + interes', 'total <- capital + interes', 'total = capital + interes'), capital: '1000000', tasa: '0.02', interes: '20000', total: '1020000', salida: '—' },
                        { paso: 5, instruccion: ins('Escribir total', 'print(total)', 'cat(total)', 'Debug.Print total'), capital: '1000000', tasa: '0.02', interes: '20000', total: '1020000', salida: '1020000' },
                    ]}
                    pista="Una asignación solo modifica la variable de la izquierda. Las demás conservan el valor de la fila anterior."
                />

                <h3>E2 · Predice la salida</h3>
                <Ejercicio tipo="E2"><MCQ
                    pregunta="Si en el algoritmo anterior se intercambian las líneas 3 y 4, ¿qué imprime la línea 5?"
                    opciones={[
                        { texto: '1 020 000, igual que antes.', correcta: false },
                        { texto: '1 000 000, porque en la línea 4 la variable interes aún no tiene valor.', correcta: true, justificacion: 'Al ejecutarse total <- capital + interes antes de calcular interes, esa variable vale cero (o está indefinida). El total queda igual al capital: el interés se pierde. Es el error de orden más común en liquidaciones.' },
                        { texto: '20 000, el valor del interés.', correcta: false },
                        { texto: 'Un error de sintaxis: el programa no compila.', correcta: false },
                    ]}
                /></Ejercicio>

                <h3>E3 · Detecta y diagnostica</h3>
                <DetectaError
                    enunciado={<>El siguiente algoritmo debe calcular el interés mensual de un crédito. La tasa se digita <strong>en porcentaje</strong>, así lo advierte el comentario que acompaña a la asignación de <span className="inline-code">tasa</span>. <strong>¿En qué línea se realiza la operación incorrecta?</strong></>}
                    lineas={ERROR_LINEAS}
                    lineaCorrecta={ERROR_LINEA_OK}
                    tipos={[
                        'Error de sintaxis: falta una palabra clave o un delimitador.',
                        'Error de unidades: se opera con un porcentaje sin convertirlo a tasa decimal.',
                        'Error de tipo: se asigna una cadena a una variable numérica.',
                        'Error de alcance: la variable se usa fuera del bloque donde fue declarada.',
                    ]}
                    tipoCorrecto={1}
                    explicacion={ERROR_EXPLICACION}
                    impacto={<>Sobre un capital de $10 000 000 el algoritmo reporta un interés de <strong>$180 000 000</strong> en vez de <strong>$1 800 000</strong>: cien veces más. Si esa cifra alimenta una liquidación o un reporte de cartera, el error es inmediato y visible; si alimenta una provisión contable promediada entre miles de créditos, puede pasar inadvertido durante meses.</>}
                />

                <h3>E4 · Equivalencia y comparación</h3>
                <Comparador
                    enunciado="Ambas versiones acumulan el saldo de un ahorro programado durante 12 meses."
                    a={{ etiqueta: 'Versión A · Para', codigo: CMP_PARA }}
                    b={{ etiqueta: 'Versión B · Mientras', codigo: CMP_MIENTRAS }}
                    pregunta="¿Las dos versiones producen el mismo resultado?"
                    opciones={[
                        { texto: 'Sí: ambas ejecutan 12 iteraciones y escriben 2 400 000.', correcta: true, justificacion: 'Toda estructura Para puede reescribirse como Mientras. La diferencia es de legibilidad y de riesgo: en la versión B el incremento del contador es responsabilidad del programador, y omitirlo produce un ciclo infinito. Se prefiere Para cuando el número de repeticiones se conoce de antemano.' },
                        { texto: 'No: la versión B ejecuta 13 iteraciones.', correcta: false },
                        { texto: 'No: la versión A no permite acumular.', correcta: false },
                        { texto: 'Solo coinciden si el número de meses es par.', correcta: false },
                    ]}
                />

                <h3>E5 · Ordena los pasos</h3>
                <OrdenaPasos
                    enunciado="Reconstruya el algoritmo que liquida el total a pagar de un crédito con interés simple."
                    pasos={ORDENA_PASOS}
                    pista="Una variable no puede usarse antes de que se le haya asignado un valor."
                />

                <h3>E6 · Emparejamiento entre representaciones</h3>
                <Emparejamiento
                    enunciado="Relacione cada elemento del pseudocódigo con lo que representa en el flujo del programa."
                    etiquetaIzq="Elemento"
                    etiquetaDer="Significado"
                    izquierda={EMPAREJA_IZQ}
                    derecha={[
                        'Repite un bloque mientras se cumpla una condición.',
                        'Toma un dato del exterior y lo guarda en una variable.',
                        'Bifurca el flujo según se cumpla o no una condición.',
                        'Acumula: el nuevo valor depende del valor anterior.',
                    ]}
                    solucion={[1, 3, 2, 0]}
                />

                <h3>E7 · Interpretación financiera</h3>
                <Ejercicio tipo="E7"><MCQ
                    pregunta="Un algoritmo liquida un crédito de $10 000 000 a 12 meses y arroja un total a pagar de $12 160 000. ¿Qué se puede afirmar?"
                    opciones={[
                        { texto: 'El cliente pagará $2 160 000 por el uso del dinero, es decir un 21,6 % del capital durante el año.', correcta: true, justificacion: 'Interpretar no es recalcular: es traducir el número a una afirmación con sentido para el cliente o para el negocio. El costo del crédito es la diferencia entre lo que se recibe y lo que se devuelve, y expresarlo como porcentaje del capital lo hace comparable con otras alternativas.' },
                        { texto: 'La tasa mensual del crédito es del 21,6 %.', correcta: false },
                        { texto: 'El banco perdió dinero en la operación.', correcta: false },
                        { texto: 'No puede afirmarse nada sin conocer la inflación.', correcta: false },
                    ]}
                /></Ejercicio>

                <h3>E8 · Justifica la decisión de diseño</h3>
                <Ejercicio tipo="E8"><Reto
                    titulo="¿Por qué Para y no Mientras?"
                    solucion={<Box type="tip" label="Criterio profesional">
                        Se usa <strong>Para</strong> cuando el número de repeticiones se conoce antes de entrar al ciclo (las 12 cuotas de un
                        crédito, las 24 celdas de una fila). Se usa <strong>Mientras</strong> cuando la repetición depende de una condición que
                        cambia dentro del ciclo y no se sabe de antemano cuántas vueltas dará (amortizar hasta que el saldo llegue a cero,
                        iterar hasta que la TIR converja). El criterio no es estético: con <strong>Para</strong>, el compilador administra el
                        contador y el ciclo infinito es imposible; con <strong>Mientras</strong>, esa responsabilidad es del programador.
                    </Box>}>
                    Un analista debe recorrer las 12 cuotas de un crédito. Otro debe amortizar un saldo hasta que llegue a cero,
                    sin saber cuántas cuotas tomará. ¿Qué estructura repetitiva conviene a cada uno y por qué?
                </Reto></Ejercicio>
            </div>
        );

        /* ============================================================
           SECCIÓN 3 — GRÁFICAS, MATEMÁTICAS Y DATOS
        ============================================================ */
        const SaldoChart = () => {
            const [cuota, setCuota] = useState(900000);
            usePlotly('chart-demo-saldo', () => {
                const capital = 10000000, i = 0.018;
                const meses = [], saldos = [];
                let s = capital;
                for (let m = 0; m <= 12; m++) {
                    meses.push(m); saldos.push(Math.max(0, s));
                    s = s * (1 + i) - cuota;
                }
                return [{
                    x: meses, y: saldos, type: 'scatter', mode: 'lines+markers',
                    line: { color: '#3D008D', width: 3 }, marker: { color: '#ED1E79', size: 7 },
                    fill: 'tozeroy', fillcolor: 'rgba(61,0,141,0.07)',
                    hovertemplate: 'Mes %{x}: %{y:,.0f} COP<extra>Saldo</extra>',
                }];
            }, () => ({
                margin: { t: 10, r: 10, b: 40, l: 70 },
                xaxis: { title: 'Mes', gridcolor: '#eee', dtick: 1 },
                yaxis: { title: 'Saldo (COP)', gridcolor: '#eee', rangemode: 'tozero' },
                paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
            }), [cuota]);

            return (
                <div className="my-4">
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-2">
                        <label className="block text-sm font-semibold text-navy mb-1">
                            Cuota mensual: <span className="text-secondary font-mono">${cuota.toLocaleString('es-CO')}</span>
                        </label>
                        <input type="range" min="500000" max="1500000" step="50000" value={cuota}
                            onChange={e => setCuota(Number(e.target.value))} className="tr-range"
                            aria-label="Cuota mensual del crédito" />
                    </div>
                    <ChartFrame id="chart-demo-saldo" height="chart-h-360"
                        caption="Saldo de un crédito de $10 000 000 al 1,8 % mensual. Con una cuota baja el saldo casi no baja: los intereses se comen el abono." />
                </div>
            );
        };

        const Seccion3 = () => (
            <div className="prose-lp">
                <Motivacion icon="fa-chart-line"
                    gancho="Un número solo no significa nada: significa algo cuando se puede comparar.">
                    «$12 160 000» no es bueno ni malo. Puesto al lado de lo que el cliente recibió, se vuelve
                    un costo; puesto sobre la curva del saldo mes a mes, muestra si la cuota alcanza a bajar
                    la deuda o apenas paga intereses; puesto junto a otro crédito, se vuelve una decisión.
                </Motivacion>

                <h3>Fórmulas con MathJax</h3>
                <p>El interés compuesto se escribe en línea como \\( M = C(1+i)^n \\), y de forma destacada:</p>
                <Eq>{'$$ M = C\\,(1+i)^{n} \\qquad\\text{y}\\qquad i_{ea} = \\left(1 + \\frac{j}{m}\\right)^{m} - 1 $$'}</Eq>

                <h3>Gráfica interactiva (Plotly)</h3>
                <p>Las gráficas se reservan para los capítulos donde aportan; en el resto se prefiere SVG propio, más liviano.</p>
                <SaldoChart />

                <h3>Tablas</h3>
                <div className="overflow-x-auto">
                    <table>
                        <thead><tr><th>Tipo</th><th>Nombre</th><th>Componente</th><th>Obligatorio</th></tr></thead>
                        <tbody>
                            <tr><td>E1</td><td>Prueba de escritorio</td><td><span className="inline-code">TablaTraza</span></td><td>Sí</td></tr>
                            <tr><td>E2</td><td>Predice la salida</td><td><span className="inline-code">MCQ</span></td><td>No</td></tr>
                            <tr><td>E3</td><td>Detecta y diagnostica</td><td><span className="inline-code">DetectaError</span></td><td>Sí</td></tr>
                            <tr><td>E4</td><td>Equivalencia</td><td><span className="inline-code">Comparador</span></td><td>No</td></tr>
                            <tr><td>E5</td><td>Ordena los pasos</td><td><span className="inline-code">OrdenaPasos</span></td><td>No</td></tr>
                            <tr><td>E6</td><td>Emparejamiento</td><td><span className="inline-code">Emparejamiento</span></td><td>No</td></tr>
                            <tr><td>E7</td><td>Interpretación financiera</td><td><span className="inline-code">MCQ</span> / <span className="inline-code">Reto</span></td><td>Sí</td></tr>
                            <tr><td>E8</td><td>Justifica el diseño</td><td><span className="inline-code">Reto</span></td><td>No</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );

        /* ============================================================
           EVALUACIÓN Y GLOSARIO
        ============================================================ */
        const GLOSARIO = [
            ['Algoritmo', 'Secuencia finita, precisa y ordenada de pasos que resuelve un problema.'],
            ['Pseudocódigo', 'Notación intermedia entre el lenguaje natural y un lenguaje de programación. Es el lenguaje normativo del curso.'],
            ['Prueba de escritorio', 'Ejecución manual de un algoritmo, anotando el valor de cada variable paso a paso.'],
            ['Variable', 'Espacio de memoria con nombre cuyo contenido puede cambiar durante la ejecución.'],
            ['Asignación', 'Operación que guarda un valor en una variable. No es una igualdad matemática: x <- x + 1 es válido.'],
            ['Acumulador', 'Variable que conserva un total parcial y se actualiza en cada iteración.'],
        ];

        const EvaluacionSection = () => (
            <div className="prose-lp">
                <Motivacion icon="fa-flag-checkered" etiqueta="Antes de responder"
                    gancho="Equivocarse aquí es barato. En el parcial cuesta una nota; en producción, dinero de alguien.">
                    La tentación es mirar la respuesta, reconocerla y seguir: «claro, eso ya lo sabía». Es
                    también la manera más rápida de salir del capítulo creyendo que se entendió algo que no.
                    Un error propio, cometido antes de ver la clave, enseña más que diez respuestas correctas leídas.
                </Motivacion>

                <Box type="info" label="Cómo aprovechar esta evaluación">
                    Integra todo el capítulo. Conviene responder <em>antes</em> de ver las soluciones: el cuestionario
                    tiene puntuación automática y admite reintentos.
                </Box>

                <h3>Cuestionario integrador</h3>
                <Quiz titulo="Evaluación · Plantilla base" preguntas={[
                    {
                        pregunta: 'En el material, ¿cuál es el lenguaje normativo, es decir, el que se evalúa?',
                        opciones: [
                            { texto: 'VBA, porque es el que usa el sector financiero.', correcta: false },
                            { texto: 'El pseudocódigo, porque expresa la lógica sin atarla a una herramienta.', correcta: true },
                            { texto: 'Python, por ser el más legible.', correcta: false },
                            { texto: 'R, por el perfil cuantitativo del programa.', correcta: false },
                        ],
                        justificacion: 'El RA1 del syllabus evalúa la construcción de algoritmos, no el dominio de un lenguaje. Los otros tres son traducciones que muestran que la lógica es invariante.',
                    },
                    {
                        pregunta: 'La instrucción saldo <- saldo + cuota es incorrecta porque una variable no puede aparecer a ambos lados. (Verdadero/Falso)',
                        opciones: [{ texto: 'Verdadero', correcta: false }, { texto: 'Falso', correcta: true }],
                        justificacion: 'Falso. La asignación no es una ecuación: primero se evalúa la expresión de la derecha con el valor actual de saldo y luego el resultado se guarda en saldo. Es el patrón del acumulador.',
                    },
                    {
                        pregunta: '¿Qué tipos de ejercicio son obligatorios en cada capítulo? (selección múltiple)',
                        multiple: true,
                        opciones: [
                            { texto: 'E1 · Prueba de escritorio', correcta: true },
                            { texto: 'E3 · Detecta y diagnostica', correcta: true },
                            { texto: 'E5 · Ordena los pasos', correcta: false },
                            { texto: 'E7 · Interpretación financiera', correcta: true },
                        ],
                        justificacion: 'E1, E3 y E7 son los que más empujan hacia la interpretación y la apropiación: ejecutar mentalmente, diagnosticar y traducir el resultado al negocio.',
                    },
                ]} />

                <h3>Glosario</h3>
                <div className="grid md:grid-cols-2 gap-2">
                    {GLOSARIO.map(([t, d], i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white">
                            <span className="font-bold text-primary text-sm">{t}</span>
                            <p className="text-xs text-gray-600 mt-0.5" style={{ margin: '2px 0 0' }}>{d}</p>
                        </div>
                    ))}
                </div>

                <h3>Recursos</h3>
                <Accordion items={[
                    {
                        titulo: 'Bibliografía base del syllabus', contenido: <ul className="text-sm">
                            <li>Joyanes Aguilar, L. (2003). <em>Fundamentos de programación: algoritmos, estructuras de datos y objetos</em>. McGraw-Hill.</li>
                            <li>Cairo, O. (2008). <em>Metodología de la programación: algoritmos, diagramas de flujo y programas</em>. Alfaomega.</li>
                            <li>Oviedo, E. (2005). <em>Lógica de programación</em>. ECOE Ediciones.</li>
                            <li>Walkenbach, J. <em>Excel Power Programming with VBA</em>. Wiley.</li>
                            <li>Roman, S. (2002). <em>Writing Excel Macros with VBA</em>. O'Reilly.</li>
                        </ul>
                    },
                ]} />
            </div>
        );

        /* ============================================================
           CURRÍCULO
        ============================================================ */
        const curriculum = [
            { id: 'portada', title: 'Portada y objetivos', icon: 'BookOpen', component: PortadaSection },
            { id: 'sec1', title: '1. Componentes de contenido', icon: 'Layers', component: Seccion1 },
            { id: 'sec2', title: '2. Los ocho tipos de ejercicio', icon: 'Bug', component: Seccion2 },
            { id: 'sec3', title: '3. Gráficas, fórmulas y datos', icon: 'Table', component: Seccion3 },
            { id: 'eval', title: 'Evaluación y glosario', icon: 'Award', component: EvaluacionSection },
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
                                Lógica de Programación Financiera
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
                            <p>{CONFIG.ra} · {CONFIG.horas} horas</p>
                            <p>Pseudocódigo · Python · R · VBA</p>
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

                                <div className="animate-fade-in" key={activeLesson.id}>
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
                                            La lógica es la misma; el lenguaje solo cambia de acento.
                                        </p>
                                        <p className="text-xs mt-2 text-white/70">
                                            Universidad Santo Tomás · Lógica de Programación Financiera
                                        </p>
                                        <p className="text-xs text-white/70">
                                            Docente y diseño del material: {CONFIG.docente}
                                        </p>
                                        <p className="text-[10px] mt-2 text-white/50">
                                            Material de aprendizaje autónomo. Casos contextualizados al sector financiero colombiano.
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
