<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nama Role
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Guard Name
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="role in roles" :key="role.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ role.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ role.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ role.guard_name }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <NuxtLink
              :to="`/admin/roles/${role.id}`"
              class="text-indigo-600 hover:text-indigo-900 mr-4"
            >
              Edit
            </NuxtLink>
            <a
              @click="confirmDelete(role.id)"
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
  name: 'RoleTable',
  props: {
    roles: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async deleteRole(id) {
      try {
        await this.$axios.$delete(`/roles/${id}`); // Endpoint DELETE /api/roles/{id}
        this.$emit('roleDeleted'); // Memberi tahu parent untuk me-refresh daftar
        alert('Role berhasil dihapus!');
      } catch (e) {
        alert('Gagal menghapus role: ' + (e.response?.data?.message || e.message));
        console.error('Error deleting role:', e);
      }
    },
    confirmDelete(id) {
      if (confirm('Apakah Anda yakin ingin menghapus role ini?')) {
        this.deleteRole(id);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus tabel */
</style>