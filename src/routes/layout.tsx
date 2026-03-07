import { $, component$, Slot, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Header } from "~/components/header/header";

interface LayoutCopy {
  underDevelopment: {
    ariaLabel: string;
    title: string;
    subtitle: string;
  };
  footer: {
    description: string;
    quickLinksTitle: string;
    contactTitle: string;
    homeLabel: string;
    eventsLabel: string;
    contactLabel: string;
    locationLabel: string;
    dateLabel: string;
    emailLabel: string;
    copyright: string;
    madeWithPrefix: string;
    madeBy: string;
  };
}

const defaultLayoutCopy: LayoutCopy = {
  underDevelopment: {
    ariaLabel: "Show development notice",
    title: "Website Under Development",
    subtitle: "Changes may occur",
  },
  footer: {
    description:
      "Theta is SASTRA's national-level techno-management fest. Join us for competitions, workshops, and community.",
    quickLinksTitle: "Quick Links",
    contactTitle: "Contact",
    homeLabel: "Home",
    eventsLabel: "Events",
    contactLabel: "Contact",
    locationLabel: "SASTRA Deemed University",
    dateLabel: "March 15-17, 2026",
    emailLabel: "theta@sastra.edu",
    copyright: "© 2026 Theta. All rights reserved.",
    madeWithPrefix: "Made with",
    madeBy: "by WebTek Team",
  },
};

export default component$(() => {
  const underDev = useSignal(true);
  const toastOpen = useSignal(false);
  const copy = useSignal<LayoutCopy>(defaultLayoutCopy);

  useVisibleTask$(() => {
    underDev.value = import.meta.env.PUBLIC_UNDER_DEV !== "false";
  });

  useVisibleTask$(async () => {
    try {
      const res = await fetch("/data/content.json");
      const data = (await res.json()) as {
        layout?: Partial<LayoutCopy>;
      };

      if (data.layout) {
        copy.value = {
          underDevelopment: {
            ...defaultLayoutCopy.underDevelopment,
            ...(data.layout.underDevelopment || {}),
          },
          footer: {
            ...defaultLayoutCopy.footer,
            ...(data.layout.footer || {}),
          },
        };
      }
    } catch {
      copy.value = defaultLayoutCopy;
    }
  });

  const showDev = $(() => {
    toastOpen.value = true;
    setTimeout(() => {
      toastOpen.value = false;
    }, 1700);
  });

  return (
    <div class="min-h-screen bg-neutral-100 text-neutral-900">
      <Header />
      <main class="pt-20">
        <Slot />
      </main>

      {underDev.value && (
        <div class="fixed right-4 bottom-4 z-[95]">
          <button
            type="button"
            onClick$={showDev}
            aria-label={copy.value.underDevelopment.ariaLabel}
            class="theta-focus flex h-10 w-10 items-center justify-center rounded-full border border-black/20 bg-neutral-100"
          >
            !
          </button>
          {toastOpen.value && (
            <div class="theta-shell absolute right-0 bottom-12 w-48 p-3 text-xs">
              <p>{copy.value.underDevelopment.title}</p>
              <p class="mt-1 text-neutral-600">{copy.value.underDevelopment.subtitle}</p>
            </div>
          )}
        </div>
      )}

      <footer class="mx-auto mt-16 max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div class="theta-shell p-6 sm:p-8">
          <div class="grid gap-8 md:grid-cols-3">
            <div>
              <img src="/theta-logo.png" alt="Theta" width={140} height={70} class="h-12 w-auto invert" />
              <p class="mt-3 text-sm text-neutral-600">{copy.value.footer.description}</p>
            </div>
            <div>
              <h3 class="text-sm font-bold tracking-wider uppercase">{copy.value.footer.quickLinksTitle}</h3>
              <div class="mt-3 space-y-2 text-sm text-neutral-700">
                <Link href="/" class="theta-focus block rounded px-2 py-1 hover:text-[var(--theta-primary)]">{copy.value.footer.homeLabel}</Link>
                <Link href="/events" class="theta-focus block rounded px-2 py-1 hover:text-[var(--theta-primary)]">{copy.value.footer.eventsLabel}</Link>
                <Link href="/contact" class="theta-focus block rounded px-2 py-1 hover:text-[var(--theta-primary)]">{copy.value.footer.contactLabel}</Link>
              </div>
            </div>
            <div>
              <h3 class="text-sm font-bold tracking-wider uppercase">{copy.value.footer.contactTitle}</h3>
              <div class="mt-3 space-y-2 text-sm text-neutral-600">
                <p>{copy.value.footer.locationLabel}</p>
                <p>{copy.value.footer.dateLabel}</p>
                <p>{copy.value.footer.emailLabel}</p>
              </div>
            </div>
          </div>
          <div class="mt-8 border-t border-black/15 pt-4 text-xs text-neutral-700 sm:flex sm:items-center sm:justify-between">
            <p>{copy.value.footer.copyright}</p>
            <p class="mt-2 sm:mt-0">{copy.value.footer.madeWithPrefix} Qwik {copy.value.footer.madeBy}</p>
          </div>
        </div>
      </footer>
    </div>
  );
});
