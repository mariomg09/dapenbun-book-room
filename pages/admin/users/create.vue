<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Tambah User Baru</h2>
    <UserForm @formSubmitted="userCreated" />
  </div>
</template>

<script>
import UserForm from "~/components/admin/users/UserForm.vue";

export default {
  name: "AdminUserCreate",
  layout: "default",
  middleware: ["auth"],

  head() {
    return {
      title: "Tambah User",
    };
  },

  components: {
    UserForm,
  },

  methods: {
    userCreated() {
      alert("User berhasil ditambahkan!");
      this.$router.push("/admin/users");
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
