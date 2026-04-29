const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, "");

export const API_BASE_URL = normalizeBaseUrl(
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    "http://127.0.0.1:8000"
);

// Default to demo mode until your backend is wired.
export const DEMO_MODE =
  ((import.meta.env.VITE_DEMO_MODE as string | undefined) ?? "true") === "true";

export const endpoints = {
  extractText: `${API_BASE_URL}/api/extract-text/`,
  userHistory: (userId: string) => `${API_BASE_URL}/api/history/user:${userId}`,

  // Demo placeholders for future work
  login: `${API_BASE_URL}/api/auth/login/`,
  signup: `${API_BASE_URL}/api/auth/signup/`,
  profile: (userId: string) => `${API_BASE_URL}/api/users/${userId}`,
} as const;
