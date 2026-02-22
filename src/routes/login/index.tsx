import { component$, useSignal, $ } from "@builder.io/qwik";
import { Link, useNavigate, type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const email = useSignal("");
  const password = useSignal("");
  const error = useSignal("");
  const fieldErrors = useSignal<Record<string, string>>({});
  const touched = useSignal<Record<string, boolean>>({});
  const loading = useSignal(false);
  const navigate = useNavigate();

  const validateField = $((field: string, value: string) => {
    const errors: Record<string, string> = { ...fieldErrors.value };

    if (field === "email") {
      if (!value) errors[field] = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        errors[field] = "Invalid email";
      else delete errors[field];
    }
    if (field === "password") {
      if (!value) errors[field] = "Password is required";
      else delete errors[field];
    }

    fieldErrors.value = errors;
  });

  const handleInput = $((field: string, value: string) => {
    validateField(field, value);
  });

  const handleSubmit = $(async () => {
    touched.value = { email: true, password: true };
    await validateField("email", email.value);
    await validateField("password", password.value);

    if (Object.keys(fieldErrors.value).length > 0) {
      return;
    }

    loading.value = true;
    error.value = "";

    try {
      const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email: email.value,
          password: password.value,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        navigate("/");
      } else {
        error.value = data.message || "Login failed";
      }
    } catch (e) {
      error.value = "Unable to connect to server";
    } finally {
      loading.value = false;
    }
  });

  return (
    <div class="flex min-h-screen items-center justify-center p-4">
      <div class="w-full max-w-[480px]">
        <div class="rounded-3xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl">
          <div class="mb-6 text-center">
            <div class="animate-float mb-4 inline-flex h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-gray-800 to-gray-950 shadow-2xl">
              <img src="/theta-logo.png" alt="Theta" class="h-20 w-auto" />
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900">
              Welcome Back
            </h1>
            <p class="mt-1 text-xs text-gray-400">Sign in to continue</p>
          </div>

          {error.value && (
            <div class="mb-4 rounded-xl border border-red-100 bg-red-50 p-2.5 text-center text-xs text-red-600">
              {error.value}
            </div>
          )}

          <form
            preventdefault:submit
            onSubmit$={handleSubmit}
            class="space-y-3"
          >
            <div>
              <label
                class="text-[10px] font-semibold tracking-widest text-gray-400 uppercase"
                for="email"
              >
                | Email
              </label>
              <input
                id="email"
                type="email"
                value={email.value}
                onInput$={(e) => {
                  email.value = (e.target as HTMLInputElement).value;
                  validateField("email", email.value);
                }}
                onBlur$={() => {
                  touched.value = { ...touched.value, email: true };
                  validateField("email", email.value);
                }}
                class={[
                  "mt-1 w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm shadow-sm transition-all focus:bg-white",
                  fieldErrors.value.email && touched.value.email
                    ? "placeholder:text-red-400 focus:ring-2 focus:ring-red-500"
                    : "focus:ring-2 focus:ring-gray-900",
                ]}
                placeholder={
                  fieldErrors.value.email && touched.value.email
                    ? fieldErrors.value.email
                    : "you@example.com"
                }
                required
              />
            </div>

            <div>
              <label
                class="text-[10px] font-semibold tracking-widest text-gray-400 uppercase"
                for="password"
              >
                | Password
              </label>
              <input
                id="password"
                type="password"
                value={password.value}
                onInput$={(e) => {
                  password.value = (e.target as HTMLInputElement).value;
                  validateField("password", password.value);
                }}
                onBlur$={() => {
                  touched.value = { ...touched.value, password: true };
                  validateField("password", password.value);
                }}
                class={[
                  "mt-1 w-full rounded-xl border-0 bg-white/80 px-4 py-3 text-sm shadow-sm transition-all focus:bg-white",
                  fieldErrors.value.password && touched.value.password
                    ? "placeholder:text-red-400 focus:ring-2 focus:ring-red-500"
                    : "focus:ring-2 focus:ring-gray-900",
                ]}
                placeholder={
                  fieldErrors.value.password && touched.value.password
                    ? fieldErrors.value.password
                    : "Enter password"
                }
                required
              />
            </div>

            <button
              type="submit"
              class="mt-2 w-full rounded-xl bg-gray-900 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-xl"
              disabled={loading.value}
            >
              {loading.value ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p class="mt-5 text-center text-xs text-gray-400">
            Don't have an account?{" "}
            <Link
              href="/register"
              class="font-medium text-gray-700 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Login - Theta",
};
