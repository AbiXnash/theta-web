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
      <div class="relative mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" class="theta-focus flex items-center gap-3 rounded-xl p-1">
          <img
            src="/theta-logo.png"
            alt={headerCopy.value.logoAlt}
            width={120}
            height={60}
            class="h-10 w-auto invert sm:h-12"
            loading="eager"
            fetchPriority="high"
          />
          <span class="hidden text-lg font-extrabold tracking-[0.18em] text-neutral-900 sm:inline">
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

            const isActive = location.url.pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                class={[
                  "theta-focus relative rounded-xl px-4 py-2 text-sm font-bold tracking-wide text-neutral-700 transition hover:bg-neutral-100",
                  isActive && "bg-neutral-900 text-white",
                ]}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div class="hidden items-center gap-3 lg:flex">
          {headerCopy.value.merch.comingSoon ? (
            <span class="theta-badge border-black/25 bg-white text-neutral-900">
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

      <div
        class={[
          "relative z-10 lg:hidden border-t border-black/10 bg-white px-4 pb-4",
          open.value ? "block" : "hidden",
        ]}
      >
        <div class="mt-4 space-y-2">
          {headerCopy.value.navItems.map((item) =>
            item.active ? (
              <Link
                key={item.href}
                href={item.href}
                onClick$={closeMenu}
                class="theta-focus block rounded-xl border border-black/15 bg-white px-4 py-3 font-semibold text-neutral-900"
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
          <Link
            href="/events"
            onClick$={closeMenu}
            class="theta-focus mt-2 block rounded-xl border-2 border-[var(--theta-primary)] bg-[var(--theta-primary)] px-4 py-3 text-center font-bold text-white"
          >
            Register Now
          </Link>
        </div>
      </div>
    </header>
  );
});
