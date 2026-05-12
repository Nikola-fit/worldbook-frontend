// composables/useSubmissionStatus.js
// Backend je jedini izvor istine.
// statusMap je in-memory cache koji živi samo dok je stranica otvorena.

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

export function useSubmissionStatus() {
  // In-memory map: chapterId → status
  // Ne čuva se nigdje — pri refresh stranice ide novi request na backend
  const statusMap = ref({});
  const loadingStatus = ref(false);

  /**
   * Dohvati status sa backenda za dato poglavlje.
   * Ako je već u mapi (u ovoj sesiji), ne ide ponovo na backend.
   */
  async function fetchStatus(chapterId) {
    if (statusMap.value[chapterId] !== undefined) return;

    loadingStatus.value = true;
    try {
      const { data } = await http.get(`/book/chapters/${chapterId}/my-status/`);
      statusMap.value[chapterId] = data?.status ?? "none";
    } catch {
      statusMap.value[chapterId] = "none";
    } finally {
      loadingStatus.value = false;
    }
  }

  /**
   * Optimistički update odmah nakon submit-a.
   * Korisnik odmah vidi "pending" bez čekanja na backend.
   */
  function markSubmitted(chapterId) {
    statusMap.value[chapterId] = "pending";
  }

  /**
   * Prisilni refresh sa backenda — briše iz mape i ponovo pita backend.
   * Koristi se za "Osveži" dugme.
   */
  async function refreshStatus(chapterId) {
    delete statusMap.value[chapterId];
    await fetchStatus(chapterId);
  }

  /**
   * Vrati status za poglavlje (ili null ako još nije učitan).
   */
  function getStatus(chapterId) {
    return statusMap.value[chapterId] ?? null;
  }

  return {
    loadingStatus,
    fetchStatus,
    markSubmitted,
    refreshStatus,
    getStatus,
  };
}
