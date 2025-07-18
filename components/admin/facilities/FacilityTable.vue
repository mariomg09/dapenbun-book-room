<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nama Fasilitas
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="facility in facilities" :key="facility.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ facility.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ facility.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <NuxtLink
              :to="`/admin/facilities/${facility.id}`"
              class="text-indigo-600 hover:text-indigo-900 mr-4"
            >
              Edit
            </NuxtLink>
            <a
              @click="confirmDelete(facility.id)"
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
  name: 'FacilityTable',
  props: {
    facilities: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async deleteFacility(id) {
      try {
        await this.$axios.$delete(`/facilities/${id}`);
        this.$emit('facilityDeleted');
        alert('Fasilitas berhasil dihapus!');
      } catch (e) {
        alert('Gagal menghapus fasilitas: ' + (e.response?.data?.message || e.message));
        console.error('Error deleting facility:', e);
      }
    },
    confirmDelete(id) {
      if (confirm('Apakah Anda yakin ingin menghapus fasilitas ini?')) {
        this.deleteFacility(id);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus tabel */
</style>