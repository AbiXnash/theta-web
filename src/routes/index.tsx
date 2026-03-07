import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";

interface ConfigData {
  meta: {
    eventName: string;
    tagline: string;
    dates: string;
    venue: string;
  };
  stats: {
    events: string;
    participants: string;
    colleges: string;
  };
  about: {
    title: string;
    description: string;
    features: { title: string; description: string }[];
  };
  days: DayEvent[];
}

interface HomeCopy {
  hero: {
    bannerDate: string;
    titleMain: string;
    titleAccent: string;
    description: string;
    exploreEvents: string;
    contactUs: string;
  };
  countdownLabels: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
  about: {
    badge: string;
    titlePrefix: string;
    titleAccent: string;
    titleSuffix: string;
  };
  statsLabels: {
    events: string;
    participants: string;
    colleges: string;
  };
  sponsors: {
    badge: string;
    titlePrefix: string;
    titleAccent: string;
    platinum: string;
    gold: string;
    silver: string;
    general: string;
    sponsorPrompt: string;
    sponsorButton: string;
  };
  cta: {
    titlePrefix: string;
    titleAccent: string;
    description: string;
    browseEvents: string;
  };
  dayModal: {
    scheduleTitle: string;
    emptyState: string;
    viewAllEvents: string;
  };
}

interface EventItem {
  id: number;
  name: string;
  category: string;
  cluster?: string;
  day?: string;
  timing: string;
  location: string;
  fee: string;
  status: string;
  description: string;
  image: string;
  registrationUrl?: string;
}

interface DayEvent {
  day: string;
  date: string;
  events: string[];
  highlight: string;
  bgImage: string;
}

interface Sponsor {
  name: string;
  logo: string;
  order?: number;
}

interface SponsorsConfig {
  platinum: Sponsor[];
  gold: Sponsor[];
  silver?: Sponsor[];
  media?: Sponsor[];
}

const defaultHomeCopy: HomeCopy = {
  hero: {
    bannerDate: "March 15-17, 2026",
    titleMain: "THETA",
    titleAccent: "2026",
    description:
      "National Level Techno-Management Fest hosted by SASTRA Deemed University.",
    exploreEvents: "Explore Events",
    contactUs: "Contact Us",
  },
  countdownLabels: {
    days: "Days",
    hours: "Hours",
    minutes: "Mins",
    seconds: "Secs",
  },
  about: {
    badge: "About Theta",
    titlePrefix: "India's Premier",
    titleAccent: "Techno-Management",
    titleSuffix: "Fest",
  },
  statsLabels: {
    events: "Events",
    participants: "Participants",
    colleges: "Colleges",
  },
  sponsors: {
    badge: "Our Sponsors",
    titlePrefix: "Powered by",
    titleAccent: "Partners",
    platinum: "Platinum",
    gold: "Gold",
    silver: "Silver",
    general: "Media",
    sponsorPrompt: "Want to sponsor Theta 2026?",
    sponsorButton: "Become a Sponsor",
  },
  cta: {
    titlePrefix: "Ready to",
    titleAccent: "Compete?",
    description: "Build, ship, and showcase with the brightest teams in India.",
    browseEvents: "Browse Events",
  },
  dayModal: {
    scheduleTitle: "Day Schedule",
    emptyState: "Events will be announced soon.",
    viewAllEvents: "View All Events",
  },
};

const defaultConfig: ConfigData = {
  meta: {
    eventName: "Theta 2026",
    tagline: "National Level Techno-Management Fest",
    dates: "March 15-17, 2026",
    venue: "SASTRA Deemed University",
  },
  stats: {
    events: "50+",
    participants: "5000+",
    colleges: "100+",
  },
  about: {
    title: "About Theta",
    description:
      "Theta is a national-level techno-management fest organized by SASTRA Deemed University.",
    features: [
      { title: "30+ Events", description: "Competitions and workshops." },
      { title: "1000+ Participants", description: "From across India." },
      { title: "80+ Colleges", description: "Top talent meets here." },
    ],
  },
  days: [
    {
      day: "Day One",
      date: "March 15, 2026",
      events: ["Inauguration"],
      highlight: "Opening Ceremony",
      bgImage: "",
    },
    {
      day: "Day Two",
      date: "March 16, 2026",
      events: ["Hackathon"],
      highlight: "Flagship Competitions",
      bgImage: "",
    },
    {
      day: "Day Three",
      date: "March 17, 2026",
      events: ["Finale"],
      highlight: "Prize Distribution",
      bgImage: "",
    },
  ],
};

