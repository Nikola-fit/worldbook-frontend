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
        <!-- HEADER -->
        <div class="text-center mb-10">
          <p
            class="text-xs uppercase tracking-[0.16em] font-semibold text-sky-600 mb-3"
          >
            Kreiraj nalog • Pridruži se pisanju
          </p>

          <h1
            class="text-3xl md:text-[2.2rem] leading-tight font-semibold text-slate-900 mb-4"
          >
            Registruj se za <span class="text-sky-500">WorldBook</span>
          </h1>

          <p class="text-[0.98rem] text-slate-600 max-w-2xl mx-auto">
            Napravi nalog i učestvuj u pisanju knjige. Jedan korisnik može
            poslati jedan pasus po rundi.
          </p>

          <div class="mt-5 flex justify-center gap-3 flex-wrap">
            <RouterLink
              to="/login"
              class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium border border-sky-500 text-sky-600 bg-white hover:bg-sky-50 transition"
            >
              Već imam nalog
            </RouterLink>

            <RouterLink
              to="/"
              class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-slate-600 bg-white/60 border border-slate-200 hover:bg-white transition"
            >
              Nazad na početnu
            </RouterLink>
          </div>
        </div>

        <!-- CONTENT (Flexbox) -->
        <div class="flex flex-col items-center">
          <div
            class="w-full max-w-md bg-white rounded-2xl p-6 md:p-7 border border-[rgba(15,118,196,0.08)] shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
          >
            <div class="mb-6 text-center">
              <h2 class="text-lg font-semibold text-slate-900">Registracija</h2>
              <p class="text-sm text-slate-500 mt-1">
                Unesi podatke da kreiraš nalog.
              </p>
            </div>

            <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
              <!-- Username -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-slate-600"
                  >Korisničko ime</label
                >
                <input
                  v-model.trim="form.username"
                  type="text"
                  autocomplete="username"
                  placeholder="npr. nikola_l"
                  class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <p v-if="errors.username" class="text-xs text-red-600">
                  {{ errors.username }}
                </p>
              </div>

              <!-- Email -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-slate-600">Email</label>
                <input
                  v-model.trim="form.email"
                  type="email"
                  autocomplete="email"
                  placeholder="npr. nikola@email.com"
                  class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <p v-if="errors.email" class="text-xs text-red-600">
                  {{ errors.email }}
                </p>
              </div>

              <!-- Password -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-slate-600"
                  >Lozinka</label
                >

                <div class="relative">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="new-password"
                    placeholder="Minimum 6 karaktera"
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

                <p v-if="errors.password" class="text-xs text-red-600">
                  {{ errors.password }}
                </p>
              </div>

              <!-- Confirm password -->
              <div class="flex flex-col gap-1">
                <label class="text-xs font-medium text-slate-600"
                  >Potvrdi lozinku</label
                >
                <input
                  v-model="form.confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Ponovi lozinku"
                  class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
                <p v-if="errors.confirmPassword" class="text-xs text-red-600">
                  {{ errors.confirmPassword }}
                </p>
              </div>

              <!-- Terms -->
              <div class="flex items-start justify-between gap-4">
                <label
                  class="flex items-start gap-2 text-sm text-slate-600 select-none"
                >
                  <input
                    v-model="form.acceptTerms"
                    type="checkbox"
                    class="mt-1 h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  <span>
                    Prihvatam pravila i uslove korišćenja.
                    <span class="text-slate-400"
                      >(opciono možeš kasnije dodati link)</span
                    >
                  </span>
                </label>
              </div>
              <p v-if="errors.acceptTerms" class="text-xs text-red-600 -mt-2">
                {{ errors.acceptTerms }}
              </p>

              <!-- General error -->
              <div
                v-if="errors.general"
                class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {{ errors.general }}
              </div>

              <!-- Submit -->
              <button
                type="submit"
                :disabled="loading"
                class="w-full inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-sky-500 to-indigo-600 shadow-[0_8px_20px_rgba(37,99,235,0.30)] hover:shadow-[0_10px_26px_rgba(37,99,235,0.40)] hover:-translate-y-0.5 transition disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <span v-if="!loading">Kreiraj nalog</span>
                <span v-else>Kreiranje naloga...</span>
              </button>

              <p class="text-xs text-slate-500 text-center">
                Već imaš nalog?
                <RouterLink to="/login" class="text-sky-600 hover:underline">
                  Prijavi se
                </RouterLink>
              </p>
            </form>
          </div>

          <!-- small hint under card -->
          <p class="mt-5 text-xs text-slate-500 text-center max-w-md">
            Nakon registracije (po potrebi) možeš dobiti email verifikaciju
            prije prvog slanja pasusa.
          </p>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup>
