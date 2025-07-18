<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nama Urusan
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Departemen
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Kepala Urusan
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="urusan in urusans" :key="urusan.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ urusan.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ urusan.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ urusan.department ? urusan.department.name : 'Belum ditentukan' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ urusan.head ? urusan.head.name : 'Belum ditentukan' }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <NuxtLink
              :to="`/admin/urusan/${urusan.id}`"
              class="text-indigo-600 hover:text-indigo-900 mr-4"
            >
              Edit
            </NuxtLink>
            <a
              @click="confirmDelete(urusan.id)"
              class="text-red-600 hover:text-red-900 cursor-pointer"
            >
              Hapus
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'UrusanTable',
  props: {
    urusans: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async deleteUrusan(id) {
      try {
        await this.$axios.$delete(`/urusan/${id}`); // Perhatikan URL: /urusan (singular)
        this.$emit('urusanDeleted');
        alert('Urusan berhasil dihapus!');
      } catch (e) {
        alert('Gagal menghapus urusan: ' + (e.response?.data?.message || e.message));
        console.error('Error deleting urusan:', e);
      }
    },
    confirmDelete(id) {
      if (confirm('Apakah Anda yakin ingin menghapus urusan ini?')) {
        this.deleteUrusan(id);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus tabel */
</style>