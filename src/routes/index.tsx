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

const sponsorTierStyles: Record<
  (typeof sponsorTiers)[number]["key"],
  { chip: string; border: string }
> = {
  platinum: { chip: "bg-black text-white", border: "border-black" },
  gold: { chip: "bg-[#fef3c7] text-[#92400e]", border: "border-[#f59e0b]" },
  silver: { chip: "bg-[#e5e7eb] text-[#1f2937]", border: "border-[#9ca3af]" },
  media: { chip: "bg-[#ede9fe] text-[#5b21b6]", border: "border-[#7c3aed]" },
};

export default component$(() => {
  const configData = useSignal<ConfigData>(defaultConfig);
  const homeCopy = useSignal<HomeCopy>(defaultHomeCopy);
  const sponsors = useSignal<SponsorsConfig>(defaultSponsors);
  const events = useSignal<EventItem[]>([]);

  const countdown = useSignal({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const counterDisplay = useSignal({ events: 0, participants: 0, colleges: 0 });
  const selectedDay = useSignal<DayEvent | null>(null);
  const selectedSponsorTier = useSignal<(typeof sponsorTiers)[number]["key"] | null>(
    null,
  );

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

  useVisibleTask$(({ track }) => {
    track(() => selectedSponsorTier.value);
    if (!selectedSponsorTier.value) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        selectedSponsorTier.value = null;
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  useVisibleTask$(() => {
    const lanes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-marquee-lane='true']"),
    );
    if (lanes.length === 0) return;

    const cleanups: Array<() => void> = [];

    for (const lane of lanes) {
      const track = lane.querySelector<HTMLElement>("[data-marquee-track='true']");
      if (!track) continue;

      let resumeTimer: ReturnType<typeof setTimeout> | undefined;

      const pause = () => {
        track.style.animationPlayState = "paused";
        if (resumeTimer) clearTimeout(resumeTimer);
        resumeTimer = setTimeout(() => {
          track.style.animationPlayState = "running";
        }, 1400);
      };

      const onPointerDown = () => pause();
      const onTouchStart = () => pause();
      const onWheel = () => pause();
      const onScroll = () => pause();

      lane.addEventListener("pointerdown", onPointerDown);
      lane.addEventListener("touchstart", onTouchStart, { passive: true });
      lane.addEventListener("wheel", onWheel, { passive: true });
      lane.addEventListener("scroll", onScroll, { passive: true });

      cleanups.push(() => {
        lane.removeEventListener("pointerdown", onPointerDown);
        lane.removeEventListener("touchstart", onTouchStart);
        lane.removeEventListener("wheel", onWheel);
        lane.removeEventListener("scroll", onScroll);
        if (resumeTimer) clearTimeout(resumeTimer);
      });
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  });

  const openDay = $((day: DayEvent) => {
    selectedDay.value = day;
  });

  const closeDay = $(() => {
    selectedDay.value = null;
  });

  const openSponsorTierModal = $((tier: (typeof sponsorTiers)[number]["key"]) => {
    selectedSponsorTier.value = tier;
  });

  const closeSponsorTierModal = $(() => {
    selectedSponsorTier.value = null;
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
        <div class="theta-shell relative overflow-hidden p-6 sm:p-8 lg:p-10">
          <div class="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-[var(--theta-primary)]/15 blur-3xl"></div>
          <div class="pointer-events-none absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-black/10 blur-3xl"></div>

          <div class="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <span class="theta-badge border-black/20 text-neutral-700">Sponsor Hall</span>
              <h2 class="mt-4 text-4xl font-extrabold sm:text-5xl">
                {homeCopy.value.sponsors.titlePrefix}{" "}
                <span class="text-[var(--theta-primary)]">{homeCopy.value.sponsors.titleAccent}</span>
              </h2>
              <p class="mt-2 max-w-2xl text-sm text-neutral-600 sm:text-base">
                Extraordinary partners who make Theta 2026 bigger, louder, and more memorable.
              </p>
            </div>
            <span class="theta-sticker rotate-[-4deg]">Powered by Legends</span>
          </div>

          <div class="relative mt-8 space-y-8">
            {(() => {
              const availableTiers = sponsorTiers.filter((tier) => {
                const list = sponsors.value[tier.key] || [];
                return Array.isArray(list) && list.length > 0;
              });
              if (availableTiers.length === 0) return null;

              return (
                <div class="space-y-4">
                  {availableTiers.map((tier, tierIndex) => {
                    const tierStyle = sponsorTierStyles[tier.key];
                    const list = (sponsors.value[tier.key] || [])
                      .slice()
                      .sort((a, b) => (a.order || 999) - (b.order || 999));
                    const shouldAnimate = tier.key === "platinum" || list.length > 4;
                    const visibleItems = shouldAnimate ? [...list, ...list] : list;

                    return (
                      <section
                        key={`sponsor-lane-${tier.key}`}
                        class={["rounded-2xl border-2 bg-white/70 p-3 sm:p-4", tierStyle.border]}
                      >
                        <div class="flex w-full items-center justify-between gap-3 rounded-xl px-2 py-2 text-left">
                          <div class="flex items-center gap-3">
                            <h3 class="text-lg font-extrabold text-neutral-900 sm:text-xl">
                              {tier.label}
                            </h3>
                            <span
                              class={[
                                "rounded-full border-2 px-3 py-1 text-[11px] font-bold tracking-wide sm:text-xs",
                                tierStyle.chip,
                              ]}
                            >
                                {list.length} Partners
                              </span>
                          </div>
                          <span class="text-xs font-bold tracking-wider text-neutral-500 uppercase">
                            Swipe
                          </span>
                        </div>

                        <div
                          data-marquee-lane={shouldAnimate ? "true" : "false"}
                          class={[
                            "mt-3 -mx-1 px-1 pb-2",
                            shouldAnimate
                              ? "theta-marquee-lane overflow-x-auto"
                              : "overflow-visible",
                          ]}
                        >
                          <div
                            data-marquee-track={shouldAnimate ? "true" : "false"}
                            class={[
                              "flex gap-3 py-2",
                              shouldAnimate ? "min-w-max" : "w-full flex-wrap justify-center",
                              shouldAnimate &&
                                (tierIndex % 2 === 0
                                  ? "animate-[thetaMarqueeLeft_24s_linear_infinite]"
                                  : "animate-[thetaMarqueeLeft_28s_linear_infinite]"),
                            ]}
                          >
                            {visibleItems.map((item, index) => (
                            <article
                              key={`${tier.key}-${item.name}-${index}`}
                              onClick$={() => openSponsorTierModal(tier.key)}
                              class={[
                                "theta-sponsor-card theta-focus group min-w-[10.5rem] cursor-pointer p-3 text-center sm:min-w-[12rem]",
                                index % 2 === 0 ? "rotate-[-0.6deg]" : "rotate-[0.6deg]",
                                !shouldAnimate &&
                                  "animate-[thetaIdleDrift_3.2s_ease-in-out_infinite]",
                              ]}
                              style={
                                !shouldAnimate
                                  ? { animationDelay: `${index * 180}ms` }
                                  : undefined
                              }
                            >
                              <div class="flex min-h-20 items-center justify-center sm:min-h-24">
                                <img
                                  src={item.logo}
                                  alt={item.name}
                                  width={220}
                                  height={110}
                                  loading="lazy"
                                  class="relative z-10 max-h-14 w-auto object-contain transition duration-300 group-hover:scale-105 sm:max-h-16"
                                />
                              </div>
                              <p class="relative z-10 mt-2 text-[10px] font-bold tracking-[0.06em] text-neutral-700 uppercase sm:text-xs">
                                {item.name}
                              </p>
                              <p class="mt-1 text-[9px] font-semibold tracking-wider text-[var(--theta-primary)] uppercase">
                                View Tier
                              </p>
                            </article>
                          ))}
                        </div>
                        </div>
                      </section>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {selectedSponsorTier.value &&
        (() => {
          const tier = sponsorTiers.find((item) => item.key === selectedSponsorTier.value);
          if (!tier) return null;
          const tierStyle = sponsorTierStyles[tier.key];
          const tierSponsors = (sponsors.value[tier.key] || [])
            .slice()
            .sort((a, b) => (a.order || 999) - (b.order || 999));

          return (
            <div class="fixed inset-0 z-[85] flex items-center justify-center p-3 sm:p-5">
              <button
                type="button"
                onClick$={closeSponsorTierModal}
                class="absolute inset-0 bg-black/50 backdrop-blur-sm"
                aria-label="Close sponsors modal"
              ></button>

              <div class="theta-shell animate-[thetaPulse_1.6s_ease-in-out_1] relative z-10 max-h-[92vh] w-full max-w-5xl overflow-auto p-5 sm:p-7">
                <button
                  type="button"
                  onClick$={closeSponsorTierModal}
                  class="theta-focus absolute top-3 right-3 rounded-lg border border-black/20 bg-white px-3 py-1 text-sm font-bold text-neutral-800"
                >
                  Close
                </button>

                <div class="mb-5 flex flex-wrap items-center justify-between gap-3 pr-16">
                  <h3 class="text-2xl font-extrabold text-neutral-900 sm:text-3xl">
                    {tier.label} Sponsors
                  </h3>
                  <span
                    class={[
                      "rounded-full border-2 px-3 py-1 text-xs font-bold tracking-wide",
                      tierStyle.chip,
                    ]}
                  >
                    {tierSponsors.length} Partners
                  </span>
                </div>

                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tierSponsors.map((item, index) => (
                    <article
                      key={`modal-${tier.key}-${item.name}`}
                      class={[
                        "theta-sponsor-card group flex min-h-36 flex-col items-center justify-center bg-white p-4 text-center",
                        index % 2 === 0 ? "rotate-[-0.4deg]" : "rotate-[0.4deg]",
                      ]}
                    >
                      <img
                        src={item.logo}
                        alt={item.name}
                        width={220}
                        height={110}
                        loading="lazy"
                        class="relative z-10 max-h-16 w-auto object-contain transition duration-300 group-hover:scale-105"
                      />
                      <p class="relative z-10 mt-3 text-xs font-bold tracking-[0.08em] text-neutral-700 uppercase">
                        {item.name}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

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
