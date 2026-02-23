// src/services/auth.storage.ts
export type AuthUser = { email: string; name: string; remember: boolean };

const AUTH_KEY = "aya_auth_v1";

export function getAuth(): AuthUser | null {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || "null");
  } catch {
    return null;
  }
}

export function setAuth(v: AuthUser | null) {
  if (!v) localStorage.removeItem(AUTH_KEY);
  else localStorage.setItem(AUTH_KEY, JSON.stringify(v));
}
