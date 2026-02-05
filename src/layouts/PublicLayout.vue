<template>
  <div class="public-layout">
    <!-- Header / Navbar -->
    <header class="navbar">
      <div class="container navbar-content">
        <div class="logo">
          <span class="logo-mark">W</span>
          <span class="logo-text">WorldBook</span>
        </div>

        <nav class="nav-links">
          <a href="#how-it-works">Kako funkcioniše</a>
          <a href="#features">Mogućnosti</a>
          <a href="#community">Zajednica</a>

          <!-- vidi se samo kad je ulogovan -->
          <RouterLink v-if="isAuthed" to="/book" class="nav-link-router">
            Knjiga
          </RouterLink>
        </nav>

        <div class="nav-actions">
          <!-- Ako NIJE ulogovan -->
          <template v-if="!isAuthed">
            <RouterLink to="/login" class="btn btn-outline">Prijava</RouterLink>
            <RouterLink to="/register" class="btn btn-primary">
              Registracija
            </RouterLink>
          </template>

          <!-- Ako JESTE ulogovan -->
          <template v-else>
            <button
              class="btn btn-outline btn-logout"
              type="button"
              @click="logout"
            >
              Odjava
            </button>
          </template>
        </div>
      </div>
    </header>

    <!-- Glavni sadržaj -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer-content">
        <p>© {{ currentYear }} WorldBook. Sva prava zadržana.</p>
        <p class="footer-subtle">Zajedno pišemo jednu veliku priču.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";

const router = useRouter();
const currentYear = computed(() => new Date().getFullYear());

// koristi ref da možemo ručno osvježiti stanje nakon logout-a
const isAuthed = ref(!!localStorage.getItem("access_token"));

function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  isAuthed.value = false;
  router.push("/login");
}
</script>

<style scoped>
.public-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fb;
  color: #0f172a;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
}

main {
  flex: 1;
}

/* Container */
.container {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Navbar */
.navbar {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(15, 118, 196, 0.08);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-mark {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: linear-gradient(135deg, #0f8cf2, #2563eb);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
}

.logo-text {
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.03em;
  color: #0f172a;
}

/* Nav links */
.nav-links {
  display: flex;
  gap: 1.5rem;
  font-size: 0.95rem;
}

.nav-links a {
  text-decoration: none;
  color: #1f2933;
  opacity: 0.8;
  transition: opacity 0.15s ease, color 0.15s ease;
}

.nav-links a:hover {
  opacity: 1;
  color: #0f8cf2;
}

/* RouterLink u navu (da izgleda kao ostali <a>) */
.nav-link-router {
  text-decoration: none;
  color: #1f2933;
  opacity: 0.8;
  transition: opacity 0.15s ease, color 0.15s ease;
}
.nav-link-router:hover {
  opacity: 1;
  color: #0f8cf2;
}

/* Buttons */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn {
  border-radius: 999px;
  padding: 0.45rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease,
    border-color 0.15s ease, box-shadow 0.15s ease, transform 0.05s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #0f8cf2, #2563eb);
  color: white;
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover {
  box-shadow: 0 10px 26px rgba(37, 99, 235, 0.4);
  transform: translateY(-1px);
}

.btn-outline {
  border-color: #0f8cf2;
  color: #0f8cf2;
  background: white;
}

.btn-outline:hover {
  background: #eff6ff;
}

/* Logout izgled (isti kao outline, samo tekst malo "oprezniji") */
.btn-logout {
  border-color: rgba(239, 68, 68, 0.35);
  color: rgb(220, 38, 38);
}
.btn-logout:hover {
  background: rgba(239, 68, 68, 0.06);
}

/* Footer */
.footer {
  border-top: 1px solid rgba(15, 118, 196, 0.08);
  background: white;
  padding: 1.25rem 0;
}

.footer-content {
  text-align: center;
  font-size: 0.85rem;
  color: #6b7280;
}

.footer-subtle {
  margin-top: 0.25rem;
  font-size: 0.8rem;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .navbar-content {
    gap: 0.75rem;
  }

  .nav-actions .btn-outline {
    display: none;
  }

  /* ali ako je ulogovan, želimo da se odjava vidi */
  .nav-actions .btn-logout {
    display: inline-flex;
  }
}
</style>
