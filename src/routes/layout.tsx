import { component$, Slot } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { ThemeProvider } from "../components/theme/theme-context";

export default component$(() => {
  const loc = useLocation();
  const isAuthPage =
    loc.url.pathname === "/login" || loc.url.pathname === "/register";

  return (
    <ThemeProvider>
      <div
        data-theme="light"
        class="relative min-h-screen overflow-hidden bg-slate-50"
      >
        {!isAuthPage && <div class="grid-background"></div>}

        <main
          class={isAuthPage ? "min-h-screen" : "relative z-10 min-h-screen"}
        >
          <Slot />
        </main>
      </div>
    </ThemeProvider>
  );
});
