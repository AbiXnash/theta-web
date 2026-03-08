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
  webtekTitle: string;
  webtekDescription: string;
  githubLabel: string;
  linkedinLabel: string;
  emailLabel: string;
  membersSuffix: string;
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
  webtekTitle: "Engineering & Platform",
  webtekDescription: "Build, deployment, and experience optimization powered by WebTek.",
  githubLabel: "GitHub",
  linkedinLabel: "LinkedIn",
  emailLabel: "Email",
  membersSuffix: "members",
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
    <article class="theta-panel group relative overflow-hidden border-black/15 bg-white p-5 transition duration-200 hover:[transform:translateY(-6px)_rotate(-0.5deg)]">
      <div class="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-[var(--theta-primary)]/10 blur-2xl"></div>
      <div class="relative mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-black/20 bg-white text-2xl font-black text-neutral-900 shadow-[0_0_0_2px_rgba(6, 182, 212,0.24)]">
        <img
          src={member.image || "/team/default-avatar.svg"}
          alt={member.name}
          loading="lazy"
          width={96}
          height={96}
          class="h-full w-full object-cover"
          onError$={(event) => {
            (event.target as HTMLImageElement).src = "/team/default-avatar.svg";
          }}
        />
        <span class="absolute bottom-1 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] text-white">
          {getInitials(member.name)}
        </span>
      </div>
      <h3 class="mt-4 text-center text-lg font-extrabold">{member.name}</h3>
      <p class="mt-1 text-center text-sm font-semibold text-[var(--theta-primary)]">{member.role}</p>
      <div class="mt-4 space-y-2 text-sm text-neutral-700">
        <a href={`tel:${member.phone}`} class="theta-focus flex items-center justify-center rounded-lg border border-black/15 bg-neutral-50 px-3 py-2 hover:border-[var(--theta-primary)]">
          {member.phone}
        </a>
        <a href={`mailto:${member.email}`} class="theta-focus flex items-center justify-center rounded-lg border border-black/15 bg-neutral-50 px-3 py-2 hover:border-[var(--theta-primary)]">
          {member.email}
        </a>
      </div>
    </article>
  );

  return (
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="theta-shell theta-reveal relative overflow-hidden p-7 sm:p-10">
        <div class="pointer-events-none absolute -top-14 -right-16 h-44 w-44 rounded-full bg-[var(--theta-primary)]/12 blur-3xl"></div>
        <div class="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <h1 class="text-4xl font-extrabold sm:text-5xl">
              {copy.value.titlePrefix} <span class="text-[var(--theta-primary)]">{copy.value.titleAccent}</span>
            </h1>
            <p class="mt-3 max-w-2xl text-neutral-600">{copy.value.subtitle}</p>
          </div>
          <div class="rounded-xl border-2 border-black/15 bg-white p-2 shadow-[6px_6px_0_#111]">
            <img
              src="/sponsors/general/sastra-university-logo.jpg"
              alt="SASTRA University"
              width={200}
              height={72}
              class="h-12 w-auto object-contain"
            />
          </div>
        </div>
      </section>

      <section class="theta-reveal theta-reveal-delay-1 mt-8 space-y-10">
        {teamData.value.order.map((section) => {
          const members = teamData.value[
            section.key as keyof Omit<TeamData, "order" | "webtek">
          ] as TeamMember[];

          if (!Array.isArray(members) || members.length === 0) return null;

          return (
            <div key={section.key}>
              <div class="mb-4 flex items-center justify-between gap-3">
                <h2 class="text-2xl font-extrabold">{section.label}</h2>
                <span class="theta-badge border-black/15 text-neutral-700">
                  {members.length} {copy.value.membersSuffix}
                </span>
              </div>
              <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <TeamCard key={member.name} member={member} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section class="theta-reveal theta-reveal-delay-2 mt-12 grid gap-5 lg:grid-cols-2">
        <div class="theta-shell relative overflow-hidden p-6">
          <div class="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[var(--theta-primary)]/12 blur-3xl"></div>
          <div class="relative">
            <span class="theta-badge border-black/20 text-neutral-900">{copy.value.webtekLabel}</span>
            <h3 class="mt-4 text-2xl font-extrabold text-neutral-900">{copy.value.webtekTitle}</h3>
            <p class="mt-2 text-sm text-neutral-600">
              {copy.value.webtekDescription}
            </p>
            <div class="mt-4 grid gap-2 sm:grid-cols-3">
              <a
                href={teamData.value.webtek.github}
                target="_blank"
                rel="noopener noreferrer"
                class="theta-focus rounded-xl border border-black/15 bg-white px-4 py-2 text-center text-sm font-bold hover:border-[var(--theta-primary)] hover:text-[var(--theta-primary)]"
              >
                {copy.value.githubLabel}
              </a>
              <a
                href={teamData.value.webtek.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                class="theta-focus rounded-xl border border-black/15 bg-white px-4 py-2 text-center text-sm font-bold hover:border-[var(--theta-primary)] hover:text-[var(--theta-primary)]"
              >
                {copy.value.linkedinLabel}
              </a>
              <a
                href={`mailto:${teamData.value.webtek.email}`}
                class="theta-focus rounded-xl border border-black/15 bg-white px-4 py-2 text-center text-sm font-bold hover:border-[var(--theta-primary)] hover:text-[var(--theta-primary)]"
              >
                {copy.value.emailLabel}
              </a>
            </div>
          </div>
        </div>

        <div class="theta-shell relative overflow-hidden p-6">
          <div class="pointer-events-none absolute -bottom-18 -left-12 h-40 w-40 rounded-full bg-[var(--theta-primary)]/12 blur-3xl"></div>
          <div class="relative">
            <h3 class="text-2xl font-extrabold">{copy.value.stillQuestionsTitle}</h3>
            <p class="mt-2 text-sm text-neutral-600">{copy.value.stillQuestionsSubtitle}</p>
            <a
              href={`mailto:${teamData.value.webtek.email}`}
              class="theta-focus mt-4 inline-flex rounded-xl border-2 border-[var(--theta-primary)] bg-[var(--theta-primary)] px-5 py-3 text-sm font-bold text-white shadow-[0_8px_20px_rgba(6, 182, 212,0.32)]"
            >
              {copy.value.sendEmailLabel}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
});
