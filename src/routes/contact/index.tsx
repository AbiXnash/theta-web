import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

interface TeamMember {
  name: string;
  role: string;
  email: string;
  phone: string;
  image: string;
}

interface TeamData {
  order: { key: string; label: string }[];
  president: TeamMember[];
  vicePresidents: TeamMember[];
  coordinators: TeamMember[];
  sponsorship: TeamMember[];
  publicRelation: TeamMember[];
  webtek: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export default component$(() => {
  const teamData = useSignal<TeamData | null>(null);

  useVisibleTask$(async () => {
    try {
      const res = await fetch("/team.json");
      const data = await res.json();
      teamData.value = data;
    } catch (e) {
      console.error("Failed to load team data", e);
    }
  });

  const TeamCard = ({
    member,
    size = "md",
  }: {
    member: TeamMember;
    size?: "sm" | "md" | "lg";
  }) => (
    <div class="premium-surface premium-card group flex flex-col items-center rounded-2xl p-6 transition-all hover:border-violet-400/50 sm:p-8">
      <div class="text-center">
        <h4
          class={[
            "font-bold text-white",
            size === "lg" ? "text-3xl" : size === "md" ? "text-2xl" : "text-xl",
          ]}
        >
          {member.name}
        </h4>
        <p
          class={[
            "font-medium text-violet-400",
            size === "lg" ? "text-lg" : "text-base",
          ]}
        >
          {member.role}
        </p>
        <div class="mt-4 flex flex-col items-center gap-2">
          <a
            href={`mailto:${member.email}`}
            class={[
              "flex items-center gap-2 text-slate-300 transition-colors hover:text-violet-400",
              size === "lg" ? "text-base" : "text-sm",
            ]}
          >
            <svg
              class="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span class="underline underline-offset-2">{member.email}</span>
          </a>
          <a
            href={`tel:${member.phone}`}
            class={[
              "flex items-center gap-2 text-slate-300 transition-colors hover:text-violet-400",
              size === "lg" ? "text-base" : "text-sm",
            ]}
          >
            <svg
              class="h-5 w-5 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span class="underline underline-offset-2">{member.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div class="min-h-screen bg-gray-950">
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-gray-900"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent"></div>

      <div class="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="mb-16 text-center">
          <h1 class="mb-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
            Get in{" "}
            <span class="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p class="mx-auto max-w-2xl text-lg text-slate-400">
            Have questions? We'd love to hear from you. Reach out to our team!
          </p>
        </div>

        {teamData.value && (
          <div class="space-y-20">
            {teamData.value.order.map(({ key, label }) => {
              const members = teamData.value?.[
                key as keyof Omit<TeamData, "order" | "webtek">
              ] as TeamMember[] | undefined;
              if (!members || members.length === 0) return null;
              return (
                <div key={key}>
                  <h3 class="mb-10 text-center text-2xl font-bold tracking-widest text-slate-400 uppercase">
                    {label}
                  </h3>
                  <div class="flex flex-wrap justify-center gap-6">
                    {members.map((member) => (
                      <TeamCard
                        key={member.name}
                        member={member}
                        size={
                          key === "president"
                            ? "lg"
                            : key === "coordinators"
                              ? "sm"
                              : "md"
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* WebTek Team - Last */}
            <div>
              <div class="mb-10 text-center">
                <span class="inline-block rounded-full border border-violet-500/30 bg-violet-500/10 px-6 py-2 text-lg font-medium text-violet-400">
                  WebTek Team
                </span>
              </div>
              <div class="flex flex-col items-center justify-center gap-6">
                <div class="flex gap-6">
                  <a
                    href={teamData.value.webtek.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="premium-surface premium-card flex h-16 w-16 items-center justify-center rounded-full text-slate-300 transition-all hover:border-violet-300/70 hover:text-violet-200"
                  >
                    <svg
                      class="h-8 w-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .267.18.578.688.48C19.138 20.197 22 16.418 22 12.017 22 6.484 17.522 2 12 2z"
                      />
                    </svg>
                  </a>
                  <a
                    href={teamData.value.webtek.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="premium-surface premium-card flex h-16 w-16 items-center justify-center rounded-full text-slate-300 transition-all hover:border-violet-300/70 hover:text-violet-200"
                  >
                    <svg
                      class="h-8 w-8"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href={`mailto:${teamData.value.webtek.email}`}
                    class="premium-surface premium-card flex h-16 w-16 items-center justify-center rounded-full text-slate-300 transition-all hover:border-violet-300/70 hover:text-violet-200"
                  >
                    <svg
                      class="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </a>
                </div>
                <div class="text-center">
                  <p class="text-lg text-slate-400">
                    Contact:{" "}
                    <a
                      href={`mailto:${teamData.value.webtek.email}`}
                      class="text-violet-400 hover:underline"
                    >
                      {teamData.value.webtek.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!teamData.value && (
          <div class="flex justify-center py-20">
            <div class="h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent"></div>
          </div>
        )}

        <div class="mt-20 text-center">
          <div class="premium-surface premium-ring rounded-2xl p-8">
            <h3 class="mb-2 text-2xl font-bold text-white">
              Still have questions?
            </h3>
            <p class="mb-4 text-slate-400">
              Feel free to reach out to any of our team members
            </p>
            <a
              href="mailto:abinash@theabx.in"
              class="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:scale-105 hover:shadow-xl"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Send us an email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Contact - Theta 2026",
  meta: [
    {
      name: "description",
      content:
        "Contact the Theta 2026 organizing team, coordinators, and WebTek support for event or sponsorship queries.",
    },
  ],
};
