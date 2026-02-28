import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

interface NavItem {
  href: string;
  label: string;
}

const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export const Header = component$(() => {
  const isMenuOpen = useSignal(false);
  const location = useLocation();

  useVisibleTask$(({ track }) => {
    track(() => location.url.pathname);
    isMenuOpen.value = false;
  });

  const toggleMenu = $(() => {
    isMenuOpen.value = !isMenuOpen.value;
  });

  return (
    <header class="fixed top-0 right-0 left-0 z-50 border-b border-white/10 bg-gray-950/90 backdrop-blur-xl">
      <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Logo */}
        <Link href="/" class="group flex items-center gap-3">
          <div class="relative">
            <img
              src="/theta-logo.png"
              alt="Theta"
              class="h-10 w-auto transition-transform duration-300 group-hover:scale-110 sm:h-12"
            />
            <div class="absolute -inset-2 rounded-full bg-violet-500/20 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>
          <span class="hidden text-2xl font-bold tracking-wider text-white sm:block">
            2026
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav class="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              class="group relative rounded-xl px-5 py-3 text-base font-medium text-slate-300 transition-all hover:bg-white/5 hover:text-white"
            >
              <span class="relative z-10">{item.label}</span>
              <div class="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-violet-500 transition-all duration-300 group-hover:w-3/4"></div>
            </Link>
          ))}
          <div class="ml-4 flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2">
            <span class="text-xs text-violet-400">Merch</span>
            <span class="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] text-violet-300">
              Soon
            </span>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick$={toggleMenu}
          class="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 text-slate-300 transition-all hover:border-violet-500 hover:bg-violet-500/20 lg:hidden"
        >
          {isMenuOpen.value ? (
            <svg
              class="h-6 w-6"
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
              class="h-6 w-6"
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
        <div class="border-t border-white/10 bg-gray-950/95 backdrop-blur-xl lg:hidden">
          <div class="space-y-2 px-6 py-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                class="block rounded-xl bg-slate-800/50 px-6 py-4 text-lg font-medium text-slate-300 transition-all hover:bg-violet-500/20 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div class="flex items-center gap-3 px-6 py-4">
              <span class="text-base font-medium text-slate-500">Merch</span>
              <span class="rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-400">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});
