<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID Log
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Tipe Entitas
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            ID Entitas
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Aksi
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Dilakukan Oleh
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Waktu
          </th>
          </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="log in logs" :key="log.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ log.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ getShortEntityType(log.entity_type) }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ log.entity_id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">{{ formatAction(log.action) }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ log.performed_by ? log.performed_by.name : 'Sistem' }} </td>
          <td class="px-6 py-4 whitespace-nowrap">{{ formatDateTime(log.datetime) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'AuditLogTable',
  props: {
    logs: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getShortEntityType(fullType) {
      // Mengambil nama model saja dari namespace lengkap (misal: App\Models\Booking -> Booking)
      const parts = fullType.split('\\');
      return parts[parts.length - 1];
    },
    formatAction(action) {
      // Memformat nama aksi agar lebih mudah dibaca
      return action.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    },
    formatDateTime(datetime) {
      if (!datetime) return '';
      const date = new Date(datetime);
      return date.toLocaleDateString('id-ID', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    },
  },
};
</script>

<style scoped>
/* Styling khusus tabel */
</style>