<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Edit Urusan</h2>
    <div v-if="loading" class="text-center text-gray-600">
      Memuat data urusan...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat urusan: {{ error }}
    </div>
    <div v-else>
      <UrusanForm :urusan="urusan" @formSubmitted="urusanUpdated" />
    </div>
  </div>
</template>

<script>
import UrusanForm from "~/components/admin/urusan/UrusanForm.vue";

export default {
  name: "AdminUrusanEdit",
  layout: "default",
  middleware: ["auth"],
  // middleware: ['auth'],

  head() {
    return {
      title: "Edit Urusan",
    };
  },

  components: {
    UrusanForm,
  },

  data() {
    return {
      urusan: null,
      loading: true,
      error: null,
    };
  },

  async fetch() {
    this.loading = true;
    this.error = null;
    try {
      // Perhatikan URL: /urusan (singular)
      const response = await this.$axios.$get(
        `/urusan/${this.$route.params.id}`
      );
      this.urusan = response.data;
    } catch (e) {
      this.error =
        e.response?.data?.message ||
        e.message ||
        "Terjadi kesalahan saat memuat data urusan.";
      console.error("Error fetching urusan for edit:", e);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    urusanUpdated() {
      alert("Urusan berhasil diperbarui!");
      this.$router.push("/admin/urusan");
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
