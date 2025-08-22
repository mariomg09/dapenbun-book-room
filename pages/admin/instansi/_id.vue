<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Edit Instansi</h2>
    <div v-if="loading" class="text-center text-gray-600">
      Memuat data instansi...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat instansi: {{ error }}
    </div>
    <div v-else>
      <InstansiForm :instansi="instansi" @formSubmitted="instansiUpdated" />
    </div>
  </div>
</template>

<script>
import InstansiForm from "~/components/admin/instansi/InstansiForm.vue";

export default {
  name: "AdminInstansiEdit",
  layout: "default",
  middleware: ["auth", "role:admin"],

  head() {
    return {
      title: "Edit Instansi",
    };
  },

  components: {
    InstansiForm,
  },

  data() {
    return {
      instansi: null,
      loading: true,
      error: null,
    };
  },

  async fetch() {
    this.loading = true;
    this.error = null;
    try {
      const response = await this.$axios.$get(
        `/instansi/${this.$route.params.id}`
      );
      this.instansi = response.data.data;
    } catch (e) {
      this.error =
        e.response?.data?.message ||
        e.message ||
        "Terjadi kesalahan saat memuat data instansi.";
      console.error("Error fetching instansi for edit:", e);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    instansiUpdated() {
      alert("Instansi berhasil diperbarui!");
      this.$router.push("/admin/instansi");
    },
  },
};
</script>
