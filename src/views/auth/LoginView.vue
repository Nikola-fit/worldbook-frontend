<template>
  <PublicLayout>
    <section
      class="py-16"
      style="
        background: radial-gradient(
          circle at top left,
          #eff6ff 0,
          #f5f7fb 45%,
          #ffffff 100%
        );
      "
    >
      <div class="mx-auto max-w-4xl px-4">
        <!-- TEXT / INTRO -->
        <div class="text-center mb-10">
          <p
            class="text-xs uppercase tracking-[0.16em] font-semibold text-sky-600 mb-3"
          >
            Dobrodošao nazad • Nastavi priču
          </p>

          <h1
            class="text-3xl md:text-[2.2rem] leading-tight font-semibold text-slate-900 mb-4"
          >
            Prijavi se u <span class="text-sky-500">WorldBook</span>
          </h1>

          <p class="text-[0.98rem] text-slate-600 max-w-2xl mx-auto">
            Nakon prijave možeš dodavati pasuse, pratiti status odobrenja i
            učestvovati u kolektivnom pisanju knjige.
          </p>

          <div class="mt-5 flex justify-center gap-3 flex-wrap">
            <RouterLink
              to="/register"
              class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium border border-sky-500 text-sky-600 bg-white hover:bg-sky-50 transition"
            >
              Nemam nalog
            </RouterLink>

            <RouterLink
              to="/"
              class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 bg-white/60 border border-slate-200 hover:bg-white transition"
            >
              Nazad na početnu
            </RouterLink>
          </div>
        </div>

        <!-- LOGIN CARD -->
        <div class="flex justify-center">
          <div
            class="w-full max-w-md bg-white rounded-2xl p-6 md:p-7 border border-[rgba(15,118,196,0.08)] shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
          >
            <div class="mb-6 text-center">
              <h2 class="text-lg font-semibold text-slate-900">Prijava</h2>
              <p class="text-sm text-slate-500 mt-1">
                Unesi svoje podatke za nastavak.
              </p>
            </div>

            <form class="space-y-4" @submit.prevent="onSubmit">
              <!-- USERNAME -->
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">
                  Korisničko ime
                </label>
                <input
                  v-model.trim="form.username"
                  type="text"
                  autocomplete="username"
                  placeholder="npr. nikolaa"
                  class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <p v-if="errors.username" class="mt-1 text-xs text-red-600">
                  {{ errors.username }}
                </p>
              </div>

              <!-- PASSWORD -->
              <div>
                <label class="block text-xs font-medium text-slate-600 mb-1">
                  Lozinka
                </label>

                <div class="relative">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    placeholder="Unesi lozinku"
                    class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 pr-12 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                  <button
                    type="button"
                    class="absolute inset-y-0 right-2 my-auto px-2 py-1 text-xs text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                    @click="showPassword = !showPassword"
                  >
                    {{ showPassword ? "Sakrij" : "Prikaži" }}
                  </button>
                </div>

                <p v-if="errors.password" class="mt-1 text-xs text-red-600">
                  {{ errors.password }}
                </p>
              </div>

              <!-- REMEMBER + FORGOT -->
              <div class="flex items-center justify-between gap-4">
                <label
                  class="inline-flex items-center gap-2 text-sm text-slate-600 select-none"
                >
                  <input
                    v-model="form.remember"
                    type="checkbox"
                    class="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Zapamti me
                </label>

                <RouterLink
                  to="/forgot-password"
                  class="text-sm text-sky-600 hover:underline"
                >
                  Zaboravio sam lozinku
                </RouterLink>
              </div>

              <!-- GENERAL ERROR -->
              <div
                v-if="errors.general"
                class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {{ errors.general }}
              </div>

              <!-- SUBMIT -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-sky-500 to-indigo-600 shadow-[0_8px_20px_rgba(37,99,235,0.30)] hover:shadow-[0_10px_26px_rgba(37,99,235,0.40)] hover:-translate-y-0.5 transition disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <span v-if="!loading">Prijavi se</span>
                <span v-else>Prijavljivanje...</span>
              </button>

              <p class="text-xs text-slate-500 text-center">
                Nemaš nalog?
                <RouterLink to="/register" class="text-sky-600 hover:underline">
                  Registruj se
                </RouterLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup>
import { reactive, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import PublicLayout from "@/layouts/PublicLayout.vue";
import * as auth from "@/services/auth.service";

const router = useRouter();
const loading = ref(false);
const showPassword = ref(false);

const form = reactive({
  username: "",
  password: "",
  remember: true,
});

const errors = reactive({
  username: "",
  password: "",
  general: "",
});

function validate() {
  errors.username = "";
  errors.password = "";
  errors.general = "";

  if (!form.username) errors.username = "Korisničko ime je obavezno.";
  if (!form.password) errors.password = "Lozinka je obavezna.";

  return !(errors.username || errors.password);
}

async function onSubmit() {
  if (!validate()) return;

  loading.value = true;
  try {
    const res = await auth.login({
      username: form.username,
      password: form.password,
    });

    if (!res?.access || !res?.refresh) {
      errors.general = "Login je uspio, ali tokeni nisu vraćeni.";
      return;
    }

    // čuvanje JWT
    localStorage.setItem("access_token", res.access);
    localStorage.setItem("refresh_token", res.refresh);

    // redirect (promijeni po potrebi)
    router.push("/");
  } catch (e) {
    errors.general = e?.response?.data?.detail || "Neuspješna prijava.";
  } finally {
    loading.value = false;
  }
}
</script>
