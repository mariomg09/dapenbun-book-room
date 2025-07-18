<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            ID
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Nama Status
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Aksi
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="status in status" :key="status.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ status.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ status.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <NuxtLink
              :to="`/admin/status/${status.id}`"
              class="text-indigo-600 hover:text-indigo-900 mr-4"
            >
              Edit
            </NuxtLink>
            <a
              @click="confirmDelete(status.id)"
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
  name: "StatusTable",
  props: {
    status: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async deleteStatus(id) {
      try {
        await this.$axios.$delete(`/status/${id}`);
        this.$emit("statusDeleted");
        alert("Status berhasil dihapus!");
      } catch (e) {
        alert(
          "Gagal menghapus status: " + (e.response?.data?.message || e.message)
        );
        console.error("Error deleting status:", e);
      }
    },
    confirmDelete(id) {
      if (confirm("Apakah Anda yakin ingin menghapus status ini?")) {
        this.deleteStatus(id);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus tabel */
</style>
