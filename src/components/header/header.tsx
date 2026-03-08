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
            class="theta-focus rounded-xl border-2 border-[var(--theta-primary)] bg-[var(--theta-primary)] px-4 py-2 text-sm font-bold text-white shadow-[0_8px_20px_rgba(124,58,237,0.35)]"
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

      <div class={["fixed inset-0 z-40 lg:hidden transition", open.value ? "pointer-events-auto" : "pointer-events-none"]}>
        <button
          type="button"
          aria-label="Close menu overlay"
          onClick$={closeMenu}
          class={[
            "absolute inset-0 bg-black/35 backdrop-blur-[1px] transition-opacity duration-200",
            open.value ? "opacity-100" : "opacity-0",
          ]}
        ></button>

        <aside
          class={[
            "absolute top-0 right-0 h-full w-[84vw] max-w-[360px] border-l-2 border-black/20 bg-white p-5 shadow-[-10px_0_30px_rgba(0,0,0,0.2)] transition-transform duration-250",
            open.value ? "translate-x-0" : "translate-x-full",
          ]}
        >
          <div class="mb-5 flex items-center justify-between">
            <p class="text-xs font-extrabold tracking-[0.16em] text-neutral-500 uppercase">Navigation</p>
            <button
              type="button"
              onClick$={closeMenu}
              class="theta-focus rounded-lg border border-black/20 bg-white px-2.5 py-1 text-sm font-bold text-neutral-700"
            >
              Close
            </button>
          </div>

          <div class="space-y-2.5">
            {headerCopy.value.navItems.map((item) =>
              item.active ? (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick$={closeMenu}
                  class={[
                    "theta-focus block rounded-xl border-2 px-4 py-3 text-base font-extrabold",
                    isPathActive(item.href, location.url.pathname)
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-black/15 bg-white text-neutral-900",
                  ]}
                >
                  {item.label}
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

          <div class="mt-5 space-y-2">
            {headerCopy.value.merch.comingSoon ? (
              <div class="rounded-xl border border-black/20 bg-black px-4 py-3 text-center text-sm font-bold text-white">
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
              class="theta-focus block rounded-xl border-2 border-[var(--theta-primary)] bg-[var(--theta-primary)] px-4 py-3 text-center font-bold text-white"
            >
              Register Now
            </Link>
          </div>
        </aside>
      </div>
      <div class="border-t border-black/5 lg:hidden"></div>
    </header>
  );
});
