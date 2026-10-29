# Galería y dirección visual

Fondo carbón, texto marfil y acentos rosa vino. Tema compartido con login y reseñas. Las familias tipográficas siguen siendo provisionales: cambiar --type-display y --type-body en app/globals.css.

## Galería

Cuatro imágenes originales generadas con ImageGen, identificadas como muestras. Filtros de Tattoos, Cuadros y Fotografía; Cuadros incluye Óleo y Carboncillo. Cada imagen abre un visor con descripción, serie, técnica, soporte, año y dimensiones. Admite anterior/siguiente, flechas, Escape, cierre por fondo, bloqueo de scroll y restitución de foco.

Los datos se editan en lib/gallery.ts y los archivos están en public/images/gallery/. Reemplazar imágenes y atributos juntos cuando se reciban las obras reales. Los prompts exactos están en docs/gallery-assets.md. La galería usa datos locales: todavía no hay edición administrativa ni Storage para estas obras.

## Melanie Castro

Información verificada en https://melaniecv.carrd.co/ el 22 de octubre de 2026: nombre, presentación, correo público, disciplinas y siete títulos con sus enlaces a imágenes originales. Se incorpora en lib/artists.ts, en la portada y en /artistas/melanie-castro.

No se han supuesto precios, medidas ni disponibilidad actual. Las imágenes originales permanecen en el sitio de origen. Las muestras generadas no se atribuyen a Melanie. Los botones de Instagram, TikTok y portafolio digital tenían destinos #; el correo sí tenía destino verificable.

Cambio local, sin despliegue ni modificaciones a Supabase.

## Galería secuencial · 29 de octubre de 2026
La galería pública sustituye el popup por una secuencia vertical con scroll nativo. En escritorio, una ficha sticky a la izquierda sigue la obra más cercana al centro de la pantalla; anterior/siguiente desplazan la página sin bucle. En móvil, cada imagen incluye su propia ficha y la navegación permanece visible. Se conservan filtros por categoría y técnica, imágenes completas sin recorte y etiquetas de datos provisionales. Se respeta movimiento reducido. Verificado en navegador: avance, scroll, filtros y ausencia de desbordamiento horizontal a 390 px; ESLint del componente y TypeScript pasan.

### Ajuste de recorrido · imagen y ficha como unidad
Cada artículo contiene ahora su imagen a la izquierda y su ficha propia a la derecha, ambas en flujo normal. Se retiraron el panel sticky y la selección automática por centro de pantalla. Los botones navegan al inicio del artículo vecino; en móvil imagen y datos se apilan dentro del mismo artículo. Esta disposición sustituye la ficha compartida descrita arriba. TypeScript y ESLint del componente pasan; verificados navegación y layout móvil sin desbordamiento horizontal.

### Dos vistas para visitantes
Selector «Una obra a la vez» (inicial) y «Lista completa». La vista individual usa un contenedor con scroll nativo y ajuste por obra (CSS scroll snap), sin capturar la rueda ni bloquear el scroll de la página. Los botones desplazan solo el contenedor en este modo. En móvil, las fichas largas pueden recorrerse antes de llegar a la siguiente obra. Cambiar filtros o vista reinicia el recorrido. No persiste la preferencia entre visitas. Estilos de las vistas en components/gallery-views.css.

### Vista individual como baraja
«Una obra a la vez» renderiza únicamente la pieza seleccionada y cambia imagen y ficha juntas mediante rueda, botones o flechas al enfocar la región. Umbral y pausa breve evitan saltos múltiples por inercia. En móvil admite gesto vertical sobre la imagen y botones; el texto largo puede recorrerse dentro de su ficha. En los extremos permite continuar por la página. «Lista completa» conserva el anterior contenedor con scroll y ajuste por obra. Verificado en navegador: rueda cambia de obra manteniendo scrollY y solo un artículo; lista renderiza cuatro artículos con scroll snap.

## Mejoras de legibilidad y accesibilidad aprobadas
Respaldo previo verificado en .backups/antes-mejoras-ux-20261029/estado-anterior.zip con manifest SHA-256 e instrucciones RESTAURAR.md. Los controles de la baraja son persistentes y quedan fuera del artículo reemplazado: conservan el foco incluso al llegar al extremo mediante aria-disabled. Región de estado anuncia título y posición sin trasladar el foco. Navegación y filtros usan texto de 13 px y objetivos de al menos 44 px; las categorías envuelven en varias filas. Descripción móvil de 16 px y atributos de 14 px. Controles inferiores en una fila propia, sin tapar el contenido desplazable, e indicación de lectura en móvil. Se conserva barra oculta en baraja y visible en lista, ambos modos, técnicas, categorías, estilo y fuentes provisionales.
Verificación en navegador: foco al avanzar hasta última obra, categoría y técnica Carboncillo, barra visible en lista, sin overflow horizontal a 320 y 390 px. PRODUCT.md actualizado al comportamiento actual. No hay cambios de comercio ni servicios.
Validación final de esta entrega: npm run typecheck, ESLint de components/artwork-gallery.tsx y npm run build completos sin errores. Compilación de producción genera correctamente las rutas existentes.

## Rediseño de navbar y categorías con ui-ux-pro-max
Respaldo previo independiente: .backups/antes-rediseno-navbar-filtros-20261029/estado-anterior.zip y manifest SHA-256. Navegación editorial con subrayado; menú móvil desplegable en flujo normal, con aria-expanded/aria-controls, cierre por Escape y retorno del foco al botón. Categorías antes del selector de vista, sin recuadros; selección por texto y subrayado. Filtros de 14 px y 48 px de alto, dos columnas a anchos pequeños, sin truncar etiquetas. Selector de vista visualmente secundario; mayor proporción del área para la imagen en escritorio y ficha móvil legible conservada. No cambia contenido ni funciones de la galería.
Verificado: menú abrir/cerrar por teclado, filtros y técnica Carboncillo, cambio de obra, 320/390 px sin overflow horizontal, ESLint de componentes y TypeScript.
