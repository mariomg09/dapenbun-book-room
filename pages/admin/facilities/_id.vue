<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Edit Fasilitas</h2>
    <div v-if="loading" class="text-center text-gray-600">
      Memuat data fasilitas...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat fasilitas: {{ error }}
    </div>
    <div v-else>
      <FacilityForm :facility="facility" @formSubmitted="facilityUpdated" />
    </div>
  </div>
</template>

<script>
import FacilityForm from "~/components/admin/facilities/FacilityForm.vue";

export default {
  name: "AdminFacilityEdit",
  layout: "default",
  middleware: ["auth"],

  head() {
    return {
      title: "Edit Fasilitas",
    };
  },

  components: {
    FacilityForm,
  },

  data() {
    return {
      facility: null,
      loading: true,
      error: null,
    };
  },

  async fetch() {
    this.loading = true;
    this.error = null;
    try {
      const response = await this.$axios.$get(
        `/facilities/${this.$route.params.id}`
      );
      this.facility = response.data;
    } catch (e) {
      this.error =
        e.response?.data?.message ||
        e.message ||
        "Terjadi kesalahan saat memuat data fasilitas.";
      console.error("Error fetching facility for edit:", e);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    facilityUpdated() {
      alert("Fasilitas berhasil diperbarui!");
      this.$router.push("/admin/facilities");
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
