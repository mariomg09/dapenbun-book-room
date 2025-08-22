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
            Nama Instansi
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Aksi
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="instansi in instansi" :key="instansi.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ instansi.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ instansi.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <NuxtLink
              :to="`/admin/instansi/${instansi.id}`"
              class="text-indigo-600 hover:text-indigo-900 mr-4"
            >
              Edit
            </NuxtLink>
            <a
              @click="confirmDelete(instansi.id)"
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
  name: "InstansiTable",
  props: {
    instansi: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async deleteInstansi(id) {
      if (!confirm("Apakah Anda yakin ingin menghapus instansi ini?")) {
        return;
      }
      try {
        await this.$axios.$delete(`/instansi/${id}`);
        this.$emit("instansiDeleted");
        alert("Instansi berhasil dihapus!");
      } catch (e) {
        alert(
          "Gagal menghapus instansi: " +
            (e.response?.data?.message || e.message)
        );
        console.error("Error deleting instansi:", e);
      }
    },
    confirmDelete(id) {
      if (confirm("Apakah Anda yakin ingin menghapus instansi ini?")) {
        this.deleteInstansi(id);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus tabel */
</style>
