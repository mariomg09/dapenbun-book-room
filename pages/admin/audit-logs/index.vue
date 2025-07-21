<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Log Audit Aktivitas</h2>

    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 class="text-lg font-semibold mb-3">Filter Log</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label
            for="filter-action"
            class="block text-sm font-medium text-gray-700"
            >Aksi:</label
          >
          <select
            v-model="filters.action"
            id="filter-action"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Semua Aksi</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="approved_stage_1">Approved (Pimpinan)</option>
            <option value="approved_stage_2">Approved (HR)</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label
            for="filter-entity"
            class="block text-sm font-medium text-gray-700"
            >Tipe Entitas:</label
          >
          <input
            type="text"
            v-model="filters.entity_type"
            id="filter-entity"
            placeholder="Cari tipe entitas..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label
            for="filter-user"
            class="block text-sm font-medium text-gray-700"
            >Dilakukan Oleh User ID:</label
          >
          <input
            type="number"
            v-model.number="filters.performed_by_id"
            id="filter-user"
            placeholder="User ID..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button
          @click="applyFilters"
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
        >
          Terapkan Filter
        </button>
        <button
          @click="resetFilters"
          class="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition duration-200"
        >
          Reset
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center text-gray-600">
      Memuat log audit...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat log audit: {{ error }}
    </div>

    <div v-else>
      <AuditLogTable :logs="auditLogs" />

      <div class="flex justify-center mt-6">
        <nav
          class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Sebelumnya
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              page === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700',
              'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium hover:bg-gray-50',
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          >
            Selanjutnya
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
import AuditLogTable from "~/components/admin/audit-logs/AuditLogTable.vue";

export default {
  name: "AdminAuditLogIndex",
  layout: "default",
  middleware: ["auth"],

  head() {
    return {
      title: "Log Audit",
    };
  },

  components: {
    AuditLogTable,
  },

  data() {
    return {
      auditLogs: [],
      loading: true,
      error: null,
      filters: {
        action: "",
        entity_type: "",
        performed_by_id: null,
      },
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalItems: 0,
    };
  },

  async fetch() {
    await this.fetchAuditLogs();
  },

  methods: {
    async fetchAuditLogs() {
      this.loading = true;
      this.error = null;
      try {
        const params = {
          page: this.currentPage,
          per_page: this.perPage,
          ...this.filters,
        };

        const response = await this.$axios.$get("/audit-logs", {
          params,
        });
        this.auditLogs = response.data.data;
        this.currentPage = response.current_page;
        this.perPage = response.per_page;
        this.totalPages = response.last_page;
        this.totalItems = response.total;
      } catch (e) {
        this.error =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat memuat log audit.";
        console.error("Error fetching audit logs:", e);
      } finally {
        this.loading = false;
      }
    },
    applyFilters() {
      this.currentPage = 1;
      this.fetchAuditLogs();
    },
    resetFilters() {
      this.filters = {
        action: "",
        entity_type: "",
        performed_by_id: null,
      };
      this.currentPage = 1;
      this.fetchAuditLogs();
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchAuditLogs();
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus komponen ini */
</style>
