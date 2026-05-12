// composables/useAuth.js
// Globalni auth state — dijeli se kroz cijelu aplikaciju.
// Jedan ref, svi čitaju isto stanje.

import { computed, ref } from "vue";

// Van funkcije — dijeli se između svih poziva useAuth()
const accessToken = ref(localStorage.getItem("access_token"));

export function useAuth() {
  const isAuthed = computed(() => !!accessToken.value);

  function setTokens(access, refresh) {
    accessToken.value = access;
    localStorage.setItem("access_token", access);
    if (refresh) localStorage.setItem("refresh_token", refresh);
  }

  function clearTokens() {
    accessToken.value = null;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

  return { isAuthed, setTokens, clearTokens };
}
