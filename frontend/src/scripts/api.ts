const API_BASE = "http://localhost:3000";

function jsonHeaders(): HeadersInit {
  return { "Content-Type": "application/json" };
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const msg = Array.isArray(data?.message)
      ? data.message.join(", ")
      : data?.message || `API error: ${res.status}`;
    throw new Error(msg);
  }

  return res.json() as Promise<T>;
}

export async function apiPost<TResponse, TRequest = unknown>(
  path: string,
  data: TRequest,
): Promise<TResponse> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const msg = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message || `API error: ${res.status}`;
    throw new Error(msg);
  }

  return res.json() as Promise<TResponse>;
}

export async function apiPatch<TResponse, TRequest = unknown>(
  path: string,
  data: TRequest,
): Promise<TResponse> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const msg = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message || `API error: ${res.status}`;
    throw new Error(msg);
  }

  return res.json() as Promise<TResponse>;
}

export async function apiDelete(path: string): Promise<void> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const msg = Array.isArray(body?.message)
      ? body.message.join(", ")
      : body?.message || `API error: ${res.status}`;
    throw new Error(msg);
  }
}
