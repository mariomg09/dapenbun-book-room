<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Edit Status</h2>
    <div v-if="loading" class="text-center text-gray-600">
      Memuat data status...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat status: {{ error }}
    </div>
    <div v-else>
      <StatusForm :status="status" @formSubmitted="statusUpdated" />
    </div>
  </div>
</template>

<script>
import StatusForm from "~/components/admin/status/StatusForm.vue";

export default {
  name: "AdminStatusEdit",
  layout: "default",
  middleware: ["auth"],

  head() {
    return {
      title: "Edit Status",
    };
  },

  components: {
    StatusForm,
  },

  data() {
    return {
      status: null,
      loading: true,
      error: null,
    };
  },

  async fetch() {
    this.loading = true;
    this.error = null;
    try {
      const response = await this.$axios.$get(
        `/status/${this.$route.params.id}`
      );
      this.status = response.data;
    } catch (e) {
      this.error =
        e.response?.data?.message ||
        e.message ||
        "Terjadi kesalahan saat memuat data status.";
      console.error("Error fetching status for edit:", e);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    statusUpdated() {
      alert("Status berhasil diperbarui!");
      this.$router.push("/admin/status");
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
