<template>
  <div class="flex min-h-screen">
    <AppSidebar />

    <div :class="{ 'ml-64': isSidebarOpen, 'ml-20': !isSidebarOpen }" class="flex-grow transition-all duration-300 ease-in-out">
      <header class="bg-white p-4 shadow-sm border-b">
        <div class="container mx-auto">
          <h1 class="text-xl font-semibold text-gray-800">
            {{ $route.meta && $route.meta.title ? $route.meta.title : 'Dashboard' }}
          </h1>
        </div>
      </header>

      <main class="p-4">
        <Nuxt />
      </main>

      <footer class="bg-gray-100 text-gray-600 p-4 text-center mt-auto border-t">
        <p>
          &copy; {{ new Date().getFullYear() }} Aplikasi Booking Ruangan.
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
import AppSidebar from '~/components/common/AppSidebar.vue'; // Import komponen sidebar
import { mapState } from 'vuex'; // Import mapState untuk mengakses state sidebar

export default {
  name: 'DefaultLayout',
  components: {
    AppSidebar,
  },
  computed: {
    ...mapState('ui', ['isSidebarOpen']), // Akses state isSidebarOpen dari modul ui
  },
  // Untuk memastikan user data dimuat saat refresh halaman
  async mounted() {
    // Panggil fetchUser dari store auth jika ada token dan belum login
    if (localStorage.getItem('auth_token') && !this.$store.getters['auth/isLoggedIn']) {
      await this.$store.dispatch('auth/fetchUser');
    }
  },
};
</script>

<style>
/* Global CSS atau import Tailwind (biasanya di nuxt.config.js/plugins) */
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
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
  padding: 0; /* Tambahkan padding 0 default untuk menghilangkan margin/padding browser */
}
</style>