import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";

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

interface ContactCopy {
  titlePrefix: string;
  titleAccent: string;
  subtitle: string;
  webtekLabel: string;
  contactPrefix: string;
  stillQuestionsTitle: string;
  stillQuestionsSubtitle: string;
  sendEmailLabel: string;
}

const defaultContactCopy: ContactCopy = {
  titlePrefix: "Get in",
  titleAccent: "Touch",
  subtitle: "Have questions? Reach out to the Theta 2026 team.",
  webtekLabel: "WebTek Team",
  contactPrefix: "Contact:",
  stillQuestionsTitle: "Still have questions?",
  stillQuestionsSubtitle: "Feel free to connect with our coordinators.",
  sendEmailLabel: "Send us an email",
};

const defaultTeamData: TeamData = {
  order: [
    { key: "coordinators", label: "Coordinators" },
    { key: "president", label: "President" },
    { key: "vicePresidents", label: "Vice Presidents" },
    { key: "sponsorship", label: "Sponsorship" },
    { key: "publicRelation", label: "Public Relations" },
  ],
  president: [],
  vicePresidents: [],
  coordinators: [],
  sponsorship: [],
  publicRelation: [],
  webtek: {
    github: "#",
    linkedin: "#",
    email: "theta@sastra.edu",
  },
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default component$(() => {
  const teamData = useSignal<TeamData>(defaultTeamData);
  const copy = useSignal<ContactCopy>(defaultContactCopy);

  useVisibleTask$(async () => {
    try {
      const [teamRes, contentRes] = await Promise.all([
        fetch("/data/team.json"),
        fetch("/data/content.json"),
      ]);

      const team = (await teamRes.json()) as Partial<TeamData>;
      const content = (await contentRes.json()) as {
        contactPage?: Partial<ContactCopy>;
        seo?: { contactTitle?: string; contactDescription?: string };
      };

      teamData.value = {
        ...defaultTeamData,
        ...team,
        webtek: { ...defaultTeamData.webtek, ...(team.webtek || {}) },
        order: team.order || defaultTeamData.order,
      };

      if (content.contactPage) {
        copy.value = { ...defaultContactCopy, ...content.contactPage };
      }

      if (content.seo?.contactTitle) document.title = content.seo.contactTitle;
      if (content.seo?.contactDescription) {
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", "description");
          document.head.appendChild(meta);
        }
        meta.setAttribute("content", content.seo.contactDescription);
      }
    } catch {
      teamData.value = defaultTeamData;
      copy.value = defaultContactCopy;
    }
  });

  const TeamCard = ({ member }: { member: TeamMember }) => (
    <article class="theta-panel group p-6 transition duration-200 hover:[transform:translateY(-6px)_rotate(-0.6deg)]">
      <div class="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-black/20 bg-neutral-900 text-2xl font-black text-white shadow-[0_0_0_2px_rgba(124,58,237,0.35)]">
        <div
          class="absolute h-24 w-24 rounded-full bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url(${member.image})` }}
        ></div>
        <span class="relative z-10">{getInitials(member.name)}</span>
      </div>
      <h3 class="mt-4 text-center text-xl font-extrabold">{member.name}</h3>
      <p class="mt-1 text-center text-sm font-semibold text-[var(--theta-primary)]">{member.role}</p>
      <div class="mt-4 space-y-2 text-sm text-neutral-700">
        <a href={`tel:${member.phone}`} class="theta-focus flex items-center justify-center rounded-lg border border-black/15 px-3 py-2 hover:border-[var(--theta-primary)]">
          {member.phone}
        </a>
        <a href={`mailto:${member.email}`} class="theta-focus flex items-center justify-center rounded-lg border border-black/15 px-3 py-2 hover:border-[var(--theta-primary)]">
          {member.email}
        </a>
      </div>
    </article>
  );

  return (
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="theta-shell p-7 text-center sm:p-10">
        <h1 class="text-4xl font-extrabold sm:text-5xl">
          {copy.value.titlePrefix} <span class="text-[var(--theta-primary)]">{copy.value.titleAccent}</span>
        </h1>
        <p class="mx-auto mt-3 max-w-2xl text-neutral-600">{copy.value.subtitle}</p>
      </section>

      <section class="mt-8 space-y-10">
        {teamData.value.order.map((section) => {
          const members = teamData.value[
            section.key as keyof Omit<TeamData, "order" | "webtek">
          ] as TeamMember[];

          if (!Array.isArray(members) || members.length === 0) return null;

          return (
            <div key={section.key}>
              <h2 class="mb-4 text-2xl font-extrabold">{section.label}</h2>
              <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <TeamCard key={member.name} member={member} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section class="mt-12 grid gap-5 lg:grid-cols-2">
        <div class="theta-shell p-6">
          <span class="theta-badge border-black/20 text-neutral-900">{copy.value.webtekLabel}</span>
          <p class="mt-3 text-sm text-neutral-600">Build and maintenance by WebTek.</p>
          <div class="mt-4 flex flex-wrap gap-3">
            <a href={teamData.value.webtek.github} target="_blank" rel="noopener noreferrer" class="theta-focus rounded-lg border border-black/15 px-4 py-2 text-sm font-bold">GitHub</a>
            <a href={teamData.value.webtek.linkedin} target="_blank" rel="noopener noreferrer" class="theta-focus rounded-lg border border-black/15 px-4 py-2 text-sm font-bold">LinkedIn</a>
            <a href={`mailto:${teamData.value.webtek.email}`} class="theta-focus rounded-lg border border-black/15 px-4 py-2 text-sm font-bold">Email</a>
          </div>
        </div>

        <div class="theta-shell p-6">
          <h3 class="text-2xl font-extrabold">{copy.value.stillQuestionsTitle}</h3>
          <p class="mt-2 text-sm text-neutral-600">{copy.value.stillQuestionsSubtitle}</p>
          <a href={`mailto:${teamData.value.webtek.email}`} class="theta-focus mt-4 inline-flex rounded-xl border-2 border-[var(--theta-primary)] bg-[var(--theta-primary)] px-5 py-3 text-sm font-bold text-white">
            {copy.value.sendEmailLabel}
          </a>
        </div>
      </section>
    </div>
  );
});
