import { component$, useSignal, $, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

interface Cluster {
  id: string;
  name: string;
  color: string;
}

interface Event {
  id: number;
  name: string;
  category: "tech" | "fun" | "quiz" | "workshop" | "pro-night";
  cluster?: string;
  day?: string;
  timing: string;
  location: string;
  fee: string;
  status: "active" | "over" | "coming-soon";
  description: string;
  image: string;
  registrationUrl?: string;
  registrationCloseAt?: string;
}

const FEST_YEAR = 2026;

const dayCutoffMap: Record<string, string> = {
  "Day 1": `${FEST_YEAR}-03-15`,
  "Day 2": `${FEST_YEAR}-03-16`,
  "Day 3": `${FEST_YEAR}-03-17`,
  "Day One": `${FEST_YEAR}-03-15`,
  "Day Two": `${FEST_YEAR}-03-16`,
  "Day Three": `${FEST_YEAR}-03-17`,
};

const hasRegistrationLink = (event: Event) =>
  Boolean(event.registrationUrl && event.registrationUrl.trim().length > 0);

const parseDateFromTiming = (timing: string): Date | null => {
  const monthDayRegex =
    /\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(\d{1,2})(?:,\s*(\d{4}))?/i;
  const match = timing.match(monthDayRegex);
  if (!match) return null;

  const [, month, day, year] = match;
  const parsed = new Date(`${month} ${day}, ${year || FEST_YEAR} 00:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
};

const getRegistrationCutoff = (event: Event): Date | null => {
  if (event.registrationCloseAt) {
    const explicitDate = new Date(event.registrationCloseAt);
    if (!Number.isNaN(explicitDate.getTime())) {
      return new Date(
        explicitDate.getFullYear(),
        explicitDate.getMonth(),
        explicitDate.getDate(),
        0,
        0,
        0,
        0,
      );
    }
  }

  const dateFromTiming = parseDateFromTiming(event.timing);
  if (dateFromTiming) {
    return new Date(
      dateFromTiming.getFullYear(),
      dateFromTiming.getMonth(),
      dateFromTiming.getDate(),
      0,
      0,
      0,
      0,
    );
  }

  if (event.day && dayCutoffMap[event.day]) {
    const mappedDate = new Date(`${dayCutoffMap[event.day]}T00:00:00`);
    if (!Number.isNaN(mappedDate.getTime())) return mappedDate;
  }

  return null;
};

const isRegistrationClosed = (event: Event): boolean => {
  if (!hasRegistrationLink(event)) return true;
  if (event.status === "over") return true;

  const cutoff = getRegistrationCutoff(event);
  if (!cutoff) return false;

  return Date.now() >= cutoff.getTime();
};

const getEffectiveStatus = (event: Event): Event["status"] => {
  if (event.status === "coming-soon") return "coming-soon";
  if (isRegistrationClosed(event)) return "over";
  return "active";
};

const defaultClusters: Cluster[] = [
  { id: "csi", name: "CSI", color: "#6366f1" },
  { id: "iedc", name: "IEDC", color: "#ec4899" },
  { id: "ieee", name: "IEEE", color: "#14b8a6" },
  { id: "asme", name: "ASME", color: "#f59e0b" },
  { id: "sae", name: "SAE", color: "#ef4444" },
  { id: "nss", name: "NSS", color: "#10b981" },
  { id: "theta", name: "Theta", color: "#8b5cf6" },
];

const defaultEvents: Event[] = [
  {
    id: 1,
    name: "Robotics Workshop",
    category: "workshop",
    timing: "March 15, 10:00 AM - 1:00 PM",
    location: "Tech Block, Room 301",
    fee: "₹200",
    status: "active",
    description:
      "## Robotics Workshop\n\nLearn the fundamentals of robotics, including:\n- Basic electronics\n- Arduino programming\n- Sensor integration\n- Building your first robot\n\n**Prerequisites:** Basic knowledge of programming\n\n**What to bring:** Laptop",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=60",
    registrationUrl: "https://forms.google.com/example",
  },
  {
    id: 2,
    name: "Code Battle",
    category: "tech",
    timing: "March 16, 2:00 PM - 6:00 PM",
    location: "Main Auditorium",
    fee: "₹100",
    status: "active",
    description:
      "## Code Battle\n\nCompetitive coding event with multiple rounds:\n- Round 1: MCQ\n- Round 2: Coding\n- Round 3: Debugging\n\n**Languages:** C, C++, Java, Python\n\n**Winner gets ₹5000 cash prize!**",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=60",
    registrationUrl: "https://forms.google.com/example",
  },
  {
    id: 3,
    name: "Tech Quiz",
    category: "quiz",
    timing: "March 15, 4:00 PM - 6:00 PM",
    location: "Room 201",
    fee: "₹100",
    status: "active",
    description:
      "## Tech Quiz\n\nTest your technical knowledge!\n- Technical rounds\n- Rapid fire\n- Buzzer round\n\n**Prize:** ₹3000 for winner",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=60",
    registrationUrl: "https://forms.google.com/example",
  },
  {
    id: 4,
    name: "Hackathon",
    category: "tech",
    timing: "March 16-17, 9:00 AM",
    location: "Innovation Hub",
    fee: "₹500",
    status: "active",
    description:
      "## Hackathon\n\n24-hour hackathon to build innovative solutions.\n- Team size: 2-4 members\n- Bring your own laptop\n\n**Prize:** ₹10000 for winner",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=60",
    registrationUrl: "https://forms.google.com/example",
  },
  {
    id: 5,
    name: "Project Expo",
    category: "tech",
    timing: "March 16, 11:00 AM - 4:00 PM",
    location: "Exhibition Hall",
    fee: "₹200",
    status: "active",
    description:
      "## Project Expo\n\nShowcase your projects to industry experts.\n- Present your innovative ideas\n- Network with professionals\n\n**Prize:** ₹5000 for best project",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=60",
    registrationUrl: "https://forms.google.com/example",
  },
];

export default component$(() => {
  const activeCategory = useSignal<"all" | "events" | "workshop">("all");
  const activeStatus = useSignal<"all" | "active" | "coming-soon" | "over">(
    "all",
  );
  const activeCluster = useSignal<string>("all");
  const searchQuery = useSignal("");
  const selectedEvent = useSignal<Event | null>(null);
  const showModal = useSignal(false);

  const events = useSignal<Event[]>(defaultEvents);
  const clusters = useSignal<Cluster[]>(defaultClusters);

  useVisibleTask$(async () => {
    try {
      const res = await fetch("/events.json");
      const data = await res.json();
      if (data.events && Array.isArray(data.events)) {
        events.value = data.events.map((e: Record<string, unknown>) => ({
          ...e,
          status: (e.status as string) || "active",
          registrationUrl: e.registrationUrl as string | undefined,
        }));
      }
      if (data.clusters && Array.isArray(data.clusters)) {
        clusters.value = data.clusters;
      }
    } catch {
      console.log("Using default events");
    }
  });

  const getClusterColor = (clusterId: string) => {
    const cluster = clusters.value.find((c) => c.id === clusterId);
    return cluster?.color || "#8b5cf6";
  };

  const getClusterName = (clusterId: string) => {
    const cluster = clusters.value.find((c) => c.id === clusterId);
    return cluster?.name || clusterId;
  };

  let filteredEvents = events.value;

  if (activeCategory.value === "events") {
    filteredEvents = filteredEvents.filter((e) => e.category !== "workshop");
  } else if (activeCategory.value === "workshop") {
    filteredEvents = filteredEvents.filter((e) => e.category === "workshop");
  }

  if (activeStatus.value !== "all") {
    filteredEvents = filteredEvents.filter(
      (e) => getEffectiveStatus(e) === activeStatus.value,
    );
  }

  if (activeCluster.value !== "all") {
    filteredEvents = filteredEvents.filter(
      (e) => e.cluster === activeCluster.value,
    );
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filteredEvents = filteredEvents.filter(
      (e) =>
        e.name.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query) ||
        e.location.toLowerCase().includes(query),
    );
  }

  const openEventModal = $((event: Event) => {
    selectedEvent.value = event;
    showModal.value = true;
  });

  const closeModal = $(() => {
    showModal.value = false;
    selectedEvent.value = null;
  });

  const categoryColors: Record<string, string> = {
    tech: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    fun: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    quiz: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    workshop: "bg-violet-500/20 text-violet-400 border-violet-500/30",
    "pro-night": "bg-rose-500/20 text-rose-400 border-rose-500/30",
  };

  return (
    <div class="min-h-screen bg-gray-950">
      {/* Background */}
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-gray-900"></div>
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=60')] bg-cover bg-center opacity-10"></div>

      <div class="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div class="mb-8 text-center">
          <h1 class="mb-2 text-4xl font-bold text-white sm:text-5xl">Events</h1>
          <p class="text-slate-400">
            Discover and register for Theta 2026 events
          </p>
        </div>

        {/* Search and Filters */}
        <div class="mb-8 space-y-4">
          {/* Search */}
          <div class="mx-auto max-w-md">
            <div class="relative">
              <svg
                class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={searchQuery.value}
                onInput$={(e) =>
                  (searchQuery.value = (e.target as HTMLInputElement).value)
                }
                class="w-full rounded-full border border-slate-700 bg-slate-800/50 py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/50 focus:outline-none"
                placeholder="Search events..."
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Category Tabs */}
            <div class="flex flex-wrap justify-center gap-2">
              {(["all", "events", "workshop"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick$={() => (activeCategory.value = cat)}
                  class={[
                    "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
                    activeCategory.value === cat
                      ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25"
                      : "border border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600",
                  ]}
                >
                  {cat === "all"
                    ? "All"
                    : cat === "events"
                      ? "Events"
                      : "Workshops"}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div class="flex flex-wrap justify-center gap-2">
              {(
                [
                  { value: "all", label: "All" },
                  { value: "active", label: "Active" },
                  { value: "coming-soon", label: "Coming Soon" },
                  { value: "over", label: "Over" },
                ] as const
              ).map((status) => (
                <button
                  key={status.value}
                  onClick$={() => (activeStatus.value = status.value)}
                  class={[
                    "rounded-full px-3 py-1 text-xs font-medium transition-all",
                    activeStatus.value === status.value
                      ? "border border-violet-500/30 bg-violet-500/20 text-violet-400"
                      : "border border-slate-700 bg-slate-800/30 text-slate-500 hover:border-slate-600",
                  ]}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cluster Filter */}
          <div class="flex flex-wrap justify-center gap-2">
            <button
              onClick$={() => (activeCluster.value = "all")}
              class={[
                "rounded-full px-3 py-1 text-xs font-medium transition-all",
                activeCluster.value === "all"
                  ? "border border-violet-500/30 bg-violet-500/20 text-violet-400"
                  : "border border-slate-700 bg-slate-800/30 text-slate-500 hover:border-slate-600",
              ]}
            >
              All Clusters
            </button>
            {clusters.value.map((cluster) => (
              <button
                key={cluster.id}
                onClick$={() => (activeCluster.value = cluster.id)}
                class={[
                  "rounded-full px-3 py-1 text-xs font-medium transition-all",
                  activeCluster.value === cluster.id
                    ? "border"
                    : "border border-slate-700 bg-slate-800/30 text-slate-500 hover:border-slate-600",
                ]}
                style={{
                  backgroundColor:
                    activeCluster.value === cluster.id
                      ? `${cluster.color}20`
                      : undefined,
                  borderColor:
                    activeCluster.value === cluster.id
                      ? `${cluster.color}50`
                      : undefined,
                  color:
                    activeCluster.value === cluster.id
                      ? cluster.color
                      : undefined,
                }}
              >
                {cluster.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div class="mb-6 text-center text-sm text-slate-400">
          Showing {filteredEvents.length}{" "}
          {filteredEvents.length === 1 ? "event" : "events"}
        </div>

        {/* Events Grid */}
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => {
            const effectiveStatus = getEffectiveStatus(event);
            const closed = isRegistrationClosed(event);
            return (
              <div
                key={event.id}
                onClick$={() => openEventModal(event)}
                class="premium-surface premium-card group cursor-pointer overflow-hidden rounded-2xl transition-all hover:border-violet-400/50 hover:shadow-xl hover:shadow-violet-500/10"
              >
              <div class="relative h-40 overflow-hidden">
                <div
                  class="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${event.image})` }}
                ></div>
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                <div class="absolute top-3 left-3">
                  <span
                    class={[
                      "rounded-full border px-2.5 py-1 text-xs font-medium",
                      categoryColors[event.category],
                    ]}
                  >
                    {event.category}
                  </span>
                </div>
                <div class="absolute top-3 right-3">
                  <span
                    class={[
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      effectiveStatus === "active"
                        ? "border border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                        : effectiveStatus === "coming-soon"
                          ? "border border-amber-500/30 bg-amber-500/20 text-amber-400"
                          : "border border-slate-500/30 bg-slate-500/20 text-slate-400",
                    ]}
                  >
                    {effectiveStatus === "active"
                      ? "Active"
                      : effectiveStatus === "coming-soon"
                        ? "Coming Soon"
                        : "Closed"}
                  </span>
                </div>
              </div>

              <div class="p-4">
                <h3 class="mb-2 text-lg font-bold text-white">{event.name}</h3>
                <div class="space-y-1 text-sm text-slate-400">
                  <div class="flex items-center gap-2">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {event.timing}
                  </div>
                  <div class="flex items-center gap-2">
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
                  </div>
                  <div class="flex items-center gap-2">
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {event.fee}
                  </div>
                </div>
                {event.cluster && (
                  <div class="mt-3">
                    <span
                      class="inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor: `${getClusterColor(event.cluster)}20`,
                        borderColor: `${getClusterColor(event.cluster)}50`,
                        color: getClusterColor(event.cluster),
                      }}
                    >
                      Organized by {getClusterName(event.cluster)}
                    </span>
                  </div>
                )}
                {closed && (
                  <div class="mt-3">
                    <span class="inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                      Regret registration closed
                    </span>
                  </div>
                )}
              </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Modal */}
      {showModal.value && selectedEvent.value && (
        (() => {
          const effectiveStatus = getEffectiveStatus(selectedEvent.value);
          const closed = isRegistrationClosed(selectedEvent.value);
          return (
          <div class="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Backdrop with blur */}
          <div
            class="animate-fade-in-up absolute inset-0 bg-gray-950/80 backdrop-blur-md"
            onClick$={closeModal}
          ></div>

          {/* Modal Container */}
          <div class="animate-scale-in relative h-[calc(100vh-1rem)] w-full max-w-5xl sm:h-auto">
            {/* Animated border gradient */}
            <div class="absolute -inset-0.5 animate-pulse rounded-3xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 opacity-70 blur-sm"></div>

            <div class="premium-surface premium-ring relative h-full max-h-[95vh] overflow-y-auto rounded-2xl shadow-[0_25px_90px_rgba(76,29,149,0.45)] sm:max-h-[90vh] sm:rounded-3xl">
              {/* Close button */}
              <button
                onClick$={closeModal}
                class="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-300 transition-all hover:rotate-90 hover:bg-white/20 hover:text-white sm:top-4 sm:right-4 sm:h-12 sm:w-12"
              >
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
              </button>

              <div class="grid lg:grid-cols-5">
                {/* Left Side - Event Info */}
                <div class="relative w-full flex flex-col items-center justify-center overflow-hidden rounded-t-2xl border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.3),rgba(15,23,42,0.35),rgba(2,6,23,1))] p-5 text-center sm:p-8 lg:rounded-l-3xl lg:rounded-tr-none lg:border-r lg:border-b-0">
                  {/* Animated background blobs */}
                  <div class="animate-blob absolute -top-10 -left-10 h-40 w-40 rounded-full bg-violet-500/30 blur-3xl"></div>
                  <div class="animate-blob absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl"></div>

                  <div class="relative z-10">
                    {/* Event Icon/Logo */}
                    <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-xl shadow-violet-500/30 sm:h-28 sm:w-28 sm:rounded-3xl">
                      <img
                        src={selectedEvent.value.image}
                        alt={selectedEvent.value.name}
                        width="80"
                        height="80"
                        loading="lazy"
                        decoding="async"
                        class="h-14 w-14 rounded-xl object-cover sm:h-20 sm:w-20 sm:rounded-2xl"
                      />
                    </div>

                    <h2 class="mb-6 text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                      {selectedEvent.value.name}
                    </h2>

                    <div class="space-y-4 text-base text-slate-200">
                      <div class="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                        <svg
                          class="h-6 w-6 shrink-0 text-violet-400"
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
                        <span>{selectedEvent.value.timing}</span>
                      </div>
                      <div class="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
                        <svg
                          class="h-6 w-6 shrink-0 text-violet-400"
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
                        <span>{selectedEvent.value.location}</span>
                      </div>
                      <div class="rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-500/20 px-4 py-4 shadow-lg shadow-violet-500/20 backdrop-blur-sm">
                        <p class="text-xs font-semibold tracking-[0.2em] text-violet-200/80 uppercase">
                          Entry Fee
                        </p>
                        <span class="mt-1 block bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl">
                          {selectedEvent.value.fee}
                        </span>
                        <p class="mt-1 text-xs text-slate-300/80">
                          per participant
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Description */}
                <div class="p-5 sm:p-8 lg:col-span-4 lg:p-10">
                  {/* Badges */}
                  <div class="mb-6 flex flex-wrap gap-3">
                    <span
                      class={[
                        "rounded-full border px-4 py-1.5 text-sm font-semibold",
                        categoryColors[selectedEvent.value.category],
                      ]}
                    >
                      {selectedEvent.value.category}
                    </span>
                    {selectedEvent.value.cluster && (
                      <span
                        class="rounded-full border px-4 py-1.5 text-sm font-semibold"
                        style={{
                          backgroundColor: `${getClusterColor(selectedEvent.value.cluster)}20`,
                          borderColor: `${getClusterColor(selectedEvent.value.cluster)}50`,
                          color: getClusterColor(selectedEvent.value.cluster),
                        }}
                      >
                        {getClusterName(selectedEvent.value.cluster)}
                      </span>
                    )}
                    <span
                      class={[
                        "rounded-full border px-4 py-1.5 text-sm font-semibold",
                        effectiveStatus === "active"
                          ? "border-emerald-500/30 bg-emerald-500/20 text-emerald-400"
                          : effectiveStatus === "coming-soon"
                            ? "border-amber-500/30 bg-amber-500/20 text-amber-400"
                            : "border-slate-500/30 bg-slate-500/20 text-slate-400",
                      ]}
                    >
                      {effectiveStatus === "active"
                        ? "✓ Register Now"
                        : effectiveStatus === "coming-soon"
                          ? "Coming Soon"
                          : "Regret registration closed"}
                    </span>
                  </div>

                  {/* Description */}
                  <div class="premium-surface mb-8 rounded-2xl p-4 text-sm leading-relaxed text-slate-300 sm:p-6 sm:text-base">
                    <p>{selectedEvent.value.description}</p>
                  </div>

                  {/* Action Button */}
                  {!closed && selectedEvent.value.registrationUrl ? (
                    <a
                      href={selectedEvent.value.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="group flex items-center justify-center gap-3 rounded-xl border border-violet-300/30 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-500 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:scale-[1.02] hover:shadow-xl"
                    >
                      <svg
                        class="h-6 w-6 transition-transform group-hover:scale-110"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Register Now
                      <svg
                        class="h-5 w-5 transition-transform group-hover:translate-x-1"
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
                  ) : (
                    <div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center">
                      <p class="text-base text-amber-400">
                        Regret registration closed
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
          );
        })()
      )}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Events - Theta 2026",
  meta: [
    {
      name: "description",
      content:
        "Browse Theta 2026 events and workshops, filter by category, status, and cluster, and register online.",
    },
  ],
};
