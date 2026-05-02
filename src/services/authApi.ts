import { endpoints } from "@/services/endpoints";
import type { LoginApiResponse, LogoutApiResponse, SignupApiResponse } from "@/types/api";

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }

  // Some backends might respond with empty body for 204/205.
  const text = await res.text().catch(() => "");
  if (!text) return {} as T;

  try {
    return JSON.parse(text) as T;
  } catch {
    // If server returns a plain-text error/success message.
    return { message: text } as T;
  }
}

function authHeader(token?: string): HeadersInit {
  return token ? { Authorization: `Token ${token}` } : {};
}

export async function loginApi(input: { username: string; password: string }): Promise<LoginApiResponse> {
  return await fetchJson<LoginApiResponse>(endpoints.login, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function signupApi(input: {
  username: string;
  email: string;
  password: string;
}): Promise<SignupApiResponse> {
  return await fetchJson<SignupApiResponse>(endpoints.signup, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function logoutApi(token: string): Promise<LogoutApiResponse> {
  return await fetchJson<LogoutApiResponse>(endpoints.logout, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify({}),
  });
}
