<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Detail/Edit Booking</h2>
    <div v-if="loading" class="text-center text-gray-600">
      Memuat data booking...
    </div>
    <div v-else-if="error" class="text-center text-red-600">
      Gagal memuat booking: {{ error }}
    </div>
    <div v-else>
      <BookingForm :booking="booking" @formSubmitted="bookingUpdated" />
    </div>
  </div>
</template>

<script>
import BookingForm from "~/components/bookings/BookingForm.vue"; // Import komponen form

export default {
  name: "BookingDetailPage",
  layout: "default",
  middleware: ["auth"], // Membutuhkan autentikasi

  head() {
    return {
      title: "Detail Booking",
    };
  },

  components: {
    BookingForm,
  },

  data() {
    return {
      booking: null,
      loading: true,
      error: null,
    };
  },

  async fetch() {
    this.loading = true;
    this.error = null;
    try {
      // Panggil API GET /api/bookings/{id} dengan with_relations=true
      const response = await this.$axios.$get(
        `/bookings/${this.$route.params.id}?with_relations=true`
      );
      this.booking = response.data; // Pastikan struktur respons sesuai
    } catch (e) {
      this.error =
        e.response?.data?.message ||
        e.message ||
        "Terjadi kesalahan saat memuat data booking.";
      console.error("Error fetching booking detail:", e);
      this.booking = null; // Reset jika ada error
    } finally {
      this.loading = false;
    }
  },

  methods: {
    bookingUpdated() {
      alert("Booking berhasil diperbarui!");
      this.$router.push("/my-bookings"); // Redirect kembali ke riwayat booking
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
