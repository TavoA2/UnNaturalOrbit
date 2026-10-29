# Comunidad, login y reseñas

## Alcance

Se añaden /login, /resenas y /admin. Las reseñas comunitarias son independientes del futuro módulo editorial de publications. Son públicas inmediatamente después de enviarse y admiten comentarios. El autor puede eliminar sus aportes; el administrador puede eliminar cualquier aporte, con confirmación en la interfaz. No hay edición, puntuaciones, comentarios anidados ni revisión previa a publicación en esta entrega.

El nombre público es un seudónimo elegido por el participante; no acredita identidad. No se muestran correos. El contenido se renderiza como texto mediante React, preservando saltos de línea, sin HTML arbitrario.

## Activación de Supabase

1. Crear un proyecto Supabase. Copiar .env.example a .env.local.
2. Completar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY con los valores reales del proyecto. SITE_URL será http://localhost:3000 localmente y el dominio HTTPS al desplegar.
3. Aplicar supabase/migrations/202610200001_community.sql una única vez mediante el SQL Editor o el flujo de migraciones Supabase. Es una migración nueva, sin borrado de tablas existentes. Revisarla antes de aplicarla en un proyecto que ya tenga tablas del mismo nombre.
4. En Authentication, habilitar Email, registro de usuarios y Confirm email. Configurar Site URL y permitir la URL /auth/confirm del entorno local y del dominio usado. Configurar SMTP para envío real.
5. En la plantilla Confirm signup usar un enlace construido con el token, que permite confirmar desde otro dispositivo:
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email
   Usar un proyecto de desarrollo con Site URL local; no cambiar el Site URL de producción para pruebas locales. También se admite el callback PKCE con code.
6. Reiniciar Next.js después de cambiar variables. Registrarse desde /login, confirmar correo e iniciar sesión.
7. Las claves secret/service_role no se utilizan en la aplicación.

## Crear administrador

Crear o invitar al usuario desde Authentication del panel de Supabase (o usar una cuenta ya confirmada). Copiar su UUID real y ejecutar desde SQL Editor, con privilegios de propietario:

```sql
insert into public.admin_users (user_id)
values ('UUID_REAL_DEL_USUARIO');
```

No usar user_metadata ni datos enviados por el navegador para conceder permisos. Para revocar acceso administrativo:

```sql
delete from public.admin_users where user_id = 'UUID_REAL_DEL_USUARIO';
```

Las nuevas cuentas son participantes comunes. /admin verifica la identidad con getUser y consulta is_admin en servidor. RLS vuelve a verificar cada eliminación, incluso si alguien llama directamente a la API de Supabase.

## Endpoints

- GET /api/session: estado de configuración y sesión; sin correo ni secretos.
- POST /api/auth: action login con email/password; signup añade name; logout cierra sesión.
- GET /api/reviews?page=0: diez reseñas, públicas.
- POST /api/reviews: id UUID generado una vez por envío, title, subject, body.
- DELETE /api/reviews/[id]: autor o administrador; elimina también comentarios.
- GET /api/reviews/[id]/comments?page=0: veinte comentarios.
- POST /api/reviews/[id]/comments: id UUID, body; sesión requerida.
- DELETE /api/comments/[id]: autor o administrador.
- GET /auth/confirm: verifica token de confirmación o intercambia code de PKCE.

Las escrituras requieren Origin idéntico al del sitio (protección CSRF), JSON y cuerpo menor a 24 KB. Se validan con Zod en servidor y cliente; las restricciones SQL refuerzan límites e integridad. Las UUID únicas evitan duplicados por reintentos. Las lecturas y respuestas de sesión no se guardan en caché compartida.

Límites básicos: cinco reseñas y treinta comentarios por usuario por hora, serializados mediante bloqueo PostgreSQL. Estos límites cuentan aportes aún existentes: eliminarlos libera cuota. No son un sistema completo contra spam; Supabase aplica además sus límites de Auth. No hay CAPTCHA ni bloqueo automático de cuentas.

## Pruebas

npm test ejecuta validaciones y seguridad de solicitudes localmente. Las pruebas de integración Auth/RLS se omiten si no hay un proyecto de pruebas configurado.

Para ejecutarlas, usar exclusivamente un proyecto Supabase aislado con la migración aplicada, y definir temporalmente TEST_SUPABASE_URL, TEST_SUPABASE_PUBLISHABLE_KEY, TEST_SUPABASE_SECRET_KEY y TEST_ALLOW_WRITE=isolated-test-project antes de npm test. La clave secret o service_role solo se usa desde Node en pruebas; no debe copiarse a variables NEXT_PUBLIC ni guardarse en archivos versionados.

Estas pruebas crean dos usuarios temporales, verifican login, lectura anónima, RLS, rechazo de identidad falsa y escalada de rol, duplicados, comentarios, eliminación y cierre de sesión. Eliminan solo sus usuarios temporales al terminar, con cascada sobre sus aportes. No ejecutar sobre producción.

Verificación manual tras conectar: registrar, confirmar en otro dispositivo, iniciar sesión, publicar reseña, comentar desde otra cuenta, comprobar que no puede eliminar aportes ajenos, cerrar sesión y comprobar que escribir requiere acceso. Agregar la cuenta a admin_users y verificar moderación. Probar también el botón Cancelar antes de confirmar eliminación.

## Estado real

La integración no se ha ejecutado contra Supabase porque todavía no hay credenciales en este proyecto. El estado sin conexión se muestra explícitamente, sin inventar usuarios ni simular persistencia. Las pruebas de UI con una sesión real, envío de correo y políticas SQL están pendientes de un proyecto configurado.

