<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Tambah Role Baru</h2>
    <RoleForm @formSubmitted="roleCreated" />
  </div>
</template>

<script>
import RoleForm from "~/components/admin/roles/RoleForm.vue";

export default {
  name: "AdminRoleCreate",
  layout: "default",
  middleware: ["auth"],
  // middleware: ['auth'],

  head() {
    return {
      title: "Tambah Role",
    };
  },

  components: {
    RoleForm,
  },

  methods: {
    roleCreated() {
      alert("Role berhasil ditambahkan!");
      this.$router.push("/admin/roles");
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
