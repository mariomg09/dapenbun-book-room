<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Manajemen User</h2>

    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/admin/users/create"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Tambah User Baru
      </NuxtLink>
    </div>

    <!-- Bagian Filter dan Pencarian -->
    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 class="text-lg font-semibold mb-3">Filter User</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label
            for="filter-name"
            class="block text-sm font-medium text-gray-700"
            >Nama:</label
          >
          <input
            type="text"
            v-model="filters.name"
            id="filter-name"
            placeholder="Cari nama..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label
            for="filter-username"
            class="block text-sm font-medium text-gray-700"
            >Username:</label
          >
          <input
            type="text"
            v-model="filters.username"
            id="filter-username"
            placeholder="Cari username..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label
            for="filter-email"
            class="block text-sm font-medium text-gray-700"
            >Email:</label
          >
          <input
            type="email"
            v-model="filters.email"
            id="filter-email"
            placeholder="Cari email..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label
            for="filter-department"
            class="block text-sm font-medium text-gray-700"
            >Departemen:</label
          >
          <select
            v-model.number="filters.department_id"
            id="filter-department"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option :value="null">-- Semua Departemen --</option>
            <option
              v-for="dept in departmentsOptions"
              :key="dept.id"
              :value="dept.id"
            >
              {{ dept.name }}
            </option>
          </select>
        </div>
        <div>
          <label
            for="filter-urusan"
            class="block text-sm font-medium text-gray-700"
            >Urusan:</label
          >
          <select
            v-model.number="filters.urusan_id"
            id="filter-urusan"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option :value="null">-- Semua Urusan --</option>
            <option
              v-for="urusan in urusansOptions"
              :key="urusan.id"
              :value="urusan.id"
            >
              {{ urusan.name }}
            </option>
          </select>
        </div>
        <div>
          <label
            for="filter-search-all"
            class="block text-sm font-medium text-gray-700"
            >Cari Umum:</label
          >
          <input
            type="text"
            v-model="filters.search"
            id="filter-search-all"
            placeholder="Cari di semua kolom..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button
          @click="applyFilters"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Terapkan Filter
        </button>
        <button
          @click="resetFilters"
          class="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-200"
        >
          Reset
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center text-gray-600">Memuat user...</div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat user: {{ error }}
    </div>
    <div v-else-if="users.length === 0" class="text-center text-gray-500">
      Tidak ada user yang ditemukan.
    </div>
    <div v-else>
      <UserTable :users="users" @userDeleted="fetchUsers" />

      <!-- Kontrol Pagination -->
      <div class="flex justify-center mt-6">
        <nav
          class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Sebelumnya
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              page === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700',
              'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium hover:bg-gray-50',
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Selanjutnya
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import UserTable from "~/components/admin/users/UserTable.vue";

export default {
  name: "AdminUserIndex",
  layout: "default",
  middleware: ["auth"], // Membutuhkan autentikasi dan role admin

  head() {
    return {
      title: "Manajemen User",
    };
  },

  components: {
    UserTable,
  },

  data() {
    return {
      users: [],
      loading: true,
      error: null,
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalItems: 0,
      // --- TAMBAHAN FILTER ---
      filters: {
        name: "",
        username: "",
        email: "",
        department_id: null,
        urusan_id: null,
        search: "", // Untuk search umum
      },
      departmentsOptions: [], // Untuk dropdown filter departemen
      urusansOptions: [], // Untuk dropdown filter urusan
      // --- AKHIR TAMBAHAN FILTER ---
    };
  },

  async fetch() {
    await Promise.all([
      this.fetchUsers(),
      this.fetchDepartmentsOptions(), // Panggil untuk mengisi dropdown filter
      this.fetchUrusansOptions(), // Panggil untuk mengisi dropdown filter
    ]);
  },

  methods: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        const params = {
          page: this.currentPage,
          per_page: this.perPage,
          ...this.filters, // Gabungkan filter ke params
        };
        const response = await this.$axios.$get("/users?with_relations=true", {
          params,
        });

        this.users = response.data.data;
        this.currentPage = response.data.current_page;
        this.perPage = response.data.per_page;
        this.totalPages = response.data.last_page;
        this.totalItems = response.data.total;
      } catch (e) {
        this.error =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat memuat data.";
        console.error("Error fetching users:", e);
      } finally {
        this.loading = false;
      }
    },
    async fetchDepartmentsOptions() {
      try {
        const response = await this.$axios.$get("/departments"); // Asumsi endpoint ini mengembalikan data paginasi
        this.departmentsOptions = response.data.data; // Akses data.data
      } catch (e) {
        console.error("Error fetching departments for filter dropdown:", e);
      }
    },
    async fetchUrusansOptions() {
      try {
        const response = await this.$axios.$get("/urusan"); // Asumsi endpoint ini mengembalikan data paginasi
        this.urusansOptions = response.data.data; // Akses data.data
      } catch (e) {
        console.error("Error fetching urusans for filter dropdown:", e);
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchUsers();
      }
    },
    applyFilters() {
      this.currentPage = 1;
      this.fetchUsers();
    },
    resetFilters() {
      this.filters = {
        name: "",
        username: "",
        email: "",
        department_id: null,
        urusan_id: null,
        search: "",
      };
      this.currentPage = 1;
      this.fetchUsers();
    },
  },
};
</script>

<style scoped>
/* Styling khusus komponen ini */
</style>
