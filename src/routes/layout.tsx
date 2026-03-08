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
    repoSectionLabel?: string;
    repoLabel?: string;
    issuesLabel?: string;
    contributeLabel?: string;
    locationLabel: string;
    dateLabel: string;
    emailLabel: string;
    copyright: string;
    madeWithPrefix: string;
    madeBy: string;
    social?: {
      instagram?: string;
      twitter?: string;
      youtube?: string;
    };
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
    repoSectionLabel: "Project Repo",
    repoLabel: "Repository",
    issuesLabel: "Issues",
    contributeLabel: "Contribute",
    locationLabel: "SASTRA Deemed University",
    dateLabel: "April 11-13, 2026",
    emailLabel: "theta@sastra.edu",
    copyright: "© 2026 Theta. All rights reserved.",
    madeWithPrefix: "Made with",
    madeBy: "by WebTek Team",
    social: {
      instagram: "Instagram",
      twitter: "Twitter",
      youtube: "YouTube",
    },
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
    <div class="relative min-h-screen bg-neutral-100 text-neutral-900">
      <div class="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <img
          src="/sponsors/general/sastra-university-logo.jpg"
          alt=""
          width={1200}
          height={1200}
          aria-hidden="true"
          class="h-auto w-[72vw] max-w-[920px] opacity-[0.055] grayscale"
        />
      </div>

      <div class="relative z-10">
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

        <footer class="mx-auto mt-14 max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <div class="theta-shell relative overflow-hidden p-6 sm:p-8">
            <div class="pointer-events-none absolute -top-14 -right-16 h-44 w-44 rounded-full bg-[var(--theta-primary)]/12 blur-3xl"></div>
            <div class="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-black/10 blur-3xl"></div>

            <div class="relative grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <img src="/theta-logo.png" alt="Theta" width={140} height={70} class="h-12 w-auto invert" />
                <p class="mt-3 max-w-xs text-sm text-neutral-600">{copy.value.footer.description}</p>
                <div class="mt-4 inline-flex rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-bold tracking-[0.12em] text-neutral-600 uppercase">
                  Theta 2026
                </div>
              </div>

              <div>
                <h3 class="text-sm font-bold tracking-[0.14em] text-neutral-700 uppercase">{copy.value.footer.quickLinksTitle}</h3>
                <div class="mt-3 space-y-2 text-sm text-neutral-700">
                  <Link href="/" class="theta-focus block rounded-lg border border-transparent px-2 py-1.5 hover:border-black/10 hover:bg-white hover:text-[var(--theta-primary)]">{copy.value.footer.homeLabel}</Link>
                  <Link href="/events" class="theta-focus block rounded-lg border border-transparent px-2 py-1.5 hover:border-black/10 hover:bg-white hover:text-[var(--theta-primary)]">{copy.value.footer.eventsLabel}</Link>
                  <Link href="/contact" class="theta-focus block rounded-lg border border-transparent px-2 py-1.5 hover:border-black/10 hover:bg-white hover:text-[var(--theta-primary)]">{copy.value.footer.contactLabel}</Link>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-bold tracking-[0.14em] text-neutral-700 uppercase">{copy.value.footer.contactTitle}</h3>
                <div class="mt-3 space-y-2 text-sm text-neutral-600">
                  <p>{copy.value.footer.locationLabel}</p>
                  <p>{copy.value.footer.dateLabel}</p>
                  <a href={`mailto:${copy.value.footer.emailLabel}`} class="theta-focus inline-block rounded hover:text-[var(--theta-primary)]">
                    {copy.value.footer.emailLabel}
                  </a>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-bold tracking-[0.14em] text-neutral-700 uppercase">
                  {copy.value.footer.repoSectionLabel || "Connect"}
                </h3>
                <div class="mt-3 flex flex-wrap gap-2">
                  <a href="https://github.com/theta-web" target="_blank" rel="noreferrer" class="theta-focus rounded-full border border-black/15 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:-translate-y-0.5 hover:border-black/30 hover:text-black">
                    {copy.value.footer.repoLabel || "Repository"}
                  </a>
                  <a href="https://github.com/theta-web/issues" target="_blank" rel="noreferrer" class="theta-focus rounded-full border border-black/15 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:-translate-y-0.5 hover:border-black/30 hover:text-black">
                    {copy.value.footer.issuesLabel || "Issues"}
                  </a>
                  <a href="https://github.com/theta-web" target="_blank" rel="noreferrer" class="theta-focus rounded-full border border-black/15 bg-white px-3 py-1.5 text-xs font-bold text-neutral-700 hover:-translate-y-0.5 hover:border-black/30 hover:text-black">
                    {copy.value.footer.contributeLabel || "Contribute"}
                  </a>
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                  <a href="#" class="theta-focus rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-bold text-neutral-600 hover:border-black/30">{copy.value.footer.social?.instagram || "Instagram"}</a>
                  <a href="#" class="theta-focus rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-bold text-neutral-600 hover:border-black/30">{copy.value.footer.social?.twitter || "Twitter"}</a>
                  <a href="#" class="theta-focus rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-bold text-neutral-600 hover:border-black/30">{copy.value.footer.social?.youtube || "YouTube"}</a>
                </div>
              </div>
            </div>

            <div class="relative mt-8 border-t border-black/15 pt-4 text-xs text-neutral-700 sm:flex sm:items-center sm:justify-between">
              <p>{copy.value.footer.copyright}</p>
              <p class="mt-2 sm:mt-0">{copy.value.footer.madeWithPrefix} Qwik {copy.value.footer.madeBy}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
});
