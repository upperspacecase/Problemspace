// Helper for making authenticated API requests

export async function apiFetch(
  url: string,
  options: RequestInit & { token?: string | null } = {}
) {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...fetchOptions, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || `Request failed with status ${res.status}`);
  }

  return res.json();
}
