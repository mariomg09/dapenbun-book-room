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
            Nama
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Username
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Email
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Departemen
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Urusan
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Roles
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Aksi
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="user in users" :key="user.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ user.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.username }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ user.email }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ user.department ? user.department.name : "N/A" }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ user.urusan ? user.urusan.name : "N/A" }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span v-if="user.roles && user.roles.length > 0">
              {{ user.roles.map((role) => role.name).join(", ") }}
            </span>
            <span v-else class="italic text-gray-500">Tidak ada</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <NuxtLink
              :to="`/admin/users/${user.id}`"
              class="text-indigo-600 hover:text-indigo-900 mr-4"
            >
              Edit
            </NuxtLink>
            <a
              @click="confirmDelete(user.id)"
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
  name: "UserTable",
  props: {
    users: {
      type: Array,
      required: true,
    },
  },
  methods: {
    async deleteUser(id) {
      try {
        await this.$axios.$delete(`/users/${id}`);
        this.$emit("userDeleted");
        alert("User berhasil dihapus!");
      } catch (e) {
        alert(
          "Gagal menghapus user: " + (e.response?.data?.message || e.message)
        );
        console.error("Error deleting user:", e);
      }
    },
    confirmDelete(id) {
      if (confirm("Apakah Anda yakin ingin menghapus user ini?")) {
        this.deleteUser(id);
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus tabel */
</style>
