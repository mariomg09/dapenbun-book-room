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
    </div>
  </div>
</template>

<script>
import BookingTable from "~/components/bookings/BookingTable.vue";
import { mapGetters } from "vuex";

export default {
  name: "ApprovalsBookingPage", // Nama halaman untuk antrean persetujuan
  layout: "default",
  middleware: ["auth", "canApproveOrReject"], // Pastikan user login dan punya role pimpinan/HR/admin

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
      allBookings: [], // Data booking mentah dari API (pending & pimpinan_approved)
      loading: true,
      error: null,
    };
  },

  computed: {
    ...mapGetters("auth", ["user", "hasRole"]), // Akses user dan hasRole dari store Vuex

    // Properti terkomputasi yang akan memfilter bookings berdasarkan role dan departemen user
    // Logika ini harus sama persis dengan yang ada di BookingPolicy::approve/reject
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

      // Admin bisa melihat semua booking untuk approval
      if (this.hasRole("admin")) {
        return this.allBookings;
      }

      return this.allBookings.filter((booking) => {
        if (!booking.user || !booking.user.department_id) {
          return false;
        }

        const bookingUserDeptId = booking.user.department_id;
        const bookingStatusName = booking.status ? booking.status.name : "";

        // Aturan sesuai Policy (untuk tampilan di frontend)
        if (isCombinedHRandPimpinan) {
          // Kombinasi HR+Pimpinan:
          // Jika departemen sama: bisa pending atau pimpinan_approved
          if (currentUserDeptId === bookingUserDeptId) {
            return (
              bookingStatusName === "pending" ||
              bookingStatusName === "pimpinan_approved"
            );
          }
          // Jika departemen berbeda: hanya bisa pimpinan_approved
          else {
            return bookingStatusName === "pimpinan_approved";
          }
        }

        // Jika Pure Pimpinan
        if (isPurePimpinan) {
          // Hanya bisa pending dan harus satu departemen
          return (
            bookingStatusName === "pending" &&
            currentUserDeptId === bookingUserDeptId
          );
        }

        // Jika Pure HR (tidak punya kemampuan approve/reject di Policy, jadi tidak tampilkan di halaman ini)
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
        // Ambil ID status 'pending' dan 'pimpinan_approved' dari database
        const pendingStatusId = 1; // Asumsi ID 'pending' (sesuai StatusSeeder)
        const pimpinanApprovedStatusId = 2; // Asumsi ID 'pimpinan_approved' (sesuai StatusSeeder)

        // Panggil API untuk semua booking dengan status pending atau pimpinan_approved
        const response = await this.$axios.$get(
          `/bookings?status_id=${pendingStatusId},${pimpinanApprovedStatusId}&with_relations=true`
        );
        this.allBookings = response.data.data; // Simpan data mentah
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
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
