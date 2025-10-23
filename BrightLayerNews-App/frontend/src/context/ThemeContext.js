// ./src/context/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";

export const STORAGE_KEY = "app_theme_preference_v1";

// Simple theme objects that provide Tailwind class names and status bar style
const lightTheme = {
  mode: "light",
  colors: {
    background: "bg-white",
    card: "bg-white",
    text: "text-black",
    muted: "text-gray-500",
    accent: "accent",
    border: "border-gray-200",
    statusBar: "dark-content",
  },
};

const darkTheme = {
  mode: "dark",
  colors: {
    background: "bg-[#0b1220]",
    card: "bg-[#07101a]",
    text: "text-[#e6eef8]",
    muted: "text-gray-400",
    accent: "accent",
    border: "border-[#111827]",
    statusBar: "light-content",
  },
};

// export ThemeContext so other files can use useContext(ThemeContext) safely
export const ThemeContext = createContext({
  theme: lightTheme,
  mode: "light",
  toggleTheme: () => {},
  setThemeMode: () => {},
  loaded: false,
});

export function ThemeProvider({ children }) {
  const system = Appearance.getColorScheme();
  const [mode, setMode] = useState(system === "dark" ? "dark" : "light");
  const [theme, setTheme] = useState(mode === "dark" ? darkTheme : lightTheme);
  const [loaded, setLoaded] = useState(false);

  // load persisted preference once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (mounted) {
          if (saved === "dark" || saved === "light") {
            setMode(saved);
            setTheme(saved === "dark" ? darkTheme : lightTheme);
          } else {
            // default to system
            setMode(system === "dark" ? "dark" : "light");
            setTheme(system === "dark" ? darkTheme : lightTheme);
          }
        }
      } catch (err) {
        console.warn("Failed to load theme preference", err);
      } finally {
        if (mounted) setLoaded(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [system]);

  const persist = async (m) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, m);
    } catch (e) {
      console.warn("Failed to persist theme", e);
    }
  };

  const setThemeMode = (m) => {
    setMode(m);
    setTheme(m === "dark" ? darkTheme : lightTheme);
    persist(m);
  };

  const toggleTheme = () => {
    setThemeMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme, setThemeMode, loaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

// keep the useTheme helper (it still throws if used outside provider)
// components that want the strict guard can keep using it.
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
