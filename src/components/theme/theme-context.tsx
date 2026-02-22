import {
  component$,
  useSignal,
  useVisibleTask$,
  $,
  useContextProvider,
  createContextId,
  useContext,
  Slot,
} from "@builder.io/qwik";

export type Theme = "light" | "dark";

export interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContextId<ThemeState>("theme-context");

export const ThemeProvider = component$(() => {
  const theme = useSignal<Theme>("light");

  const toggleTheme = $(() => {
    theme.value = theme.value === "light" ? "dark" : "light";
  });

  useContextProvider(ThemeContext, {
    get theme() {
      return theme.value;
    },
    toggleTheme,
  });

  useVisibleTask$(({ track }) => {
    track(() => theme.value);
    document.documentElement.setAttribute("data-theme", theme.value);
    localStorage.setItem("theme", theme.value);
  });

  useVisibleTask$(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) {
      theme.value = saved;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme.value = "dark";
    }
  });

  return <Slot />;
});

export const useTheme = () => useContext(ThemeContext);
