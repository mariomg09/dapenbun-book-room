<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Manajemen Instansi</h2>

    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/admin/instansi/create"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Tambah Instansi Baru
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center text-gray-600">
      Memuat instansi...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat instansi: {{ error }}
    </div>
    <div v-else-if="instansi.length === 0" class="text-center text-gray-500">
      Tidak ada instansi yang ditemukan.
    </div>
    <div v-else>
      <InstansiTable :instansi="instansi" @instansiDeleted="fetchinstansi" />
    </div>
  </div>
</template>

<script>
import InstansiTable from "~/components/admin/instansi/InstansiTable.vue";

export default {
  name: "AdminInstansiIndex",
  layout: "default",
  middleware: ["auth"],

  head() {
    return {
      title: "Manajemen Instansi",
    };
  },

  components: {
    InstansiTable,
  },

  data() {
    return {
      instansi: [],
      loading: true,
      error: null,
    };
  },

  async fetch() {
    await this.fetchinstansi();
  },

  methods: {
    async fetchinstansi() {
      this.loading = true;
      this.error = null;
      try {
        const response = await this.$axios.$get("/instansi");
        this.instansi = response.data.data;
      } catch (e) {
        this.error =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat memuat data.";
        console.error("Error fetching instansi:", e);
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
