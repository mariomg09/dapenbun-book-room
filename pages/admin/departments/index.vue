<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Manajemen Departemen</h2>

    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/admin/departments/create"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Tambah Departemen Baru
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center text-gray-600">
      Memuat departemen...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat departemen: {{ error }}
    </div>
    <div v-else-if="departments.length === 0" class="text-center text-gray-500">
      Tidak ada departemen yang ditemukan.
    </div>
    <div v-else>
      <DepartmentTable
        :departments="departments"
        @departmentDeleted="fetchDepartments"
      />

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
import DepartmentTable from "~/components/admin/departments/DepartmentTable.vue";

export default {
  name: "AdminDepartmentIndex",
  layout: "default",
  middleware: ["auth"],

  head() {
    return {
      title: "Manajemen Departemen",
    };
  },

  components: {
    DepartmentTable,
  },

  data() {
    return {
      departments: [],
      loading: true,
      error: null,
      currentPage: 1, // State untuk halaman saat ini
      perPage: 10, // State untuk item per halaman
      totalPages: 1, // State untuk total halaman
      totalItems: 0, // State untuk total item
      // Anda bisa tambahkan 'filters' object di sini jika ingin ada fitur filter
      // filters: { name: '' },
    };
  },

  async fetch() {
    await this.fetchDepartments();
  },

  methods: {
    async fetchDepartments() {
      this.loading = true;
      this.error = null;
      try {
        const params = {
          page: this.currentPage,
          per_page: this.perPage,
          // ... Anda bisa tambahkan this.filters di sini jika ada
        };
        const response = await this.$axios.$get("/departments", { params }); // Endpoint GET /api/departments

        // Asumsi respons API adalah { status: true, data: { current_page: ..., data: [...], ... } }
        this.departments = response.data.data;
        this.currentPage = response.data.current_page;
        this.perPage = response.data.per_page;
        this.totalPages = response.data.last_page;
        this.totalItems = response.data.total;
      } catch (e) {
        this.error =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat memuat data.";
        console.error("Error fetching departments:", e);
      } finally {
        this.loading = false;
      }
    },
    // Metode untuk navigasi paginasi
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchDepartments(); // Panggil ulang fetch data untuk halaman baru
      }
    },
    // Jika Anda menambahkan filter, Anda juga akan memiliki metode applyFilters dan resetFilters
    // applyFilters() { this.currentPage = 1; this.fetchDepartments(); },
    // resetFilters() { this.filters = {}; this.currentPage = 1; this.fetchDepartments(); },
  },
};
</script>

<style scoped>
/* Styling khusus komponen ini */
</style>
