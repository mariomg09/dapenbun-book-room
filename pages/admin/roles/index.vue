<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Manajemen Role</h2>

    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/admin/roles/create"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Tambah Role Baru
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center text-gray-600">Memuat role...</div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat role: {{ error }}
    </div>
    <div v-else>
      <RoleTable :roles="roles" @roleDeleted="fetchRoles" />
    </div>
  </div>
</template>

<script>
import RoleTable from "~/components/admin/roles/RoleTable.vue";

export default {
  name: "AdminRoleIndex",
  layout: "default",
  middleware: ["auth"],
  // middleware: ['auth'], // Anda bisa aktifkan ini jika hanya admin yang bisa akses

  head() {
    return {
      title: "Manajemen Role",
    };
  },

  components: {
    RoleTable,
  },

  data() {
    return {
      roles: [],
      loading: true,
      error: null,
    };
  },

  async fetch() {
    await this.fetchRoles();
  },

  methods: {
    async fetchRoles() {
      this.loading = true;
      this.error = null;
      try {
        const response = await this.$axios.$get("/roles"); // Endpoint GET /api/roles
        this.roles = response.data.data;
      } catch (e) {
        this.error =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat memuat data.";
        console.error("Error fetching roles:", e);
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
