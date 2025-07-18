<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Manajemen Urusan</h2>

    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/admin/urusan/create"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Tambah Urusan Baru
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center text-gray-600">Memuat urusan...</div>
    <div v-else-if="error" class="text-center text-red-600">Gagal memuat urusan: {{ error }}</div>
    <div v-else>
      <UrusanTable :urusans="urusans" @urusanDeleted="fetchUrusans" />
    </div>
  </div>
</template>

<script>
import UrusanTable from '~/components/admin/urusan/UrusanTable.vue';

export default {
  name: 'AdminUrusanIndex',
  layout: 'default',
  middleware: ['auth'], // Membutuhkan autentikasi
  // middleware: ['auth', 'role:admin'], // Opsional: middleware cek role admin

  head() {
    return {
      title: 'Manajemen Urusan',
    };
  },

  components: {
    UrusanTable,
  },

  data() {
    return {
      urusans: [],
      loading: true,
      error: null,
    };
  },

  async fetch() {
    await this.fetchUrusans();
  },

  methods: {
    async fetchUrusans() {
      this.loading = true;
      this.error = null;
      try {
        // Perhatikan URL: /urusan (singular) sesuai dengan routing backend Anda
        const response = await this.$axios.$get('/urusan');
        this.urusans = response.data.data;
      } catch (e) {
        this.error = e.response?.data?.message || e.message || 'Terjadi kesalahan saat memuat data.';
        console.error('Error fetching urusans:', e);
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