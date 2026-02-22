import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

interface DayEvent {
  day: string;
  date: string;
  events: string[];
  highlight: string;
  bgImage: string;
}

export default component$(() => {
  const days = useSignal<DayEvent[]>([
    {
      day: "Day One",
      date: "March 15, 2026",
      events: ["Inauguration", "Robotics Workshop", "Tech Quiz"],
      highlight: "SASTRA Singing Team Performance",
      bgImage:
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
    },
    {
      day: "Day Two",
      date: "March 16, 2026",
      events: ["Code Battle", "Hackathon", "Project Expo"],
      highlight: "SASTRA Dance Team Performance",
      bgImage:
        "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800",
    },
    {
      day: "Day Three",
      date: "March 17, 2026",
      events: ["Prize Distribution", "Valedictory"],
      highlight: "External Team Pro Nite",
      bgImage:
        "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
    },
  ]);

  const targetDate = new Date("2026-03-15T09:00:00");

  const timeLeft = useSignal({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  return (
    <div class="bg-gray-950">
      {/* Hero Section */}
      <section class="relative min-h-[calc(100vh-4rem)] overflow-hidden pt-20 sm:pt-24 lg:pt-32">
        <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-gray-900"></div>
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1920')] bg-cover bg-center opacity-15"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent"></div>

        {/* Animated orbs */}
        <div class="absolute top-1/4 -left-32 h-48 w-48 rounded-full bg-blue-500/20 blur-[80px] lg:h-64 lg:w-64"></div>
        <div class="absolute top-1/2 -right-32 h-48 w-48 rounded-full bg-cyan-500/15 blur-[80px] lg:h-64 lg:w-64"></div>

        <div class="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {/* Header Banner */}
          <div class="mb-6 flex items-center justify-center lg:justify-start">
            <div class="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 backdrop-blur-sm">
              <span class="h-2 w-2 animate-pulse rounded-full bg-blue-400"></span>
              <span class="text-sm font-medium text-blue-300">
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
                <span class="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
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
                  href="/register"
                  class="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-xl sm:px-8 sm:py-4"
                >
                  Register Now
                </a>
                <a
                  href="/events"
                  class="rounded-xl border border-slate-700 bg-slate-800/50 px-6 py-3 text-center text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-slate-800 sm:px-8 sm:py-4"
                >
                  Explore Events
                </a>
              </div>
            </div>

            {/* Right - Day Cards */}
            <div class="flex flex-col gap-4 pt-6 lg:pt-0">
              {days.value.map((day, index) => (
                <div
                  key={day.day}
                  class="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-blue-500/30"
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
                        <span class="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-2 py-0.5 text-xs font-bold text-white sm:px-3">
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

                    <div class="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 transition-all group-hover:border-blue-500 group-hover:bg-blue-500/20 sm:flex sm:h-14 sm:w-14">
                      <svg
                        class="h-4 w-4 text-slate-400 transition-all group-hover:text-blue-400 sm:h-6 sm:w-6"
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

      {/* About Section */}
      <section class="relative overflow-hidden py-16 sm:py-24">
        <div class="absolute inset-0 bg-gray-950"></div>
        <div class="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl sm:h-[600px] sm:w-[600px]"></div>

        <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="mb-10 text-center sm:mb-16">
            <span class="mb-3 inline-block rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400 sm:mb-4 sm:text-sm">
              About The Event
            </span>
            <h2 class="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              India's Premier{" "}
              <span class="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Techno-Management
              </span>{" "}
              Fest
            </h2>
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
                class="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm transition-all hover:border-blue-500/30 sm:p-8"
              >
                <div class="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 sm:h-14 sm:w-14">
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
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920')] bg-cover bg-center opacity-5"></div>

        <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="grid grid-cols-2 gap-6 text-center sm:grid-cols-4 sm:gap-8">
            {[
              { value: "50+", label: "Events" },
              { value: "5000+", label: "Participants" },
              { value: "100+", label: "Colleges" },
              { value: "₹5L+", label: "Prizes" },
            ].map((stat) => (
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

      {/* CTA Section */}
      <section class="relative overflow-hidden py-16 sm:py-24">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-gray-950"></div>
        <div class="absolute top-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl sm:h-[500px] sm:w-[500px]"></div>

        <div class="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 class="mb-4 text-3xl font-bold text-white sm:mb-6 sm:text-4xl lg:text-6xl">
            Ready to{" "}
            <span class="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Shine?
            </span>
          </h2>
          <p class="mb-8 text-base text-slate-400 sm:mb-10 sm:text-xl">
            Join thousands of innovators at Theta 2026. Register now and be part
            of something extraordinary.
          </p>
          <div class="flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="/register"
              class="rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105 hover:shadow-xl sm:px-10 sm:py-4"
            >
              Register Now
            </a>
            <a
              href="/events"
              class="rounded-xl border border-slate-700 bg-slate-800/50 px-8 py-3 text-base font-semibold text-white backdrop-blur-sm transition-all hover:border-slate-600 hover:bg-slate-800 sm:px-10 sm:py-4"
            >
              Browse Events
            </a>
          </div>
        </div>
      </section>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Theta 2026 - Home",
};
