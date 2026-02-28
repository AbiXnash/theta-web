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
  const headerRef = useSignal<HTMLElement>();
  const location = useLocation();

  useVisibleTask$(({ track }) => {
    track(() => location.url.pathname);
    isMenuOpen.value = false;
  });

  const toggleMenu = $(() => {
    isMenuOpen.value = !isMenuOpen.value;
  });

  useVisibleTask$(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!isMenuOpen.value || !headerRef.value) return;
      const target = event.target as Node | null;
      if (target && !headerRef.value.contains(target)) {
        isMenuOpen.value = false;
      }
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  });

  return (
    <header
      ref={headerRef}
      class="fixed top-0 right-0 left-0 z-50 border-b border-cyan-300/20 bg-slate-950/70 backdrop-blur-2xl"
    >
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_45%),radial-gradient(circle_at_85%_10%,rgba(244,114,182,0.14),transparent_40%)]"></div>
      <div class="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6 lg:h-20 lg:px-8">
        {/* Logo */}
        <Link href="/" class="group flex items-center gap-3">
          <div class="relative">
            <img
              src="/theta-logo.png"
              alt="Theta"
              width="192"
              height="96"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              class="h-12 w-auto transition-transform duration-300 group-hover:scale-110 sm:h-16 lg:h-20"
            />
            <div class="absolute -inset-2 rounded-full bg-cyan-400/20 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100"></div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav class="hidden items-center gap-3 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              class="group relative rounded-full border border-transparent bg-white/3 px-5 py-2 text-sm font-semibold tracking-wide text-slate-200 transition-all hover:border-cyan-300/40 hover:bg-white/10 hover:text-white"
            >
              <span class="relative z-10">{item.label}</span>
              <div class="absolute right-3 bottom-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            </Link>
          ))}
          <div class="ml-3 flex items-center gap-2 rounded-full border border-amber-300/35 bg-amber-300/10 px-4 py-2">
            <span class="text-xs font-medium text-amber-300">Merch</span>
            <span class="rounded-full bg-amber-200/20 px-2 py-0.5 text-[10px] text-amber-100">
              Soon
            </span>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick$={toggleMenu}
          class="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-white/5 text-slate-200 transition-all hover:bg-white/10 sm:h-11 sm:w-11 lg:hidden"
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
        <div class="border-t border-cyan-300/20 bg-slate-950/85 backdrop-blur-2xl lg:hidden">
          <div class="space-y-2 px-6 py-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                class="block rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-lg font-medium text-slate-200 transition-all hover:border-cyan-300/40 hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <div class="flex items-center gap-3 px-6 py-4">
              <span class="text-base font-medium text-slate-400">Merch</span>
              <span class="rounded-full bg-amber-300/20 px-3 py-1 text-xs text-amber-200">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
});
