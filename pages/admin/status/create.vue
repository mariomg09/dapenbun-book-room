<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Tambah Status Baru</h2>
    <StatusForm @formSubmitted="statusCreated" />
  </div>
</template>

<script>
import StatusForm from "~/components/admin/status/StatusForm.vue";

export default {
  name: "AdminStatusCreate",
  layout: "default",
  middleware: ["auth"],
  // middleware: ['auth'],

  head() {
    return {
      title: "Tambah Status",
    };
  },

  components: {
    StatusForm,
  },

  methods: {
    statusCreated() {
      alert("Status berhasil ditambahkan!");
      this.$router.push("/admin/status");
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
