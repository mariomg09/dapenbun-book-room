<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Edit Role</h2>
    <div v-if="loading" class="text-center text-gray-600">
      Memuat data role...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat role: {{ error }}
    </div>
    <div v-else>
      <RoleForm :role="role" @formSubmitted="roleUpdated" />
    </div>
  </div>
</template>

<script>
import RoleForm from "~/components/admin/roles/RoleForm.vue";

export default {
  name: "AdminRoleEdit",
  layout: "default",
  middleware: ["auth"],
  // middleware: ['auth'],

  head() {
    return {
      title: "Edit Role",
    };
  },

  components: {
    RoleForm,
  },

  data() {
    return {
      role: null,
      loading: true,
      error: null,
    };
  },

  async fetch() {
    this.loading = true;
    this.error = null;
    try {
      const response = await this.$axios.$get(
        `/roles/${this.$route.params.id}`
      ); // Endpoint GET /api/roles/{id}
      this.role = response.data.data;
    } catch (e) {
      this.error =
        e.response?.data?.message ||
        e.message ||
        "Terjadi kesalahan saat memuat data role.";
      console.error("Error fetching role for edit:", e);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    roleUpdated() {
      alert("Role berhasil diperbarui!");
      this.$router.push("/admin/roles");
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
