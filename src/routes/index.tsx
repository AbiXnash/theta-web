import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

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
  cta: {
    registerTitle: string;
    registerDescription: string;
    registerButton: string;
    eventsButton: string;
  };
}

interface Sponsor {
  name: string;
  logo: string;
}

interface SponsorsConfig {
  platinum: Sponsor[];
  gold: Sponsor[];
  silver?: Sponsor[];
  general?: Sponsor[];
}

interface Event {
  id: number;
  name: string;
  category: "tech" | "fun" | "quiz" | "workshop" | "pro-night";
  cluster?: string;
  day: string;
  timing: string;
  location: string;
  fee: string;
  status: "active" | "over" | "coming-soon";
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

export default component$(() => {
  const defaultDays: DayEvent[] = [
    {
      day: "Day One",
      date: "March 15, 2026",
      events: ["Inauguration", "Robotics Workshop", "Tech Quiz"],
      highlight: "SASTRA Singing Team Performance",
      bgImage:
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=60",
    },
    {
      day: "Day Two",
      date: "March 16, 2026",
      events: ["Code Battle", "Hackathon", "Project Expo"],
      highlight: "SASTRA Dance Team Performance",
      bgImage:
        "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=800&q=60",
    },
    {
      day: "Day Three",
      date: "March 17, 2026",
      events: ["Prize Distribution", "Valedictory"],
      highlight: "External Team Pro Nite",
      bgImage:
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=60",
    },
  ];

  const days = useSignal<DayEvent[]>(defaultDays);

  const targetDate = new Date("2026-03-15T09:00:00");

  const timeLeft = useSignal({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const configData = useSignal<ConfigData | null>(null);
  const sponsorsData = useSignal<SponsorsConfig | null>(null);
  const eventsData = useSignal<Event[]>([]);
  const selectedDay = useSignal<string | null>(null);
  const showDayModal = useSignal(false);

  const defaultSponsors: SponsorsConfig = {
    platinum: [
      { name: "TechCorp", logo: "/sponsors/techcorp.png" },
      { name: "InnovateHub", logo: "/sponsors/innovatehub.png" },
      { name: "FutureTech", logo: "/sponsors/futuretech.png" },
      { name: "CodeLabs", logo: "/sponsors/codelabs.png" },
    ],
    gold: [
      { name: "StartUp", logo: "/sponsors/startup.png" },
      { name: "DevCo", logo: "/sponsors/devco.png" },
      { name: "CloudSys", logo: "/sponsors/cloudsys.png" },
      { name: "DataFlow", logo: "/sponsors/dataflow.png" },
      { name: "AI Labs", logo: "/sponsors/ailabs.png" },
      { name: "WebWorks", logo: "/sponsors/webworks.png" },
    ],
    silver: [
      { name: "TechStart", logo: "/sponsors/techstart.png" },
      { name: "ByteSize", logo: "/sponsors/bytesize.png" },
    ],
    general: [{ name: "Local Shop", logo: "/sponsors/local.png" }],
  };

  useVisibleTask$(async () => {
    try {
      const res = await fetch("/config.json");
      const data = await res.json();
      configData.value = data;
    } catch {
      console.log("Failed to load config");
    }
  });

  useVisibleTask$(async () => {
    try {
      const res = await fetch("/sponsors.json");
      const data = await res.json();
      sponsorsData.value = data.sponsors || data;
    } catch {
      sponsorsData.value = defaultSponsors;
    }
  });

  useVisibleTask$(async () => {
    try {
      const res = await fetch("/events.json");
      const data = await res.json();
      if (data.events) {
        eventsData.value = data.events;
      }
    } catch {
      console.log("Using default events");
    }
  });

  const openDayModal = $((day: string) => {
    selectedDay.value = day;
    showDayModal.value = true;
  });

  const closeDayModal = $(() => {
    showDayModal.value = false;
    selectedDay.value = null;
  });

  const getDayEvents = (dayName: string) => {
    const dayMap: Record<string, string> = {
      "Day One": "Day 1",
      "Day Two": "Day 2",
      "Day Three": "Day 3",
    };
    return eventsData.value.filter(
      (e) => e.day === dayMap[dayName] || e.day === dayName,
    );
  };

  const defaultClusters = [
    { id: "csi", name: "CSI", color: "#6366f1" },
    { id: "iedc", name: "IEDC", color: "#ec4899" },
    { id: "ieee", name: "IEEE", color: "#14b8a6" },
    { id: "asme", name: "ASME", color: "#f59e0b" },
    { id: "sae", name: "SAE", color: "#ef4444" },
    { id: "nss", name: "NSS", color: "#10b981" },
    { id: "theta", name: "Theta", color: "#8b5cf6" },
  ];

  const getClusterColor = (clusterId: string) => {
    const cluster = defaultClusters.find((c) => c.id === clusterId);
    return cluster?.color || "#8b5cf6";
  };

  const getClusterName = (clusterId: string) => {
    const cluster = defaultClusters.find((c) => c.id === clusterId);
    return cluster?.name || clusterId;
  };

  useVisibleTask$(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff > 0) {
        timeLeft.value = {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        };
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  });

  const homeStats = [
    { value: configData.value?.stats.events ?? "50+", label: "Events" },
    {
      value: configData.value?.stats.participants ?? "5000+",
      label: "Participants",
    },
    { value: configData.value?.stats.colleges ?? "100+", label: "Colleges" },
  ];

  return (
    <div class="bg-gray-950">
      {/* Hero Section */}
      <section class="relative min-h-[calc(100vh-4rem)] overflow-hidden pt-20 sm:pt-24 lg:pt-32">
        <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-gray-900"></div>
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=60')] bg-cover bg-center opacity-15"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent"></div>

        {/* Animated orbs */}
        <div class="absolute top-1/4 -left-32 h-48 w-48 rounded-full bg-violet-500/20 blur-[80px] lg:h-64 lg:w-64"></div>
        <div class="absolute top-1/2 -right-32 h-48 w-48 rounded-full bg-purple-500/15 blur-[80px] lg:h-64 lg:w-64"></div>

        <div class="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div class="mb-6 flex items-center justify-center lg:justify-start">
            <div class="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 backdrop-blur-sm">
              <span class="h-2 w-2 animate-pulse rounded-full bg-violet-400"></span>
              <span class="text-sm font-medium text-violet-300">
                March 15-17, 2026
              </span>
            </div>
          </div>

          <div class="grid gap-10 lg:grid-cols-2 lg:gap-8">
            {/* Left Content */}
            <div class="flex flex-col justify-center">
              <h1 class="mb-6 text-5xl leading-tight font-bold tracking-tight text-white sm:text-6xl lg:text-8xl">
                THETA
                <br />
                <span class="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  2026
                </span>
              </h1>

              <p class="mb-6 max-w-xl text-base font-light text-slate-400 sm:text-xl">
                Where innovation meets excitement. Three days of cutting-edge
                technology, competitions, and unforgettable moments.
              </p>

              {/* Countdown - Responsive */}
              <div class="mb-8 grid grid-cols-4 gap-2 sm:gap-4">
                {[
                  { value: timeLeft.value.days, label: "Days" },
                  { value: timeLeft.value.hours, label: "Hours" },
                  { value: timeLeft.value.minutes, label: "Mins" },
                  { value: timeLeft.value.seconds, label: "Secs" },
                ].map((item) => (
                  <div
                    key={item.label}
                    class="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-900/60 px-2 py-3 backdrop-blur-sm sm:px-4 sm:py-4"
                  >
                    <div class="text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                      {item.value}
                    </div>
                    <div class="text-[10px] font-medium tracking-wider text-slate-500 uppercase sm:text-xs">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>

              <div class="flex flex-col gap-3 sm:flex-row">
                <a
                  href="/events"
                  class="rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-xl sm:px-8 sm:py-4"
                >
                  Explore Events
                </a>
                <a
                  href="/contact"
                  class="rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 text-center text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-slate-800 sm:px-8 sm:py-4"
                >
                  Contact Us
                </a>
              </div>
            </div>

            {/* Right - Day Cards */}
            <div class="flex flex-col gap-4 pt-6 lg:pt-0">
              {days.value.map((day, index) => (
                <div
                  key={day.day}
                  onClick$={() => openDayModal(day.day)}
                  class="premium-surface premium-card group relative cursor-pointer overflow-hidden rounded-xl transition-all hover:border-violet-400/50"
                >
                  {/* Background Image */}
                  <div
                    class="absolute inset-0 bg-cover bg-center opacity-30 transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${day.bgImage})` }}
                  ></div>
                  <div class="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-transparent"></div>

                  <div class="relative flex items-center justify-between p-4 sm:p-6">
                    <div class="flex-1">
                      <div class="mb-2 flex items-center gap-2 sm:mb-3">
                        <span class="rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 px-2 py-0.5 text-xs font-bold text-white sm:px-3">
                          DAY {index + 1}
                        </span>
                        <h3 class="text-lg font-bold text-white sm:text-2xl">
                          {day.day}
                        </h3>
                      </div>
                      <p class="mb-2 text-xs text-slate-400 sm:mb-3 sm:text-sm">
                        {day.date}
                      </p>

                      {/* Flowing highlight message */}
                      <div class="mb-2 flex items-center gap-2 sm:mb-3">
                        <span class="flex h-2 w-2 animate-pulse rounded-full bg-amber-400"></span>
                        <span class="text-sm font-medium text-amber-300">
                          {day.highlight}
                        </span>
                      </div>

                      <div class="flex flex-wrap gap-1.5 sm:gap-2">
                        {day.events.map((event) => (
                          <span
                            key={event}
                            class="rounded-full border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-xs text-slate-300 sm:px-3 sm:py-1"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 transition-all group-hover:border-violet-500 group-hover:bg-violet-500/20 sm:flex sm:h-14 sm:w-14">
                      <svg
                        class="h-4 w-4 text-slate-400 transition-all group-hover:text-violet-400 sm:h-6 sm:w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Theta Section */}
      <section class="relative overflow-hidden py-16 sm:py-24">
        <div class="absolute inset-0 bg-gray-950"></div>
        <div class="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl sm:h-[600px] sm:w-[600px]"></div>

        <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-10 text-center sm:mb-16">
            <span class="mb-3 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-xs font-medium text-violet-400 sm:mb-4 sm:text-sm">
              About Theta
            </span>
            <h2 class="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              India's Premier{" "}
              <span class="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Techno-Management
              </span>{" "}
              Fest
            </h2>
          </div>

          <div class="mx-auto mb-10 max-w-3xl text-center">
            <p class="text-base leading-relaxed text-slate-400 sm:text-lg">
              Theta is a national-level techno-management fest organized by
              SASTRA Deemed University, bringing together the brightest minds
              from across the country. Since its inception, Theta has been a
              platform for students to showcase their technical skills,
              creativity, and innovation. With a legacy of excellence, Theta
              2026 promises to be bigger and better than ever.
            </p>
          </div>

          <div class="grid gap-6 sm:gap-8 md:grid-cols-3">
            {[
              {
                title: "Innovation",
                desc: "Showcasing groundbreaking ideas and cutting-edge technology from the brightest minds.",
              },
              {
                title: "Collaboration",
                desc: "Connect with like-minded peers, form teams, and build something extraordinary.",
              },
              {
                title: "Creativity",
                desc: "Push your boundaries and unleash your imagination in competitions.",
              },
            ].map((item) => (
              <div
                key={item.title}
                class="premium-surface premium-card rounded-2xl p-6 transition-all hover:border-violet-400/50 sm:p-8"
              >
                <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 sm:h-14 sm:w-14">
                  <svg
                    class="h-6 w-6 text-white sm:h-7 sm:w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 class="mb-2 text-xl font-bold text-white">{item.title}</h3>
                <p class="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section class="relative py-12 sm:py-20">
        <div class="absolute inset-0 bg-slate-900"></div>
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1920&q=60')] bg-cover bg-center opacity-5"></div>

        <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 sm:gap-8">
            {homeStats.map((stat) => (
              <div key={stat.label}>
                <div class="mb-1 text-3xl font-bold text-white sm:text-5xl">
                  {stat.value}
                </div>
                <div class="text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section class="relative overflow-hidden py-16 sm:py-24">
        <div class="absolute inset-0 bg-gray-950"></div>
        <div class="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/5 blur-3xl sm:h-[600px] sm:w-[600px]"></div>

        <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-12 text-center">
            <span class="mb-4 inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-400">
              Our Sponsors
            </span>
            <h2 class="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Powered by{" "}
              <span class="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Excellence
              </span>
            </h2>
          </div>

          {/* Platinum Sponsors - Largest */}
          <div class="mb-10">
            <h3 class="mb-6 text-center text-sm font-medium tracking-widest text-violet-400 uppercase">
              Platinum Sponsors
            </h3>
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {(sponsorsData.value?.platinum || defaultSponsors.platinum).map(
                (sponsor) => (
                  <div
                    key={sponsor.name}
                    class="premium-surface premium-card group flex flex-col items-center justify-center rounded-2xl p-6 transition-all hover:border-violet-400/50"
                  >
                    <div class="flex h-20 w-40 items-center justify-center">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width="160"
                        height="80"
                        loading="lazy"
                        decoding="async"
                        class="max-h-full max-w-full object-contain opacity-90 transition-all group-hover:opacity-100"
                        onError$={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/theta-logo.png";
                          target.style.filter = "brightness(0) invert(1)";
                        }}
                      />
                    </div>
                    <span class="mt-2 text-sm font-medium text-slate-300">
                      {sponsor.name}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Gold Sponsors */}
          <div class="mb-10">
            <h3 class="mb-6 text-center text-sm font-medium tracking-widest text-yellow-500/80 uppercase">
              Gold Sponsors
            </h3>
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {(sponsorsData.value?.gold || defaultSponsors.gold).map(
                (sponsor) => (
                  <div
                    key={sponsor.name}
                    class="group flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/50 p-4 transition-all hover:border-yellow-500/30"
                  >
                    <div class="flex h-16 w-32 items-center justify-center">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width="128"
                        height="64"
                        loading="lazy"
                        decoding="async"
                        class="max-h-full max-w-full object-contain opacity-70 transition-all group-hover:opacity-100"
                        onError$={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/theta-logo.png";
                          target.style.filter = "brightness(0) invert(1)";
                        }}
                      />
                    </div>
                    <span class="mt-1 text-xs font-medium text-slate-300">
                      {sponsor.name}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Silver Sponsors */}
          <div class="mb-10">
            <h3 class="mb-6 text-center text-sm font-medium tracking-widest text-slate-400 uppercase">
              Silver Sponsors
            </h3>
            <div class="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-8">
              {(sponsorsData.value?.silver || defaultSponsors.silver || []).map(
                (sponsor) => (
                  <div
                    key={sponsor.name}
                    class="group flex flex-col items-center justify-center rounded-lg border border-slate-800 bg-slate-900/30 p-3 transition-all hover:border-slate-600"
                  >
                    <div class="flex h-14 w-24 items-center justify-center">
                      <img
                        src={sponsor.logo}
                        alt={sponsor.name}
                        width="96"
                        height="56"
                        loading="lazy"
                        decoding="async"
                        class="max-h-full max-w-full object-contain opacity-60 transition-all group-hover:opacity-100"
                        onError$={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/theta-logo.png";
                          target.style.filter = "brightness(0) invert(1)";
                        }}
                      />
                    </div>
                    <span class="mt-1 text-[10px] font-medium text-slate-400">
                      {sponsor.name}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* General Sponsors - Smallest */}
          <div class="mb-10">
            <h3 class="mb-8 text-center text-lg font-bold tracking-widest text-slate-400 uppercase">
              Our Partners
            </h3>
            <div class="flex flex-wrap items-center justify-center gap-6">
              {(
                sponsorsData.value?.general ||
                defaultSponsors.general ||
                []
              ).map((sponsor) => (
                <div
                  key={sponsor.name}
                  class="premium-surface premium-card group flex flex-col items-center justify-center rounded-2xl p-6 transition-all hover:border-violet-400/50 hover:bg-white/10"
                >
                  <div class="flex h-12 w-24 items-center justify-center">
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      width="96"
                      height="48"
                      loading="lazy"
                      decoding="async"
                      class="max-h-full max-w-full object-contain opacity-70 transition-all group-hover:opacity-100"
                      onError$={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/theta-logo.png";
                        target.style.filter = "brightness(0) invert(1)";
                      }}
                    />
                  </div>
                  <span class="mt-3 text-sm font-medium text-slate-400">
                    {sponsor.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Become a Sponsor */}
          <div class="text-center">
            <p class="mb-4 text-slate-400">Want to sponsor Theta 2026?</p>
            <a
              href="/contact"
              class="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-6 py-2.5 text-sm font-medium text-violet-400 transition-all hover:bg-violet-500/20"
            >
              Become a Sponsor
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="relative overflow-hidden py-16 sm:py-24">
        <div class="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-gray-950"></div>
        <div class="absolute top-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl sm:h-[500px] sm:w-[500px]"></div>

        <div class="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 class="mb-4 text-3xl font-bold text-white sm:mb-6 sm:text-4xl lg:text-6xl">
            Ready to{" "}
            <span class="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Shine?
            </span>
          </h2>
          <p class="mb-8 text-base text-slate-400 sm:mb-10 sm:text-xl">
            Join thousands of innovators at Theta 2026. Explore our events and
            be part of something extraordinary.
          </p>
          <div class="flex justify-center">
            <a
              href="/events"
              class="rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-xl sm:px-10 sm:py-4"
            >
              Browse Events
            </a>
          </div>
        </div>
      </section>

      {/* Day Events Modal */}
      {showDayModal.value && selectedDay.value && (
        <div
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick$={closeDayModal}
        >
          <div class="absolute inset-0 bg-gray-950/80 backdrop-blur-sm"></div>
          <div
            class="premium-surface premium-ring relative max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 sm:p-8"
            onClick$={(e) => e.stopPropagation()}
          >
            <button
              onClick$={closeDayModal}
              class="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 text-slate-400 transition-all hover:border-violet-500 hover:text-violet-400"
            >
              <svg
                class="h-4 w-4"
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
            </button>

            <div class="mb-6 text-center">
              <span class="mb-2 inline-block rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-3 py-1 text-xs font-bold text-white">
                {selectedDay.value}
              </span>
              <h2 class="text-2xl font-bold text-white sm:text-3xl">
                Events Schedule
              </h2>
            </div>

            <div class="space-y-4">
              {getDayEvents(selectedDay.value).length > 0 ? (
                getDayEvents(selectedDay.value).map((event) => (
                  <div
                    key={event.id}
                    class="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-800/50 p-4 sm:flex-row sm:items-center"
                  >
                    <div class="flex h-16 w-full shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-32">
                      <img
                        src={event.image}
                        alt={event.name}
                        width="128"
                        height="80"
                        loading="lazy"
                        decoding="async"
                        class="h-full w-full object-cover"
                      />
                    </div>
                    <div class="flex-1">
                      <div class="mb-1 flex flex-wrap items-center gap-2">
                        <h3 class="font-bold text-white">{event.name}</h3>
                        <span class="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-xs text-violet-400">
                          {event.category}
                        </span>
                        {event.cluster && (
                          <span
                            class="rounded-full border px-2 py-0.5 text-xs font-medium"
                            style={{
                              backgroundColor: `${getClusterColor(event.cluster)}20`,
                              borderColor: `${getClusterColor(event.cluster)}50`,
                              color: getClusterColor(event.cluster),
                            }}
                          >
                            {getClusterName(event.cluster)}
                          </span>
                        )}
                      </div>
                      <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                        <span class="flex items-center gap-1">
                          <svg
                            class="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {event.timing}
                        </span>
                        <span class="flex items-center gap-1">
                          <svg
                            class="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {event.location}
                        </span>
                        <span class="flex items-center gap-1">
                          <svg
                            class="h-3 w-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {event.fee}
                        </span>
                      </div>
                      <p class="mt-1 line-clamp-2 text-sm text-slate-400">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div class="py-8 text-center text-slate-400">
                  <p>Events will be announced soon!</p>
                </div>
              )}
            </div>

            <div class="mt-6 text-center">
              <a
                href="/events"
                class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-xl"
              >
                View All Events
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Theta 2026 - Home",
  meta: [
    {
      name: "description",
      content:
        "Theta 2026 is SASTRA's national-level techno-management fest with events, workshops, sponsors, and registrations.",
    },
  ],
};
