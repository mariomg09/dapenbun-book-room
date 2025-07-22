<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Riwayat Booking Saya</h2>

    <div class="flex justify-end mb-4">
      <NuxtLink
        to="/bookings/create"
        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
      >
        Buat Booking Baru
      </NuxtLink>
    </div>

    <div v-if="loading" class="text-center text-gray-600">
      Memuat riwayat booking...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat riwayat booking: {{ error }}
    </div>
    <div v-else-if="bookings.length === 0" class="text-center text-gray-500">
      Tidak ada booking yang Anda buat.
    </div>
    <div v-else>
      <BookingTable :bookings="bookings" @bookingDeleted="fetchMyBookings" />
    </div>
  </div>
</template>

<script>
import BookingTable from "~/components/bookings/BookingTable.vue"; // Import komponen tabel booking

export default {
  name: "MyBookingsIndexPage",
  layout: "default",
  middleware: ["auth"], // Pastikan user harus login untuk melihat halaman ini

  head() {
    return {
      title: "Riwayat Booking Saya",
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
    await this.fetchMyBookings();
  },

  methods: {
    async fetchMyBookings() {
      this.loading = true;
      this.error = null;
      try {
        // Ambil ID user yang sedang login dari Vuex Store
        const userId = this.$store.getters["auth/user"]?.id;
        if (!userId) {
          throw new Error("User ID tidak ditemukan. Harap login ulang.");
        }

        // Panggil API GET /api/bookings dengan filter user_id
        // Pastikan backend (GetBookingAction) bisa memfilter berdasarkan user_id
        const response = await this.$axios.$get(
          `/bookings?user_id=${userId}&with_relations=true`
        );
        this.bookings = response.data.data;
      } catch (e) {
        this.error =
          e.response?.data?.message ||
          e.message ||
          "Terjadi kesalahan saat memuat riwayat booking.";
        console.error("Error fetching my bookings:", e);
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
