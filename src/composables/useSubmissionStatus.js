// composables/useSubmissionStatus.js
// Upravljanje statusom submission-a po poglavlju.
// Backend je izvor istine; localStorage je samo brzi cache za UX.

import { ref } from "vue";
import { http } from "@/lib/http";

/**
 * Mogući statusi za jedno poglavlje:
 *   null       — nismo još pitali backend
 *   "none"     — korisnik nije submittovao
 *   "pending"  — submittovano, čeka odobrenje
 *   "approved" — odobreno
 *   "rejected" — odbijeno
 */

// ─── localStorage helpers ────────────────────────────────────────────────────

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      ),
    );
  } catch {
    return null;
  }
}

function getUserId() {
  const token = localStorage.getItem("access_token");
  const payload = token ? parseJwt(token) : null;
  return payload?.user_id ?? "anon";
}

function cacheKey(bookId, chapterId) {
  return `wb_sub_u${getUserId()}_b${bookId}_c${chapterId}`;
}

function readCache(bookId, chapterId) {
  try {
    return localStorage.getItem(cacheKey(bookId, chapterId)) || null;
  } catch {
    return null;
  }
}

function writeCache(bookId, chapterId, status) {
  try {
    localStorage.setItem(cacheKey(bookId, chapterId), status);
  } catch {
    /* storage pun — ignoriši */
  }
}

// ─── Composable ──────────────────────────────────────────────────────────────

export function useSubmissionStatus() {
  // Map: chapterId → status string | null
  const statusMap = ref({});
  const loadingStatus = ref(false);

  /**
   * Dohvati status sa backenda za dato poglavlje.
   * Endpoint: GET /book/chapters/:id/my-status/
   * Vraća: { status: "none" | "pending" | "approved" | "rejected" }
   */
  async function fetchStatus(bookId, chapterId) {
    // Ako već imamo u mapi, ne idemo na backend ponovo (osim forced refresh)
    if (statusMap.value[chapterId] !== undefined) return;

    // Probaj cache prvo za instant UX
    const cached = readCache(bookId, chapterId);
    if (cached) {
      statusMap.value[chapterId] = cached;
    }

    loadingStatus.value = true;
    try {
      const { data } = await http.get(`/book/chapters/${chapterId}/my-status/`);
      const s = data?.status ?? "none";
      statusMap.value[chapterId] = s;
      writeCache(bookId, chapterId, s);
    } catch {
      // Ako endpoint ne postoji ili greška — fallback na cache ili "none"
      if (!statusMap.value[chapterId]) {
        statusMap.value[chapterId] = "none";
      }
    } finally {
      loadingStatus.value = false;
    }
  }

  /**
   * Označi lokalno da je korisnik upravo submittovao (optimistički update).
   * Backend će potvrditi pri sljedećem fetchStatus pozivu.
   */
  function markSubmitted(bookId, chapterId) {
    statusMap.value[chapterId] = "pending";
    writeCache(bookId, chapterId, "pending");
  }

  /**
   * Prisilni refresh sa backenda (npr. nakon "Osveži" dugmeta).
   */
  async function refreshStatus(bookId, chapterId) {
    // Obrišemo iz mape da fetchStatus ide na backend
    delete statusMap.value[chapterId];
    await fetchStatus(bookId, chapterId);
  }

  /**
   * Vrati status za poglavlje (ili null ako još nije učitan).
   */
  function getStatus(chapterId) {
    return statusMap.value[chapterId] ?? null;
  }

  /**
   * Je li korisnik već submittovao (pending ili approved)?
   */
  function hasSubmitted(chapterId) {
    const s = getStatus(chapterId);
    return s === "pending" || s === "approved";
  }

  return {
    statusMap,
    loadingStatus,
    fetchStatus,
    markSubmitted,
    refreshStatus,
    getStatus,
    hasSubmitted,
  };
}
