import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "negari_theme";

const getSystemTheme = (): Exclude<ThemeMode, "system"> => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const applyThemeClass = (mode: Exclude<ThemeMode, "system">) => {
  const root = document.documentElement;
  if (mode === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(THEME_STORAGE_KEY) : null;
    if (stored === "light" || stored === "dark" || stored === "system") return stored;

    const fromUserSettings = typeof window !== "undefined" ? window.localStorage.getItem("userSettings") : null;
    if (fromUserSettings) {
      try {
        const parsed = JSON.parse(fromUserSettings);
        const t = parsed?.appearance?.theme;
        if (t === "light" || t === "dark" || t === "system") return t;
      } catch {
        return "system";
      }
    }

    return "system";
  });

  useEffect(() => {
    const resolved = theme === "system" ? getSystemTheme() : theme;
    applyThemeClass(resolved);

    const listener = () => {
      if (theme === "system") applyThemeClass(getSystemTheme());
    };

    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    media?.addEventListener?.("change", listener);
    return () => media?.removeEventListener?.("change", listener);
  }, [theme]);

  const setTheme = (next: ThemeMode) => {
    setThemeState(next);
    window.localStorage.setItem(THEME_STORAGE_KEY, next);
  };

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
};
