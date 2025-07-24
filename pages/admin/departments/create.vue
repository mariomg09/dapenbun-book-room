<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">
      Tambah Departemen Baru
    </h2>
    <DepartmentForm @formSubmitted="departmentCreated" />
  </div>
</template>

<script>
import DepartmentForm from "~/components/admin/departments/DepartmentForm.vue"; // Import komponen form

export default {
  name: "AdminDepartmentCreate",
  layout: "default",
  middleware: ["auth"],

  head() {
    return {
      title: "Tambah Departemen",
    };
  },

  components: {
    DepartmentForm,
  },

  methods: {
    departmentCreated() {
      alert("Departemen berhasil ditambahkan!");
      this.$router.push("/admin/departments");x
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
