<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">
      Daftar Booking untuk Persetujuan
    </h2>

    <div class="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 class="text-lg font-semibold mb-3">Filter Booking</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label
            for="filter-status"
            class="block text-sm font-medium text-gray-700"
            >Status:</label
          >
          <select
            v-model.number="filters.status_id"
            id="filter-status"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option :value="null">-- Semua Status --</option>
            <option
              v-for="status in statusesOptions"
              :key="status.id"
              :value="status.id"
            >
              {{ status.name }}
            </option>
          </select>
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
      Memuat booking untuk persetujuan...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat booking untuk persetujuan: {{ error }}
    </div>
    <div
      v-else-if="filteredBookings.length === 0"
      class="text-center text-gray-500"
    >
      Tidak ada booking yang ditemukan.
    </div>
    <div v-else>
      <BookingTable
        :bookings="filteredBookings"
        @bookingDeleted="fetchApprovalBookings"
      />

      <div v-if="totalPages > 1" class="flex justify-center mt-6">
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
import BookingTable from "~/components/bookings/BookingTable.vue";
import { mapGetters } from "vuex";

export default {
  name: "ApprovalsBookingPage",
  layout: "default",
  middleware: ["auth", "canApproveOrReject"],

  head() {
    return {
      title: "Daftar Booking untuk Persetujuan",
    };
  },

  components: {
    BookingTable,
  },

  data() {
    return {
      allBookings: [],
      loading: true,
      error: null,
      filters: {
        status_id: null,
      },
      statusesOptions: [],
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalItems: 0,
    };
  },

  computed: {
    ...mapGetters("auth", ["user", "hasRole"]),

    filteredBookings() {
      if (!this.user || !this.allBookings.length) {
        return [];
      }

      const currentUserDeptId = this.user.department_id;
      const userRoles = this.user.roles
        ? this.user.roles.map((r) => r.name)
        : [];

      const isPureHR =
        userRoles.includes("HR") && !userRoles.includes("pimpinan");
      const isPurePimpinan =
        userRoles.includes("pimpinan") && !userRoles.includes("HR");
      const isCombinedHRandPimpinan =
        userRoles.includes("HR") && userRoles.includes("pimpinan");

      let filteredByRole = [];

      if (this.hasRole("admin")) {
        filteredByRole = this.allBookings;
      } else {
        filteredByRole = this.allBookings.filter((booking) => {
          if (!booking.user || !booking.user.department_id) {
            return false;
          }

          const bookingUserDeptId = booking.user.department_id;
          const bookingStatusName = booking.status ? booking.status.name : "";

          if (isCombinedHRandPimpinan) {
            return (
              currentUserDeptId === bookingUserDeptId ||
              bookingStatusName === "pimpinan_approved" ||
              bookingStatusName === "approved" ||
              bookingStatusName === "rejected"
            );
          }

          if (isPurePimpinan) {
            return currentUserDeptId === bookingUserDeptId;
          }

          if (isPureHR) {
            return true;
          }

          return false;
        });
      }

      const filteredByStatus = this.filters.status_id
        ? filteredByRole.filter(
            (booking) => booking.status_id === this.filters.status_id
          )
        : filteredByRole;

      // --- LOGIKA PENGURUTAN DITAMBAHKAN DI SINI ---
      // Urutkan berdasarkan status 'pimpinan_approved' dan 'pending'
      return filteredByStatus.sort((a, b) => {
        const statusA = a.status ? a.status.name : "";
        const statusB = b.status ? b.status.name : "";

        // Prioritas pertama: pimpinan_approved
        if (
          statusA === "pimpinan_approved" &&
          statusB !== "pimpinan_approved"
        ) {
          return -1;
        }
        if (
          statusA !== "pimpinan_approved" &&
          statusB === "pimpinan_approved"
        ) {
          return 1;
        }

        // Prioritas kedua: pending
        if (statusA === "pending" && statusB !== "pending") {
          return -1;
        }
        if (statusA !== "pending" && statusB === "pending") {
          return 1;
        }

        // Default: Urutkan berdasarkan waktu mulai (dari yang terdekat)
        const dateA = new Date(a.start_time);
        const dateB = new Date(b.start_time);
        return dateA.getTime() - dateB.getTime();
      });
      // --- AKHIR LOGIKA PENGURUTAN ---
    },
  },

  async fetch() {
    await Promise.all([
      this.fetchApprovalBookings(),
      this.fetchStatusesOptions(),
    ]);
  },

  methods: {
    async fetchApprovalBookings() {
      this.loading = true;
      this.error = null;
      try {
        const params = {
          page: this.currentPage,
          per_page: this.perPage,
          ...this.filters,
          with_relations: true,
        };
        const response = await this.$axios.$get(`/bookings`, { params });
        this.allBookings = response.data.data;
        this.currentPage = response.data.current_page;
        this.perPage = response.data.per_page;
        this.totalPages = response.data.last_page;
        this.totalItems = response.data.total;
      } catch (e) {
        this.error =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat memuat booking untuk persetujuan.";
        console.error("Error fetching approval bookings:", e);
      } finally {
        this.loading = false;
      }
    },
    async fetchStatusesOptions() {
      try {
        const response = await this.$axios.$get("/status/options");
        this.statusesOptions = response.data;
      } catch (e) {
        console.error("Error fetching statuses for filter:", e);
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchApprovalBookings();
      }
    },
    applyFilters() {
      this.currentPage = 1;
      this.fetchApprovalBookings();
    },
    resetFilters() {
      this.filters = {
        status_id: null,
      };
      this.currentPage = 1;
      this.fetchApprovalBookings();
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
