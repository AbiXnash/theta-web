import { component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Header } from "~/components/header/header";

export default component$(() => {
  const cursorX = useSignal(0);
  const cursorY = useSignal(0);
  const isHovering = useSignal(false);
  const isMobile = useSignal(true);
  const enableCursorFx = useSignal(false);
  const underDev = useSignal(true);

  useVisibleTask$(() => {
    const computeUiMode = () => {
      const width = window.innerWidth;
      isMobile.value = width < 1024;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const supportsFinePointer = window.matchMedia("(pointer:fine)").matches;
      enableCursorFx.value =
        !prefersReducedMotion && supportsFinePointer && width >= 1024;
    };

    computeUiMode();
    const handleResize = () => {
      computeUiMode();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  });

  useVisibleTask$(() => {
    underDev.value = import.meta.env.PUBLIC_UNDER_DEV !== "false";
  });

  useVisibleTask$(() => {
    if (!enableCursorFx.value) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.value = e.clientX;
      cursorY.value = e.clientY;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        isHovering.value = true;
      } else {
        isHovering.value = false;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  });

  return (
    <div class="min-h-screen cursor-none bg-gray-950 lg:cursor-auto">
      {/* Custom Cursor - Desktop Only */}
      {!isMobile.value && enableCursorFx.value && (
        <div
          class="pointer-events-none fixed z-[9999] rounded-full bg-violet-500 mix-blend-difference transition-transform duration-100"
          style={{
            left: `${cursorX.value}px`,
            top: `${cursorY.value}px`,
            width: isHovering.value ? "40px" : "12px",
            height: isHovering.value ? "40px" : "12px",
            transform: "translate(-50%, -50%)",
          }}
        ></div>
      )}

      {/* Under Development Indicator */}
      {underDev.value && (
        <div class="fixed right-4 bottom-4 z-[100]">
          <div class="group relative">
            <div class="flex h-10 w-10 cursor-help items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/20 text-amber-400 backdrop-blur-sm transition-all hover:bg-amber-500/30">
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div class="absolute right-0 bottom-full mb-2 hidden w-48 rounded-lg border border-amber-500/30 bg-gray-900/95 p-3 text-center text-xs text-amber-200 shadow-xl backdrop-blur-sm group-hover:block">
              🚧 Website Under Development
              <br />
              <span class="text-amber-400/60">Changes may occur</span>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <Header />

      <main class="pt-16">
        <Slot />
      </main>

      {/* Footer */}
      <footer class="border-t border-white/10 bg-gray-950 py-16">
        <div class="mx-auto max-w-7xl px-6 sm:px-8">
          <div class="grid gap-10 md:grid-cols-4">
            {/* Logo & Description */}
            <div class="md:col-span-2">
              <Link href="/" class="flex items-center gap-3">
                <img
                  src="/theta-logo.png"
                  alt="Theta"
                  width="128"
                  height="64"
                  decoding="async"
                  class="h-16 w-auto"
                />
              </Link>
              <p class="mt-4 max-w-md text-base text-slate-400">
                Theta is a national-level techno-management fest organized by
                SASTRA Deemed University. Join us for three days of innovation,
                competition, and excitement.
              </p>
              <div class="mt-6 flex gap-4">
                <a
                  href="#"
                  class="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-violet-500/50 hover:bg-violet-500/20 hover:text-violet-400"
                >
                  <span class="sr-only">Instagram</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  class="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-violet-500/50 hover:bg-violet-500/20 hover:text-violet-400"
                >
                  <span class="sr-only">Twitter</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="#"
                  class="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-violet-500/50 hover:bg-violet-500/20 hover:text-violet-400"
                >
                  <span class="sr-only">YouTube</span>
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 class="text-lg font-bold text-white">Quick Links</h4>
              <ul class="mt-4 space-y-3">
                <li>
                  <Link
                    href="/"
                    class="text-base text-slate-400 transition-colors hover:text-violet-400"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    class="text-base text-slate-400 transition-colors hover:text-violet-400"
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    class="text-base text-slate-400 transition-colors hover:text-violet-400"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 class="text-lg font-bold text-white">Contact</h4>
              <ul class="mt-4 space-y-3">
                <li class="flex items-center gap-2 text-base text-slate-400">
                  <svg
                    class="h-5 w-5 shrink-0 text-violet-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  SASTRA Deemed University
                </li>
                <li class="flex items-center gap-2 text-base text-slate-400">
                  <svg
                    class="h-5 w-5 shrink-0 text-violet-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  March 15-17, 2026
                </li>
                <li class="flex items-center gap-2 text-base text-slate-400">
                  <svg
                    class="h-5 w-5 shrink-0 text-violet-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  theta@sastra.edu
                </li>
              </ul>
            </div>
          </div>

          <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
            <p class="text-base text-slate-500">
              © 2026 Theta. All rights reserved.
            </p>
            <p class="text-base text-slate-500">
              Made with <span class="text-violet-500">♥</span> by WebTek Team
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
});
