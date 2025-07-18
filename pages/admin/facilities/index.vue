<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Manajemen Fasilitas</h2>

    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/admin/facilities/create"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Tambah Fasilitas Baru
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center text-gray-600">
      Memuat fasilitas...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat fasilitas: {{ error }}
    </div>
    <div v-else>
      <FacilityTable
        :facilities="facilities"
        @facilityDeleted="fetchFacilities"
      />
    </div>
  </div>
</template>

<script>
import FacilityTable from "~/components/admin/facilities/FacilityTable.vue";

export default {
  name: "AdminFacilityIndex",
  layout: "default",
  middleware: ["auth"],
  // middleware: ['auth', 'role:admin'],

  head() {
    return {
      title: "Manajemen Fasilitas",
    };
  },

  components: {
    FacilityTable,
  },

  data() {
    return {
      facilities: [],
      loading: true,
      error: null,
    };
  },

  async fetch() {
    await this.fetchFacilities();
  },

  methods: {
    async fetchFacilities() {
      this.loading = true;
      this.error = null;
      try {
        const response = await this.$axios.$get("/facilities"); // Endpoint GET /api/facilities
        this.facilities = response.data.data;
      } catch (e) {
        this.error =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat memuat data.";
        console.error("Error fetching facilities:", e);
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
