<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Edit Departemen</h2>
    <div v-if="loading" class="text-center text-gray-600">
      Memuat data departemen...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat departemen: {{ error }}
    </div>
    <div v-else>
      <DepartmentForm
        :department="department"
        @formSubmitted="departmentUpdated"
      />
    </div>
  </div>
</template>

<script>
import DepartmentForm from "~/components/admin/departments/DepartmentForm.vue"; // Import komponen form

export default {
  name: "AdminDepartmentEdit",
  layout: "default",
  middleware: ["auth"], // Membutuhkan autentikasi
  // middleware: ['auth', 'role:admin'], // Role admin untuk mengedit

  head() {
    return {
      title: "Edit Departemen",
    };
  },

  components: {
    DepartmentForm,
  },

  data() {
    return {
      department: null,
      loading: true,
      error: null,
    };
  },

  async fetch() {
    this.loading = true;
    this.error = null;
    try {
      const response = await this.$axios.$get(
        `/departments/${this.$route.params.id}`
      ); // Ambil ID dari URL
      this.department = response.data.data; // Sesuaikan dengan struktur respons
    } catch (e) {
      this.error =
        e.response?.data?.message ||
        e.message ||
        "Terjadi kesalahan saat memuat data departemen.";
      console.error("Error fetching department for edit:", e);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    departmentUpdated() {
      alert("Departemen berhasil diperbarui!");
      this.$router.push("/admin/departments"); // Redirect kembali ke daftar
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
