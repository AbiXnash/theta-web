import { component$, useSignal, Slot } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

export default component$(() => {
  const isMenuOpen = useSignal(false);

  return (
    <div class="min-h-screen bg-gray-950">
      {/* Header */}
      <header class="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
        <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link href="/home" class="flex items-center gap-3">
            <img
              src="/theta-logo.png"
              alt="Theta"
              class="h-10 w-auto sm:h-14"
            />
          </Link>

          {/* Desktop Nav */}
          <nav class="hidden items-center gap-4 md:flex">
            <Link
              href="/home"
              class="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/events"
              class="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Events
            </Link>
            <Link
              href="/contact"
              class="text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              Contact
            </Link>
            <Link
              href="#"
              class="pointer-events-none text-sm font-medium text-slate-500"
            >
              Merch <span class="text-xs">(Coming Soon)</span>
            </Link>
            <div class="flex items-center gap-3">
              <Link
                href="/register"
                class="relative rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-xl"
              >
                Register
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick$={() => (isMenuOpen.value = !isMenuOpen.value)}
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 transition-colors hover:bg-slate-700 md:hidden"
          >
            {isMenuOpen.value ? (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen.value && (
          <div class="border-t border-white/10 bg-gray-950 md:hidden">
            <div class="space-y-1 px-4 py-4">
              <Link
                href="/home"
                onClick$={() => (isMenuOpen.value = false)}
                class="block rounded-lg px-4 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                Home
              </Link>
              <Link
                href="/events"
                onClick$={() => (isMenuOpen.value = false)}
                class="block rounded-lg px-4 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                Events
              </Link>
              <Link
                href="/contact"
                onClick$={() => (isMenuOpen.value = false)}
                class="block rounded-lg px-4 py-3 text-base font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
              >
                Contact
              </Link>
              <div class="flex items-center gap-2 px-4 py-3">
                <span class="text-base font-medium text-slate-500">Merch</span>
                <span class="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                  Coming Soon
                </span>
              </div>
              <div class="flex flex-col gap-3 pt-4">
                <Link
                  href="/login"
                  onClick$={() => (isMenuOpen.value = false)}
                  class="block rounded-full border border-slate-600 px-4 py-3 text-center text-base font-medium text-white transition-all hover:border-blue-400 hover:text-blue-300"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick$={() => (isMenuOpen.value = false)}
                  class="block rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 text-center text-base font-semibold text-white shadow-lg shadow-blue-500/25"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main class="pt-16">
        <Slot />
      </main>

      <footer class="border-t border-white/10 bg-gray-950 py-12">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div class="flex items-center gap-3">
              <img
                src="/theta-logo.png"
                alt="Theta"
                class="h-8 w-auto sm:h-14"
              />
            </div>
            <p class="text-sm text-slate-400">
              National Level Techno-Management Fest • March 15-17, 2026
            </p>
            <div class="flex gap-4">
              <a
                href="#"
                class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-blue-500/50 hover:bg-blue-500/20 hover:text-blue-400"
              >
                <span class="sr-only">Instagram</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                class="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-all hover:border-blue-500/50 hover:bg-blue-500/20 hover:text-blue-400"
              >
                <span class="sr-only">Twitter</span>
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
});
