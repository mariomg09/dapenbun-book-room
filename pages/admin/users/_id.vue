<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Edit User</h2>
    <div v-if="loading" class="text-center text-gray-600">
      Memuat data user...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat user: {{ error }}
    </div>
    <div v-else>
      <UserForm :user="user" @formSubmitted="userUpdated" />
    </div>
  </div>
</template>

<script>
import UserForm from "~/components/admin/users/UserForm.vue";

export default {
  name: "AdminUserEdit",
  layout: "default",
  middleware: ["auth"], // Membutuhkan autentikasi dan role admin

  head() {
    return {
      title: "Edit User",
    };
  },

  components: {
    UserForm,
  },

  data() {
    return {
      user: null,
      loading: true,
      error: null,
    };
  },

  async fetch() {
    this.loading = true;
    this.error = null;
    try {
      // Endpoint GET /api/users/{id}
      // with_relations=true agar roles, department, urusan ikut dimuat
      const response = await this.$axios.$get(
        `/users/${this.$route.params.id}?with_relations=true`
      );
      this.user = response.data;
    } catch (e) {
      this.error =
        e.response?.data?.message ||
        e.message ||
        "Terjadi kesalahan saat memuat data user.";
      console.error("Error fetching user for edit:", e);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    userUpdated() {
      alert("User berhasil diperbarui!");
      this.$router.push("/admin/users");
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
