# Lógica de aplicación

supabase/ contiene configuración y cliente SSR. community.ts exige sesión verificada para escribir. http.ts limita cuerpos, valida origen y esquemas y devuelve errores sin detalles internos. api-client.ts se usa desde la UI para llamar los endpoints de Next.js.

Los módulos que usan next/headers se ejecutan exclusivamente en servidor. La aplicación no utiliza claves privilegiadas.
