# Política de fuentes del material

Vigente desde el 2026-11-11, adaptada de la del curso hermano, Lógica de Programación
Financiera (2026-11-10). Aplica a los quince capítulos, a los talleres y a todo lo que se
publique con ellos. Su propósito es uno: que **cada afirmación del material pueda rastrearse** hasta
una fuente leída, una ejecución, una cuenta a la vista o una declaración expresa de que
el dato es inventado.

## 1. Las cinco clases de afirmación

Toda afirmación fáctica del material pertenece a una de estas clases. La clase se
registra; no se supone.

| Clase | Qué es | Cómo se ve en el HTML |
|---|---|---|
| **Citada** | Depende de una fuente externa: una fecha, una definición atribuida, una cifra del sector, una norma, el comportamiento documentado de un lenguaje. | `<Cita k="clave" loc="p. 12"/>` junto a la afirmación. |
| **Ejecutada** | Es la salida de un programa. | La salida está en su bloque y pasó la regla 9 de `verificar.py`. |
| **Derivada** | Sale de una cuenta que el propio texto muestra. | La aritmética está a la vista y cuadra. |
| **Ilustrativa** | Caso, cifra o regla de negocio inventados para enseñar. | `<Ilustrativo>` o `<Fuente ilustrativo/>`; el texto no los presenta como reales. |
| **Criterio del docente** | Recomendación u opinión profesional. | Redactada como tal («conviene», «en este curso»), no como hecho. |

Lo que no cabe en ninguna clase **se reescribe o se quita**. Una frase como «la mayoría
de los bancos…» o «el error más común…» es una afirmación sobre el mundo: o se respalda,
o se convierte en criterio del docente, o se va.

## 2. Qué cuenta como fuente

En este orden de preferencia:

1. **Estándares, normas y datos oficiales.** El estándar o la norma misma, y la entidad
   que produce el dato: la que expide la norma, certifica la tasa o publica la serie.
2. **Documentación oficial de los lenguajes y las librerías** (Python, R, QuantLib, `arch`, `rugarch`…), con versión y fecha de
   consulta.
3. **Libros de texto y artículos.** Primero los de acceso abierto y los del syllabus de
   los que haya ejemplar o PDF.
4. **La institución dueña del dato**, cuando la afirmación es sobre ella.

**No respaldan una afirmación**: Wikipedia, blogs, foros, sitios de tutoriales, videos,
salidas de un modelo de IA ni lo que un modelo «recuerda». Pueden ayudar a encontrar la
fuente y pueden recomendarse para practicar, en una lista aparte («Para practicar») y sin
atribuirles nada.

## 3. Cuándo se puede citar

Una fuente pasa por tres niveles:

| Nivel | Condición |
|---|---|
| `metadatos` | Su identificador (DOI, ISBN o URL oficial) resuelve y los datos bibliográficos se copiaron de ahí. |
| `leida` | Alguien leyó el pasaje pertinente y lo dejó copiado, con página o sección, en el registro privado. |
| `confirmada` | El docente cotejó el pasaje. |

**Solo se cita una fuente en nivel `leida` o superior.** Una fuente a la que no se tuvo
acceso puede figurar como lectura recomendada, en la lista «Para profundizar» del
capítulo, pero no se le atribuye ninguna afirmación concreta.

Cada cita lleva **localizador**: página, sección o artículo. «Según Hull» sin página
no es una cita verificable.

**Dónde va la cita.** La cita respalda lo que está **antes de ella dentro de su oración**,
y nada más. Lo que el material añade por su cuenta —una recomendación, una regla, lo que
muestra una salida ejecutada— va después de la cita o en otra oración. Así no se le
atribuye a una fuente lo que no dice: «Con rendimientos independientes, la varianza crece
en proporción al horizonte (cita). Por eso, antes de escalar una volatilidad por √T,
mida la razón de varianzas del panel», y no al revés.

**Varias fuentes para una frase.** Cuando una frase habla de varias fuentes a la vez —«Python
y R…», «Basilea y la Superintendencia…»—, lleva una cita por fuente, seguidas, y cada una respalda su parte.

**La fuente manda sobre la frase.** Si el pasaje dice menos que la afirmación, se cambia
la afirmación, no se estira el pasaje. Una cifra, un «siempre», un «más lento» o una
consecuencia práctica que el pasaje no trae necesitan otra fuente, una ejecución o
redactarse como criterio del docente.

## 4. De dónde sale la lista de referencias

