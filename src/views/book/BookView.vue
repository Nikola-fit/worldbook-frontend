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
              Izaberi poglavlje lijevo. Tekst je prikazan u “reader” formatu
              radi čitljivosti.
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="!hasSubmittedForSelectedChapter"
              type="button"
              class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-sky-500 to-indigo-600 shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_10px_26px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition disabled:opacity-60 disabled:hover:translate-y-0"
              :disabled="!selectedChapter"
              @click="openModal = true"
            >
              Dodaj pasus
            </button>

            <div
              v-else
              class="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700"
            >
              <span class="font-medium">Poslato</span>
              <span class="text-amber-600">• čeka odobrenje</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-6">
          <!-- Mobile chapter picker -->
          <div class="lg:hidden">
            <label class="block text-xs font-medium text-slate-600 mb-1">
              Izaberi poglavlje
            </label>
            <select
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              v-model="selectedChapterId"
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
          <aside class="hidden lg:block w-[320px]">
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
          <div class="flex-1">
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

      <!-- Modal (ostaje, za kasnije submit) -->
      <Teleport to="body">
        <div
          v-if="openModal"
          class="fixed inset-0 z-50 flex items-center justify-center px-4"
        >
          <div
            class="absolute inset-0 bg-slate-900/40"
            @click="openModal = false"
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
                <p class="text-xs text-slate-500 mt-1">Max 15 riječi.</p>
              </div>
              <button
                type="button"
                class="text-sm text-slate-500 hover:text-slate-700"
                @click="openModal = false"
              >
                ✕
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
              />

              <div class="mt-2 flex items-center justify-between text-xs">
                <span
                  :class="
                    wordCount > maxWords ? 'text-red-600' : 'text-slate-500'
                  "
                >
                  {{ wordCount }} / {{ maxWords }} riječi
                </span>
                <span class="text-slate-400">
                  Poglavlje: {{ selectedChapter?.chapter_number ?? "-" }}
                </span>
              </div>

              <div
                v-if="wordCount > maxWords"
                class="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                Prekoračio si limit. Skrati pasus na {{ maxWords }} riječi.
              </div>
              <div class="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 transition"
                  @click="openModal = false"
                >
                  Otkaži
                </button>

                <button
                  v-if="!hasSubmittedForSelectedChapter"
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-white bg-gradient-to-br from-sky-500 to-indigo-600 shadow-[0_8px_20px_rgba(37,99,235,0.25)] hover:shadow-[0_10px_26px_rgba(37,99,235,0.35)] hover:-translate-y-0.5 transition disabled:opacity-60 disabled:hover:translate-y-0"
                  :disabled="
                    submitting || wordCount === 0 || wordCount > maxWords
                  "
                  @click="submitCurrentParagraph"
                >
                  <span v-if="!submitting">Pošalji pasus</span>
                  <span v-else>Slanje...</span>
                </button>

                <div
                  v-else
                  class="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700"
                >
                  <span class="font-medium">Poslato</span>
                  <span class="text-amber-600">• čeka odobrenje</span>
                </div>
              </div>

              <div
                v-if="submitError"
                class="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {{ submitError }}
              </div>

              <div
                v-if="submitSuccess"
                class="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
              >
                {{ submitSuccess }}
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    </section>
  </PublicLayout>
</template>

<script setup>
import * as bookService from "@/services/book.service";
import { computed, onMounted, ref } from "vue";
import PublicLayout from "@/layouts/PublicLayout.vue";
import { http } from "@/lib/http";

const loading = ref(false);
const error = ref("");

const bookTitle = ref("Knjiga");
const chapters = ref([]);
const book = ref(null);

const selectedChapterId = ref(null);
const selectedChapter = computed(
  () => chapters.value.find((c) => c.id === selectedChapterId.value) || null,
);
const hasSubmittedForSelectedChapter = computed(() => {
  if (!book.value || !selectedChapter.value) return false;

  return getSubmittedChapters(book.value.id).includes(selectedChapter.value.id);
});

const submitting = ref(false);
const submitError = ref("");
const submitSuccess = ref("");

const query = ref("");

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

function getUserIdFromAccessToken() {
  const token = localStorage.getItem("access_token");
  const payload = token ? parseJwt(token) : null;
  // simplejwt najčešće ima "user_id"
  return payload?.user_id ?? null;
}

function getSubmittedKey(bookId) {
  const userId = getUserIdFromAccessToken() ?? "anon";
  return `wb_submitted_chapters_u${userId}_b${bookId}`;
}

function getSubmittedChapters(bookId) {
  const key = getSubmittedKey(bookId);
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function markChapterSubmitted(bookId, chapterId) {
  const key = getSubmittedKey(bookId);
  const current = new Set(getSubmittedChapters(bookId));
  current.add(chapterId);
  localStorage.setItem(key, JSON.stringify([...current]));
}

const filteredChapters = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return chapters.value;

  return chapters.value.filter((c) => {
    const title = (c.title || "").toLowerCase();
    const number = String(c.chapter_number || "");
    const text = (c.content || "").toLowerCase();
    return title.includes(q) || number.includes(q) || text.includes(q);
  });
});

function selectChapter(id) {
  selectedChapterId.value = id;
}

function preview(content) {
  const t = (content || "").trim();
  return t ? (t.length > 90 ? t.slice(0, 90) + "…" : t) : "Nema teksta još.";
}

// modal (kasnije submit)
const openModal = ref(false);
const paragraph = ref("");
const maxWords = 15;

const wordCount = computed(() => {
  const t = paragraph.value.trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
});

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

async function submitCurrentParagraph() {
  submitError.value = "";
  submitSuccess.value = "";

  if (!selectedChapter.value) {
    submitError.value = "Nije izabrano poglavlje.";
    return;
  }

  const text = paragraph.value.trim();
  if (!text) {
    submitError.value = "Pasus ne može biti prazan.";
    return;
  }

  // (opciono) limit riječi 15 - može ostati i na backendu kasnije
  // if (wordCount.value > maxWords) { ... }

  submitting.value = true;
  try {
    await bookService.submitParagraph(selectedChapter.value.id, text);

    submitSuccess.value = "Pasus je poslat i čeka odobrenje.";
    paragraph.value = "";
    markChapterSubmitted(book.value.id, selectedChapter.value.id);
    // zatvori modal nakon kratkog feedback-a (ili odmah)
    openModal.value = false;
  } catch (e) {
    // DRF ValidationError često bude { detail: "..."} ili { paragraph: ["..."] }
    submitError.value =
      e?.response?.data?.detail ||
      (Array.isArray(e?.response?.data?.paragraph)
        ? e.response.data.paragraph[0]
        : "") ||
      "Neuspješno slanje pasusa.";
  } finally {
    submitting.value = false;
  }
}

onMounted(loadBook);
</script>
