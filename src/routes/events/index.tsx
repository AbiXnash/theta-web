import { $, component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

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

interface EventsPageCopy {
  title: string;
  subtitle: string;
  searchPlaceholder: string;
  categoryLabels: {
    all: string;
    events: string;
    workshop: string;
  };
  statusLabels: {
    all: string;
    active: string;
    "coming-soon": string;
    over: string;
    closed: string;
  };
  allClustersLabel: string;
  resultsPrefix: string;
  singleEvent: string;
  multipleEvents: string;
  organizedByPrefix: string;
  registrationClosed: string;
  entryFee: string;
  perParticipant: string;
  registerNow: string;
}

const defaultEventsPageCopy: EventsPageCopy = {
  title: "Events",
  subtitle: "Discover and register for Theta 2026 events",
  searchPlaceholder: "Search events...",
  categoryLabels: {
    all: "All",
    events: "Events",
    workshop: "Workshops",
  },
  statusLabels: {
    all: "All",
    active: "Active",
    "coming-soon": "Coming Soon",
    over: "Over",
    closed: "Closed",
  },
  allClustersLabel: "All Clusters",
  resultsPrefix: "Showing",
  singleEvent: "event",
  multipleEvents: "events",
  organizedByPrefix: "Organized by",
  registrationClosed: "Regret registration closed",
  entryFee: "Entry Fee",
  perParticipant: "per participant",
  registerNow: "Register Now",
};

const FEST_YEAR = 2026;

const dayCutoffMap: Record<string, string> = {
  "Day 1": `${FEST_YEAR}-03-15`,
  "Day 2": `${FEST_YEAR}-03-16`,
  "Day 3": `${FEST_YEAR}-03-17`,
  "Day One": `${FEST_YEAR}-03-15`,
  "Day Two": `${FEST_YEAR}-03-16`,
  "Day Three": `${FEST_YEAR}-03-17`,
};

const defaultClusterColors: Record<string, string> = {
  csi: "#3b82f6",
  ieee: "#14b8a6",
  sae: "#f97316",
  tedx: "#ef4444",
  robotics: "#8b5cf6",
  design: "#ec4899",
  code: "#22c55e",
};

const difficultyMap: Record<Event["category"], "Beginner" | "Intermediate" | "Advanced"> = {
  workshop: "Beginner",
  quiz: "Intermediate",
  fun: "Intermediate",
  tech: "Advanced",
  "pro-night": "Beginner",
};

const hasRegistrationLink = (event: Event) =>
  Boolean(event.registrationUrl && event.registrationUrl.trim().length > 0);

const getRegistrationCutoff = (event: Event): Date | null => {
  if (event.registrationCloseAt) {
    const explicit = new Date(event.registrationCloseAt);
    if (!Number.isNaN(explicit.getTime())) {
      return new Date(
        explicit.getFullYear(),
        explicit.getMonth(),
        explicit.getDate(),
        0,
        0,
        0,
        0,
      );
    }
  }

  if (event.day && dayCutoffMap[event.day]) {
    const fallback = new Date(`${dayCutoffMap[event.day]}T00:00:00`);
    if (!Number.isNaN(fallback.getTime())) return fallback;
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
  { id: "csi", name: "CSI", color: "#3b82f6" },
  { id: "ieee", name: "IEEE", color: "#14b8a6" },
  { id: "sae", name: "SAE", color: "#f97316" },
  { id: "tedx", name: "TEDx", color: "#ef4444" },
  { id: "robotics", name: "Robotics", color: "#8b5cf6" },
  { id: "design", name: "Design", color: "#ec4899" },
  { id: "code", name: "Code", color: "#22c55e" },
];

export default component$(() => {
  const activeCategory = useSignal<"all" | "events" | "workshop">("all");
  const activeStatus = useSignal<"all" | "active" | "coming-soon" | "over">(
    "all",
  );
  const activeCluster = useSignal("all");
  const searchQuery = useSignal("");

  const events = useSignal<Event[]>([]);
  const clusters = useSignal<Cluster[]>(defaultClusters);
  const copy = useSignal<EventsPageCopy>(defaultEventsPageCopy);

  const selectedEvent = useSignal<Event | null>(null);

  useVisibleTask$(async () => {
    try {
      const [eventsRes, contentRes] = await Promise.all([
        fetch("/data/events.json"),
        fetch("/data/content.json"),
      ]);

      const eventData = (await eventsRes.json()) as {
        events?: Event[];
        clusters?: Cluster[];
      };
      const content = (await contentRes.json()) as {
        eventsPage?: Partial<EventsPageCopy>;
        seo?: { eventsTitle?: string; eventsDescription?: string };
      };

      events.value = eventData.events || [];
      if (eventData.clusters) clusters.value = eventData.clusters;

      if (content.eventsPage) {
        copy.value = {
          ...defaultEventsPageCopy,
          ...content.eventsPage,
          categoryLabels: {
            ...defaultEventsPageCopy.categoryLabels,
            ...(content.eventsPage.categoryLabels || {}),
          },
          statusLabels: {
            ...defaultEventsPageCopy.statusLabels,
            ...(content.eventsPage.statusLabels || {}),
          },
        };
      }

      if (content.seo?.eventsTitle) document.title = content.seo.eventsTitle;
      if (content.seo?.eventsDescription) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", "description");
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", content.seo.eventsDescription);
      }
    } catch {
      events.value = [];
    }
  });

  useVisibleTask$(({ track }) => {
    track(() => selectedEvent.value);
    if (!selectedEvent.value) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") selectedEvent.value = null;
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  const getClusterName = (id?: string) => {
    if (!id) return "Open";
    return clusters.value.find((c) => c.id === id)?.name || id;
  };

  const getClusterColor = (id?: string) => {
    if (!id) return "#7c3aed";

    const mapped = defaultClusterColors[id.toLowerCase()];
    if (mapped) return mapped;

    const fromData = clusters.value.find((c) => c.id === id)?.color;
    return fromData || "#7c3aed";
  };

  let filtered = events.value;

  if (activeCategory.value === "events") {
    filtered = filtered.filter((event) => event.category !== "workshop");
  } else if (activeCategory.value === "workshop") {
    filtered = filtered.filter((event) => event.category === "workshop");
  }

  if (activeStatus.value !== "all") {
    filtered = filtered.filter(
      (event) => getEffectiveStatus(event) === activeStatus.value,
    );
  }

  if (activeCluster.value !== "all") {
    filtered = filtered.filter((event) => event.cluster === activeCluster.value);
  }

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (event) =>
        event.name.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query),
    );
  }

  const openEvent = $((event: Event) => {
    selectedEvent.value = event;
  });

  const closeEvent = $(() => {
    selectedEvent.value = null;
  });

  return (
    <div class="relative mx-auto min-h-screen max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div class="theta-noise pointer-events-none absolute inset-0 -z-10 opacity-20"></div>

      <section class="theta-shell p-6 sm:p-8">
        <p class="text-xs tracking-[0.25em] text-neutral-700 uppercase">Theta 2026</p>
        <h1 class="mt-3 text-4xl font-extrabold sm:text-5xl">{copy.value.title}</h1>
        <p class="mt-2 max-w-2xl text-neutral-600">{copy.value.subtitle}</p>

        <div class="mt-6">
          <label for="events-search" class="sr-only">
            Search events
          </label>
          <input
            id="events-search"
            type="text"
            value={searchQuery.value}
            onInput$={(event) =>
              (searchQuery.value = (event.target as HTMLInputElement).value)
            }
            placeholder={copy.value.searchPlaceholder}
            class="theta-focus w-full rounded-xl border-2 border-black/15 bg-white/90 px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-500"
          />
        </div>

        <div class="mt-5 flex flex-col gap-4">
          <div class="flex flex-wrap gap-2">
            {([
              { key: "all", label: copy.value.categoryLabels.all },
              { key: "events", label: copy.value.categoryLabels.events },
              { key: "workshop", label: copy.value.categoryLabels.workshop },
            ] as const).map((item) => (
              <button
                key={item.key}
                onClick$={() => (activeCategory.value = item.key)}
                class={[
                  "theta-focus rounded-full border-2 px-4 py-2 text-sm font-bold",
                  activeCategory.value === item.key
                    ? "border-[var(--theta-primary)] bg-[var(--theta-primary)] text-white"
                    : "border-black/15 bg-neutral-100 text-neutral-900",
                ]}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div class="flex flex-wrap gap-2 overflow-x-auto pb-1">
            {([
              { key: "all", label: copy.value.statusLabels.all },
              { key: "active", label: copy.value.statusLabels.active },
              { key: "coming-soon", label: copy.value.statusLabels["coming-soon"] },
              { key: "over", label: copy.value.statusLabels.over },
            ] as const).map((item) => (
              <button
                key={item.key}
                onClick$={() => (activeStatus.value = item.key)}
                class={[
                  "theta-focus whitespace-nowrap rounded-full border-2 px-4 py-2 text-xs font-bold",
                  activeStatus.value === item.key
                    ? "border-[var(--theta-primary)] bg-[var(--theta-primary)] text-white"
                    : "border-black/15 bg-neutral-100 text-neutral-700",
                ]}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div class="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick$={() => (activeCluster.value = "all")}
              class={[
                "theta-focus whitespace-nowrap rounded-full border-2 px-4 py-2 text-xs font-bold",
                activeCluster.value === "all"
                  ? "border-[var(--theta-primary)] bg-[var(--theta-primary)] text-white"
                  : "border-black/15 bg-neutral-100 text-neutral-700",
              ]}
            >
              {copy.value.allClustersLabel}
            </button>
            {clusters.value.map((cluster) => {
              const color = getClusterColor(cluster.id);
              return (
                <button
                  key={cluster.id}
                  onClick$={() => (activeCluster.value = cluster.id)}
                  class="theta-focus whitespace-nowrap rounded-full border-2 px-4 py-2 text-xs font-bold"
                  style={{
                    borderColor:
                      activeCluster.value === cluster.id ? color : "rgba(0,0,0,0.16)",
                    backgroundColor:
                      activeCluster.value === cluster.id ? `${color}33` : "#fff",
                    color: activeCluster.value === cluster.id ? color : "#111827",
                  }}
                >
                  {cluster.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <p class="mt-5 text-sm text-neutral-600">
        {copy.value.resultsPrefix} {filtered.length} {filtered.length === 1 ? copy.value.singleEvent : copy.value.multipleEvents}
      </p>

      <section class="mt-5 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((event) => {
          const clusterColor = getClusterColor(event.cluster);
          const status = getEffectiveStatus(event);
          const closed = isRegistrationClosed(event);

          return (
            <article
              key={event.id}
              class="theta-panel group overflow-hidden"
            >
              <button
                onClick$={() => openEvent(event)}
                class="theta-focus block w-full text-left"
              >
                <img
                  src={event.image}
                  alt={event.name}
                  width={640}
                  height={360}
                  loading="lazy"
                  class="h-48 w-full object-cover grayscale transition duration-300 group-hover:grayscale-0"
                />
                <div class="p-5">
                  <div class="mb-3 flex flex-wrap gap-2">
                    <span class="theta-badge border-black/15 text-neutral-900">{event.day || "Day TBD"}</span>
                    <span
                      class="theta-badge"
                      style={{ borderColor: `${clusterColor}88`, color: clusterColor }}
                    >
                      {getClusterName(event.cluster)}
                    </span>
                    <span class="theta-badge border-black/15 text-neutral-900">{difficultyMap[event.category]}</span>
                    <span
                      class="theta-badge"
                      style={{
                        borderColor:
                          status === "active"
                            ? "#22c55e"
                            : status === "coming-soon"
                              ? "#f59e0b"
                              : "#737373",
                        color:
                          status === "active"
                            ? "#4ade80"
                            : status === "coming-soon"
                              ? "#fbbf24"
                              : "#a3a3a3",
                      }}
                    >
                      {status === "active"
                        ? copy.value.statusLabels.active
                        : status === "coming-soon"
                          ? copy.value.statusLabels["coming-soon"]
                          : copy.value.statusLabels.closed}
                    </span>
                  </div>
                  <h2 class="text-2xl leading-tight font-extrabold">{event.name}</h2>
                  <p class="mt-2 line-clamp-2 text-sm text-neutral-600">{event.description}</p>
                  <div class="mt-4 flex items-center justify-between">
                    <p class="text-sm text-neutral-700">{event.timing}</p>
                    <span class="text-sm font-bold text-[var(--theta-primary)]">{event.fee}</span>
                  </div>
                  <span class="theta-focus mt-4 inline-flex rounded-lg border-2 border-white bg-white px-4 py-2 text-xs font-bold text-black">
                    {closed ? copy.value.registrationClosed : copy.value.registerNow}
                  </span>
                </div>
              </button>
            </article>
          );
        })}
      </section>

      {selectedEvent.value && (
        <div class="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <button class="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick$={closeEvent} aria-label="Close event modal"></button>
          <div
            class="theta-shell relative z-10 max-h-[92vh] w-full max-w-4xl overflow-auto p-5 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={selectedEvent.value.name}
          >
            <button
              onClick$={closeEvent}
              class="theta-focus absolute top-3 right-3 rounded-lg border border-black/15 px-3 py-1 text-sm"
            >
              Close
            </button>

            <div class="grid gap-5 md:grid-cols-[1.05fr_1fr]">
              <img
                src={selectedEvent.value.image}
                alt={selectedEvent.value.name}
                width={640}
                height={420}
                class="h-full min-h-64 w-full rounded-xl border-2 border-black/15 object-cover"
              />
              <div>
                <h3 class="text-3xl font-extrabold">{selectedEvent.value.name}</h3>
                <p class="mt-2 text-sm text-neutral-600">{selectedEvent.value.description}</p>
                <div class="mt-4 space-y-2 text-sm text-neutral-700">
                  <p><span class="text-neutral-700">Day:</span> {selectedEvent.value.day || "TBD"}</p>
                  <p><span class="text-neutral-700">Time:</span> {selectedEvent.value.timing}</p>
                  <p><span class="text-neutral-700">Venue:</span> {selectedEvent.value.location}</p>
                  <p><span class="text-neutral-700">{copy.value.entryFee}:</span> {selectedEvent.value.fee} {copy.value.perParticipant}</p>
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span class="theta-badge border-black/15 text-neutral-900">{difficultyMap[selectedEvent.value.category]}</span>
                  {selectedEvent.value.cluster && (
                    <span
                      class="theta-badge"
                      style={{
                        borderColor: `${getClusterColor(selectedEvent.value.cluster)}88`,
                        color: getClusterColor(selectedEvent.value.cluster),
                      }}
                    >
                      {copy.value.organizedByPrefix} {getClusterName(selectedEvent.value.cluster)}
                    </span>
                  )}
                </div>
                {isRegistrationClosed(selectedEvent.value) ? (
                  <p class="mt-6 rounded-xl border border-black/15 bg-neutral-100 px-4 py-3 text-sm text-neutral-700">
                    {copy.value.registrationClosed}
                  </p>
                ) : (
                  <a
                    href={selectedEvent.value.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="theta-focus mt-6 inline-flex rounded-xl border-2 border-[var(--theta-primary)] bg-[var(--theta-primary)] px-5 py-3 text-sm font-bold text-white"
                  >
                    {copy.value.registerNow}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
