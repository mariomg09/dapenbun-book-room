<template>
  <div class="font-sans antialiased">
    <header class="bg-blue-600 text-white p-4 shadow-md">
      <div class="container mx-auto flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-bold">Booking Ruangan</NuxtLink>
        <nav>
          <ul class="flex space-x-4">
            <li><NuxtLink to="/" class="hover:underline">Beranda</NuxtLink></li>
            <li><NuxtLink to="/auth/login" class="hover:underline">Login</NuxtLink></li>
            </ul>
        </nav>
      </div>
    </header>

    <main>
      <Nuxt />
    </main>

    <footer class="bg-gray-800 text-white p-4 text-center mt-8">
      <p>&copy; {{ new Date().getFullYear() }} Aplikasi Booking Ruangan. All rights reserved.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
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
}
</style>