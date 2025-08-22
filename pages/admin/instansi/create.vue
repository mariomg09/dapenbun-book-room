<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Buat Instansi Baru</h2>
    <InstansiForm @formSubmitted="instansiCreated" />
  </div>
</template>

<script>
import InstansiForm from "~/components/admin/instansi/InstansiForm.vue";

export default {
  name: "AdminInstansiCreate",
  layout: "default",
  middleware: ["auth", "role:admin"],

  head() {
    return {
      title: "Tambah Instansi",
    };
  },

  components: {
    InstansiForm,
  },

  methods: {
    instansiCreated() {
      alert("Instansi berhasil ditambahkan!");
      this.$router.push("/admin/instansi");
    },
  },
};
</script>