- La biblioteca del curso está en Zotero. Una referencia solo existe si está allí.
- `Material html/_fuentes/referencias.json` es la exportación de esa biblioteca.
- La lista «Referencias» de cada capítulo la genera `estampar_referencias.py` en
  APA 7, solo con las obras citadas en ese capítulo. **Nunca se escribe a mano.**
- «Para profundizar» lista las obras que el capítulo recomienda y no cita. Se declara
  con `<ParaProfundizar k="clave; otra" />` y la genera el mismo guion, también en
  APA 7. Una obra no puede estar en las dos listas, y también necesita identificador.
- Una URL lleva fecha de consulta. Una norma lleva número, año y entidad que la expide.
- Un dato de una página sin fecha se presenta con su fecha de consulta: «según su
  página, consultada el…», no «a tal fecha».

## 5. Datos, cifras y figuras

- Toda figura lleva pie con su procedencia: una fuente citada, «elaboración propia» o
  «elaboración propia con datos ilustrativos».
- Una cifra del mundo real lleva fuente **y fecha**: las tasas, los topes y las tarifas
  cambian. Si la cifra va a envejecer, el texto dice a qué fecha corresponde y dónde se
  consulta el valor vigente.
- Una cifra inventada para un ejercicio debe ser verosímil y declararse ilustrativa
  cuando pueda confundirse con un dato real (una tarifa, una tasa, un tope legal).
- **Los datos del curso se documentan en `datos/MANIFIESTO.md`**, no con una cita en
  cada figura: allí están la fuente, la fecha de descarga, el SHA-256 y los defectos
  conocidos de cada instantánea congelada (`bvc_diario.csv`, `curva_tes.csv`,
  `sen_tes_dic2025.csv`…). Una figura hecha con ellos declara `fuente={{ propia: true }}`
  y el pie o el texto nombra el archivo. Lo que se diga de la serie que el manifiesto no
  respalde —su convención, su cobertura, un defecto nuevo— se añade antes al manifiesto.
- **La convención de un dato se comprueba contra precios, no contra un documento.** Si
  una serie no declara su capitalización, su base de días o su liquidación, se valora con
  ella algo que tenga precio de mercado y se mide cuál lectura lo reproduce; la ficha o
  el artículo que la describe son evidencia débil y se citan después, como confirmación.
  El capítulo 9 leyó la curva del Banco de la República en continua por un documento de
  2002, y los precios del SEN decían efectiva anual.
- **Una norma se cita en su texto vigente, contrastado el día de la cita.** El nombre o
  el número que traiga un capítulo viejo, un libro o un modelo de IA no basta: hay que
  abrir el texto oficial y comprobar que la norma sigue en pie y dónde quedó. Ejemplo
  del curso: la Circular Básica Contable y Financiera fue **sustituida por la Circular
  Básica Financiera** (Circular Externa 004 de 2026), desde el 1 de junio de 2026, y el
  SARM y el SARL ya habían pasado al SIAR (Circular Externa 018 de 2021). Citar el
  «Capítulo XXI» de la circular vieja como vigente es un error, aunque el número esté
  bien copiado. La cita de una norma lleva su número, su año, la entidad que la expide,
  el artículo o numeral (`loc`) y la fecha de consulta; en una `FichaNorma` va con `k` y
  `loc`.

## 6. Lo que revisa la máquina y lo que no

`verificar.py` comprueba que toda clave citada exista (regla 18), que la lista
corresponda exactamente a lo citado (19), que el bloque estampado esté al día (20), que
cada referencia tenga identificador (21) y que cada cita tenga su fila en el registro de
afirmaciones (23). Avisa, sin fallar, de la figura que no dice de dónde salen sus datos
(22) y de la entidad o la norma nombrada sin cita (24).

No puede comprobar que el pasaje diga lo que el material le atribuye. Eso lo hace una
lectura independiente: quien verifica recibe la afirmación y el pasaje, no el borrador
ni el razonamiento de quien escribió. Una frase que el verificador marca «parcial» se
corrige y se vuelve a leer; antes de cerrar un capítulo se leen todas sus citas de una
vez, sobre el texto final.

## 7. Registro

- **Privado** (vault): una nota por afirmación, con el texto del material, el extracto
  de la fuente, el juicio y la acción.
- **Público** (`Material html/_fuentes/afirmaciones/NN.yaml`): una fila por cita, con el
  identificador, el ancla literal en el HTML, la clave, el localizador, quién y cuándo
  la leyó y la huella del extracto. No lleva el texto del extracto.
