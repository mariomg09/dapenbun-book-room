<template>
  <div
    :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }"
    class="bg-gray-800 text-white min-h-screen flex flex-col transition-all duration-300 ease-in-out fixed left-0 top-0 z-40"
  >
    <div
      class="p-4 flex items-center"
      :class="{
        'justify-between': isSidebarOpen,
        'justify-center': !isSidebarOpen,
      }"
    >
      <h2
        v-if="isSidebarOpen"
        class="text-2xl font-semibold whitespace-nowrap overflow-hidden"
      >
        Dapenbun
      </h2>
      <button
        @click="toggleSidebar"
        class="p-2 rounded-full hover:bg-gray-700 ring-2 ring-gray-500"
      >
        <svg
          v-if="isSidebarOpen"
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
        <svg
          v-else
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5l7 7-7 7"
          ></path>
        </svg>
      </button>
    </div>

    <nav class="flex-grow">
      <ul class="space-y-2 px-2">
        <li>
          <NuxtLink
            to="/"
            class="flex items-center p-2 rounded-lg hover:bg-gray-700"
          >
            <span class="icon" :class="{ 'mr-3': isSidebarOpen }"
              >&#127968;</span
            >
            <span v-if="isSidebarOpen" class="whitespace-nowrap overflow-hidden"
              >Beranda</span
            >
          </NuxtLink>
        </li>

        <li v-if="!isLoggedIn">
          <NuxtLink
            to="/auth/login"
            class="flex items-center p-2 rounded-lg hover:bg-gray-700"
          >
            <span class="icon" :class="{ 'mr-3': isSidebarOpen }"
              >&#128273;</span
            >
            <span v-if="isSidebarOpen" class="whitespace-nowrap overflow-hidden"
              >Login</span
            >
          </NuxtLink>
        </li>
        <li v-else>
          <a
            @click="logout"
            class="flex items-center p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
          >
            <span class="icon" :class="{ 'mr-3': isSidebarOpen }"
              >&#128682;</span
            >
            <span v-if="isSidebarOpen" class="whitespace-nowrap overflow-hidden"
              >Logout</span
            >
          </a>
        </li>

        <li v-if="isLoggedIn" class="border-t border-gray-700 my-2"></li>

        <li v-if="isLoggedIn">
          <NuxtLink
            to="/my-bookings"
            class="flex items-center p-2 rounded-lg hover:bg-gray-700"
          >
            <span class="icon" :class="{ 'mr-3': isSidebarOpen }"
              >&#128197;</span
            >
            <span v-if="isSidebarOpen" class="whitespace-nowrap overflow-hidden"
              >Booking Saya</span
            >
          </NuxtLink>
        </li>

        <li v-if="hasRole('admin')" class="border-t border-gray-700 my-2"></li>

        <li
          v-if="hasRole('admin')"
          class="text-gray-400 text-sm uppercase px-4 pt-2 pb-1"
          :class="{ 'text-center': !isSidebarOpen }"
        >
          <span v-if="isSidebarOpen">Admin Panel</span>
          <span v-else class="icon">&#9881;</span>
        </li>
        <li v-if="hasRole('admin')">
          <NuxtLink
            to="/admin/users"
            class="flex items-center p-2 rounded-lg hover:bg-gray-700"
          >
            <span class="icon" :class="{ 'mr-3': isSidebarOpen }"
              >&#128100;</span
            >
            <span v-if="isSidebarOpen" class="whitespace-nowrap overflow-hidden"
              >Manajemen User</span
            >
          </NuxtLink>
        </li>
        <li v-if="hasRole('admin')">
          <NuxtLink
            to="/admin/roles"
            class="flex items-center p-2 rounded-lg hover:bg-gray-700"
          >
            <span class="icon" :class="{ 'mr-3': isSidebarOpen }"
              >&#128101;</span
            >
            <span v-if="isSidebarOpen" class="whitespace-nowrap overflow-hidden"
              >Manajemen Role</span
            >
          </NuxtLink>
        </li>
        <li v-if="hasRole('admin')">
          <NuxtLink
            to="/admin/departments"
            class="flex items-center p-2 rounded-lg hover:bg-gray-700"
          >
            <span class="icon" :class="{ 'mr-3': isSidebarOpen }"
              >&#127970;</span
            >
            <span v-if="isSidebarOpen" class="whitespace-nowrap overflow-hidden"
              >Departemen</span
            >
          </NuxtLink>
        </li>
        <li v-if="hasRole('admin')">
          <NuxtLink
            to="/admin/urusan"
            class="flex items-center p-2 rounded-lg hover:bg-gray-700"
          >
            <span class="icon" :class="{ 'mr-3': isSidebarOpen }"
              >&#128193;</span
            >
            <span v-if="isSidebarOpen" class="whitespace-nowrap overflow-hidden"
              >Urusan</span
            >
          </NuxtLink>
        </li>
        <li v-if="hasRole('admin')">
          <NuxtLink
            to="/admin/facilities"
            class="flex items-center p-2 rounded-lg hover:bg-gray-700"
          >
            <span class="icon" :class="{ 'mr-3': isSidebarOpen }"
              >&#128214;</span
            >
            <span v-if="isSidebarOpen" class="whitespace-nowrap overflow-hidden"
              >Fasilitas</span
            >
          </NuxtLink>
        </li>
        <li v-if="hasRole('admin')">
          <NuxtLink
            to="/admin/rooms"
            class="flex items-center p-2 rounded-lg hover:bg-gray-700"
          >
            <span class="icon" :class="{ 'mr-3': isSidebarOpen }"
              >&#127974;</span
            >
            <span v-if="isSidebarOpen" class="whitespace-nowrap overflow-hidden"
              >Ruangan</span
            >
          </NuxtLink>
        </li>
        <li v-if="hasRole('admin')">
          <NuxtLink
            to="/admin/statuses"
            class="flex items-center p-2 rounded-lg hover:bg-gray-700"
          >
            <span class="icon" :class="{ 'mr-3': isSidebarOpen }"
              >&#128077;</span
            >
            <span v-if="isSidebarOpen" class="whitespace-nowrap overflow-hidden"
              >Status</span
            >
          </NuxtLink>
        </li>
        <li v-if="hasRole('admin')">
          <NuxtLink
            to="/admin/audit-logs"
            class="flex items-center p-2 rounded-lg hover:bg-gray-700"
          >
            <span class="icon" :class="{ 'mr-3': isSidebarOpen }"
              >&#128220;</span
            >
            <span v-if="isSidebarOpen" class="whitespace-nowrap overflow-hidden"
              >Log Audit</span
            >
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div
      v-if="isLoggedIn"
      class="mt-auto p-4 text-center border-t border-gray-700"
    >
      <span v-if="isSidebarOpen" class="whitespace-nowrap overflow-hidden"
        >Halo, {{ user.name }}</span
      >
      <span v-else class="icon">&#128100;</span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "AppSidebar",
  computed: {
    ...mapState("ui", ["isSidebarOpen"]), // Ambil state sidebar dari modul ui
    ...mapGetters("auth", ["isLoggedIn", "user", "hasRole"]), // Ambil state auth user dari modul auth
  },
  methods: {
    ...mapActions("ui", ["toggleSidebar"]), // Aksi untuk mengubah state sidebar
    ...mapActions("auth", ["logout"]), // Aksi logout

    async logout() {
      await this.$store.dispatch("auth/logout"); // Panggil aksi logout dari Vuex
      this.$router.push("/auth/login"); // Redirect ke halaman login setelah logout
    },
  },
};
</script>

<style scoped>
.icon {
  font-size: 1.5rem; /* Ukuran ikon Unicode */
  line-height: 1; /* Pastikan tinggi baris sesuai */
  display: inline-block;
  vertical-align: middle;
}
.nuxt-link-active {
  background-color: rgba(55, 65, 81, 0.7); /* bg-gray-700 dengan opacity */
  color: white;
}
</style>
