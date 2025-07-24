<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">
      Antrean Persetujuan Booking
    </h2>

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
      Tidak ada booking yang menunggu persetujuan Anda.
    </div>
    <div v-else>
      <BookingTable
        :bookings="filteredBookings"
        @bookingDeleted="fetchApprovalBookings"
      />

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
import BookingTable from "~/components/bookings/BookingTable.vue";
import { mapGetters } from "vuex";

export default {
  name: "ApprovalsBookingPage",
  layout: "default",
  middleware: ["auth", "canApproveOrReject"],

  head() {
    return {
      title: "Antrean Persetujuan",
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

      if (this.hasRole("admin")) {
        return this.allBookings;
      }

      return this.allBookings.filter((booking) => {
        if (!booking.user || !booking.user.department_id) {
          return false;
        }

        const bookingUserDeptId = booking.user.department_id;
        const bookingStatusName = booking.status ? booking.status.name : "";

        if (isCombinedHRandPimpinan) {
          if (currentUserDeptId === bookingUserDeptId) {
            return (
              bookingStatusName === "pending" ||
              bookingStatusName === "pimpinan_approved"
            );
          } else {
            return bookingStatusName === "pimpinan_approved";
          }
        }

        if (isPurePimpinan) {
          return (
            bookingStatusName === "pending" &&
            currentUserDeptId === bookingUserDeptId
          );
        }

        if (isPureHR) {
          return false;
        }

        return false;
      });
    },
  },

  async fetch() {
    await this.fetchApprovalBookings();
  },

  methods: {
    async fetchApprovalBookings() {
      this.loading = true;
      this.error = null;
      try {
        const pendingStatusId = 1;
        const pimpinanApprovedStatusId = 2;

        const params = {
          page: this.currentPage,
          per_page: this.perPage,
          status_id: `${pendingStatusId},${pimpinanApprovedStatusId}`,
        };

        const response = await this.$axios.$get(
          `/bookings?with_relations=true`,
          { params }
        );
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
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchApprovalBookings();
      }
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
