<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Daftar Booking Umum</h2>

    <div v-if="loading" class="text-center text-gray-600">
      Memuat booking...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat booking: {{ error }}
    </div>
    <div v-else-if="bookings.length === 0" class="text-center text-gray-500">
      Tidak ada booking yang ditemukan.
    </div>
    <div v-else>
      <BookingTable :bookings="bookings" @bookingDeleted="fetchBookings" />
    </div>
  </div>
</template>

<script>
import BookingTable from "~/components/bookings/BookingTable.vue";

export default {
  name: "GeneralBookingsIndexPage",
  layout: "default",
  middleware: ["auth"], // Halaman ini membutuhkan login

  head() {
    return {
      title: "Daftar Booking Umum",
    };
  },

  components: {
    BookingTable,
  },

  data() {
    return {
      bookings: [],
      loading: true,
      error: null,
    };
  },

  async fetch() {
    await this.fetchBookings();
  },

  methods: {
    async fetchBookings() {
      this.loading = true;
      this.error = null;
      try {
        // Panggil API GET /api/bookings untuk semua booking
        // dengan_relations=true agar user, room, status dimuat
        const response = await this.$axios.$get(
          "/bookings?with_relations=true"
        );
        this.bookings = response.data.data;
      } catch (e) {
        this.error =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat memuat data.";
        console.error("Error fetching general bookings:", e);
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
