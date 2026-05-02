const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, "");

export const API_BASE_URL = normalizeBaseUrl(
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
    "http://127.0.0.1:8000"
);

export const endpoints = {
  // Authentication
  signup: `${API_BASE_URL}/api/signup/`,
  login: `${API_BASE_URL}/api/login/`,
  logout: `${API_BASE_URL}/api/logout/`,

  // Core
  history: `${API_BASE_URL}/api/history/`,
  evaluateAnswer: `${API_BASE_URL}/api/evaluate-answer/`,
  extractText: `${API_BASE_URL}/api/extract-text/`,

  // Marking scheme / paper management
  getMarks: `${API_BASE_URL}/api/get-marks/`,
  uploadMarkingScheme: `${API_BASE_URL}/api/upload-marking-scheme/`,
  saveMarkingScheme: `${API_BASE_URL}/api/save-marking-scheme/`,
  manualMarkingScheme: `${API_BASE_URL}/api/manual-marking-scheme/`,
} as const;
