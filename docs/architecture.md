# Arquitectura actual

## Actualización visual del 22 de octubre de 2026

La portada ahora es una galería oscura con filtros de categoría y técnica y un visor nativo de atributos. Los datos de obras siguen siendo locales y de muestra. /artistas/melanie-castro incorpora información pública y enlaces originales verificados. La tipografía se configura por variables CSS. Ver docs/gallery-design.md y docs/gallery-assets.md. Esto no sustituye el módulo editorial ni implica integración nueva con Storage.

## Aplicación

Monolito Next.js App Router + TypeScript estricto + Tailwind. Zod valida cliente y servidor; React Hook Form controla los formularios. Supabase aporta Auth, PostgreSQL y sesiones SSR con cookies.

El sitio público permanece independiente de la sesión. /resenas obtiene datos paginados desde endpoints sin caché; /login maneja acceso y registro. /admin usa identidad verificada en servidor y autorización consultada en base de datos. Proxy renueva sesiones en rutas de datos y administración. No se usa getSession como prueba de identidad.

La caché optativa de componentes del starter se deshabilitó para mantener sencillas las rutas con cookies. La portada y la página de reseñas pueden seguir prerenderizándose; los endpoints y el acceso administrativo son dinámicos.

## Comunidad añadida

Reseñas públicas independientes de publications: title, subject, body y autor. Cada reseña admite comentarios. Los aportes se publican inmediatamente; el autor o un administrador pueden eliminarlos. No hay edición ni aprobación previa en esta entrega.

Tablas reviews, comments y admin_users. La membresía administrativa solo se modifica con permisos de propietario. La función is_admin tiene search_path vacío y no acepta parámetros. RLS protege las escrituras directas a la Data API además de las comprobaciones de la aplicación.

Los UUID de envío evitan duplicados. Las columnas created_at no son insertables por participantes. Hay límites de tamaño, restricciones SQL, límites básicos por hora y cascada de comentarios. La UI confirma eliminaciones. El contenido se muestra como texto, sin HTML arbitrario.

## Sesión

POST /api/auth inicia y cierra sesión o crea una cuenta normal. /auth/confirm verifica token_hash de tipo email o code PKCE. Los errores de acceso son genéricos. Las escrituras requieren Origin del propio sitio y cuerpos JSON limitados. La aplicación usa únicamente la clave publicable y RLS, sin claves privilegiadas.

## Rutas implementadas

/, /login, /resenas y /admin, más /api/auth, /api/session, /api/reviews, /api/reviews/[id], /api/reviews/[id]/comments, /api/comments/[id] y /auth/confirm.

## Alcance editorial futuro

Pendientes /explorar, /publicaciones/[slug], /sobre-nosotros y /contacto, además del CRUD editorial de administrador.

Las tablas categories, publications y publication_media, Storage y sus políticas se crearán en una migración posterior. Se limitará lectura pública a publicaciones published. Los archivos de borradores requerirán decidir si necesitan bucket privado; un bucket público hace accesibles sus URLs.

El editor textual seguro, las validaciones de archivos, las incrustaciones YouTube/Spotify y las operaciones editoriales atómicas siguen pendientes. No hay comercio electrónico.

## Referencias y verificación

Chubascos (dashboard e inicio) y Carrd no fueron accesibles mediante la herramienta de consulta; no se afirman funciones observadas. Se consultó la estructura textual de https://sontagmag.com/ en la fase inicial. No se copiaron activos ni código.

Fuentes técnicas: https://nextjs.org/docs/app/getting-started/installation y https://supabase.com/docs/guides/auth/server-side/creating-a-client. Se revisaron las guías locales de Next.js de rutas, Proxy, autenticación y caché incluidas con la versión instalada.

Configuración y limitaciones de pruebas reales en docs/community.md.

