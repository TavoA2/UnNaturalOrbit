export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options, cache: "no-store",
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "No se pudo completar la solicitud.");
  return data as T;
}
export function message(error: unknown) {
  return error instanceof Error ? error.message : "No se pudo conectar. Intenta nuevamente.";
}

