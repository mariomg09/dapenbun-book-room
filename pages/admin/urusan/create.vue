<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Tambah Urusan Baru</h2>
    <UrusanForm @formSubmitted="urusanCreated" />
  </div>
</template>

<script>
import UrusanForm from "~/components/admin/urusan/UrusanForm.vue";

export default {
  name: "AdminUrusanCreate",
  layout: "default",
  middleware: ["auth"],
  // middleware: ['auth'],

  head() {
    return {
      title: "Tambah Urusan",
    };
  },

  components: {
    UrusanForm,
  },

  methods: {
    urusanCreated() {
      alert("Urusan berhasil ditambahkan!");
      this.$router.push("/admin/urusan");
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
