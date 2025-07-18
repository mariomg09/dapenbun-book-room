<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Manajemen User</h2>

    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/admin/users/create"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Tambah User Baru
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center text-gray-600">Memuat user...</div>
    <div v-else-if="error" class="text-center text-red-600">Gagal memuat user: {{ error }}</div>
    <div v-else>
      <UserTable :users="users" @userDeleted="fetchUsers" />
    </div>
  </div>
</template>

<script>
import UserTable from '~/components/admin/users/UserTable.vue';

export default {
  name: 'AdminUserIndex',
  layout: 'default', // Menggunakan layout default
  middleware: ['auth'], // Membutuhkan autentikasi dan role admin

  head() {
    return {
      title: 'Manajemen User',
    };
  },

  components: {
    UserTable,
  },

  data() {
    return {
      users: [],
      loading: true,
      error: null,
    };
  },

  async fetch() {
    await this.fetchUsers();
  },

  methods: {
    async fetchUsers() {
      this.loading = true;
      this.error = null;
      try {
        // Endpoint GET /api/users
        // with_relations=true agar roles, department, urusan ikut dimuat
        const response = await this.$axios.$get('/users?with_relations=true');
        this.users = response.data.data; // Sesuaikan dengan struktur respons paginated
      } catch (e) {
        this.error = e.response?.data?.message || e.message || 'Terjadi kesalahan saat memuat data.';
        console.error('Error fetching users:', e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus komponen ini */
</style>