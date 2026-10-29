# UnnaturalOrbit

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- Visitantes que buscan descubrir obras, artistas y proyectos culturales, sin necesidad de registrarse.
- Personas que quieren conocer el trabajo de un artista y contactar para consultar una idea.
- Participantes con cuenta que comparten reseñas y comentan aportes de la comunidad.
- Una persona administradora que gestiona y modera contenido desde un espacio privado.

## Product Purpose

UnnaturalOrbit es una plataforma independiente de promoción cultural y artística. Acerca proyectos, publicaciones, ideas y expresiones creativas a sus públicos. Debe permitir descubrir obras, conocer sus atributos, explorar artistas, encontrar sus canales de contacto y participar en conversaciones culturales.

El usuario confirmó este alcance durante la inicialización de Impeccable: navegación pública, contacto con artistas, reseñas y comentarios con cuenta y administración privada. No hay tienda ni pagos en el MVP.

## Operating Context

- Web adaptable a computadora y dispositivos móviles, con contenido e interfaz principal en español.
- Descubrimiento mediante galería, categorías y técnicas. Dos vistas: una obra a la vez (baraja que sustituye imagen y ficha juntas) y lista completa (scroll con ajuste por obra).
- Perfiles artísticos y contacto mediante los canales publicados por cada artista.
- La lectura pública no requiere cuenta. Escribir reseñas o comentarios requiere autenticación; las acciones administrativas requieren autorización.
- Proyecto Next.js App Router con TypeScript estricto y Tailwind. Supabase es la integración prevista para PostgreSQL, Auth y Storage; Zod y React Hook Form validan los formularios.
- Las conversaciones educativas sobre AWS, Kubernetes, pipelines y comercialización no autorizan cambios de infraestructura ni amplían el producto.

## Capabilities and Constraints

### Implementado en el repositorio

- Portada con cuatro obras de muestra, filtros de categoría y técnica y fichas de atributos junto a la imagen.
- Perfil de Melanie Castro con datos públicos importados y siete enlaces a diseños originales.
- Interfaces de login, registro, reseñas, comentarios y moderación administrativa; endpoints y migración de permisos.

### Pendiente o sin verificar contra servicios reales

- Supabase todavía no está conectado: autenticación real, confirmación por correo, persistencia y políticas SQL requieren configuración y pruebas de integración.
- El módulo editorial de publicaciones, borradores, carga de portadas y galerías, Storage e incrustaciones multimedia sigue pendiente.
- La galería actual se alimenta de archivos y datos locales; no tiene editor administrativo de obras.
- No se ha realizado un despliegue de producción. La plataforma de despliegue solicitada inicialmente es Vercel; las alternativas discutidas no implican una migración acordada.
- No ejecutar despliegues de producción ni operaciones destructivas sobre datos existentes sin confirmación.

### Decisiones abiertas

- Tipografía definitiva y contenido artístico final.
- Dominio propio, servicios contratados y condiciones de entrega comercial.
- Comercio electrónico solo como posibilidad futura, fuera de este MVP.

## Brand Commitments

- Conservar el nombre UnnaturalOrbit y su propósito cultural y artístico independiente.
- El usuario pidió una identidad editorial, minimalista, contemporánea, oscura, algo melancólica y artística. Este compromiso se preserva; init no redefine su ejecución visual.
- La tipografía permanece provisional por decisión del usuario.
- Las referencias se utilizan para comprender navegación y experiencia. No copiar identidad, textos o imágenes de terceros sin autorización.
- El usuario autorizó incorporar los datos públicos de Melanie Castro. Las imágenes generadas no deben atribuirse a Melanie ni presentarse como sus obras reales.

## Evidence on Hand

- `lib/gallery.ts`: obras de muestra y atributos de ejemplo.
- `public/images/gallery/`: cuatro imágenes originales generadas para explorar el diseño; pendientes de reemplazo por contenido aprobado.
- `docs/gallery-assets.md`: procedencia y prompts de esas imágenes.
- `lib/artists.ts`: datos de Melanie Castro importados de su portafolio público; fuente y alcance documentados en `docs/gallery-design.md`.
- `docs/community.md` y `supabase/migrations/`: configuración y permisos preparados, todavía sin verificar en un proyecto Supabase real.
- `README.md`, `docs/architecture.md` y `docs/validation.md`: estado técnico e historial de comprobaciones. No confundir comprobaciones históricas con una nueva verificación.
- No inventar biografías, disponibilidad, precios, dimensiones reales, testimonios ni métricas. Los atributos ilustrativos deben seguir identificados como ejemplos.

## Product Principles

1. Facilitar el descubrimiento público de obras y artistas antes de pedir registro.
2. Dar contexto a cada obra y facilitar el contacto mediante datos verificables.
3. Reservar la cuenta para participar y comprobar permisos en servidor y base de datos.
4. Distinguir claramente contenido real, material provisional y funcionalidades pendientes.
5. Desarrollar de forma incremental, sin introducir comercio ni infraestructura que no haya sido solicitada.

## Accessibility & Inclusion

Accesibilidad básica como requisito original: contraste suficiente, lectura legible, navegación por teclado, etiquetas claras, textos alternativos y adaptación responsive. La galería debe conservar el foco al cambiar de obra, anunciar el título y posición, y ofrecer botones como alternativa a los gestos. La barra de scroll está oculta en la baraja y visible en lista completa. Respetar preferencias de movimiento reducido. No se ha declarado ni certificado conformidad con un estándar específico.

