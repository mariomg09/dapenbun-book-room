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
            Nama Departemen
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Kepala Departemen
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Aksi
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="department in departments" :key="department.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ department.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ department.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ department.head ? department.head.name : "Belum ditentukan" }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <NuxtLink
              :to="`/admin/departments/${department.id}`"
              class="text-indigo-600 hover:text-indigo-900 mr-4"
            >
              Edit
            </NuxtLink>
            <a
              @click="confirmDelete(department.id)"
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
  name: "DepartmentTable",
  props: {
    departments: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async deleteDepartment(id) {
      try {
        await this.$axios.$delete(`/departments/${id}`);
        this.$emit("departmentDeleted");
        alert("Departemen berhasil dihapus!");
      } catch (e) {
        alert(
          "Gagal menghapus departemen: " +
            (e.response?.data?.message || e.message)
        );
        console.error("Error deleting department:", e);
      }
    },
    confirmDelete(id) {
      if (confirm("Apakah Anda yakin ingin menghapus departemen ini?")) {
        this.deleteDepartment(id);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus tabel */
</style>