import { reactive, ref } from "vue";
import { RouterLink } from "vue-router";
import PublicLayout from "@/layouts/PublicLayout.vue";
import { useRouter } from "vue-router";
import * as auth from "@/services/auth.service";

const router = useRouter();

const loading = ref(false);
const showPassword = ref(false);

const form = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
});

const errors = reactive({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: "",
  general: "",
});

function validate() {
  errors.username = "";
  errors.email = "";
  errors.password = "";
  errors.confirmPassword = "";
  errors.acceptTerms = "";
  errors.general = "";

  if (!form.username) errors.username = "Korisničko ime je obavezno.";
  else if (form.username.length < 3)
    errors.username = "Korisničko ime mora imati bar 3 karaktera.";
  else if (!/^[a-zA-Z0-9_]+$/.test(form.username))
    errors.username = "Dozvoljena su slova, brojevi i _.";

  if (!form.email) errors.email = "Email je obavezan.";
  else if (!/^\S+@\S+\.\S+$/.test(form.email))
    errors.email = "Unesi validan email.";

  if (!form.password) errors.password = "Lozinka je obavezna.";
  else if (form.password.length < 6)
    errors.password = "Lozinka mora imati bar 6 karaktera.";

  if (!form.confirmPassword) errors.confirmPassword = "Potvrdi lozinku.";
  else if (form.confirmPassword !== form.password)
    errors.confirmPassword = "Lozinke se ne poklapaju.";

  if (!form.acceptTerms) errors.acceptTerms = "Moraš prihvatiti uslove.";

  return !(
    errors.username ||
    errors.email ||
    errors.password ||
    errors.confirmPassword ||
    errors.acceptTerms
  );
}

async function onSubmit() {
  errors.general = "";
  errors.username = "";
  errors.email = "";
  errors.password = "";
  errors.confirmPassword = "";
  errors.acceptTerms = "";

  if (
    !form.username ||
    !form.email ||
    !form.password ||
    !form.confirmPassword
  ) {
    errors.general = "Popuni sva obavezna polja.";
    return;
  }
  if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Lozinke se ne poklapaju.";
    return;
  }
  if (!form.acceptTerms) {
    errors.acceptTerms = "Moraš prihvatiti uslove.";
    return;
  }

  loading.value = true;
  try {
    await auth.register({
      username: form.username,
      email: form.email,
      password: form.password,
      password_confirm: form.confirmPassword,
    });

    // nakon uspješne registracije → login
    router.push("/login");
  } catch (e) {
    const data = e?.response?.data;

    if (data && typeof data === "object") {
      if (data.username)
        errors.username = Array.isArray(data.username)
          ? data.username[0]
          : String(data.username);
      if (data.email)
        errors.email = Array.isArray(data.email)
          ? data.email[0]
          : String(data.email);
      if (data.password)
        errors.password = Array.isArray(data.password)
          ? data.password[0]
          : String(data.password);
      if (data.password_confirm)
        errors.confirmPassword = Array.isArray(data.password_confirm)
          ? data.password_confirm[0]
          : String(data.password_confirm);

      if (
        !errors.username &&
        !errors.email &&
        !errors.password &&
        !errors.confirmPassword
      ) {
        errors.general =
          data.detail || data.message || "Registracija nije uspjela.";
      }
    } else {
      errors.general = "Registracija nije uspjela. Pokušaj ponovo.";
    }
  } finally {
    loading.value = false;
  }
}
</script>
