import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from "react";
import type { HistoryItem } from "@/types/api";
import { logoutApi } from "@/services/authApi";

export type UserRole = "student" | "teacher";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  token?: string;
  username?: string;
};

type AppState = {
  auth: {
    isAuthenticated: boolean;
    user: AuthUser | null;
  };
  latestResult: HistoryItem | null;
  history: HistoryItem[];
};

const STORAGE_KEY = "autograde_app_state_v2";

const initialState: AppState = {
  auth: { isAuthenticated: false, user: null },
  latestResult: null,
  history: [],
};

type Action =
  | { type: "RESTORE"; payload: Partial<AppState> }
  | { type: "LOGIN"; payload: AuthUser }
  | { type: "LOGOUT" }
  | { type: "SET_LATEST_RESULT"; payload: HistoryItem }
  | { type: "ADD_HISTORY"; payload: HistoryItem }
  | { type: "SET_HISTORY"; payload: HistoryItem[] }
  | { type: "UPDATE_HISTORY_ITEM"; payload: { id: string; patch: Partial<HistoryItem> } };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "RESTORE":
      return {
        ...state,
        ...action.payload,
        auth: action.payload.auth ?? state.auth,
      };
    case "LOGIN":
      return {
        ...state,
        auth: { isAuthenticated: true, user: action.payload },
      };
    case "LOGOUT":
      return {
        ...state,
        auth: { isAuthenticated: false, user: null },
        latestResult: null,
        history: [],
      };
    case "SET_LATEST_RESULT":
      return {
        ...state,
        latestResult: action.payload,
      };
    case "ADD_HISTORY":
      return {
        ...state,
        history: [action.payload, ...state.history],
      };
    case "SET_HISTORY":
      return {
        ...state,
        history: action.payload,
      };
    case "UPDATE_HISTORY_ITEM": {
      const { id, patch } = action.payload;
      const nextHistory = state.history.map((h) => (h.id === id ? { ...h, ...patch } : h));
      const nextLatest = state.latestResult?.id === id ? { ...state.latestResult, ...patch } : state.latestResult;
      return {
        ...state,
        history: nextHistory,
        latestResult: nextLatest,
      };
    }
    default:
      return state;
  }
}

type AppContextValue = {
  state: AppState;
  actions: {
    login: (user: AuthUser) => void;
    logout: () => void;
    setLatestResult: (item: HistoryItem) => void;
    addHistory: (item: HistoryItem) => void;
    setHistory: (items: HistoryItem[]) => void;
    updateHistoryItem: (id: string, patch: Partial<HistoryItem>) => void;
  };
};

const AppContext = createContext<AppContextValue | null>(null);

function inferLegacyUserName(input: unknown): string | null {
  if (!input || typeof input !== "object") return null;
  const user = input as { email?: unknown; role?: unknown };
  const email = typeof user.email === "string" ? user.email.toLowerCase() : "";
  const role = user.role;

  if (email === "teacher@gmail.com" || role === "teacher") return "Muneeb Masood";
  if (email === "student@gmail.com" || role === "student") return "Samiullah";
  return null;
}

function safeParseStoredState(raw: string | null): Partial<AppState> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed || typeof parsed !== "object") return null;

    const storedUser = parsed.auth?.user as unknown;
    if (storedUser && typeof storedUser === "object") {
      const u = storedUser as { name?: unknown; email?: unknown };
      const existingName = typeof u.name === "string" ? u.name.trim() : "";
      if (!existingName) {
        const inferred = inferLegacyUserName(storedUser);
        const email = typeof u.email === "string" ? u.email.trim() : "";
        const fallbackName = email || "User";
        (storedUser as { name?: string }).name = inferred ?? fallbackName;
      }
    }

    return parsed;
  } catch {
    return null;
  }
}

function initState(): AppState {
  // Read persisted state immediately so route guards don't redirect on refresh.
  const restored = safeParseStoredState(localStorage.getItem(STORAGE_KEY));
  if (!restored) return initialState;
  return reducer(initialState, { type: "RESTORE", payload: restored });
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, initState);

  useEffect(() => {
    const toStore: AppState = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [state]);

  const actions = useMemo<AppContextValue["actions"]>(
    () => ({
      login: (user) => dispatch({ type: "LOGIN", payload: user }),
      logout: () => dispatch({ type: "LOGOUT" }),
      setLatestResult: (item) =>
        dispatch({ type: "SET_LATEST_RESULT", payload: item }),
      addHistory: (item) => dispatch({ type: "ADD_HISTORY", payload: item }),
      setHistory: (items) => dispatch({ type: "SET_HISTORY", payload: items }),
      updateHistoryItem: (id, patch) =>
        dispatch({ type: "UPDATE_HISTORY_ITEM", payload: { id, patch } }),
    }),
    []
  );

  const value = useMemo<AppContextValue>(() => ({ state, actions }), [state, actions]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used within AppProvider");
  return ctx;
}

export function useAuth() {
  const {
    state: { auth },
    actions,
  } = useAppStore();

  const logout = async () => {
    const token = auth.user?.token;
    if (token) {
      try {
        await logoutApi(token);
      } catch {
        // Ignore network errors on logout; always clear local state.
      }
    }
    actions.logout();
  };

  return {
    ...auth,
    login: actions.login,
    logout,
  };
}

export function useAppData() {
  const {
    state: { latestResult, history },
    actions,
  } = useAppStore();
  return {
    latestResult,
    history,
    setLatestResult: actions.setLatestResult,
    addHistory: actions.addHistory,
    setHistory: actions.setHistory,
    updateHistoryItem: actions.updateHistoryItem,
  };
}
