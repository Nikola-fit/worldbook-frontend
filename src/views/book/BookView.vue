<template>
  <PublicLayout>
    <section class="py-10 md:py-14 bg-slate-50">
      <div class="mx-auto max-w-6xl px-4">
        <!-- Header -->
        <div
          class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-6"
        >
          <div>
            <p
              class="text-xs uppercase tracking-[0.16em] font-semibold text-sky-600"
            >
              WorldBook • Čitanje
            </p>
            <h1 class="mt-2 text-2xl md:text-3xl font-semibold text-slate-900">
              {{ bookTitle }}
            </h1>
            <p class="mt-1 text-sm text-slate-500">
              Izaberi poglavlje lijevo. Tekst je prikazan u "reader" formatu
              radi čitljivosti.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <!-- Refresh dugme -->
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium border border-slate-300 text-slate-600 bg-white hover:bg-slate-50 transition disabled:opacity-50"
              :disabled="loading"
              :title="loading ? 'Osvježavanje...' : 'Osveži sadržaj knjige'"
              @click="handleRefresh"
            >
              <svg
                class="w-4 h-4 transition-transform"
                :class="{ 'animate-spin': loading }"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span class="ml-1.5 hidden sm:inline">Osveži</span>
            </button>

            <!-- Status / Dodaj dugme -->
            <template v-if="selectedChapter">
              <!-- Još učitavamo status -->
              <div
                v-if="chapterStatusLoading"
                class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400"
              >
                <span>Provjera...</span>
              </div>

              <!-- Već poslato — pending -->
              <div
                v-else-if="currentChapterStatus === 'pending'"
                class="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700"
              >
                <span
                  class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"
                ></span>
                <span class="font-medium">Poslato</span>
                <span class="text-amber-500">• čeka odobrenje</span>
              </div>

              <!-- Approved -->
              <div
                v-else-if="currentChapterStatus === 'approved'"
                class="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span class="font-medium">Odobreno</span>
              </div>

              <!-- Rejected -->
              <div
                v-else-if="currentChapterStatus === 'rejected'"
                class="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                <span class="font-medium">Odbijeno</span>
              </div>

              <!-- Nije poslato — prikaži dugme -->
              <button
                v-else
                type="button"
                class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-sky-500 to-indigo-600 shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_10px_26px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition"
                @click="openModal = true"
              >
                Dodaj pasus
              </button>
            </template>
          </div>
        </div>

        <!-- Content grid -->
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Mobile chapter picker -->
          <div class="lg:hidden">
            <label class="block text-xs font-medium text-slate-600 mb-1"
              >Izaberi poglavlje</label
            >
            <select
              v-model="selectedChapterId"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            >
              <option
                v-for="ch in filteredChapters"
                :key="ch.id"
                :value="ch.id"
              >
                {{ ch.chapter_number }}. {{ ch.title }}
              </option>
            </select>
          </div>

          <!-- Sidebar (desktop) -->
          <aside class="hidden lg:block w-[320px] shrink-0">
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div class="px-5 py-4 border-b border-slate-200">
                <h2 class="text-sm font-semibold text-slate-700">Poglavlja</h2>
                <div class="mt-3">
                  <input
                    v-model.trim="query"
                    type="text"
                    placeholder="Pretraga poglavlja..."
                    class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <p class="text-xs text-slate-500 mt-2">
                  Ukupno: {{ chapters.length }}
                </p>
              </div>

              <div class="p-2 max-h-[520px] overflow-y-auto">
                <button
                  v-for="ch in filteredChapters"
                  :key="ch.id"
                  type="button"
                  class="w-full text-left rounded-xl px-4 py-3 transition border hover:bg-slate-50"
                  :class="
                    ch.id === selectedChapterId
                      ? 'bg-sky-50 border-sky-200'
                      : 'bg-white border-transparent'
                  "
                  @click="selectChapter(ch.id)"
                >
                  <p class="text-sm font-medium text-slate-800">
                    {{ ch.chapter_number }}. {{ ch.title }}
                  </p>
                  <p class="mt-1 text-xs text-slate-500 line-clamp-2">
                    {{ preview(ch.content) }}
                  </p>
                </button>

                <p
                  v-if="!filteredChapters.length"
                  class="px-4 py-3 text-sm text-slate-500"
                >
                  Nema rezultata za pretragu.
                </p>
              </div>
            </div>
          </aside>

          <!-- Reader -->
          <div class="flex-1 min-w-0">
            <div class="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div class="px-5 md:px-6 py-4 border-b border-slate-200">
                <div v-if="loading" class="text-sm text-slate-500">
                  Učitavanje…
                </div>
                <div
                  v-else-if="error"
                  class="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                >
                  {{ error }}
                </div>
                <template v-else>
                  <h2 class="text-base font-semibold text-slate-800">
                    {{
                      selectedChapter
                        ? `${selectedChapter.chapter_number}. ${selectedChapter.title}`
                        : "Izaberi poglavlje"
                    }}
                  </h2>
                  <p class="text-xs text-slate-500 mt-1">
                    Reader mod — fokus na čitanje.
                  </p>
                </template>
              </div>

              <div class="p-5 md:p-6">
                <div
                  v-if="!loading && !error && !selectedChapter"
                  class="text-sm text-slate-500"
                >
                  Izaberi poglavlje da vidiš sadržaj.
                </div>
                <div
                  v-else-if="selectedChapter"
                  class="mx-auto max-w-[70ch] font-serif text-[16px] leading-relaxed text-slate-800 whitespace-pre-line"
                >
                  {{
                    selectedChapter.content || "Ovo poglavlje još nema sadržaj."
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ─── Modal ────────────────────────────────────────────────────────── -->
      <Teleport to="body">
        <div
          v-if="openModal"
          class="fixed inset-0 z-50 flex items-center justify-center px-4"
          @keydown.esc="closeModal"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-slate-900/40"
            @click="closeModal"
          ></div>

          <div
            class="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl"
          >
            <div
              class="px-5 md:px-6 py-4 border-b border-slate-200 flex items-start justify-between gap-4"
            >
              <div>
                <h3 class="text-sm font-semibold text-slate-800">
                  Dodaj pasus
                </h3>
                <p class="text-xs text-slate-500 mt-1">
                  Max {{ maxWords }} riječi • Poglavlje
                  {{ selectedChapter?.chapter_number ?? "-" }}
                </p>
              </div>
              <button
                type="button"
                class="text-slate-400 hover:text-slate-600 transition"
                @click="closeModal"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="p-5 md:p-6">
              <label class="block text-xs font-medium text-slate-600 mb-1"
                >Pasus</label
              >
              <textarea
                v-model="paragraph"
                class="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 min-h-[140px] resize-none"
                placeholder="Napiši svoj pasus..."
                :disabled="submitting"
              />

              <div class="mt-2 flex items-center justify-between text-xs">
                <span
                  :class="
                    wordCount > maxWords
                      ? 'text-red-600 font-medium'
                      : 'text-slate-500'
                  "
                >
                  {{ wordCount }} / {{ maxWords }} riječi
                </span>
                <!-- Progress bar -->
                <div class="w-24 h-1 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all"
                    :class="wordCount > maxWords ? 'bg-red-400' : 'bg-sky-400'"
                    :style="{
                      width: Math.min((wordCount / maxWords) * 100, 100) + '%',
                    }"
                  ></div>
                </div>
              </div>

              <!-- Greška: previše riječi -->
              <div
                v-if="wordCount > maxWords"
                class="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                Prekoračio si limit. Skrati pasus na {{ maxWords }} riječi.
              </div>

              <!-- Greška: submit -->
              <div
                v-if="submitError"
                class="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {{ submitError }}
              </div>

              <div class="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition"
                  @click="closeModal"
                >
                  Otkaži
                </button>

                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-sky-500 to-indigo-600 shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_10px_26px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition disabled:opacity-60 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                  :disabled="
                    submitting || wordCount === 0 || wordCount > maxWords
                  "
                  @click="submitCurrentParagraph"
                >
                  <svg
                    v-if="submitting"
                    class="w-4 h-4 mr-1.5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    />
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span>{{ submitting ? "Slanje..." : "Pošalji pasus" }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </section>
  </PublicLayout>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import PublicLayout from "@/layouts/PublicLayout.vue";
import { http } from "@/lib/http";
import * as bookService from "@/services/book.service";
import { useSubmissionStatus } from "@/composables/useSubmissionStatus";

// ─── Book state ──────────────────────────────────────────────────────────────

const loading = ref(false);
const error = ref("");

const book = ref(null);
const bookTitle = ref("Knjiga");
const chapters = ref([]);

const query = ref("");

const filteredChapters = computed(() => {
  const q = query.value.toLowerCase();
  if (!q) return chapters.value;
  return chapters.value.filter((c) => {
    return (
      (c.title || "").toLowerCase().includes(q) ||
      String(c.chapter_number || "").includes(q) ||
      (c.content || "").toLowerCase().includes(q)
    );
  });
});

function preview(content) {
  const t = (content || "").trim();
  if (!t) return "Nema teksta još.";
  return t.length > 90 ? t.slice(0, 90) + "…" : t;
}

// ─── Chapter selection ───────────────────────────────────────────────────────

const selectedChapterId = ref(null);
const selectedChapter = computed(
  () => chapters.value.find((c) => c.id === selectedChapterId.value) ?? null,
);

function selectChapter(id) {
  selectedChapterId.value = id;
}

// ─── Submission status (composable) ─────────────────────────────────────────

const { loadingStatus, fetchStatus, markSubmitted, refreshStatus, getStatus } =
  useSubmissionStatus();

// Kada se promijeni odabrano poglavlje — dohvati status sa backenda
watch(selectedChapterId, async (chapterId) => {
  if (chapterId) {
    await fetchStatus(chapterId);
  }
});

// Computed shortcuts za template
const chapterStatusLoading = computed(
  () => loadingStatus.value && getStatus(selectedChapterId.value) === null,
);
const currentChapterStatus = computed(() =>
  selectedChapterId.value ? getStatus(selectedChapterId.value) : null,
);

// ─── Load & refresh knjige ───────────────────────────────────────────────────

async function loadBook() {
  loading.value = true;
  error.value = "";
  try {
    const { data } = await http.get("/book/books/1/read/");
    book.value = data;
    bookTitle.value = data?.title || "WorldBook";
    chapters.value = data?.chapters || [];

    if (chapters.value.length && !selectedChapterId.value) {
      selectedChapterId.value = chapters.value[0].id;
    }
  } catch {
    error.value = "Ne mogu da učitam knjigu. Provjeri backend.";
  } finally {
    loading.value = false;
  }
}

async function handleRefresh() {
  await loadBook();
  if (selectedChapterId.value) {
    await refreshStatus(selectedChapterId.value);
  }
}

// ─── Modal & submit ──────────────────────────────────────────────────────────

const openModal = ref(false);
const paragraph = ref("");
const submitting = ref(false);
const submitError = ref("");
const maxWords = 15;

const wordCount = computed(() => {
  const t = paragraph.value.trim();
  return t ? t.split(/\s+/).filter(Boolean).length : 0;
});

function closeModal() {
  openModal.value = false;
  submitError.value = "";
  // Ne brišemo paragraph — možda korisnik slučajno zatvori
}

// Resetuj grešku kad korisnik kuca
watch(paragraph, () => {
  if (submitError.value) submitError.value = "";
});

async function submitCurrentParagraph() {
  submitError.value = "";

  if (!selectedChapter.value) {
    submitError.value = "Nije izabrano poglavlje.";
    return;
  }

  const text = paragraph.value.trim();
  if (!text) {
    submitError.value = "Pasus ne može biti prazan.";
    return;
  }

  submitting.value = true;
  try {
    await bookService.submitParagraph(selectedChapter.value.id, text);

    // Optimistički update stanja
    markSubmitted(selectedChapter.value.id);
    paragraph.value = "";
    openModal.value = false;
  } catch (e) {
    const data = e?.response?.data;
    submitError.value =
      data?.detail ||
      (Array.isArray(data?.paragraph) ? data.paragraph[0] : "") ||
      "Neuspješno slanje pasusa.";
  } finally {
    submitting.value = false;
  }
}

// ─── Init ────────────────────────────────────────────────────────────────────

onMounted(loadBook);
</script>