const defaultSponsors: SponsorsConfig = {
  platinum: [],
  gold: [],
  silver: [],
  media: [],
};

const parseStatNumber = (value: string): number => {
  const parsed = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * Parses a date range like "March 15-17, 2026" and returns the first day.
 * Falls back to Theta 2026 default start if parsing fails.
 */
const parseFestStart = (datesText: string): Date => {
  const match = datesText.match(
    /\b([A-Za-z]+)\s+(\d{1,2})(?:\s*[-–]\s*\d{1,2})?,\s*(\d{4})\b/,
  );
  if (match) {
    const [, month, day, year] = match;
    const parsed = new Date(`${month} ${day}, ${year} 09:00:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date("2026-03-15T09:00:00");
};

const dayAliases: Record<string, string[]> = {
  "Day One": ["Day 1", "Day One"],
  "Day Two": ["Day 2", "Day Two"],
  "Day Three": ["Day 3", "Day Three"],
};

const sponsorTiers = [
  { key: "platinum", label: "Platinum", large: true },
  { key: "gold", label: "Gold", large: false },
  { key: "silver", label: "Silver", large: false },
  { key: "media", label: "Media", large: false },
] as const;

export default component$(() => {
  const configData = useSignal<ConfigData>(defaultConfig);
  const homeCopy = useSignal<HomeCopy>(defaultHomeCopy);
  const sponsors = useSignal<SponsorsConfig>(defaultSponsors);
  const events = useSignal<EventItem[]>([]);

  const countdown = useSignal({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const counterDisplay = useSignal({ events: 0, participants: 0, colleges: 0 });
  const selectedDay = useSignal<DayEvent | null>(null);

  useVisibleTask$(async () => {
    try {
      const [cfgRes, sponsorRes, eventRes, contentRes] = await Promise.all([
        fetch("/data/config.json"),
        fetch("/data/sponsors.json"),
        fetch("/data/events.json"),
        fetch("/data/content.json"),
      ]);

      const cfg = (await cfgRes.json()) as Partial<ConfigData>;
      const sponsorPayload = (await sponsorRes.json()) as {
        sponsors?: SponsorsConfig;
      };
      const eventPayload = (await eventRes.json()) as { events?: EventItem[] };
      const content = (await contentRes.json()) as {
        home?: Partial<HomeCopy>;
        seo?: { homeTitle?: string; homeDescription?: string };
      };

      configData.value = {
        ...defaultConfig,
        ...cfg,
        meta: { ...defaultConfig.meta, ...(cfg.meta || {}) },
        stats: { ...defaultConfig.stats, ...(cfg.stats || {}) },
        about: {
          ...defaultConfig.about,
          ...(cfg.about || {}),
          features: cfg.about?.features || defaultConfig.about.features,
        },
        days: cfg.days || defaultConfig.days,
      };

      sponsors.value = {
        ...defaultSponsors,
        ...(sponsorPayload.sponsors || {}),
      };
      events.value = eventPayload.events || [];

      if (content.home) {
        homeCopy.value = {
          ...defaultHomeCopy,
          ...content.home,
          hero: { ...defaultHomeCopy.hero, ...(content.home.hero || {}) },
          countdownLabels: {
            ...defaultHomeCopy.countdownLabels,
            ...(content.home.countdownLabels || {}),
          },
          about: { ...defaultHomeCopy.about, ...(content.home.about || {}) },
          statsLabels: {
            ...defaultHomeCopy.statsLabels,
            ...(content.home.statsLabels || {}),
          },
          sponsors: {
            ...defaultHomeCopy.sponsors,
            ...(content.home.sponsors || {}),
          },
          cta: { ...defaultHomeCopy.cta, ...(content.home.cta || {}) },
          dayModal: {
            ...defaultHomeCopy.dayModal,
            ...(content.home.dayModal || {}),
          },
        };
      }

      if (content.seo?.homeTitle) {
        document.title = content.seo.homeTitle;
      }
      if (content.seo?.homeDescription) {
        let tag = document.querySelector('meta[name="description"]');
        if (!tag) {
          tag = document.createElement("meta");
          tag.setAttribute("name", "description");
          document.head.appendChild(tag);
        }
        tag.setAttribute("content", content.seo.homeDescription);
      }
    } catch {
      configData.value = defaultConfig;
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => configData.value.meta.dates);
    // Keep countdown aligned to the configured festival date string in config.json.
    const fest = parseFestStart(configData.value.meta.dates).getTime();
    const sync = () => {
      const diff = Math.max(0, fest - Date.now());
      countdown.value = {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };

    sync();
    const id = setInterval(sync, 1000);
    return () => clearInterval(id);
  });

  useVisibleTask$(() => {
    const node = document.getElementById("theta-stats");
    if (!node) return;

    const targets = {
      events: parseStatNumber(configData.value.stats.events),
      participants: parseStatNumber(configData.value.stats.participants),
      colleges: parseStatNumber(configData.value.stats.colleges),
    };

    const animate = () => {
      const start = performance.now();
      const duration = 1000;

      const step = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        counterDisplay.value = {
          events: Math.floor(targets.events * progress),
          participants: Math.floor(targets.participants * progress),
          colleges: Math.floor(targets.colleges * progress),
        };
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  });

  useVisibleTask$(({ track }) => {
    track(() => selectedDay.value);
    if (!selectedDay.value) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        selectedDay.value = null;
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const openDay = $((day: DayEvent) => {
    selectedDay.value = day;
  });

  const closeDay = $(() => {
    selectedDay.value = null;
  });

  const getDayEvents = (dayName: string) => {
    const variants = dayAliases[dayName] || [dayName];
    return events.value.filter((item) => (item.day ? variants.includes(item.day) : false));
  };

  return (
    <div class="relative overflow-hidden bg-neutral-100 pb-16 text-neutral-900">
      <div class="theta-noise pointer-events-none absolute inset-0 opacity-20"></div>

      <section class="relative mx-auto mt-8 max-w-7xl px-4 pt-12 pb-14 sm:px-6 lg:grid lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pt-16">
        <div>
          <span class="theta-badge inline-flex items-center gap-2 border-black/20 text-neutral-900">
            <span class="h-2 w-2 rounded-full bg-[var(--theta-primary)]"></span>
            {configData.value.meta.dates}
          </span>
          <h1 class="mt-5 text-5xl leading-[0.9] font-extrabold tracking-tight sm:text-7xl">
            <span class="block">{homeCopy.value.hero.titleMain}</span>
            <span class="theta-gradient-text block">{homeCopy.value.hero.titleAccent}</span>
          </h1>
          <p class="mt-4 max-w-xl text-base text-neutral-600 sm:text-lg">
            {configData.value.meta.tagline}
            <br />
            {configData.value.meta.venue}
          </p>

          <div class="mt-6 flex flex-wrap gap-3">
            <span class="theta-sticker animate-theta-float">⚡ Hackathons</span>
            <span class="theta-sticker animate-theta-float [animation-delay:100ms]">🤖 Robotics</span>
            <span class="theta-sticker animate-theta-float [animation-delay:200ms]">🎨 Design</span>
            <span class="theta-sticker animate-theta-float [animation-delay:300ms]">🚀 Aerospace</span>
          </div>

          <div class="mt-8 flex flex-wrap gap-3">
            <Link
              href="/events"
              class="theta-focus rounded-xl border-2 border-[var(--theta-primary)] bg-[var(--theta-primary)] px-6 py-3 text-sm font-bold text-white"
            >
              Register Now
            </Link>
            <Link
              href="/events"
              class="theta-focus rounded-xl border-2 border-black/20 bg-white px-6 py-3 text-sm font-bold text-black"
            >
              {homeCopy.value.hero.exploreEvents}
            </Link>
          </div>
        </div>

        <div class="mt-10 lg:mt-0">
          <div class="theta-shell relative overflow-hidden p-6 sm:p-7">
            <div class="absolute -top-12 -right-6 h-28 w-28 rounded-full bg-[var(--theta-primary)]/35 blur-2xl"></div>
            <div class="theta-panel animate-theta-pulse relative p-5">
              <p class="text-xs tracking-[0.22em] text-neutral-600 uppercase">{configData.value.meta.eventName}</p>
              <p class="mt-2 text-3xl font-black">{configData.value.meta.dates}</p>
              <p class="mt-1 text-sm text-neutral-700">{configData.value.meta.venue}</p>
            </div>

            <div class="mt-5 grid grid-cols-4 gap-3">
              {[
                { label: homeCopy.value.countdownLabels.days, value: countdown.value.days },
                { label: homeCopy.value.countdownLabels.hours, value: countdown.value.hours },
                { label: homeCopy.value.countdownLabels.minutes, value: countdown.value.minutes },
                { label: homeCopy.value.countdownLabels.seconds, value: countdown.value.seconds },
              ].map((unit) => (
                <div key={unit.label} class="theta-digital p-3 text-center">
                  <p class="text-2xl font-black tabular-nums text-neutral-900">{String(unit.value).padStart(2, "0")}</p>
                  <p class="mt-1 text-[10px] tracking-wider text-neutral-700 uppercase">{unit.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="mb-6 flex items-end justify-between">
          <h2 class="text-3xl font-extrabold">Festival Days</h2>
          <span class="theta-badge border-black/15 text-neutral-600">Comic Panels</span>
        </div>
        <div class="grid gap-6 lg:grid-cols-3">
          {configData.value.days.map((day, index) => (
            <button
              key={day.day}
              onClick$={() => openDay(day)}
              class="theta-focus theta-panel group relative overflow-hidden p-0 text-left"
            >
              <div class="absolute inset-0 bg-cover bg-center opacity-35 transition duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${day.bgImage})` }}
              ></div>
              <div class="absolute inset-0 bg-gradient-to-b from-black/15 to-black/70"></div>
              <div class="relative p-6">
                <span class="theta-badge border-white/45 bg-black/45 text-white">Day {index + 1}</span>
                <h3 class="mt-3 text-3xl font-extrabold text-white">{day.day}</h3>
                <p class="mt-1 text-sm text-white/80">{day.date}</p>
                <p class="mt-6 text-sm text-white/85">{day.events.length} events</p>
                <p class="mt-1 text-sm font-semibold text-violet-200">{day.highlight}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <span class="theta-badge border-black/20 text-neutral-600">{homeCopy.value.about.badge}</span>
        <h2 class="mt-4 text-4xl leading-tight font-extrabold">
          {homeCopy.value.about.titlePrefix} <span class="text-[var(--theta-primary)]">{homeCopy.value.about.titleAccent}</span> {homeCopy.value.about.titleSuffix}
        </h2>
        <p class="mt-3 max-w-3xl text-neutral-600">{configData.value.about.description}</p>
        <div class="mt-8 grid gap-5 md:grid-cols-3">
          {configData.value.about.features.slice(0, 3).map((feature, idx) => (
            <article key={feature.title} class="theta-panel p-6">
              <span class="theta-badge border-black/20 text-neutral-900">0{idx + 1}</span>
              <h3 class="mt-4 text-2xl font-extrabold">{feature.title}</h3>
              <p class="mt-2 text-sm text-neutral-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="theta-stats" class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid gap-5 md:grid-cols-3">
          <div class="theta-panel p-6 text-center">
            <p class="text-5xl font-black text-[var(--theta-primary)]">{counterDisplay.value.events}+</p>
            <p class="mt-2 text-sm text-neutral-600">{homeCopy.value.statsLabels.events}</p>
          </div>
          <div class="theta-panel p-6 text-center">
            <p class="text-5xl font-black text-[var(--theta-primary)]">{counterDisplay.value.participants}+</p>
            <p class="mt-2 text-sm text-neutral-600">{homeCopy.value.statsLabels.participants}</p>
          </div>
          <div class="theta-panel p-6 text-center">
            <p class="text-5xl font-black text-[var(--theta-primary)]">{counterDisplay.value.colleges}+</p>
            <p class="mt-2 text-sm text-neutral-600">{homeCopy.value.statsLabels.colleges}</p>
          </div>
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <span class="theta-badge border-black/20 text-neutral-600">Sponsors</span>
        <h2 class="mt-4 text-4xl font-extrabold">
          {homeCopy.value.sponsors.titlePrefix} <span class="text-[var(--theta-primary)]">{homeCopy.value.sponsors.titleAccent}</span>
        </h2>

        <div class="mt-8 space-y-8">
          {sponsorTiers.map((tier) => {
            const list = sponsors.value[tier.key] || [];
            if (!Array.isArray(list) || list.length === 0) return null;

            return (
              <div key={tier.key}>
                <h3 class="mb-4 text-xl font-extrabold text-neutral-900">{tier.label}</h3>
                <div class={[
                  "grid gap-4",
                  tier.large ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2 lg:grid-cols-5",
                ]}>
                  {list
                    .slice()
                    .sort((a, b) => (a.order || 999) - (b.order || 999))
                    .map((item) => (
                      <div
                        key={item.name}
                        class={[
                          "theta-shell group flex items-center justify-center p-4 transition",
                          tier.large
                            ? "min-h-32"
                            : tier.key === "media"
                              ? "min-h-32"
                              : "min-h-24",
                        ]}
                      >
                        <img
                          src={item.logo}
                          alt={item.name}
                          width={180}
                          height={90}
                          loading="lazy"
                          class={[
                            "w-auto object-contain transition duration-300",
                            tier.large
                              ? "max-h-20"
                              : tier.key === "media"
                                ? "max-h-24"
                                : "max-h-16",
                          ]}
                        />
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section class="mx-auto max-w-7xl px-4 pt-6 pb-6 sm:px-6 lg:px-8">
        <div class="theta-shell flex flex-col items-start justify-between gap-4 p-7 sm:flex-row sm:items-center">
          <div>
            <h3 class="text-3xl font-extrabold">
              {homeCopy.value.cta.titlePrefix} <span class="text-[var(--theta-primary)]">{homeCopy.value.cta.titleAccent}</span>
            </h3>
            <p class="mt-2 text-sm text-neutral-600">{homeCopy.value.cta.description}</p>
          </div>
          <Link
            href="/events"
            class="theta-focus rounded-xl border-2 border-white bg-white px-6 py-3 text-sm font-bold text-black"
          >
            {homeCopy.value.cta.browseEvents}
          </Link>
        </div>
      </section>

      {selectedDay.value && (
        <div class="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button class="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick$={closeDay} aria-label="Close day modal"></button>
          <div class="theta-shell relative z-10 w-full max-w-2xl p-5 sm:p-7" role="dialog" aria-modal="true" aria-label="Day events">
            <button
              type="button"
              onClick$={closeDay}
              class="theta-focus absolute top-3 right-3 rounded-lg border border-black/15 px-3 py-1 text-sm"
            >
              Close
            </button>
            <h3 class="text-3xl font-extrabold">{selectedDay.value.day}</h3>
            <p class="mt-1 text-sm text-neutral-600">{selectedDay.value.date}</p>
            <p class="mt-4 text-sm text-[var(--theta-primary)]">{homeCopy.value.dayModal.scheduleTitle}</p>
            <div class="mt-4 space-y-3">
              {getDayEvents(selectedDay.value.day).length > 0 ? (
                getDayEvents(selectedDay.value.day).map((event) => (
                  <div key={event.id} class="theta-panel p-4">
                    <p class="font-bold">{event.name}</p>
                    <p class="mt-1 text-sm text-neutral-600">{event.timing} • {event.location}</p>
                  </div>
                ))
              ) : (
                <p class="text-sm text-neutral-600">{homeCopy.value.dayModal.emptyState}</p>
              )}
            </div>
            <Link
              href="/events"
              class="theta-focus mt-6 inline-flex rounded-xl border-2 border-[var(--theta-primary)] bg-[var(--theta-primary)] px-5 py-2.5 text-sm font-bold text-white"
            >
              {homeCopy.value.dayModal.viewAllEvents}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
});
