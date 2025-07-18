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
    <div v-else>
      <DepartmentTable
        :departments="departments"
        @departmentDeleted="fetchDepartments"
      />
    </div>
  </div>
</template>

<script>
import DepartmentTable from "~/components/admin/departments/DepartmentTable.vue"; // Import komponen tabel

export default {
  name: "AdminDepartmentIndex",
  layout: "default", // Menggunakan layout default
  middleware: ["auth"], // Membutuhkan autentikasi
  // Opsional: middleware cek role admin
  // middleware: ['auth'], // Anda perlu membuat middleware 'role' sendiri

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
        const response = await this.$axios.$get("/departments"); // Endpoint GET /api/departments
        this.departments = response.data.data; // Sesuaikan dengan struktur respons paginated
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
  },
};
</script>

<style scoped>
/* Styling khusus komponen ini */
</style>
