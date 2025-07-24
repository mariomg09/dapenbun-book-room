<template>
  <div class="container mx-auto p-4">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Buat Booking Baru</h2>
    <BookingForm @formSubmitted="bookingCreated" />
  </div>
</template>

<script>
import BookingForm from "~/components/bookings/BookingForm.vue";

export default {
  name: "CreateBookingPage",
  layout: "default",
  middleware: ["auth"],

  head() {
    return {
      title: "Buat Booking Baru",
    };
  },

  components: {
    BookingForm,
  },

  methods: {
    bookingCreated() {
      alert("Booking berhasil dibuat dan menunggu persetujuan!");
      this.$router.push("/my-bookings");
    },
  },
};
</script>

<style scoped>
/* Styling khusus halaman */
</style>
