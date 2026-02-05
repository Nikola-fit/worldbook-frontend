<template>
  <PublicLayout>
    <!-- HERO SECTION -->
    <section
      class="py-14 md:py-16"
      style="
        background: radial-gradient(
          circle at top left,
          #eff6ff 0,
          #f5f7fb 45%,
          #ffffff 100%
        );
      "
    >
      <div
        class="mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-10 items-center"
      >
        <!-- HERO TEXT -->
        <div>
          <p
            class="text-xs uppercase tracking-[0.16em] font-semibold text-sky-600 mb-3"
          >
            Kolektivno pisanje • Jedna knjiga, bezbroj glasova
          </p>

          <h1
            class="text-3xl md:text-[2.4rem] leading-tight font-semibold text-slate-900 mb-4"
          >
            Dobrodošao u <span class="text-sky-500">WorldBook</span><br />
            mjesto gdje svako piše dio priče.
          </h1>

          <p class="text-[0.98rem] text-slate-600 max-w-xl mb-6">
            WorldBook je živi online roman koji piše cijeli svijet. Svaki
            korisnik dodaje svoj pasus, a zajednica gradi priču, poglavlje po
            poglavlje.
          </p>

          <div class="flex flex-wrap gap-3 mb-4">
            <RouterLink
              to="/register"
              class="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-sky-500 to-indigo-600 shadow-[0_8px_20px_rgba(37,99,235,0.30)] hover:shadow-[0_10px_26px_rgba(37,99,235,0.40)] hover:-translate-y-0.5 transition"
            >
              Započni pisanje
            </RouterLink>

            <RouterLink
              to="/login"
              class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium border border-sky-500 text-sky-600 bg-white hover:bg-sky-50 transition"
            >
              Već imam nalog
            </RouterLink>
          </div>

          <p class="text-sm text-slate-500">
            Nema instalacije, nema komplikacije – samo se registruješ i nastaviš
            priču tamo gdje je neko stao.
          </p>
        </div>

        <!-- HERO PANEL -->
        <div class="flex md:justify-end">
          <div
            class="w-full max-w-md bg-white rounded-2xl p-6 border border-[rgba(15,118,196,0.08)] shadow-[0_18px_45px_rgba(15,23,42,0.12)]"
          >
            <h2 class="text-base font-semibold text-slate-900 mb-3">
              Kako izgleda poglavlje?
            </h2>

            <p class="text-sm leading-relaxed text-slate-700 mb-4">
              “Vjetar je mirisao na kišu dok je grad tonuo u tišinu. Niko nije
              znao da će baš te noći sve krenuti u potpuno neočekivanom
              smjeru...”
            </p>

            <div
              class="flex items-center justify-between text-xs text-slate-500 mb-2"
            >
              <span class="font-semibold text-sky-600">+ 1 284 doprinosa</span>
              <span>✔ moderisano</span>
            </div>

            <p class="text-xs text-slate-400">
              Svaki odobreni pasus postaje dio kanonske verzije priče.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section id="how-it-works" class="py-16 bg-white">
      <div class="mx-auto max-w-6xl px-4">
        <div class="mx-auto max-w-3xl text-center">
          <h2 class="text-2xl font-semibold text-slate-900">
            Kako funkcioniše?
          </h2>
          <p class="mt-2 text-[0.95rem] text-slate-500">
            Jednostavan proces koji te vodi pravo do pisanja. Bez komplikacija.
          </p>
        </div>

        <div class="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- card -->
          <div
            class="bg-sky-50/60 rounded-2xl p-7 border border-sky-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition"
          >
            <div
              class="w-10 h-10 rounded-full bg-sky-100 text-sky-600 font-bold flex items-center justify-center mb-3"
            >
              1
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-1">
              Napravi nalog
            </h3>
            <p class="text-[0.95rem] text-slate-600 leading-relaxed">
              Registracija traje manje od minuta. Potreban ti je samo email.
            </p>
          </div>

          <div
            class="bg-sky-50/60 rounded-2xl p-7 border border-sky-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition"
          >
            <div
              class="w-10 h-10 rounded-full bg-sky-100 text-sky-600 font-bold flex items-center justify-center mb-3"
            >
              2
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-1">
              Izaberi poglavlje
            </h3>
            <p class="text-[0.95rem] text-slate-600 leading-relaxed">
              Pregledaš knjigu, odabereš poglavlje i vidiš gdje priča trenutno
              stoji.
            </p>
          </div>

          <div
            class="bg-sky-50/60 rounded-2xl p-7 border border-sky-200/60 shadow-sm hover:shadow-md hover:-translate-y-1 transition"
          >
            <div
              class="w-10 h-10 rounded-full bg-sky-100 text-sky-600 font-bold flex items-center justify-center mb-3"
            >
              3
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-1">
              Napiši svoj pasus
            </h3>
            <p class="text-[0.95rem] text-slate-600 leading-relaxed">
              Dodaješ svoju rečenicu ili pasus. Nakon odobrenja, postaje dio
              zvanične verzije priče.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section id="features" class="py-14 md:py-16">
      <div class="mx-auto max-w-6xl px-4">
        <div class="mx-auto max-w-3xl text-center">
          <h2 class="text-2xl font-semibold text-slate-900">
            Zašto je prijatno za čitanje?
          </h2>
          <p class="mt-2 text-[0.95rem] text-slate-500">
            Dizajn WorldBook-a je fokusiran na čitljivost – bez distrakcija, uz
            pažljivo birane boje.
          </p>
        </div>

        <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
          >
            <h3 class="text-base font-semibold text-slate-900 mb-2">
              Plavo–bijeli kontrast
            </h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Umirujuća plava na čistoj bijeloj pozadini daje jasan kontrast bez
              naprezanja očiju.
            </p>
          </div>

          <div
            class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
          >
            <h3 class="text-base font-semibold text-slate-900 mb-2">
              Ugodna širina teksta
            </h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Redovi teksta su ograničeni po širini da bi čitanje bilo prirodno
              – bez “vodoravnog umora”.
            </p>
          </div>

          <div
            class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm"
          >
            <h3 class="text-base font-semibold text-slate-900 mb-2">
              Minimalne distrakcije
            </h3>
            <p class="text-sm text-slate-600 leading-relaxed">
              Nema agresivnih boja, animacija i popup-ova. Fokus je na priči i
              tvom doprinosu.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- COMMUNITY / CTA -->
    <section
      id="community"
      class="py-14 md:py-16 bg-slate-50 border-t border-sky-100"
    >
      <div
        class="mx-auto max-w-6xl px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
      >
        <div class="max-w-2xl">
          <h2 class="text-2xl font-semibold text-slate-900">
            Pridruži se autorima iz cijelog svijeta
          </h2>
          <p class="mt-2 text-[0.95rem] text-slate-500">
            Bilo da pišeš prvi put ili godinama, tvoj glas može postati dio
            jedne velike, zajedničke priče.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <RouterLink
            to="/register"
            class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-br from-sky-500 to-indigo-600 shadow-[0_8px_20px_rgba(37,99,235,0.30)] hover:shadow-[0_10px_26px_rgba(37,99,235,0.40)] hover:-translate-y-0.5 transition"
          >
            Kreiraj nalog
          </RouterLink>

          <RouterLink
            to="/login"
            class="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium border border-sky-500 text-sky-600 bg-white hover:bg-sky-50 transition"
          >
            Nastavi pisanje
          </RouterLink>
        </div>
      </div>
    </section>
  </PublicLayout>
</template>

<script setup>
import { RouterLink } from "vue-router";
import PublicLayout from "@/layouts/PublicLayout.vue";
</script>
