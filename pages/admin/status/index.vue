<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Manajemen Status</h2>

    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/admin/status/create"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Tambah Status Baru
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center text-gray-600">Memuat status...</div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat status: {{ error }}
    </div>
    <div v-else>
      <StatusTable :status="status" @statusDeleted="fetchstatus" />
    </div>
  </div>
</template>

<script>
import StatusTable from "~/components/admin/status/StatusTable.vue";

export default {
  name: "AdminStatusIndex",
  layout: "default",
  middleware: ["auth"],
  // middleware: ['auth', 'role:admin'],

  head() {
    return {
      title: "Manajemen Status",
    };
  },

  components: {
    StatusTable,
  },

  data() {
    return {
      status: [],
      loading: true,
      error: null,
    };
  },

  async fetch() {
    await this.fetchstatus();
  },

  methods: {
    async fetchstatus() {
      this.loading = true;
      this.error = null;
      try {
        const response = await this.$axios.$get("/status"); // Endpoint GET /api/status
        this.status = response.data.data;
      } catch (e) {
        this.error =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat memuat data.";
        console.error("Error fetching status:", e);
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
