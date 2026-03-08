import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

interface NavItem {
  href: string;
  label: string;
  active?: boolean;
}

interface HeaderCopy {
  logoAlt: string;
  navItems: NavItem[];
  merch: {
    label: string;
    comingSoon: boolean;
    labelSoon: string;
    labelComingSoon: string;
  };
}

const defaultHeaderCopy: HeaderCopy = {
  logoAlt: "Theta",
  navItems: [
    { href: "/", label: "Home", active: true },
    { href: "/events", label: "Events", active: true },
    { href: "/contact", label: "Contact", active: true },
  ],
  merch: {
    label: "Merch",
    comingSoon: true,
    labelSoon: "Soon",
    labelComingSoon: "Coming Soon",
  },
};

export const Header = component$(() => {
  const location = useLocation();
  const open = useSignal(false);
  const headerCopy = useSignal<HeaderCopy>(defaultHeaderCopy);
  const normalizePath = (path: string) => {
    if (!path) return "/";
    const cleaned = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path;
    return cleaned || "/";
  };
  const isPathActive = (href: string, currentPath: string) => {
    const base = normalizePath(href);
    const current = normalizePath(currentPath);
    if (base === "/") return current === "/";
    return current === base || current.startsWith(`${base}/`);
  };

  useVisibleTask$(async () => {
    try {
      const res = await fetch("/data/content.json");
      const data = (await res.json()) as { header?: Partial<HeaderCopy> };
      if (data.header) {
        headerCopy.value = {
          ...defaultHeaderCopy,
          ...data.header,
          navItems: Array.isArray(data.header.navItems)
            ? data.header.navItems
            : defaultHeaderCopy.navItems,
          merch: {
            ...defaultHeaderCopy.merch,
            ...(data.header.merch || {}),
          },
        };
      }
    } catch {
      headerCopy.value = defaultHeaderCopy;
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => location.url.pathname);
    open.value = false;
  });

  const toggleMenu = $(() => {
    open.value = !open.value;
  });

  // Close mobile menu after route tap to avoid stale open state on navigation.
  const closeMenu = $(() => {
    open.value = false;
  });

  return (
    <header class="fixed top-0 right-0 left-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur-xl">
      <div class="theta-noise pointer-events-none absolute inset-0 opacity-20"></div>
      <div class="relative mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" class="theta-focus flex shrink-0 items-center gap-2 rounded-xl p-1">
          <img
            src="/theta-logo.png"
            alt={headerCopy.value.logoAlt}
            width={160}
            height={80}
            class="h-11 w-auto invert sm:h-14"
            loading="eager"
            fetchPriority="high"
          />
          <span class="hidden text-base font-extrabold tracking-[0.16em] text-neutral-900 xl:inline">
            THETA<span class="text-[var(--theta-primary)]">2026</span>
          </span>
        </Link>

        <div class="pointer-events-none absolute left-1/2 -translate-x-1/2 lg:hidden">
          <img
            src="/sponsors/general/sastra-university-logo.jpg"
            alt="SASTRA University"
            width={88}
            height={44}
            class="h-9 w-auto rounded-md border border-black/10 bg-white px-1 py-0.5 object-contain"
            loading="eager"
          />
        </div>

        <nav class="hidden items-center gap-1 rounded-2xl border-2 border-black/10 bg-white p-1 shadow-[6px_6px_0_#111] lg:flex">
          {headerCopy.value.navItems.map((item) => {
            if (!item.active) {
              return (
                <span
                  key={item.href}
                  class="rounded-xl px-4 py-2 text-sm font-bold text-neutral-500"
                >
                  {item.label}
                </span>
              );
            }

            const isActive = isPathActive(item.href, location.url.pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                class={[
                  "theta-focus rounded-xl px-4 py-2 text-sm font-bold tracking-wide text-neutral-700 transition",
                  isActive
                    ? "bg-neutral-900 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                    : "hover:bg-neutral-100",
                ]}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div class="hidden items-center gap-2 lg:flex">
          {headerCopy.value.merch.comingSoon ? (
            <span class="theta-badge border-black bg-black text-white">
              {headerCopy.value.merch.label} • {headerCopy.value.merch.labelSoon}
            </span>
          ) : (
            <Link
              href="/merch"
              class="theta-focus rounded-xl border-2 border-black/20 bg-white px-4 py-2 text-sm font-bold text-black"
            >
              {headerCopy.value.merch.label}
            </Link>
          )}
          <Link
            href="/events"
            class="theta-focus rounded-xl border-2 border-[var(--theta-primary)] bg-[var(--theta-primary)] px-4 py-2 text-sm font-bold text-white shadow-[0_8px_20px_rgba(17,17,17,0.28)]"
          >
            Register Now
          </Link>
        </div>

        <button
          type="button"
          onClick$={toggleMenu}
          aria-expanded={open.value}
          aria-label="Toggle navigation"
          class="theta-focus flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black/20 bg-white lg:hidden"
        >
          <span class="text-xl text-neutral-900">{open.value ? "✕" : "☰"}</span>
        </button>
      </div>

      <div
        class={[
          "relative z-10 overflow-hidden border-t border-black/10 bg-gradient-to-b from-white to-neutral-100 px-4 transition-all duration-300 lg:hidden",
          open.value ? "max-h-[34rem] pb-5 opacity-100" : "max-h-0 pb-0 opacity-0",
        ]}
        aria-hidden={!open.value}
      >
        <div
          class={[
            "mt-4 rounded-2xl border-2 border-black/15 bg-white/95 p-3 shadow-[0_8px_20px_rgba(0,0,0,0.1)]",
            open.value && "animate-[thetaMenuIn_240ms_ease-out]",
          ]}
        >
          <div class="mb-3 flex items-center justify-between rounded-xl border border-black/10 bg-neutral-50 px-3 py-2">
            <p class="text-[10px] font-extrabold tracking-[0.18em] text-neutral-500 uppercase">Navigation</p>
            <span class="rounded-full border border-black/15 bg-white px-2.5 py-1 text-[10px] font-bold text-neutral-500">
              Menu
            </span>
          </div>

          <div class="space-y-2">
            {headerCopy.value.navItems.map((item) =>
              item.active ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick$={closeMenu}
                  class={[
                    "theta-focus flex items-center justify-between rounded-xl border px-4 py-3 font-semibold transition-transform duration-200 hover:-translate-y-0.5",
                    isPathActive(item.href, location.url.pathname)
                      ? "border-neutral-900 bg-neutral-900 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                      : "border-black/15 bg-white text-neutral-900",
                  ]}
                >
                  <span>{item.label}</span>
                  <span class="text-xs opacity-70">→</span>
                </Link>
              ) : (
                <span
                  key={item.href}
                  class="block rounded-xl border border-black/10 px-4 py-3 font-semibold text-neutral-500"
                >
                  {item.label}
                </span>
              ),
            )}
          </div>

          <div class="mt-3 space-y-2.5 border-t border-black/10 pt-3">
            {headerCopy.value.merch.comingSoon ? (
              <div class="rounded-xl border border-black/15 bg-black px-4 py-3 text-center text-sm font-bold text-white">
                {headerCopy.value.merch.label} • {headerCopy.value.merch.labelComingSoon}
              </div>
            ) : (
              <Link
                href="/merch"
                onClick$={closeMenu}
                class="theta-focus block rounded-xl border-2 border-black/20 bg-white px-4 py-3 text-center font-bold text-black"
              >
                {headerCopy.value.merch.label}
              </Link>
            )}

            <Link
              href="/events"
              onClick$={closeMenu}
              class="theta-focus block rounded-xl border-2 border-[var(--theta-primary)] bg-[var(--theta-primary)] px-4 py-3 text-center font-bold text-white shadow-[0_8px_18px_rgba(17,17,17,0.24)]"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
});
