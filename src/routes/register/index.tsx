import { component$, useSignal, $ } from "@builder.io/qwik";
import { Link, useNavigate, type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  const fullName = useSignal("");
  const regNo = useSignal("");
  const email = useSignal("");
  const password = useSignal("");
  const phoneNo = useSignal("");
  const department = useSignal("");
  const course = useSignal("");
  const year = useSignal("");
  const isSastraStudent = useSignal(false);
  const agreeTerms = useSignal(false);
  const error = useSignal("");
  const fieldErrors = useSignal<Record<string, string>>({});
  const touched = useSignal<Record<string, boolean>>({});
  const loading = useSignal(false);
  const showModal = useSignal(false);
  const navigate = useNavigate();

  const validateField = $((field: string, value: string) => {
    const errors: Record<string, string> = { ...fieldErrors.value };

    if (field === "fullName") {
      if (!value.trim()) errors[field] = "Name is required";
      else delete errors[field];
    }
    if (field === "email") {
      if (!value) errors[field] = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        errors[field] = "Invalid email";
      else delete errors[field];
    }
    if (field === "password") {
      if (!value) errors[field] = "Password is required";
      else if (value.length < 8) errors[field] = "Min 8 characters";
      else delete errors[field];
    }
    if (field === "regNo") {
      if (isSastraStudent.value) {
        if (!value) errors[field] = "Reg No is required";
        else if (value.length !== 9) errors[field] = "Must be 9 digits";
        else delete errors[field];
      } else {
        delete errors[field];
      }
    }
    if (field === "phoneNo") {
      if (!value) errors[field] = "Phone is required";
      else if (value.length !== 10) errors[field] = "Must be 10 digits";
      else delete errors[field];
    }
    if (field === "department") {
      if (!value.trim()) errors[field] = "Department is required";
      else delete errors[field];
    }
    if (field === "course") {
      if (!value.trim()) errors[field] = "Course is required";
      else delete errors[field];
    }
    if (field === "year") {
      if (!value) errors[field] = "Year is required";
      else delete errors[field];
    }

    fieldErrors.value = errors;
  });

  const handleSubmit = $(() => {
    touched.value = {
      fullName: true,
      email: true,
      password: true,
      regNo: true,
      phoneNo: true,
      department: true,
      course: true,
      year: true,
    };
    validateField("fullName", fullName.value);
    validateField("email", email.value);
    validateField("password", password.value);
    if (isSastraStudent.value) validateField("regNo", regNo.value);
    validateField("phoneNo", phoneNo.value);
    validateField("department", department.value);
    validateField("course", course.value);
    validateField("year", year.value);

    if (!agreeTerms.value) {
      error.value = "Please agree to the terms";
      return;
    }

    if (Object.keys(fieldErrors.value).length > 0) {
      return;
    }

    showModal.value = true;
  });

  const confirmSubmit = $(async () => {
    loading.value = true;
    showModal.value = false;

    try {
      const res = await fetch(
        `${import.meta.env.PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            fullName: fullName.value,
            email: email.value,
            password: password.value,
            regNo: regNo.value,
            phoneNo: phoneNo.value,
            isSastraStudent: isSastraStudent.value.toString(),
          }),
        },
      );

      const data = await res.json();

      if (data.status === "success") {
        navigate("/login");
      } else {
        if (data.errors) {
          const errMsgs = Object.values(data.errors).join(", ");
          error.value = errMsgs;
        } else {
          error.value = data.message || "Registration failed";
        }
      }
    } catch (e) {
      error.value = "Unable to connect to server";
    } finally {
      loading.value = false;
    }
  });

  return (
    <>
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="relative z-10 w-full max-w-md">
          <a
            href="/login"
            class="mb-4 inline-flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="h-4 w-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
            Back
          </a>
          <div class="rounded-3xl bg-white/80 p-6 shadow-2xl backdrop-blur-2xl">
            <div class="mb-5 text-center">
              <div class="animate-float mb-3 inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-gray-800 to-gray-950 shadow-2xl">
                <img src="/theta-logo.png" alt="Theta" class="h-16 w-auto" />
              </div>
              <h1 class="text-xl font-bold text-gray-900">Join Theta</h1>
              <p class="mt-1 text-xs text-gray-400">Create your account</p>
            </div>

            {error.value && (
              <div class="mb-3 rounded-xl border border-red-100 bg-red-50 p-2 text-center text-xs text-red-600">
                {error.value}
              </div>
            )}

            <form
              preventdefault:submit
              onSubmit$={handleSubmit}
              class="space-y-2.5"
            >
              <button
                type="button"
                onClick$={() => {
                  isSastraStudent.value = !isSastraStudent.value;
                  if (!isSastraStudent.value) {
                    regNo.value = "";
                  }
                }}
                class={[
                  "flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                  isSastraStudent.value
                    ? "border-gray-900 bg-gray-50 text-gray-900"
                    : "border-gray-200 bg-white text-gray-500 hover:border-gray-300",
                ]}
              >
                <span>SASTRA Student</span>
                <span
                  class={[
                    "flex h-5 w-9 items-center rounded-full px-0.5 transition-colors",
                    isSastraStudent.value ? "bg-gray-900" : "bg-gray-200",
                  ]}
                >
                  <span
                    class={[
                      "h-4 w-4 rounded-full bg-white shadow transition-transform",
                      isSastraStudent.value ? "translate-x-4" : "translate-x-0",
                    ]}
                  ></span>
                </span>
              </button>
              <p class="text-[10px] text-gray-400">
                {isSastraStudent.value
                  ? "Use your @sastra.ac.in email and registration number"
                  : "Toggle if you're from SASTRA University"}
              </p>

              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label
                    class="text-[10px] font-semibold tracking-widest text-gray-400 uppercase"
                    for="fullName"
                  >
                    | Name
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    value={fullName.value}
                    onInput$={(e) => {
                      fullName.value = (e.target as HTMLInputElement).value;
                      validateField("fullName", fullName.value);
                    }}
                    onBlur$={() => {
                      touched.value = { ...touched.value, fullName: true };
                      validateField("fullName", fullName.value);
                    }}
                    class={[
                      "w-full rounded-lg border-0 bg-white/80 px-3 py-2 text-sm shadow-sm transition-all focus:bg-white",
                      fieldErrors.value.fullName && touched.value.fullName
                        ? "placeholder:text-red-400 focus:ring-2 focus:ring-red-500"
                        : "focus:ring-2 focus:ring-gray-900",
                    ]}
                    placeholder={
                      fieldErrors.value.fullName && touched.value.fullName
                        ? fieldErrors.value.fullName
                        : "John"
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    class="text-[10px] font-semibold tracking-widest text-gray-400 uppercase"
                    for="regNo"
                  >
                    | Reg No
                  </label>
                  <input
                    id="regNo"
                    type="text"
                    value={regNo.value}
                    onInput$={(e) => {
                      let val = (e.target as HTMLInputElement).value;
                      if (isSastraStudent.value) {
                        val = val.replace(/\D/g, "").slice(0, 9);
                      }
                      regNo.value = val;
                      validateField("regNo", regNo.value);
                    }}
                    onBlur$={() => {
                      touched.value = { ...touched.value, regNo: true };
                      validateField("regNo", regNo.value);
                    }}
                    class={[
                      "w-full rounded-lg border-0 bg-white/80 px-3 py-2 text-sm shadow-sm transition-all focus:bg-white",
                      fieldErrors.value.regNo && touched.value.regNo
                        ? "placeholder:text-red-400 focus:ring-2 focus:ring-red-500"
                        : "focus:ring-2 focus:ring-gray-900",
                    ]}
                    placeholder={
                      fieldErrors.value.regNo && touched.value.regNo
                        ? fieldErrors.value.regNo
                        : isSastraStudent.value
                          ? "123456789"
                          : "Optional"
                    }
                    maxLength={isSastraStudent.value ? 9 : 20}
                  />
                </div>
              </div>

              <div>
                <label
                  class="text-[10px] font-semibold tracking-widest text-gray-400 uppercase"
                  for="department"
                >
                  | Department
                </label>
                <input
                  id="department"
                  type="text"
                  value={department.value}
                  onInput$={(e) => {
                    department.value = (e.target as HTMLInputElement).value;
                    validateField("department", department.value);
                  }}
                  onBlur$={() => {
                    touched.value = { ...touched.value, department: true };
                    validateField("department", department.value);
                  }}
                  class={[
                    "w-full rounded-lg border-0 bg-white/80 px-3 py-2 text-sm shadow-sm transition-all focus:bg-white",
                    fieldErrors.value.department && touched.value.department
                      ? "placeholder:text-red-400 focus:ring-2 focus:ring-red-500"
                      : "focus:ring-2 focus:ring-gray-900",
                  ]}
                  placeholder={
                    fieldErrors.value.department && touched.value.department
                      ? fieldErrors.value.department
                      : "Computer Science"
                  }
                  required
                />
              </div>

              <div class="grid grid-cols-2 gap-2.5">
                <div>
                  <label
                    class="text-[10px] font-semibold tracking-widest text-gray-400 uppercase"
                    for="course"
                  >
                    | Course
                  </label>
                  <input
                    id="course"
                    type="text"
                    value={course.value}
                    onInput$={(e) => {
                      course.value = (e.target as HTMLInputElement).value;
                      validateField("course", course.value);
                    }}
                    onBlur$={() => {
                      touched.value = { ...touched.value, course: true };
                      validateField("course", course.value);
                    }}
                    class={[
                      "w-full rounded-lg border-0 bg-white/80 px-3 py-2 text-sm shadow-sm transition-all focus:bg-white",
                      fieldErrors.value.course && touched.value.course
                        ? "placeholder:text-red-400 focus:ring-2 focus:ring-red-500"
                        : "focus:ring-2 focus:ring-gray-900",
                    ]}
                    placeholder={
                      fieldErrors.value.course && touched.value.course
                        ? fieldErrors.value.course
                        : "B.Tech"
                    }
                    required
                  />
                </div>
                <div>
                  <label
                    class="text-[10px] font-semibold tracking-widest text-gray-400 uppercase"
                    for="year"
                  >
                    | Year
                  </label>
                  <select
                    id="year"
                    value={year.value}
                    onChange$={(e) => {
                      year.value = (e.target as HTMLSelectElement).value;
                      validateField("year", year.value);
                    }}
                    onBlur$={() => {
                      touched.value = { ...touched.value, year: true };
                      validateField("year", year.value);
                    }}
                    class={[
                      "w-full cursor-pointer appearance-none rounded-lg border-0 bg-white/80 px-3 py-2 text-sm shadow-sm transition-all focus:bg-white",
                      fieldErrors.value.year && touched.value.year
                        ? "focus:ring-2 focus:ring-red-500"
                        : "focus:ring-2 focus:ring-gray-900",
                    ]}
                    required
                  >
                    <option value="">
                      {fieldErrors.value.year && touched.value.year
                        ? fieldErrors.value.year
                        : "Select"}
                    </option>
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  class="text-[10px] font-semibold tracking-widest text-gray-400 uppercase"
                  for="email"
                >
                  | Email{" "}
                  {isSastraStudent.value && (
                    <span class="text-gray-400">(@sastra.ac.in)</span>
                  )}
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
                    "w-full rounded-lg border-0 bg-white/80 px-3 py-2 text-sm shadow-sm transition-all focus:bg-white",
                    fieldErrors.value.email && touched.value.email
                      ? "placeholder:text-red-400 focus:ring-2 focus:ring-red-500"
                      : "focus:ring-2 focus:ring-gray-900",
                  ]}
                  placeholder={
                    fieldErrors.value.email && touched.value.email
                      ? fieldErrors.value.email
                      : isSastraStudent.value
                        ? "you@sastra.ac.in"
                        : "you@example.com"
                  }
                  required
                />
                {!isSastraStudent.value && (
                  <p class="mt-1 text-[9px] text-gray-300">
                    SASTRA students use @sastra.ac.in
                  </p>
                )}
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
                    "w-full rounded-lg border-0 bg-white/80 px-3 py-2 text-sm shadow-sm transition-all focus:bg-white",
                    fieldErrors.value.password && touched.value.password
                      ? "placeholder:text-red-400 focus:ring-2 focus:ring-red-500"
                      : "focus:ring-2 focus:ring-gray-900",
                  ]}
                  placeholder={
                    fieldErrors.value.password && touched.value.password
                      ? fieldErrors.value.password
                      : "Min 8 characters"
                  }
                  minLength={8}
                  required
                />
              </div>

              <div>
                <label
                  class="text-[10px] font-semibold tracking-widest text-gray-400 uppercase"
                  for="phoneNo"
                >
                  | Phone
                </label>
                <div
                  class={[
                    "flex items-center rounded-lg bg-white/80 shadow-sm transition-all focus-within:bg-white",
                    fieldErrors.value.phoneNo && touched.value.phoneNo
                      ? "focus-within:ring-2 focus-within:ring-red-500"
                      : "focus-within:ring-2 focus-within:ring-gray-900",
                  ]}
                >
                  <span class="px-2 text-xs text-gray-400">+91</span>
                  <span class="text-gray-200">|</span>
                  <input
                    id="phoneNo"
                    type="tel"
                    value={phoneNo.value}
                    onInput$={(e) => {
                      phoneNo.value = (e.target as HTMLInputElement).value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      validateField("phoneNo", phoneNo.value);
                    }}
                    onBlur$={() => {
                      touched.value = { ...touched.value, phoneNo: true };
                      validateField("phoneNo", phoneNo.value);
                    }}
                    class={[
                      "flex-1 border-0 bg-transparent px-2 py-2 text-sm outline-none focus:ring-0",
                      fieldErrors.value.phoneNo && touched.value.phoneNo
                        ? "placeholder:text-red-400"
                        : "placeholder:text-gray-400",
                    ]}
                    placeholder={
                      fieldErrors.value.phoneNo && touched.value.phoneNo
                        ? fieldErrors.value.phoneNo
                        : "9876543210"
                    }
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div class="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms.value}
                  onChange$={(e) =>
                    (agreeTerms.value = (e.target as HTMLInputElement).checked)
                  }
                  class="h-3.5 w-3.5 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label
                  for="agreeTerms"
                  class="cursor-pointer text-xs text-gray-500"
                >
                  I agree to the terms
                </label>
              </div>

              <button
                type="submit"
                class="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-xl"
                disabled={loading.value}
              >
                {loading.value ? "Creating..." : "Register"}
              </button>
            </form>

            <p class="mt-4 text-center text-xs text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                class="font-medium text-gray-700 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {showModal.value && (
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
          <div class="w-full max-w-xs rounded-2xl bg-white p-5 shadow-2xl">
            <h2 class="mb-4 text-base font-bold text-gray-900">
              Confirm Details
            </h2>
            <div class="space-y-2 text-xs">
              <div class="flex justify-between border-b border-gray-100 py-1.5">
                <span class="text-gray-400">Name</span>
                <span class="font-medium text-gray-800">{fullName.value}</span>
              </div>
              {isSastraStudent.value && (
                <div class="flex justify-between border-b border-gray-100 py-1.5">
                  <span class="text-gray-400">Reg No</span>
                  <span class="font-medium text-gray-800">{regNo.value}</span>
                </div>
              )}
              <div class="flex justify-between border-b border-gray-100 py-1.5">
                <span class="text-gray-400">Email</span>
                <span class="font-medium text-gray-800">{email.value}</span>
              </div>
              <div class="flex justify-between border-b border-gray-100 py-1.5">
                <span class="text-gray-400">Dept</span>
                <span class="font-medium text-gray-800">
                  {department.value}
                </span>
              </div>
              <div class="flex justify-between border-b border-gray-100 py-1.5">
                <span class="text-gray-400">Year</span>
                <span class="font-medium text-gray-800">{year.value}</span>
              </div>
              <div class="flex justify-between py-1.5">
                <span class="text-gray-400">Phone</span>
                <span class="font-medium text-gray-800">
                  +91 {phoneNo.value}
                </span>
              </div>
            </div>
            <div class="mt-4 flex gap-2">
              <button
                class="flex-1 rounded-lg border border-gray-200 py-2 text-xs font-medium text-gray-600 transition-all hover:bg-gray-50"
                onClick$={() => (showModal.value = false)}
              >
                Cancel
              </button>
              <button
                class="flex-1 rounded-lg bg-gray-900 py-2 text-xs font-medium text-white shadow-lg transition-all hover:bg-gray-800"
                onClick$={confirmSubmit}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export const head: DocumentHead = {
  title: "Register - Theta",
};
