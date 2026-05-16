export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function getErrorMessage(response, fallback) {
  try {
    const payload = await response.json();
    return payload?.message || payload?.error || fallback;
  } catch {
    return fallback;
  }
}

export async function getJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Error ${response.status} al consultar ${path}`));
  }

  return response.json();
}

export async function postJson(path, data) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Error ${response.status} al crear recurso en ${path}`));
  }

  return response.json();
}

export async function putJson(path, data) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Error ${response.status} al actualizar recurso en ${path}`));
  }

  return response.json();
}

export async function deleteJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, `Error ${response.status} al eliminar recurso en ${path}`));
  }

  return response;
}

export function normalizeList(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}
