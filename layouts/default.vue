<template>
  <div v-if="isAppReady" class="flex flex-col min-h-screen">
    <AppNavbar />
    <div class="flex flex-grow">
      <AppSidebar />
      <div
        class="flex-grow flex flex-col transition-all duration-300 ease-in-out"
        :class="{ 'ml-64': isSidebarOpen, 'ml-16': !isSidebarOpen }"
        style="margin-top: 4rem"
      >
        <main class="p-4 flex-grow">
          <Nuxt />
        </main>
        <footer class="bg-gray-100 text-gray-600 p-4 text-center border-t">
          <p>&copy; {{ new Date().getFullYear() }} Aplikasi Booking Ruangan.</p>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import AppSidebar from "~/components/common/AppSidebar.vue";
import AppNavbar from "~/components/common/AppNavbar.vue";

export default {
  name: "DefaultLayout",
  components: {
    AppSidebar,
    AppNavbar,
  },
  data() {
    return {
      isAppReady: false,
    };
  },
  computed: {
    ...mapState("ui", ["isSidebarOpen"]),
  },
  async mounted() {
    if (
      localStorage.getItem("auth_token") &&
      !this.$store.getters["auth/isLoggedIn"]
    ) {
      await this.$store.dispatch("auth/fetchUser");
    }
    this.isAppReady = true;
  },
};
</script>


<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  /* Hapus padding: 0; di sini agar p-4 di main dan header bisa bekerja */
}
</style>
