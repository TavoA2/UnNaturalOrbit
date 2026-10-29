# UnnaturalOrbit

Plataforma independiente de promoción cultural y artística, desarrollada con Next.js App Router, TypeScript estricto, Tailwind y Supabase.

## Estado actual

- Galería oscura con categorías, filtro por técnica y fichas de obra.
- Perfil de Melanie Castro con datos verificados y enlaces a siete diseños originales.
- /resenas: lectura de reseñas y comentarios, formularios de participación y paginación.
- /login: acceso, registro de participantes y confirmación por correo.
- /admin: acceso administrativo verificado en servidor, conteos y entrada a moderación.
- Endpoints de sesión, Auth, reseñas y comentarios.
- Migración PostgreSQL con RLS, permisos por autor y administrador, restricciones e índices.
- Pruebas locales y suite de integración preparada.

**Supabase todavía no está conectado.** La aplicación muestra este estado y deshabilita el acceso. El login real, el envío de correo, la persistencia y las políticas de base de datos requieren aplicar la migración y completar la configuración. No se han verificado contra un servicio real.

El módulo editorial original de publicaciones, proyectos, imágenes y multimedia sigue pendiente. Las reseñas comunitarias son un módulo independiente.

## Ejecución local

La tipografía es provisional. Para cambiarla, reemplazar imágenes o actualizar los datos de la artista, consultar [la guía de diseño](docs/gallery-design.md). Las imágenes generadas y sus prompts están en [el registro de recursos](docs/gallery-assets.md).

Node.js 24 LTS y npm 11. Desde esta carpeta:

```sh
npm ci
npm run dev
```

Abrir http://localhost:3000. La portada y las interfaces se pueden consultar sin variables. Para habilitar cuentas y comunidad, seguir [la guía de configuración](docs/community.md).

## Configuración

Copiar .env.example a .env.local y completar la URL y clave publicable reales de Supabase y SITE_URL. Aplicar la migración, configurar Email y SMTP y reiniciar Next.js. La aplicación no utiliza claves secret/service_role.

Los participantes pueden registrarse, pero nadie obtiene permisos de administrador desde un formulario. El administrador se crea de forma segura mediante public.admin_users desde el SQL Editor. El procedimiento está en docs/community.md.

## Verificaciones

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

Las pruebas de integración se omiten si no hay un proyecto aislado configurado. Consultar docs/community.md. El archivo package-lock.json fija las dependencias.

## Organización

- app/: rutas públicas, login, administración y endpoints.
- components/: UI y formularios React Hook Form.
- lib/: clientes Supabase SSR, API y lógica compartida.
- types/: contratos.
- validations/: esquemas Zod compartidos.
- supabase/migrations/: SQL versionado.
- tests/: validaciones, seguridad de solicitudes e integración Auth/RLS.
- docs/community.md: activación, permisos y uso de la comunidad.
- docs/architecture.md: decisiones y alcance.
- docs/validation.md: registro de verificaciones.

## Uso de la comunidad

Entrar en /login, crear una cuenta y confirmar el correo. Iniciar sesión y abrir /resenas para publicar. Cada reseña permite abrir comentarios. Los autores pueden eliminar sus aportes tras confirmar; los administradores pueden moderar todos. El contenido es público al publicarse y los nombres son seudónimos, no identidades verificadas.

## Vercel y GitHub

Repositorio Git local, sin remoto ni publicación. Para conectar GitHub, crear un repositorio vacío y añadir su URL como origin; revisar los archivos antes del primer push.

En Vercel: importar el repositorio, seleccionar Next.js, configurar las variables por entorno y usar npm run build. Añadir la URL de confirmación del dominio permitido en Supabase. Probar en Preview antes de producción. No se ha desplegado.

No se han aplicado migraciones a datos existentes. Los procedimientos operativos de respaldo/restauración y el módulo administrativo editorial completo siguen pendientes.

