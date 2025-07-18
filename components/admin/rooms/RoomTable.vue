<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nama Ruangan
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Kapasitas
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tersedia
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Fasilitas
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="room in rooms" :key="room.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ room.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ room.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ room.capacity }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              :class="[
                room.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800',
                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
              ]"
            >
              {{ room.available ? 'Ya' : 'Tidak' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            <span v-if="room.facilities && room.facilities.length > 0">
              {{ room.facilities.map(f => f.name).join(', ') }}
            </span>
            <span v-else class="italic text-gray-500">Tidak ada</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <NuxtLink
              :to="`/admin/rooms/${room.id}`"
              class="text-indigo-600 hover:text-indigo-900 mr-4"
            >
              Edit
            </NuxtLink>
            <a
              @click="confirmDelete(room.id)"
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
  name: 'RoomTable',
  props: {
    rooms: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async deleteRoom(id) {
      try {
        await this.$axios.$delete(`/rooms/${id}`);
        this.$emit('roomDeleted');
        alert('Ruangan berhasil dihapus!');
      } catch (e) {
        alert('Gagal menghapus ruangan: ' + (e.response?.data?.message || e.message));
        console.error('Error deleting room:', e);
      }
    },
    confirmDelete(id) {
      if (confirm('Apakah Anda yakin ingin menghapus ruangan ini?')) {
        this.deleteRoom(id);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus tabel */
</style>