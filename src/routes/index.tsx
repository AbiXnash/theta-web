import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="flex min-h-screen flex-col items-center justify-center p-6">
      <div class="text-center">
        <div class="animate-float mb-6 inline-flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-gray-800 to-gray-950 shadow-2xl">
          <img src="/theta-logo.png" alt="Theta" class="h-20 w-auto" />
        </div>
        <h1 class="mb-2 text-4xl font-bold tracking-tight text-gray-900">
          Theta
        </h1>
        <p class="mb-12 text-lg font-light text-gray-500">
          National Level Techno-Management Fest
        </p>
        <div class="flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            class="rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-700 shadow-lg transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-xl"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            class="rounded-xl bg-gray-900 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-xl"
          >
            Register
          </Link>
          <Link
            href="/home"
            class="rounded-xl border border-gray-200 bg-white px-8 py-3 text-sm font-semibold text-gray-500 shadow-lg transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-xl"
          >
            Guest
          </Link>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Theta - Techno-Management Fest",
  meta: [
    {
      name: "description",
      content: "Theta, A National Level Techno-Management Fest",
    },
  ],
};
