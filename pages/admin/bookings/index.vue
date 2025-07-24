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

export default {
  name: "GeneralBookingsIndexPage",
  layout: "default",
  middleware: ["auth"],

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
      currentPage: 1,
      perPage: 10,
      totalPages: 1,
      totalItems: 0,

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
        const params = {
          page: this.currentPage,
          per_page: this.perPage,
        };
        const response = await this.$axios.$get(
          "/bookings?with_relations=true",
          { params }
        );

        this.bookings = response.data.data;
        this.currentPage = response.data.current_page;
        this.perPage = response.data.per_page;
        this.totalPages = response.data.last_page;
        this.totalItems = response.data.total;
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
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchBookings();
      }
    },

  },
};
</script>

<style scoped>
/* Styling khusus komponen ini */
</style>
